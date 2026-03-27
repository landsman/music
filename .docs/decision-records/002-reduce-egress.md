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
The cron re-fetched and re-upserted the **entire artist library** every 30 minutes. Artist data is nearly static. Changed to every 6 hours.

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
| `supabase/functions/lastfm-library-artists/index.ts`        | Changed cron from `*/30 * * * *` to `0 */6 * * *`                        |
| `src/web/src/data/tracks-api.ts`                            | Removed health check `count()` query                                     |
| `src/web/src/data/use-users.ts`                             | Added `refetchOnWindowFocus: false`                                      |

---

## Lessons Learned

- `.select()` after a write returns all affected rows — never add it unless you actually use the returned data.
- `Promise.all` over a DB call is an N+1 query pattern in disguise. Always batch lookups with `.in()`.
- Cron jobs that re-sync static data frequently are a silent egress multiplier.
- Track Supabase egress in the Dashboard (Settings → Usage) monthly before hitting limits.
