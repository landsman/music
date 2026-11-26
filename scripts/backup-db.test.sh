#!/usr/bin/env bash
# What backup-db.sh would get wrong silently: hand the CLI a pasted URI still
# wrapped in bracketed-paste markers, or leave a half-written backup looking finished.
set -uo pipefail

script="$(cd "$(dirname "$0")" && pwd)/backup-db.sh"
t=$(mktemp -d)
trap 'rm -rf "$t"' EXIT
mkdir "$t/bin"
# npx stub for `supabase db dump`: records the --db-url it got and writes the -f file
cat >"$t/bin/npx" <<'EOF'
#!/usr/bin/env bash
while (($#)); do
  case $1 in
    --db-url) echo "$2" >>"$DUMP_LOG"; shift ;;
    -f) echo "-- dump" >"$2"; shift ;;
  esac
  shift
done
EOF
chmod +x "$t/bin/npx"

rc=0
check() {
  local behaviour=$1
  shift
  if "$@"; then echo "ok   $behaviour"; else echo "FAIL $behaviour"; rc=1; fi
}
run() { PATH="$t/bin:$PATH" DUMP_LOG="$t/log" SUPABASE_DB_URL="$1" bash "$script" "$t/out" </dev/null >"$t/stdout" 2>"$t/stderr"; }

uri="postgresql://postgres.ref:secret@pooler.example.com:5432/postgres"

: >"$t/log"
run $'\e[200~'"$uri"$'\e[201~\n'
check "a bracketed paste reaches the CLI as the bare URI, for schema and data" test "$(sort -u "$t/log")" = "$uri"
backup=$(cat "$t/stdout")
check "the backup holds schema.sql and data.sql" test -s "$backup/schema.sql" -a -s "$backup/data.sql"
check "a finished backup keeps no .partial name" test "$(find "$t/out" -name '*.partial' | wc -l | tr -d ' ')" = 0

: >"$t/log"
run "music"
check "a value that is not a URI stops before the CLI" test ! -s "$t/log"
check "the refusal shows no password" test "$(grep -c secret "$t/stderr")" = 0

run "postgres://user:secret@host/db"
check "a postgres:// URI is accepted too" test -s "$t/log"

exit $rc
