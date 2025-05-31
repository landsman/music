#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

# Create a sample ASCII table similar to the output of `deno outdated`
SAMPLE_TABLE="┌───────────────────────────┬─────────┬─────────┬───────────────┐
│ Package                   │ Current │ Update  │ Latest        │
├───────────────────────────┼─────────┼─────────┼───────────────┤
│ jsr:@supabase/supabase-js │ 2.49.8  │ 2.49.8  │ 2.49.9-next.2 │
├───────────────────────────┼─────────┼─────────┼───────────────┤
│ npm:lucide-react          │ 0.484.0 │ 0.484.0 │ 0.511.0       │
├───────────────────────────┼─────────┼─────────┼───────────────┤
│ npm:react                 │ 19.0.0  │ 19.0.0  │ 19.1.0        │
└───────────────────────────┴─────────┴─────────┴───────────────┘"

# Expected markdown output
EXPECTED_OUTPUT="Package|Current|Update|Latest
---|---|---|---
jsr:@supabase/supabase-js|2.49.8|2.49.8|2.49.9-next.2
npm:lucide-react|0.484.0|0.484.0|0.511.0
npm:react|19.0.0|19.0.0|19.1.0"

# Run the format-markdown.sh script on the sample table
ACTUAL_OUTPUT=$(echo "$SAMPLE_TABLE" | "$(dirname "$0")/format-markdown.sh")

# Compare the actual output with the expected output
if [ "$ACTUAL_OUTPUT" = "$EXPECTED_OUTPUT" ]; then
  echo "Test passed! The format-markdown.sh script produces the expected output."
else
  echo "Test failed! The format-markdown.sh script does not produce the expected output."
  echo "Expected:"
  echo "$EXPECTED_OUTPUT"
  echo "Actual:"
  echo "$ACTUAL_OUTPUT"
  exit 1
fi
