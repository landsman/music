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
  echo "$OUTDATED" | sed -r 's/\x1B\[[0-9;]*[mK]//g' | awk '
  BEGIN { FS = "│"; OFS = "|" }
  /^┌|^└|^├/ { next }  # Skip separator lines
  /^│/ {  # Process table rows
    # Remove leading and trailing │ and spaces
    gsub(/^│|│$/, "");
    # Convert each cell by trimming spaces
    for (i=1; i<=NF; i++) {
      gsub(/^[[:space:]]+|[[:space:]]+$/, "", $i);
    }
    # Print as markdown table row with proper column alignment
    # Skip the first empty column if it exists
    if ($1 == "") {
      print "|" OFS $2 OFS $3 OFS $4 OFS $5 OFS;
    } else {
      print "|" OFS $1 OFS $2 OFS $3 OFS $4 OFS;
    }
    # Add header separator after the first data row
    if (NR == 2) {
      print "|---|---|---|---|";
    }
  }
  ' > "$TMP_FILE"
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
