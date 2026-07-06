#!/bin/sh
set -e

REQUIRED=$(tr -d '[:space:]' < apps/api/.python-version)

if ! command -v uv >/dev/null 2>&1; then
  echo "❌ uv is required for Python $REQUIRED. Install: https://docs.astral.sh/uv/"
  exit 1
fi

CURRENT=$(
  cd apps/api &&
    uv run python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}')"
)

if [ "$CURRENT" != "$REQUIRED" ]; then
  echo "❌ Python $REQUIRED required (found $CURRENT). Run: cd apps/api && uv sync"
  exit 1
fi
 