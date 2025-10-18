#!/usr/bin/env bash
# build.sh — build Angular production bundle with configurable base-href
# Usage: ./build.sh [BASE_HREF] [CONFIG]
# Example: ./build.sh /snack-crate-angular/ production

set -euo pipefail

BASE_HREF="${1:-/snack-crate-angular/}"
CONFIG="${2:-production}"

if ! command -v ng >/dev/null 2>&1; then
    echo "Error: Angular CLI 'ng' not found. Install @angular/cli or use the workspace npm scripts." >&2
    exit 1
fi

echo "Building with base-href='${BASE_HREF}' and configuration='${CONFIG}'..."
ng build --base-href="${BASE_HREF}" --configuration="${CONFIG}"

echo "Build complete. Output is in ./dist"