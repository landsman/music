# CRON jobs

You have to allow two extensions: `pg_cron`, `pg_net` for a database to make
this work. See [Supabase Documentation](https://supabase.com/docs/guides/cron).

You have to run the following commands in SQL Editor of your Supabase project.

## Generate cron tab

1. Fill out root `.env` file with variables
2. run tests: `deno run tests`
3. cron install queries will be generated into the file `cron_jobs.sql` in the
   root
4. visit supabase dashboard and run these queries in SQL editor

## GUI

There is actually a UI where you can manage your jobs very easily.

```
https://supabase.com/dashboard/project/***/integrations/cron/jobs
```

_Replace your project ID in the URL_.

## Remove existing job

Replace ID by number from your database of already existing cron.

```bash
select cron.unschedule(3);
```

Or you can do this via GUI as well.
