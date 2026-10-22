#!/usr/bin/env bash
# One-time provisioning for the Oracle Cloud ARM VM (Ubuntu 24.04, aarch64).
# Run as a sudo-capable user: bash deploy/provision-vm.sh <public-hostname>
# See context/dyad-web-deployment.md for the full runbook.
set -euo pipefail

HOSTNAME_ARG="${1:?Usage: provision-vm.sh <public-hostname> (e.g. 123-45-67-89.sslip.io)}"
APP_DIR="/opt/dyad/app"

# ── Packages ─────────────────────────────────────────────────────────────────
apt-get update -qq
apt-get install -y -qq git curl build-essential python3 caddy

# Node 24 (project engines: >=24 <26)
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 24 ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y -qq nodejs
fi

# oauth2-proxy binary
if ! command -v oauth2-proxy >/dev/null; then
  O2P_VERSION="v7.9.0"
  curl -fsSL "https://github.com/oauth2-proxy/oauth2-proxy/releases/download/${O2P_VERSION}/oauth2-proxy-linux-arm64.tar.gz" \
    | tar -xz -C /usr/local/bin --strip-components=1 oauth2-proxy-${O2P_VERSION#v}.linux-arm64/oauth2-proxy \
    || { echo "oauth2-proxy download failed — fetch the arm64 release manually"; exit 1; }
fi

# ── App checkout ─────────────────────────────────────────────────────────────
mkdir -p /opt/dyad
id -u dyad >/dev/null 2>&1 || useradd -r -m -d /opt/dyad -s /bin/bash dyad
if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch web-deploy <YOUR-FORK-URL> "$APP_DIR"
fi
chown -R dyad:dyad /opt/dyad

# ── App dependencies (native modules build for arm64 under Node 24) ──────────
sudo -u dyad bash -lc "cd $APP_DIR && npm install --ignore-scripts && npm rebuild better-sqlite3 dugite && npm --prefix testing/fake-llm-server install"

# ── Secrets + configs ────────────────────────────────────────────────────────
sudo -u dyad bash "$APP_DIR/deploy/setup-secrets.sh" "$HOSTNAME_ARG"

# Caddyfile: fill in the hostname
sudo -u dyad sed "s|<HOST>|$HOSTNAME_ARG|g" "$APP_DIR/deploy/Caddyfile" > /etc/caddy/Caddyfile
# oauth2-proxy.cfg: fill in the hostname (client id/secret still need manual edit)
sudo -u dyad sed -i "s|HOST|$HOSTNAME_ARG|g" "$APP_DIR/deploy/oauth2-proxy.cfg"

# ── Services ─────────────────────────────────────────────────────────────────
cp "$APP_DIR/deploy/dyad-web.service" "$APP_DIR/deploy/oauth2-proxy.service" "$APP_DIR/deploy/openviking.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now caddy

echo
echo "Remaining manual steps:"
echo "  1. Edit $APP_DIR/deploy/oauth2-proxy.cfg — Google OAuth client id/secret"
echo "     (redirect URI: https://$HOSTNAME_ARG/oauth2/callback)"
echo "  2. systemctl enable --now oauth2-proxy dyad-web openviking"
echo "  3. Verify: curl -sI https://$HOSTNAME_ARG/ | head -1   (expect 302 to Google)"