# 📐 FIGMA DESIGN SYSTEM - IMPLEMENTATION GUIDE

Complete guide för Figma Design System implementation i Manifest App.

## 🎯 Quick Start

```bash
cd ManifestApp
npm install
npm run web    # Test på localhost:19006
```

## 📁 Project Structure

```
src/
├── design-system/
│   ├── FigmaDesignSystem.ts          # Core tokens & factory
│   └── components/
│       ├── FigmaButton.tsx           # Button component
│       ├── FigmaCard.tsx             # Card component  
│       ├── FigmaInput.tsx            # Input component
│       ├── FigmaText.tsx             # Typography
│       └── index.ts                  # Clean exports
└── screens/
    ├── TodayScreen/FigmaTodayScreen.tsx
    ├── HistoryScreen/FigmaHistoryScreen.tsx
    └── SettingsScreen/FigmaSettingsScreen.tsx
```

## 🎨 Design Tokens

### Colors (Cosmic Sunset Theme)
```typescript
DesignTokens.colors.primary[500]    // #FF6B6B (main)
DesignTokens.colors.secondary[500]  // #FF8E53 
DesignTokens.colors.gray[800]       // Text primary
DesignTokens.colors.gray[600]       // Text secondary
```

### Typography
```typescript
DesignTokens.typography.headline1   // 32px, bold
DesignTokens.typography.body1       // 16px, normal
DesignTokens.typography.caption     // 12px, small
```

### Spacing (8px Grid)
```typescript
DesignTokens.spacing.xs    // 4px
DesignTokens.spacing.sm    // 8px  
DesignTokens.spacing.md    // 16px
DesignTokens.spacing.lg    // 24px
DesignTokens.spacing.xl    // 32px
```

## 🧩 Using Components

### Import Components
```typescript
import { 
  FigmaButton, 
  FigmaCard, 
  FigmaInput,
  FigmaHeading1,
  DesignTokens 
} from '../design-system/components';
```

### Button Examples
```typescript
<FigmaButton 
  title="Save"
  variant="primary"     // primary | secondary | ghost
  size="medium"         // small | medium | large  
  fullWidth
  onPress={handleSave}
  loading={isSaving}
/>
```

### Card Examples
```typescript
<FigmaCard variant="elevated">
  <FigmaHeading2>Card Title</FigmaHeading2>
  <FigmaBody>Card content...</FigmaBody>
</FigmaCard>
```

### Input Examples
```typescript
<FigmaInput
  label="Enter gratitude"
  value={text}
  onChangeText={setText}
  placeholder="What are you grateful for?"
  multiline
  error={errorMessage}
/>
```

### Typography Examples
```typescript
<FigmaHeading1 color={DesignTokens.colors.primary[500]}>
  Main Title
</FigmaHeading1>

<FigmaBody color={DesignTokens.colors.gray[600]}>
  Body text content
</FigmaBody>
```

## 🎨 Customizing Styles

### Override Component Styles
```typescript
<FigmaButton 
  title="Custom Button"
  style={{ 
    backgroundColor: DesignTokens.colors.secondary[500],
    borderRadius: DesignTokens.radius.xl 
  }}
/>
```

### Create Custom Styles
```typescript
const customStyles = StyleSheet.create({
  container: {
    padding: DesignTokens.spacing.lg,
    backgroundColor: DesignTokens.colors.surface,
    borderRadius: DesignTokens.radius.lg,
    ...DesignTokens.shadows.md,
  }
});
```

## 📱 Screen Implementation

### Replace Old Screens
```typescript
// Old
import { TodayScreen } from './TodayScreen';

// New  
import { FigmaTodayScreen } from './FigmaTodayScreen';
```

### Screen Structure
```typescript
// Header with back button
<View style={styles.header}>
  <TouchableOpacity style={styles.backButton} onPress={onBack}>
    <FigmaText variant="headline2">←</FigmaText>
  </TouchableOpacity>
  <FigmaHeading1>Screen Title</FigmaHeading1>
</View>

// Content cards
<FigmaCard variant="elevated">
  <FigmaHeading3>Section Title</FigmaHeading3>
  <FigmaBody>Section content...</FigmaBody>
</FigmaCard>
```

