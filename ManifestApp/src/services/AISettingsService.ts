/**
 * 🤖 AI SETTINGS SERVICE
 * Hantera AI Positivity Filter inställningar
 */

export interface AISettings {
  aiFilterEnabled: boolean;
  cloudAiEnabled: boolean;
  lastUpdated: string;
}

export class AISettingsService {
  private static readonly STORAGE_KEY = 'ai_settings';
  
  private static readonly defaultSettings: AISettings = {
    aiFilterEnabled: true, // Aktiverat som default för bättre UX
    cloudAiEnabled: false, // Privacy-first som default
    lastUpdated: new Date().toISOString()
  };

  /**
   * 📱 LOAD AI SETTINGS
   * Laddar AI-inställningar från AsyncStorage
   */
  public static async loadSettings(): Promise<AISettings> {
    try {
      // TODO: I en riktig app skulle vi använda AsyncStorage
      // const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      // if (stored) {
      //   return JSON.parse(stored);
      // }
      
      // För nu returnerar vi default settings
      console.log('🤖 Loading AI settings (using defaults for now)');
      return this.defaultSettings;
    } catch (error) {
      console.error('❌ Error loading AI settings:', error);
      return this.defaultSettings;
    }
  }

  /**
   * 💾 SAVE AI SETTINGS
   * Sparar AI-inställningar till AsyncStorage
   */
  public static async saveSettings(settings: AISettings): Promise<void> {
    try {
      const updatedSettings = {
        ...settings,
        lastUpdated: new Date().toISOString()
      };

      // TODO: I en riktig app skulle vi använda AsyncStorage
      // await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSettings));
      
      console.log('🤖 AI settings saved:', updatedSettings);
    } catch (error) {
      console.error('❌ Error saving AI settings:', error);
      throw error;
    }
  }

  /**
   * 🔄 UPDATE SPECIFIC SETTING
   * Uppdaterar en specifik AI-inställning
   */
  public static async updateSetting(key: keyof Omit<AISettings, 'lastUpdated'>, value: boolean): Promise<AISettings> {
    try {
      const currentSettings = await this.loadSettings();
      const updatedSettings: AISettings = {
        ...currentSettings,
        [key]: value,
        lastUpdated: new Date().toISOString()
      };

      await this.saveSettings(updatedSettings);
      return updatedSettings;
    } catch (error) {
      console.error('❌ Error updating AI setting:', error);
      throw error;
    }
  }

  /**
   * 🔒 PRIVACY CHECK
   * Kontrollerar om molnanalys är aktiverad och varnar användaren
   */
  public static async checkPrivacySettings(): Promise<{
    shouldWarnAboutCloud: boolean;
    aiEnabled: boolean;
    cloudEnabled: boolean;
  }> {
    try {
      const settings = await this.loadSettings();
      
      return {
        shouldWarnAboutCloud: settings.aiFilterEnabled && settings.cloudAiEnabled,
        aiEnabled: settings.aiFilterEnabled,
        cloudEnabled: settings.cloudAiEnabled
      };
    } catch (error) {
      console.error('❌ Error checking privacy settings:', error);
      return {
        shouldWarnAboutCloud: false,
        aiEnabled: true,
        cloudEnabled: false
      };
    }
  }

  /**
   * 📊 ANALYTICS HELPER
   * Hjälper med anonyma usage analytics för AI features
   */
  public static async getAnonymousUsageStats(): Promise<{
    aiEnabled: boolean;
    cloudEnabled: boolean;
    settingsAge: number; // days since last update
  }> {
    try {
      const settings = await this.loadSettings();
      const lastUpdate = new Date(settings.lastUpdated);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        aiEnabled: settings.aiFilterEnabled,
        cloudEnabled: settings.cloudAiEnabled,
        settingsAge: daysDiff
      };
    } catch (error) {
      console.error('❌ Error getting usage stats:', error);
      return {
        aiEnabled: false,
        cloudEnabled: false,
        settingsAge: 0
      };
    }
  }
}