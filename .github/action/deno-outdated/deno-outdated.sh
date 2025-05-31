#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

TMP_FILE="outdated_$(date +%s)_$RANDOM.md"

# Check for outdated dependencies with quiet and recursive flags
OUTDATED="$(deno outdated -qr)"
echo "$OUTDATED"

# If no outdated dependencies are found, output "none", otherwise format the output
if [ -z "$OUTDATED" ]; then
  echo "none" > "$TMP_FILE"
else
  # Remove ANSI color codes from the output
  echo "$OUTDATED" | sed -r 's/\x1B\[[0-9;]*[mK]//g' > "$TMP_FILE"
fi

# If running in GitHub Actions, add the result to GitHub Actions output
if [ -n "$GITHUB_OUTPUT" ]; then
  {
    echo "result<<EOF"
    cat "$TMP_FILE"
    echo "EOF"
    rm "$TMP_FILE"
  } >> "$GITHUB_OUTPUT"
else
  echo "Outdated dependencies:"
  cat "$TMP_FILE"
fi

