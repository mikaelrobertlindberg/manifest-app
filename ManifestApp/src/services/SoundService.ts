// TEMPORARY STUB: expo-av removed for Google Play submission (RECORD_AUDIO permission issue)
// Will be restored after app is live on Play Store

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AudioSettings {
  enabled: boolean;          // Huvudkontroll för all ljud
  reminderChime: boolean;    // Mjukt för påminnelser  
  successSound: boolean;     // Harmoniskt för sparade inlägg
  volume: number;           // 0.0 - 1.0
}

export class SoundService {
  private static settings: AudioSettings = {
    enabled: true,
    reminderChime: true,
    successSound: true,
    volume: 0.6
  };

  static defaultSettings: AudioSettings = {
    enabled: true,
    reminderChime: true, 
    successSound: true,
    volume: 0.6
  };

  private static initialized = false;

  // Initialisera SoundService - kör vid app-start
  static async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      console.log('🔊 Initialiserar SoundService (AUDIO DISABLED for Play Store)...');
      
      // Audio functionality temporarily disabled
      await this.loadSettings();
      
      this.initialized = true;
      console.log('🎵 SoundService initialiserad med settings (audio disabled):', this.settings);
      
    } catch (error) {
      console.warn('⚠️ SoundService initialization failed:', error);
      this.settings.enabled = false;
      this.initialized = true;
    }
  }

  static async loadSettings(): Promise<AudioSettings> {
    try {
      const saved = await AsyncStorage.getItem('@SoundService:settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.settings = { ...this.defaultSettings, ...parsed };
        console.log('🔊 Laddade audio settings:', this.settings);
      } else {
        this.settings = { ...this.defaultSettings };
        await this.saveSettings(this.settings);
        console.log('🔊 Skapade default audio settings:', this.settings);
      }
      return this.settings;
    } catch (error) {
      console.error('❌ Fel vid laddning av audio settings:', error);
      return this.defaultSettings;
    }
  }

  static async saveSettings(settings: AudioSettings): Promise<void> {
    try {
      this.settings = settings;
      await AsyncStorage.setItem('@SoundService:settings', JSON.stringify(settings));
      console.log('🔊 Sparade audio settings:', settings);
    } catch (error) {
      console.error('❌ Fel vid sparning av audio settings:', error);
    }
  }

  static getSettings(): AudioSettings {
    return { ...this.settings };
  }

  static async updateSettings(newSettings: Partial<AudioSettings>): Promise<void> {
    const updated = { ...this.settings, ...newSettings };
    await this.saveSettings(updated);
  }

  // STUB METHODS (will be restored when expo-av is added back)
  
  static async playSuccessHarmony(): Promise<void> {
    if (!this.settings.enabled || !this.settings.successSound) {
      return;
    }
    
    // TEMPORARY: Just log instead of playing sound
    console.log('✨ Spelade success harmony (volume: ' + this.settings.volume + ') LOG');
  }

  static async playReminderChime(): Promise<void> {
    if (!this.settings.enabled || !this.settings.reminderChime) {
      return;
    }
    
    // TEMPORARY: Just log instead of playing sound
    console.log('🔔 Spelade reminder chime (volume: ' + this.settings.volume + ') LOG');
  }

  static async setEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ enabled });
    console.log('🔊 Sound service', enabled ? 'enabled' : 'disabled');
  }

  static async setReminderChimeEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ reminderChime: enabled });
  }

  static async setSuccessSoundEnabled(enabled: boolean): Promise<void> {
    await this.updateSettings({ successSound: enabled });
  }

  static async setVolume(volume: number): Promise<void> {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    await this.updateSettings({ volume: clampedVolume });
  }

  static async cleanup(): Promise<void> {
    try {
      console.log('🧹 Cleaning up SoundService (no cleanup needed in stub mode)...');
      console.log('✅ SoundService cleanup complete');
    } catch (error) {
      console.warn('⚠️ SoundService cleanup failed:', error);
    }
  }
}

export default SoundService;