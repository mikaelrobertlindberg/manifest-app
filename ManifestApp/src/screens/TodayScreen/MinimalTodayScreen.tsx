/**
 * ✨ MINIMAL TODAY SCREEN
 * 
 * Clean, focused interface - bara prompt och input, inget "klotter"
 * Allt annat flyttat till Settings för Mike's vision
 */

import React, { useState, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Figma Design System
import { 
  FigmaButton, 
  FigmaCard, 
  FigmaInput, 
  FigmaHeading1,
  FigmaBody,
  DesignTokens,
  Layout
} from '../../design-system/components';

// Services
import { LocalStorageService } from '../../services/LocalStorageService';
import { PositivityFilterService, NegativityAnalysis, AIGuidance } from '../../services/PositivityFilterService';
import { AIGuidanceModal } from '../../components/AIGuidanceModal';
import { AISettingsService, AISettings } from '../../services/AISettingsService';
import { SoundService } from '../../services/SoundService';

interface MinimalTodayScreenProps {
  onShowHistory?: () => void;
  onShowSettings?: () => void;
  onShowDeveloperTest?: () => void;
  onDeveloperModeToggle?: () => void;
}

export const MinimalTodayScreen: React.FC<MinimalTodayScreenProps> = ({ 
  onShowSettings,
}) => {
  
  // === STATE ===
  const [gratitudeText, setGratitudeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [checkmarkAnim] = useState(new Animated.Value(0));
  const [checkmarkOpacity] = useState(new Animated.Value(0));
  const [checkmarkY] = useState(new Animated.Value(0));

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

  useEffect(() => {
    // Längre, mjukare fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200, // Ännu längre fade som Mike ville
      useNativeDriver: true,
    }).start();
  }, []);

  const initializeScreen = async () => {
    try {
      const loadedAISettings = await AISettingsService.loadSettings();
      setAiSettings(loadedAISettings);
      console.log('✨ MINIMAL: AI settings loaded');
    } catch (error) {
      console.error('❌ MINIMAL: Error loading settings:', error);
    }
  };

  // === UTILITY FUNCTIONS ===
  const getDailyPrompt = () => {
    const prompts = [
      'Vad är du tacksam för idag?',
      'Vilket litet ögonblick gjorde dig glad?',
      'Vad fick dig att le idag?', 
      'Vilket vackert ögonblick vill du komma ihåg?',
      'Vad värmde ditt hjärta?',
      'Vilket ljust ögonblick stack ut?',
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
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleKeepOriginal = () => {
    handleAIGuidanceClose();
    setTimeout(() => {
      performSave();
    }, 100);
  };

  const handleTryAgain = () => {
    handleAIGuidanceClose();
  };

  // === CHECKMARK ANIMATION ===
  const showCheckmarkAnimation = () => {
    // Reset animation values
    checkmarkAnim.setValue(0);
    checkmarkOpacity.setValue(0);
    checkmarkY.setValue(0);
    
    // Sequence of animations: fade in -> scale up -> move up and fade out
    Animated.sequence([
      // Fade in och scale up
      Animated.parallel([
        Animated.timing(checkmarkOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(checkmarkAnim, {
          toValue: 1,
          tension: 100,
          friction: 6,
          useNativeDriver: true,
        })
      ]),
      
      // Kort paus
      Animated.delay(800),
      
      // Flyg iväg upp som ett moln
      Animated.parallel([
        Animated.timing(checkmarkY, {
          toValue: -150,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(checkmarkOpacity, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        })
      ])
    ]).start(() => {
      // Rensa texten efter animationen är klar
      setGratitudeText('');
    });
  };

  // === AI ANALYSIS ===
  const analyzeTextForNegativity = async (text: string) => {
    console.log('✨ MINIMAL: Starting AI analysis for text length:', text.length);
    
    if (!aiSettings.aiFilterEnabled || text.length < 5) {
      console.log('✨ MINIMAL: AI disabled or text too short, proceeding with save');
      performSave();
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const result = await PositivityFilterService.analyzeText(text, aiSettings.cloudAiEnabled);
      console.log('✨ MINIMAL: AI analysis result:', result);
      
      if (result.analysis.isNegative && result.analysis.confidence > 50) {
        console.log('✨ MINIMAL: Negative text detected, showing guidance modal');
        setCurrentAnalysis(result.analysis);
        setCurrentGuidance(result.guidance);
        setShowAIGuidance(true);
        setIsAnalyzing(false);
      } else {
        console.log('✨ MINIMAL: Text is positive, proceeding with save');
        setIsAnalyzing(false);
        performSave();
      }
      
    } catch (error) {
      console.error('❌ MINIMAL: AI analysis error, proceeding with save anyway:', error);
      setIsAnalyzing(false);
      performSave();
    }
  };

  // === SAVE FUNCTIONALITY ===
  const handleSave = async () => {
    if (!gratitudeText.trim()) {
      Alert.alert('Skriv något', 'Dela med dig av vad du är tacksam för först 🌿');
      return;
    }

    console.log('✨ MINIMAL: Starting save process with AI analysis');
    await analyzeTextForNegativity(gratitudeText);
  };

  const performSave = async () => {
    setIsSaving(true);
    
    try {
      console.log('✨ MINIMAL: Saving gratitude to backend');
      
      const savedEntry = await LocalStorageService.saveGratitude(gratitudeText);
      console.log('✅ MINIMAL: Gratitude saved successfully:', savedEntry.id);
      
      // Spela success harmony (harmoniskt ljud för saved entries)
      await SoundService.playSuccessHarmony();
      
      // Visa grön bock som fadar iväg som ett moln
      showCheckmarkAnimation();
      
    } catch (error) {
      console.error('❌ MINIMAL: Save error:', error);
      
      Alert.alert(
        'Något gick fel', 
        'Kunde inte spara just nu. Prova igen?',
        [
          { text: 'OK', style: 'default' },
          { text: 'Prova igen', onPress: () => performSave() }
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // === RENDER ===
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
          
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            
            {/* === MINIMAL HEADER === */}
            <View style={styles.header}>
              {/* Clean header utan björn */}
            </View>

            {/* === MAIN PROMPT CARD === */}
            <FigmaCard variant="elevated" style={styles.promptCard}>
              <FigmaBody color={DesignTokens.colors.gray[700]} align="center" style={styles.promptText}>
                {getDailyPrompt()} 🌿
              </FigmaBody>
              
              <FigmaInput
                value={gratitudeText}
                onChangeText={setGratitudeText}
                placeholder="Börja skriva här..."
                multiline
                style={styles.gratitudeInput}
                disabled={isSaving || isAnalyzing}
              />
              
              {/* AI Analysis Indicator */}
              {isAnalyzing && aiSettings.aiFilterEnabled && (
                <View style={styles.aiIndicator}>
                  <FigmaBody color={DesignTokens.colors.primary[600]} style={styles.aiText}>
                    🤖 Analyserar...
                  </FigmaBody>
                </View>
              )}
              
              <FigmaButton 
                title={
                  isAnalyzing ? 'Analyserar...' : 
                  isSaving ? 'Sparar...' : 
                  'Spara 🌿'
                }
                onPress={handleSave}
                loading={isSaving || isAnalyzing}
                disabled={!gratitudeText.trim() || isSaving || isAnalyzing}
                variant="primary"
                fullWidth
                style={styles.saveButton}
              />
            </FigmaCard>

            {/* === CLEAN MINIMAL FOOTER === */}
            <View style={styles.footer}>
              {/* Ingen navigation här längre - ren design */}
            </View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* AI Guidance Modal med smooth transitions */}
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
      
      {/* Animerad grön bock som flyger iväg som moln */}
      <Animated.View
        style={[
          styles.checkmarkContainer,
          {
            opacity: checkmarkOpacity,
            transform: [
              {
                scale: checkmarkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                })
              },
              {
                translateY: checkmarkY
              }
            ]
          }
        ]}
        pointerEvents="none"
      >
        <View style={styles.checkmarkCircle}>
          <FigmaBody style={styles.checkmarkText}>✅</FigmaBody>
        </View>
      </Animated.View>

      {/* Floating Settings Button - höger hörn */}
      <TouchableOpacity
        style={styles.floatingSettingsButton}
        onPress={onShowSettings}
        activeOpacity={0.7}
      >
        <FigmaBody style={styles.settingsIcon}>⚙️</FigmaBody>
      </TouchableOpacity>
      
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
  
  keyboardAvoid: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Layout.screenPadding,
  },
  
  content: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 400,
  },

  // === HEADER ===
  header: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },

  // === MAIN PROMPT CARD ===
  promptCard: {
    marginBottom: DesignTokens.spacing.xl,
    padding: DesignTokens.spacing.xl,
  },
  
  promptText: {
    marginBottom: DesignTokens.spacing.lg,
    fontSize: 18,
    lineHeight: 28,
  },
  
  gratitudeInput: {
    marginBottom: DesignTokens.spacing.lg,
    minHeight: 120,
  },
  
  aiIndicator: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.md,
  },
  
  aiText: {
    fontSize: 14,
  },
  
  saveButton: {
    height: 56,
  },

  // === FOOTER ===
  footer: {
    alignItems: 'center',
    gap: DesignTokens.spacing.md,
    paddingBottom: DesignTokens.spacing.lg,
  },
  
  floatingSettingsButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  
  settingsIcon: {
    fontSize: 20,
    textAlign: 'center',
  },
  
  // === CHECKMARK ANIMATION ===
  checkmarkContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -40,
    marginTop: -40,
    zIndex: 1000,
  },
  
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  
  checkmarkText: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 32,
    width: '100%',
    height: 32,
    textAlignVertical: 'center',
  },
});

export default MinimalTodayScreen;