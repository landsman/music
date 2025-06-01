#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

# Check if a language code was provided
if [ -z "$1" ]; then
  echo "Usage: $0 <language-code>"
  echo "Example: $0 cs"
  exit 1
fi

# Set variables
LANG_CODE=$1
SCRIPT_DIR="$(dirname "$0")"
WEB_DIR="$SCRIPT_DIR/.."
CONFIG_FILE="$WEB_DIR/lingui.config.js"
I18N_FILE="$WEB_DIR/src/i18n/i18n.ts"

# Update the lingui.config.js file to include the new language
# First, check if the language is already in the config
if grep -q "\"$LANG_CODE\"" "$CONFIG_FILE"; then
  echo "Language $LANG_CODE is already in the config file."
else
  # Add the new language to the locales array
  sed -i.bak "s/locales: \[\([^]]*\)\]/locales: [\1, \"$LANG_CODE\"]/" "$CONFIG_FILE"
  # Remove the backup file
  rm "$CONFIG_FILE.bak"
  echo "Added language $LANG_CODE to the config file."
fi

# Update the i18n.ts file to include the new language's messages
# First, check if the language is already in the i18n.ts file
if grep -q "$LANG_CODE:" "$I18N_FILE"; then
  echo "Language $LANG_CODE is already in the i18n.ts file."
else
  # Add the new language to the i18n.load call
  sed -i.bak "s/i18n.load({/i18n.load({\n  $LANG_CODE: enMessages.messages,/" "$I18N_FILE"
  # Remove the backup file
  rm "$I18N_FILE.bak"
  echo "Added language $LANG_CODE to the i18n.ts file."
fi

echo "Language $LANG_CODE has been added successfully."
echo "You can now run 'deno task extract' to extract messages and 'deno task compile' to compile them."
echo "Don't forget to update the translations in $LOCALES_DIR/$LANG_CODE/messages.po"