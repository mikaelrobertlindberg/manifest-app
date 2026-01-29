#!/usr/bin/env node
/**
 * AUTO-INTEGRATE GRAPHICS SCRIPT
 * Automatically updates React Native Manifest App with new Midjourney graphics
 * 
 * Usage: node auto-integrate-graphics.js /path/to/graphics-folder
 */

const fs = require('fs');
const path = require('path');

class GraphicsIntegrator {
  constructor() {
    this.projectRoot = path.join(__dirname, 'ManifestApp');
    this.assetsPath = path.join(this.projectRoot, 'assets');
    this.srcPath = path.join(this.projectRoot, 'src');
  }

  async integrateGraphics(graphicsFolder) {
    console.log('🎨 AUTO-INTEGRATING MIDJOURNEY GRAPHICS...');
    console.log(`📁 Graphics source: ${graphicsFolder}`);
    
    try {
      // Step 1: Copy graphics to assets folder
      await this.copyGraphicsAssets(graphicsFolder);
      
      // Step 2: Update app icon references  
      await this.updateAppIcon();
      
      // Step 3: Add Little Bear to welcome screen
      await this.addLittleBearToWelcome();
      
      // Step 4: Update button styling with new colors
      await this.updateButtonStyling();
      
      // Step 5: Update navigation if icons available
      await this.updateNavigationIcons();
      
      // Step 6: Apply Calm color palette
      await this.applyCalmColorPalette();
      
      console.log('✅ GRAPHICS INTEGRATION COMPLETE!');
      console.log('📱 Ready for iPhone testing!');
      
      return true;
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      return false;
    }
  }

