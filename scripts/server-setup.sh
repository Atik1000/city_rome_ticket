#!/usr/bin/env bash
# One-time VPS setup for Iconic Rome Tickets (run ON the server as root).
# Installs Docker + nginx, and configures nginx for:
#   iconicrometickets.com / www -> 127.0.0.1:5000   (landing)
#   panel.iconicrometickets.com -> 127.0.0.1:8000   (admin)
set -euo pipefail

echo "==> Installing Docker"
if ! command -v docker >/dev/null; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker

echo "==> Installing nginx"
apt-get update -y
apt-get install -y nginx

echo "==> Writing nginx site configs"
cat > /etc/nginx/sites-available/iconic-web <<'EOF'
server {
    listen 80;
    server_name iconicrometickets.com www.iconicrometickets.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
cat > /etc/nginx/sites-available/iconic-admin <<'EOF'
server {
    listen 80;
    server_name panel.iconicrometickets.com;
    client_max_body_size 20m;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/iconic-web /etc/nginx/sites-enabled/iconic-web
ln -sf /etc/nginx/sites-available/iconic-admin /etc/nginx/sites-enabled/iconic-admin
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> Done."
echo "After DNS A records (@, www, panel) point to this server, enable HTTPS with:"
echo "  apt-get install -y certbot python3-certbot-nginx"
echo "  certbot --nginx -d iconicrometickets.com -d www.iconicrometickets.com -d panel.iconicrometickets.com"
