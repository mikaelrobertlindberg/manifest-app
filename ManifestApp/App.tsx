import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MinimalTodayScreen } from './src/screens/TodayScreen/MinimalTodayScreen';
import { FigmaHistoryScreen } from './src/screens/HistoryScreen/FigmaHistoryScreen';
import { ProductionSettingsScreen } from './src/screens/SettingsScreen/ProductionSettingsScreen';
import { DeveloperTestScreen } from './src/screens/DeveloperTestScreen/DeveloperTestScreen';
import { NotificationService } from './src/services/NotificationService';
import { LocalStorageService } from './src/services/LocalStorageService';
import { SoundService } from './src/services/SoundService';
import { useFonts, 
  Nunito_400Regular, 
  Nunito_500Medium,
  Nunito_600SemiBold, 
  Nunito_700Bold 
} from '@expo-google-fonts/nunito';
// 🌍 Internationalization
import './src/locales';
import { loadSavedLanguage } from './src/locales';

type Screen = 'today' | 'history' | 'settings' | 'devtest';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('today');
  const [appVersion] = useState('SELF-TESTER-v1.2'); // Force reload indicator
  const [developerMode, setDeveloperMode] = useState(false);

  // 🎨 NUNITO FONTS LOADING - Mysig Typography
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  // MOBILE-SAFE: Initiera app med förbättrad error handling
  useEffect(() => {
    if (fontsLoaded) {
      initializeApp();
    }
  }, [fontsLoaded]);

  const initializeApp = async () => {
    try {
      console.log(`🌿 Little Bear's Manifest App startar... (${appVersion})`);
      console.log('🔧 SELF-TESTER: Inbyggd testsuite tillgänglig');
      
      // 🌍 Load saved language först
      await loadSavedLanguage();
      console.log('🌍 Språkinställningar laddade');
      
      // Test backend connection
      const backendStatus = await LocalStorageService.getBackendStatus();
      console.log('💾 Backend status:', backendStatus);
      
      if (!backendStatus.working) {
        console.log('⚠️ Backend varning:', backendStatus.error);
      } else {
        console.log('✅ Backend fungerar');
      }
      
      // Setup notifikationer
      try {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          await NotificationService.updateNotifications(NotificationService.defaultSettings);
          console.log('✅ Notifikationer aktiverade');
        } else {
          console.log('⚠️ Notifikationsbehörigheter nekade');
        }
      } catch (notificationError) {
        console.error('⚠️ Notifikationsfel:', notificationError);
      }

      // Setup ljudsystem
      try {
        await SoundService.initialize();
        console.log('🎵 Ljudsystem aktiverat');
      } catch (soundError) {
        console.error('🔇 Ljudsystemfel:', soundError);
        console.log('🎵 Fortsätter utan ljud...');
      }

      // Setup PWA offline support (endast web)
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('🔧 Service Worker registrerad:', registration.scope);
          
          // Lyssna på uppdateringar
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Service Worker uppdatering hittad');
          });
          
        } catch (swError) {
          console.error('❌ Service Worker registrering misslyckades:', swError);
        }
      }
      
      console.log(`🚀 Little Bear's Manifest App ${appVersion} redo!`);
      
    } catch (error) {
      console.error('❌ Kritiskt fel vid app-initialisering:', error);
      console.log('🔄 Startar i begränsat läge...');
    }
  };

  const showHistory = () => {
    console.log('🧭 NAVIGATION: Switching to History screen');
    setCurrentScreen('history');
  };
  
  const showToday = () => {
    console.log('🧭 NAVIGATION: Switching to Today screen');
    setCurrentScreen('today');
  };
  
  const showSettings = () => {
    console.log('🧭 NAVIGATION: Switching to Settings screen');
    setCurrentScreen('settings');
  };

  // SECRET: Developer test screen access
  const showDeveloperTest = () => {
    console.log('🧪 DEVELOPER: Switching to Test Suite');
    setCurrentScreen('devtest');
  };

  // Enable developer mode by tapping Little Bear credit multiple times
  const handleDeveloperModeToggle = () => {
    setDeveloperMode(prev => {
      const newMode = !prev;
      console.log(`🧪 Developer mode ${newMode ? 'ENABLED' : 'DISABLED'}`);
      return newMode;
    });
  };

  // 🎨 Wait for Nunito fonts to load before rendering app
  if (!fontsLoaded) {
    console.log('🎨 Loading Nunito fonts...');
    return null; // Could add a loading screen here
  }

  return (
    <>
      {currentScreen === 'today' && (
        <MinimalTodayScreen 
          onShowHistory={showHistory}
          onShowSettings={showSettings}
          onShowDeveloperTest={developerMode ? showDeveloperTest : undefined}
          onDeveloperModeToggle={handleDeveloperModeToggle}
        />
      )}
      {currentScreen === 'history' && (
        <FigmaHistoryScreen onBack={showToday} />
      )}
      {currentScreen === 'settings' && (
        <ProductionSettingsScreen 
          onBack={showToday}
        />
      )}
      {currentScreen === 'devtest' && (
        <DeveloperTestScreen onBack={showToday} />
      )}
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
    </>
  );
}