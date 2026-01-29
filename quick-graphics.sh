#!/bin/bash
#
# QUICK GRAPHICS GENERATOR - ONE COMMAND SOLUTION
# Generates all Manifest App graphics automatically
#

echo "🤖 AUTOMATIC GRAPHICS GENERATOR - DEVPI CLI"
echo "🎨 Transforming Manifest App to premium Calm-inspired design..."
echo ""

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js not found. Please install Node.js."
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm not found. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm found"

# Check for API keys
API_SERVICE="mock"
OPENAI_KEY=""

if [ -f "/home/devpi/clawd/config/openai.json" ]; then
    echo "✅ OpenAI config found"
    API_SERVICE="dalle"
elif [ ! -z "$OPENAI_API_KEY" ] && [ "$OPENAI_API_KEY" != "sk-local-tts-1234567890" ]; then
    echo "✅ OpenAI API key found in environment"
    API_SERVICE="dalle"
else
    echo "📋 No OpenAI API key found - using mock graphics for testing"
    echo "   (This still creates beautiful colored placeholders that work perfectly!)"
    API_SERVICE="mock"
fi

echo ""
echo "🚀 Starting automatic graphics generation..."
echo "📊 Service: $API_SERVICE"
echo ""

# Install canvas if not available (for mock graphics)
if [ "$API_SERVICE" = "mock" ]; then
    echo "🎨 Setting up canvas for mock graphics..."
    if ! node -e "require('canvas')" 2>/dev/null; then
        echo "📦 Installing canvas for graphic generation..."
        npm install --no-save canvas 2>/dev/null || {
            echo "⚠️ Canvas install failed - using text placeholders instead"
        }
    fi
fi

# Run the graphics generator
echo "🎨 Generating graphics..."
node generate-graphics-cli.js --service="$API_SERVICE"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Graphics generated and integrated!"
    echo ""
    echo "📱 Next steps to see your premium app:"
    echo "   1. cd ManifestApp"
    echo "   2. npm start (restart Expo server)"
    echo "   3. Reload app on iPhone"
    echo "   4. Enjoy the transformation! 🐻✨"
    echo ""
    
    # Check if Expo server is running and offer to restart
    if pgrep -f "expo start\|metro" > /dev/null; then
        echo "🔄 Expo server detected running. Restart recommended for new graphics."
        echo "   Run: pkill -f expo && cd ManifestApp && npm start"
    fi
    
    echo "🌟 Your Swedish gratitude app now has premium Calm-inspired design!"
else
    echo ""
    echo "❌ Graphics generation failed. See error messages above."
    exit 1
fi