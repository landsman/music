#!/usr/bin/env bash
# Dump the production database's public schema, tables and data, to a local file.
#
# Usage: scripts/backup-db.sh [out-dir]
#   asks for the Session pooler URI from the dashboard (Connect), unless SUPABASE_DB_URL holds it;
#   the direct host is IPv6 only
#   out-dir  defaults to ~/backups/music, outside the repo so a dump is never committed
# Restore: pg_restore --no-owner --no-privileges -d <uri> <file>
#   It exits 1 with two harmless errors on Postgres 16 or older, as on Supabase's 15:
#   transaction_timeout is unknown there, and schema "public" already exists.
set -euo pipefail

# Asks only in a terminal: without one, a prompt would wait forever.
if [[ -z "${SUPABASE_DB_URL:-}" && -t 0 ]]; then
  read -rsp "Session pooler URI (Supabase dashboard, Connect): " SUPABASE_DB_URL
  echo >&2
fi
: "${SUPABASE_DB_URL:?set SUPABASE_DB_URL to the Session pooler URI from the Supabase dashboard}"

# A terminal may wrap a paste in bracketed-paste markers, and pg_dump reads
# anything that is not a URI as a local database name.
url=${SUPABASE_DB_URL//$'\e[200~'/}
url=${url//$'\e[201~'/}
url=${url//[[:space:]]/}
if [[ ! "$url" =~ ^postgres(ql)?:// ]]; then
  printf 'Expected a postgresql:// URI, got one starting with %q\n' "${url:0:12}" >&2
  exit 1
fi
out_dir=${1:-$HOME/backups/music}
mkdir -p "$out_dir"
file="$out_dir/music-$(date -u +%Y%m%dT%H%M%SZ).dump"

# Written under another name first, so a dump that fails halfway never looks finished.
pg_dump "$url" --schema=public --no-owner --no-privileges \
  --format=custom --file="$file.partial"
mv "$file.partial" "$file"
echo "$file"
