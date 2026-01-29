# 🔊 SOUND DESIGN - Lagom Audio Experience

**Feature Request från Mike:** 2026-01-28 14:14  
**Status:** Planning → Ready for Implementation

## 🎵 SOUND PHILOSOPHY: "Lagom Audio"

**Mike's Vision:**
- ✅ **Fint lugnt pling** när appen frågar om att skriva något
- ✅ **Harmoniskt ljud** när en prompt sparas  
- ❌ **Inga andra ljud** - minimal och tasteful

**Design Philosophy:** Swedish minimalism - subtle, beautiful, never annoying.

## 🎼 SOUND CATALOG DESIGN

### 1. 🔔 **Reminder Chime** - "Fint lugnt pling"
**Usage:** Notifications, prompts, gentle nudges

**Sound characteristics:**
- **Frequency:** 440-880 Hz (pleasant, not jarring)
- **Tone:** Warm, wooden, like a gentle bell  
- **Duration:** 0.8-1.2 seconds
- **Volume:** Soft, respectful
- **Inspiration:** Swedish forest chime, meditation bell

**Technical specs:**
```
File: gentle-reminder-chime.m4a
Sample rate: 44.1kHz  
Format: AAC, 128kbps
Size: ~20KB
```

### 2. ✨ **Success Harmony** - "Harmoniskt när sparas"  
**Usage:** Entry saved, task completed, positive feedback

**Sound characteristics:**
- **Harmony:** C-E-G chord progression (major, uplifting)
- **Instrument:** Soft piano + subtle string pad
- **Duration:** 1.5-2.0 seconds  
- **Feel:** Accomplishment, satisfaction, gratitude
- **Inspiration:** Nordic minimalist composition

**Technical specs:**
```
File: gratitude-saved-harmony.m4a
Sample rate: 44.1kHz
Format: AAC, 128kbps  
Size: ~35KB
```

## ⚙️ AUDIO SETTINGS & CONTROL

### Settings Integration:
```typescript
interface AudioSettings {
  enabled: boolean;              // Master på/av
  reminderChime: boolean;        // Pling för påminnelser
  successSound: boolean;         // Harmoniskt för sparade inlägg
  volume: number;                // 0.0-1.0 (default: 0.6)
}
```

### UI Settings Panel:
```
🔊 LJUD & FEEDBACK

📢 Ljudnotiser                     [ ✓ ]
  🔔 Pling för påminnelser        [ ✓ ] 
  ✨ Harmoniskt för sparade       [ ✓ ]
  🔊 Volym: ████████░░ 80%

💡 Subtila ljud för bättre upplevelse.
   Stäng av för helt tyst användning.
```

## 📱 IMPLEMENTATION DESIGN

### React Native Audio Service:
```typescript
import { Audio } from 'expo-av';

export class SoundService {
  private static sounds: { [key: string]: Audio.Sound } = {};
  private static settings: AudioSettings;

  // Ladda ljud vid app-start
  static async preloadSounds(): Promise<void> {
    try {
      this.sounds.reminderChime = new Audio.Sound();
      await this.sounds.reminderChime.loadAsync(
        require('../assets/audio/gentle-reminder-chime.m4a')
      );

      this.sounds.successHarmony = new Audio.Sound();  
      await this.sounds.successHarmony.loadAsync(
        require('../assets/audio/gratitude-saved-harmony.m4a')
      );

      console.log('🔊 Audio assets preloaded successfully');
    } catch (error) {
      console.warn('🔇 Audio loading failed:', error);
    }
  }

  // Spela påminnelse-pling
  static async playReminderChime(): Promise<void> {
    if (!this.settings.enabled || !this.settings.reminderChime) return;
    
    try {
      await this.sounds.reminderChime.setVolumeAsync(this.settings.volume);
      await this.sounds.reminderChime.replayAsync();
      console.log('🔔 Played reminder chime');
    } catch (error) {
      console.warn('🔇 Failed to play reminder chime:', error);
    }
  }

  // Spela success-harmoni  
  static async playSuccessHarmony(): Promise<void> {
    if (!this.settings.enabled || !this.settings.successSound) return;

    try {
      await this.sounds.successHarmony.setVolumeAsync(this.settings.volume);
      await this.sounds.successHarmony.replayAsync();
      console.log('✨ Played success harmony');
    } catch (error) {
      console.warn('🔇 Failed to play success harmony:', error);
    }
  }
}
```

## 🎯 INTEGRATION POINTS

### 1. Reminder Notifications:
```typescript
// När idle reminder triggas
await NotificationService.showIdleReminder();
await SoundService.playReminderChime(); // 🔔 Pling!
```

### 2. Entry Saved:
```typescript  
// När tacksamhet sparas
const savedEntry = await LocalStorageService.saveEntry(entry);
await SoundService.playSuccessHarmony(); // ✨ Harmoniskt!
```

### 3. Daily Prompts:
```typescript
// När daglig prompt visas
await SoundService.playReminderChime(); // 🔔 Pling!
```

## 🎨 SOUND CREATION APPROACH

### Option A: AI-Generated (Snabbast)
- **Suno AI:** Generate "gentle meditation bell chime 1 second"
- **ElevenLabs:** Voice-to-audio för custom tones
- **Mubert:** Minimalist harmony generation

### Option B: Curated Library  
- **Freesound.org:** CC0 meditation bells, chimes
- **Zapsplat:** Professional sound library
- **Apple Logic:** Built-in instruments för harmony

### Option C: Custom Composition
- **Logic Pro:** Komponera exakt enligt spec
- **Swedish musicians:** Lokal nordic minimalism
- **Field recording:** Riktig svensk naturklocka

## 📊 TECHNICAL CONSIDERATIONS

### File Sizes & Performance:
- **Target:** <50KB total för båda ljud
- **Format:** AAC (M4A) för iOS, OGG fallback för web  
- **Preloading:** Load vid app start för instant playback
- **Memory:** Keep loaded för quick access

### Platform Compatibility:
- **iOS:** Native AVAudioPlayer support
- **Android:** MediaPlayer integration  
- **PWA:** HTML5 Audio API with user gesture requirement
- **Silent mode:** Respect iOS ringer/silent switch

## 🚀 IMPLEMENTATION TIMELINE

### Phase 1: Core Audio (Vecka 1)
- [ ] Create SoundService med basic playback
- [ ] Add settings toggle för ljud on/off
- [ ] Integrera med entry saving 

### Phase 2: Sound Assets (Vecka 1-2)
- [ ] Source/create gentle reminder chime
- [ ] Source/create success harmony  
- [ ] Optimize file sizes & quality
- [ ] Test på alla platforms

### Phase 3: Polish (Vecka 2)
- [ ] Volume control settings
- [ ] Individual sound toggles
- [ ] Respect system silent mode
- [ ] Performance optimization

## 💚 EXPECTED USER IMPACT

### Positive Psychology:
- **Pavlovian satisfaction:** Harmony = accomplishment  
- **Gentle guidance:** Chime = helpful reminder, not annoyance
- **Habit reinforcement:** Audio feedback strengthens gratitude loop

### Swedish Cultural Fit:
- **Lagom approach:** Just enough feedback, not overwhelming
- **Quality över quantity:** Two perfect sounds > many mediocre
- **Respect för silence:** Easy disable för those who prefer quiet

---

**Sound Design Goal:** "Subtle audio poetry that makes gratitude journaling feel more satisfying and mindful." 🎵

**Implementation Priority:** Medium-High (UX enhancement)  
**Estimated Effort:** 1-2 veckor för complete implementation  
**Dependencies:** expo-av audio library, sound asset creation