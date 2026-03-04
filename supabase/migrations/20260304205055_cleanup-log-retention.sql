-- Keep only last 7 days of cron job logs (runs daily at 3am)
SELECT cron.schedule(
  'cleanup-cron-logs',
  '0 3 * * *',
  $$DELETE FROM cron.job_run_details WHERE end_time < NOW() - INTERVAL '7 days'$$
);

-- Keep only last 7 days of HTTP response logs (runs daily at 3am)
SELECT cron.schedule(
  'cleanup-http-logs',
  '0 3 * * *',
  $$DELETE FROM net._http_response WHERE created < NOW() - INTERVAL '7 days'$$
);
