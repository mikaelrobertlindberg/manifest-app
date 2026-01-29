import * as Notifications from 'expo-notifications';

export interface NotificationSettings {
  dailyReminders: boolean;
  smartReminders: boolean;
  morningTime: string; // HH:MM format
  eveningTime: string;  // HH:MM format
  frequency: 'low' | 'medium' | 'high'; // För smarta påminnelser
  
  // TESTING: Frekventa påminnelser för Mike's testing
  testMode: boolean;           // Enable frequent test reminders
  remindersPerDay: number;     // 1-6 påminnelser per dag
  startHour: number;          // Första påminnelse (t.ex. 9)
  endHour: number;            // Sista påminnelse (t.ex. 21)
}

export class NotificationService {
  // Default inställningar för svenska användare
  static defaultSettings: NotificationSettings = {
    dailyReminders: true,
    smartReminders: true,
    morningTime: '08:00',
    eveningTime: '20:00',
    frequency: 'medium',
    
    // TESTING: Frekventa påminnelser
    testMode: true,           // På för Mike's testing
    remindersPerDay: 3,       // 3 påminnelser per dag som start
    startHour: 9,            // Första 09:00
    endHour: 21              // Sista 21:00
  };

  // Kontrollera notifikationsbehörigheter utan att begära nya
  static async checkPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      const hasPermission = status === 'granted';
      console.log(`🔔 Nuvarande notifikationsstatus: ${status} (${hasPermission ? 'OK' : 'DENIED'})`);
      return hasPermission;
    } catch (error) {
      console.error('❌ Fel vid kontroll av notifikationsbehörigheter:', error);
      return false;
    }
  }

  // Begär notifikationsbehörigheter från iOS
  static async requestPermissions(): Promise<boolean> {
    try {
      console.log('🔔 Begär notifikationsbehörigheter...');
      
      const { status } = await Notifications.getPermissionsAsync();
      if (status === 'granted') {
        console.log('✅ Notifikationsbehörigheter redan givna');
        return true;
      }

      const { status: newStatus } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: false,
          allowProvisional: false
        }
      });

      const hasPermission = newStatus === 'granted';
      console.log(`🔔 Notifikationsstatus: ${newStatus} (${hasPermission ? 'OK' : 'DENIED'})`);
      return hasPermission;
      
    } catch (error) {
      console.error('❌ Fel vid begäran av notifikationsbehörigheter:', error);
      return false;
    }
  }

  // Sätt notifikations-hanterare
  static async setupNotificationHandler(): Promise<void> {
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      console.log('🔔 Notification handler setup komplett');
    } catch (error) {
      console.error('❌ Fel vid setup av notification handler:', error);
    }
  }

  // Schemalägg dagliga påminnelser (FIXED - korrekt trigger format)
  static async scheduleDailyReminders(settings: NotificationSettings): Promise<void> {
    try {
      if (!settings.dailyReminders) {
        console.log('📅 Dagliga påminnelser är avaktiverade');
        return;
      }

      console.log('📅 Schemalägg dagliga påminnelser...', settings);
      
      // Rensa befintliga dagliga påminnelser
      await this.cancelNotificationsWithIdentifier('daily-morning');
      await this.cancelNotificationsWithIdentifier('daily-evening');
      
      // Morgonpåminnelse - FIXED trigger format
      const morningTrigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parseInt(settings.morningTime.split(':')[0]),
        minute: parseInt(settings.morningTime.split(':')[1])
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-morning',
        content: {
          title: '🌅 God morgon!',
          body: 'Vad ser du fram emot idag? Ta en stund för tacksamhet.',
          sound: 'default'
        },
        trigger: morningTrigger
      });

      // Kvällspåminnelse - FIXED trigger format  
      const eveningTrigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: parseInt(settings.eveningTime.split(':')[0]),
        minute: parseInt(settings.eveningTime.split(':')[1])
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily-evening',
        content: {
          title: '🌙 Kvällens reflektion',
          body: 'Vad var dagens höjdpunkt? Skriv ned din tacksamhet.',
          sound: 'default'
        },
        trigger: eveningTrigger
      });

      console.log('✅ Dagliga påminnelser schemalagda för', settings.morningTime, 'och', settings.eveningTime);
      
    } catch (error) {
      console.error('❌ Fel vid schemaläggning av dagliga påminnelser:', error);
    }
  }

  // Skicka test-notifikation (FIXED för iOS)
  static async sendTestNotification(): Promise<void> {
    try {
      console.log('🧪 Skickar test-notifikation...');
      
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Saknar notifikationsbehörigheter');
      }

      // FIXED - Immediate trigger för test
      const testTrigger: Notifications.NotificationTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'test-notification',
        content: {
          title: '🧪 Test från Little Bear',
          body: 'Notifikationer fungerar! Din Manifest App är redo för daglig användning. 🌿',
          sound: 'default'
        },
        trigger: testTrigger
      });

      console.log('✅ Test-notifikation schemalagd för 2 sekunder');
      
    } catch (error) {
      console.error('❌ Fel vid test-notifikation:', error);
      throw error;
    }
  }

  // Avboka specifika notifikationer
  static async cancelNotificationsWithIdentifier(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
      console.log(`🗑️ Avbokade notifikationer med ID: ${identifier}`);
    } catch (error) {
      console.error(`❌ Fel vid avbokning av ${identifier}:`, error);
    }
  }

  // Avboka alla notifikationer
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🗑️ Alla notifikationer avbokade');
    } catch (error) {
      console.error('❌ Fel vid avbokning av alla notifikationer:', error);
    }
  }

  // Hämta alla schemalagda notifikationer
  static async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📋 ${scheduled.length} schemalagda notifikationer`);
      return scheduled;
    } catch (error) {
      console.error('❌ Fel vid hämtning av schemalagda notifikationer:', error);
      return [];
    }
  }

  // TESTING: Schemalägg frekventa påminnelser utspridda över dagen
  static async scheduleFrequentReminders(settings: NotificationSettings): Promise<void> {
    try {
      console.log(`🧪 FREQ: Schemalägg ${settings.remindersPerDay} påminnelser mellan ${settings.startHour}:00-${settings.endHour}:00`);
      
      // Rensa befintliga frekventa påminnelser (alla freq-reminder-X)
      for (let i = 1; i <= 10; i++) { // Max 10 för säkerhets skull
        await this.cancelNotificationsWithIdentifier(`freq-reminder-${i}`);
      }
      
      const { remindersPerDay, startHour, endHour } = settings;
      
      if (remindersPerDay === 0) {
        console.log('🧪 FREQ: 0 påminnelser - hoppar över schemaläggning');
        return;
      }
      
      // Beräkna jämn fördelning över dagen
      const totalHours = endHour - startHour;
      const intervalHours = totalHours / remindersPerDay;
      
      console.log(`🧪 FREQ: ${totalHours}h total, ${intervalHours}h intervall mellan påminnelser`);
      
      // Svenska tacksamhetsmeddelanden för test
      const reminderMessages = [
        'Dags för lite tacksamhet? 🌿',
        'Vad har gjort dig glad idag? 😊', 
        'En liten tacksamhet kanske? 💚',
        'Något fint som hänt? ✨',
        'Tid för en positiv reflektion 🌟',
        'Vad värmer ditt hjärta just nu? 💛'
      ];
      
      // Schemalägg varje påminnelse
      for (let i = 0; i < remindersPerDay; i++) {
        const reminderHour = Math.floor(startHour + (i * intervalHours));
        const reminderMinute = Math.floor(((startHour + (i * intervalHours)) % 1) * 60);
        
        // Variera minuter lite för att inte alla kommer exakt på heltimme
        const variationMinutes = Math.floor(Math.random() * 20) - 10; // ±10 min variation
        const finalMinute = Math.max(0, Math.min(59, reminderMinute + variationMinutes));
        
        const message = reminderMessages[i % reminderMessages.length];
        
        console.log(`🧪 FREQ: Påminnelse ${i + 1} kl ${reminderHour}:${finalMinute.toString().padStart(2, '0')} - "${message}"`);
        
        const trigger: Notifications.NotificationTriggerInput = {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: reminderHour,
          minute: finalMinute
        };

        await Notifications.scheduleNotificationAsync({
          identifier: `freq-reminder-${i + 1}`,
          content: {
            title: '🌿 Manifest Tacksamhet',
            body: message,
            sound: 'default'
          },
          trigger: trigger
        });
      }
      
      console.log(`✅ FREQ: ${remindersPerDay} frekventa påminnelser schemalagda!`);
      
    } catch (error) {
      console.error('❌ FREQ: Fel vid schemaläggning av frekventa påminnelser:', error);
    }
  }

  // Uppdatera alla notifikationsinställningar
  static async updateNotifications(settings: NotificationSettings): Promise<void> {
    try {
      console.log('🔄 Uppdaterar alla notifikationsinställningar...', settings);
      
      // Setup notification handler först
      await this.setupNotificationHandler();
      
      // TESTING: Använd frekventa påminnelser om testMode är aktiverat
      if (settings.testMode && settings.remindersPerDay > 0) {
        console.log(`🧪 TEST MODE: Schemalägg ${settings.remindersPerDay} påminnelser per dag`);
        await this.scheduleFrequentReminders(settings);
      } else {
        // Schemalägg vanliga dagliga påminnelser
        await this.scheduleDailyReminders(settings);
      }
      
      console.log('✅ Alla notifikationsinställningar uppdaterade');
      
    } catch (error) {
      console.error('❌ Fel vid uppdatering av notifikationer:', error);
    }
  }

  // Svenska meddelanden för smarta påminnelser
  static getSwedishReminderMessages(): string[] {
    return [
      'Kom ihåg detta fina ögonblick? 🌿',
      'Den här tacksamheten från förut... ✨',
      'Ett ljust minne att reflektera över 💫',
      'Vad sägs om denna gamla favorit? 🌟',
      'En vacker reflektion att komma ihåg 💚',
      'Detta var en fin stund, eller hur? 🌺'
    ];
  }
}