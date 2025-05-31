#!/bin/bash
# deno-outdated.sh
# This script checks for outdated Deno dependencies and formats the output for GitHub Actions
# It removes ANSI color codes and formats the result as a code block

# Check for outdated dependencies with quiet and recursive flags
OUTDATED="$(deno outdated -qr)"

# If no outdated dependencies are found, output "none", otherwise format the output
if [ -z "$OUTDATED" ]; then
  echo "none" > outdated.md
else
  # Remove ANSI color codes from the output
  echo "$OUTDATED" | sed -r 's/\x1B\[[0-9;]*[mK]//g' > outdated.md
fi

# Add the result to GitHub Actions output as a code block
echo "result<<EOF" >> "$GITHUB_OUTPUT"
echo '```text' >> "$GITHUB_OUTPUT"
cat outdated.md >> "$GITHUB_OUTPUT"
echo '```' >> "$GITHUB_OUTPUT"
echo "EOF" >> "$GITHUB_OUTPUT"
