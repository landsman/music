-- Currently active queries — useful for catching long-running or data-heavy queries in real time
SELECT
  pid,
  usename,
  application_name,
  state,
  wait_event_type,
  round(extract(epoch FROM (now() - query_start))::numeric, 2) AS running_seconds,
  left(query, 200) AS query_preview
FROM pg_stat_activity
WHERE state = 'active'
  AND query NOT ILIKE '%pg_stat_activity%'
ORDER BY query_start ASC;
