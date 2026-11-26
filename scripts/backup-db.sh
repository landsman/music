#!/usr/bin/env bash
# Back up the production database with the Supabase CLI: schema and data, as plain SQL.
#
# Usage: scripts/backup-db.sh [out-dir]
#   asks for the Session pooler URI from the dashboard (Connect), unless SUPABASE_DB_URL holds it;
#   the direct host is IPv6 only
#   out-dir  defaults to ~/backups/music, outside the repo so a dump is never committed;
#            each run writes <out-dir>/<UTC time>/schema.sql and data.sql
# Restore into an empty database:
#   psql -v ON_ERROR_STOP=1 --single-transaction -d <uri> -f schema.sql -f data.sql
set -euo pipefail

# The deploy's CLI version (.github/workflows/deploy-supabase.yml). It runs pg_dump in
# Docker at the server's Postgres version, so whatever pg_dump is installed here does not matter.
supabase=(npx --yes supabase@2.24.3)

# Asks only in a terminal: without one, a prompt would wait forever.
if [[ -z "${SUPABASE_DB_URL:-}" && -t 0 ]]; then
  read -rsp "Session pooler URI (Supabase dashboard, Connect): " SUPABASE_DB_URL
  echo >&2
fi
: "${SUPABASE_DB_URL:?set SUPABASE_DB_URL to the Session pooler URI from the Supabase dashboard}"

# A terminal may wrap a paste in bracketed-paste markers, which no tool reads as a URI.
url=${SUPABASE_DB_URL//$'\e[200~'/}
url=${url//$'\e[201~'/}
url=${url//[[:space:]]/}
if [[ ! "$url" =~ ^postgres(ql)?:// ]]; then
  printf 'Expected a postgresql:// URI, got one starting with %q\n' "${url:0:12}" >&2
  exit 1
fi

dir="${1:-$HOME/backups/music}/$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$dir.partial"
# Written under another name first, so a dump that fails halfway never looks finished.
"${supabase[@]}" db dump --db-url "$url" -f "$dir.partial/schema.sql"
"${supabase[@]}" db dump --db-url "$url" --data-only -f "$dir.partial/data.sql"
mv "$dir.partial" "$dir"
echo "$dir"
