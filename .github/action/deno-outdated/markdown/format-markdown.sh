#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

# Get the directory of the current script
SCRIPT_DIR="$(dirname "$0")"

# Make sure the awk script is executable
chmod +x "$SCRIPT_DIR/format-table.awk"

# Remove ANSI color codes from the output and convert to markdown table format using the external awk script
sed -r 's/\x1B\[[0-9;]*[mK]//g' | "$SCRIPT_DIR/format-table.awk"