/**
 * 🌍 LANGUAGE SELECTOR COMPONENT
 * 
 * Elegant språkväljare för Settings screen
 * Supports: Svenska, Tyska, Finska, Norska, Danska
 */

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  FigmaBody,
  FigmaCaption,
  FigmaCard,
  DesignTokens,
} from '../design-system/components';
import { saveLanguage, getAvailableLanguages, getCurrentLanguage } from '../locales';

interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);
  
  const availableLanguages = getAvailableLanguages();

  const handleLanguageSelect = async (languageCode: string) => {
    if (languageCode === currentLanguage || isChanging) return;
    
    setIsChanging(true);
    
    try {
      console.log(`🌍 LANGUAGE: Switching to ${languageCode}`);
      
      // Save and change language
      await saveLanguage(languageCode);
      setCurrentLanguage(languageCode);
      
      // Callback to parent component
      onLanguageChange?.(languageCode);
      
      // Success feedback
      Alert.alert(
        t('settings.languageSelectionDescription'),
        `${availableLanguages.find(lang => lang.code === languageCode)?.nativeLabel} aktiverat!`,
        [{ text: 'OK' }]
      );
      
      console.log(`🌍 LANGUAGE: Successfully switched to ${languageCode}`);
      
    } catch (error) {
      console.error('❌ LANGUAGE: Error changing language:', error);
      Alert.alert(
        t('alerts.errorTitle'),
        'Kunde inte byta språk. Prova igen.',
        [{ text: t('alerts.okButton') }]
      );
    } finally {
      setIsChanging(false);
    }
  };

  const renderLanguageOption = (language: { code: string; label: string; nativeLabel: string }) => {
    const isSelected = language.code === currentLanguage;
    const isDisabled = isChanging;
    
    return (
      <TouchableOpacity
        key={language.code}
        style={[
          styles.languageOption,
          isSelected && styles.languageOptionSelected,
          isDisabled && styles.languageOptionDisabled,
        ]}
        onPress={() => handleLanguageSelect(language.code)}
        activeOpacity={0.7}
        disabled={isDisabled}
      >
        <View style={styles.languageInfo}>
          <FigmaBody 
            color={isSelected ? DesignTokens.colors.primary[600] : DesignTokens.colors.gray[800]}
            style={[styles.languageLabel, isSelected && styles.languageLabelSelected]}
          >
            {language.label}
          </FigmaBody>
          <FigmaCaption 
            color={isSelected ? DesignTokens.colors.primary[500] : DesignTokens.colors.gray[600]}
            style={styles.languageNative}
          >
            {language.nativeLabel}
          </FigmaCaption>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <FigmaBody color={DesignTokens.colors.primary[500]}>
              ✓
            </FigmaBody>
          </View>
        )}
        
        {isChanging && language.code !== currentLanguage && (
          <View style={styles.loadingIndicator}>
            <FigmaCaption color={DesignTokens.colors.gray[400]}>
              ...
            </FigmaCaption>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.languageList}
        showsVerticalScrollIndicator={false}
      >
        {availableLanguages.map(renderLanguageOption)}
      </ScrollView>
      
      {/* Info text */}
      <FigmaCaption 
        color={DesignTokens.colors.gray[500]} 
        align="center" 
        style={styles.infoText}
      >
        {isChanging ? 'Byter språk...' : 'Appen startar om vid språkbyte'}
      </FigmaCaption>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  languageList: {
    flex: 1,
  },
  
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: DesignTokens.spacing.md,
    marginBottom: DesignTokens.spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: DesignTokens.radius.md,
    borderWidth: DesignTokens.borderWidth.thin,
    borderColor: DesignTokens.colors.gray[200],
  },
  
  languageOptionSelected: {
    backgroundColor: DesignTokens.colors.primary[50],
    borderColor: DesignTokens.colors.primary[300],
    borderWidth: DesignTokens.borderWidth.default,
  },
  
  languageOptionDisabled: {
    opacity: 0.6,
  },
  
  languageInfo: {
    flex: 1,
  },
  
  languageLabel: {
    fontSize: 16,
    marginBottom: DesignTokens.spacing.xs / 2,
  },
  
  languageLabelSelected: {
    fontWeight: '600',
  },
  
  languageNative: {
    fontSize: 13,
  },
  
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: DesignTokens.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  infoText: {
    marginTop: DesignTokens.spacing.md,
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default LanguageSelector;