#!/usr/bin/env bash
#
# Starts the backend and the frontend together. Press Ctrl+C to stop both.
#
#   ./start.sh
#
set -euo pipefail

cd "$(dirname "$0")"
ROOT="$(pwd)"

# --- Backend (FastAPI) -------------------------------------------------
if [ ! -d "$ROOT/backend/.venv" ]; then
  echo "==> Creating the Python virtual environment"
  python3 -m venv "$ROOT/backend/.venv"
fi

echo "==> Installing Python dependencies"
"$ROOT/backend/.venv/bin/pip" install --quiet --upgrade pip
"$ROOT/backend/.venv/bin/pip" install --quiet -r "$ROOT/backend/requirements.txt"

# --- Frontend (React + Vite) -------------------------------------------
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  echo "==> Installing JavaScript dependencies"
  (cd "$ROOT/frontend" && npm install --no-fund --no-audit)
fi

# --- Run both ---------------------------------------------------------
(cd "$ROOT/backend" && "$ROOT/backend/.venv/bin/uvicorn" main:app --reload --port 8001) &
BACKEND_PID=$!

(cd "$ROOT/frontend" && npm run dev) &
FRONTEND_PID=$!

# Ctrl+C (or either server dying) stops the other one too.
trap 'echo; echo "==> Stopping both servers"; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true' INT TERM EXIT

echo
echo "  Todo app:      http://127.0.0.1:5174"
echo "  API docs:      http://127.0.0.1:8001/docs"
echo "  Stop with:     Ctrl+C"
echo

wait
