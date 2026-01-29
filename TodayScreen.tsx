import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView 
} from 'react-native';
import { SwedishButton } from './SwedishButton';
import { SwedishForestTheme } from './SwedishForestTheme';

export const TodayScreen: React.FC = () => {
  const [gratitudeText, setGratitudeText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    if (!gratitudeText.trim()) {
      Alert.alert('Tomt fält', 'Skriv något du är tacksam för först.');
      return;
    }

    setIsSaving(true);
    
    try {
      // Här kommer vi senare implementera Firebase-sparande
      console.log('Sparar tacksamhet:', gratitudeText);
      
      // Simulera sparande
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Tack för idag! 🌿', 
        'Din tacksamhet har sparats.',
        [{ text: 'OK', onPress: () => setGratitudeText('') }]
      );
      
    } catch (error) {
      Alert.alert('Fel', 'Något gick fel när tacksamheten skulle sparas.');
    } finally {
      setIsSaving(false);
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
            <Text style={styles.appTitle}>🌿 Manifest</Text>
            <Text style={styles.date}>Idag, {getSwedishDate()}</Text>
          </View>
          
          <View style={styles.inputCard}>
            <Text style={styles.prompt}>{getDailyPrompt()}</Text>
            
            <TextInput
              style={styles.textInput}
              value={gratitudeText}
              onChangeText={setGratitudeText}
              placeholder="Börja skriva här..."
              placeholderTextColor={SwedishForestTheme.colors.text.disabled}
              multiline
              textAlignVertical="top"
              selectionColor={SwedishForestTheme.colors.primary}
              editable={!isSaving}
            />
            
            <SwedishButton 
              title={isSaving ? 'Sparar...' : 'Spara'} 
              onPress={handleSave}
              loading={isSaving}
              disabled={!gratitudeText.trim() || isSaving}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>📚 Tidigare tacksamheter</Text>
            <Text style={styles.footerSubtext}>🔔 Påminnelser: Påslagna</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SwedishForestTheme.colors.background,
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
    padding: 0,
    lineHeight: SwedishForestTheme.typography.lineHeight.relaxed * SwedishForestTheme.typography.fontSize.body,
  },
  
  footer: {
    alignItems: 'center',
  },
  
  footerText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  footerSubtext: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
  },
});