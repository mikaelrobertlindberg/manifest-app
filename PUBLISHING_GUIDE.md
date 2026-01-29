# 📱 MANIFEST APP - PUBLISHING GUIDE

## Mike's fråga:
*"Om jag vill prova att publicera det på riktigt som developer app. Hur gör vi då? Kan jag även få samma app för Android?"*

---

## 🎯 SVAR: JA! Samma app för iOS & Android!

**React Native = En kodbas → båda plattformarna automatiskt** ✅

---

## 📋 FÖRUTSÄTTNINGAR:

### 🍎 **För iOS (App Store):**
- **Apple Developer Account** ($99/år)
- **Mac** (för final upload, men EAS Build kan bygga på molnet)

### 🤖 **För Android (Google Play):**
- **Google Play Developer Account** ($25 engångsavgift)
- **Vilken dator som helst** (Linux/Windows/Mac)

---

## 🚀 PUBLISHING PROCESS:

### **Steg 1: Förbered appen**
```bash
cd projects/manifest-app/ManifestApp

# Uppdatera version i app.json
# "version": "1.0.0" → "1.0.1"

# Uppdatera app metadata
# "name": "Manifest - Svenska Tacksamhetsdagbok"
# "slug": "manifest-svenska-tacksamhet" 
```

### **Steg 2: Skapa Production Builds**
```bash
# Installera EAS CLI (bygger på molnet)
npm install -g @expo/eas-cli

# Logga in på Expo
eas login

# Konfigurera build profiles
eas build:configure

# Bygg för båda plattformarna
eas build --platform all
```

### **Steg 3: iOS App Store**
```bash
# Bygg iOS production
eas build --platform ios --profile production

# Ladda upp till App Store Connect
eas submit --platform ios
```

### **Steg 4: Google Play Store**  
```bash
# Bygg Android production
eas build --platform android --profile production

# Ladda upp till Google Play Console
eas submit --platform android
```

---

## 📊 TIDSPLAN & KOSTNADER:

### 💰 **KOSTNADER:**
- **Apple Developer:** $99/år (för iOS)
- **Google Play:** $25 engångsavgift (för Android)  
- **Expo EAS Build:** Gratis tier (begränsade builds/månad)

### ⏰ **TIDSPLAN:**
- **App Review (iOS):** 1-7 dagar
- **App Review (Android):** 1-3 dagar
- **Setup första gången:** 2-4 timmar total

---

## 📱 APP STORE LISTINGS:

### 🍎 **iOS (App Store):**
**Titel:** Manifest - Svenska Tacksamhetsdagbok  
**Kategori:** Health & Fitness / Lifestyle  
**Beskrivning:**
```
En enkel och vacker svensk tacksamhetsdagbok som hjälper dig fokusera på det positiva i vardagen.

✨ FUNKTIONER:
• Skriv dagliga tacksamhetsinlägg på svenska  
• Smarta påminnelser som lär sig dina rutiner
• Offline-först: fungerar utan internet
• Inga annonser, ingen datainhämtning
• Minimalistisk design för mindfulness

🧘 PERFEKT FÖR:
• Morgon- och kvällsrutiner
• Stresshantering genom fokus på positiv
• Att bygga en tacksamhetsrutin
• Digital välbefinnande

Skapad i Sverige för svenska användare. Din data stannar lokalt på din telefon.
```

### 🤖 **Android (Google Play):**
Samma beskrivning + tillägga:
```
🔒 INTEGRITET:
• Ingen datainhämtning till servrar
• Fungerar 100% offline  
• Din tacksamhet stannar privat
```

---

## 🛠️ TEKNISK SETUP:

### **EAS Build Configuration (eas.json):**
```json
{
  "cli": {
    "version": ">= 7.8.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "node": "18.18.0"
    }
  },
  "submit": {
    "production": {}
  }
}
```

### **App Metadata (app.json):**
```json
{
  "expo": {
    "name": "Manifest",
    "slug": "manifest-svenska-tacksamhet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mikelindberg.manifest",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.mikelindberg.manifest",
      "versionCode": 1
    }
  }
}
```

---

## 🎨 ASSETS SOM BEHÖVS:

### **App Icons:**
- **iOS:** 1024x1024 PNG (App Store)  
- **Android:** 512x512 PNG (Google Play)
- **Adaptive Icon:** 1024x1024 PNG (Android)

### **Screenshots:**
- **iOS:** 6.7" & 5.5" skärmar (iPhone 15 Pro Max + iPhone SE)
- **Android:** Phone + Tablet screenshots
- **5-10 screenshots** som visar app-funktioner

---

## 🚦 DEPLOYMENT WORKFLOW:

### **Testing → Production:**
1. **Internal Testing** (TestFlight/Internal App Sharing)
2. **Closed Beta** (25-100 testare)  
3. **Open Beta** (obegränsad)
4. **Production Release** (App Store + Google Play)

### **Continuous Deployment:**
```bash
# Update app
git commit -am "v1.0.1: Improved bell sounds"

# Build & deploy automatiskt
eas build --platform all --profile production
eas submit --platform all
```

---

## 🏆 SUCCESS METRICS:

### **Mål för Manifest app:**
- **Break-even:** 1,250 användare (20 SEK pris)
- **Target:** 5,000 användare första året  
- **Review Goal:** 4.5+ stjärnor
- **Retention:** 30%+ monthly active

### **Marketing Strategy:**
- **ASO:** Svensk SEO för "tacksamhetsdagbok", "gratitude journal svenska"
- **Social:** Instagram/TikTok med mindfulness-content
- **PR:** Svenska wellness-bloggar & podcaster
- **Launch:** Starta med iOS, Android 1-2 veckor senare

---

## 🚀 NÄSTA STEG:

1. ✅ **Ljuden klara** (dov bell cluster + lugna ackord)
2. 📝 **Skapa Developer Accounts** (Apple + Google)  
3. 🎨 **Design app icon & screenshots**
4. 🔨 **EAS Build setup** 
5. 📱 **TestFlight beta** med familj/vänner
6. 🌟 **Production launch!**

**🎯 Vill du börja med developer accounts eller ska vi fixa ljuden först?**