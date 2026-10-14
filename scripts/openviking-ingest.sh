#!/usr/bin/env bash
# Ingest a local docs directory into a local OpenViking server as a resource.
#
# Usage: scripts/openviking-ingest.sh <docs-dir> <viking-uri>
# e.g.:  scripts/openviking-ingest.sh context/nextbillion-docs viking://resources/nextbillion-docs
#
# Requires: curl, zip, an OpenViking server on $OPENVIKING_URL (default
# http://127.0.0.1:1933). Optional: OPENVIKING_API_KEY (sent as X-API-Key).
set -euo pipefail

DIR="${1:?usage: openviking-ingest.sh <docs-dir> <viking-uri>}"
URI="${2:?usage: openviking-ingest.sh <docs-dir> <viking-uri>}"
BASE="${OPENVIKING_URL:-http://127.0.0.1:1933}"
AUTH=()
if [[ -n "${OPENVIKING_API_KEY:-}" ]]; then
  AUTH=(-H "X-API-Key: $OPENVIKING_API_KEY")
fi

TMP=$(mktemp /tmp/viking-ingest.XXXXXX)
trap 'rm -f "$TMP"' EXIT
mv "$TMP" "$TMP.zip"
TMP="$TMP.zip"
rm -f "$TMP"
cd "$DIR" && zip -qr "$TMP" . -x ".DS_Store"

TEMP_ID=$(curl -sf "${AUTH[@]+${AUTH[@]}}" -F "file=@$TMP" "$BASE/api/v1/resources/temp_upload" \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["result"]["temp_file_id"])')

TASK=$(curl -sf "${AUTH[@]+${AUTH[@]}}" -H "Content-Type: application/json" \
  -d "{\"temp_file_id\": \"$TEMP_ID\", \"to\": \"$URI\", \"wait\": true, \"timeout\": 1800}" \
  "$BASE/api/v1/resources")

echo "$TASK" | python3 -c 'import json,sys; r=json.load(sys.stdin)["result"]; print("root:", r.get("root_uri"), "| contexts:", r.get("context_count"))'
