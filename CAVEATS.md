# Caveats

## `esbuild` explicit dependency (`src/web/deno.json`)

`esbuild` is listed as an explicit dependency even though the project does not use it directly.

**Why:** Vite 8 switched from esbuild to Rolldown/Oxc and no longer bundles esbuild. `@deno/vite-plugin` still depends on it internally, so it must be declared explicitly or CI builds fail with `ERR_MODULE_NOT_FOUND`.

**Remove when:** `@deno/vite-plugin` drops its esbuild dependency or declares it as its own dep. Check on upgrades of `@deno/vite-plugin`.

---

## `@lingui/vite-plugin` removed

The `@lingui/vite-plugin` Vite plugin was removed from `vite.config.ts` and `deno.json`.

**Why:** It crashes Vite 8 with `TypeError: Cannot convert undefined or null to object` during the transform phase. Tracked upstream at https://github.com/lingui/js-lingui/issues.

**Workaround:** Lingui macros are handled by `@lingui/babel-plugin-lingui-macro` inside `@vitejs/plugin-react`. Catalog compilation still works via `deno task compile`.

**Re-add when:** `@lingui/vite-plugin` ships Vite 8 support.
