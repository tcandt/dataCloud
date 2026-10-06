#!/bin/sh
set -eu
cd "$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)"
if [ ! -f .env ] || [ ! -f secrets/owner_config ]; then
  printf '%s\n' 'Run scripts/nas-configure.mjs from the repository root first.' >&2
  exit 1
fi
if [ -s secrets/tunnel_token ]; then
  docker compose --profile tunnel config --quiet
  if [ "${DATACLOUD_NO_PULL:-0}" != 1 ]; then docker compose --profile tunnel pull; fi
  docker compose --profile tunnel up -d --no-build --wait --wait-timeout 180
  docker compose --profile tunnel ps
else
  docker compose config --quiet
  if [ "${DATACLOUD_NO_PULL:-0}" != 1 ]; then docker compose pull; fi
  docker compose up -d --no-build --wait --wait-timeout 180
  docker compose ps
fi
