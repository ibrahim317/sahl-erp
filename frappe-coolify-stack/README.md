Single Site Frappe Setup

A minimal setup to run Frappe in Docker with custom apps via `apps.json`.

Requirements
- Docker 24+
- Docker Compose V2

Quick start
```bash
# start the stack
docker compose up -d

# view logs
docker compose logs -f
```

Apps management
- Define apps and branches in `apps.json`.
- Rebuild and restart after changes:
```bash
docker compose up -d
```

Update apps
```bash
scripts/check-app-updates.sh
```

Files
- compose.yml: services and volumes
- Dockerfile: image build for bench/site
- apps.json: list of apps to include
- resources/: nginx template and entrypoint
- scripts/: helper scripts

Common commands
```bash
# open bench container shell
docker compose exec app bash

# list running containers
docker compose ps

# stop and remove
docker compose down
```

Notes
- Data persists in Docker volumes defined in `compose.yml`.
- On first run, a default site is created during build.

Runtime helpers
```bash
# configure frappe from env (DB/Redis/socketio)
docker compose run --rm app bash -lc 'configure-frappe'

# create a site (pass secrets via env)
docker compose run --rm \
  -e SITE_NAME=$SERVICE_FQDN_APP \
  -e ADMIN_PASSWORD=$SERVICE_PASSWORD_CREATESITE \
  -e DB_ROOT_PASSWORD=$SERVICE_PASSWORD_MARIADBROOT \
  app bash -lc 'create-site'

# run migrations across all sites
docker compose run --rm app bash -lc 'migrate-all'
```

App entrypoint (automatic setup)
- The `app` container runs an entrypoint that can optionally run the helpers before starting the server.
- Control via env vars:
  - `RUN_CONFIGURE` (default `1`)
  - `RUN_CREATE_SITE` (default `0`) – requires `SITE_NAME`, `ADMIN_PASSWORD`, `DB_ROOT_PASSWORD`
  - `RUN_MIGRATE` (default `1`)

Environment variables respected by helpers
- `DB_HOST` (default `db`)
- `DB_PORT` (default `3306`)
- `REDIS_HOST` (default `redis`)
- `REDIS_PORT` (default `6379`)
- `SOCKETIO_PORT` (default `9000`)
- `SITE_NAME`, `ADMIN_PASSWORD`, `DB_ROOT_PASSWORD` (required for create-site)

Coolify integration
- Helpers also recognize Coolify magic envs when present:
  - `SERVICE_FQDN_APP` → used as fallback for `SITE_NAME`
  - `SERVICE_PASSWORD_CREATESITE` → fallback for `ADMIN_PASSWORD`
  - `SERVICE_PASSWORD_MARIADBROOT` → fallback for `DB_ROOT_PASSWORD`
  - `SERVICE_PORT_APP_9000` → fallback for `SOCKETIO_PORT`
