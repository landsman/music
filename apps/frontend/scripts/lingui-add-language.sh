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
LOCALES_DIR="$WEB_DIR/src/i18n/locales"
CONFIG_FILE="$WEB_DIR/lingui.config.js"

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

echo "Language $LANG_CODE has been added successfully."
deno task extract
echo "Don't forget to update the translations in $LOCALES_DIR/$LANG_CODE/messages.po"
echo "Then run 'deno task compile' to compile them."
