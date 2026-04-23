#!/usr/bin/env bash
# Upsert Supabase anon key into vault.secrets as 'supabase_anon_key'.
# Run before `supabase db push` so pg_cron jobs can read it at runtime.
#
# Required env: PROJECT_ID, SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN is required}"
: "${SUPABASE_DB_PASSWORD:?SUPABASE_DB_PASSWORD is required}"

ANON_KEY=$(
  supabase projects api-keys --project-ref "$PROJECT_ID" --output json \
    | jq -r '.[] | select(.name == "anon") | .api_key'
)

if [[ -z "$ANON_KEY" || "$ANON_KEY" == "null" ]]; then
  echo "Failed to fetch anon key from Supabase Management API" >&2
  exit 1
fi

DATABASE_URL="postgresql://postgres:${SUPABASE_DB_PASSWORD}@db.${PROJECT_ID}.supabase.co:5432/postgres"
SQL_FILE="$(dirname "$0")/upsert-vault-secret.sql"

PGPASSWORD="$SUPABASE_DB_PASSWORD" psql "$DATABASE_URL" \
  --set=ON_ERROR_STOP=1 \
  --set="anon_key=$ANON_KEY" \
  --file="$SQL_FILE"
