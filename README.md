# Iconic Rome Tickets

Monorepo for iconicrometours.com — a Rome tours & tickets booking platform.
Duplicate of the previous City Rome Tickets project, rebuilt fully on Next.js
(frontend **and** backend — no Django).

## Layout

```
apps/web      Landing website (Next.js, port 5000) — iconicrometours.com
apps/admin    Admin panel / CRM (Next.js, port 8000) — panel.iconicrometours.com
packages/db   Shared Prisma + SQLite data layer, JWT auth, serializers
data/         SQLite database + uploaded images (gitignored)
```

Both apps ship their own API route handlers under `/api/v1/*` (same paths and
JSON shapes as the old Django API) backed by the shared SQLite database.

## Development

```bash
pnpm install
pnpm db:push      # create/update the SQLite schema
pnpm db:seed      # seed tours, dates, time slots, admin user
pnpm --filter web dev     # http://localhost:5000
pnpm --filter admin dev   # http://localhost:8000
```

Admin login is seeded from the `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars
(defaults email to `admin@iconicrometours.com`). On the VPS, deploy.sh
generates these into `.env` on first run — read them with `cat .env` on the
server, and change the password after first login (Settings → users).

## Deployment (VPS 130.185.118.24)

```bash
./scripts/deploy.sh
```

One command: syncs your local changes to the server, rebuilds the Docker
images and restarts the containers. It reads `VPS_PASS` from the repo-root
`.env` (gitignored); you can also pass it inline:
`VPS_PASS='<root password>' ./scripts/deploy.sh`.

The script rsyncs the repo to `/root/iconic-rome-tickets`, then builds and
starts `docker compose` services: `migrate` (db push + seed, runs once),
`web` (port 5000) and `admin` (port 8000). The SQLite DB and uploads live in
`/root/iconic-rome-tickets/data` on the host, shared by both containers, and
survive redeploys (the deploy rsync excludes them).

DNS required: `iconicrometours.com` + `www` + `panel` A records →
`130.185.118.24`. nginx on the host proxies the domains to the two ports
(config in `/etc/nginx/sites-available/` on the server).

`JWT_SECRET` is generated once into `/root/iconic-rome-tickets/.env` on the
server — both apps must share it, don't delete it.
