# MANIFEST APP - TEKNISK SPECIFIKATION

**Version:** 1.0  
**Senast uppdaterad:** 2027-01-27  
**Stack:** TBD (React Native vs Flutter)

## ARKITEKTUR ÖVERSIKT

### High-Level Architecture
```
[Mobile App] ↔ [Backend API] ↔ [Database]
     ↕              ↕            ↕
[Local Storage] [Cloud Storage] [Analytics]
     ↕              ↕
[Push Notifications] [Health Data]
```

### App Layers:
1. **Presentation Layer:** UI komponenter och skärmar
2. **Business Logic:** State management, data processing  
3. **Data Layer:** Lokal cache + remote sync
4. **Services Layer:** Notifications, health integration

## TEKNISK STACK ANALYS

### React Native vs Flutter

#### React Native (REKOMMENDATION)
**Pros:**
- JavaScript/TypeScript → Mike redan bekant?
- Stor community och ecosystem
- Expo för snabb prototyping
- Bättre integration med Firebase
- Enklare att hitta hjälp online

**Cons:**
- Lite mer bridge-complexity för native features
- Performance kan vara sämre för komplexa animationer

#### Flutter
**Pros:**  
- Dart språk → clean, moderne
- Excellent performance
- Mycket bra för custom animations
- Google's backing (Firebase integration)

**Cons:**
- Ny språk att lära (Dart)
- Mindre community än React Native

### BESLUT: React Native + Expo
**Motivering:** Snabbare att komma igång, bra Firebase integration, större community för support.

## TEKNISK IMPLEMENTATION

### 1. Development Setup
```bash
# Expo CLI för snabb start
npm install -g expo-cli

# Skapa projekt  
expo init ManifestApp --template typescript

# Core dependencies
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-async-storage
npm install @react-native-firebase/app
npm install @react-native-firebase/firestore
npm install react-native-push-notification
```

### 2. Projektstruktur
```
src/
├── components/          # Återanvändbara UI komponenter
│   ├── Input/
│   ├── Button/  
│   ├── Card/
│   └── Typography/
├── screens/            # App skärmar
│   ├── HomeScreen.tsx
│   ├── WriteScreen.tsx
│   ├── HistoryScreen.tsx  
│   └── SettingsScreen.tsx
├── services/           # API calls, data services
│   ├── GratitudeService.ts
│   ├── NotificationService.ts
│   └── HealthService.ts
├── store/             # State management (Redux Toolkit)
│   ├── gratitudeSlice.ts
│   ├── settingsSlice.ts
│   └── store.ts
├── utils/             # Helper functions
│   ├── dateHelpers.ts
│   ├── randomPicker.ts
│   └── constants.ts
└── types/             # TypeScript types
    └── index.ts
```

### 3. Data Models

#### Gratitude Entry
```typescript
interface GratitudeEntry {
  id: string;
  text: string;
  createdAt: Date;
  tags?: string[];
  mood?: 'happy' | 'peaceful' | 'excited' | 'content';
  reminderCount: number; // Hur ofta den visats som påminnelse
  isFavorite?: boolean;
}
```

#### User Settings  
```typescript
interface UserSettings {
  notifications: {
    enabled: boolean;
    morningTime: string; // "08:00"
    eveningTime: string; // "20:00"
    randomEnabled: boolean;
    frequency: 'low' | 'medium' | 'high'; // påminnelser per dag
  };
  preferences: {
    darkMode: boolean;
    language: 'sv' | 'en';
    soundEnabled: boolean;
  };
}
```

### 4. Database Schema (Firebase Firestore)

#### Collections Structure:
```
users/{userId}/
├── profile/           # User profile data
├── gratitudes/        # Gratitude entries subcollection  
│   └── {entryId}     # Individual gratitude documents
├── settings/          # User preferences
└── analytics/         # Usage statistics
```

#### Offline-First Strategy:
- **Local Storage:** AsyncStorage för snabb access
- **Sync Strategy:** Background sync when online
- **Conflict Resolution:** Last-write-wins (simple för MVP)

### 5. Notification System

#### Types of Notifications:
1. **Scheduled:** Morgon/kväll påminnelser
2. **Smart:** Baserat på hälsodata (lugna stunder)  
3. **Random:** Slumpmässiga tacksamhetspåminnelser

