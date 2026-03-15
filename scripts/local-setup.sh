#!/usr/bin/env bash
set -euo pipefail

echo "Starting local infrastructure..."
docker-compose up -d

echo "Installing backend deps..."
npm --prefix ./apps/backend install

echo "Applying migrations..."
npm --prefix ./apps/backend run migrate

echo "Installing frontend deps..."
npm --prefix ./apps/frontend install

echo "Done. Start backend: npm --prefix ./apps/backend run dev"
echo "Start frontend: npm --prefix ./apps/frontend run dev"
