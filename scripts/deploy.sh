#!/usr/bin/env bash
# Deploy Iconic Rome Tours to the VPS: sync sources, rebuild images, restart containers.
# Usage: ./scripts/deploy.sh          (reads VPS_PASS from repo-root .env)
#    or: VPS_PASS='...' ./scripts/deploy.sh
set -euo pipefail

VPS_HOST="${VPS_HOST:-130.185.118.24}"
VPS_USER="${VPS_USER:-root}"
REMOTE_DIR="${REMOTE_DIR:-/root/iconic-rome-tickets}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Fall back to VPS_PASS from the local .env (gitignored, never synced).
if [ -z "${VPS_PASS:-}" ] && [ -f "$ROOT_DIR/.env" ]; then
  VPS_PASS="$(grep -E '^VPS_PASS=' "$ROOT_DIR/.env" | head -1 | cut -d= -f2-)"
fi

if [ -z "${VPS_PASS:-}" ]; then
  echo "Set VPS_PASS env var, or add VPS_PASS=... to the repo-root .env." >&2
  exit 1
fi

SSH="sshpass -p $VPS_PASS ssh -o StrictHostKeyChecking=accept-new $VPS_USER@$VPS_HOST"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Syncing sources to $VPS_HOST:$REMOTE_DIR"
sshpass -p "$VPS_PASS" rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .turbo --exclude .git \
  --exclude .env --exclude 'data/*.db*' --exclude data/uploads \
  -e "ssh -o StrictHostKeyChecking=accept-new" \
  "$ROOT/" "$VPS_USER@$VPS_HOST:$REMOTE_DIR/"

echo "==> Ensuring .env with JWT_SECRET + ADMIN_PASSWORD exists on server"
$SSH "cd $REMOTE_DIR && mkdir -p data/uploads && touch .env \
  && { grep -q '^JWT_SECRET=' .env || echo JWT_SECRET=\$(openssl rand -hex 32) >> .env; } \
  && { grep -q '^ADMIN_PASSWORD=' .env || echo ADMIN_PASSWORD=\$(openssl rand -hex 8) >> .env; }"

echo "==> Building and starting containers"
$SSH "cd $REMOTE_DIR && docker compose up -d --build"

echo "==> Status"
$SSH "cd $REMOTE_DIR && docker compose ps"
echo "Done. Landing: http://$VPS_HOST:5000  Admin: http://$VPS_HOST:8000"
