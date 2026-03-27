-- Queries returning the most rows on average (likely fat result sets)
-- Filters to queries called more than 10 times to reduce noise
SELECT
  query,
  calls,
  rows,
  rows / NULLIF(calls, 0) AS avg_rows_per_call,
  round(mean_exec_time::numeric, 2) AS avg_ms
FROM pg_stat_statements
WHERE calls > 10
ORDER BY avg_rows_per_call DESC
LIMIT 20;
