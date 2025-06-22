#!/bin/bash

# Build script for Kindle Weather Dashboard
# This script is used by Vercel for deployment

echo "Building Kindle Weather Dashboard..."

# Check if all required files exist
required_files=("kindle-server.js" "index.html" "kindle.css" "package.json" "vercel.json")

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "Error: Required file $file not found"
        exit 1
    fi
done

echo "All required files found"

# Install dependencies
echo "Installing dependencies..."
npm install --production

echo "Build completed successfully" 