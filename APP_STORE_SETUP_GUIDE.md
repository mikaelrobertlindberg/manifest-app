# 🚀 APP STORE SETUP - TestFlight & Google Play Console

**Goal:** Sätt upp everything för att publicera Manifest app till TestFlight och Google Play

---

## **🍎 STEG 1: APPLE DEVELOPER ACCOUNT SETUP (15 min)**

### **A. Skapa Apple Developer Account:**
```bash
# Gå till: https://developer.apple.com/account/
# Klicka "Enroll" 
# Välj "Individual" account typ
# Betala $99/år med ditt kort
# Verification tar 24-48h men du kan börja setup direkt
```

### **B. App ID Registration:**
```bash
# Efter inloggning på developer.apple.com:
# Gå till "Certificates, IDs & Profiles"
# Klicka "Identifiers" → "+" → "App IDs"
# Description: "Manifest Svenska Tacksamhet"
# Bundle ID: "com.littlebear.manifest" (viktigt - kom ihåg detta!)
# Capabilities: Välja "Push Notifications" för reminders
# Klicka "Register"
```

### **C. App Store Connect Setup:**
```bash
# Gå till: https://appstoreconnect.apple.com
# Klicka "My Apps" → "+" → "New App"
# Platform: iOS
# Name: "Manifest - Svenska Tacksamhet"
# Primary Language: Swedish
# Bundle ID: välj "com.littlebear.manifest" från dropdown
# SKU: "manifest-se-2024"
# Klicka "Create"
```

---

## **🤖 STEG 2: GOOGLE PLAY CONSOLE SETUP (10 min)**

### **A. Skapa Google Play Developer Account:**
```bash
# Gå till: https://play.google.com/console/signup
# Logga in med ditt Google account
# Välj "Individual" developer
# Betala $25 registration fee (engångskostnad)
# Fyll i developer profile information
```

### **B. Skapa Manifest App:**
```bash
# I Play Console dashboard:
# Klicka "Create app"
# App name: "Manifest - Svenska Tacksamhet"
# Default language: Swedish
# App or game: App
# Free or paid: Free (för nu)
# Content rating: Everyone
# Privacy policy URL: (vi fixar detta senare)
# Klicka "Create app"
```

---

## **⚙️ STEG 3: INSTALLERA UTVECKLINGSVERKTYG (20 min)**

### **A. Installera EAS CLI:**
```bash
cd projects/manifest-app/ManifestApp

# Installera EAS CLI globalt
npm install -g @expo/eas-cli

# Logga in till Expo
eas login
# (Skapa Expo account om du inte har: https://expo.dev/signup)

# Verifiera installation
eas --version
```

### **B. Konfigurera EAS för projektet:**
```bash
# I ManifestApp directory:
eas build:configure

# Detta skapar eas.json file med build profiles
# Välj "All" när den frågar om platforms
```

### **C. Skapa produktions-ready app.json:**
```bash
# Uppdatera app.json med production settings:
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Manifest - Svenska Tacksamhet",
    "slug": "manifest-svenska-tacksamhet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.littlebear.manifest",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.littlebear.manifest",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_PROJECT_ID_HERE"
      }
    }
  }
}
EOF
```

---

## **📱 STEG 4: SKAPA APP ASSETS (30 min)**

### **A. Skapa Icon Files:**
```bash
# Spara din aurora meditation woman som dessa filer i assets/

# assets/icon.png - 1024x1024 (main app icon)
# assets/adaptive-icon.png - 1024x1024 (Android adaptive)  
# assets/splash.png - 1284x2778 (iPhone splash)
# assets/favicon.png - 48x48 (web favicon)

# Tips: Använd figma.com för att resize din aurora image
```

### **B. Test Local Assets:**
```bash
# Starta development server för att testa icons:
npm start

# Öppna på telefon via Expo Go för att se hur icons ser ut
```

---

## **🔨 STEG 5: FÖRSTA PRODUCTION BUILD (45 min)**

### **A. iOS TestFlight Build:**
```bash
# Bygg för iOS TestFlight:
eas build --platform ios --profile preview

# Detta tar ~20-30 minuter
# Du får en .ipa fil som kan submitas till TestFlight
```

### **B. Android Production Build:**
```bash
# Bygg för Google Play:
eas build --platform android --profile production  

# Detta tar ~15-20 minuter
# Du får en .aab fil för Google Play Store
```

