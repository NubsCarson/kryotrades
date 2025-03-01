#!/bin/bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Set environment variables
export NEXT_TELEMETRY_DISABLED=1
export BROWSER=none

# Navigate to project directory
cd "$(dirname "$0")"

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    exit 1
fi

echo "Using Node.js $(node -v) and npm $(npm -v)"
echo "Starting Next.js development server..."

# Run the development server
npm run dev 