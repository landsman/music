# CRON jobs

You have to allow two extensions: `pg_cron`, `pg_net` for a database to make this
work.
See [Supabase Documentation](https://supabase.com/docs/guides/cron).

You have to run the following commands in SQL Editor of your Supabase project.

## GUI

There is actually a UI where you can manage your jobs very easily.

```
https://supabase.com/dashboard/project/***/integrations/cron/jobs
```

*Replace your project ID in the URL*.

## Create a new job

Fill out .env file with variables and run tests. Cron will be generated to the file.

```bash
deno run tests
```

## Remove existing job

Replace ID by number from your database of already existing cron.

```bash
select cron.unschedule(3);
```
