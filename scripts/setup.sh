#!/bin/bash
# Setup script for ODIN project

echo "Setting up ODIN monorepo..."

# Install root dependencies
echo "Installing dependencies..."
cd "$(dirname "$0")"
npm install

# Build all packages
echo "Building packages..."
npx tsc --build packages/core/tsconfig.json
npx tsc --build packages/engine/tsconfig.json
npx tsc --build packages/storage/tsconfig.json
npx tsc --build apps/api/tsconfig.json
npx tsc --build apps/worker/tsconfig.json

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and configure your environment"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Run 'npm test' to execute tests"