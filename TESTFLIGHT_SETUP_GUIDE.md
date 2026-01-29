# 📱 TESTFLIGHT SETUP - MANIFEST APP

## Mike's fråga: "Hur ska jag göra om jag vill köra TestFlight och köra den som en riktigt app?"

---

## 🎯 **VAD ÄR TESTFLIGHT:**
- **Apples officiella beta-testing platform**
- **Riktig app** installerad på iPhone (inte Expo Go)
- **Fungerar offline** utan development server
- **Samma upplevelse** som App Store-app
- **Perfekt för testning** innan official launch

---

## 📋 **FÖRUTSÄTTNINGAR:**

### **1. Apple Developer Account** (obligatorisk)
- **Kostnad:** $99/år
- **Anmäl dig:** https://developer.apple.com/programs/
- **Tid:** 1-2 dagar för approval
- **Behövs för:** All iOS app distribution

### **2. Expo EAS Account** (gratis)
- **Skapa:** https://expo.dev
- **Eller:** Logga in via `eas login`

---

## 🚀 **STEG-FÖR-STEG TESTFLIGHT SETUP:**

### **STEG 1: Konfigurera appen för production**
```bash
cd projects/manifest-app/ManifestApp

# Installera EAS CLI om inte redan gjort
npm install -g @expo/eas-cli

# Logga in på Expo
eas login

# Konfigurera för builds
eas build:configure
```

### **STEG 2: Uppdatera app.json för production**
```json
{
  "expo": {
    "name": "Manifest",
    "slug": "manifest-svenska-tacksamhet", 
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.mikelindberg.manifest",
      "buildNumber": "1"
    },
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### **STEG 3: Bygg iOS beta-version**
```bash
# Bygg för TestFlight (första gången tar 15-30 min)
eas build --platform ios --profile preview

# Detta skapar en .ipa-fil på Expo's servrar
# Du får en länk när det är klart
```

### **STEG 4: Ladda upp till App Store Connect**
```bash
# Skicka till TestFlight automatiskt
eas submit --platform ios --non-production

# Eller manuellt via App Store Connect
# (du får instruktioner när bygget är klart)
```

### **STEG 5: Konfigurera TestFlight**
1. **Logga in på App Store Connect:** https://appstoreconnect.apple.com
2. **Gå till "My Apps"** → Manifest
3. **TestFlight tab** → Build syns här efter upload
4. **Add External Testers** → lägg till din egen email
5. **Skicka TestFlight invite** till dig själv

### **STEG 6: Installera via TestFlight**
1. **Ladda ner TestFlight app** från App Store
2. **Öppna invite-email** på iPhone
3. **Tryck "View in TestFlight"**
4. **Install** → riktig app installeras!

---

## ⚡ **SNABB-VERSION (om du har Apple Developer):**

```bash
cd projects/manifest-app/ManifestApp

# 1. Setup (engångsföreteelse)
eas login
eas build:configure

# 2. Bygg & submit till TestFlight
eas build --platform ios --profile preview --auto-submit

# 3. Vänta på email från Apple (5-30 min)
# 4. Installera via TestFlight app på iPhone
```

---

## 🎨 **ASSETS SOM BEHÖVS:**

### **App Icon (obligatorisk):**
```bash
# Skapa 1024x1024 PNG ikon
# Spara som: assets/icon.png
# Enkel design: "M" + tacksamhets-tema
```

### **Splash Screen (valfri):**
```bash
# 1242x2688 PNG för iPhone splash
# Spara som: assets/splash.png  
# Minimalistisk design eller bara vit bakgrund
```

---

## 📊 **TIDSPLAN & PROCESS:**

### **Första gången:**
- **Apple Developer signup:** 1-2 dagar
- **App icon skapande:** 30 minuter
- **EAS Build setup:** 30 minuter  
- **Första build:** 15-30 minuter
- **TestFlight upload:** 5-15 minuter
- **Total tid:** ~2-3 timmar + Apple approval

### **Framtida builds:**
- **Ny build:** 10-20 minuter
- **Upload till TestFlight:** 5 minuter
- **Install på iPhone:** 1 minut

---

## 🆚 **TESTFLIGHT vs EXPO GO:**

### **Expo Go (nuvarande):**
- ✅ Snabb development
- ✅ Instant reload
- ❌ Behöver server running
- ❌ Development environment
- ❌ Inte "riktig app"

### **TestFlight:**
- ✅ **Riktig app** installerad
- ✅ **Fungerar offline**
- ✅ **Samma som App Store**
- ✅ **Native performance**
- ❌ Längre build-tid för uppdateringar

---

## 💡 **JAS HJÄLP STEG-FÖR-STEG:**

### **Vad jag kan fixa åt dig:**
1. **App icon design** (enkel M-logo)
2. **App.json konfiguration** för production
3. **EAS build setup** & troubleshooting
4. **TestFlight upload** commands
5. **Felsökning** om något går fel

### **Vad du behöver göra:**
1. **Skaffa Apple Developer Account** ($99/år)
2. **Godkänna builds** & settings
3. **Testa appen** på iPhone via TestFlight
4. **Ge feedback** för förbättringar

---

## 🚀 **NÄSTA STEG - VAD VILL DU?**

**A)** 🎨 **Börja med app icon** (behövs för TestFlight)
**B)** 📝 **Skaffa Apple Developer Account först**  
**C)** 🔨 **Konfigurera EAS Build direkt** (om du har account)
**D)** 📖 **Mer info om någon specifik del**

---

## 🎯 **SLUTMÅL:**

Efter TestFlight-setup har du:
- ✅ **Manifest som riktig app** på iPhone
- ✅ **Fungerar offline** utan server
- ✅ **Native performance** & ljud
- ✅ **Exakt samma** som framtida App Store-version
- ✅ **Kan delas** med familj/vänner för testning

**🚀 Från Expo Go development → riktig iPhone app på några timmar!**

Vad vill du börja med? App icon eller Apple Developer Account? 📱