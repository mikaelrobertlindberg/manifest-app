/**
 * 🤖 AI GUIDANCE MODAL - CLEAN VERSION
 * Little Bear's gentle coaching med smooth fade transitions
 * CLEAN & MINIMAL - inget "klotter", bara nödvändigt
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { AIGuidance, NegativityAnalysis } from '../services/PositivityFilterService';
import { FadeModal } from './FadeModal';
import { 
  FigmaButton,
  FigmaText,
  FigmaHeading2,
  FigmaBody,
  FigmaCaption,
  DesignTokens 
} from '../design-system/components';

interface AIGuidanceModalProps {
  visible: boolean;
  onClose: () => void;
  guidance: AIGuidance | null;
  analysis: NegativityAnalysis | null;
  originalText: string;
  onAcceptSuggestion: (suggestion: string) => void;
  onKeepOriginal: () => void;
  onTryAgain: () => void;
}

export const AIGuidanceModal: React.FC<AIGuidanceModalProps> = ({
  visible,
  onClose,
  guidance,
  analysis,
  originalText,
  onAcceptSuggestion,
  onKeepOriginal,
  onTryAgain,
}) => {

  if (!guidance || !analysis) return null;

  return (
    <FadeModal
      visible={visible}
      onClose={onClose}
      animationDuration={600}  // Långsam fade som Mike ville
      closeOnBackdrop={false}
      backdropOpacity={0.85}   // Mer solid backdrop för bättre kontrast
    >
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* === CLEAN HEADER === */}
        <View style={styles.header}>
          <FigmaText style={styles.emoji}>🐻</FigmaText>
          <FigmaHeading2 color={DesignTokens.colors.primary[500]} align="center">
            Little Bear
          </FigmaHeading2>
        </View>

        {/* === MAIN MESSAGE - CLEAN === */}
        <View style={styles.messageSection}>
          <FigmaBody color={DesignTokens.colors.gray[800]} align="center" style={styles.messageText}>
            {guidance.message}
          </FigmaBody>
        </View>

        {/* === SUGGESTIONS - MINIMAL === */}
        {guidance.suggestions && guidance.suggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            {guidance.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => onAcceptSuggestion(suggestion)}
                activeOpacity={0.7}
              >
                <FigmaBody color={DesignTokens.colors.primary[600]} align="center" style={styles.suggestionText}>
                  "{suggestion}"
                </FigmaBody>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* === ACTIONS - CLEAN === */}
        <View style={styles.actions}>
          <FigmaButton
            title="Använd mitt"
            variant="ghost"
            onPress={onKeepOriginal}
            style={styles.actionButton}
          />
          
          <FigmaButton
            title="Prova igen"
            variant="primary"
            onPress={onTryAgain}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </FadeModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  
  contentContainer: {
    paddingVertical: DesignTokens.spacing.lg,
  },
  
  // === CLEAN HEADER ===
  header: {
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.xl,
  },
  
  emoji: {
    fontSize: 48,
    marginBottom: DesignTokens.spacing.sm,
  },
  
  // === MESSAGE ===
  messageSection: {
    marginBottom: DesignTokens.spacing.xl,
    paddingHorizontal: DesignTokens.spacing.lg,
  },
  
  messageText: {
    fontSize: 16,
    lineHeight: 26,
  },
  
  // === SUGGESTIONS ===
  suggestionsSection: {
    marginBottom: DesignTokens.spacing.xl,
    gap: DesignTokens.spacing.md,
  },
  
  suggestionButton: {
    padding: DesignTokens.spacing.lg,
    backgroundColor: DesignTokens.colors.primary[50],
    borderRadius: DesignTokens.radius.lg, // Mjukare hörn
    borderWidth: DesignTokens.borderWidth.thin,
    borderColor: DesignTokens.colors.primary[200],
  },
  
  suggestionText: {
    fontSize: 15,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  
  // === ACTIONS ===
  actions: {
    gap: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  
  actionButton: {
    width: '100%',
    height: 56,
    borderRadius: DesignTokens.radius.lg, // Mjukare hörn
  },
});

export default AIGuidanceModal;