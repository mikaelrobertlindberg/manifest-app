# 🔔 IDLE REMINDERS - Smart Inaktivitetspåminnelser

**Feature Request från Mike:** 2026-01-28 12:01  
**Status:** Planning → Ready for Implementation

## 📋 FEATURE BESKRIVNING

**Kärnidé:** Påminn användaren att skriva tacksamhet om det varit tyst i några dagar, med möjlighet att stänga av funktionen.

## 🎯 USER STORIES

### Primary Use Case:
**Som användare vill jag bli påmind att skriva tacksamhet om jag glömt bort det, men kunna stänga av påminnelserna när jag vill.**

### Scenarios:
- **Dag 1-2:** Ingen påminnelse (normal paus)
- **Dag 3:** Soft reminder "Hej! Några tacksamheter att dela?"
- **Dag 5:** Gentle nudge "Du har inte skrivit på ett tag - allt okej?"
- **Dag 7+:** "Vi saknar dig! En liten tacksamhet?" 

## ⚙️ IMPLEMENTATION DESIGN

### Settings Toggle:
```typescript
interface IdleReminderSettings {
  enabled: boolean;           // Huvudknapp för på/av
  dayThreshold: number;       // Antal dagar innan påminnelse (default: 3)
  reminderStyle: 'gentle' | 'motivating' | 'casual'; // Ton i meddelandet
  maxReminders: number;       // Max påminnelser per vecka (default: 2)
}
```

### Smart Timing Logic:
```typescript
// Beräkna när senaste inlägg gjordes
const daysSinceLastEntry = getDaysSinceLastEntry();
const shouldRemind = 
  settings.enabled && 
  daysSinceLastEntry >= settings.dayThreshold &&
  !hasReachedMaxRemindersThisWeek();
```

### Notification Messages (Svenska):
```typescript
const reminderMessages = {
  gentle: [
    "Dags för lite tacksamhet? 🌿",
    "Vad har gjort dig glad idag? 😊", 
    "En liten tacksamhet kanske? 💚"
  ],
  motivating: [
    "Bygg din tacksamhetsvana! 💪",
    "Varje tacksamhet räknas! 🎯",
    "Håll igång det positiva! 🔥"
  ],
  casual: [
    "Hej där! Något bra hänt? 👋",
    "Bara kolla läget... 😄",
    "Ledsen om jag stör! 🙈"
  ]
};
```

## 🎨 UI/UX DESIGN

### Settings Screen Addition:
```
⚙️ INSTÄLLNINGAR

📱 Notiser
  🔔 Påminnelser när jag är inaktiv    [ ✓ ]
  📅 Påminn efter: [3] dagar
  🎭 Stil: [Vänlig] [Motiverande] [Avslappnad]  
  📊 Max 2 påminnelser per vecka       [ ✓ ]

💡 "Vi påminner dig vänligt när du inte skrivit tacksamhet på ett tag.
    Du kan alltid stänga av eller justera detta."
```

### Reminder Notification UX:
- **iOS-stil notification** med app-ikon
- **Två knappar:** "Skriv nu" | "Påminn senare"
- **Snooze-funktion:** "Påminn imorgon" om man inte känner för det

## 🔧 TECHNICAL IMPLEMENTATION

### 1. Storage för tracking:
```typescript
interface ActivityTracker {
  lastEntryDate: Date;
  lastReminderSent: Date;
  remindersThisWeek: number;
  settings: IdleReminderSettings;
}
```

### 2. Background job (React Native):
```typescript
// Kör varje dag kl 19:00 (svensk middag-tid)
const scheduleIdleCheck = () => {
  const trigger = {
    hour: 19,
    minute: 0,
    repeats: true
  };
  
  Notifications.scheduleNotificationAsync({
    content: getReminder(),
    trigger
  });
};
```

### 3. Smart Logic:
- **Respectful timing:** Aldrig sent på kvällen eller tidigt på morgon
- **Weekend awareness:** Mindre aggressiv helger
- **User feedback:** Om de often dismissar → minska frekvens

## 📊 SUCCESS METRICS

### KPIs för feature:
- **Re-engagement rate:** % som återvänder efter påminnelse
- **Settings usage:** Hur många justerar inställningarna
- **Retention impact:** Bibehåller fler användare vanan längre?
- **User satisfaction:** Feedback på påminnelse-tonen

## 🚀 ROLLOUT PLAN

### Phase 1: Core Implementation (Vecka 2-3)
- [ ] Basic idle detection
- [ ] Simple notification efter 3 dagar
- [ ] On/off toggle i settings

### Phase 2: Smart Features (Vecka 4-5)  
- [ ] Customizable day threshold
- [ ] Multiple reminder styles
- [ ] Weekly limits
- [ ] Snooze functionality

### Phase 3: Intelligence (Vecka 6+)
- [ ] Machine learning för optimal timing
- [ ] Personalized message tone
- [ ] Seasonal/contextual awareness
- [ ] Integration med hälsodata (stress-nivåer)

## 💡 ADVANCED IDEAS (Future)

### Smart Contextual Reminders:
- **Weather awareness:** "Soligt idag - något att vara tacksam för? ☀️"  
- **Season-based:** "Höstens färger är vackra... 🍂"
- **Health integration:** Mjukare påminnelser vid stress/sjukdom
- **Location-based:** "Hemma igen - dags för reflektion? 🏠"

### Social Features:
- **Gentle streaks:** "Du hade en 12-dagars streak förra månaden! 🔥"
- **Friend nudges:** "Lisa skrev idag - inspiration? 👯‍♀️" (opt-in)

## 🎯 CORE PHILOSOPHY

**"Vänlig påminnelse, inte skuldbeläggning"**

- Aldrig judgmental tone
- Alltid easy opt-out  
- Respekterar user agency
- Fokus på välmående, inte prestation

---

**Feature Owner:** Mike  
**Priority:** High (kärnfunktion för habit building)  
**Estimated Effort:** 2 veckor implementation + 1 vecka testing  
**Dependencies:** Notification service, Settings UI, Storage service