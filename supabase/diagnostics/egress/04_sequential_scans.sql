-- Tables with sequential scans — common cause of high egress
-- High seq_tup_read means large amounts of data are being read without index use
SELECT
  schemaname,
  relname AS table_name,
  seq_scan,
  seq_tup_read AS rows_read_via_seq_scan,
  idx_scan,
  n_live_tup AS live_rows,
  seq_tup_read / NULLIF(seq_scan, 0) AS avg_rows_per_seq_scan
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;
