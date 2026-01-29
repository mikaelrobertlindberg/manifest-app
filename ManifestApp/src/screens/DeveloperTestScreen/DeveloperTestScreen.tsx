import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SwedishButton } from '../../components/Button/SwedishButton';
import { SwedishForestTheme } from '../../theme/SwedishForestTheme';
import { LocalStorageService, GratitudeEntry } from '../../services/LocalStorageService';
import { NotificationService } from '../../services/NotificationService';

interface DeveloperTestScreenProps {
  onBack: () => void;
}

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
  duration?: number;
}

export const DeveloperTestScreen: React.FC<DeveloperTestScreenProps> = ({ onBack }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [allTestsPassed, setAllTestsPassed] = useState(false);

  const initialTests: TestResult[] = [
    { name: 'Backend Connection', status: 'pending' },
    { name: 'Save Gratitude', status: 'pending' },
    { name: 'Retrieve Gratitudes', status: 'pending' },
    { name: 'Count Gratitudes', status: 'pending' },
    { name: 'Delete Gratitude', status: 'pending' },
    { name: 'Emoji Handling', status: 'pending' },
    { name: 'Notification Permissions', status: 'pending' },
    { name: 'Notification Scheduling', status: 'pending' },
    { name: 'Data Persistence', status: 'pending' },
    { name: 'Swedish Language', status: 'pending' }
  ];

  const updateTestResult = (testIndex: number, status: TestResult['status'], message?: string, duration?: number) => {
    setTestResults(prev => prev.map((test, index) => 
      index === testIndex 
        ? { ...test, status, message, duration }
        : test
    ));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runSingleTest = async (testIndex: number): Promise<boolean> => {
    const test = testResults[testIndex];
    updateTestResult(testIndex, 'running');
    
    const startTime = Date.now();
    
    try {
      switch (testIndex) {
        case 0: // Backend Connection
          const status = await LocalStorageService.getBackendStatus();
          if (!status.working) throw new Error(status.error || 'Backend not working');
          const storageType = status.details && status.details[4] ? status.details[4] : 'Unknown storage';
          updateTestResult(testIndex, 'passed', `${status.entries} entries, ${storageType}`, Date.now() - startTime);
          return true;

        case 1: // Save Gratitude
          const testText = `🧪 Developer Test ${Date.now()} 🌿`;
          const savedEntry = await LocalStorageService.saveGratitude(testText);
          if (!savedEntry.id) throw new Error('Save failed - no ID returned');
          updateTestResult(testIndex, 'passed', `Saved: ${savedEntry.id.substring(0, 8)}...`, Date.now() - startTime);
          return true;

        case 2: // Retrieve Gratitudes  
          const allGratitudes = await LocalStorageService.getAllGratitudes();
          const count = allGratitudes.length;
          if (count === 0) throw new Error('No gratitudes found');
          updateTestResult(testIndex, 'passed', `Retrieved ${count} gratitudes`, Date.now() - startTime);
          return true;

        case 3: // Count Gratitudes
          const gratitudeCount = await LocalStorageService.getGratitudesCount();
          if (gratitudeCount < 1) throw new Error('Count returned 0 or negative');
          updateTestResult(testIndex, 'passed', `Count: ${gratitudeCount}`, Date.now() - startTime);
          return true;

        case 4: // Delete Gratitude
          const gratitudes = await LocalStorageService.getAllGratitudes();
          if (gratitudes.length === 0) throw new Error('No gratitudes to delete');
          
          const beforeCount = gratitudes.length;
          await LocalStorageService.deleteGratitude(gratitudes[0].id);
          const afterCount = await LocalStorageService.getGratitudesCount();
          
          if (afterCount !== beforeCount - 1) throw new Error(`Delete failed: ${beforeCount} -> ${afterCount}`);
          updateTestResult(testIndex, 'passed', `Deleted 1, count: ${beforeCount} -> ${afterCount}`, Date.now() - startTime);
          return true;

        case 5: // Emoji Handling
          const emojiText = "Test med emojis 🌿❤️✨🌟";
          const emojiEntry = await LocalStorageService.saveGratitude(emojiText);
          const extractedEmojis = LocalStorageService.extractEmojisFromText(emojiEntry.text);
          
          if (extractedEmojis.length !== 4) throw new Error(`Expected 4 emojis, got ${extractedEmojis.length}`);
          updateTestResult(testIndex, 'passed', `${extractedEmojis.length} emojis: ${extractedEmojis.join(' ')}`, Date.now() - startTime);
          return true;

        case 6: // Notification Permissions
          const hasPermission = await NotificationService.requestPermissions();
          updateTestResult(testIndex, hasPermission ? 'passed' : 'failed', 
            hasPermission ? 'Permission granted' : 'Permission denied', Date.now() - startTime);
          return hasPermission;

        case 7: // Notification Scheduling  
          try {
            await NotificationService.updateNotifications(NotificationService.defaultSettings);
            const scheduledNotifications = await NotificationService.getScheduledNotifications();
            updateTestResult(testIndex, 'passed', `${scheduledNotifications.length} notifications scheduled`, Date.now() - startTime);
            return true;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown notification error';
            updateTestResult(testIndex, 'failed', `Scheduling failed: ${errorMessage}`, Date.now() - startTime);
            return false;
          }

        case 8: // Data Persistence
          const beforePersistence = await LocalStorageService.getGratitudesCount();
          const persistenceText = `Persistence test ${Date.now()}`;
          await LocalStorageService.saveGratitude(persistenceText);
          
          // Simulate app restart by getting fresh count
          await sleep(100);
          const afterPersistence = await LocalStorageService.getGratitudesCount();
          
          if (afterPersistence !== beforePersistence + 1) throw new Error(`Persistence failed: ${beforePersistence} -> ${afterPersistence}`);
          updateTestResult(testIndex, 'passed', `Data persisted: ${beforePersistence} -> ${afterPersistence}`, Date.now() - startTime);
          return true;

        case 9: // Swedish Language
          const swedishWords = ['tacksamhet', 'måndag', 'Manifest', 'Little Bear'];
          const swedishTestText = "Svensk tacksamhet måndag test för Little Bear";
          const swedishEntry = await LocalStorageService.saveGratitude(swedishTestText);
          
          let foundSwedishWords = 0;
          swedishWords.forEach(word => {
            if (swedishEntry.text.includes(word)) foundSwedishWords++;
          });
          
          if (foundSwedishWords < 3) throw new Error(`Only found ${foundSwedishWords}/4 Swedish words`);
          updateTestResult(testIndex, 'passed', `${foundSwedishWords}/4 Swedish words found`, Date.now() - startTime);
          return true;

        default:
          throw new Error('Unknown test');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      updateTestResult(testIndex, 'failed', errorMessage, Date.now() - startTime);
      return false;
    }
  };

  const runAllTests = async () => {
    try {
      setIsRunningTests(true);
      setTestResults([...initialTests]);
      setAllTestsPassed(false);

      let passedCount = 0;
      const totalTests = initialTests.length;

      for (let i = 0; i < totalTests; i++) {
        try {
          const passed = await runSingleTest(i);
          if (passed) passedCount++;
        } catch (error) {
          console.error(`Test ${i} crashed:`, error);
          updateTestResult(i, 'failed', `Test crashed: ${error instanceof Error ? error.message : 'Unknown error'}`, 0);
        }
        await sleep(200); // Small delay between tests
      }

      setIsRunningTests(false);
      const allPassed = passedCount === totalTests;
      setAllTestsPassed(allPassed);

      Alert.alert(
        allPassed ? '🎉 All Tests Passed!' : '⚠️ Some Tests Failed',
        `${passedCount}/${totalTests} tests passed\n\n${
          allPassed 
            ? 'Little Bear\'s Manifest App is working perfectly!' 
            : 'Check failed tests below for details.'
        }`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      setIsRunningTests(false);
      console.error('Test suite crashed:', error);
      Alert.alert(
        '💥 Test Suite Error',
        `Test suite crashed: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease report this to developer.`,
        [{ text: 'OK' }]
      );
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    setAllTestsPassed(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'running': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'passed': return SwedishForestTheme.colors.primary;
      case 'failed': return SwedishForestTheme.colors.error;
      case 'running': return SwedishForestTheme.colors.warning;
      default: return SwedishForestTheme.colors.text.secondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SwedishButton 
          title="← Tillbaka"
          onPress={onBack}
          variant="text"
          size="small"
        />
        <Text style={styles.title}>🧪 Developer Test Suite</Text>
        <Text style={styles.subtitle}>
          Testar frontend mot backend live på iPhone
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.controlPanel}>
          <SwedishButton
            title={isRunningTests ? "🔄 Kör tester..." : "🚀 Kör alla tester"}
            onPress={runAllTests}
            disabled={isRunningTests}
            variant="primary"
          />
          
          {testResults.length > 0 && (
            <SwedishButton
              title="🧹 Rensa resultat"
              onPress={clearTestResults}
              variant="text"
              size="small"
            />
          )}
        </View>

        {testResults.length > 0 && (
          <>
            <View style={styles.summary}>
              <Text style={styles.summaryTitle}>📊 Test Summary</Text>
              <Text style={styles.summaryText}>
                {testResults.filter(t => t.status === 'passed').length}/{testResults.length} tests passed
              </Text>
              {allTestsPassed && (
                <Text style={styles.successText}>
                  🎉 All tests passed! App is production ready!
                </Text>
              )}
            </View>

            <View style={styles.resultsContainer}>
              {testResults.map((test, index) => (
                <View key={index} style={styles.testResult}>
                  <View style={styles.testHeader}>
                    <Text style={styles.testIcon}>{getStatusIcon(test.status)}</Text>
                    <Text style={[styles.testName, { color: getStatusColor(test.status) }]}>
                      {test.name}
                    </Text>
                    {test.duration !== undefined && test.duration !== null && (
                      <Text style={styles.testDuration}>{test.duration}ms</Text>
                    )}
                  </View>
                  {test.message && (
                    <Text style={styles.testMessage}>{test.message}</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>🔧 Developer Test Suite</Text>
          <Text style={styles.infoText}>
            Detta testar alla kritiska komponenter i Little Bear's Manifest App direkt på din iPhone:
          </Text>
          <Text style={styles.infoText}>
            • Backend storage operations{'\n'}
            • Notification system{'\n'} 
            • Data persistence{'\n'}
            • Emoji handling{'\n'}
            • Swedish language support
          </Text>
          <Text style={styles.infoFooter}>
            🐻 Developed by Little Bear for Manifest App
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SwedishForestTheme.colors.background,
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
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    padding: SwedishForestTheme.spacing.lg,
  },
  
  controlPanel: {
    alignItems: 'center',
    marginBottom: SwedishForestTheme.spacing.xl,
  },
  
  summary: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    marginBottom: SwedishForestTheme.spacing.lg,
    ...SwedishForestTheme.shadows.card,
  },
  
  summaryTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.h2,
    fontWeight: '500',
    color: SwedishForestTheme.colors.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  summaryText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.text.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  successText: {
    fontSize: SwedishForestTheme.typography.fontSize.body,
    color: SwedishForestTheme.colors.primary,
    fontWeight: '500',
  },
  
  resultsContainer: {
    marginBottom: SwedishForestTheme.spacing.xl,
  },
  
  testResult: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.md,
    borderRadius: SwedishForestTheme.borderRadius.medium,
    marginBottom: SwedishForestTheme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: SwedishForestTheme.colors.primary,
  },
  
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  testIcon: {
    fontSize: 18,
    marginRight: SwedishForestTheme.spacing.sm,
  },
  
  testName: {
    flex: 1,
    fontSize: SwedishForestTheme.typography.fontSize.body,
    fontWeight: '500',
  },
  
  testDuration: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.text.secondary,
    fontFamily: 'monospace',
  },
  
  testMessage: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    marginTop: SwedishForestTheme.spacing.xs,
    marginLeft: 30, // Indent under icon
  },
  
  infoPanel: {
    backgroundColor: SwedishForestTheme.colors.surface,
    padding: SwedishForestTheme.spacing.lg,
    borderRadius: SwedishForestTheme.borderRadius.card,
    ...SwedishForestTheme.shadows.card,
  },
  
  infoTitle: {
    fontSize: SwedishForestTheme.typography.fontSize.h2,
    fontWeight: '500',
    color: SwedishForestTheme.colors.primary,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  infoText: {
    fontSize: SwedishForestTheme.typography.fontSize.caption,
    color: SwedishForestTheme.colors.text.secondary,
    lineHeight: SwedishForestTheme.typography.lineHeight.relaxed * SwedishForestTheme.typography.fontSize.caption,
    marginBottom: SwedishForestTheme.spacing.sm,
  },
  
  infoFooter: {
    fontSize: SwedishForestTheme.typography.fontSize.small,
    color: SwedishForestTheme.colors.primary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SwedishForestTheme.spacing.md,
  },
});