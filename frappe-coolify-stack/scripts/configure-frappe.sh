#!/usr/bin/env bash

set -euo pipefail

BENCH_DIR=${BENCH_DIR:-/home/frappe/frappe-bench}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
REDIS_HOST=${REDIS_HOST:-redis}
REDIS_PORT=${REDIS_PORT:-6379}
# Try to infer socketio port from Coolify if provided; default to 9000
SOCKETIO_PORT=${SOCKETIO_PORT:-${SERVICE_PORT_APP_9000:-9000}}

echo "[configure-frappe] bench dir: ${BENCH_DIR}"
echo "[configure-frappe] waiting for db ${DB_HOST}:${DB_PORT} and redis ${REDIS_HOST}:${REDIS_PORT}"
wait-for-it -t 120 "${DB_HOST}:${DB_PORT}"
wait-for-it -t 120 "${REDIS_HOST}:${REDIS_PORT}"

cd "${BENCH_DIR}"

echo "[configure-frappe] writing common_site_config.json via bench set-config"
bench set-config -g db_host "${DB_HOST}"
bench set-config -gp db_port "${DB_PORT}"
bench set-config -g redis_cache "redis://${REDIS_HOST}:${REDIS_PORT}"
bench set-config -g redis_queue "redis://${REDIS_HOST}:${REDIS_PORT}"
bench set-config -g redis_socketio "redis://${REDIS_HOST}:${REDIS_PORT}"
bench set-config -gp socketio_port "${SOCKETIO_PORT}"

echo "[configure-frappe] done"


