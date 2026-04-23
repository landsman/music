-- unschedule all existing cron jobs before reapplying
select cron.unschedule(jobid) from cron.job where jobname = 'lastfm_user_recent_tracks_insuit';
select cron.unschedule(jobid) from cron.job where jobname = 'lastfm_library_artists_insuit';
select cron.unschedule(jobid) from cron.job where jobname = 'lastfm_user_recent_tracks_weinkaa';
select cron.unschedule(jobid) from cron.job where jobname = 'lastfm_library_artists_weinkaa';

-- schedule cron jobs

select
  cron.schedule(
    'lastfm_user_recent_tracks_insuit',
    '*/5 * * * *',
    $$
    select
      net.http_post(
          url:='https://qwvhazhlyjtgnfukdztm.supabase.co/functions/v1/lastfm-user-recent-tracks',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('{"time":"', now(),'","lastFmUser":"Insuit"}')::jsonb
      ) as request_id;
    $$
  );


select
  cron.schedule(
    'lastfm_library_artists_insuit',
    '0 */2 * * *',
    $$
    select
      net.http_post(
          url:='https://qwvhazhlyjtgnfukdztm.supabase.co/functions/v1/lastfm-library-artists',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('{"time":"', now(),'","lastFmUser":"Insuit"}')::jsonb
      ) as request_id;
    $$
  );


select
  cron.schedule(
    'lastfm_user_recent_tracks_weinkaa',
    '*/5 * * * *',
    $$
    select
      net.http_post(
          url:='https://qwvhazhlyjtgnfukdztm.supabase.co/functions/v1/lastfm-user-recent-tracks',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('{"time":"', now(),'","lastFmUser":"Weinkaa"}')::jsonb
      ) as request_id;
    $$
  );


select
  cron.schedule(
    'lastfm_library_artists_weinkaa',
    '0 */2 * * *',
    $$
    select
      net.http_post(
          url:='https://qwvhazhlyjtgnfukdztm.supabase.co/functions/v1/lastfm-library-artists',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('{"time":"', now(),'","lastFmUser":"Weinkaa"}')::jsonb
      ) as request_id;
    $$
  );
