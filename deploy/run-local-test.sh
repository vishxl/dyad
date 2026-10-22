#!/usr/bin/env bash
# Local end-to-end test of the hosted-deployment topology (no TLS, no auth gate):
#   Caddy :8443  →  headless server :3100 + Vite renderer :4183
# with /preview/<port> placeholder routing — the production shape minus TLS/SSO.
# Usage: bash deploy/run-local-test.sh   (from the repo root of the web-deploy worktree)
set -euo pipefail
cd "$(dirname "$0")/.."

# Project engines require Node >=24 <26 (system node may be 20).
if ! command -v node >/dev/null || [ "$(node -v | cut -c2-3)" -lt 24 ]; then
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    nvm use 24 >/dev/null
  else
    echo "Node >=24 required; nvm not found" >&2
    exit 1
  fi
fi

export DYAD_RPC_TOKEN=testtoken123
export DYAD_HEADLESS_PORT=3100
export DYAD_HEADLESS_VITE_PORT=4183
export DYAD_RPC_ALLOWED_ORIGINS="http://127.0.0.1:8443,http://localhost:8443,http://127.0.0.1:4183,http://localhost:4183"
export DYAD_VITE_ALLOWED_HOSTS="127.0.0.1:8443,localhost:8443"
# NOTE: preview URLs MUST use the same host you sign in on (localhost, per
# redirect_url in the oauth2 cfg) — localhost and 127.0.0.1 are different
# sites to the browser, so a 127.0.0.1 iframe would not get the session cookie.
export VITE_PREVIEW_URL_TEMPLATE="http://localhost:8443/preview/{port}"
export DYAD_PREVIEW_PUBLIC_URL_BASE="http://localhost:8443/preview"
export DYAD_DATA_DIR="${DYAD_DATA_DIR:-/tmp/dyad-deploy-test}"

echo "Starting headless:browser (server :3100 + Vite :4183), log: /tmp/dyad-deploy-stack.log"
npm run headless:browser > /tmp/dyad-deploy-stack.log 2>&1 &
STACK_PID=$!
echo "stack pid: $STACK_PID"

sleep 2
echo "Starting Caddy :8443, log: /tmp/dyad-caddy-test.log"
caddy run --config .claude/tmp/Caddyfile.local-test > /tmp/dyad-caddy-test.log 2>&1 &
CADDY_PID=$!
echo "caddy pid: $CADDY_PID"

echo
echo "Test entry point: http://localhost:8443  (x-dyad-rpc-token: testtoken123)"
echo "Stop: kill $STACK_PID $CADDY_PID"