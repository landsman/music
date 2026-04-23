#!/usr/bin/env bash
# Link to the remote project, apply migrations, and deploy Edge Functions.
#
# Required env: PROJECT_ID, SUPABASE_ACCESS_TOKEN, SUPABASE_DB_PASSWORD, GITHUB_SHA
set -euo pipefail

: "${PROJECT_ID:?PROJECT_ID is required}"
: "${SUPABASE_ACCESS_TOKEN:?SUPABASE_ACCESS_TOKEN is required}"
: "${SUPABASE_DB_PASSWORD:?SUPABASE_DB_PASSWORD is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"

supabase link --project-ref "$PROJECT_ID"
supabase db push
supabase secrets set "SENTRY_RELEASE=$GITHUB_SHA"
supabase functions deploy --use-api
