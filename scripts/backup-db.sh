#!/usr/bin/env bash
# Dump the production database's public schema, tables and data, to a local file.
#
# Usage: SUPABASE_DB_URL=<uri> scripts/backup-db.sh [out-dir]
#   SUPABASE_DB_URL  the Session pooler URI from the dashboard (Connect); the direct host is IPv6 only
#   out-dir          defaults to ~/backups/music, outside the repo so a dump is never committed
# Restore: pg_restore --no-owner --no-privileges -d <uri> <file>
set -euo pipefail

: "${SUPABASE_DB_URL:?set SUPABASE_DB_URL to the Session pooler URI from the Supabase dashboard}"
out_dir=${1:-$HOME/backups/music}
mkdir -p "$out_dir"
file="$out_dir/music-$(date -u +%Y%m%dT%H%M%SZ).dump"

# Written under another name first, so a dump that fails halfway never looks finished.
pg_dump "$SUPABASE_DB_URL" --schema=public --no-owner --no-privileges \
  --format=custom --file="$file.partial"
mv "$file.partial" "$file"
echo "$file"
