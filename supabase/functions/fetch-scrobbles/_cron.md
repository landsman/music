# Cron

```postgresql
select
  cron.schedule(
    'last-fm-tracks',
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