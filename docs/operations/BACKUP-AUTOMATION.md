# Automated control-plane backup / Sao lưu tự động nền tảng

## Scope / Phạm vi

This companion container backs up DataCloud's authoritative PostgreSQL database
and recovery configuration, including the vault key ring needed to decrypt saved
connection credentials. It does **not** back up data inside customer MongoDB,
Atlas, DocumentDB or other connected servers. The provider Backups page must keep
that distinction; this service does not make an unsupported provider supported.

Container này sao lưu PostgreSQL nội bộ DataCloud, cấu hình triển khai và các khóa
cần thiết để giải mã thông tin kết nối. Dữ liệu trong database của khách hàng
không thuộc bản sao lưu này. Không được đổi trạng thái Backups của nhà cung cấp
thành “hỗ trợ” chỉ vì đã bật dịch vụ này.

## Defaults and safety / Mặc định và bảo vệ

- Run immediately at first startup, then every 24 hours; retain the latest 14
  verified artifacts. Restart resumes the schedule from the last success.
- Every archive is authenticated and encrypted using `age`; database contents,
  configuration and secrets are never stored in a plaintext persistent volume.
  Plaintext intermediate files and the restored cluster exist only in `/tmp` tmpfs.
- Before publishing a backup as verified, decrypt it, check its manifest hashes,
  and restore it into a fresh PostgreSQL cluster in the same container. This
  cluster has **no TCP listener**, only a fresh private Unix socket. It never
  connects to, overwrites, or replaces the running source database.
- Require `cp_projects` and `cp_connections` and read all restored public tables.
  This proves PostgreSQL restoration and recovery-file integrity. It does not
  prove a complete application boot, OAuth/SMTP reconfiguration, vault decryption
  of each saved credential, or third-party database access after a disaster.
- Failed runs never prune previous backups. Retention removes only regular files
  matching this service's exact versioned artifact naming pattern. Locking prevents
  overlapping runs. A failed run sets container health to unhealthy immediately;
  a missing/old receipt also fails health. Retry after five minutes.
- No Docker socket, published port, root process or application API exposure.
  Production source connections require PostgreSQL TLS hostname verification.
- The final companion image ships compiled Python bytecode only. A separate build
  stage compiles the private source; the final stage copies only `backup.pyc`, so
  its source is absent from both final filesystem and final image layers. Python
  bytecode is reversible and does not provide source encryption or a guarantee
  against reverse engineering; the proprietary license remains applicable.
- A copied recovery key is essential. Keep an offline copy outside the NAS and
  never commit it or bundle it inside an archive. The key remains mounted locally
  to perform automatic restore drills; NAS/host compromise can therefore access
  it. Encryption protects stolen archives, not a fully compromised running host.
- The archive does not include certificate-authority private keys or TLS volume
  contents. Regenerate the deployment CA/certificates when recovering, and update
  trust where necessary. Existing OAuth, SMTP and tunnel secrets are included when
  present in the mounted secret directory.

Mỗi ngày tạo một bản mã hóa và tự khôi phục thử trong PostgreSQL tạm thời; giữ
14 bản đã kiểm tra. Lỗi kiểm tra giữ nguyên các bản cũ. Khóa khôi phục phải có
bản sao ngoại tuyến. Đây là kiểm tra phục hồi dữ liệu/cấu hình, chưa phải diễn tập
khởi động lại toàn bộ website và các tích hợp bên ngoài.

## Enable on a private deployment / Bật trên bản triển khai riêng

1. Build the companion image from the private source repository:

   ```sh
   docker build -f deploy/backup/Dockerfile -t datacloud-backup:local .
   ```

   Public Docker-only distribution needs a separately reviewed/published
   multiarchitecture image. Set `BACKUP_IMAGE` to its immutable tag or digest and
   remove the overlay's `build` section in the exported deployment bundle. Do not
   distribute application source. No image has been published by these scripts.

2. Run `BACKUP_IMAGE=datacloud-backup:local sh prepare-backup.sh` from the private
   NAS deployment directory. It generates `backup-key/identity.txt` only if absent,
   validates and preserves an existing key, and refuses an invalid existing key.
   Save a private recovery copy **outside the NAS**. Keep this key outside
   `secrets/`; an age secret key in that directory is rejected.