  async copyGraphicsAssets(sourceFolder) {
    console.log('📁 Copying Midjourney graphics...');
    
    // Ensure assets directory structure exists
    const dirs = ['icons', 'characters', 'ui'];
    dirs.forEach(dir => {
      const dirPath = path.join(this.assetsPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
    
    // Expected file mappings from Midjourney downloads
    const fileMap = {
      // App icon (various names Midjourney might generate)
      'app-icon': 'icons/app-icon.png',
      'icon': 'icons/app-icon.png',
      
      // Little Bear mascot
      'little-bear-meditation': 'characters/little-bear-meditation.png',
      'meditation': 'characters/little-bear-meditation.png',
      'bear-meditation': 'characters/little-bear-meditation.png',
      
      'little-bear-welcome': 'characters/little-bear-welcome.png', 
      'welcome': 'characters/little-bear-welcome.png',
      'bear-welcome': 'characters/little-bear-welcome.png',
      
      // UI elements
      'primary-button': 'ui/primary-button.png',
      'button': 'ui/primary-button.png',
      
      'navigation-icons': 'ui/navigation-icons.png',
      'nav-icons': 'ui/navigation-icons.png',
      'icons': 'ui/navigation-icons.png'
    };
    
    // Copy files from source folder
    const sourceFiles = fs.readdirSync(sourceFolder).filter(file => 
      file.toLowerCase().endsWith('.png') || 
      file.toLowerCase().endsWith('.jpg') || 
      file.toLowerCase().endsWith('.jpeg') ||
      file.toLowerCase().endsWith('.txt')  // Include text placeholders
    );
    
    console.log(`📸 Found ${sourceFiles.length} image files`);
    
    sourceFiles.forEach(file => {
      const fileName = path.parse(file).name.toLowerCase();
      
      // Find matching destination
      let destPath = null;
      for (const [key, value] of Object.entries(fileMap)) {
        if (fileName.includes(key)) {
          destPath = path.join(this.assetsPath, value);
          break;
        }
      }
      
      if (destPath) {
        const sourcePath = path.join(sourceFolder, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied: ${file} → ${path.basename(destPath)}`);
      } else {
        // Copy with original name to general folder
        const destPath = path.join(this.assetsPath, 'ui', file);
        const sourcePath = path.join(sourceFolder, file);
        fs.copyFileSync(sourcePath, destPath);
        console.log(`📋 Copied: ${file} → ui/${file}`);
      }
    });
    
    console.log('📁 Asset copying complete');
  }

  async updateAppIcon() {
    console.log('📱 Updating app icon configuration...');
    
    const appJsonPath = path.join(this.projectRoot, 'app.json');
    
    if (fs.existsSync(appJsonPath)) {
      const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
      
      // Update app.json with new icon
      appJson.expo.icon = "./assets/icons/app-icon.png";
      
      // Add iOS specific icons if needed
      if (!appJson.expo.ios) appJson.expo.ios = {};
      if (!appJson.expo.ios.icon) {
        appJson.expo.ios.icon = "./assets/icons/app-icon.png";
      }
      
      fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
      console.log('✅ App icon updated in app.json');
    } else {
      console.log('⚠️ app.json not found, skipping icon update');
    }
  }

  async addLittleBearToWelcome() {
    console.log('🐻 Adding Little Bear to Today screen...');
    
    const todayScreenPath = path.join(this.srcPath, 'screens/TodayScreen/TodayScreen.tsx');
    
    if (fs.existsSync(todayScreenPath)) {
      let content = fs.readFileSync(todayScreenPath, 'utf8');
      
      // Check if Little Bear already added
      if (content.includes('little-bear') || content.includes('LittleBear')) {
        console.log('🐻 Little Bear already present, skipping...');
        return;
      }
      
      // Add Little Bear import
      if (!content.includes('Image') || !content.includes('react-native')) {
        content = content.replace(
          `from 'react-native';`,
          `from 'react-native';\nconst LittleBearMeditation = require('../../../assets/characters/little-bear-meditation.png');`
        );
      } else {
        // Add to existing import
        content = content.replace(
          `} from 'react-native';`,
          `} from 'react-native';\nconst LittleBearMeditation = require('../../../assets/characters/little-bear-meditation.png');`
        );
      }
      
      // Add Little Bear component to render
      const bearComponent = `
        {/* Little Bear Welcome */}
        <View style={styles.littleBearContainer}>
          <Image source={LittleBearMeditation} style={styles.littleBearImage} resizeMode="contain" />
          <Text style={styles.littleBearText}>Välkommen till din tacksamhetsresa! 🌿</Text>
        </View>`;
      
      // Insert after container opening but before main content
      content = content.replace(
        '<View style={styles.container}>',
        `<View style={styles.container}>${bearComponent}`
      );
      
      // Add styles
      const bearStyles = `
  littleBearContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 16,
  },
  littleBearImage: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  littleBearText: {
    fontSize: 16,
    color: '#2F5F8F',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 20,
  },`;
      
      // Insert styles before container style
      content = content.replace(
        /(\s+)container:\s*{/,
        `${bearStyles}\n$1container: {`
      );
      
      fs.writeFileSync(todayScreenPath, content);
      console.log('✅ Little Bear added to Today screen');
    } else {
      console.log('⚠️ TodayScreen.tsx not found, skipping Little Bear');
    }
  }

  async updateButtonStyling() {
    console.log('🔘 Updating button styling with Calm colors...');
    
    // Update common button styles across screens
    const screenFiles = [
      'src/screens/TodayScreen/TodayScreen.tsx',
      'src/screens/HistoryScreen/HistoryScreen.tsx',
      'src/screens/SettingsScreen/SettingsScreen.tsx'
    ];
    
    const calmButtonStyle = `
    backgroundColor: '#5B9BD5',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,`;
    
    screenFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update save button style
        if (content.includes('saveButton:') && !content.includes('#5B9BD5')) {
          content = content.replace(
            /saveButton:\s*{[^}]*backgroundColor:\s*[^,}]*/,
            `saveButton: {\n    ${calmButtonStyle}`
          );
          
          fs.writeFileSync(filePath, content);
          console.log(`✅ Updated button styling in ${file}`);
        }
      }
    });
  }

  async updateNavigationIcons() {
    console.log('⚙️ Checking for navigation icons...');
    
    // Check if navigation icons file exists
    const navIconsPath = path.join(this.assetsPath, 'ui/navigation-icons.png');
    if (fs.existsSync(navIconsPath)) {
      console.log('✅ Navigation icons available for future integration');
      // TODO: Implement tab navigator icon updates
    } else {
      console.log('📋 Navigation icons not found, using default styling');
    }
  }

  async applyCalmColorPalette() {
    console.log('🎨 Applying Calm color palette...');
    
    // Create color constants file
    const colorsContent = `// Calm-inspired Color Palette for Little Bear's Manifest App
export const Colors = {
  // Primary Calm colors
  calmBlueLight: '#E8F4FD',
  calmBlue: '#5B9BD5', 
  calmBlueDark: '#2F5F8F',
  
  calmGreenLight: '#E8F5E8',
  calmGreen: '#7FB069',
  calmGreenDark: '#4F7942',
  
  // Accent colors  
  warmOrange: '#FF8A65',
  gentlePink: '#FFB3E6',
  softPurple: '#9C88FF',
  warmYellow: '#FFD93D',
  
  // Swedish nature touch
  forestGreen: '#2F5233',
  birchYellow: '#F5E6A3',
  midnightBlue: '#1B365D',
  
  // Neutrals
  calmGrayLight: '#F8F9FA',
  calmGray: '#E9ECEF', 
  calmGrayDark: '#6C757D',
  
  // Text
  textPrimary: '#2F5F8F',
  textSecondary: '#6C757D',
  textLight: '#FFFFFF',
};

// Gradient definitions
export const Gradients = {
  mainApp: ['#E8F4FD', '#E8F5E8'],
  morning: ['#FFE4B5', '#87CEEB'],
  evening: ['#4B0082', '#2F4F4F'],
  swedishNature: ['#87CEEB', '#2F5233'],
  primaryButton: ['#5B9BD5', '#2F5F8F'],
  saveButton: ['#FF8A65', '#FFB3E6'],
};
`;
    
    const colorsPath = path.join(this.srcPath, 'constants/Colors.ts');
    const constantsDir = path.dirname(colorsPath);
    
    if (!fs.existsSync(constantsDir)) {
      fs.mkdirSync(constantsDir, { recursive: true });
    }
    
    fs.writeFileSync(colorsPath, colorsContent);
    console.log('✅ Calm color palette created: src/constants/Colors.ts');
  }
}

// Main execution
async function main() {
  const graphicsFolder = process.argv[2];
  
  if (!graphicsFolder) {
    console.error('❌ Please provide graphics folder path');
    console.log('Usage: node auto-integrate-graphics.js /path/to/graphics-folder');
    process.exit(1);
  }
  
  if (!fs.existsSync(graphicsFolder)) {
    console.error('❌ Graphics folder not found:', graphicsFolder);
    process.exit(1);
  }
  
  const integrator = new GraphicsIntegrator();
  const success = await integrator.integrateGraphics(graphicsFolder);
  
  if (success) {
    console.log('');
    console.log('🎉 INTEGRATION SUCCESSFUL!');
    console.log('📱 Ready to test on iPhone:');
    console.log('   1. Restart Expo development server');
    console.log('   2. Reload app on iPhone');
    console.log('   3. Enjoy the new Calm-inspired design!');
    console.log('');
  } else {
    console.log('❌ Integration failed - check error messages above');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GraphicsIntegrator;