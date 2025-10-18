#!/usr/bin/env bash
# create-project.sh
# Usage: ./create-project.sh [project-name] [style] [routing]
# Defaults: project-name=snack-crate-app, style=css, routing=false

set -euo pipefail

PROJECT="${1:-snack-crate-app}"
STYLE="${2:-css}"
ROUTING="${3:-false}"

if ! command -v ng >/dev/null 2>&1; then
    echo "Angular CLI not found. Install it with: npm install -g @angular/cli"
    exit 1
fi

echo "Creating Angular project: $PROJECT (standalone, routing=$ROUTING, style=$STYLE)"
ng new "$PROJECT" --standalone --routing "$ROUTING" --style "$STYLE"

cd "$PROJECT" || exit 1
echo "Created project at: $(pwd)"
echo "Next steps:"
echo "  cd $PROJECT"
echo "  ng serve --open"