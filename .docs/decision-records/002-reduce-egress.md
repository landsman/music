# 002 — Reduce Supabase Egress (Bandwidth Limit Hit)

**Date:** 2026-03-27
**Status:** Resolved

---

## Problem

Project hit the Supabase free-tier egress limit (6.01 GB of 5.5 GB), causing the project to be paused.

---

## Root Causes

### 1. N+1 queries in `pairArtistWithHooman` (sync-artists.ts)
For each artist in a page (up to 300), a separate `findIdByName()` DB query was fired via `Promise.all`.
With ~3,000 artists across 10 pages, this generated **3,000 DB round-trips per invocation**, running 48×/day = ~144,000 queries/day. All responses are counted as Supabase egress.

### 2. `.select()` on upserts returning unused rows
`ArtistTable.sync()` and `HoomanArtistTable.pair()` both called `.select()` after upsert, returning all inserted/updated rows back to the Edge Function. This data was never used (`message` field is always `undefined`). With 300 artists per batch, this sent 300 full rows back per write.

### 3. `lastfm-library-artists` ran every 30 minutes unnecessarily
The cron re-fetched and re-upserted the **entire artist library** every 30 minutes. Artist data is nearly static. Changed to every 2 hours.

### 4. Frontend health check query doubled DB round-trips
`getLastListenedTracks()` fired a `count()` query before every actual data fetch. Removed — the main query surfaces connection errors directly.

### 5. `useUsers()` missing `refetchOnWindowFocus: false`
Default TanStack Query config refetched users on every window focus after stale time. Added `refetchOnWindowFocus: false`.

---

## Fixes Applied

| File                                                        | Change                                                                   |
|-------------------------------------------------------------|--------------------------------------------------------------------------|
| `supabase/functions/_shared/db/db.artist.ts`                | Removed `.select()` from `sync()`; added `findIdsByNames()` batch method |
| `supabase/functions/_shared/db/db.hooman_artist.ts`         | Removed `.select()` from `pair()`                                        |
| `supabase/functions/lastfm-library-artists/sync-artists.ts` | Replaced N+1 loop with one batched `.in("name", names)` query            |
| `supabase/functions/lastfm-library-artists/index.ts`        | Changed cron from `*/30 * * * *` to `0 */2 * * *`                        |
| `src/web/src/data/tracks-api.ts`                            | Removed health check `count()` query                                     |
| `src/web/src/data/use-users.ts`                             | Added `refetchOnWindowFocus: false`                                      |

---

## Egress Impact Estimate

Assumptions: ~3,000 artists (10 pages × 300), 2 users.

| Operation                 | Before (per invocation)                         | After (per invocation)        |
|---------------------------|-------------------------------------------------|-------------------------------|
| `findIdByName` N+1        | 3,000 queries × ~200 bytes = ~600 KB            | 10 queries × ~24 KB = ~240 KB |
| `sync()` with `.select()` | 300 rows/page × 10 pages × ~126 bytes = ~380 KB | 0 bytes                       |
| `pair()` with `.select()` | 300 rows/page × 10 pages × ~132 bytes = ~400 KB | 0 bytes                       |
| **Total per invocation**  | **~1.4 MB**                                     | **~240 KB**                   |
| Invocations/day           | 48 (`*/30 * * * *`)                             | 12 (`0 */2 * * *`)            |
| **Total per day**         | **~67 MB**                                      | **~2.9 MB**                   |
| **Total per month**       | **~2 GB**                                       | **~87 MB**                    |

**~23× reduction** from the artist sync function alone. This was the primary driver of the 6 GB overage.

### All crons combined (monthly estimate, 2 users)

**`lastfm-library-artists`** — `0 */2 * * *` = 12 runs/day × 2 users × 30 days = 720 runs/month
- `findOrCreateByLastFmUser()`: 1 row × ~36 bytes = ~36 bytes
- `findIdsByNames()`: 300 rows × ~80 bytes × 10 pages = ~240 KB
- `sync()` + `pair()`: 0 bytes (no `.select()`)
- Per invocation: ~240 KB × 720 = **~168 MB/month**

**`lastfm-user-recent-tracks`** — `*/5 * * * *` = 288 runs/day × 2 users × 30 days = 17,280 runs/month
- `findOrCreateByLastFmUser()`: 1 row × ~36 bytes = ~36 bytes
- `getLastListenedDate()`: 1 row × ~24 bytes = ~24 bytes
- `save()`: 0 bytes (no `.select()`)
- Per invocation: ~60 bytes × 17,280 = **~1 MB/month**

**Grand total (crons): ~169 MB/month**

### Frontend (monthly estimate)

Per page load breakdown (~14 KB):
- `useUsers()`: 2 rows × ~46 bytes = ~92 bytes
- `useTracks()` page 1: 50 rows × ~282 bytes = ~14 KB
- (subsequent pages: ~14 KB each, Load More button only)

**Uptime monitor** — loads page every 30 min = 48 loads/day × 30 days = 1,440 loads/month
- 1,440 × ~14 KB = **~20 MB/month**

**Real visits** — 100 visits/day × 30 days = 3,000 visits/month, avg 2 pages per visit
- 3,000 × 2 × ~14 KB = **~84 MB/month**

**Frontend total: ~104 MB/month**

---

### Grand total (all sources)

| Source                      | Monthly egress    |
|-----------------------------|-------------------|
| `lastfm-library-artists`    | ~168 MB           |
| `lastfm-user-recent-tracks` | ~1 MB             |
| Frontend (uptime monitor)   | ~20 MB            |
| Frontend (100 visits/day)   | ~84 MB            |
| **Total**                   | **~273 MB/month** |

**~5% of the 5.5 GB free-tier limit.**

---

## Measuring Egress After Deployment

### Step 1 — Note current baseline

Before or right after deploying, record the current egress number from **Supabase Dashboard → Settings → Usage**. This can't be reset (tied to billing cycle), but you can track the daily delta manually.

### Step 2 — Reset pg_stat_statements

Run this in the Supabase SQL editor (or via MCP) to get a clean query-level baseline:

```postgresql
SELECT pg_stat_statements_reset();
```

### Step 3 — After a few days, query top egress sources
```postgresql
SELECT
  query,
  calls,
  rows,
  round(total_exec_time::numeric, 2) AS total_ms,
  round(mean_exec_time::numeric, 2) AS avg_ms
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%'
ORDER BY rows DESC
LIMIT 20;
```
This shows which queries return the most rows — the primary driver of egress. Compare against the estimates in this document.

### What to look for
- `SELECT id, name FROM artist WHERE name = ANY(...)` — should appear with low row counts (≤300/call)
- Any query returning thousands of rows per call is a red flag
- `INSERT INTO listened` should show 0 rows returned (no `.select()`)

---

## Lessons Learned

- `.select()` after a write returns all affected rows — never add it unless you actually use the returned data.
- `Promise.all` over a DB call is an N+1 query pattern in disguise. Always batch lookups with `.in()`.
- Cron jobs that re-sync static data frequently are a silent egress multiplier.
- Track Supabase egress in the Dashboard (Settings → Usage) monthly before hitting limits.
