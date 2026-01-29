/**
 * 📐 FIGMA HISTORY SCREEN
 * 
 * Pixel-perfect history view using Figma Design System
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar
} from 'react-native';

// Figma Design System Components
import { 
  FigmaButton, 
  FigmaCard, 
  FigmaText,
  FigmaHeading1,
  FigmaHeading2,
  FigmaBody,
  FigmaCaption,
  DesignTokens,
  Layout
} from '../../design-system/components';

// Services
import { LocalStorageService, GratitudeEntry } from '../../services/LocalStorageService';

interface FigmaHistoryScreenProps {
  onBack: () => void;
}

export const FigmaHistoryScreen: React.FC<FigmaHistoryScreenProps> = ({ onBack }) => {
  
  // === STATE ===
  const [gratitudes, setGratitudes] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // === EFFECTS ===
  useEffect(() => {
    loadGratitudes();
  }, []);

  // === DATA LOADING ===
  const loadGratitudes = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);
      
      console.log('📐 FIGMA HISTORY: Loading gratitudes...');
      
      // Backend status check
      const status = await LocalStorageService.getBackendStatus();
      console.log('📐 FIGMA HISTORY: Backend status:', status);
      
      if (!status.working) {
        throw new Error(status.error || 'Backend inte tillgänglig');
      }
      
      // Load all gratitudes
      const entries = await LocalStorageService.getAllGratitudes();
      console.log(`📐 FIGMA HISTORY: Loaded ${entries.length} gratitudes`);
      
      // Sort by date (newest first)
      const sortedEntries = entries.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setGratitudes(sortedEntries);
      
    } catch (loadError) {
      console.error('❌ FIGMA HISTORY: Load error:', loadError);
      setError(loadError instanceof Error ? loadError.message : 'Okänt fel');
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGratitudes(false);
    setRefreshing(false);
  };

  const handleRetry = () => {
    loadGratitudes(true);
  };

  // === UTILITY FUNCTIONS ===
  const formatDate = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isToday = date.toDateString() === today.toDateString();
      const isYesterday = date.toDateString() === yesterday.toDateString();
      
      if (isToday) return 'Idag';
      if (isYesterday) return 'Igår';
      
      // Swedish months
      const months = [
        'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
        'jul', 'aug', 'sep', 'okt', 'nov', 'dec'
      ];
      
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const currentYear = today.getFullYear();
      
      return year === currentYear ? `${day} ${month}` : `${day} ${month} ${year}`;
      
    } catch {
      return 'Okänt datum';
    }
  };

  const formatTime = (timestamp: Date | string) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return date.toLocaleTimeString('sv-SE', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return '';
    }
  };

  // === RENDER HELPERS ===
  const renderGratitudeItem = (gratitude: GratitudeEntry, index: number) => (
    <FigmaCard key={gratitude.id} variant="outlined" style={styles.gratitudeCard}>
      {/* Header with date/time */}
      <View style={styles.gratitudeHeader}>
        <FigmaCaption color={DesignTokens.colors.primary[500]}>
          {formatDate(gratitude.createdAt)}
        </FigmaCaption>
        <FigmaCaption color={DesignTokens.colors.gray[500]}>
          {formatTime(gratitude.createdAt)}
        </FigmaCaption>
      </View>
      
      {/* Content */}
      <FigmaBody color={DesignTokens.colors.gray[800]} style={styles.gratitudeText}>
        {gratitude.text}
      </FigmaBody>
      
      {/* Footer */}
      <View style={styles.gratitudeFooter}>
        <FigmaCaption color={DesignTokens.colors.gray[500]}>
          📐 Entry #{gratitudes.length - index}
        </FigmaCaption>
      </View>
    </FigmaCard>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContent}>
          <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
            📐 Loading design components...
          </FigmaBody>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <FigmaCard variant="outlined" style={styles.errorCard}>
            <FigmaHeading2 color={DesignTokens.colors.error} align="center" style={styles.errorTitle}>
              Backend Error
            </FigmaHeading2>
            <FigmaBody color={DesignTokens.colors.gray[600]} align="center" style={styles.errorMessage}>
              {error}
            </FigmaBody>
            <FigmaButton
              title="Retry Connection"
              onPress={handleRetry}
              variant="primary"
              style={styles.retryButton}
            />
          </FigmaCard>
        </View>
      );
    }

    if (gratitudes.length === 0) {
      return (
        <View style={styles.centerContent}>
          <FigmaCard variant="default" style={styles.emptyCard}>
            <FigmaText variant="headline2" align="center" style={styles.emptyEmoji}>
              🐻
            </FigmaText>
            <FigmaHeading2 color={DesignTokens.colors.gray[700]} align="center" style={styles.emptyTitle}>
              Inga tacksamheter än
            </FigmaHeading2>
            <FigmaBody color={DesignTokens.colors.gray[600]} align="center" style={styles.emptyMessage}>
              Börja din tacksamhetsresa genom att skriva din första reflektion
            </FigmaBody>
            <FigmaButton
              title="Tillbaka till start"
              onPress={onBack}
              variant="primary"
              style={styles.backToStartButton}
            />
          </FigmaCard>
        </View>
      );
    }

    return (
      <View style={styles.gratitudesContainer}>
        {gratitudes.map((gratitude, index) => renderGratitudeItem(gratitude, index))}
      </View>
    );
  };

  // === MAIN RENDER ===
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={DesignTokens.colors.background} />
      
      {/* === FIGMA HEADER === */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <FigmaText variant="headline2" color={DesignTokens.colors.primary[500]}>
            ←
          </FigmaText>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <FigmaHeading1 color={DesignTokens.colors.primary[500]} align="center">
            📐 History View
          </FigmaHeading1>
          <FigmaBody color={DesignTokens.colors.gray[600]} align="center">
            Design System • Gratitude Archive
          </FigmaBody>
        </View>
      </View>

      {/* === FIGMA STATS CARD === */}
      {!loading && !error && gratitudes.length > 0 && (
        <FigmaCard variant="elevated" style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <FigmaText variant="headline2" color={DesignTokens.colors.primary[500]} align="center">
                {gratitudes.length}
              </FigmaText>
              <FigmaCaption color={DesignTokens.colors.gray[600]} align="center">
                Total Entries
              </FigmaCaption>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <FigmaText variant="headline2" color={DesignTokens.colors.secondary[500]} align="center">
                📐
              </FigmaText>
              <FigmaCaption color={DesignTokens.colors.gray[600]} align="center">
                Pixel Perfect
              </FigmaCaption>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <FigmaText variant="headline2" color={DesignTokens.colors.success} align="center">
                ✅
              </FigmaText>
              <FigmaCaption color={DesignTokens.colors.gray[600]} align="center">
                Design System
              </FigmaCaption>
            </View>
          </View>
        </FigmaCard>
      )}

      {/* === FIGMA CONTENT === */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={DesignTokens.colors.primary[500]}
            colors={[DesignTokens.colors.primary[500]]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// === FIGMA DESIGN SYSTEM STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DesignTokens.colors.background,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.screenPadding,
    paddingTop: Layout.screenPadding + 10,
    borderBottomWidth: DesignTokens.borderWidth.hairline,
    borderBottomColor: DesignTokens.colors.gray[200],
  },
  
  backButton: {
    padding: DesignTokens.spacing.sm,
    borderRadius: DesignTokens.radius.full,
    backgroundColor: DesignTokens.colors.gray[100],
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  headerContent: {
    flex: 1,
    marginLeft: DesignTokens.spacing.md,
  },

  // === STATS CARD ===
  statsCard: {
    margin: Layout.screenPadding,
    marginBottom: DesignTokens.spacing.sm,
  },
  
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statDivider: {
    width: DesignTokens.borderWidth.thin,
    height: 40,
    backgroundColor: DesignTokens.colors.gray[200],
  },

  // === CONTENT ===
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: Layout.screenPadding,
    paddingTop: DesignTokens.spacing.sm,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: DesignTokens.spacing.xxxl,
  },

  // === GRATITUDE ITEMS ===
  gratitudesContainer: {
    gap: DesignTokens.spacing.md,
  },
  
  gratitudeCard: {
    paddingVertical: DesignTokens.spacing.md,
    paddingHorizontal: DesignTokens.spacing.md,
  },
  
  gratitudeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DesignTokens.spacing.sm,
  },
  
  gratitudeText: {
    marginBottom: DesignTokens.spacing.sm,
    lineHeight: DesignTokens.typography.body1.lineHeight,
  },
  
  gratitudeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // === ERROR STATE ===
  errorCard: {
    alignItems: 'center',
    padding: DesignTokens.spacing.xl,
    maxWidth: 300,
  },
  
  errorTitle: {
    marginBottom: DesignTokens.spacing.sm,
  },
  
  errorMessage: {
    marginBottom: DesignTokens.spacing.lg,
  },
  
  retryButton: {
    minWidth: 120,
  },

  // === EMPTY STATE ===
  emptyCard: {
    alignItems: 'center',
    padding: DesignTokens.spacing.xl,
    maxWidth: 300,
  },
  
  emptyEmoji: {
    fontSize: 48,
    marginBottom: DesignTokens.spacing.md,
  },
  
  emptyTitle: {
    marginBottom: DesignTokens.spacing.sm,
  },
  
  emptyMessage: {
    marginBottom: DesignTokens.spacing.lg,
  },
  
  backToStartButton: {
    minWidth: 160,
  },
});

export default FigmaHistoryScreen;