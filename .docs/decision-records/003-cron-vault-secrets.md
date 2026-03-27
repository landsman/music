# 003 — Cron Jobs Use Supabase Vault for Secrets (No Hardcoded Keys in Public Repo)

**Date:** 2026-03-27
**Status:** Active

---

## Problem

The `cron_jobs.sql` file contained the Supabase `anon` key hardcoded as a bearer token in the HTTP headers of every `net.http_post` call. This file was committed to a public GitHub repository, exposing the key publicly.

Additionally, cron jobs were not deployed automatically — `cron_jobs.sql` was a manual artifact that had to be applied by hand, with no CI integration.

---

## Decision

Store the Supabase `anon` key in **Supabase Vault** (`vault.secrets`) and reference it at cron execution time via `vault.decrypted_secrets`. Cron job definitions live as a standard migration under `supabase/migrations/` and are applied automatically via `supabase db push` in CI.

The vault secret is upserted by the CI pipeline itself (via `psql` on the self-hosted runner) — before `supabase db push` runs. The anon key is fetched at deploy time from the Supabase Management API using `SUPABASE_ACCESS_TOKEN` (already required for deployment), so no additional GitHub secret is needed. The migration file contains no secret values and is safe to commit.

---

## Architecture

```
Supabase Management API
  └── projects api-keys (fetched via SUPABASE_ACCESS_TOKEN at deploy time)
        │
        ▼  (psql upsert step, before db push)
Supabase Vault
  └── vault.secrets { name: 'supabase_anon_key', secret: '<anon key>' }
        │
        ▼  (read at cron execution time by pg_cron)
pg_cron job SQL
  └── SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_anon_key'
```

The migration file stores the cron SQL as a string. pg_cron evaluates it at runtime, so the vault lookup happens each time the cron fires — not at migration time.

---

## Why anon key and not service_role key

Cron jobs call Edge Functions via their public HTTPS endpoint. Edge Functions authenticate callers using the anon key (JWT), not the service_role key. The service_role key bypasses RLS at the DB level and is never needed for HTTP-level invocation. Only the anon key is stored in vault for cron use.

---

## Changing Crons Over Time

Cron definitions live in `CronDefinition` objects in each Edge Function's sync file. Users are defined in `supabase/functions/_shared/users.ts`.

After any change, generate and stage a new migration:

```bash
make migration-crons
```

This runs `scripts/generate-crons.ts`, which writes a timestamped migration to `supabase/migrations/` and prints the path. The Makefile stages it with `git add`. Every generated migration unschedules all existing jobs first, then reschedules them — so no stale jobs can accumulate.

---

## Local Development

When working locally with Supabase, seed the vault secret once:

```bash
psql $DATABASE_URL -c "SELECT vault.create_secret('your-local-anon-key', 'supabase_anon_key', 'Supabase anon key for cron HTTP requests');"
```

The local anon key is found in the output of `supabase status` after `deno task start`.

---

## Security Properties

| Property                        | Before                 | After                             |
|---------------------------------|------------------------|-----------------------------------|
| Anon key in public repo         | Yes (hardcoded in SQL) | No                                |
| Anon key in CI logs             | N/A                    | No (GitHub masked secret)         |
| Anon key at rest                | Plaintext in git       | Encrypted in vault (pgsodium)     |
| Cron deployment                 | Manual                 | Automatic via `supabase db push`  |
| Self-hosted runner IP whitelist | N/A                    | DB accessible only from static IP |

---

## Alternatives Considered

**Template + envsubst in CI** — Replace `${SUPABASE_ANON_KEY}` at CI time and generate the migration file. Rejected: adds fragility (file generation in CI), and the secret is still handled in plaintext in the shell. Vault keeps the secret encrypted at rest in the DB itself.

**`current_setting()` via `ALTER DATABASE SET`** — Store key as a DB-level setting. Rejected: not encrypted at rest; visible in `pg_settings`.
