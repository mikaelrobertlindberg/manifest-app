#!/usr/bin/env node
/**
 * FORCE VISUAL CHANGES - GUARANTEED VISIBLE
 * Make extreme visual changes that are impossible to miss
 */

const fs = require('fs');
const path = require('path');

const todayScreenPath = '/home/devpi/clawd/projects/manifest-app/ManifestApp/src/screens/TodayScreen/TodayScreen.tsx';

function forceVisualChanges() {
  console.log('🚀 FORCING EXTREME VISUAL CHANGES - IMPOSSIBLE TO MISS!');
  
  let content = fs.readFileSync(todayScreenPath, 'utf8');
  
  // 1. Change background to bright colors
  content = content.replace(
    /backgroundColor: '[^']*'/g,
    `backgroundColor: '#FF69B4'` // Hot pink - impossible to miss!
  );
  
  // 2. Make title huge and obvious
  content = content.replace(
    /🚀 PREMIUM MANIFEST 🐻/g,
    '💥 VISUAL CHANGES WORKING! 💥'
  );
  
  // 3. Add obvious test element at top
  const testElement = `
        {/* EXTREME VISUAL TEST - IMPOSSIBLE TO MISS */}
        <View style={{
          backgroundColor: '#00FF00',
          padding: 20,
          margin: 20,
          borderRadius: 10,
          borderWidth: 5,
          borderColor: '#FF0000',
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000000',
            textAlign: 'center',
          }}>
            ✅ VISUAL CHANGES ACTIVE! ✅
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#000000',
            textAlign: 'center',
            marginTop: 10,
          }}>
            If you see this, graphics system works!
          </Text>
        </View>`;
  
  // Insert at beginning of container
  content = content.replace(
    '<View style={styles.container}>',
    `<View style={styles.container}>${testElement}`
  );
  
  fs.writeFileSync(todayScreenPath, content);
  console.log('💥 EXTREME VISUAL CHANGES APPLIED!');
  console.log('📱 App will now have:');
  console.log('   - Hot pink background');
  console.log('   - Green test box with red border');
  console.log('   - "VISUAL CHANGES ACTIVE!" message');
  console.log('   - Impossible to miss!');
}

if (require.main === module) {
  forceVisualChanges();
}

module.exports = { forceVisualChanges };