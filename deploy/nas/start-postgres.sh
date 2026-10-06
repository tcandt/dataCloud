#!/bin/sh
set -eu
mkdir -p /tmp/tls
cp /run/tls/server.key /tmp/tls/server.key
chown "$(id -u postgres):$(id -g postgres)" /tmp/tls /tmp/tls/server.key
chmod 700 /tmp/tls
chmod 600 /tmp/tls/server.key
exec /usr/local/bin/docker-entrypoint.sh "$@"
