# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Supabase MCP

This project has Supabase MCP configured (`.mcp.json`). Use it for database-related tasks:
- Exploring schema, tables, and data
- Running SQL queries against the production database
- Inspecting Edge Function logs and configurations
- Reviewing migrations and RLS policies

**Prefer MCP tools over raw SQL commands** when querying or inspecting the database. On first use, Claude Code will prompt you to authenticate with your Supabase account via browser.

For local Supabase (when running `deno task start`), the MCP endpoint is `http://localhost:54321/mcp`.

## Development Setup Notes

**Local Supabase is NOT required for most frontend work.** The web app can connect directly to the production Supabase API in read-only mode, which is sufficient for the majority of frontend development and testing.

**When to run local Supabase:**
- Modifying database schema (migrations)
- Working on Edge Functions
- Testing CRON jobs
- Making write operations to the database

**For frontend-only work:** Just run `deno task dev` from `src/web/` - it will use the production API configured in `.env`.

## Project Overview

A personal music tracking application that syncs listening history from Last.fm to a PostgreSQL database via Supabase. It includes a React web frontend to visualize the data.

## Architecture

**Deno monorepo** with three workspaces:
- `src/shared/` - Shared TypeScript types and database client
- `src/web/` - React + Vite frontend with i18n (Lingui)
- `supabase/functions/` - Edge Functions for Last.fm API sync

**Backend:** Supabase (PostgreSQL, Edge Functions, CRON jobs)
**Frontend:** React 19, Vite 7, TanStack Query, Tailwind-style CSS

## Common Commands

```bash
# Start local Supabase (requires Docker)
deno task start

# Stop local Supabase
deno task down

# Run Edge Functions locally
deno task serve

# Run tests
deno task tests

# Format code
deno task format

# Lint code
deno task lint

# Generate TypeScript types from database
deno task update-types-local    # from local DB
deno task update-types-linked   # from linked project

# Create new migration
deno task migration <name>

# Apply migrations
deno task migrate
```

### Web App Commands (run from `src/web/`)

```bash
# Development server
deno task dev

# Production build
deno task build

# Extract i18n strings
deno task extract

# Compile i18n translations
deno task compile
```

## Project Structure

```
├── src/
│   ├── shared/           # Shared types (db.types.ts) and DB client
│   └── web/              # React frontend
│       └── src/
│           ├── data/     # API queries and hooks
│           ├── i18n/     # Lingui translations
│           ├── lib/      # Utilities (supabase client, dates)
│           ├── ui/       # UI components
│           └── view/     # Page views
├── supabase/
│   ├── functions/        # Edge Functions
│   │   ├── _shared/      # Shared utilities, DB helpers, Last.fm client
│   │   ├── lastfm-library-artists/
│   │   └── lastfm-user-recent-tracks/
│   └── migrations/       # SQL migrations
└── .docs/                # Project documentation
```

## Key Files

- `deno.json` - Root workspace config with all tasks
- `src/web/deno.json` - Web app dependencies and tasks
- `src/shared/db.types.ts` - Auto-generated database types
- `supabase/functions/_shared/` - Shared Edge Function code
- `cron_jobs.sql` - CRON job definitions for scheduled syncs

## Edge Functions

Two main functions that sync data from Last.fm:
- `lastfm-user-recent-tracks` - Syncs recently played tracks (runs every 5 min via CRON)
- `lastfm-library-artists` - Syncs artist library data

## Environment Variables

Required in `.env` or Supabase secrets:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` - Supabase connection
- `LASTFM_API_KEY` - Last.fm API key
- `SENTRY_DSN` - Sentry error tracking (optional)

## Code Style

- Deno formatting: 2-space indent, double quotes, semicolons
- Run `deno task format` before committing
- Run `deno task lint` to check for issues

## Caveats

Read `CAVEATS.md` at the project root before working on dependencies or the build setup. It documents known workarounds and temporary hacks that should be revisited when upgrading packages.

## Git

When creating new files, always stage them with `git add <file>` after creating them.