#!/usr/bin/env bash
# Upsert the Supabase anon key into vault.secrets as 'supabase_anon_key'.
# Uses the Supabase Management API /database/query endpoint so no direct
# Postgres connection is required (works over IPv4 / HTTPS only).
#
# Required env: PROJECT_ID, SUPABASE_ACCESS_TOKEN
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN is required}"

ANON_KEY=$(
  supabase projects api-keys --project-ref "$PROJECT_ID" --output json \
    | jq -r '.[] | select(.name == "anon") | .api_key'
)

if [[ -z "$ANON_KEY" || "$ANON_KEY" == "null" ]]; then
  echo "Failed to fetch anon key from Supabase Management API" >&2
  exit 1
fi

# SQL template uses psql-style :'anon_key' placeholder so the same file works
# locally with `psql --set`. For the API path we substitute it with a
# single-quote-escaped SQL literal.
SQL_FILE="$(dirname "$0")/upsert-vault-secret.sql"
ESCAPED_KEY=${ANON_KEY//\'/\'\'}
SQL=$(sed "s|:'anon_key'|'${ESCAPED_KEY}'|g" "$SQL_FILE")

PAYLOAD=$(jq -nc --arg q "$SQL" '{query: $q}')

curl -fsSL -X POST \
  "https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query" \
  -H "Authorization: Bearer ${SUPABASE_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  --data "$PAYLOAD" >/dev/null

echo "Vault secret 'supabase_anon_key' upserted."
