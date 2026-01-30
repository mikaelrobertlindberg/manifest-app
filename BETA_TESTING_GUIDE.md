# 📱 GOOGLE PLAY BETA TESTING - Complete Guide

## 🎯 OVERVIEW
När EAS builden är klar (AAB fil) → distributionsstrategi till dina Android betatestare.

## 📋 FÖRBEREDELSER (GÖR NU MEDAN BYGGET PÅGÅR)

### 1. 💳 GOOGLE PLAY CONSOLE ACCOUNT  
**Cost:** $25 (engångsavgift)  
**Link:** https://play.google.com/console  
**Requirements:** Gmail-konto + kreditkort

### 2. 📝 SAMLA BETATESTARE EMAIL-ADRESSER
**Format:** Lista med Gmail-adresser  
**Limit:** Up till 100 internal testers gratis  
**Tips:** Spara i en textfil för enkel copy-paste

---

## 🚀 STEG-FÖR-STEG BETA DISTRIBUTION  

### STEG 1: SKAPA APP I GOOGLE PLAY CONSOLE

1. **Login:** https://play.google.com/console
2. **"Create app"** knapp
3. **Fill details:**
   - **App name:** "Manifest - Tacksamhet"  
   - **Default language:** Swedish
   - **App or game:** App
   - **Free or paid:** Free
   - **Declarations:** Check content policy boxes

### STEG 2: LADDA UPP AAB FRÅN EAS BUILD

1. **Wait:** EAS build completion (AAB fil redo)
2. **Download AAB:** från EAS dashboard länk  
3. **Console:** "Release" → "Testing" → **"Internal testing"**
4. **"Create new release"**
5. **Upload AAB:** Drag & drop AAB filen
6. **Release notes:** "v1.0.0 - First beta test release"

### STEG 3: KONFIGURERA INTERNAL TESTING TRACK

1. **Track name:** "Beta Testing"
2. **Testers:** "Internal testing" (bästa för privat beta)
3. **Add testers:**
   - **"Manage testers"** 
   - **"Add email addresses"**
   - Paste email-lista (comma-separated)
   - **Save**

### STEG 4: PUBLICERA BETA RELEASE

1. **Review release:** Kontrollera AAB + metadata
2. **"Review release"** → **"Start rollout to Internal testing"**
3. **Confirm:** "Publish" (live inom 2-3 timmar)

### STEG 5: SKICKA TILL BETATESTARE

**Google genererar automatisk testing link:**
```
https://play.google.com/store/apps/details?id=com.littlebear.tacksamhet
```

**Skicka till testare:**
```
Hej!

Jag lanserar min nya tacksamhets-app "Manifest" och skulle älska din feedback!

🧪 BETA TEST LÄNK: [Google Play link]

📱 INSTALLATION:
1. Klicka länk på din Android
2. Tryck "Install" i Google Play  
3. Öppna appen och testa funktioner

💬 FEEDBACK ÖNSKEMÅL:
- Funkar notifikationer?
- Känns AI-coachingen hjälpsam?
- Några buggar eller problem?
- Tycker du om designen?

Appen är på svenska och hjälper med daglig tacksamhet + positiv mindset.

Tack för hjälpen! 🙏
/Mike
```

---

## ⚡ SNABB BETA ALTERNATIV: FIREBASE APP DISTRIBUTION

**Om Google Play Console tar för lång tid:**

### 1. FIREBASE SETUP (5 minuter)
```bash
npm install -g firebase-tools
firebase login
firebase projects:create tacksamhet-beta
```

### 2. DISTRIBUTION  
```bash
firebase appdistribution:distribute app.aab \
  --app YOUR_APP_ID \
  --testers "test1@gmail.com,test2@gmail.com" \
  --notes "v1.0.0 Beta Test"
```

### 3. TESTERS GET SMS/EMAIL
- Direct APK install länk
- No Google Play account needed
- Faster än Google Play approval

---

## 📊 TESTING METRICS & FEEDBACK

### VAS DU VILL SAMLA:
1. **Technical:**
   - Crash rapporter?
   - Performance issues? 
   - Notification delivery?
   - AI filter accuracy?

2. **UX/UI:**
   - Intuitive navigation?
   - Text fade-out elegant?
   - Nordic design appeal?
   - 5-språkig switching fungerar?

3. **Content:**
   - AI coaching tone helpful?
   - Daily prompts inspiring?
   - Notification messages warm?

### FEEDBACK COLLECTION:
- **Google Forms** för strukturerad feedback  
- **Discord/Slack channel** för realtime bug reports
- **TestFlight/Firebase crashlytics** för technical issues

---

## 🎯 SUCCESS METRICS

### BETA GOALS:
- **Technical stability:** Zero crashes för key flows
- **User onboarding:** 80%+ completion av first gratitude entry  
- **AI accuracy:** <5% false positive negativity detection
- **Notification delivery:** 95%+ successful delivery rate

### FEEDBACK TARGETING:
- **Target:** 10-20 active testers  
- **Duration:** 1-2 veckor beta testing
- **Iteration:** Quick fixes baserat på feedback
- **Graduate:** Til Public release när stable

---

## 🚀 POST-BETA: PUBLIC RELEASE

**After successful beta:**
1. **Production release** same AAB til "Production" track  
2. **App Store Optimization** (screenshots, description)
3. **Marketing materials** (landing page, social media)
4. **Launch announcement** til broader audience

**BETA FEEDBACK → QUICK ITERATION → PUBLIC LAUNCH! 🎉**