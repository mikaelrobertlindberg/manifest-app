import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { SwedishButton } from '../../components/Button/SwedishButton';
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';
import { NotificationService, NotificationSettings } from '../../services/NotificationService';
import { LocalStorageService } from '../../services/LocalStorageService';
import { AISettingsService, AISettings } from '../../services/AISettingsService';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<NotificationSettings>(NotificationService.defaultSettings);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [scheduledCount, setScheduledCount] = useState(0);
  const [gratitudesCount, setGratitudesCount] = useState(0);
  
  // 🤖 AI POSITIVITY FILTER SETTINGS
  const [aiSettings, setAiSettings] = useState<AISettings>({
    aiFilterEnabled: true,
    cloudAiEnabled: false,
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    loadSettings();
    checkNotificationStatus();
    loadGratitudesCount();
    loadAISettings();
  }, []);

  // 🤖 LOAD AI SETTINGS
  const loadAISettings = async () => {
    try {
      const settings = await AISettingsService.loadSettings();
      setAiSettings(settings);
      console.log('🤖 AI settings loaded in SettingsScreen:', settings);
    } catch (error) {
      console.error('❌ Error loading AI settings:', error);
    }
  };

  const loadSettings = async () => {
    try {
      // Här skulle vi ladda från AsyncStorage i en riktig app
      // För nu använder vi default settings
      console.log('Laddar inställningar...');
    } catch (error) {
      console.error('Fel vid laddning av inställningar:', error);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      setSettings(newSettings);
      // Här skulle vi spara till AsyncStorage i en riktig app
      await NotificationService.updateNotifications(newSettings);
      console.log('Inställningar sparade:', newSettings);
      
      // Uppdatera status
      await checkNotificationStatus();
    } catch (error) {
      console.error('Fel vid sparande av inställningar:', error);
      Alert.alert('Fel', 'Kunde inte spara inställningar');
    }
  };

  const checkNotificationStatus = async () => {
    try {
      const scheduledNotifications = await NotificationService.getScheduledNotifications();
      setScheduledCount(scheduledNotifications.length);
      
      const hasPermission = await NotificationService.requestPermissions();
      setPermissionStatus(hasPermission ? 'granted' : 'denied');
    } catch (error) {
      console.error('Fel vid kontroll av notifikationer:', error);
    }
  };

  const loadGratitudesCount = async () => {
    try {
      const count = await LocalStorageService.getGratitudesCount();
      setGratitudesCount(count);
    } catch (error) {
      console.error('Fel vid laddning av antal tacksamheter:', error);
    }
  };

  const toggleDailyReminders = async () => {
    const newSettings = {
      ...settings,
      dailyReminders: !settings.dailyReminders
    };
    await saveSettings(newSettings);
  };

  const toggleSmartReminders = async () => {
    const newSettings = {
      ...settings,
      smartReminders: !settings.smartReminders
    };
    await saveSettings(newSettings);
  };

  const changeFrequency = async (frequency: 'low' | 'medium' | 'high') => {
    const newSettings = {
      ...settings,
      frequency
    };
    await saveSettings(newSettings);
  };

  const changeMorningTime = () => {
    Alert.prompt(
      'Morgonpåminnelse',
      'Ange tid (HH:MM)',
      (time) => {
        if (time && /^\d{2}:\d{2}$/.test(time)) {
          const newSettings = {
            ...settings,
            morningTime: time
          };
          saveSettings(newSettings);
        } else {
          Alert.alert('Ogiltigt format', 'Använd format HH:MM (t.ex. 08:30)');
        }
      },
      'plain-text',
      settings.morningTime
    );
  };

  // 🤖 AI FILTER TOGGLE FUNCTIONS
  const toggleAiFilter = async () => {
    try {
      const newValue = !aiSettings.aiFilterEnabled;
      const updatedSettings = await AISettingsService.updateSetting('aiFilterEnabled', newValue);
      setAiSettings(updatedSettings);
      
      console.log('🤖 AI Filter toggled:', newValue);
      
      if (newValue) {
        Alert.alert(
          '🤖 AI Coach Aktiverad',
          'Little Bear kommer nu hjälpa dig skriva positiva tacksamheter genom att varsamt föreslå omformuleringar när du skriver negativa tankar.',
          [{ text: 'Underbart! 💚' }]
        );
      } else {
        Alert.alert(
          '🤖 AI Coach Inaktiverad',
          'AI-coachen kommer inte längre analysera din text för negativa mönster.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Fel',
        'Kunde inte uppdatera AI-inställningar. Försök igen.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleCloudAi = async () => {
    if (!aiSettings.aiFilterEnabled) {
      Alert.alert(
        'AI Filter Inaktiverad',
        'Du måste först aktivera AI Coach för att använda molnanalys.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const newValue = !aiSettings.cloudAiEnabled;
      
      if (newValue) {
        Alert.alert(
          '🧠 Molnanalys Aktiverad',
          'AI:n kommer nu använda avancerad molnanalys för bättre svenska språkförståelse. Detta kan innebära att din text skickas till externa servrar för analys.',
          [
            { 
              text: 'Avbryt', 
              style: 'cancel'
            },
            { 
              text: 'Jag förstår', 
              onPress: async () => {
                const updatedSettings = await AISettingsService.updateSetting('cloudAiEnabled', true);
                setAiSettings(updatedSettings);
                console.log('🧠 Cloud AI activated:', updatedSettings);
              }
            }
          ]
        );
      } else {
        const updatedSettings = await AISettingsService.updateSetting('cloudAiEnabled', newValue);
        setAiSettings(updatedSettings);
        console.log('🧠 Cloud AI deactivated:', updatedSettings);
        
        Alert.alert(
          '📱 Lokal Analys Aktiverad',
          'AI-analysen sker nu helt lokalt på din enhet för maximal privacy.',
          [{ text: 'Perfekt! 🔒' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Fel',
        'Kunde inte uppdatera molnanalys-inställningar. Försök igen.',
        [{ text: 'OK' }]
      );
    }
  };

  const changeEveningTime = () => {
    Alert.prompt(
      'Kvällspåminnelse',
      'Ange tid (HH:MM)',
      (time) => {
        if (time && /^\d{2}:\d{2}$/.test(time)) {
          const newSettings = {
            ...settings,
            eveningTime: time
          };
          saveSettings(newSettings);
        } else {
          Alert.alert('Ogiltigt format', 'Använd format HH:MM (t.ex. 20:00)');
        }
      },
      'plain-text',
      settings.eveningTime
    );
  };

  const sendTestNotification = async () => {
    try {
      if (permissionStatus !== 'granted') {
        Alert.alert(
          'Behörighet saknas',
          'Aktivera notifikationer i telefonens inställningar först.'
        );
        return;
      }

      await NotificationService.sendTestNotification();
      Alert.alert(
        'Test skickat! 🧪',
        'En test-notifikation kommer att visas om några sekunder.'
      );
    } catch (error) {
      Alert.alert('Fel', 'Kunde inte skicka test-notifikation');
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Radera all data?',
      `Detta kommer att ta bort alla ${gratitudesCount} tacksamheter från backend. Denna åtgärd kan inte ångras.`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Radera allt',
          style: 'destructive',
          onPress: async () => {
            try {
              // Här skulle vi implementera full datarensning
              Alert.alert('Simulering', 'I en riktig app skulle all data raderas här.');
            } catch (error) {
              Alert.alert('Fel', 'Kunde inte radera data');
            }
          }
        }
      ]
    );
  };

  const getFrequencyText = (freq: string) => {
    switch (freq) {
      case 'low': return 'Sällan (1-3 dagar)';
      case 'medium': return 'Måttligt (8-24h)';
      case 'high': return 'Ofta (2-8h)';
      default: return 'Okänd';
    }
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted': return '✅ Aktiverade';
      case 'denied': return '❌ Blockerade';
      default: return '❓ Okänd';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <SwedishButton 
            title="← Tillbaka"
            onPress={onBack}
            variant="text"
            size="small"
          />
          <Text style={styles.title}>Inställningar</Text>
          <Text style={styles.subtitle}>🔧 Anpassa din Manifest-upplevelse</Text>
        </View>

        {/* Notifikationsstatus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Notifikationsstatus</Text>
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Behörighet:</Text>
              <Text style={styles.statusValue}>{getPermissionStatusText()}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Schemalagda:</Text>
              <Text style={styles.statusValue}>{scheduledCount} påminnelser</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Backend:</Text>
              <Text style={styles.statusValue}>💚 {gratitudesCount} tacksamheter</Text>
            </View>
          </View>
        </View>

        {/* Dagliga påminnelser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⏰ Dagliga påminnelser</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Aktivera dagliga påminnelser</Text>
              <Text style={styles.settingDescription}>
                Morgon- och kvällspåminnelser för reflektion
              </Text>
            </View>
            <Switch
              value={settings.dailyReminders}
              onValueChange={toggleDailyReminders}
              trackColor={{ 
                false: SwedishForestTheme.colors.text.disabled, 
                true: SwedishForestTheme.colors.primary 
              }}
              thumbColor={SwedishForestTheme.colors.surface}
            />
          </View>

          {settings.dailyReminders && (
            <View style={styles.subSettings}>
              <TouchableOpacity style={styles.timeButton} onPress={changeMorningTime}>
                <Text style={styles.timeLabel}>🌅 Morgonpåminnelse</Text>
                <Text style={styles.timeValue}>{settings.morningTime}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.timeButton} onPress={changeEveningTime}>
                <Text style={styles.timeLabel}>🌙 Kvällspåminnelse</Text>
                <Text style={styles.timeValue}>{settings.eveningTime}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Smarta påminnelser */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧠 Smarta tacksamhetspåminnelser</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Aktivera smarta påminnelser</Text>
              <Text style={styles.settingDescription}>
                Få påminnelser om tidigare tacksamheter vid lämpliga tillfällen
              </Text>
            </View>
            <Switch
              value={settings.smartReminders}
              onValueChange={toggleSmartReminders}
              trackColor={{ 
                false: SwedishForestTheme.colors.text.disabled, 
                true: SwedishForestTheme.colors.primary 
              }}
              thumbColor={SwedishForestTheme.colors.surface}
            />
          </View>

          {settings.smartReminders && (
            <View style={styles.subSettings}>
              <Text style={styles.subSectionTitle}>Frekvens för smarta påminnelser:</Text>
              
              {(['low', 'medium', 'high'] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    settings.frequency === freq && styles.frequencyButtonActive
                  ]}
                  onPress={() => changeFrequency(freq)}
                >
                  <Text style={[
                    styles.frequencyText,
                    settings.frequency === freq && styles.frequencyTextActive
                  ]}>
                    {freq === settings.frequency ? '● ' : '○ '}
                    {getFrequencyText(freq)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* 🤖 AI Positivity Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Coach & Positivityfilter</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Little Bear AI Coach</Text>
              <Text style={styles.settingDescription}>
                Får vänliga förslag när du skriver negativa tacksamheter
              </Text>
            </View>
            <Switch
              value={aiSettings.aiFilterEnabled}
              onValueChange={toggleAiFilter}
              trackColor={{ 
                false: SwedishForestTheme.colors.text.disabled, 
                true: SwedishForestTheme.colors.primary 
              }}
              thumbColor={SwedishForestTheme.colors.surface}
            />
          </View>

          {aiSettings.aiFilterEnabled && (
            <View style={styles.subSettings}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>🧠 Avancerad molnanalys</Text>
                  <Text style={styles.settingDescription}>
                    Bättre svenska språkförståelse (skickar text till molnet)
                  </Text>
                </View>
                <Switch
                  value={aiSettings.cloudAiEnabled}
                  onValueChange={toggleCloudAi}
                  trackColor={{ 
                    false: SwedishForestTheme.colors.text.disabled, 
                    true: '#4299E1' 
                  }}
                  thumbColor={SwedishForestTheme.colors.surface}
                />
              </View>

              <View style={styles.aiInfo}>
                <Text style={styles.aiInfoTitle}>🐻 Så fungerar AI Coach:</Text>
                <Text style={styles.aiInfoText}>
                  • Analyserar din text medan du skriver{'\n'}
                  • Upptäcker negativa formuleringar{'\n'}
                  • Ger vänliga omformulerings-förslag{'\n'}
                  • Hjälper dig fokusera på tacksamhet{'\n'}
                  • {aiSettings.cloudAiEnabled ? '🧠 Avancerad molnanalys aktiv' : '📱 Lokal analys (privat)'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Test och felsökning */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧪 Test och felsökning</Text>
          
          <SwedishButton
            title="Skicka test-notifikation"
            onPress={sendTestNotification}
            variant="secondary"
            disabled={permissionStatus !== 'granted'}
          />
          
          {permissionStatus !== 'granted' && (
            <Text style={styles.warningText}>
              ⚠️ Aktivera notifikationer i telefonens inställningar för att testa
            </Text>
          )}
        </View>

        {/* Data och säkerhet */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Data och säkerhet</Text>
          
          <View style={styles.dataInfo}>
            <Text style={styles.dataText}>
              All din data lagras säkert på enheten och synkroniseras med backend.
            </Text>
            <Text style={styles.dataText}>
              💚 {gratitudesCount} tacksamheter sparade i backend
            </Text>
          </View>

          <SwedishButton
            title="⚠️ Radera all data"
            onPress={clearAllData}
            variant="text"
            size="small"
          />
        </View>

        {/* App information */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌿 Manifest App v1.0</Text>
          <Text style={styles.footerSubtext}>
            Sveriges första tacksamhetsapp på svenska
          </Text>
          <Text style={styles.footerSubtext}>
            Utvecklad med kärlek och svensk lagom-filosofi
          </Text>
          <Text style={styles.footerDeveloper}>
            🐻 Utvecklad av Little Bear
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SwedishForestTheme.colors.background,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: SwedishForestTheme.spacing.lg,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: SwedishForestTheme.spacing.xl,
    paddingBottom: SwedishForestTheme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: SwedishForestTheme.colors.text.disabled,
  },
  
  title: {
    fontSize: SwedishForestTheme.typography.fontSize.h1,
    fontWeight: '600',
    color: SwedishForestTheme.colors.primary,
    marginTop: SwedishForestTheme.spacing.md,
  },
  
  subtitle: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginTop: SwedishForestTheme.spacing.sm,
    textAlign: 'center',
  },
  
  section: {
    marginBottom: SwedishForestTheme.spacing.xl,
  },
  
  sectionTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.h2,
    fontWeight: '500',
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.md,
  },
  
  statusCard: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    ...SwedishForestTheme.shadows.card,
  },
  
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  statusLabel: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
  },
  
  statusValue: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
    fontWeight: '500',
  },
  
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    marginBottom: SwedishForestTheme.spacing.md,
    ...SwedishForestTheme.shadows.card,
  },
  
  settingInfo: {
    flex: 1,
    marginRight: SwedishForestTheme.spacing.md,
  },
  
  settingLabel: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '500',
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.xs,
  },
  
  settingDescription: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    lineHeight: SwedishForestTheme.typography.lineHeight.normal * SwedishForestTheme.typography.fontSize.caption,
  },
  
  subSettings: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    ...SwedishForestTheme.shadows.card,
  },
  
  subSectionTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '500',
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.md,
  },
  
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SwedishForestTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: SwedishForestTheme.colors.background,
  },
  
  timeLabel: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
  },
  
  timeValue: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.primary,
    fontWeight: '500',
  },
  
  frequencyButton: {
    paddingVertical: SwedishForestTheme.spacing.sm,
    paddingHorizontal: SwedishForestTheme.spacing.md,
    borderRadius: SwedishForestTheme.borderRadius.medium,
    marginBottom: SwedishForestTheme.spacing.xs,
  },
  
  frequencyButtonActive: {
    backgroundColor: SwedishForestTheme.colors.background,
  },
  
  frequencyText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
  },
  
  frequencyTextActive: {
    color: SwedishForestTheme.colors.primary,
    fontWeight: '500',
  },
  
  warningText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.warning,
    textAlign: 'center',
    marginTop: SwedishForestTheme.spacing.md,
    fontStyle: 'italic',
  },
  
  dataInfo: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    marginBottom: SwedishForestTheme.spacing.md,
    ...SwedishForestTheme.shadows.card,
  },
  
  dataText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    lineHeight: SwedishForestTheme.typography.lineHeight.normal * SwedishForestTheme.typography.fontSize.caption,
    marginBottom: SwedishForestTheme.spacing.sm,
  },

  // 🤖 AI SETTINGS STYLES
  aiInfo: {
    backgroundColor: '#E8F4FD',
    padding: SwedishForestTheme.spacing.md,
    borderRadius: SwedishForestTheme.borderRadius.medium,
    marginTop: SwedishForestTheme.spacing.md,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  
  aiInfoTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  aiInfoText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: '#1976D2',
    lineHeight: SwedishForestTheme.typography.lineHeight.normal * SwedishForestTheme.typography.fontSize.caption,
  },
  
  footer: {
    alignItems: 'center',
    paddingTop: SwedishForestTheme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: SwedishForestTheme.colors.text.disabled,
  },
  
  footerText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '600',
    color: SwedishForestTheme.colors.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  footerSubtext: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: SwedishForestTheme.spacing.xs,
  },
  
  footerDeveloper: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SwedishForestTheme.spacing.sm,
  },
});