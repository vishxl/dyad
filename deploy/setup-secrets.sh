#!/usr/bin/env bash
# Generates deploy/env from env.template with fresh secrets, on the VM.
# Run once: bash deploy/setup-secrets.sh <public-hostname>
# Idempotent: never overwrites an existing deploy/env.
set -euo pipefail

HOSTNAME_ARG="${1:?Usage: setup-secrets.sh <public-hostname> (e.g. 123-45-67-89.sslip.io)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/env"

if [ -f "$ENV_FILE" ]; then
  echo "deploy/env already exists — leaving it untouched." >&2
  exit 0
fi

if ! command -v openssl >/dev/null; then
  echo "openssl not found" >&2
  exit 1
fi

RPC_TOKEN="$(openssl rand -hex 24)"
COOKIE_SECRET="$(openssl rand -base64 32)"

sed -e "s|YOUR-VM-IP-WITH-DASHES.sslip.io|${HOSTNAME_ARG}|g" \
    -e "s|REPLACE_ME|${RPC_TOKEN}|" \
    "${SCRIPT_DIR}/env.template" > "$ENV_FILE"
chmod 600 "$ENV_FILE"

# Also write the oauth2-proxy cookie secret where its config expects it.
printf 'cookie_secret = "%s"\n' "$COOKIE_SECRET" > "${SCRIPT_DIR}/oauth2-cookie-secret.inc"
chmod 600 "${SCRIPT_DIR}/oauth2-cookie-secret.inc"

echo "Wrote ${ENV_FILE} and oauth2-cookie-secret.inc."
echo "RPC token (needed for curl probes):"
echo "  ${RPC_TOKEN}"