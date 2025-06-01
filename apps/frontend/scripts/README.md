# Lingui Scripts

This directory contains scripts for working with Lingui, a localization library
for JavaScript.

## Available Scripts

### lingui-extract.sh

Extracts messages from source files and updates the message catalogs.

```bash
deno task extract
```

### lingui-compile.sh

Compiles message catalogs for production.

```bash
deno task compile
```

### lingui-add-language.sh

Adds a new language to the project.

```bash
deno task add-language <language-code>
```

Example:

```bash
deno task add-language fr
```

This will:

1. Update the lingui.config.js file to include the new language
2. Create the directory structure for the new language
3. Initialize the PO file for the new language by copying the English one and
   updating the Language field
4. Update the i18n.ts file to include the new language's messages

After adding a new language, you should:

1. Run `deno task extract` to extract messages
2. Update the translations in the new language's PO file
   (src/i18n/locales/<language-code>/messages.po)
3. Run `deno task compile` to compile the message catalogs
4. Update the i18n.ts file to activate the new language if needed

## Language Activation

By default, the English language is activated. To activate a different language,
you can update the i18n.ts file:

```typescript
// Initialize Lingui with messages
i18n.load({
  en: enMessages.messages,
  fr: enMessages.messages,
});
i18n.activate("fr"); // Change this to activate a different language
```