#### Implementation:
```typescript
class NotificationService {
  scheduleDaily(time: string, message: string) {
    // Schedule daily notification
  }
  
  scheduleSmart(healthData: HealthData) {
    // Trigger based on calm periods
  }
  
  scheduleRandomReminder(gratitude: GratitudeEntry) {
    // Show past gratitude randomly
  }
}
```

### 6. Health Data Integration

#### iOS: HealthKit Integration
```typescript
import { AppleHealthKit } from 'react-native-health';

// Request permissions
const permissions = {
  read: [AppleHealthKit.Constants.Permissions.HeartRate]
};

// Detect calm periods (low heart rate)
```

#### Android: Google Fit Integration  
```typescript
import { GoogleFit } from 'react-native-google-fit';

// Similar heart rate monitoring
```

### 7. Smart Reminder Algorithm

#### Logic för att välja tacksamheter:
```typescript
function selectGratitudeForReminder(entries: GratitudeEntry[]): GratitudeEntry {
  // Prioritering:
  // 1. Äldre entries (inte visade på länge)
  // 2. Favoriter får högre vikt
  // 3. Undvik samma entry inom 7 dagar
  // 4. Balansera olika mood types
  
  const weighted = entries.map(entry => ({
    entry,
    weight: calculateWeight(entry)
  }));
  
  return weightedRandomSelect(weighted);
}
```

## PERFORMANCE & OPTIMIZATION

### 1. App Performance
- **Lazy loading:** Load screens on demand
- **Image optimization:** Compress assets
- **Bundle splitting:** Separate vendor/app code
- **Memory management:** Proper cleanup av listeners

### 2. Battery Optimization
- **Smart scheduling:** Batch notifications
- **Background processing:** Minimal when app closed
- **Health monitoring:** Sample only when needed

### 3. Network Optimization  
- **Offline support:** Full funktionalitet utan internet
- **Incremental sync:** Sync bara changes
- **Compression:** Gzip API responses

## SECURITY & PRIVACY

### Data Protection:
- **Local encryption:** Sensitive data encrypted on device
- **Firebase Rules:** Strict access control  
- **Authentication:** Anonymous users (no email required)
- **GDPR Compliance:** Data export/deletion

### Privacy Policy Requirements:
- Vilken data som samlas
- Hur notifications fungerar
- Health data usage (om implementerat)
- Data retention policy

## TESTING STRATEGY

### 1. Unit Tests
- Business logic functions
- Data transformation utilities
- Notification algorithms

### 2. Integration Tests  
- Database operations
- API calls
- Navigation flows

### 3. E2E Testing
- User journeys (write → save → remind)
- Cross-platform testing (iOS/Android)

### 4. Manual Testing
- UX flows på riktiga enheter
- Performance under verklig användning
- Edge cases och error scenarios

## DEPLOYMENT & DISTRIBUTION

### 1. Build Pipeline
```bash
# Development build
expo build:ios
expo build:android

# Production build  
expo build:ios --release-channel production
expo build:android --release-channel production
```

### 2. App Store Requirements

#### iOS App Store:
- Apple Developer Account ($99/år)
- App Store Connect setup
- TestFlight för beta testing
- Review guidelines compliance

#### Google Play Store:
- Google Play Console ($25 engång)
- APK/AAB upload
- Internal testing track
- Play Console review

### 3. CI/CD (Future Enhancement)
- GitHub Actions för automated builds
- Automated testing på PR
- Deploy till TestFlight/Internal Testing

## MONITORING & ANALYTICS

### 1. Crash Reporting
- Expo built-in crash reporting
- Firebase Crashlytics för production

### 2. Usage Analytics
- Screen navigation tracking
- Feature usage statistics
- Retention metrics
- Performance monitoring

### 3. User Feedback
- In-app feedback form
- App Store review monitoring
- Support email system

## SCALABILITY CONSIDERATIONS

### Phase 1 (MVP): 0-1K users
- Firebase free tier
- Simple architecture
- Manual monitoring

### Phase 2 (Growth): 1K-10K users  
- Firebase paid tier
- Performance optimization
- Automated monitoring

### Phase 3 (Scale): 10K+ users
- Consider backend migration
- Advanced analytics
- A/B testing framework

---

**Next Steps:**
1. Validera tech stack choice med Mike
2. Setup development environment  
3. Create initial project structure
4. Implement first UI prototype

**Technical Reviews:** Varje måndag under development  
**Maintainer:** Mike + Balthazar support