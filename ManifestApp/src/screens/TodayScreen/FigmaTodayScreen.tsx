/**
 * 📐 FIGMA TODAY SCREEN
 * 
 * Pixel-perfect redesign of TodayScreen using Figma Design System
 * Based on our Figma showcase design
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';

// Figma Design System Components
import { 
  FigmaButton, 
  FigmaCard, 
  FigmaInput, 
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
import { LocalStorageService } from '../../services/LocalStorageService';
import { PositivityFilterService, NegativityAnalysis, AIGuidance } from '../../services/PositivityFilterService';
import { AIGuidanceModal } from '../../components/AIGuidanceModal';
import { AISettingsService, AISettings } from '../../services/AISettingsService';

interface FigmaTodayScreenProps {
  onShowHistory?: () => void;
  onShowSettings?: () => void;
  onShowDeveloperTest?: () => void;
  onDeveloperModeToggle?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const FigmaTodayScreen: React.FC<FigmaTodayScreenProps> = ({ 
  onShowHistory, 
  onShowSettings, 
  onShowDeveloperTest, 
  onDeveloperModeToggle 
}) => {
  
  // === STATE ===
  const [gratitudeText, setGratitudeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [gratitudesCount, setGratitudesCount] = useState(0);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [developerTaps, setDeveloperTaps] = useState(0);
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);

  // AI State
  const [aiSettings, setAiSettings] = useState<AISettings>({
    aiFilterEnabled: true,
    cloudAiEnabled: false,
    lastUpdated: new Date().toISOString()
  });
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<NegativityAnalysis | null>(null);
  const [currentGuidance, setCurrentGuidance] = useState<AIGuidance | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // === EFFECTS ===
  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    await Promise.all([
      loadGratitudesCount(),
      checkBackendStatus(),
      loadAISettings()
    ]);
  };

  // === DATA LOADING ===
  const loadGratitudesCount = async () => {
    try {
      const count = await LocalStorageService.getGratitudesCount();
      setGratitudesCount(count);
      setBackendStatus('working');
      console.log('📊 Figma Screen: Loaded gratitudes count:', count);
    } catch (error) {
      console.error('❌ Figma Screen: Error loading gratitudes count:', error);
      setBackendStatus('error');
    }
  };

  const checkBackendStatus = async () => {
    try {
      const status = await LocalStorageService.getBackendStatus();
      setBackendStatus(status.working ? 'working' : 'error');
      console.log('💾 Figma Screen: Backend status check:', status);
    } catch (error) {
      setBackendStatus('error');
    }
  };

  const loadAISettings = async () => {
    try {
      const settings = await AISettingsService.loadSettings();
      setAiSettings(settings);
      console.log('🤖 Figma Screen: AI settings loaded:', settings);
    } catch (error) {
      console.error('❌ Figma Screen: Error loading AI settings:', error);
      setAiSettings({
        aiFilterEnabled: true,
        cloudAiEnabled: false,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // === UTILITY FUNCTIONS ===
  const getSwedishDate = () => {
    const today = new Date();
    const weekdays = [
      'söndag', 'måndag', 'tisdag', 'onsdag', 
      'torsdag', 'fredag', 'lördag'
    ];
    const months = [
      'januari', 'februari', 'mars', 'april', 'maj', 'juni',
      'juli', 'augusti', 'september', 'oktober', 'november', 'december'
    ];
    
    const weekday = weekdays[today.getDay()];
    const day = today.getDate();
    const month = months[today.getMonth()];
    
    return `${weekday}, ${day} ${month}`;
  };

  const getDailyPrompt = () => {
    const prompts = [
      'Vad är du tacksam för idag? 🌿',
      'Vilket litet ögonblick gjorde dig glad idag?',
      'Vad fick dig att le idag?',
      'Vilket vackert ögonblick vill du komma ihåg?',
      'Vad värmde ditt hjärta idag?',
      'Vilket ljust ögonblick stack ut idag?',
      'Vad känner du tacksamhet för just nu?',
    ];
    
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % prompts.length;
    return prompts[index];
  };

  // === AI GUIDANCE HANDLERS ===
  const handleAIGuidanceClose = () => {
    setShowAIGuidance(false);
    setCurrentAnalysis(null);
    setCurrentGuidance(null);
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    setGratitudeText(suggestion);
    handleAIGuidanceClose();
    
    console.log('✅ Figma Screen: Suggestion accepted, saving...');
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleKeepOriginal = () => {
    handleAIGuidanceClose();
    console.log('✅ Figma Screen: User kept original text, saving...');
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleTryAgain = () => {
    handleAIGuidanceClose();
  };

  // === AI ANALYSIS ===
  const analyzeTextForNegativity = async (text: string) => {
    console.log('🔍 Figma Screen: AI analysis starting for text length:', text.length);
    
    if (!aiSettings.aiFilterEnabled || text.length < 5) {
      console.log('🔍 Figma Screen: AI disabled or text too short, proceeding with save');
      performSave();
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await PositivityFilterService.analyzeText(text, aiSettings.cloudAiEnabled);
      console.log('🔍 Figma Screen: AI analysis result:', result);
      
      if (result.analysis.isNegative && result.analysis.confidence > 50) {
        console.log('🔍 Figma Screen: Negative text detected, showing guidance modal');
        setCurrentAnalysis(result.analysis);
        setCurrentGuidance(result.guidance);
        setShowAIGuidance(true);
        setIsAnalyzing(false);
      } else {
        console.log('🔍 Figma Screen: Text is positive, proceeding with save');
        setIsAnalyzing(false);
        performSave();
      }
      
    } catch (error) {
      console.error('❌ Figma Screen: AI analysis error, proceeding with save anyway:', error);
      setIsAnalyzing(false);
      performSave();
    }
  };

  // === SAVE FUNCTIONALITY ===
  const handleSave = async () => {
    if (!gratitudeText.trim()) {
      Alert.alert('Tomt fält', 'Skriv något du är tacksam för först.');
      return;
    }

    if (backendStatus === 'error') {
      Alert.alert(
        'Backend-problem', 
        'Det verkar vara problem med backend-anslutningen. Vill du prova ändå?',
        [
          { text: 'Avbryt', style: 'cancel' },
          { text: 'Prova ändå', onPress: () => performSave() }
        ]
      );
      return;
    }

    console.log('🔍 Figma Screen: Starting save process with AI analysis');
    await analyzeTextForNegativity(gratitudeText);
  };

  const performSave = async () => {
    setIsSaving(true);
    
    try {
      console.log('💾 Figma Screen: Saving gratitude to backend');
      
      const savedEntry = await LocalStorageService.saveGratitude(gratitudeText);
      console.log('✅ Figma Screen: Gratitude saved successfully:', savedEntry.id);
      
      await loadGratitudesCount();
      setBackendStatus('working');
      
      Alert.alert(
        'Tack för idag! 🌿', 
        `Din tacksamhet har sparats!\n\n💚 Totalt: ${gratitudesCount + 1} tacksamheter`,
        [{ 
          text: 'Underbart! 💚', 
          onPress: () => {
            setGratitudeText('');
          }
        }]
      );
      
    } catch (error) {
      console.error('❌ Figma Screen: Save error:', error);
      setBackendStatus('error');
      
      Alert.alert(
        'Sparningsfel', 
        'Något gick fel när tacksamheten skulle sparas.\n\nFel: ' + (error instanceof Error ? error.message : 'Okänt fel'),
        [
          { text: 'OK', style: 'default' },
          { text: 'Prova igen', onPress: () => performSave() }
        ]
      );
    } finally {
      setIsSaving(false);
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

  // === STATUS HELPERS ===
  const getBackendStatusText = () => {
    switch (backendStatus) {
      case 'working': return 'Backend fungerar ✅';
      case 'error': return 'Backend problem ⚠️';
      default: return 'Kontrollerar backend...';
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'working': return DesignTokens.colors.success;
      case 'error': return DesignTokens.colors.error;
      default: return DesignTokens.colors.gray[500];
    }
  };

  // === RENDER ===
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DesignTokens.colors.background} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          
          {/* === FIGMA HEADER === */}
          <View style={styles.header}>
            {/* Settings Button */}
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onShowSettings}
              activeOpacity={0.7}
            >
              <FigmaText variant="headline2" color={DesignTokens.colors.gray[600]}>
                ⚙️
              </FigmaText>
            </TouchableOpacity>
            
            {/* App Title */}
            <FigmaHeading1 color={DesignTokens.colors.primary[500]} align="center">
              🐻 Figma Bear
            </FigmaHeading1>
            
            {/* Date */}
            <FigmaBody color={DesignTokens.colors.gray[600]} align="center" style={styles.dateText}>
              Design System • {getSwedishDate()}
            </FigmaBody>
            
            {/* Counter */}
            {gratitudesCount > 0 && (
              <FigmaCaption color={DesignTokens.colors.primary[500]} align="center" style={styles.counterText}>
                📐 {gratitudesCount} precision entries
              </FigmaCaption>
            )}
          </View>

          {/* === FIGMA BEAR CARD === */}
          <FigmaCard variant="elevated" style={styles.bearCard}>
            <View style={styles.bearContent}>
              <FigmaText variant="headline2" align="center" style={styles.bearEmoji}>
                🐻
              </FigmaText>
              <FigmaHeading3 color={DesignTokens.colors.gray[800]} align="center">
                Design System: Cosmic Sunset
              </FigmaHeading3>
              <FigmaBody color={DesignTokens.colors.gray[600]} align="center" style={styles.bearDescription}>
                Pixel-perfect gratitude med Figma's design principles
              </FigmaBody>
            </View>
          </FigmaCard>

          {/* === FIGMA INPUT CARD === */}
          <FigmaCard variant="default" style={styles.inputCard}>
            <FigmaHeading3 color={DesignTokens.colors.primary[500]} align="center" style={styles.promptTitle}>
              Input Component • Gratitude Field
            </FigmaHeading3>
            
            <FigmaInput
              label={getDailyPrompt()}
              value={gratitudeText}
              onChangeText={setGratitudeText}
              placeholder="Skriv din tacksamhet här..."
              multiline
              style={styles.gratitudeInput}
              disabled={isSaving || isAnalyzing}
            />
            
            {/* AI Analysis Indicator */}
            {isAnalyzing && aiSettings.aiFilterEnabled && (
              <View style={styles.aiIndicator}>
                <FigmaCaption color={DesignTokens.colors.primary[600]}>
                  🤖 AI analyserar precision...
                </FigmaCaption>
              </View>
            )}
            
            {/* Save Button */}
            <FigmaButton 
              title={
                isAnalyzing ? 'Analyserar...' : 
                isSaving ? 'Sparar...' : 
                'Save Component 📐'
              }
              onPress={handleSave}
              loading={isSaving || isAnalyzing}
              disabled={!gratitudeText.trim() || isSaving || isAnalyzing}
              variant="primary"
              fullWidth
              style={styles.saveButton}
            />
          </FigmaCard>

          {/* === FIGMA DESIGN SYSTEM INFO === */}
          <View style={styles.designSystemInfo}>
            
            {/* History Button */}
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={onShowHistory}
              activeOpacity={0.7}
            >
              <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
                📐 Design System v1.0
              </FigmaBody>
              <FigmaBody color={DesignTokens.colors.primary[500]} align="center">
                Components: Card, Input, Button →
              </FigmaBody>
            </TouchableOpacity>

            {/* Status Information */}
            <FigmaCaption color={DesignTokens.colors.gray[500]} align="center" style={styles.statusText}>
              🔔 Design tokens applied
            </FigmaCaption>
            
            <FigmaCaption color={getBackendStatusColor()} align="center" style={styles.statusText}>
              {getBackendStatusText()}
            </FigmaCaption>
            
            {/* Developer Credit */}
            <TouchableOpacity onPress={handleDeveloperTap} activeOpacity={0.7} style={styles.developerCredit}>
              <FigmaCaption color={DesignTokens.colors.gray[500]} align="center">
                ✨ Figma Cosmic Sunset theme active
                {developerTaps > 0 && ` (${developerTaps}/5)`}
              </FigmaCaption>
            </TouchableOpacity>
            
            {/* Developer Test Button */}
            {showDeveloperMode && onShowDeveloperTest && (
              <FigmaButton
                title="🧪 Run Tests"
                onPress={onShowDeveloperTest}
                variant="ghost"
                size="small"
                style={styles.testButton}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* AI Guidance Modal */}
      <AIGuidanceModal
        visible={showAIGuidance}
        onClose={handleAIGuidanceClose}
        guidance={currentGuidance}
        analysis={currentAnalysis}
        originalText={gratitudeText}
        onAcceptSuggestion={handleAcceptSuggestion}
        onKeepOriginal={handleKeepOriginal}
        onTryAgain={handleTryAgain}
      />
    </SafeAreaView>
  );
};

