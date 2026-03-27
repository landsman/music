# Database Diagnostics

SQL queries for identifying high-egress and performance issues in the database.

## Prerequisites

Queries `01`, `02`, and `06` require the `pg_stat_statements` extension. Run
`00_check_pg_stat_statements.sql` first to verify it is enabled.

## Queries

| File                                                                          | Description                                         |
|-------------------------------------------------------------------------------|-----------------------------------------------------|
| [00_check_pg_stat_statements.sql](egress/00_check_pg_stat_statements.sql)     | Verify `pg_stat_statements` extension is available  |
| [01_top_queries_by_rows.sql](egress/01_top_queries_by_rows.sql)               | Top queries by total rows returned across all calls |
| [02_queries_by_avg_rows.sql](egress/02_queries_by_avg_rows.sql)               | Queries with the largest result sets per call       |
| [03_large_tables.sql](egress/03_large_tables.sql)                             | Table sizes, row counts, and index overhead         |
| [04_sequential_scans.sql](egress/04_sequential_scans.sql)                     | Tables being full-scanned without index use         |
| [05_active_queries.sql](egress/05_active_queries.sql)                         | Live view of currently running queries              |
| [06_estimated_egress_per_query.sql](egress/06_estimated_egress_per_query.sql) | Rough egress estimate (MB) per query                |

## Running

Paste any query into the
[Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql) or run via
`psql`:

```bash
psql $DATABASE_URL -f supabase/diagnostics/egress/<filename>.sql
```

## Suggested Order

1. Run `00` to confirm the extension is on
2. Run `01` and `02` to find queries returning excessive rows
3. Run `04` to spot missing indexes causing full-table scans
4. Run `03` to understand which tables are largest
5. Run `06` for a rough MB-level egress estimate per query
6. Run `05` in real time while reproducing a slow or heavy operation
