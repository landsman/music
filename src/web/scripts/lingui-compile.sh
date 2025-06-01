#!/bin/bash

set -e  # Exit on error
set -u  # Exit on undefined variable

cd "$(dirname "$0")/.."
npx @lingui/cli compile