#!/bin/sh
set -e

REQUIRED=$(tr -d '[:space:]' < .nvmrc)
CURRENT=$(node -p "process.versions.node")

if [ "$CURRENT" != "$REQUIRED" ]; then
  echo "❌ Node $REQUIRED required (found $CURRENT). Run: nvm use"
  exit 1
fi
