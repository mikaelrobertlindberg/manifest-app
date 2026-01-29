import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
const LittleBearMeditation = require('../../../assets/characters/little-bear-meditation.png');
import { SwedishButton } from '../../components/Button/SwedishButton';
// EmojiToolbar removed - emojis available via keyboard
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';
import { LocalStorageService } from '../../services/LocalStorageService';
import { PositivityFilterService, NegativityAnalysis, AIGuidance } from '../../services/PositivityFilterService';
import { AIGuidanceModal } from '../../components/AIGuidanceModal';
import { AISettingsService, AISettings } from '../../services/AISettingsService';

interface TodayScreenProps {
  onShowHistory?: () => void;
  onShowSettings?: () => void;
  onShowDeveloperTest?: () => void;
  onDeveloperModeToggle?: () => void;
}

export const TodayScreen: React.FC<TodayScreenProps> = ({ onShowHistory, onShowSettings, onShowDeveloperTest, onDeveloperModeToggle }) => {
  const [gratitudeText, setGratitudeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [gratitudesCount, setGratitudesCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'working' | 'error'>('unknown');
  const [developerTaps, setDeveloperTaps] = useState(0);
  const [showDeveloperMode, setShowDeveloperMode] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // 🤖 AI POSITIVITY FILTER STATE
  const [aiSettings, setAiSettings] = useState<AISettings>({
    aiFilterEnabled: true,
    cloudAiEnabled: false,
    lastUpdated: new Date().toISOString()
  });
  const [showAIGuidance, setShowAIGuidance] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<NegativityAnalysis | null>(null);
  const [currentGuidance, setCurrentGuidance] = useState<AIGuidance | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // analysisTimeoutRef removed - no more auto-triggers on text change

  // MOBILE-SAFE: Ladda antal tacksamheter vid start
  useEffect(() => {
    loadGratitudesCount();
    checkBackendStatus();
    loadAISettings();
    
    // 🔍 DEBUG: Test AI service on startup
    setTimeout(() => {
      console.log('🔍 DEBUG: Testing AI service...');
      PositivityFilterService.analyzeText('jag är ful', false).then(result => {
        console.log('🔍 DEBUG: AI service test result:', result);
      }).catch(error => {
        console.error('❌ DEBUG: AI service test failed:', error);
      });
    }, 2000);
  }, []);

  // 🤖 LOAD AI SETTINGS (DEBUG VERSION)
  const loadAISettings = async () => {
    try {
      console.log('🔍 DEBUG: Loading AI settings...');
      const settings = await AISettingsService.loadSettings();
      setAiSettings(settings);
      console.log('🤖 DEBUG: AI settings loaded successfully:', settings);
      console.log('🤖 DEBUG: AI enabled status:', settings.aiFilterEnabled);
    } catch (error) {
      console.error('❌ DEBUG: Error loading AI settings:', error);
      // Fallback to enabled for debugging
      setAiSettings({
        aiFilterEnabled: true,
        cloudAiEnabled: false,
        lastUpdated: new Date().toISOString()
      });
      console.log('🤖 DEBUG: Using fallback AI settings (enabled)');
    }
  };

  // 🤖 AI: No more timeouts needed - analysis only on save button

  const loadGratitudesCount = async () => {
    try {
      const count = await LocalStorageService.getGratitudesCount();
      setGratitudesCount(count);
      setBackendStatus('working');
      console.log('📊 Laddat antal tacksamheter:', count);
    } catch (error) {
      console.error('❌ Fel vid laddning av antal tacksamheter:', error);
      setBackendStatus('error');
    }
  };

  const checkBackendStatus = async () => {
    try {
      const status = await LocalStorageService.getBackendStatus();
      setBackendStatus(status.working ? 'working' : 'error');
      console.log('💾 Backend health check:', status);
    } catch (error) {
      setBackendStatus('error');
    }
  };

  // Svenska datumsformat
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

  // Svenska tacksamhetsprompts som roterar
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
    
    // Använd dagens datum för att få samma prompt hela dagen
    const today = new Date().toDateString();
    const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % prompts.length;
    return prompts[index];
  };

  // 🤖 AI GUIDANCE HANDLERS
  const handleAIGuidanceClose = () => {
    setShowAIGuidance(false);
    setCurrentAnalysis(null);
    setCurrentGuidance(null);
  };

  const handleAcceptSuggestion = (suggestion: string) => {
    setGratitudeText(suggestion);
    setCursorPosition(suggestion.length);
    handleAIGuidanceClose();
    
    console.log('✅ DEBUG: Suggestion accepted, now saving...');
    // Auto-save efter suggestion accepteras
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleKeepOriginal = () => {
    handleAIGuidanceClose();
    console.log('✅ DEBUG: User kept original text, now saving...');
    // Auto-save eftersom användaren valde att behålla original
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleTryAgain = () => {
    handleAIGuidanceClose();
    // Focus på text input för att användaren kan prova igen
    setTimeout(() => {
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }, 100);
  };

  // Emoji functionality removed - users can access emojis via keyboard

  // 🤖 AI ANALYSIS FUNCTION - Now runs only on Save button press
  const analyzeTextForNegativity = async (text: string) => {
    console.log('🔍 DEBUG: analyzeTextForNegativity called with text:', text.substring(0, 30) + '...');
    console.log('🔍 DEBUG: AI enabled status:', aiSettings.aiFilterEnabled);
    console.log('🔍 DEBUG: Text length:', text.length);
    
    if (!aiSettings.aiFilterEnabled) {
      console.log('🔍 DEBUG: AI disabled, proceeding with save');
      performSave(); // Spara direkt om AI är av
      return;
    }
    
    if (text.length < 5) {
      console.log('🔍 DEBUG: Text too short, proceeding with save');
      performSave(); // Spara direkt om texten är för kort
      return;
    }
    
    console.log('🔍 DEBUG: Starting AI analysis...');
    setIsAnalyzing(true);
    
    try {
      const result = await PositivityFilterService.analyzeText(text, aiSettings.cloudAiEnabled);
      console.log('🔍 DEBUG: AI analysis result:', result);
      
      if (result.analysis.isNegative && result.analysis.confidence > 50) {
        console.log('🔍 DEBUG: Negative text detected! Showing modal instead of saving...');
        setCurrentAnalysis(result.analysis);
        setCurrentGuidance(result.guidance);
        setShowAIGuidance(true);
        setIsAnalyzing(false); // Stop analyzing, show modal instead
      } else {
        console.log('🔍 DEBUG: Text is positive! Proceeding with save...');
        setIsAnalyzing(false);
        performSave(); // Spara om texten är positiv
      }
      
    } catch (error) {
      console.error('❌ DEBUG: AI analysis error, proceeding with save anyway:', error);
      setIsAnalyzing(false);
      performSave(); // Spara ändå om AI analysen misslyckades
    }
  };

  // Text ändringar och cursor position (DEBUG VERSION)
  const handleTextChange = (text: string) => {
    console.log('🚨 EMERGENCY DEBUG: Text changed, length:', text.length, 'text:', text);
    console.log('🚨 EMERGENCY: This should appear EVERY time you type!');
    setGratitudeText(text);
    
    // 🤖 AI ANALYSIS REMOVED FROM TEXT CHANGE
    // Analysen körs nu bara när man trycker "Spara"
  };

  const handleSelectionChange = (event: any) => {
    try {
      setCursorPosition(event.nativeEvent.selection.start);
    } catch (error) {
      console.log('Selection tracking skipped (not critical)');
    }
  };

  // MOBILE-SAFE: Förbättrad sparning med error handling + AI analys
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

    // 🤖 AI ANALYS: Kör först när användaren trycker "Spara"
    console.log('🔍 DEBUG: Running AI analysis before save...');
    await analyzeTextForNegativity(gratitudeText);
  };

  const performSave = async () => {
    setIsSaving(true);
    
    try {
      console.log('💾 Försöker spara tacksamhet:', gratitudeText.substring(0, 50) + '...');
      
      const savedEntry = await LocalStorageService.saveGratitude(gratitudeText);
      console.log('✅ Tacksamhet sparad framgångsrikt:', savedEntry.id);
      
      // Uppdatera räknaren och backend status
      await loadGratitudesCount();
      setBackendStatus('working');
      
      Alert.alert(
        'Tack för idag! 🌿', 
        `Din tacksamhet har sparats i backend!\n\n💚 Totalt: ${gratitudesCount + 1} tacksamheter`,
        [{ 
          text: 'Underbart! 💚', 
          onPress: () => {
            setGratitudeText('');
            setCursorPosition(0);
          }
        }]
      );
      
    } catch (error) {
      console.error('❌ Sparningsfel:', error);
      setBackendStatus('error');
      
      Alert.alert(
        'Backend-fel', 
        'Något gick fel när tacksamheten skulle sparas. Detta kan vara ett tillfälligt problem.\n\nFel: ' + (error instanceof Error ? error.message : 'Okänt fel'),
        [
          { text: 'OK', style: 'default' },
          { text: 'Prova igen', onPress: () => performSave() }
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getBackendStatusText = () => {
    switch (backendStatus) {
      case 'working': return '💾 Backend: Fungerar perfekt! ✅';
      case 'error': return '💾 Backend: Problem upptäckt ⚠️';
      default: return '💾 Backend: Kontrollerar anslutning...';
    }
  };

  const getBackendStatusColor = () => {
    switch (backendStatus) {
      case 'working': return SwedishForestTheme.colors.primary;
      case 'error': return SwedishForestTheme.colors.error;
      default: return SwedishForestTheme.colors.text.secondary;
    }
  };

  // Developer mode activation (tap Little Bear 5 times)
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
          'Self-test funktionalitet är nu tillgänglig. Tryck "🧪 Run Tests" för att testa frontend mot backend.',
          [{ text: 'Cool! 🚀' }]
        );
      } else if (newTaps === 3) {
        Alert.alert('🤔', 'Fortsätt trycka... 👨‍💻');
      }
      
      // Reset after 10 seconds
      setTimeout(() => setDeveloperTaps(0), 10000);
    } catch (error) {
      console.error('Developer mode activation error:', error);
      Alert.alert('Error', 'Developer mode activation failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={onShowSettings}
              activeOpacity={0.7}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
            
            <Text style={styles.appTitle}>🚀 PREMIUM MANIFEST 🐻</Text>
            <Text style={styles.date}>Idag, {getSwedishDate()}</Text>
            {gratitudesCount > 0 && (
              <Text style={styles.counter}>
                💚 {gratitudesCount} tacksamheter sparade i backend
              </Text>
            )}
          </View>

        {/* Little Bear Welcome */}
        <View style={styles.littleBearContainer}>
          <Text style={styles.littleBearEmoji}>🐻</Text>
          <Text style={styles.littleBearText}>Välkommen till din tacksamhetsresa! 🌿</Text>
          <Text style={styles.littleBearSubtext}>Little Bear Premium Graphics Loading...</Text>
        </View>
          
          <View style={styles.inputCard}>
            <Text style={styles.prompt}>{getDailyPrompt()}</Text>
            
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              value={gratitudeText}
              onChangeText={handleTextChange}
              onSelectionChange={handleSelectionChange}
              placeholder="Börja skriva här... Vad är du tacksam för idag?"
              placeholderTextColor={SwedishForestTheme.colors.text.disabled}
              multiline
              textAlignVertical="top"
              selectionColor={SwedishForestTheme.colors.primary}
              editable={!isSaving}
            />
            
            {/* 🤖 AI ANALYSIS INDICATOR */}
            {isAnalyzing && aiSettings.aiFilterEnabled && (
              <View style={styles.aiIndicator}>
                <Text style={styles.aiIndicatorText}>
                  🤖 Little Bear analyserar... 
                </Text>
              </View>
            )}
            
            {/* EmojiToolbar removed - users have emoji keyboard access */}
            
            <SwedishButton 
              title={
                isAnalyzing ? 'Analyserar med AI...' : 
                isSaving ? 'Sparar till backend...' : 
                'Spara'
              } 
              onPress={handleSave}
              loading={isSaving || isAnalyzing}
              disabled={!gratitudeText.trim() || isSaving || isAnalyzing}
            />
          </View>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.historyButton}
              onPress={onShowHistory}
              activeOpacity={0.7}
            >
              <Text style={styles.footerText}>
                📚 {gratitudesCount > 0 ? `${gratitudesCount} tacksamheter` : 'Tidigare tacksamheter'}
              </Text>
              <Text style={styles.historyLink}>Visa alla →</Text>
            </TouchableOpacity>
            <Text style={styles.footerSubtext}>🔔 Påminnelser: Påslagna</Text>
            <Text style={[styles.backendInfo, { color: getBackendStatusColor() }]}>
              {getBackendStatusText()}
            </Text>
            <TouchableOpacity onPress={handleDeveloperTap} activeOpacity={0.7}>
              <Text style={styles.developerCredit}>
                🐻 Utvecklad av Little Bear {developerTaps > 0 && `(${developerTaps}/5)`}
              </Text>
            </TouchableOpacity>
            
            {showDeveloperMode && onShowDeveloperTest && (
              <SwedishButton
                title="🧪 Run Tests"
                onPress={() => {
                  try {
                    console.log('🧪 DEVELOPER: Navigating to test suite');
                    onShowDeveloperTest();
                  } catch (error) {
                    console.error('Navigation to developer test failed:', error);
                    Alert.alert('Navigation Error', 'Could not open test suite');
                  }
                }}
                variant="text"
                size="small"
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* 🤖 AI POSITIVITY FILTER MODAL */}
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

const styles = StyleSheet.create({
  littleBearContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  littleBearEmoji: {
    fontSize: 64,
    marginBottom: 12,
    textAlign: 'center',
  },
  littleBearText: {
    fontSize: 18,
    color: '#2F5F8F',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  littleBearSubtext: {
    fontSize: 12,
    color: '#7FB069',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  container: {
    flex: 1,
    backgroundColor: '#FF0000', // BRIGHT RED - IMPOSSIBLE TO MISS!
  },
  
  keyboardAvoid: {
    flex: 1,
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
    position: 'relative',
  },
  
  settingsButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: SwedishForestTheme.spacing.sm,
    zIndex: 1,
  },
  
  settingsIcon: {
    fontSize: 24,
    color: SwedishForestTheme.colors.text.secondary,
  },
  
  appTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.hero,
    fontWeight: '700',
    color: SwedishForestTheme.colors.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  date: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  counter: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.primary,
    fontWeight: '500',
  },
  
  inputCard: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    marginBottom: SwedishForestTheme.spacing.xl,
    ...SwedishForestTheme.shadows.card,
  },
  
  prompt: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '500',
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.md,
    textAlign: 'center',
  },
  
  textInput: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: SwedishForestTheme.spacing.lg,
    padding: SwedishForestTheme.spacing.md,
    borderWidth: 2,
    borderColor: SwedishForestTheme.colors.text.disabled,
    borderRadius: SwedishForestTheme.borderRadius.medium,
    lineHeight: SwedishForestTheme.typography.lineHeight.relaxed * SwedishForestTheme.typography.fontSize.body,
    backgroundColor: SwedishForestTheme.colors.background,
  },

  // 🤖 AI INDICATOR STYLES
  aiIndicator: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  
  aiIndicatorText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
  },
  
  footer: {
    alignItems: 'center',
  },
  
  historyButton: {
    alignItems: 'center',
    padding: SwedishForestTheme.spacing.sm,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  footerText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.xs,
  },
  
  historyLink: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.primary,
    fontWeight: '500',
  },
  
  footerSubtext: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  backendInfo: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  developerCredit: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});