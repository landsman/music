# Project Development Guidelines

This document provides guidelines and instructions for developing and maintaining this project.

## Build/Configuration Instructions

### Project Setup

1. This project uses Deno as the runtime environment and Supabase for backend services.
2. The project is structured with a web frontend (React + Vite) and Supabase functions.

### Installation and Setup

1. Install Deno: Follow the instructions at [deno.land](https://deno.land/#installation)
2. Install Supabase CLI: Follow the instructions at [supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)
3. Clone the repository and navigate to the project directory
4. Create a `.env` file based on `.env.example` with your Supabase credentials

### Development Workflow

1. Start the local Supabase instance:
   ```bash
   deno task dev
   ```

2. Start the web development server:
   ```bash
   cd src/web
   deno task dev
   ```

3. Open Supabase Studio (in a separate terminal):
   ```bash
   deno task studio
   ```

4. Serve Supabase functions locally:
   ```bash
   deno task serve
   ```

### Building for Production

To build the web application for production:
```bash
cd src/web
deno task build
```

To preview the production build:
```bash
cd src/web
deno task preview
```

To serve the built application:
```bash
cd src/web
deno task serve
```

## Testing Information

### Running Tests

Tests are written using Deno's built-in testing framework. To run all tests:
```bash
deno task tests
```

To run a specific test file:
```bash
deno test --allow-all <path-to-test-file>
```

Example:
```bash
deno test --allow-all supabase/functions/tests/utils-test.ts
```

### Writing Tests

Tests are located in the `supabase/functions/tests` directory. Each test file should follow the naming convention `*-test.ts`.

Example test:
```typescript
import { assertEquals } from "@std/assert";
import { delay } from "../_shared/utils.ts";

Deno.test("delay function test", async () => {
  const start = Date.now();
  await delay(100); // Delay for 100ms
  const end = Date.now();
  const elapsed = end - start;
  
  // Check that at least 100ms have passed (with a small margin of error)
  assertEquals(elapsed >= 95, true, `Expected delay of at least 95ms, but got ${elapsed}ms`);
});
```

### Test Assertions

The project uses Deno's standard assertion library `@std/assert`. Common assertions include:

- `assertEquals(actual, expected, message?)`: Asserts that `actual` and `expected` are equal
- `assertNotEquals(actual, expected, message?)`: Asserts that `actual` and `expected` are not equal
- `assertStrictEquals(actual, expected, message?)`: Asserts that `actual` and `expected` are strictly equal
- `assertTrue(value, message?)`: Asserts that `value` is true
- `assertFalse(value, message?)`: Asserts that `value` is false

## Database Migrations

### Creating a Migration

To create a new migration:
```bash
deno task migration <migration-name>
```

### Applying Migrations

To apply migrations:
```bash
deno task migrate
```

### Updating Database Types

After making changes to the database schema, update the TypeScript types:

For local development:
```bash
deno task update-types-local
```

For linked Supabase project:
```bash
deno task update-types-linked
```

## Code Style and Formatting

### Formatting

The project uses Deno's built-in formatter. To format the code:
```bash
deno task format
```

### Linting

To lint the code:
```bash
deno task lint
```

### Pre-commit Hooks

The project uses pre-commit hooks to ensure code quality. The hooks run formatting and linting before each commit.

To install the hooks:
```bash
deno task hook
```

## Project Structure

- `src/web`: React frontend application
  - `src/app.tsx`: Main application component
  - `src/main.tsx`: Entry point
  - `src/data`: Data fetching and state management
  - `src/i18n`: Internationalization
  - `src/lib`: Utility functions
  - `src/ui`: UI components
  - `src/view`: Page components

- `src/shared`: Shared code between frontend and backend
  - `db.ts`: Database utilities
  - `db.types.ts`: Generated TypeScript types for the database schema

- `supabase/functions`: Supabase Edge Functions
  - `_shared`: Shared utilities for functions
  - `tests`: Test files for functions