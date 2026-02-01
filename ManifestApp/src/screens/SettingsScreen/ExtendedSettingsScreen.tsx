/**
 * ⚙️ EXTENDED SETTINGS SCREEN
 * 
 * Samlar ALLT utom huvudprompt - stats, debug, dev tools, navigation
 * Som Mike ville ha det - inget "klotter" på huvudskärmen
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
  Platform,
  Linking
} from 'react-native';

// Figma Design System
import { 
  FigmaButton, 
  FigmaCard, 
  FigmaText,
  FigmaHeading1,
  FigmaHeading2,
  FigmaHeading3,
  FigmaBody,
  FigmaCaption,
  DesignTokens,
  Layout
} from '../../design-system/components';

// Services
import { NotificationService, NotificationSettings } from '../../services/NotificationService';
import { AISettingsService, AISettings } from '../../services/AISettingsService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { SoundService, AudioSettings } from '../../services/SoundService';

interface ExtendedSettingsScreenProps {
  onBack: () => void;
  onShowHistory?: () => void;
  onShowDeveloperTest?: () => void;
  onDeveloperModeToggle?: () => void;
}

export const ExtendedSettingsScreen: React.FC<ExtendedSettingsScreenProps> = ({ 
  onBack,
  onShowHistory,
  onShowDeveloperTest,
  onDeveloperModeToggle
}) => {
  
  // === STATE ===
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyReminders: false,
    smartReminders: false, 
    morningTime: '09:00',
    eveningTime: '20:00',
    frequency: 'medium',
    testMode: true,         // På för Mike's testing
    remindersPerDay: 3,     // Start med 3 påminnelser
    startHour: 9,
    endHour: 21
  });
  
  const [aiSettings, setAiSettings] = useState<AISettings>({
    aiFilterEnabled: true,
    cloudAiEnabled: false,
    lastUpdated: new Date().toISOString()
  });

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: true,
    reminderChime: true,
    successSound: true,
    volume: 0.6
  });
  
  const [appStats, setAppStats] = useState({
    gratitudesCount: 0,
    backendStatus: 'unknown' as 'unknown' | 'working' | 'error',
    backendDetails: [] as string[],
  });
  
  const [loading, setLoading] = useState(true);
  const [developerTaps, setDeveloperTaps] = useState(0);
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);

  // === EFFECTS ===
  useEffect(() => {
    loadAllSettings();
  }, []);

  // === DATA LOADING ===
  const loadAllSettings = async () => {
    try {
      setLoading(true);
      
      console.log('⚙️ EXTENDED SETTINGS: Loading all settings...');
      
      // Load notification settings
      const hasNotificationPermission = await NotificationService.checkPermissions();
      setNotificationSettings(prev => ({
        ...prev,
        dailyReminders: hasNotificationPermission
      }));
      
      // Load AI settings
      const loadedAISettings = await AISettingsService.loadSettings();
      setAiSettings(loadedAISettings);

      // Load audio settings
      const loadedAudioSettings = await SoundService.loadSettings();
      setAudioSettings(loadedAudioSettings);
      
      // Load app statistics
      const gratitudesCount = await LocalStorageService.getGratitudesCount();
      const backendStatus = await LocalStorageService.getBackendStatus();
      
      setAppStats({
        gratitudesCount,
        backendStatus: backendStatus.working ? 'working' : 'error',
        backendDetails: backendStatus.details,
      });
      
      console.log('⚙️ EXTENDED SETTINGS: All settings loaded successfully');
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Error loading settings:', error);
      Alert.alert('Fel', 'Kunde inte ladda alla inställningar');
    } finally {
      setLoading(false);
    }
  };

  // === NOTIFICATION HANDLERS ===
  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          // Använd current settings men aktivera dailyReminders
          const newSettings = { ...notificationSettings, dailyReminders: true };
          await NotificationService.updateNotifications(newSettings);
          setNotificationSettings(newSettings);
          
          const modeText = newSettings.testMode ? 
            `${newSettings.remindersPerDay} test-påminnelser per dag` : 
            'dagliga påminnelser';
          Alert.alert('✅ Påminnelser aktiverade', `Du kommer få ${modeText}`);
        } else {
          Alert.alert(
            'Behörighet krävs', 
            'För att aktivera påminnelser behöver du tillåta notifikationer i systemets inställningar'
          );
        }
      } else {
        await NotificationService.cancelAllNotifications();
        const newSettings = { ...notificationSettings, dailyReminders: false };
        setNotificationSettings(newSettings);
        Alert.alert('🔇 Påminnelser inaktiverade', 'Du kommer inte längre få påminnelser');
      }
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Notification toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera notifikationsinställningar');
    }
  };

  // TESTING: Handlers för frekventa påminnelser
  const handleTestModeToggle = async (enabled: boolean) => {
    try {
      const newSettings = { ...notificationSettings, testMode: enabled };
      setNotificationSettings(newSettings);
      
      if (notificationSettings.dailyReminders) {
        await NotificationService.updateNotifications(newSettings);
      }
      
      const modeText = enabled ? 'Test-mode aktiverat - fler påminnelser per dag' : 'Vanliga dagliga påminnelser';
      Alert.alert('🧪 Test-mode', modeText);
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Test mode toggle error:', error);
    }
  };

  const handleRemindersPerDayChange = async (count: number) => {
    try {
      const newSettings = { ...notificationSettings, remindersPerDay: count };
      setNotificationSettings(newSettings);
      
      if (notificationSettings.dailyReminders && notificationSettings.testMode) {
        await NotificationService.updateNotifications(newSettings);
        Alert.alert('🔄 Uppdaterat', `Nu får du ${count} påminnelser per dag`);
      }
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Reminders per day error:', error);
    }
  };

  const showRemindersPerDayPicker = () => {
    Alert.alert(
      '🧪 Påminnelser per dag',
      'Välj hur många påminnelser du vill få varje dag för testing:',
      [
        { text: '1 påminnelse', onPress: () => handleRemindersPerDayChange(1) },
        { text: '2 påminnelser', onPress: () => handleRemindersPerDayChange(2) },
        { text: '3 påminnelser', onPress: () => handleRemindersPerDayChange(3) },
        { text: '4 påminnelser', onPress: () => handleRemindersPerDayChange(4) },
        { text: '5 påminnelser', onPress: () => handleRemindersPerDayChange(5) },
        { text: '6 påminnelser', onPress: () => handleRemindersPerDayChange(6) },
        { text: 'Avbryt', style: 'cancel' }
      ]
    );
  };

  const testNotificationNow = async () => {
    try {
      // Försök begära permissions först
      const hasPermission = await NotificationService.requestPermissions();
      
      if (!hasPermission) {
        Alert.alert(
          '🔐 Notifikationer blockerade',
          'iOS tillåter inte notifikationer för denna PWA.\n\nLösning:\n1. Gå till iPhone Settings\n2. Leta efter "Manifest" eller "Safari"\n3. Aktivera notifikationer\n4. Kom tillbaka och försök igen',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Skicka test om vi har behörighet
      await NotificationService.sendTestNotification();
      Alert.alert(
        '🧪 Test skickad!', 
        'Du bör få en test-notifikation inom några sekunder!'
      );
      
      // Aktivera också dagliga påminnelser automatiskt vid lyckad test
      const newSettings = { ...notificationSettings, dailyReminders: true };
      setNotificationSettings(newSettings);
      
    } catch (error) {
      console.error('❌ Test notification error:', error);
      Alert.alert('Fel', 'Notifikationer fungerar inte: ' + error);
    }
  };

  // EMERGENCY: Force enable för Mike's testing (hoppar över iOS-behörigheter)
  const forceEnableNotifications = async () => {
    Alert.alert(
      '🚨 Force Aktivera',
      'Detta aktiverar påminnelsesinställningar utan iOS-behörighet. Notifikationer kommer inte visas, men du kan testa inställningarna.',
      [
        { text: 'Avbryt', style: 'cancel' },
        { 
          text: 'Force Aktivera', 
          style: 'destructive',
          onPress: () => {
            const newSettings = { 
              ...notificationSettings, 
              dailyReminders: true,
              testMode: true,
              remindersPerDay: 4
            };
            setNotificationSettings(newSettings);
            Alert.alert('🚨 Aktiverat', 'Påminnelseinställningar är nu på (utan riktiga notifikationer)');
          }
        }
      ]
    );
  };

  // Debug: Logga notification settings
  useEffect(() => {
    console.log('🔔 DEBUG: Current notification settings:', notificationSettings);
  }, [notificationSettings]);

  // === AI HANDLERS ===
  const handleAIFilterToggle = async (enabled: boolean) => {
    try {
      const newSettings: AISettings = {
        ...aiSettings,
        aiFilterEnabled: enabled,
        lastUpdated: new Date().toISOString()
      };
      
      await AISettingsService.saveSettings(newSettings);
      setAiSettings(newSettings);
      
      Alert.alert(
        enabled ? '🤖 AI Filter aktiverat' : '🔇 AI Filter inaktiverat',
        enabled 
          ? 'AI kommer analysera dina inlägg för positivitet'
          : 'AI analysen är nu avstängd'
      );
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: AI toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera AI-inställningar');
    }
  };

  const handleCloudAIToggle = async (enabled: boolean) => {
    try {
      const newSettings: AISettings = {
        ...aiSettings,
        cloudAiEnabled: enabled,
        lastUpdated: new Date().toISOString()
      };
      
      await AISettingsService.saveSettings(newSettings);
      setAiSettings(newSettings);
      
      Alert.alert(
        enabled ? '☁️ Cloud AI aktiverat' : '📱 Lokal AI aktiverat',
        enabled 
          ? 'Använder cloud-baserad AI för bättre analys'
          : 'Använder lokal AI för snabbare svar'
      );
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Cloud AI toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera Cloud AI-inställningar');
    }
  };

  // === AUDIO HANDLERS ===
  const handleAudioToggle = async (enabled: boolean) => {
    try {
      await SoundService.setEnabled(enabled);
      setAudioSettings(prev => ({ ...prev, enabled }));
      
      if (enabled) {
        // Test sound when enabling
        await SoundService.playReminderChime();
        Alert.alert('🔊 Ljud aktiverat', 'Appen kommer nu spela subtila ljud för feedback');
      } else {
        Alert.alert('🔇 Ljud av', 'Appen är nu helt tyst');
      }
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Audio toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera ljudinställningar');
    }
  };

  const handleReminderChimeToggle = async (enabled: boolean) => {
    try {
      await SoundService.setReminderChimeEnabled(enabled);
      setAudioSettings(prev => ({ ...prev, reminderChime: enabled }));
      
      if (enabled) {
        // Test the chime
        await SoundService.playReminderChime();
      }
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Reminder chime toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera chime-inställningar');
    }
  };

  const handleSuccessSoundToggle = async (enabled: boolean) => {
    try {
      await SoundService.setSuccessSoundEnabled(enabled);
      setAudioSettings(prev => ({ ...prev, successSound: enabled }));
      
      if (enabled) {
        // Test the harmony
        await SoundService.playSuccessHarmony();
      }
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Success sound toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera success-ljud inställningar');
    }
  };

  const handleVolumeChange = async (volume: number) => {
    try {
      await SoundService.setVolume(volume);
      setAudioSettings(prev => ({ ...prev, volume }));
      
      // Play test sound at new volume
      await SoundService.playReminderChime();
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Volume change error:', error);
    }
  };

  const testAllSounds = async () => {
    try {
      Alert.alert(
        '🎵 Testa ljud',
        'Lyssnar på båda ljudeffekterna...',
        [{ text: 'OK' }]
      );
      
      // Play reminder chime first
      await SoundService.playReminderChime();
      
      // Wait a bit, then play success harmony
      setTimeout(async () => {
        await SoundService.playSuccessHarmony();
      }, 1500);
      
    } catch (error) {
      console.error('❌ EXTENDED SETTINGS: Test sounds error:', error);
      Alert.alert('Fel', 'Kunde inte testa ljud');
    }
  };

  // === NAVIGATION HANDLERS ===
  const handleShowHistory = () => {
    if (onShowHistory) {
      onShowHistory();
    } else {
      Alert.alert('Navigation', 'History screen inte tillgänglig');
    }
  };

  // === DEVELOPER MODE ===
  const handleDeveloperTap = () => {
    try {
      const newTaps = developerTaps + 1;
      setDeveloperTaps(newTaps);
      
      if (newTaps === 5) {
        setShowDeveloperMode(true);
        if (onDeveloperModeToggle) {
          onDeveloperModeToggle();
        }
        Alert.alert(
          '🧪 Developer Mode Activated!', 
          'Self-test funktionalitet är nu tillgänglig.',
          [{ text: 'Cool! 🚀' }]
        );
      } else if (newTaps === 3) {
        Alert.alert('🤔', 'Fortsätt trycka... 👨‍💻');
      }
      
      setTimeout(() => setDeveloperTaps(0), 10000);
    } catch (error) {
      console.error('Developer mode activation error:', error);
      Alert.alert('Error', 'Developer mode activation failed');
    }
  };

  // === OTHER HANDLERS ===
  const handleAbout = () => {
    Alert.alert(
      'Om Tacksamhet',
      `Tacksamhet v1.0.0\n\n` +
      `En app för daglig tacksamhetspraktik.\n` +
      `29 SEK engångsköp, inga prenumerationer.\n\n` +
      `✨ Minimalistisk design\n` +
      `🤖 AI-stödd positivitetsfilter\n` +
      `🇸🇪 Helt på svenska\n\n` +
      `Utvecklad med ❤️`,
      [{ text: 'OK' }]
    );
  };

  const handleBugReport = () => {
    const deviceInfo = `
App: Tacksamhet 1.0.0
Device: ${Platform.OS} ${Platform.Version}
Time: ${new Date().toLocaleString('sv-SE')}
Backend: ${appStats.backendStatus}
Gratitudes: ${appStats.gratitudesCount}
    `.trim();
    
    const emailURL = `mailto:support@tacksamhet.app?subject=Bug Report - Tacksamhet&body=Hej! Jag upptäckte ett fel i appen.%0D%0A%0D%0ABeskrivning av problemet:%0D%0A%0D%0A%0D%0AVad förväntade jag mig:%0D%0A%0D%0A%0D%0AVad hände istället:%0D%0A%0D%0A%0D%0A--- Teknisk info ---%0D%0A${encodeURIComponent(deviceInfo)}`;
    
    Linking.openURL(emailURL).catch(err => {
      console.error('Could not open email app:', err);
      Alert.alert(
        'Kunde inte öppna email',
        'Skicka fel-rapporten till: support@tacksamhet.app\n\nInkludera:\n• Beskrivning av problemet\n• Vad du förväntade dig\n• Vad som hände istället',
        [{ text: 'OK' }]
      );
    });
  };

  const handleDataExport = () => {
    Alert.alert(
      '📤 Exportera Data',
      'Denna funktion kommer snart. Du kommer kunna exportera alla dina tacksamheter till JSON eller CSV format.',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleDataClear = () => {
    Alert.alert(
      '⚠️ Rensa Alla Data',
      'Är du säker på att du vill ta bort ALLA dina tacksamheter? Detta går inte att ångra.',
      [
        { text: 'Avbryt', style: 'cancel' },
        { 
          text: 'Ja, rensa allt', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('🚧 Funktion kommer snart', 'Denna funktion implementeras i nästa version');
          }
        }
      ]
    );
  };

  // === STATUS HELPERS ===
  const getBackendStatusColor = () => {
    switch (appStats.backendStatus) {
      case 'working': return DesignTokens.colors.success;
      case 'error': return DesignTokens.colors.error;
      default: return DesignTokens.colors.gray[500];
    }
  };

  const getBackendStatusText = () => {
    switch (appStats.backendStatus) {
      case 'working': return 'Backend fungerar ✅';
      case 'error': return 'Backend problem ⚠️';
      default: return 'Kontrollerar backend...';
    }
  };

  // === RENDER HELPERS ===
  const renderSettingRow = (
    title: string, 
    description: string, 
    value: boolean, 
    onToggle: (value: boolean) => void,
    disabled?: boolean
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <FigmaBody color={DesignTokens.colors.gray[800]} style={styles.settingTitle}>
          {title}
        </FigmaBody>
        <FigmaCaption color={DesignTokens.colors.gray[600]} style={styles.settingDescription}>
          {description}
        </FigmaCaption>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        disabled={disabled}
        trackColor={{
          false: DesignTokens.colors.gray[300],
          true: DesignTokens.colors.primary[300]
        }}
        thumbColor={value ? DesignTokens.colors.primary[500] : DesignTokens.colors.gray[100]}
        ios_backgroundColor={DesignTokens.colors.gray[300]}
      />
    </View>
  );

  const renderActionRow = (title: string, description: string, onPress: () => void, variant: 'default' | 'danger' = 'default') => (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionInfo}>
        <FigmaBody color={variant === 'danger' ? DesignTokens.colors.error : DesignTokens.colors.gray[800]}>
          {title}
        </FigmaBody>
        <FigmaCaption color={DesignTokens.colors.gray[600]} style={styles.actionDescription}>
          {description}
        </FigmaCaption>
      </View>
      <FigmaText color={DesignTokens.colors.gray[400]}>
        →
      </FigmaText>
    </TouchableOpacity>
  );

  // === MAIN RENDER ===
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DesignTokens.colors.background} />
      
      {/* === HEADER === */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <FigmaText variant="headline2" color={DesignTokens.colors.primary[500]}>
            ←
          </FigmaText>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <FigmaHeading1 color={DesignTokens.colors.primary[500]} align="center">
            ⚙️ Allt annat
          </FigmaHeading1>
          <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
            Inställningar • Stats • Navigation
          </FigmaBody>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* === APP STATISTICS === */}
        <FigmaCard variant="elevated" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            📊 Statistik
          </FigmaHeading3>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <FigmaText variant="headline2" color={DesignTokens.colors.primary[500]} align="center">
                {appStats.gratitudesCount}
              </FigmaText>
              <FigmaCaption color={DesignTokens.colors.gray[600]} align="center">
                Tacksamheter
              </FigmaCaption>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <FigmaText variant="headline2" color={getBackendStatusColor()} align="center">
                {appStats.backendStatus === 'working' ? '✅' : '⚠️'}
              </FigmaText>
              <FigmaCaption color={DesignTokens.colors.gray[600]} align="center">
                Backend
              </FigmaCaption>
            </View>
          </View>
          
          <FigmaCaption color={getBackendStatusColor()} align="center" style={styles.backendStatus}>
            {getBackendStatusText()}
          </FigmaCaption>
        </FigmaCard>

        {/* === NAVIGATION === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            🧭 Navigation
          </FigmaHeading3>
          
          {renderActionRow(
            'Visa historik',
            `${appStats.gratitudesCount} sparade tacksamheter`,
            handleShowHistory
          )}
        </FigmaCard>

        {/* === NOTIFICATION SETTINGS === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            🔔 Notifikationer
          </FigmaHeading3>
          
          {renderSettingRow(
            'Dagliga påminnelser',
            'Få påminnelser om att skriva tacksamhet',
            notificationSettings.dailyReminders,
            handleNotificationToggle,
            loading
          )}
          
          {/* Visa test-mode settings alltid så Mike kan se dem */}
          {renderSettingRow(
            '🧪 Test-mode',
            'Frekventa påminnelser för testing (kräver påminnelser på)',
            notificationSettings.testMode,
            handleTestModeToggle,
            loading || !notificationSettings.dailyReminders
          )}
          
          {/* Visa påminnelse-frekvens när test-mode är på */}
          {renderActionRow(
            `📊 Påminnelser per dag: ${notificationSettings.remindersPerDay}`,
            `Utspridda ${notificationSettings.startHour}:00-${notificationSettings.endHour}:00 ${notificationSettings.testMode && notificationSettings.dailyReminders ? '(AKTIV)' : '(INAKTIV)'}`,
            () => showRemindersPerDayPicker()
          )}
          
          {/* Test notification för att verifiera */}
          {renderActionRow(
            'Skicka test-notifikation',
            'Testa att notifikationer fungerar nu',
            () => testNotificationNow()
          )}
          
          {/* EMERGENCY: Force enable för testing */}
          {!notificationSettings.dailyReminders && (
            <>
              {renderActionRow(
                '🚨 Force aktivera (nödläge)',
                'Aktivera påminnelser utan iOS-behörighet (endast för testing)',
                () => forceEnableNotifications()
              )}
            </>
          )}
          
          <View style={styles.infoBox}>
            <FigmaCaption color={DesignTokens.colors.gray[600]} style={{ lineHeight: 18 }}>
              🧪 För att testa: Sätt PÅ både "Dagliga påminnelser" + "Test-mode", välj antal påminnelser per dag, tryck "Skicka test-notifikation" för att kolla att det fungerar.
            </FigmaCaption>
          </View>
        </FigmaCard>

        {/* === SOUND SETTINGS === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            🔊 Ljud & Feedback
          </FigmaHeading3>
          
          {renderSettingRow(
            'Ljudnotiser',
            'Aktivera subtila ljud för bättre upplevelse',
            audioSettings.enabled,
            handleAudioToggle,
            loading
          )}
          
          {audioSettings.enabled && (
            <>
              {renderSettingRow(
                'Påminnelse-pling',
                'Mjukt ljud när appen frågar om tacksamhet',
                audioSettings.reminderChime,
                handleReminderChimeToggle,
                loading
              )}
              
              {renderSettingRow(
                'Success-harmoni',
                'Harmoniskt ljud när tacksamhet sparas',
                audioSettings.successSound,
                handleSuccessSoundToggle,
                loading
              )}
              
              {renderActionRow(
                'Testa alla ljud',
                'Lyssna på påminnelse + success-ljud',
                testAllSounds
              )}
            </>
          )}
          
          <View style={styles.infoBox}>
            <FigmaCaption color={DesignTokens.colors.gray[600]} style={{ lineHeight: 18 }}>
              💡 Subtila ljud som förstärker tacksamhetsupplevelsen. Stäng av för helt tyst användning.
            </FigmaCaption>
          </View>
        </FigmaCard>

        {/* === AI SETTINGS === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            🤖 AI Positivitetsfilter
          </FigmaHeading3>
          
          {renderSettingRow(
            'AI Filter',
            'Analysera inlägg för positivitet och ge förslag',
            aiSettings.aiFilterEnabled,
            handleAIFilterToggle,
            loading
          )}
          
          {renderSettingRow(
            'Cloud AI',
            'Använd cloud-baserad AI för bättre analys',
            aiSettings.cloudAiEnabled,
            handleCloudAIToggle,
            loading || !aiSettings.aiFilterEnabled
          )}
          
          <View style={styles.aiInfo}>
            <FigmaCaption color={DesignTokens.colors.gray[500]}>
              AI hjälper dig skriva mer positiva tacksamheter genom att analysera text och ge förslag för förbättringar.
            </FigmaCaption>
          </View>
        </FigmaCard>

        {/* === DATA MANAGEMENT === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            💾 Data Management
          </FigmaHeading3>
          
          {renderActionRow(
            'Exportera data',
            'Ladda ner alla dina tacksamheter',
            handleDataExport
          )}
          
          {renderActionRow(
            'Rensa alla data',
            'Ta bort alla sparkade tacksamheter permanent',
            handleDataClear,
            'danger'
          )}
        </FigmaCard>

        {/* === DEVELOPER SECTION === */}
        <FigmaCard variant="outlined" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            🧪 Developer Tools
          </FigmaHeading3>
          
          <TouchableOpacity onPress={handleDeveloperTap} activeOpacity={0.7} style={styles.developerCredit}>
            <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
              🐻 Utvecklad av Lilla Björn
              {developerTaps > 0 && ` (${developerTaps}/5)`}
            </FigmaBody>
            <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
              Tryck 5 gånger för developer mode
            </FigmaCaption>
          </TouchableOpacity>
          
          {showDeveloperMode && onShowDeveloperTest && (
            <FigmaButton
              title="🧪 Run Backend Tests"
              onPress={onShowDeveloperTest}
              variant="ghost"
              size="small"
              style={styles.testButton}
            />
          )}
          
          {/* Debug Info (Always visible in DEV) */}
          {(__DEV__ || showDeveloperMode) && (
            <View style={styles.debugSection}>
              <FigmaCaption color={DesignTokens.colors.gray[500]} style={styles.debugTitle}>
                🔍 Debug Information:
              </FigmaCaption>
              {appStats.backendDetails.map((detail, index) => (
                <FigmaCaption key={index} color={DesignTokens.colors.gray[400]} style={styles.debugDetail}>
                  • {detail}
                </FigmaCaption>
              ))}
              <FigmaCaption color={DesignTokens.colors.gray[400]} style={styles.debugDetail}>
                • AI Filter: {aiSettings.aiFilterEnabled ? 'Enabled' : 'Disabled'}
              </FigmaCaption>
              <FigmaCaption color={DesignTokens.colors.gray[400]} style={styles.debugDetail}>
                • Cloud AI: {aiSettings.cloudAiEnabled ? 'Enabled' : 'Disabled'}
              </FigmaCaption>
            </View>
          )}
        </FigmaCard>

        {/* === SUPPORT === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            💬 Support
          </FigmaHeading3>
          
          {renderActionRow(
            'Om Tacksamhet',
            'Version, information och credits',
            handleAbout
          )}
          
          {renderActionRow(
            '🐛 Rapportera fel',
            'Hittade ett problem? Hjälp oss förbättra appen',
            handleBugReport
          )}
        </FigmaCard>

        {/* === FOOTER === */}
        <View style={styles.footer}>
          <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
            ✨ Minimal design för fokuserad tacksamhet
          </FigmaCaption>
          <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
            🎨 Figma Design System • Pixel-perfect components
          </FigmaCaption>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPadding,
    paddingTop: Layout.screenPadding + 10,
    borderBottomWidth: DesignTokens.borderWidth.hairline,
    borderBottomColor: DesignTokens.colors.gray[200],
  },
  
  backButton: {
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.gray[100],
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerContent: {
    flex: 1,
    marginLeft: DesignTokens.spacing.md,
  },

  // === CONTENT ===
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: Layout.screenPadding,
    paddingTop: DesignTokens.spacing.md,
  },

  // === SECTIONS ===
  section: {
    marginBottom: DesignTokens.spacing.lg,
  },
  
  sectionTitle: {
    marginBottom: DesignTokens.spacing.md,
  },

  // === STATISTICS ===
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: DesignTokens.spacing.md,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statDivider: {
    width: DesignTokens.borderWidth.thin,
    height: 40,
    backgroundColor: DesignTokens.colors.gray[200],
  },
  
  backendStatus: {
    marginTop: DesignTokens.spacing.sm,
  },

  // === SETTING ROWS ===
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DesignTokens.spacing.sm,
    borderBottomWidth: DesignTokens.borderWidth.hairline,
    borderBottomColor: DesignTokens.colors.gray[200],
  },
  
  settingInfo: {
    flex: 1,
    marginRight: DesignTokens.spacing.md,
  },
  
  settingTitle: {
    marginBottom: DesignTokens.spacing.xs / 2,
  },
  
  settingDescription: {
    lineHeight: 16,
  },

  // === ACTION ROWS ===
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: DesignTokens.spacing.md,
    borderBottomWidth: DesignTokens.borderWidth.hairline,
    borderBottomColor: DesignTokens.colors.gray[200],
  },
  
  actionInfo: {
    flex: 1,
  },
  
  actionDescription: {
    marginTop: DesignTokens.spacing.xs / 2,
    lineHeight: 16,
  },

  // === AI INFO ===
  aiInfo: {
    marginTop: DesignTokens.spacing.md,
    padding: DesignTokens.spacing.sm,
    backgroundColor: DesignTokens.colors.primary[50],
    borderRadius: DesignTokens.radius.sm,
    borderWidth: DesignTokens.borderWidth.hairline,
    borderColor: DesignTokens.colors.primary[200],
  },

  // === DEVELOPER SECTION ===
  developerCredit: {
    padding: DesignTokens.spacing.md,
    alignItems: 'center',
  },
  
  testButton: {
    marginTop: DesignTokens.spacing.md,
  },
  
  debugSection: {
    marginTop: DesignTokens.spacing.md,
    padding: DesignTokens.spacing.sm,
    backgroundColor: DesignTokens.colors.gray[50],
    borderRadius: DesignTokens.radius.sm,
  },
  
  debugTitle: {
    marginBottom: DesignTokens.spacing.xs,
    fontWeight: '600',
  },
  
  debugDetail: {
    marginBottom: DesignTokens.spacing.xs / 2,
    lineHeight: 16,
  },

  // === FOOTER ===
  footer: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.xs,
  },
});

export default ExtendedSettingsScreen;