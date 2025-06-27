#!/bin/zsh
# Script to kill process on port 3000 and start npm run dev

PORT=3000
PID=$(lsof -ti :$PORT)
if [ ! -z "$PID" ]; then
  echo "Killing process on port $PORT (PID: $PID)"
  kill -9 $PID
else
  echo "No process running on port $PORT"
fi

echo "Starting: npm run dev"
npm run dev
