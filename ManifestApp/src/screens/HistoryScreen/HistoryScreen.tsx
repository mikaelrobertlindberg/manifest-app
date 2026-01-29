import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { SwedishButton } from '../../components/Button/SwedishButton';
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';
import { LocalStorageService, GratitudeEntry } from '../../services/LocalStorageService';

interface HistoryScreenProps {
  onBack: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack }) => {
  const [gratitudes, setGratitudes] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    loadGratitudes();
  }, []);

  const loadGratitudes = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      
      console.log('📚 HISTORY: Loading gratitudes...');
      
      // Get backend status först
      const status = await LocalStorageService.getBackendStatus();
      console.log('📚 HISTORY: Backend status:', status);
      setDebugInfo(status.details);
      
      if (!status.working) {
        throw new Error(status.error || 'Backend inte tillgänglig');
      }
      
      // Ladda alla tacksamheter
      const entries = await LocalStorageService.getAllGratitudes();
      console.log(`📚 HISTORY: Loaded ${entries.length} gratitudes:`, entries);
      
      setGratitudes(entries);
      
      if (entries.length === 0) {
        console.log('📚 HISTORY: No gratitudes found - user hasn\'t saved any yet');
      }
      
    } catch (error) {
      console.error('❌ HISTORY ERROR:', error);
      const errorMessage = error instanceof Error ? error.message : 'Okänt fel vid laddning';
      setError(errorMessage);
      setGratitudes([]); // Reset to empty on error
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGratitudes(false);
  };

  const formatSwedishDate = (date: Date) => {
    try {
      const weekdays = [
        'söndag', 'måndag', 'tisdag', 'onsdag', 
        'torsdag', 'fredag', 'lördag'
      ];
      const months = [
        'januari', 'februari', 'mars', 'april', 'maj', 'juni',
        'juli', 'augusti', 'september', 'oktober', 'november', 'december'
      ];
      
      const weekday = weekdays[date.getDay()];
      const day = date.getDate();
      const month = months[date.getMonth()];
      const time = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
      
      return `${weekday}, ${day} ${month} kl ${time}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return date.toString(); // Fallback
    }
  };

  const deleteGratitude = async (id: string, text: string) => {
    const preview = text.length > 50 ? text.substring(0, 50) + '...' : text;
    
    Alert.alert(
      'Ta bort tacksamhet?',
      `Vill du ta bort: "${preview}"?`,
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ta bort',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`🗑️ HISTORY: Deleting gratitude ${id}`);
              await LocalStorageService.deleteGratitude(id);
              await loadGratitudes(false); // Reload without loader
              Alert.alert('Borttaget', 'Tacksamheten har tagits bort från backend.');
            } catch (error) {
              console.error('Delete error:', error);
              Alert.alert('Fel', 'Kunde inte ta bort tacksamheten.');
            }
          }
        }
      ]
    );
  };

  const showDebugInfo = () => {
    Alert.alert(
      'Debug Info',
      debugInfo.join('\n'),
      [{ text: 'OK' }]
    );
  };

  const forceReload = async () => {
    console.log('🔄 HISTORY: Force reload triggered');
    await loadGratitudes(true);
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SwedishButton 
            title="← Tillbaka"
            onPress={onBack}
            variant="text"
            size="small"
          />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📚 Laddar tacksamheter från backend...</Text>
          <Text style={styles.debugText}>Kontrollerar lokal databas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <SwedishButton 
            title="← Tillbaka"
            onPress={onBack}
            variant="text"
            size="small"
          />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>😞 Backend-problem</Text>
          <Text style={styles.errorText}>Fel: {error}</Text>
          <SwedishButton 
            title="🔄 Försök igen"
            onPress={forceReload}
            variant="secondary"
          />
          <TouchableOpacity onPress={showDebugInfo} style={styles.debugButton}>
            <Text style={styles.debugButtonText}>🔧 Debug info</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SwedishButton 
          title="← Tillbaka"
          onPress={onBack}
          variant="text"
          size="small"
        />
        <Text style={styles.title}>Mina Tacksamheter</Text>
        <Text style={styles.subtitle}>
          📚 {gratitudes.length} {gratitudes.length === 1 ? 'tacksamhet' : 'tacksamheter'} sparade i backend
        </Text>
        {debugInfo.length > 0 && (
          <TouchableOpacity onPress={showDebugInfo} style={styles.debugInfo}>
            <Text style={styles.debugInfoText}>💾 Backend: {debugInfo[0]} (tryck för mer info)</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[SwedishForestTheme.colors.primary]}
            title="Uppdaterar..."
          />
        }
      >
        {gratitudes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🌱</Text>
            <Text style={styles.emptyTitle}>Inga tacksamheter ännu</Text>
            <Text style={styles.emptySubtitle}>
              {error ? 
                'Det verkar vara problem med backend-anslutningen.' :
                'Börja skriv din första tacksamhet för att se den här!'
              }
            </Text>
            <SwedishButton 
              title="🔄 Ladda om"
              onPress={forceReload}
              variant="secondary"
              size="small"
            />
            <TouchableOpacity onPress={showDebugInfo} style={styles.debugButton}>
              <Text style={styles.debugButtonText}>🔧 Backend-status</Text>
            </TouchableOpacity>
          </View>
        ) : (
          gratitudes.map((gratitude) => {
            return (
              <View key={gratitude.id} style={styles.gratitudeCard}>
                <View style={styles.gratitudeHeader}>
                  <Text style={styles.gratitudeDate}>
                    {formatSwedishDate(gratitude.createdAt)}
                  </Text>
                  <Text style={styles.gratitudeId}>ID: {gratitude.id.substring(0, 8)}...</Text>
                </View>
                
                <Text style={styles.gratitudeText}>{gratitude.text}</Text>
                
                <View style={styles.metaInfo}>
                  <Text style={styles.wordCount}>
                    📝 {gratitude.wordCount} ord
                  </Text>
                  {LocalStorageService.extractEmojisFromText(gratitude.text).length > 0 && (
                    <Text style={styles.emojiCount}>
                      ✨ {LocalStorageService.extractEmojisFromText(gratitude.text).length} emoji
                      {LocalStorageService.extractEmojisFromText(gratitude.text).length !== 1 ? 's' : ''}
                    </Text>
                  )}
                </View>
                
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteGratitude(gratitude.id, gratitude.text)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteButtonText}>🗑️ Ta bort</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
        
        {gratitudes.length > 0 && (
          <View style={styles.bottomInfo}>
            <Text style={styles.bottomInfoText}>
              🔄 Dra neråt för att uppdatera
            </Text>
            <TouchableOpacity onPress={showDebugInfo}>
              <Text style={styles.bottomDebugText}>
                💾 Backend status (tryck för detaljer)
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SwedishForestTheme.colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  debugText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    fontStyle: 'italic',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SwedishForestTheme.spacing.lg,
  },
  
  errorTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.h2,
    color: SwedishForestTheme.colors.error,
    marginBottom: SwedishForestTheme.spacing.md,
  },
  
  errorText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: SwedishForestTheme.spacing.lg,
  },
  
  header: {
    padding: SwedishForestTheme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: SwedishForestTheme.colors.text.disabled,
  },
  
  title: {
    fontSize: SwedishForestTheme.typography.fontSize.h1,
    fontWeight: '600',
    color: SwedishForestTheme.colors.primary,
    marginTop: SwedishForestTheme.spacing.md,
  },
  
  subtitle: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginTop: SwedishForestTheme.spacing.sm,
    textAlign: 'center',
  },
  
  debugInfo: {
    marginTop: SwedishForestTheme.spacing.sm,
    padding: SwedishForestTheme.spacing.xs,
  },
  
  debugInfoText: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.primary,
    fontStyle: 'italic',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: SwedishForestTheme.spacing.lg,
  },
  
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SwedishForestTheme.spacing.xxl,
  },
  
  emptyText: {
    fontSize: 64,
    marginBottom: SwedishForestTheme.spacing.lg,
  },
  
  emptyTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.h2,
    fontWeight: '500',
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  emptySubtitle: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: SwedishForestTheme.typography.lineHeight.relaxed * SwedishForestTheme.typography.fontSize.body,
    marginBottom: SwedishForestTheme.spacing.lg,
  },
  
  gratitudeCard: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    marginBottom: SwedishForestTheme.spacing.md,
    ...SwedishForestTheme.shadows.card,
    borderLeftWidth: 4,
    borderLeftColor: SwedishForestTheme.colors.primary,
  },
  
  gratitudeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  gratitudeDate: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    fontStyle: 'italic',
    flex: 1,
  },
  
  gratitudeId: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.text.disabled,
    fontFamily: 'monospace',
  },
  
  gratitudeText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
    lineHeight: SwedishForestTheme.typography.lineHeight.relaxed * SwedishForestTheme.typography.fontSize.body,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SwedishForestTheme.spacing.md,
  },
  
  wordCount: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.text.secondary,
    fontStyle: 'italic',
  },
  
  emojiCount: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.primary,
    fontStyle: 'italic',
  },
  
  deleteButton: {
    alignSelf: 'flex-end',
    paddingVertical: SwedishForestTheme.spacing.xs,
    paddingHorizontal: SwedishForestTheme.spacing.sm,
  },
  
  deleteButtonText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.error,
  },
  
  debugButton: {
    marginTop: SwedishForestTheme.spacing.md,
    padding: SwedishForestTheme.spacing.sm,
  },
  
  debugButtonText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.primary,
    textAlign: 'center',
  },
  
  bottomInfo: {
    alignItems: 'center',
    marginTop: SwedishForestTheme.spacing.lg,
    paddingTop: SwedishForestTheme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: SwedishForestTheme.colors.text.disabled,
  },
  
  bottomInfoText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  bottomDebugText: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.primary,
    fontStyle: 'italic',
  },
});