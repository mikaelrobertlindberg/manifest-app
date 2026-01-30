# 🍎 iOS TestFlight Beta Testing Guide

## 🎯 OVERVIEW
TestFlight är Apples officiella beta testing platform - mycket enklare än Google Play för beta distribution!

## 📱 STEG-FÖR-STEG TESTFLIGHT SETUP

### STEG 1: APP STORE CONNECT ACCOUNT
**Requirements:**
- **Apple Developer Account** ($99/år)
- **Link:** https://developer.apple.com/account/
- **Same Apple ID** som du använder på din iPhone

### STEG 2: SKAPA APP I APP STORE CONNECT
1. **Gå till:** https://appstoreconnect.apple.com/
2. **"My Apps"** → **"+"** → **"New App"**
3. **Fill details:**
   - **Name:** "Manifest - Tacksamhet"
   - **Bundle ID:** `com.littlebear.tacksamhet` (already configured)
   - **SKU:** `manifest-tacksamhet-001`
   - **Primary Language:** Swedish

### STEG 3: UPLOAD IPA FRÅN EAS BUILD
**När iOS builden är klar:**
1. **Download IPA** från EAS build link
2. **App Store Connect:** Gå till din app
3. **"TestFlight"** tab → **"iOS Builds"**
4. **Upload IPA** (via Xcode eller Transporter app)
5. **Build processing** (Apple tar 10-30 min att processa)

### STEG 4: SETUP INTERNAL TESTING
1. **TestFlight tab** → **"Internal Testing"**
2. **"+"** för att skapa ny grupp
3. **Group name:** "Beta Testers"
4. **Add testers:** Din egen Apple ID + andra testares Apple IDs
5. **Select build** som just uppladdades
6. **"Start Testing"**

### STEG 5: INSTALLERA PÅ DIN iPhone
1. **TestFlight app** installerad från App Store
2. **Få email invitation** till beta testing
3. **Klicka länk** i email → öppnas i TestFlight app
4. **"Install"** → Manifest appen installeras
5. **Test direkt** på din iPhone!

---

## ⚡ FÖRDELAR MED TESTFLIGHT:

### **🚀 ENKLARE ÄN GOOGLE PLAY:**
- **Ingen $25 fee** (bara $99 developer account)
- **Snabbare setup** (minuter vs timmar)
- **Automatisk distribution** via TestFlight app
- **Built-in feedback** system

### **📱 PERFEKT FÖR DIG:**
- **Testa på din egen iPhone** omedelbart
- **Lägg till vänner** som betatestare enkelt
- **Push updates** snabbt till betatestare
- **Crash reports** automatically collected

### **🔄 ITERATION WORKFLOW:**
```
EAS Build iOS → Upload till App Store Connect → 
→ TestFlight processing → Install på iPhone → 
→ Test & feedback → Fix bugs → Repeat!
```

---

## 📊 BETA TESTING STRATEGY

### **PHASE 1: PERSONAL TESTING (du själv)**
- **Install på din iPhone** för basic funktionalitetstester
- **Test alla features:** AI filter, notifications, språkväxling
- **Check crash behavior** och basic UX flow

### **PHASE 2: CLOSE FRIENDS (5-10 personer)**
- **Invite vänner/familj** med iPhone
- **Apple IDs needed** för invitation
- **Feedback collection** via TestFlight eller Discord

### **PHASE 3: BROADER BETA (20+ personer)**
- **External Testing** (public beta link)
- **No Apple ID required** för external testers
- **App Store review required** (1-2 days)

---

## 🎯 VERSIONERING FÖR iOS

### **CURRENT BETA:**
- **Version:** `0.9.0` (perfect för beta!)
- **Build Number:** Auto-incremented av EAS
- **TestFlight:** Supports unlimited beta versions

### **PRODUCTION RELEASE:**
- **Version:** `1.0.0` när beta testing är klar
- **App Store submission** för allmänheten
- **Same app → different distribution**

---

## 🔧 TROUBLESHOOTING

### **COMMON ISSUES:**
- **Developer account:** Måste vara same Apple ID som TestFlight
- **Bundle ID:** Must match exakt mellan build och App Store Connect
- **Processing time:** Apple tar 10-30 min att processa builds
- **Device limit:** 100 devices för internal testing

### **BACKUP PLAN:**
Om TestFlight problem:
- **Ad-hoc distribution** via Development build
- **Direct install** på registered devices
- **Expo Go app** för rapid testing

---

## 🎉 SUCCESS PATH

### **TIMELINE:**
- **Day 1:** iOS build klar + App Store Connect setup
- **Day 1:** Du testar på din iPhone
- **Day 2-3:** Invite close friends för feedback
- **Week 1:** Broader beta testing
- **Week 2:** Bug fixes och final polish
- **Week 3:** Submit till App Store för production

### **GOAL:**
**Stable iOS app** som fungerar perfekt på iPhone → **Android port** senare om behövs!

**TestFlight är MYCKET enklare än Google Play för beta testing! 🍎✨**