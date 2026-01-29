# 🚀 SNABB PUBLISHING GUIDE - MANIFEST APP

## Mike's fråga: "Hur publicerar jag detta som en riktig app?"

---

## ⚡ SNABBA SVAR:

### ✅ **JA - Samma app automatiskt för iOS + Android!**
React Native = En kodbas → båda plattformarna

### 💰 **Kostnad:**
- **iOS:** $99/år (Apple Developer)  
- **Android:** $25 engångsavgift (Google Play)

### ⏰ **Tid:**
- **Setup:** 2-4 timmar första gången
- **Review:** 1-7 dagar per plattform

---

## 📋 STEG-FÖR-STEG (enkelt):

### **1️⃣ Skaffa Developer Accounts**
```bash
# iOS
https://developer.apple.com/programs/
→ Apple Developer Program ($99/år)

# Android  
https://play.google.com/console/
→ Google Play Console ($25 engång)
```

### **2️⃣ Installera EAS CLI**
```bash
cd projects/manifest-app/ManifestApp
npm install -g @expo/eas-cli
eas login
```

### **3️⃣ Konfigurera för Production**
```bash
# Uppdatera app.json med riktiga detaljer
eas build:configure
```

### **4️⃣ Bygg för båda plattformarna**
```bash
# Detta bygger på Expo's moln-servrar (gratis tier)
eas build --platform all --profile production
```

### **5️⃣ Ladda upp till App Stores**
```bash
# iOS → App Store Connect
eas submit --platform ios

# Android → Google Play Console  
eas submit --platform android
```

### **6️⃣ Vänta på godkännande**
- **iOS:** 1-7 dagar review
- **Android:** 1-3 dagar review

---

## 🎨 **APP METADATA (behövs innan submit):**

### **App Info:**
- **Titel:** "Manifest - Svenska Tacksamhetsdagbok"
- **Beskrivning:** "En enkel och vacker svensk tacksamhetsdagbok..."
- **Kategori:** Health & Fitness / Lifestyle
- **Pris:** 20 SEK (för break-even vid 1,250 användare)

### **Assets som behövs:**
- **App Icon:** 1024x1024 PNG
- **Screenshots:** 5-10 bilder av app-funktioner
- **App Store Description:** Svenska text

---

## 🚀 **ALTERNATIV 1: Starta enkelt med TestFlight**

### **För att testa med familj/vänner först:**
```bash
# Bygg beta-version
eas build --platform ios --profile preview

# Ladda upp till TestFlight
eas submit --platform ios --non-production

# Skicka TestFlight-länkar till testare
```

---

## 🚀 **ALTERNATIV 2: Direkt till Production**

### **Om du är redo att släppa direkt:**
```bash
# Production builds
eas build --platform all --profile production

# Submit till App Stores
eas submit --platform all
```

---

## ⚠️ **VIKTIGA SAKER INNAN DU BÖRJAR:**

### **1. App Icon** (behövs absolut):
```bash
# Skapa/ladda ner 1024x1024 PNG icon
# Spara som: assets/icon.png
# Uppdatera app.json: "icon": "./assets/icon.png"
```

### **2. Bundle Identifiers** (unika namn):
```json
// I app.json
"ios": {
  "bundleIdentifier": "com.mikelindberg.manifest"
},
"android": {
  "package": "com.mikelindberg.manifest"  
}
```

### **3. App Permissions** (för påminnelser):
```json
// app.json behöver notifications permissions
"notifications": {
  "icon": "./assets/notification-icon.png"
}
```

---

## 🏆 **ENKLASTE VÄGEN ATT BÖRJA:**

### **Steg 1:** Skaffa Apple Developer Account ($99/år)
### **Steg 2:** Skapa enkel app icon (1024x1024)  
### **Steg 3:** Kör `eas build --platform ios --profile preview`
### **Steg 4:** Testa med TestFlight
### **Steg 5:** Om allt funkar → Production build + submit

---

## 🤝 **JAG HJÄLPER DIG:**

### **Vad jag kan fixa åt dig:**
- ✅ App.json konfiguration  
- ✅ EAS Build setup
- ✅ App icon/screenshots
- ✅ App Store beskrivningar (svenska)
- ✅ Build commands & troubleshooting

### **Vad du måste göra:**
- 💳 Skaffa Developer Accounts  
- 📱 Testa beta-versionen
- ✅ Godkänna final version
- 🚀 Trycka "Release"-knappen

---

## 📞 **NÄSTA STEG:**

**Vill du:**
1. **🧪 Börja med TestFlight** (enkelt, bara iOS, testare)
2. **🚀 Gå direkt till Production** (iOS + Android, riktig app store)
3. **🎨 Fixa app icon först** (behövs för allt)

**Säg bara till vilket du vill börja med!** 💪

---

## 📱 **SLUTRESULTAT:**

Efter detta har du:
- ✅ **"Manifest"** i App Store (iOS) 
- ✅ **"Manifest"** i Google Play (Android)
- ✅ **Samma app** på båda plattformarna
- ✅ **Din egen app** som folk kan ladda ner!
- ✅ **Potentiell inkomst** via app-försäljning

**🎯 Från ChatGPT-idé till riktig app på App Store på några veckor!**