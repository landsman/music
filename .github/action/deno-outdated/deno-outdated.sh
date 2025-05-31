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
  # Make sure the format-markdown.sh file is executable
  chmod +x "$(dirname "$0")/markdown/format-markdown.sh"

  # Use the format-markdown.sh script to convert the output to markdown
  echo "$OUTDATED" | "$(dirname "$0")/markdown/format-markdown.sh" > "$TMP_FILE"
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
