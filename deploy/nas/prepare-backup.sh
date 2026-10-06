#!/bin/sh
# Explicit operator action. Copies recovery inputs; never changes source permissions.
set -eu
umask 077
deployment_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd -P)
backup_image=${BACKUP_IMAGE:-ghcr.io/tcandt/datacloud-backup:0.1.7}

for directory in secrets backup-key backup-inputs; do
  if [ -L "$deployment_dir/$directory" ]; then
    printf '%s\n' "Refusing symbolic-link directory: $directory" >&2
    exit 1
  fi
done
if [ ! -s "$deployment_dir/compose.yaml" ] || [ ! -d "$deployment_dir/secrets" ]; then
  printf '%s\n' 'Run this from a configured DataCloud deployment with compose.yaml and secrets/.' >&2
  exit 1
fi
mkdir -p "$deployment_dir/backup-key" "$deployment_dir/backup-inputs"

# No network, Docker socket or writable deployment mount. This short-lived root
# helper can read protected source files and owns only the two new output dirs.
docker run --rm -i --network none --read-only --cap-drop ALL \
  --cap-add CHOWN --cap-add DAC_OVERRIDE --cap-add FOWNER \
  --security-opt no-new-privileges --user 0:0 \
  --tmpfs /tmp:size=16m,nosuid,nodev,mode=1777 \
  --mount "type=bind,source=$deployment_dir,target=/deployment,readonly" \
  --mount "type=bind,source=$deployment_dir/backup-key,target=/key" \
  --mount "type=bind,source=$deployment_dir/backup-inputs,target=/inputs" \
  --entrypoint python3 "$backup_image" - <<'PY'
import fcntl
import importlib.util
import os
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
import uuid

spec = importlib.util.spec_from_file_location('backup', '/opt/datacloud/backup.pyc')
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)
os.umask(0o077)
source, outputs, keys = Path('/deployment'), Path('/inputs'), Path('/key')
lock_path = outputs / '.prepare.lock'
fd = os.open(lock_path, os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
with os.fdopen(fd, 'w') as lock:
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    identity = keys / 'identity.txt'
    if identity.is_symlink():
        raise SystemExit('Refusing symbolic-link recovery identity')
    if identity.exists():
        if not identity.is_file() or not identity.stat().st_size:
            raise SystemExit('Existing recovery identity is invalid; it will not be overwritten')
        result = subprocess.run(['age-keygen', '-y', str(identity)], capture_output=True)
        if result.returncode:
            raise SystemExit('Existing recovery identity is invalid; it will not be overwritten')
    else:
        # age-keygen refuses an existing file. Atomic link installs the final path
        # only if absent, including when another process created it concurrently.
        pending = keys / ('pending-' + uuid.uuid4().hex)
        try:
            result = subprocess.run(['age-keygen', '-o', str(pending)], capture_output=True)
            if result.returncode:
                raise SystemExit('Recovery identity generation failed')
            os.link(pending, identity)
        finally:
            pending.unlink(missing_ok=True)
    snapshot = Path(tempfile.mkdtemp(prefix='snapshot-', dir=outputs))
    try:
        backup.copy_recovery_inputs(snapshot, source / 'secrets', source, identity)
        # New copies only. Source configuration/secrets permissions stay unchanged.
        for path in [snapshot, *snapshot.rglob('*')]:
            if path.is_symlink():
                raise SystemExit('Unexpected link in prepared snapshot')
            os.chown(path, 999, 999)
            os.chmod(path, 0o700 if path.is_dir() else 0o600)
        for path in (outputs, keys, identity):
            os.chown(path, 999, 999)
            os.chmod(path, 0o700 if path.is_dir() else 0o600)
        current = outputs / 'current'
        if current.exists() and not current.is_symlink():
            raise SystemExit('Refusing to replace a non-link backup-inputs/current')
        pending_link = outputs / ('current-' + uuid.uuid4().hex)
        pending_link.symlink_to(snapshot.name, target_is_directory=True)
        pending_link.replace(current)
        # Keep one previous snapshot for rollback; prune only helper-owned names.
        previous = sorted((p for p in outputs.iterdir() if p.is_dir() and not p.is_symlink()
                           and re.fullmatch(r'snapshot-[a-z0-9_]{8}', p.name) and p != snapshot),
                          key=lambda p: p.stat().st_mtime, reverse=True)
        for old in previous[1:]:
            if old.parent.resolve() != outputs.resolve():
                raise SystemExit('Unexpected snapshot location')
            shutil.rmtree(old)
    except BaseException:
        # Only remove the newly-created directory if it was never made current.
        current = outputs / 'current'
        if not current.is_symlink() or os.readlink(current) != snapshot.name:
            shutil.rmtree(snapshot)
        raise
print('Recovery inputs prepared. Existing identity preserved; source files unchanged.')
print('Save backup-key/identity.txt OFF THE NAS in a private recovery location.')
print('Refresh with this script after configuration or secret changes; stop the backup service first.')
PY