## 🎯 Best Practices

### 1. Use Design Tokens
```typescript
// ✅ Good
backgroundColor: DesignTokens.colors.primary[500]

// ❌ Avoid
backgroundColor: '#FF6B6B'
```

### 2. Consistent Spacing
```typescript
// ✅ Good  
marginBottom: DesignTokens.spacing.lg

// ❌ Avoid
marginBottom: 24
```

### 3. Typography Hierarchy
```typescript
// ✅ Good
<FigmaHeading1>Page Title</FigmaHeading1>
<FigmaHeading2>Section Title</FigmaHeading2>  
<FigmaBody>Content text</FigmaBody>

// ❌ Avoid
<Text style={{fontSize: 32, fontWeight: 'bold'}}>Title</Text>
```

### 4. Touch Targets
```typescript
// ✅ Good - 44px minimum
<TouchableOpacity style={{minHeight: 44, minWidth: 44}}>

// ❌ Avoid
<TouchableOpacity style={{height: 20, width: 20}}>
```

## 🐛 Troubleshooting

### Import Errors
```typescript
// Make sure path is correct
import { FigmaButton } from '../design-system/components';

// Check index.ts exports
export { FigmaButton } from './FigmaButton';
```

### TypeScript Errors
```typescript
// Import types
import { ViewStyle, TextStyle } from 'react-native';

// Use proper typing
const styles: ViewStyle = {
  backgroundColor: DesignTokens.colors.primary[500]
};
```

### Asset Loading Issues
```bash
# Clear cache
expo r -c

# Restart bundler  
expo start --clear
```

### Web Specific Issues
```bash
# Web only start
expo start --web

# Check localhost:19006
```

## 📦 Adding New Components

### 1. Create Component File
```typescript
// src/design-system/components/FigmaNewComponent.tsx
export const FigmaNewComponent: React.FC<Props> = ({ ... }) => {
  // Use design tokens
  const styles = StyleSheet.create({
    container: {
      padding: DesignTokens.spacing.md,
      backgroundColor: DesignTokens.colors.surface,
    }
  });
  
  return <View style={styles.container}>...</View>;
};
```

### 2. Export from Index
```typescript
// src/design-system/components/index.ts
export { FigmaNewComponent } from './FigmaNewComponent';
```

### 3. Use in Screens
```typescript
import { FigmaNewComponent } from '../design-system/components';

<FigmaNewComponent />
```

## 🎨 Theme Customization

### Change Colors
```typescript
// In FigmaDesignSystem.ts
colors: {
  primary: {
    500: '#YOUR_COLOR', // Change main color
  }
}
```

### Add New Tokens
```typescript
// Add to DesignTokens
export const DesignTokens = {
  // Existing tokens...
  
  // New tokens
  customSpacing: {
    huge: 80,
  },
  
  customColors: {
    brand: '#YOUR_BRAND_COLOR',
  }
};
```

## 🚀 Production Deployment

### Build for Production
```bash
# Web build
expo build:web

# iOS build (requires Mac)
expo build:ios

# Android build
expo build:android
```

### Assets Optimization
- All icons are optimized
- Splash screen is production ready
- Design tokens are tree-shakeable

## 📝 Migration Checklist

- [✅] Design system core implemented
- [✅] All components created
- [✅] Assets generated
- [✅] Screens migrated
- [✅] App.json updated
- [✅] Expo compatible

## 🆘 Support

If you encounter issues:

1. Check import paths
2. Verify design token usage
3. Clear Expo cache: `expo r -c`
4. Check console for TypeScript errors
5. Ensure all files are saved

## 🎯 Next Steps

1. Test all screens thoroughly
2. Add more components as needed  
3. Customize theme colors if desired
4. Deploy to app stores
5. Gather user feedback

---

**📐 You now have a production-ready Figma Design System! 🚀**