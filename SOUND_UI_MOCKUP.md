# 🔊 SOUND SETTINGS - UI MOCKUP

## 🎨 VISUAL DESIGN KONCEPT

### Settings Screen Audio Section:
```
┌─────────────────────────────────────┐
│ ⚙️ INSTÄLLNINGAR                   │
├─────────────────────────────────────┤
│                                     │
│ 🔊 LJUD & FEEDBACK                 │
│ ┌─────────────────────────────────┐ │
│ │ 📢 Ljudnotiser            [✓] │ │
│ │                               │ │
│ │ När ljudnotiser är aktiverade:  │ │
│ │ ┌───────────────────────────┐   │ │
│ │ │ 🔔 Pling för påminnelser [✓]│ │
│ │ │ ✨ Harmoniskt när sparad [✓]│ │
│ │ │ 🔊 Volym: ████████░░ 80%  │ │
│ │ └───────────────────────────┘   │ │
│ │                               │ │
│ │ [ Testa ljud ] [ Förhandsgranska ] │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Subtila ljud för bättre          │
│    användarupplevelse. Stäng av     │
│    för helt tyst användning.        │
└─────────────────────────────────────┘
```

### Inline Sound Feedback Examples:

#### När tacksamhet sparas:
```
┌─────────────────────────────────────┐
│ ✨ TACKSAMHET SPARAD ✨             │
├─────────────────────────────────────┤
│                                     │
│ "Jag är tacksam för solskenet       │
│  idag och att kaffe smakar så bra!" │
│                                     │
│ 🎵 ♪ Harmonisk feedback ♪           │
│                                     │
│ [ Skriv mer ] [ Tillbaka ]          │
└─────────────────────────────────────┘
```

#### Reminder notification preview:
```
┌─────────────────────────────────────┐
│ 🌿 MANIFEST                        │
├─────────────────────────────────────┤
│ 🔔 Dags för lite tacksamhet? 😊     │
│                                     │
│ Du har inte skrivit på 3 dagar -   │
│ vad har gjort dig glad idag?       │
│                                     │
│ 🎵 *gentle chime plays*             │
│                                     │
│ [ Skriv nu ]     [ Senare ]         │
└─────────────────────────────────────┘
```

### Sound Test Interface:
```
┌─────────────────────────────────────┐
│ 🔊 TESTA LJUD                      │
├─────────────────────────────────────┤
│                                     │
│ Lyssna på appens ljud:              │
│                                     │
│ 🔔 Påminnelse-pling                │
│ [ ▶ Spela ] [||||] 0:01            │
│ "Ett lugnt, vänligt pling"          │
│                                     │
│ ✨ Success-harmoni                  │
│ [ ▶ Spela ] [||||] 0:02            │
│ "Harmonisk feedback för sparade"    │
│                                     │
│ 🔊 Volym: ████████░░ 80%           │
│ [ Testa med nuvarande volym ]       │
│                                     │
│ [ Stäng ] [ Spara inställningar ]  │
└─────────────────────────────────────┘
```

## 🎼 AUDIO FEEDBACK PATTERNS

### 1. **Gentle Reminder Flow:**
```
User idle 3 days 
    ↓
🔔 *soft chime* (0.8s)
    ↓
Notification shows
    ↓  
User taps "Skriv nu"
    ↓
App opens to write screen
```

### 2. **Gratitude Entry Flow:**
```
User types gratitude
    ↓
Taps "Spara"
    ↓  
✨ *harmonious chord* (1.5s)
    ↓
"Tacksamhet sparad!" confirmation  
    ↓
Returns to main screen
```

### 3. **Settings Test Flow:**
```
User in Sound Settings
    ↓
Taps "Testa påminnelse-pling"
    ↓
🔔 *immediate chime playback*
    ↓
Volume slider adjustable in real-time
```

## 🎯 SOUND INTERACTION STATES

### Master Volume Control:
```typescript
// Volume slider med live preview
const VolumeSlider = () => {
  const [volume, setVolume] = useState(0.8);
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    SoundService.setGlobalVolume(newVolume);
    // Play test chime at new volume
    SoundService.playReminderChime();
  };
  
  return <Slider value={volume} onValueChange={handleVolumeChange} />;
};
```

### Toggle Hierarchies:
```
📢 Ljudnotiser [OFF] → Alla ljud av
    ↓  
📢 Ljudnotiser [ON] → Sub-toggles synliga:
    ├─ 🔔 Påminnelser [ON/OFF]
    └─ ✨ Success [ON/OFF]
```

## 📱 PLATFORM-SPECIFIC BEHAVIORS

### iOS Considerations:
- **Ringer/Silent switch:** Respect system silence  
- **Focus modes:** Lower volume during Do Not Disturb
- **Background audio:** Quick fade when app backgrounded
- **Accessibility:** VoiceOver announcements för sound events

### Android Considerations:  
- **Notification channels:** Separate audio channel för reminder chimes
- **System volume:** Link to media volume, not ringer
- **Battery optimization:** Efficient audio loading/unloading

### PWA (Safari) Considerations:
- **User gesture requirement:** No auto-play, need user interaction first
- **Audio context:** Initialize på första user tap
- **iOS Safari specifics:** Different audio behavior än native

## 🔧 DEVELOPMENT IMPLEMENTATION

### Sound Asset Organization:
```
assets/
├── audio/
│   ├── gentle-reminder-chime.m4a    (iOS/Android)
│   ├── gentle-reminder-chime.ogg    (Web fallback)  
│   ├── gratitude-saved-harmony.m4a  (iOS/Android)
│   └── gratitude-saved-harmony.ogg  (Web fallback)
└── icons/
    ├── sound-on.png
    └── sound-off.png
```

### Component Integration:
```typescript
// När gratitude entry sparas
const handleSaveEntry = async (text: string) => {
  const entry = await GratitudeService.saveEntry(text);
  
  // Visual feedback
  showSuccessMessage("Tacksamhet sparad! ✨");
  
  // Audio feedback (if enabled)  
  await SoundService.playSuccessHarmony();
  
  // Navigation
  navigation.navigate('Home');
};
```

---

**Design Goal:** Göra sound settings intuitive och pleasant, med omedelbar feedback för alla interaktioner. 🎵