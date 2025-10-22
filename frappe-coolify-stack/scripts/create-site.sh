#!/usr/bin/env bash

set -euo pipefail

BENCH_DIR=${BENCH_DIR:-/home/frappe/frappe-bench}
# Prefer explicit vars but fall back to Coolify's magic envs when present
SITE_NAME=${SITE_NAME:-${SERVICE_FQDN_APP:-}}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-${SERVICE_PASSWORD_CREATESITE:-}}
DB_ROOT_USERNAME=${DB_ROOT_USERNAME:-root}
DB_ROOT_PASSWORD=${DB_ROOT_PASSWORD:-${SERVICE_PASSWORD_MARIADBROOT:-}}

if [ -z "${SITE_NAME}" ]; then
  echo "SITE_NAME is required" >&2
  exit 1
fi
if [ -z "${ADMIN_PASSWORD}" ]; then
  echo "ADMIN_PASSWORD is required" >&2
  exit 1
fi
if [ -z "${DB_ROOT_PASSWORD}" ]; then
  echo "DB_ROOT_PASSWORD is required" >&2
  exit 1
fi

cd "${BENCH_DIR}"

echo "[create-site] creating site ${SITE_NAME}"
bench new-site \
  --mariadb-user-host-login-scope='%' \
  --admin-password="${ADMIN_PASSWORD}" \
  --db-root-username="${DB_ROOT_USERNAME}" \
  --db-root-password="${DB_ROOT_PASSWORD}" \
  --set-default "${SITE_NAME}"

# Determine which apps to install: prefer explicit INSTALL_APPS; fallback to sites/apps.txt
APPS_FILE="${BENCH_DIR}/sites/apps.txt"
declare -a APPS_TO_INSTALL=()

# If INSTALL_APPS is provided, parse it (supports space or comma separation)
if [ -n "${INSTALL_APPS:-}" ]; then
  IFS=', ' read -r -a APPS_TO_INSTALL <<< "${INSTALL_APPS}"
elif [ -f "${APPS_FILE}" ]; then
  # Read non-empty, non-comment lines from apps.txt
  while IFS= read -r app; do
    # Skip empty lines and comments
    if [ -z "${app}" ] || [[ "${app}" =~ ^# ]]; then
      continue
    fi
    # Skip core frappe which is always present
    if [ "${app}" = "frappe" ]; then
      continue
    fi
    APPS_TO_INSTALL+=("${app}")
  done < "${APPS_FILE}"
fi

# Install each app for the created site
if [ ${#APPS_TO_INSTALL[@]} -gt 0 ]; then
  echo "[create-site] installing apps: ${APPS_TO_INSTALL[*]}"
  for app in "${APPS_TO_INSTALL[@]}"; do
    bench --site "${SITE_NAME}" install-app "${app}"
  done
fi

echo "[create-site] done"


