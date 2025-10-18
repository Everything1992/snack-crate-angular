#!/usr/bin/env bash
set -euo pipefail

# build-prod.sh
# Lightweight production build helper for Node/JS projects.
# Usage: ./build-prod.sh [--no-install] [--skip-tests] [--clean] [--archive]
# - --no-install : skip dependency install
# - --skip-tests : skip running tests (if any)
# - --clean      : remove common build dirs before building (dist, build)
# - --archive    : create build-archive.tar.gz of the output folder (dist or build)

NO_INSTALL=false
SKIP_TESTS=false
CLEAN=false
ARCHIVE=false

for arg in "$@"; do
    case "$arg" in
        --no-install) NO_INSTALL=true ;;
        --skip-tests) SKIP_TESTS=true ;;
        --clean) CLEAN=true ;;
        --archive) ARCHIVE=true ;;
        -h|--help)
            sed -n '1,120p' "$0"
            exit 0
            ;;
        *) echo "Unknown option: $arg"; exit 2 ;;
    esac
done

# Ensure Node is available
command -v node >/dev/null 2>&1 || { echo "node is required but not found"; exit 1; }

# Detect package manager
PKG_MANAGER="npm"
if [[ -f "yarn.lock" ]]; then
    PKG_MANAGER="yarn"
elif [[ -f "pnpm-lock.yaml" ]]; then
    PKG_MANAGER="pnpm"
fi

echo "Using package manager: $PKG_MANAGER"
export NODE_ENV=production
echo "NODE_ENV=production"

# Optional clean
if [[ "$CLEAN" == true ]]; then
    echo "Cleaning common build directories..."
    rm -rf dist build .parcel-cache .next
fi

# Install dependencies unless skipped
if [[ "$NO_INSTALL" == false ]]; then
    echo "Installing dependencies..."
    case "$PKG_MANAGER" in
        yarn)
            if command -v yarn >/dev/null 2>&1; then
                yarn install --frozen-lockfile
            else
                echo "yarn not found"; exit 1
            fi
            ;;
        pnpm)
            if command -v pnpm >/dev/null 2>&1; then
                pnpm install --frozen-lockfile
            else
                echo "pnpm not found"; exit 1
            fi
            ;;
        npm)
            if command -v npm >/dev/null 2>&1; then
                if [[ -f "package-lock.json" ]]; then
                    npm ci
                else
                    npm install
                fi
            else
                echo "npm not found"; exit 1
            fi
            ;;
    esac
fi

# Helper to check if a script exists in package.json
has_script() {
    node -e "console.log(!!(require('./package.json').scripts && require('./package.json').scripts['$1']))" 2>/dev/null
}

# Run tests if script exists and not skipped
if [[ "$SKIP_TESTS" == false ]] && [[ $(has_script test) == "true" ]]; then
    echo "Running tests..."
    case "$PKG_MANAGER" in
        yarn) yarn test ;;
        pnpm) pnpm test ;;
        npm) npm test ;;
    esac
else
    echo "Skipping tests."
fi

# Run build script
if [[ $(has_script build) == "true" ]]; then
    echo "Running build..."
    case "$PKG_MANAGER" in
        yarn) yarn build ;;
        pnpm) pnpm build ;;
        npm) npm run build ;;
    esac
else
    echo "No 'build' script defined in package.json"; exit 1
fi

# Determine output folder to archive if requested
if [[ "$ARCHIVE" == true ]]; then
    OUT_DIR=""
    for candidate in dist build; do
        if [[ -d "$candidate" ]]; then
            OUT_DIR="$candidate"
            break
        fi
    done

    if [[ -z "$OUT_DIR" ]]; then
        echo "No output directory (dist or build) found to archive"
        exit 1
    fi

    ARCHIVE_NAME="build-archive-$(date +%Y%m%dT%H%M%S).tar.gz"
    echo "Creating archive $ARCHIVE_NAME from $OUT_DIR"
    tar -czf "$ARCHIVE_NAME" "$OUT_DIR"
    echo "Archive created: $ARCHIVE_NAME"
fi

echo "Production build complete."