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
  Modal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
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
  
  // === HOOKS ===
  const { t } = useTranslation();
  
  // === STATE ===
  const [gratitudeText, setGratitudeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [heartAnim] = useState(new Animated.Value(0));
  const [heartOpacity] = useState(new Animated.Value(0));
  const [heartY] = useState(new Animated.Value(0));

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
  
  // Heart Modal State
  const [showHeartModal, setShowHeartModal] = useState(false);

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
    const prompts = t('prompts.daily', { returnObjects: true }) as string[];
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

  // === HEART ANIMATION (FULL SCREEN DEBUG VERSION) ===
  const showHeartAnimation = () => {
    console.log('❤️ DEBUG: Starting FULL SCREEN DEBUG heart animation');
    
    // Show overlay and reset animation values
    setShowHeartModal(true);
    heartAnim.setValue(0);
    heartOpacity.setValue(0);
    heartY.setValue(0);
    
    // EXTENDED DEBUG animation to see what happens
    Animated.sequence([
      // Show overlay first with long fade in to see positioning
      Animated.timing(heartOpacity, {
        toValue: 1,
        duration: 1000, // LONGER så vi kan se positioning
        useNativeDriver: true,
      }),
      
      // Scale up
      Animated.spring(heartAnim, {
        toValue: 1,
        tension: 80,
        friction: 4,
        useNativeDriver: true,
      }),
      
      // LONG PAUSE to examine positioning
      Animated.delay(2000),
      
      // SLOW upward movement to see clipping point
      Animated.timing(heartY, {
        toValue: -400,  // LONGER movement to see where it clips
        duration: 3000,  // SLOWER så vi ser var det klipper
        useNativeDriver: true,
      }),
      
      // Final fade out
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start(() => {
      console.log('❤️ DEBUG: Full screen debug animation completed');
      // Hide overlay after long debug sequence
      setTimeout(() => {
        setShowHeartModal(false);
        setGratitudeText('');
      }, 1000);
    });
  };

  // === AI ANALYSIS ===
  const analyzeTextForNegativity = async (text: string) => {
    console.log('✨ MINIMAL: Starting AI analysis for text length:', text.length);
    
    if (!aiSettings.aiFilterEnabled || text.length < 15) {
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
      Alert.alert(t('alerts.emptyTextTitle'), t('alerts.emptyTextMessage'));
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
      
      // Visa hjärta som flyger iväg med kärlek
      showHeartAnimation();
      
    } catch (error) {
      console.error('❌ MINIMAL: Save error:', error);
      
      Alert.alert(
        t('alerts.saveErrorTitle'), 
        t('alerts.saveErrorMessage'),
        [
          { text: t('alerts.okButton'), style: 'default' },
          { text: t('alerts.tryAgainButton'), onPress: () => performSave() }
        ]
      );
    } finally {
      setIsSaving(false);
    }
  };

  // === RENDER ===
  return (
    <View style={styles.fullScreenContainer}>
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
                placeholder={t('general.placeholder')}
                multiline
                style={styles.gratitudeInput}
                disabled={isSaving || isAnalyzing}
              />
              
              {/* AI Analysis Indicator */}
              {isAnalyzing && aiSettings.aiFilterEnabled && (
                <View style={styles.aiIndicator}>
                  <FigmaBody color={DesignTokens.colors.primary[600]} style={styles.aiText}>
                    {t('ai.analyzing')}
                  </FigmaBody>
                </View>
              )}
              
              <FigmaButton 
                title={
                  isAnalyzing ? t('buttons.analyzing') : 
                  isSaving ? t('buttons.saving') : 
                  t('buttons.save')
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

      {/* HEART OVERLAY - FULL SCREEN DEBUGGING VERSION */}
      {showHeartModal && (
        <View style={styles.heartFullScreenOverlay} pointerEvents="none">
          <Animated.View
            style={[
              styles.heartDebugContainer,
              {
                opacity: heartOpacity,
                transform: [
                  {
                    scale: heartAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1.2],
                    })
                  },
                  {
                    translateY: heartY
                  }
                ]
              }
            ]}
            pointerEvents="none"
          >
            <FigmaBody style={styles.heartText}>❤️</FigmaBody>
          </Animated.View>
          
          {/* DEBUGGING INFO - VISIBLE BOUNDS */}
          <View style={styles.debugBounds} pointerEvents="none">
            <FigmaBody style={styles.debugText}>DEBUG: FULL SCREEN OVERLAY</FigmaBody>
            <FigmaBody style={styles.debugText}>Heart should be visible here</FigmaBody>
          </View>
        </View>
      )}
    </View>
  );
};

// === STYLES ===
const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    overflow: 'visible', // CRITICALLY IMPORTANT - tillåter hjärta att flyga fritt
  },
  
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
  
  // === HEART ANIMATION (FULL SCREEN DEBUG VERSION) ===
  heartFullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // DEBUG: Rød toning för att se bounds
    zIndex: 999999,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 999,
  },
  
  heartDebugContainer: {
    position: 'absolute',
    bottom: 200,      // Start position
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(0, 255, 0, 0.3)', // DEBUG: Grön för hjärta-container
  },
  
  debugBounds: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  
  debugText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  
  heartText: {
    fontSize: 60,
    textAlign: 'center',
    lineHeight: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },
});

export default MinimalTodayScreen;