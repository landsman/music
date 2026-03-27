-- Run this first to verify pg_stat_statements is available
-- Required by queries 01, 02, and 06
SELECT * FROM pg_extension WHERE extname = 'pg_stat_statements';

-- If not installed, enable it with:
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
