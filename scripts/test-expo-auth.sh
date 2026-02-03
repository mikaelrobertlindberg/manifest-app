#!/bin/bash

# Test Expo Authentication Script
# Run this locally to verify your EXPO_TOKEN works before pushing to Codemagic

set -e

echo "🔍 Testing Expo Authentication"
echo "================================"

# Check if token is provided
if [ -z "$EXPO_TOKEN" ]; then
    echo "❌ EXPO_TOKEN environment variable not set"
    echo "Usage: EXPO_TOKEN=your_token_here ./test-expo-auth.sh"
    echo "Or: export EXPO_TOKEN=your_token_here && ./test-expo-auth.sh"
    exit 1
fi

echo "✅ EXPO_TOKEN found (length: ${#EXPO_TOKEN} characters)"
echo "Token starts with: ${EXPO_TOKEN:0:10}..."

# Change to app directory
cd "$(dirname "$0")/../ManifestApp" || exit 1
echo "📁 Working directory: $(pwd)"

# Check if we have EAS CLI installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g @expo/eas-cli@latest
fi

echo "🔧 EAS CLI version: $(eas --version)"

# Set EAS_TOKEN for the CLI
export EAS_TOKEN="$EXPO_TOKEN"

echo ""
echo "🔐 Testing authentication..."

# Test whoami command
if eas whoami; then
    echo "✅ Primary authentication successful!"
else
    echo "⚠️  Primary auth failed, trying alternative method..."
    
    # Try token-stdin method
    if echo "$EXPO_TOKEN" | eas auth:login --token-stdin; then
        echo "✅ Alternative authentication successful!"
        eas whoami
    else
        echo "❌ All authentication methods failed"
        echo ""
        echo "Possible issues:"
        echo "1. Token is expired or invalid"
        echo "2. Network connectivity problems"
        echo "3. Expo service temporarily unavailable"
        echo ""
        echo "Try generating a new token:"
        echo "1. Go to https://expo.dev/accounts/[your-account]/settings/access-tokens"
        echo "2. Create a new token"
        echo "3. Update the EXPO_TOKEN value"
        exit 1
    fi
fi

echo ""
echo "🏗️  Testing build command syntax..."

# Test build command without actually building
if eas build --platform ios --profile ios-beta --help &> /dev/null; then
    echo "✅ Build command syntax is valid"
else
    echo "⚠️  Build command syntax check failed"
fi

echo ""
echo "📱 Project info:"
echo "Project ID: $(cat app.json | grep -o '"projectId": "[^"]*' | cut -d'"' -f4)"

echo ""
echo "🎯 Build profiles available:"
if [ -f "eas.json" ]; then
    # Extract build profiles from eas.json
    cat eas.json | jq -r '.build | keys[]' 2>/dev/null || {
        echo "Available profiles (manual parsing):"
        grep -A 20 '"build"' eas.json | grep -o '"[^"]*":' | sed 's/"//g' | sed 's/://g' | grep -v "build"
    }
else
    echo "❌ eas.json not found"
fi

echo ""
echo "✅ Authentication test completed successfully!"
echo ""
echo "Next steps:"
echo "1. Copy this working token to Codemagic environment variables"
echo "2. Ensure the environment variable group 'expo_credentials' includes EXPO_TOKEN"
echo "3. Run the updated codemagic.yaml workflow"