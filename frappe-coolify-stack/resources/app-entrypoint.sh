#!/usr/bin/env bash

set -euo pipefail

BENCH_DIR=${BENCH_DIR:-/home/frappe/frappe-bench}

RUN_CONFIGURE=${RUN_CONFIGURE:-1}
RUN_CREATE_SITE=${RUN_CREATE_SITE:-0}
RUN_MIGRATE=${RUN_MIGRATE:-1}

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
REDIS_HOST=${REDIS_HOST:-redis}
REDIS_PORT=${REDIS_PORT:-6379}

echo "[entrypoint] waiting for services: db ${DB_HOST}:${DB_PORT}, redis ${REDIS_HOST}:${REDIS_PORT}"
wait-for-it -t 180 "${DB_HOST}:${DB_PORT}"
wait-for-it -t 180 "${REDIS_HOST}:${REDIS_PORT}"

if [ "${RUN_CONFIGURE}" = "1" ]; then
  echo "[entrypoint] running configure-frappe"
  configure-frappe || echo "[entrypoint] configure-frappe failed (continuing)."
fi

if [ "${RUN_CREATE_SITE}" = "1" ]; then
  echo "[entrypoint] running create-site"
  create-site || echo "[entrypoint] create-site failed (continuing)."
fi

if [ "${RUN_MIGRATE}" = "1" ]; then
  echo "[entrypoint] running migrate-all"
  migrate-all || echo "[entrypoint] migrate-all failed (continuing)."
fi

echo "[entrypoint] starting nginx"
/usr/local/bin/nginx-entrypoint.sh &

echo "[entrypoint] starting app"
exec "$@"


