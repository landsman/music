#!/usr/bin/env bash
# Create a Sentry release, associate commits, record the deploy, then finalize.
# Runs after a successful Supabase deploy.
#
# Required env: SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT, GITHUB_SHA
set -euo pipefail

: "${SENTRY_AUTH_TOKEN:?SENTRY_AUTH_TOKEN is required}"
: "${SENTRY_ORG:?SENTRY_ORG is required}"
: "${SENTRY_PROJECT:?SENTRY_PROJECT is required}"
: "${GITHUB_SHA:?GITHUB_SHA is required}"

npx @sentry/cli releases new "$GITHUB_SHA"
npx @sentry/cli releases set-commits "$GITHUB_SHA" --auto
npx @sentry/cli releases deploys "$GITHUB_SHA" new -e production
npx @sentry/cli releases finalize "$GITHUB_SHA"
