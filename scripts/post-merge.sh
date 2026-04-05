#!/bin/bash
set -e
# Use npm CI to install from package-lock.json
npm ci --prefer-offline --no-audit --no-fund
# Run the db push script inside the workspace package
npm -w @workspace/db run push
