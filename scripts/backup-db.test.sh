#!/usr/bin/env bash
# What backup-db.sh would get wrong silently: hand pg_dump a pasted URI still
# wrapped in bracketed-paste markers, which it reads as a local database name.
set -uo pipefail

script="$(cd "$(dirname "$0")" && pwd)/backup-db.sh"
t=$(mktemp -d)
trap 'rm -rf "$t"' EXIT
mkdir "$t/bin"
# pg_dump stub: records the URI it got and writes the file it was asked for
cat >"$t/bin/pg_dump" <<'EOF'
#!/usr/bin/env bash
echo "$1" >>"$PG_DUMP_LOG"
for arg; do [[ $arg == --file=* ]] && : >"${arg#--file=}"; done
EOF
chmod +x "$t/bin/pg_dump"

rc=0
check() {
  local behaviour=$1
  shift
  if "$@"; then echo "ok   $behaviour"; else echo "FAIL $behaviour"; rc=1; fi
}
run() { PATH="$t/bin:$PATH" PG_DUMP_LOG="$t/log" SUPABASE_DB_URL="$1" bash "$script" "$t/out" </dev/null >"$t/stdout" 2>"$t/stderr"; }

uri="postgresql://postgres.ref:secret@pooler.example.com:5432/postgres"

: >"$t/log"
run $'\e[200~'"$uri"$'\e[201~\n'
check "a bracketed paste reaches pg_dump as the bare URI" test "$(cat "$t/log")" = "$uri"
check "the finished dump keeps no .partial name" test "$(find "$t/out" -type f -not -name '*.dump' | wc -l | tr -d ' ')$(find "$t/out" -name '*.dump' | wc -l | tr -d ' ')" = 01

: >"$t/log"
run "music"
check "a value that is not a URI stops before pg_dump" test ! -s "$t/log"
check "the refusal shows no password" test "$(grep -c secret "$t/stderr")" = 0

run "postgres://user:secret@host/db"
check "a postgres:// URI is accepted too" test -s "$t/log"

exit $rc
