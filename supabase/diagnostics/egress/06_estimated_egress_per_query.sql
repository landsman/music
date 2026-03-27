-- Estimate egress per query by combining pg_stat_statements with average row width
-- Note: table matching is heuristic (ILIKE), may produce false positives for complex queries
SELECT
  s.query,
  s.calls,
  s.rows,
  c.relname AS likely_table,
  t.n_live_tup,
  cls.reltuples,
  pg_relation_size(cls.oid) / NULLIF(cls.reltuples::numeric, 0) AS avg_row_bytes,
  round(
    (s.rows * (pg_relation_size(cls.oid) / NULLIF(cls.reltuples::numeric, 0))) / 1024 / 1024,
    2
  ) AS estimated_egress_mb
FROM pg_stat_statements s
JOIN pg_stat_user_tables t ON s.query ILIKE '%' || t.relname || '%'
JOIN pg_class cls ON cls.relname = t.relname
ORDER BY estimated_egress_mb DESC NULLS LAST
LIMIT 20;
