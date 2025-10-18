#!/usr/bin/env bash
# install-angular-cli.sh
# Minimal installer: checks Node/npm, installs @angular/cli globally, verifies installation.

set -euo pipefail

command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install Node.js first." >&2; exit 1; }
command -v npm >/dev/null 2>&1  || { echo "npm not found. Install Node.js (includes npm)." >&2; exit 1; }

echo "Node $(node -v), npm $(npm -v)"
echo "Installing @angular/cli globally..."

# Prefer sudo for non-root on Linux; on macOS sudo is usually fine too
if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
        sudo npm install -g @angular/cli
    else
        echo "sudo not available; running npm install -g as current user (may fail)." >&2
        npm install -g @angular/cli
    fi
else
    npm install -g @angular/cli
fi

echo "Verifying installation..."
if command -v ng >/dev/null 2>&1; then
    ng version
    echo "Angular CLI installed successfully."
else
    echo "Installation completed but 'ng' command not found." >&2
    exit 1
fi