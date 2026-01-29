/**
 * 📐 FIGMA SETTINGS SCREEN
 * 
 * Pixel-perfect settings interface using Figma Design System
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
  StatusBar
} from 'react-native';

// Figma Design System Components
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
import { NotificationService } from '../../services/NotificationService';
import { AISettingsService, AISettings } from '../../services/AISettingsService';

interface FigmaSettingsScreenProps {
  onBack: () => void;
}

export const FigmaSettingsScreen: React.FC<FigmaSettingsScreenProps> = ({ onBack }) => {
  
  // === STATE ===
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    morningTime: '09:00',
    eveningTime: '20:00',
  });
  
  const [aiSettings, setAiSettings] = useState<AISettings>({
    aiFilterEnabled: true,
    cloudAiEnabled: false,
    lastUpdated: new Date().toISOString()
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
      
      console.log('📐 FIGMA SETTINGS: Loading settings...');
      
      // Load notification settings  
      const hasNotificationPermission = await NotificationService.requestPermissions();
      setNotificationSettings(prev => ({
        ...prev,
        enabled: hasNotificationPermission
      }));
      
      // Load AI settings
      const loadedAISettings = await AISettingsService.loadSettings();
      setAiSettings(loadedAISettings);
      
      console.log('📐 FIGMA SETTINGS: Settings loaded successfully');
      
    } catch (error) {
      console.error('❌ FIGMA SETTINGS: Error loading settings:', error);
      Alert.alert('Fel', 'Kunde inte ladda inställningar');
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
          await NotificationService.updateNotifications(NotificationService.defaultSettings);
          setNotificationSettings(prev => ({ ...prev, enabled: true }));
          Alert.alert('✅ Påminnelser aktiverade', 'Du kommer få dagliga påminnelser om tacksamhet');
        } else {
          Alert.alert(
            'Behörighet krävs', 
            'För att aktivera påminnelser behöver du tillåta notifikationer i systemets inställningar'
          );
        }
      } else {
        await NotificationService.cancelAllNotifications();
        setNotificationSettings(prev => ({ ...prev, enabled: false }));
        Alert.alert('🔇 Påminnelser inaktiverade', 'Du kommer inte längre få påminnelser');
      }
    } catch (error) {
      console.error('❌ FIGMA SETTINGS: Notification toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera notifikationsinställningar');
    }
  };

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
      console.error('❌ FIGMA SETTINGS: AI toggle error:', error);
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
      console.error('❌ FIGMA SETTINGS: Cloud AI toggle error:', error);
      Alert.alert('Fel', 'Kunde inte uppdatera Cloud AI-inställningar');
    }
  };

  // === OTHER HANDLERS ===
  const handleAbout = () => {
    Alert.alert(
      '📐 Figma Design System',
      `Manifest - Svenska Tacksamhetsappen\n\n` +
      `✨ Design System: Figma Cosmic Sunset\n` +
      `🎨 UI Components: Pixel-perfect design\n` +
      `📱 Platform: React Native\n` +
      `🤖 AI: Positivitetsfilter\n` +
      `🇸🇪 Språk: Svenska\n\n` +
      `Utvecklad med kärlek av Little Bear 🐻`,
      [{ text: 'Stäng', style: 'default' }]
    );
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
            // TODO: Implement data clearing
            Alert.alert('🚧 Funktion kommer snart', 'Denna funktion implementeras i nästa version');
          }
        }
      ]
    );
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
      
      {/* === FIGMA HEADER === */}
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
            ⚙️ Settings
          </FigmaHeading1>
          <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
            Design System • Preferences
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
            🔔 Notifikationer
          </FigmaHeading3>
          
          {renderSettingRow(
            'Dagliga påminnelser',
            'Få påminnelser om att skriva tacksamhet',
            notificationSettings.enabled,
            handleNotificationToggle,
            loading
          )}
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

        {/* === ABOUT === */}
        <FigmaCard variant="default" style={styles.section}>
          <FigmaHeading3 color={DesignTokens.colors.gray[800]} style={styles.sectionTitle}>
            📐 Om Appen
          </FigmaHeading3>
          
          {renderActionRow(
            'Om Manifest',
            'Version, credits och design system info',
            handleAbout
          )}
        </FigmaCard>

        {/* === DESIGN SYSTEM INFO === */}
        <View style={styles.designSystemFooter}>
          <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
            📐 Built med Figma Design System
          </FigmaCaption>
          <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
            🎨 Cosmic Sunset theme • Pixel-perfect components
          </FigmaCaption>
          <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
            🐻 Utvecklad av Little Bear
          </FigmaCaption>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// === FIGMA DESIGN SYSTEM STYLES ===
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

  // === FOOTER ===
  designSystemFooter: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.xs,
  },
});

export default FigmaSettingsScreen;