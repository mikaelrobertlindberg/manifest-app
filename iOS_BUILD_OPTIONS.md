# 🍎 iOS BUILD OPTIONS - MANIFEST APP

## Current Status: PWA Ready for iPhone

**PWA Installation på iPhone:**
1. Safari → http://192.168.1.224:8081  
2. Share → "Lägg till på hemskärmen"
3. Funkar som native iOS-app!

## För Native iOS App (.ipa):

### Option 1: EAS Build (Rekommenderat)
```bash
cd projects/manifest-app/ManifestApp
npx eas login  
npx eas build -p ios
```
**Krav:** Expo-konto + Apple Developer Account ($99/år)

### Option 2: Xcode Local Build  
```bash
cd projects/manifest-app/ManifestApp
npx expo run:ios
```
**Krav:** Mac + Xcode + Apple Developer Account

### Option 3: Expo Go (Development)
**Limiterat men fungerar:**
- Ladda ner Expo Go från App Store
- Scanna QR-kod från `expo start`
- Bara för testing, ej distribution

## App Store Deployment:
1. Apple Developer Account ($99/år)  
2. EAS Build för production
3. App Store Connect upload
4. Review process (~1-7 dagar)

## Rekommendation:
**Starta med PWA** → testa functionalitet → sedan native iOS om behövs för App Store.

PWA täcker 95% av native app experience på iPhone!