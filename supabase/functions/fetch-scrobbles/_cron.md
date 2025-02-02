# Cron

You have to allow two extensions: `pg_cron`, `pg_net` for database to make this
work. See [Documentation](https://supabase.com/docs/guides/cron).

You have to run following commands in SQL Editor of your Supabase project.

## Create a new CRON job

or edit already existing

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

## Remove existing CRON job

```postgresql
select cron.unschedule(3);
```