### **C. Submit till TestFlight:**
```bash
# Efter iOS build är klar:
eas submit --platform ios

# Detta submitar automatiskt till TestFlight
# Takes 5-10 minutes to process
```

---

## **📋 STEG 6: APP STORE LISTINGS (1 timme)**

### **A. iOS App Store Connect:**
```bash
# På appstoreconnect.apple.com:
# Gå till din "Manifest" app

# App Information:
# - Privacy Policy URL: https://manifest-app.se/privacy (skapa denna)
# - Category: Health & Fitness > Mind & Body
# - Content Rights: "Contains third-party content" = No

# Pricing and Availability:
# - Price: Free
# - Availability: All countries

# App Store Information:
# - Subtitle: "Svenska Tacksamhetsdagbok"
# - Description: "Utveckla daglig tacksamhet med aurora meditation..."
# - Keywords: "tacksamhet,gratitude,mindfulness,meditation,svenska,lagom"
# - Screenshots: (ta från din telefon i Expo Go)
```

### **B. Google Play Console Listing:**
```bash
# I Play Console för din Manifest app:

# Store listing:
# - Short description: "Sveriges första aurora meditation tacksamhetsapp"
# - Full description: "Utveckla daglig tacksamhet med vackra aurora meditation..."
# - Graphics: Upload aurora meditation woman som feature graphic
# - Screenshots: Android screenshots från din telefon

# Content rating:
# - Kör through questionnaire (all "No" för basic gratitude app)
# - Rating blir "Everyone"

# Target audience:
# - Age groups: 18+ (mindfulness content)
```

---

## **🔐 STEG 7: SIGNING & CERTIFICATES (30 min)**

### **A. iOS Certificates (EAS hanterar detta automatiskt):**
```bash
# EAS CLI kommer fråga om certificates första gången:
# "Do you want us to handle iOS credentials?" → YES
# "Do you want to generate a new Apple Distribution Certificate?" → YES
# "Do you want to generate a new Apple Provisioning Profile?" → YES

# EAS hanterar allt automatiskt!
```

### **B. Android Signing (EAS hanterar detta också):**
```bash
# För Android signing:
# "Do you want to generate a new Android Keystore?" → YES  
# EAS skapar och hanterar Android keystore automatically
```

---

## **✅ VERIFICATION CHECKLIST:**

### **🍎 iOS TestFlight Ready:**
- [ ] Apple Developer Account created & paid ($99/år)
- [ ] App ID registered (com.littlebear.manifest)
- [ ] App Store Connect app created
- [ ] EAS CLI installed and configured
- [ ] iOS build completed successfully
- [ ] App submitted to TestFlight
- [ ] App Store listing completed

### **🤖 Google Play Ready:**
- [ ] Google Play Developer Account created & paid ($25)
- [ ] Play Console app created  
- [ ] Android build completed successfully
- [ ] Store listing completed
- [ ] Content rating completed
- [ ] Ready för internal testing

---

## **🚀 EXECUTION PLAN - DO THIS NOW:**

### **NEXT 2 HOURS:**
```bash
# 1. Skapa Apple Developer Account (15 min)
https://developer.apple.com/account/

# 2. Skapa Google Play Console Account (10 min)  
https://play.google.com/console/signup

# 3. Installera EAS CLI (5 min)
cd projects/manifest-app/ManifestApp
npm install -g @expo/eas-cli
eas login

# 4. Configure EAS (5 min)
eas build:configure

# 5. Starta första builds (submit och vänta ~45 min)
eas build --platform ios --profile preview
eas build --platform android --profile production
```

### **NEXT 3-4 HOURS:**
```bash
# 6. Skapa app store listings medan builds kör
# 7. Upload aurora meditation woman assets  
# 8. Submit till TestFlight när iOS build är klar
# 9. Internal testing på Google Play när Android build är klar
```

---

## **💰 TOTAL COST TODAY:**
- 🍎 **Apple Developer:** $99/år
- 🤖 **Google Play:** $25 engångskostnad  
- **TOTAL: $124**

---

## **🎯 START NOW:**

**Börja med Apple Developer signup immediately:**
```
https://developer.apple.com/account/
```

**Sedan Google Play Console:**
```  
https://play.google.com/console/signup
```

**Want me to walk through each step as you do it? 🚀**