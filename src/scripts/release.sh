#!/bin/bash

# Release automation script for hospedate
# This script helps create releases with proper checks

set -e

echo "🚀 Hospedate Release Helper"
echo "============================"
echo ""

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH', not 'main' or 'master'"
    read -p "Do you want to continue? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "❌ Error: You have uncommitted changes"
    git status --short
    exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin $CURRENT_BRANCH

# Run tests
echo "🧪 Running tests..."
if npm test; then
    echo "✅ Tests passed!"
else
    echo "❌ Tests failed!"
    read -p "Do you want to continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run build
echo "🔨 Building project..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Show current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "📦 Current version: v$CURRENT_VERSION"
echo ""

# Ask for release type
echo "What type of release?"
echo "  1) Patch (bug fixes)         - v0.0.X"
echo "  2) Minor (new features)      - v0.X.0"
echo "  3) Major (breaking changes)  - vX.0.0"
echo "  4) Auto (based on commits)   - automatic"
echo "  5) Dry run (preview only)"
echo "  6) Cancel"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo "🐛 Creating patch release..."
        npm run release:patch
        ;;
    2)
        echo "✨ Creating minor release..."
        npm run release:minor
        ;;
    3)
        echo "💥 Creating major release..."
        npm run release:major
        ;;
    4)
        echo "🤖 Creating automatic release..."
        npm run release
        ;;
    5)
        echo "👀 Dry run..."
        npm run release:dry
        exit 0
        ;;
    6)
        echo "❌ Cancelled"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Show new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo ""
echo "✅ Released v$NEW_VERSION"
echo ""
echo "📝 Changelog updated in CHANGELOG.md"
echo "🏷️  Git tag created: v$NEW_VERSION"
echo "📤 Changes pushed to remote"
echo ""
echo "🎉 Release complete!"
