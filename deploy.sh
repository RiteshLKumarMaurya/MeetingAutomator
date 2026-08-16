#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/meetingautomator"
APP_NAME="meetingautomator"
PORT="${PORT:-3001}"

cd "$APP_DIR"

echo "==> Updating source"
git pull origin main

echo "==> Installing dependencies"
npm ci

echo "==> Building production bundle"
npm run build

echo "==> Starting/restarting PM2"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT="$PORT" pm2 restart "$APP_NAME" --update-env
else
  PORT="$PORT" pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save

echo "==> Checking Next.js on port $PORT"
for i in {1..20}; do
  if curl -fsS "http://127.0.0.1:$PORT" >/dev/null; then
    echo "Next.js is responding on port $PORT."
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "ERROR: Next.js did not become ready on port $PORT." >&2
    pm2 logs "$APP_NAME" --lines 80 --nostream || true
    exit 1
  fi
  sleep 1
done

echo "==> Validating Nginx"
nginx -t
systemctl reload nginx

echo
echo "Deployment complete."
pm2 status
echo
echo "Local check:"
curl -I "http://127.0.0.1:$PORT" | head -n 5
