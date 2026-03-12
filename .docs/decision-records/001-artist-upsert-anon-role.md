# 001 — Artist Upsert Running as `anon` Role (Performance Incident)

**Date:** 2026-03-12
**Status:** Resolved

---

## Problem

The `lastfm-library-artists` Edge Function was responsible for 37.8% of total database time, far exceeding its expected share. The bottleneck was the `upsert_artists` RPC call, which performed a bulk upsert of artist rows.

---

## Root Cause

`SUPABASE_SERVICE_ROLE_KEY` was not set as a Supabase production secret.

When the Edge Function initialized its Supabase client using `env.SUPABASE_SERVICE_ROLE_KEY`, the value was `undefined`. The client silently fell back to the `anon` role instead of the `service_role`.

As a result:
- Row Level Security (RLS) was **not** bypassed
- Every row in the upsert was evaluated against RLS policies
- This caused `O(n)` policy checks per upsert batch, degrading performance significantly under the `anon` role

---

## Fix

Set the missing secret in the Supabase production environment:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<value>
```

After deploying, queries ran as `service_role`, RLS was bypassed for internal operations, and the upsert cost dropped to negligible levels.

---

## Prevention

### 1. Startup validation in `_shared/env.ts`

The `env.ts` module now validates required secrets at startup and throws explicitly if any are missing, rather than passing `undefined` silently:

```ts
const REQUIRED_KEYS: (keyof Variables)[] = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "LASTFM_API_KEY",
  "LASTFM_USERNAME",
];

for (const key of REQUIRED_KEYS) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

This causes the function to fail loudly on cold start rather than silently degrading to lower-privilege behavior.

### 2. Verify secrets after deploy

After any new Edge Function deployment or environment change, confirm all secrets are present:

```bash
supabase secrets list
```

---

## Lessons Learned

- Supabase client initialization does **not** warn when the service role key is absent — it silently uses `anon`.
- Missing secrets are a silent failure mode that can cause correctness issues (wrong role) or performance regressions (RLS overhead), not just crashes.
- Always validate critical environment variables at startup.
