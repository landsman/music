#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

TMP_FILE="outdated_$(date +%s)_$$.md"

# Check for outdated dependencies with recursive flag (removed quiet flag to show all outdated dependencies)
OUTDATED="$(deno outdated -r)"
echo "$OUTDATED"

# If no outdated dependencies are found, output "none", otherwise format the output
if [ -z "$OUTDATED" ]; then
  echo "none" > "$TMP_FILE"
else
  # Remove ANSI color codes from the output and convert to markdown table format
  echo "$OUTDATED" > "$TMP_FILE"
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
