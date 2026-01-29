#!/usr/bin/env node
/**
 * Switch från emoji fallback till real graphics
 */

const fs = require('fs');
const path = require('path');

const todayScreenPath = '/home/devpi/clawd/projects/manifest-app/ManifestApp/src/screens/TodayScreen/TodayScreen.tsx';

function switchToRealGraphics() {
  console.log('🔄 Switching från emoji fallback till real graphics...');
  
  let content = fs.readFileSync(todayScreenPath, 'utf8');
  
  // Replace emoji version med Image version
  content = content.replace(
    /\{\/\* Little Bear Welcome \*\/\}\s*<View style=\{styles\.littleBearContainer\}>\s*<Text style=\{styles\.littleBearEmoji\}>🐻<\/Text>\s*<Text style=\{styles\.littleBearText\}>Välkommen till din tacksamhetsresa! 🌿<\/Text>\s*<Text style=\{styles\.littleBearSubtext\}>Little Bear Premium Graphics Loading...<\/Text>\s*<\/View>/,
    `{/* Little Bear Welcome */}
        <View style={styles.littleBearContainer}>
          <Image source={LittleBearMeditation} style={styles.littleBearImage} resizeMode="contain" />
          <Text style={styles.littleBearText}>Välkommen till din tacksamhetsresa! 🌿</Text>
          <Text style={styles.premiumText}>Premium Little Bear Graphics Active! ✨</Text>
        </View>`
  );
  
  // Update styles
  content = content.replace(
    /littleBearEmoji: \{[^}]+\},\s*littleBearText: \{[^}]+\},\s*littleBearSubtext: \{[^}]+\},/,
    `littleBearImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    borderRadius: 60,
  },
  littleBearText: {
    fontSize: 18,
    color: '#2F5F8F',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 12,
    color: '#7FB069',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '500',
  },`
  );
  
  fs.writeFileSync(todayScreenPath, content);
  console.log('✅ Switched till real graphics!');
  console.log('📱 Reload appen för att se premium graphics!');
}

if (require.main === module) {
  switchToRealGraphics();
}

module.exports = { switchToRealGraphics };