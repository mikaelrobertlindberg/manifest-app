#!/bin/bash

# MANIFEST APP - AUTOMATISK INSTALLATION
# Skapar hela React Native appen automatiskt på DevPi

echo "🌿 MANIFEST APP - AUTOMATISK INSTALLATION STARTAR"
echo "=================================================="

# Gå till rätt mapp
cd /home/devpi/clawd/projects/manifest-app/

# Kontrollera att Expo CLI är installerat
echo "📦 Kontrollerar Expo CLI..."
if ! command -v expo &> /dev/null; then
    echo "⚠️  Expo CLI inte installerat, installerar nu..."
    npm install -g @expo/cli expo-cli
    echo "✅ Expo CLI installerat"
else
    echo "✅ Expo CLI redan installerat"
fi

# Skapa React Native projektet
echo ""
echo "🚀 Skapar React Native projekt..."
if [ ! -d "ManifestApp" ]; then
    npx create-expo-app ManifestApp --template blank-typescript
    echo "✅ Projekt skapat"
else
    echo "✅ Projekt finns redan"
fi

# Gå in i projektmappen
cd ManifestApp

# Installera alla dependencies
echo ""
echo "📦 Installerar dependencies..."
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @reduxjs/toolkit react-redux redux-persist
npm install @react-native-async-storage/async-storage
npm install firebase
npm install styled-components react-native-paper
npm install @types/styled-components-react-native
npm install expo-notifications
npm install -D @types/react @types/react-native

echo "✅ Dependencies installerade"

# Skapa projektstruktur
echo ""
echo "📁 Skapar projektstruktur..."
mkdir -p src/components/Button
mkdir -p src/components/Input
mkdir -p src/screens/TodayScreen
mkdir -p src/screens/HistoryScreen  
mkdir -p src/screens/SettingsScreen
mkdir -p src/store/slices
mkdir -p src/services/firebase
mkdir -p src/theme
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/navigation
mkdir -p assets/images

echo "✅ Projektstruktur skapad"

echo ""
echo "🎉 INSTALLATION SLUTFÖRD!"
echo "========================="
echo ""
echo "Nästa steg:"
echo "1. cd /home/devpi/clawd/projects/manifest-app/ManifestApp"
echo "2. npm start"
echo "3. Skanna QR-koden med Expo Go appen på telefonen"
echo ""
echo "🌿 Lycka till!"