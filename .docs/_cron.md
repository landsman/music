# CRON jobs

You have to allow two extensions: `pg_cron`, `pg_net` for a database to make
this work. See [Supabase Documentation](https://supabase.com/docs/guides/cron).

## How cron jobs are deployed

Cron jobs are defined in code and deployed automatically as SQL migrations via
`supabase db push` in CI. No manual SQL editor steps required.

The anon key is **never stored in the repository**. It is fetched from the
Supabase Management API at deploy time and stored in Supabase Vault
(`vault.secrets`), where pg_cron reads it at runtime.

See [decision record 003](decision-records/003-cron-vault-secrets.md) for full details.

## Adding or changing a cron job

1. Edit the `CronDefinition` in the relevant Edge Function:
   - `supabase/functions/lastfm-user-recent-tracks/sync-tracks.ts` → `recentTracksCron`
   - `supabase/functions/lastfm-library-artists/sync-artists.ts` → `libraryArtistsCron`
2. Add or remove users in `supabase/functions/_shared/users.ts` → `LASTFM_USERS`
3. Generate and stage the migration:
   ```bash
   make migration-crons
   ```
4. Commit and push — CI applies it via `supabase db push`

## Local development

Seed the vault secret once after starting local Supabase:

```bash
# Get the local anon key from:
deno task start  # then check output of: supabase status

psql $DATABASE_URL -c "SELECT vault.create_secret('<local-anon-key>', 'supabase_anon_key', 'Supabase anon key for cron HTTP requests');"
```

## GUI

Jobs can also be inspected and managed via the Supabase dashboard:

```
https://supabase.com/dashboard/project/***/integrations/cron/jobs
```

_Replace your project ID in the URL._
