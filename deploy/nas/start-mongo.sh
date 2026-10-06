#!/bin/sh
set -eu
mkdir -p /tmp/tls
cp /run/tls/server.pem /tmp/tls/server.pem
chown "$(id -u mongodb):$(id -g mongodb)" /tmp/tls /tmp/tls/server.pem
chmod 700 /tmp/tls
chmod 600 /tmp/tls/server.pem
exec /usr/local/bin/docker-entrypoint.sh "$@"
