# CRON jobs

You have to allow two extensions: `pg_cron`, `pg_net` for a database to make this
work.
See [Supabase Documentation](https://supabase.com/docs/guides/cron).

You have to run the following commands in SQL Editor of your Supabase project.

## Create a new job

Or edit already existing.
Replace CRON name, timing and `$PUBLISHABLE_KEY` with your value, from project settings, in plain text.

```postgresql
select
  cron.schedule(
    'lastfm-tracks',
    '*/5 * * * *', -- every five minutes
    $$
    select
      net.http_post(
          url:='https://qwvhazhlyjtgnfukdztm.supabase.co/functions/v1/fetch-scrobbles',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer $PUBLISHABLE_KEY"}'::jsonb,
          body:=concat('{"time": "', now(), '"}')::jsonb
      ) as request_id;
    $$
  );
```

## Remove existing job

```postgresql
select cron.unschedule(3);
```
