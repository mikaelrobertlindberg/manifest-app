import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Language resources
import sv from './sv.json';
import de from './de.json';
import fi from './fi.json';
import no from './no.json';
import da from './da.json';

// Storage key for language persistence
const LANGUAGE_KEY = '@tacksamhet_language';

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    // Default language (Swedish)
    lng: 'sv',
    fallbackLng: 'sv',
    
    // Language resources
    resources: {
      sv: { translation: sv },
      de: { translation: de },
      fi: { translation: fi },
      no: { translation: no },
      da: { translation: da },
    },
    
    // i18next configuration
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    // Debug only in development
    debug: __DEV__,
    
    // Namespace
    defaultNS: 'translation',
    
    // Key separator
    keySeparator: '.',
    
    // Misc
    compatibilityJSON: 'v3',
  });

/**
 * Save selected language to AsyncStorage
 */
export const saveLanguage = async (languageCode: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    await i18n.changeLanguage(languageCode);
    console.log(`🌍 Language changed to: ${languageCode}`);
  } catch (error) {
    console.error('❌ Error saving language:', error);
  }
};

/**
 * Load saved language from AsyncStorage
 */
export const loadSavedLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && ['sv', 'de', 'fi', 'no', 'da'].includes(savedLanguage)) {
      await i18n.changeLanguage(savedLanguage);
      console.log(`🌍 Loaded saved language: ${savedLanguage}`);
      return savedLanguage;
    }
  } catch (error) {
    console.error('❌ Error loading saved language:', error);
  }
  
  // Fallback to Swedish
  console.log('🌍 Using default language: sv');
  return 'sv';
};

/**
 * Get available languages with labels
 */
export const getAvailableLanguages = () => [
  { code: 'sv', label: '🇸🇪 Svenska', nativeLabel: 'Svenska' },
  { code: 'de', label: '🇩🇪 Deutsch', nativeLabel: 'Deutsch' },
  { code: 'fi', label: '🇫🇮 Suomi', nativeLabel: 'Suomi' },
  { code: 'no', label: '🇳🇴 Norsk', nativeLabel: 'Norsk' },
  { code: 'da', label: '🇩🇰 Dansk', nativeLabel: 'Dansk' },
];

/**
 * Get current language code
 */
export const getCurrentLanguage = (): string => {
  return i18n.language || 'sv';
};

export default i18n;