// === FIGMA DESIGN SYSTEM STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: Layout.screenPadding,
    paddingTop: Layout.screenPadding + 10, // Extra space for status bar
  },

  // === HEADER ===
  header: {
    alignItems: 'center',
    marginBottom: Layout.componentSpacing,
    position: 'relative',
  },
  
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.gray[100],
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  
  dateText: {
    marginTop: DesignTokens.spacing.xs,
  },
  
  counterText: {
    marginTop: DesignTokens.spacing.xs,
  },

  // === BEAR CARD ===
  bearCard: {
    marginBottom: Layout.componentSpacing,
  },
  
  bearContent: {
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.md,
  },
  
  bearEmoji: {
    fontSize: 32,
    marginBottom: DesignTokens.spacing.sm,
  },
  
  bearDescription: {
    marginTop: DesignTokens.spacing.xs,
    paddingHorizontal: DesignTokens.spacing.md,
  },

  // === INPUT CARD ===
  inputCard: {
    marginBottom: Layout.componentSpacing,
  },
  
  promptTitle: {
    marginBottom: DesignTokens.spacing.lg,
  },
  
  gratitudeInput: {
    marginBottom: DesignTokens.spacing.md,
  },
  
  aiIndicator: {
    backgroundColor: DesignTokens.colors.primary[50],
    borderRadius: DesignTokens.radius.md,
    padding: DesignTokens.spacing.sm,
    marginBottom: DesignTokens.spacing.md,
    borderWidth: DesignTokens.borderWidth.thin,
    borderColor: DesignTokens.colors.primary[200],
  },
  
  saveButton: {
    marginTop: DesignTokens.spacing.sm,
  },

  // === DESIGN SYSTEM INFO ===
  designSystemInfo: {
    alignItems: 'center',
  },
  
  historyButton: {
    padding: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.md,
    backgroundColor: DesignTokens.colors.gray[50],
    width: '100%',
  },
  
  statusText: {
    marginBottom: DesignTokens.spacing.xs,
  },
  
  developerCredit: {
    padding: DesignTokens.spacing.sm,
    marginTop: DesignTokens.spacing.sm,
  },
  
  testButton: {
    marginTop: DesignTokens.spacing.md,
  },
});

export default FigmaTodayScreen;