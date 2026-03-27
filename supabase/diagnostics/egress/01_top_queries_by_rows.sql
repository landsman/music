-- Top queries by total rows returned (requires pg_stat_statements extension)
SELECT
  query,
  calls,
  rows,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS avg_ms,
  rows / NULLIF(calls, 0) AS avg_rows_per_call
FROM pg_stat_statements
ORDER BY rows DESC
LIMIT 20;
