#!/usr/bin/env bash

set -euo pipefail

BENCH_DIR=${BENCH_DIR:-/home/frappe/frappe-bench}
cd "${BENCH_DIR}"

echo "[migrate-all] enabling maintenance and pausing scheduler"
bench --site all set-config -p maintenance_mode 1
bench --site all set-config -p pause_scheduler 1

echo "[migrate-all] running migrations"
bench --site all migrate

echo "[migrate-all] disabling maintenance and resuming scheduler"
bench --site all set-config -p maintenance_mode 0
bench --site all set-config -p pause_scheduler 0

echo "[migrate-all] done"


