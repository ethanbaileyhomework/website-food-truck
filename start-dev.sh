#!/bin/bash
# Load environment variables from .env.local and start the development server

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "ERROR: .env.local file not found!"
    echo ""
    echo "Please create a .env.local file with your GitHub OAuth credentials."
    echo "You can copy .env.local.example as a starting point:"
    echo "  cp .env.local.example .env.local"
    echo ""
    echo "Then edit .env.local and add your GitHub OAuth credentials from:"
    echo "  https://github.com/settings/applications/new"
    echo ""
    exit 1
fi

# Load variables from .env.local
echo "Loading environment variables from .env.local..."
set -a
source .env.local
set +a

echo ""
echo "Environment variables loaded. Starting development server..."
npm run dev
