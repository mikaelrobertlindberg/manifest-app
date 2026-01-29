/**
 * 🤖 SMART NOTIFICATION SERVICE
 * 
 * Intelligent notifikationssystem för Tacksamhet:
 * - Automatisk frekvensanpassning baserat på användning
 * - Max 2 påminnelser per dag
 * - Ingen påminnelse om redan skrivit samma dag
 * - Personliga påminnelser med tidigare tacksamheter
 * - Mjuka, harmoniska vibes
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { LocalStorageService } from './LocalStorageService';

interface UsageStats {
  lastActiveDate: string;
  daysActive: number;
  averageEntriesPerDay: number;
  totalEntries: number;
  lastNotificationDate: string;
  consecutiveDaysWithoutEntry: number;
}

interface SmartNotificationConfig {
  maxPerDay: number;
  baseFrequency: 'low' | 'medium' | 'high';
  personalizedContent: boolean;
  harmonicTiming: boolean;
}

export class SmartNotificationService {
  private static readonly USAGE_STATS_KEY = '@tacksamhet_usage_stats';
  private static readonly NOTIFICATION_CONFIG_KEY = '@tacksamhet_notification_config';
  
  // Default konfiguration för harmoniska, smarta påminnelser
  private static defaultConfig: SmartNotificationConfig = {
    maxPerDay: 2,                    // Max 2 påminnelser per dag
    baseFrequency: 'medium',         // Medium som standard
    personalizedContent: true,       // Använd tidigare tacksamheter
    harmonicTiming: true,           // Naturliga tider på dagen
  };

  // Naturliga, harmoniska tider för påminnelser
  private static harmonicTimes = [
    { hour: 9, minute: 15 },   // Morgon - efter frukost
    { hour: 12, minute: 30 },  // Lunch - reflektion
    { hour: 15, minute: 45 },  // Eftermiddag - mental break
    { hour: 18, minute: 20 },  // Kväll - efter jobbet
    { hour: 20, minute: 10 },  // Kväll - avkoppling
  ];

  // === USAGE TRACKING ===
  
  /**
   * Registrera att användaren har skrivit tacksamhet
   */
  static async recordGratitudeEntry(): Promise<void> {
    try {
      const stats = await this.getUsageStats();
      const today = new Date().toISOString().split('T')[0];
      
      // Uppdatera usage stats
      const updatedStats: UsageStats = {
        ...stats,
        lastActiveDate: today,
        totalEntries: stats.totalEntries + 1,
        consecutiveDaysWithoutEntry: 0, // Reset since we just wrote
      };
      
      // Beräkna genomsnittliga entries per dag
      const daysSinceFirstUse = this.getDaysSince(stats.lastActiveDate || today);
      updatedStats.averageEntriesPerDay = updatedStats.totalEntries / Math.max(daysSinceFirstUse, 1);
      
      await AsyncStorage.setItem(this.USAGE_STATS_KEY, JSON.stringify(updatedStats));
      
      // Avbryt dagens återstående påminnelser (de har redan skrivit)
      await this.cancelTodaysReminders();
      
      // Schemalägg nästa dags påminnelser baserat på nya stats
      await this.scheduleSmartReminders();
      
      console.log('📊 Usage stats uppdaterade:', updatedStats);
    } catch (error) {
      console.error('❌ Error recording gratitude entry:', error);
    }
  }
  
  /**
   * Hämta nuvarande usage statistics
   */
  private static async getUsageStats(): Promise<UsageStats> {
    try {
      const stored = await AsyncStorage.getItem(this.USAGE_STATS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default stats för ny användare
      return {
        lastActiveDate: new Date().toISOString().split('T')[0],
        daysActive: 1,
        averageEntriesPerDay: 0,
        totalEntries: 0,
        lastNotificationDate: '',
        consecutiveDaysWithoutEntry: 0,
      };
    } catch (error) {
      console.error('❌ Error getting usage stats:', error);
      // Return default på error
      return {
        lastActiveDate: new Date().toISOString().split('T')[0],
        daysActive: 1,
        averageEntriesPerDay: 0,
        totalEntries: 0,
        lastNotificationDate: '',
        consecutiveDaysWithoutEntry: 0,
      };
    }
  }
  
  // === SMART SCHEDULING ===
  
  /**
   * Schemalägg smarta påminnelser baserat på användningsstatistik
   */
  static async scheduleSmartReminders(): Promise<void> {
    try {
      const stats = await this.getUsageStats();
      const config = await this.getNotificationConfig();
      
      // Kontrollera om användaren redan skrivit idag
      const today = new Date().toISOString().split('T')[0];
      const hasWrittenToday = stats.lastActiveDate === today;
      
      if (hasWrittenToday) {
        console.log('✅ Användaren har redan skrivit idag - inga påminnelser');
        return;
      }
      
      // Beräkna optimal frekvens baserat på usage
      const frequency = this.calculateOptimalFrequency(stats);
      const notificationsToday = Math.min(frequency, config.maxPerDay);
      
      // Välj harmoniska tider
      const selectedTimes = this.selectHarmonicTimes(notificationsToday);
      
      // Schemalägg notifikationer med personligt innehåll
      for (let i = 0; i < selectedTimes.length; i++) {
        const time = selectedTimes[i];
        const content = await this.generatePersonalizedContent(stats);
        
        await this.scheduleNotificationAtTime(
          time.hour,
          time.minute,
          content.title,
          content.body,
          `smart_reminder_${i}`
        );
      }
      
      console.log(`📱 ${notificationsToday} smarta påminnelser schemalagda för idag`);
    } catch (error) {
      console.error('❌ Error scheduling smart reminders:', error);
    }
  }
  
  /**
   * Beräkna optimal notifikationsfrekvens baserat på användning
   */
  private static calculateOptimalFrequency(stats: UsageStats): number {
    // Ny användare (< 7 dagar) får fler påminnelser
    if (stats.daysActive < 7) {
      return 2; // 2 påminnelser för nya användare
    }
    
    // Aktiva användare (skriver ofta) får färre påminnelser
    if (stats.averageEntriesPerDay >= 1) {
      return 1; // 1 påminnelse för aktiva användare
    }
    
    // Inaktiva användare får gradvis fler påminnelser
    if (stats.consecutiveDaysWithoutEntry >= 3) {
      return 2; // 2 påminnelser om inte skrivit på 3+ dagar
    }
    
    // Standard för normala användare
    return 1;
  }
  
  /**
   * Välj harmoniska tider för påminnelser
   */
  private static selectHarmonicTimes(count: number): Array<{ hour: number; minute: number }> {
    const currentHour = new Date().getHours();
    
    // Filtrera bort tider som redan passerat idag
    const availableTimes = this.harmonicTimes.filter(time => 
      time.hour > currentHour || (time.hour === currentHour && time.minute > new Date().getMinutes())
    );
    
    if (availableTimes.length === 0) {
      // Om alla tider passerat, använd morgondagens första tid
      return [this.harmonicTimes[0]];
    }
    
    // Välj jämnt fördelade tider
    if (count === 1) {
      return [availableTimes[Math.floor(availableTimes.length / 2)]];
    } else if (count === 2) {
      return [
        availableTimes[0],
        availableTimes[Math.floor(availableTimes.length - 1)]
      ];
    }
    
    return availableTimes.slice(0, count);
  }
  
  /**
   * Generera personaliserat notifikationsinnehåll
   */
  private static async generatePersonalizedContent(stats: UsageStats): Promise<{ title: string; body: string }> {
    try {
      // Försök hämta tidigare tacksamheter för personalisering
      const recentGratitudes = await LocalStorageService.getRecentGratitudes(7); // Senaste veckan
      
      if (recentGratitudes.length > 0 && Math.random() > 0.5) {
        // 50% chans att använda personaliserat innehåll från tidigare entries
        const randomEntry = recentGratitudes[Math.floor(Math.random() * recentGratitudes.length)];
        const preview = randomEntry.text.substring(0, 40) + (randomEntry.text.length > 40 ? '...' : '');
        
        return {
          title: '✨ Minns du detta?',
          body: `"${preview}" - Vad är du tacksam för idag? 💫`
        };
      } else {
        // Fallback till generiska, mjuka påminnelser
        return this.getGenericReminderContent();
      }
    } catch (error) {
      console.error('❌ Error generating personalized content:', error);
      return this.getGenericReminderContent();
    }
  }
  
  /**
   * Generiska, harmoniska påminnelser
   */
  private static getGenericReminderContent(): { title: string; body: string } {
    const reminders = [
      {
        title: '🌱 Ett litet ögonblick',
        body: 'Vad fick dig att le idag? Dela din tacksamhet 💫'
      },
      {
        title: '✨ Mjuk påminnelse',
        body: 'Vilket vackert ögonblick vill du komma ihåg från idag? 🌸'
      },
      {
        title: '💫 Stanna upp en stund',
        body: 'Vad är du tacksam för just nu? Små saker räknas också 🌿'
      },
      {
        title: '🌸 Reflektion',
        body: 'Vilken glädje har dagen givit dig? Skriv ner den 💝'
      },
      {
        title: '🌿 Harmonisk paus',
        body: 'Tid för tacksamhet - vad värmer ditt hjärta idag? ✨'
      }
    ];
    
    return reminders[Math.floor(Math.random() * reminders.length)];
  }
  
  // === UTILITY METHODS ===
  
  /**
   * Schemalägg en notifikation vid specifik tid
   */
  private static async scheduleNotificationAtTime(
    hour: number,
    minute: number,
    title: string,
    body: string,
    identifier: string
  ): Promise<void> {
    try {
      const now = new Date();
      const scheduledDate = new Date();
      scheduledDate.setHours(hour, minute, 0, 0);
      
      // Om tiden redan passerat idag, schemalägg för imorgon
      if (scheduledDate <= now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'gentle-chime.wav',
          categoryIdentifier: 'GRATITUDE_REMINDER',
          data: { type: 'smart_reminder' }
        },
        trigger: {
          date: scheduledDate,
        },
        identifier: identifier,
      });
      
      console.log(`📅 Schemalagd påminnelse: ${title} kl ${hour}:${minute.toString().padStart(2, '0')}`);
    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
    }
  }
  
  /**
   * Avbryt dagens återstående påminnelser
   */
  private static async cancelTodaysReminders(): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const today = new Date().toISOString().split('T')[0];
      
      for (const notification of scheduledNotifications) {
        if (notification.identifier.startsWith('smart_reminder_')) {
          const notificationDate = new Date(notification.trigger as any).toISOString().split('T')[0];
          if (notificationDate === today) {
            await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            console.log(`🚫 Cancelled remaining reminder: ${notification.identifier}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error canceling today\'s reminders:', error);
    }
  }
  
  /**
   * Hämta notifikationskonfiguration
   */
  private static async getNotificationConfig(): Promise<SmartNotificationConfig> {
    try {
      const stored = await AsyncStorage.getItem(this.NOTIFICATION_CONFIG_KEY);
      return stored ? JSON.parse(stored) : this.defaultConfig;
    } catch (error) {
      console.error('❌ Error getting notification config:', error);
      return this.defaultConfig;
    }
  }
  
  /**
   * Beräkna antal dagar sedan ett datum
   */
  private static getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // === PUBLIC API ===
  
  /**
   * Aktivera smarta påminnelser
   */
  static async enableSmartReminders(): Promise<boolean> {
    try {
      // Begär behörigheter först
      const hasPermission = await Notifications.requestPermissionsAsync();
      if (hasPermission.status !== 'granted') {
        return false;
      }
      
      // Schemalägg smarta påminnelser
      await this.scheduleSmartReminders();
      
      console.log('✅ Smart reminders activated');
      return true;
    } catch (error) {
      console.error('❌ Error enabling smart reminders:', error);
      return false;
    }
  }
  
  /**
   * Inaktivera alla smarta påminnelser
   */
  static async disableSmartReminders(): Promise<void> {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      for (const notification of scheduledNotifications) {
        if (notification.identifier.startsWith('smart_reminder_')) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
      
      console.log('🚫 All smart reminders disabled');
    } catch (error) {
      console.error('❌ Error disabling smart reminders:', error);
    }
  }
}