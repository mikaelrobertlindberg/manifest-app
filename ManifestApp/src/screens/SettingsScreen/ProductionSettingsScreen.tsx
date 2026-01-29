/**
 * ⚙️ PRODUCTION SETTINGS SCREEN
 * 
 * Clean, minimal settings för production release
 * Bara essentiella inställningar - inga debug/test features
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
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

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
import { SmartNotificationService } from '../../services/SmartNotificationService';
import { SoundService, AudioSettings } from '../../services/SoundService';
// Components
import { LanguageSelector } from '../../components/LanguageSelector';

interface ProductionSettingsScreenProps {
  onBack: () => void;
}

export const ProductionSettingsScreen: React.FC<ProductionSettingsScreenProps> = ({ 
  onBack
}) => {
  
  // === HOOKS ===
  const { t } = useTranslation();
  
  // === STATE ===
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyReminders: false,
    smartReminders: true,    // Smart automatic reminders
    morningTime: '09:00',
    eveningTime: '20:00',
    frequency: 'smart',      // Auto-adjusts based on usage
    testMode: false,         // No test mode in production
    remindersPerDay: 2,      // Max 2 per day 
    startHour: 9,
    endHour: 21
  });

  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: true,
    reminderChime: true,
    successSound: true,
    volume: 0.6
  });
  
  const [loading, setLoading] = useState(true);

  // === EFFECTS ===
  useEffect(() => {
    loadSettings();
  }, []);

  // === DATA LOADING ===
  const loadSettings = async () => {
    try {
      setLoading(true);
      
      console.log('⚙️ PRODUCTION SETTINGS: Loading settings...');
      
      // Load notification settings
      const hasNotificationPermission = await NotificationService.checkPermissions();
      setNotificationSettings(prev => ({
        ...prev,
        dailyReminders: hasNotificationPermission
      }));

      // Load audio settings
      const loadedAudioSettings = await SoundService.loadSettings();
      setAudioSettings(loadedAudioSettings);
      
      console.log('⚙️ PRODUCTION SETTINGS: Settings loaded successfully');
      
    } catch (error) {
      console.error('❌ PRODUCTION SETTINGS: Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // === NOTIFICATION HANDLERS ===
  const handleNotificationToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        const success = await SmartNotificationService.enableSmartReminders();
        if (success) {
          setNotificationSettings(prev => ({ 
            ...prev, 
            dailyReminders: true,
            smartReminders: true
          }));
          
          Alert.alert(
            t('alerts.smartNotificationsEnabled'),
            t('alerts.smartNotificationsEnabledMessage')
          );
        } else {
          Alert.alert(
            t('alerts.permissionDeniedTitle'),
            t('alerts.permissionDeniedMessage')
          );
        }
      } else {
        await SmartNotificationService.disableSmartReminders();
        setNotificationSettings(prev => ({ ...prev, dailyReminders: false }));
        
        Alert.alert(t('alerts.notificationsDisabledTitle'), t('alerts.notificationsDisabledMessage'));
      }
    } catch (error) {
      console.error('❌ Smart notification toggle error:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.notificationUpdateError'));
    }
  };

  // === AUDIO HANDLERS ===
  const handleAudioToggle = async (enabled: boolean) => {
    try {
      const newSettings = { ...audioSettings, enabled };
      await SoundService.updateSettings(newSettings);
      setAudioSettings(newSettings);
    } catch (error) {
      console.error('❌ Audio toggle error:', error);
      Alert.alert(t('alerts.errorTitle'), t('alerts.audioUpdateError'));
    }
  };

  const handleReminderChimeToggle = async (enabled: boolean) => {
    try {
      const newSettings = { ...audioSettings, reminderChime: enabled };
      await SoundService.updateSettings(newSettings);
      setAudioSettings(newSettings);
    } catch (error) {
      console.error('❌ Reminder chime toggle error:', error);
    }
  };

  const handleSuccessSoundToggle = async (enabled: boolean) => {
    try {
      const newSettings = { ...audioSettings, successSound: enabled };
      await SoundService.updateSettings(newSettings);
      setAudioSettings(newSettings);
    } catch (error) {
      console.error('❌ Success sound toggle error:', error);
    }
  };

  // testAllSounds function removed per Mike's request

  // === SUPPORT HANDLERS ===
  const handleAbout = () => {
    Alert.alert(
      t('about.title'),
      t('about.message'),
      [{ text: t('alerts.okButton') }]
    );
  };

  const handleBugReport = () => {
    const deviceInfo = `App: Tacksamhet 1.0.0
Device: ${Platform.OS} ${Platform.Version}  
Datum: ${new Date().toLocaleDateString('sv-SE')}
Tid: ${new Date().toLocaleTimeString('sv-SE')}
Notiser: ${notificationSettings.dailyReminders ? 'På' : 'Av'}
Ljud: ${audioSettings.enabled ? 'På' : 'Av'}`;
    
    const emailSubject = 'Buggrapport - Tacksamhet';
    const emailBody = `Hej!

Jag upptäckte ett problem i Tacksamhet-appen.

BESKRIVNING AV PROBLEMET:
[Skriv här vad som gick fel]


VAD JAG FÖRVÄNTADE MIG:
[Skriv här vad som skulle ha hänt]


VAD SOM HÄNDE ISTÄLLET:
[Skriv här vad som faktiskt hände]


=== TEKNISK INFORMATION ===
${deviceInfo}

Med vänlig hälsning,
[Ditt namn]`;

    const emailURL = `mailto:support@tacksamhet.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    Linking.openURL(emailURL).catch(err => {
      console.error('Could not open email app:', err);
      Alert.alert(
        t('alerts.couldNotOpenEmail'),
        t('alerts.couldNotOpenEmailMessage'),
        [{ text: t('alerts.okButton') }]
      );
    });
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
        disabled={disabled || loading}
        trackColor={{ 
          false: DesignTokens.colors.gray[300], 
          true: DesignTokens.colors.primary[300] 
        }}
        thumbColor={value ? DesignTokens.colors.primary[500] : DesignTokens.colors.gray[50]}
      />
    </View>
  );

  const renderActionRow = (title: string, description: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.actionInfo}>
        <FigmaBody color={DesignTokens.colors.gray[800]}>
          {title}
        </FigmaBody>
        <FigmaCaption color={DesignTokens.colors.gray[600]} style={styles.actionDescription}>
          {description}
        </FigmaCaption>
      </View>
      <FigmaBody color={DesignTokens.colors.primary[500]}>
        →
      </FigmaBody>
    </TouchableOpacity>
  );

  // === MAIN RENDER ===
  return (
    <LinearGradient
      colors={[
        '#FFFFFF',           // Pure white at top
        '#FFF5F0',          // Warmer cream tone
        '#FFE4D6',          // Richer orange/peach 
        '#FFCCCB',          // Warmer coral/pink
        '#FFE5E5',          // Warm pink base
      ]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
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
              {t('settings.title')}
            </FigmaHeading1>
            <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
              {t('settings.subtitle')}
            </FigmaBody>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* === NOTIFICATION SETTINGS === */}
          <FigmaCard variant="default" style={styles.section}>
            <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
              {t('settings.notificationsSectionTitle')}
            </FigmaHeading3>
            
            {renderSettingRow(
              t('settings.dailyReminders'),
              t('settings.dailyRemindersDescription'),
              notificationSettings.dailyReminders,
              handleNotificationToggle,
              loading
            )}
          </FigmaCard>

          {/* === AUDIO SETTINGS === */}
          <FigmaCard variant="default" style={styles.section}>
            <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
              {t('settings.audioSectionTitle')}
            </FigmaHeading3>
            
            {renderSettingRow(
              t('settings.soundNotifications'),
              t('settings.soundNotificationsDescription'),
              audioSettings.enabled,
              handleAudioToggle,
              loading
            )}
            
            {audioSettings.enabled && (
              <>
                {renderSettingRow(
                  t('settings.reminderSounds'),
                  t('settings.reminderSoundsDescription'),
                  audioSettings.reminderChime,
                  handleReminderChimeToggle,
                  loading
                )}

                {renderSettingRow(
                  t('settings.successSounds'),
                  t('settings.successSoundsDescription'),
                  audioSettings.successSound,
                  handleSuccessSoundToggle,
                  loading
                )}

                {/* Testa ljud function removed per Mike's request */}
              </>
            )}
          </FigmaCard>

          {/* === LANGUAGE SETTINGS === */}
          <FigmaCard variant="default" style={styles.section}>
            <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
              {t('settings.languageSectionTitle')}
            </FigmaHeading3>
            
            <View style={styles.languageSelectorContainer}>
              <LanguageSelector 
                onLanguageChange={(languageCode) => {
                  console.log(`🌍 Language changed to: ${languageCode}`);
                  // Force re-render by updating state if needed
                }}
              />
            </View>
          </FigmaCard>

          {/* === SUPPORT === */}
          <FigmaCard variant="default" style={styles.section}>
            <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
              {t('settings.supportSectionTitle')}
            </FigmaHeading3>
            
            {renderActionRow(
              t('settings.aboutApp'),
              t('settings.aboutDescription'),
              handleAbout
            )}
            
            {renderActionRow(
              t('settings.reportBug'),
              t('settings.reportBugDescription'),
              handleBugReport
            )}
          </FigmaCard>

          {/* === FOOTER === */}
          <View style={styles.footer}>
            <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
              {t('general.footer')}
            </FigmaCaption>
            <FigmaCaption color={DesignTokens.colors.gray[400]} align="center" style={styles.creditText}>
              {t('general.credit')}
            </FigmaCaption>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  safeArea: {
    flex: 1,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPadding,
    paddingTop: Layout.screenPadding + 10,
    borderBottomWidth: DesignTokens.borderWidth.hairline,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  backButton: {
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerContent: {
    flex: 1,
    marginLeft: DesignTokens.spacing.md,
  },

  // === SCROLL ===
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: Layout.screenPadding,
  },

  // === SECTIONS ===
  section: {
    marginBottom: DesignTokens.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  sectionTitle: {
    marginBottom: DesignTokens.spacing.md,
  },

  // === LANGUAGE SELECTOR ===
  languageSelectorContainer: {
    minHeight: 200,
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

  // === FOOTER ===
  footer: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.xs,
  },
  
  creditText: {
    marginTop: DesignTokens.spacing.sm,
    fontSize: 11,
    fontStyle: 'italic',
  },
});

export default ProductionSettingsScreen;