3. The helper copies active `compose.yaml`, optional overlay files, `.env`,
   `nginx.conf` and startup scripts into a new private `backup-inputs` snapshot.
   Only the explicit `CONFIG_FILES` allowlist is archived. All regular files in
   `secrets/` are copied. An atomic `current` link selects the completed snapshot;
   one previous helper-created snapshot is retained for rollback.
   Required nonempty files are `vault_keys`, `database_url`, `postgres_password`
   and `owner_config`. Maintain old vault keys until their encrypted records have
   been migrated; do not rotate/delete keys concurrently with a backup.

4. The helper owns only its new key/snapshot copies as UID/GID `999:999`, with
   directory 0700/file 0600. Original configuration and secret file permissions
   are unchanged. It runs a short-lived root helper with no network or Docker
   socket; only `backup-key` and `backup-inputs` are writable. The long-running
   backup remains non-root. Stop the backup service before re-running setup after
   each deployment/secret change, then restart it; snapshots are not live mirrors.
   Do not rotate secrets during setup. Same-snapshot consistency is ensured by
   this operator sequence, not by an application-wide database/key transaction.
   Never make secret files world-readable. The fresh backup named volume is
   initialized with the image's postgres-owned `/backups` directory.

5. Add `compose.backup.yaml` to the **existing project's full compose file set**,
   preserve its project name, then enable the backup profile:

   ```sh
   docker compose -f compose.yaml -f compose.backup.yaml --profile backup up -d backup
   docker compose -f compose.yaml -f compose.backup.yaml --profile backup logs backup
   ```

   Include all integration/external/Synology overlays used by that deployment.
   The example alone is not a replacement for an existing composed stack.
   DSM single-file projects need the service merged into their prepared standalone
   YAML by the deployment operator. Do not replace their running files blindly.

6. Check `status.json` in the private `control_plane_backups` volume. Require
   `status: verified`, the expected scope, a recent completion and a healthy
   container. The first run must complete on the real NAS before claiming the
   automatic backup is operational. Copy encrypted artifacts to another device
   or trusted backup destination; a same-NAS volume cannot survive loss of the NAS.

Default scratch tmpfs is 2 GiB, memory cap 3 GiB. Encryption, decryption and a
restored cluster coexist during verification, so allow several times the database
size and test capacity. Files larger than available scratch space fail safely;
raise limits deliberately for larger stores. Default uncompressed archive size
limit is 4 GiB. Set `BACKUP_CPUS=0` on Synology kernels without the CPU CFS
scheduler (memory limits remain active). The image uses PostgreSQL 17 tools and
must be upgraded with the source PostgreSQL major version. AMD64 has a real
Docker integration test; the real NAS still requires deployment verification.

## Reverify an existing archive / Kiểm tra lại bản lưu

Use an isolated container, without any network or live database mount:

```sh
docker run --rm --network none --read-only --cap-drop ALL \
  --security-opt no-new-privileges --tmpfs /tmp:size=2g,mode=1777 \
  --mount type=bind,source=/absolute/backup-key,target=/run/backup-key,readonly \
  --mount type=bind,source=/absolute/encrypted-backups,target=/archives,readonly \
  datacloud-backup:local verify /archives/EXACT-ARTIFACT-NAME.tar.age
```

Actual disaster recovery is deliberate: decrypt to a private staging location,
restore the database into a **new** PostgreSQL deployment, restore the matching
vault/config files, regenerate TLS certificates, disable email/payment workers,
validate data and authentication, then switch traffic. This service never performs
an automatic production restore or overwrites the live database.

## Verification / Kiểm thử

Run from the source repository with Docker Desktop or a Docker Linux engine:

```sh
node scripts/backup-test.mjs
```

This builds the image, runs unit safety checks, creates a synthetic PostgreSQL
fixture, backs it up and restores it, corrupts an encrypted archive to verify
authentication failure, removes a required fixture table to verify failure
preserves old backups, and checks the source fixture's data remains intact.
Test resources have randomized names and are removed after execution. No live
NAS settings, data or secrets are used. The dedicated suite is separate from
the Node/TypeScript application suite; CI must invoke it explicitly.

Recorded local verification (2026-10-06): the full suite passed on native AMD64
and on an ARM64 companion image under Docker Desktop emulation (7 unit safety
checks, real encrypted dump/restore, offline verification and failure tests).
The source fixture PostgreSQL ran on the native host architecture; restoration
ran inside the selected companion image. This is not a native ARM NAS test.
The setup helper's body was exercised three times against synthetic tmpfs inputs:
the key stayed identical, only two snapshots remained, new secret copies were
UID999/mode0600, source ownership stayed unchanged, and an invalid existing key
was rejected without replacement. Shell syntax and combined Compose validation
passed. Actual NAS installation and off-device archive copying remain deployment
steps.
