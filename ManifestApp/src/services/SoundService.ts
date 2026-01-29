import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AudioSettings {
  enabled: boolean;          // Master på/av
  reminderChime: boolean;    // Pling för påminnelser  
  successSound: boolean;     // Harmoniskt för sparade inlägg
  volume: number;            // 0.0-1.0 (default: 0.6)
}

export class SoundService {
  private static sounds: { [key: string]: Audio.Sound } = {};
  private static settings: AudioSettings = {
    enabled: true,
    reminderChime: true,
    successSound: true,  
    volume: 0.6
  };
  private static initialized = false;

  // Default inställningar för svenska användare
  static defaultSettings: AudioSettings = {
    enabled: true,
    reminderChime: true,
    successSound: true,
    volume: 0.6
  };

  // Initialisera SoundService - kör vid app-start
  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('🔊 Initialiserar SoundService...');
      
      // Sätt up audio mode för bättre prestanda
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,  // Respektera iOS silent mode
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Ladda settings från storage
      await this.loadSettings();
      
      // Preladda sound assets
      await this.preloadSounds();
      
      this.initialized = true;
      console.log('🎵 SoundService initialiserad med settings:', this.settings);
      
    } catch (error) {
      console.warn('⚠️ SoundService initialization failed:', error);
      // Fortsätt utan ljud istället för att krascha
      this.settings.enabled = false;
    }
  }

  // Preladda ljud vid app-start för instant playback
  private static async preloadSounds(): Promise<void> {
    try {
      console.log('📀 Preladdar ljudfiler...');

      // Deep Bell Cluster - dov, mjuk klocka för notifikationer (3.5s)
      this.sounds.reminderChime = new Audio.Sound();
      await this.sounds.reminderChime.loadAsync(
        require('../../assets/audio/gentle-reminder-chime.m4a')
      );

      // Peaceful C-Major - lugnt ackord för prompts och sparade inlägg (5.0s)
      this.sounds.successHarmony = new Audio.Sound();  
      await this.sounds.successHarmony.loadAsync(
        require('../../assets/audio/gratitude-saved-harmony.m4a')
      );

      console.log('✅ Ljudfiler preloaded successfully');
      
    } catch (error) {
      console.warn('🔇 Audio loading failed, disabling sound:', error);
      this.settings.enabled = false;
    }
  }

  // Ladda settings från AsyncStorage
  static async loadSettings(): Promise<AudioSettings> {
    try {
      const saved = await AsyncStorage.getItem('@SoundService:settings');
      if (saved) {
        this.settings = { ...this.defaultSettings, ...JSON.parse(saved) };
      } else {
        this.settings = { ...this.defaultSettings };
      }
      console.log('🔊 Laddade audio settings:', this.settings);
      return this.settings;
    } catch (error) {
      console.warn('⚠️ Kunde inte ladda audio settings:', error);
      this.settings = { ...this.defaultSettings };
      return this.settings;
    }
  }

  // Spara settings till AsyncStorage  
  static async saveSettings(settings: AudioSettings): Promise<void> {
    try {
      this.settings = { ...settings };
      await AsyncStorage.setItem('@SoundService:settings', JSON.stringify(settings));
      console.log('💾 Sparade audio settings:', settings);
    } catch (error) {
      console.error('❌ Kunde inte spara audio settings:', error);
    }
  }

  // Hämta aktuella settings
  static getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // Uppdatera settings
  static async updateSettings(newSettings: Partial<AudioSettings>): Promise<void> {
    const updated = { ...this.settings, ...newSettings };
    await this.saveSettings(updated);
  }

  // Spela påminnelse-chime (mjukt pling för prompts/notifications)
  static async playReminderChime(): Promise<void> {
    if (!this.settings.enabled || !this.settings.reminderChime || !this.sounds.reminderChime) {
      console.log('🔇 Reminder chime disabled eller ej laddat');
      return;
    }
    
    try {
      await this.sounds.reminderChime.setVolumeAsync(this.settings.volume);
      await this.sounds.reminderChime.setPositionAsync(0); // Reset till början
      await this.sounds.reminderChime.playAsync();
      console.log('🔔 Spelade reminder chime (volume:', this.settings.volume + ')');
    } catch (error) {
      console.warn('🔇 Failed to play reminder chime:', error);
    }
  }

  // Spela success-harmoni (C-E-G för saved entries)
  static async playSuccessHarmony(): Promise<void> {
    if (!this.settings.enabled || !this.settings.successSound || !this.sounds.successHarmony) {
      console.log('🔇 Success harmony disabled eller ej laddat');
      return;
    }

    try {
      await this.sounds.successHarmony.setVolumeAsync(this.settings.volume);
      await this.sounds.successHarmony.setPositionAsync(0); // Reset till början
      await this.sounds.successHarmony.playAsync();
      console.log('✨ Spelade success harmony (volume:', this.settings.volume + ')');
    } catch (error) {
      console.warn('🔇 Failed to play success harmony:', error);
    }
  }

  // Test-funktioner för settings UI
  static async testReminderChime(): Promise<void> {
    console.log('🧪 Testing reminder chime...');
    await this.playReminderChime();
  }

  static async testSuccessHarmony(): Promise<void> {
    console.log('🧪 Testing success harmony...');
    await this.playSuccessHarmony();
  }

  // Sätt master volym (0.0-1.0)
  static async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await this.updateSettings({ volume: clampedVolume });
    console.log('🔊 Volume updated to:', clampedVolume);
  }

  // Stäng av/på alla ljud
  static async setEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ enabled });
    console.log('🔊 Sound service', enabled ? 'enabled' : 'disabled');
  }

  // Stäng av/på reminder chimes
  static async setReminderChimeEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ reminderChime: enabled });
    console.log('🔔 Reminder chime', enabled ? 'enabled' : 'disabled');
  }

  // Stäng av/på success sounds
  static async setSuccessSoundEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ successSound: enabled });
    console.log('✨ Success sound', enabled ? 'enabled' : 'disabled');
  }

  // Cleanup vid app shutdown
  static async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up SoundService...');
      
      for (const [name, sound] of Object.entries(this.sounds)) {
        if (sound) {
          await sound.unloadAsync();
          console.log(`🔇 Unloaded ${name}`);
        }
      }
      
      this.sounds = {};
      this.initialized = false;
      console.log('✅ SoundService cleanup complete');
      
    } catch (error) {
      console.warn('⚠️ SoundService cleanup failed:', error);
    }
  }

  // Debug info
  static getDebugInfo(): object {
    return {
      initialized: this.initialized,
      settings: this.settings,
      soundsLoaded: Object.keys(this.sounds),
      soundsStatus: Object.fromEntries(
        Object.entries(this.sounds).map(([key, sound]) => [
          key, 
          sound ? 'loaded' : 'not loaded'
        ])
      )
    };
  }
}

// Export för enkel användning
export default SoundService;