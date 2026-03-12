# IntelliJ IDEA Setup

The project uses Deno, which has its own module resolution (`.ts` extensions in imports, `npm:` specifiers, `deno.json` import maps). Without configuration, IntelliJ's built-in TypeScript service shows false positive errors like:

```
TS5097: An import path can only end with a .ts extension when allowImportingTsExtensions is enabled.
```

The project works fine — these are IDE-only errors.

## Fix: Enable the Deno Plugin

1. **Install the Deno plugin**
   `Settings → Plugins → Marketplace` → search **Deno** → Install → Restart

2. **Enable Deno for this project**
   `Settings → Languages & Frameworks → Deno`
   - Check **Enable Deno for this project**
   - Set **Deno executable path** (run `which deno` in terminal to find it)
   - The `deno.json` config file will be auto-detected

Once active, IntelliJ uses `deno lsp` instead of the built-in TypeScript service — all Deno-specific syntax is understood correctly.
