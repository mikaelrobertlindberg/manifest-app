/**
 * 📐 FIGMA DESIGN SYSTEM
 * 
 * Pixel-perfect design system based on Figma's component architecture
 * Built för Manifest - Svenska Tacksamhetsappen
 */

// =============================================================================
// DESIGN TOKENS
// =============================================================================

export const DesignTokens = {
  // Typography Scale (Nunito - Mysig & Mindfulness-Optimerad)
  typography: {
    // Headlines
    headline1: {
      fontFamily: 'Nunito_700Bold',
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
      letterSpacing: -0.32,
    },
    headline2: {
      fontFamily: 'Nunito_600SemiBold', 
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
      letterSpacing: -0.24,
    },
    headline3: {
      fontFamily: 'Nunito_600SemiBold',
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
      letterSpacing: -0.2,
    },
    // Body Text
    body1: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
      letterSpacing: 0,
    },
    body2: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      letterSpacing: 0,
    },
    // Labels & Buttons
    button: {
      fontFamily: 'Nunito_600SemiBold',
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 24,
      letterSpacing: 0.16,
    },
    caption: {
      fontFamily: 'Nunito_400Regular',
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      letterSpacing: 0.4,
    },
  },

  // Color System (Based on Cosmic Sunset theme from our showcase)
  colors: {
    // Primary Colors
    primary: {
      50: '#FFF8F8',
      100: '#FFEBEB', 
      200: '#FFD6D6',
      300: '#FFB5B5',
      400: '#FF8A8A',
      500: '#FF6B6B', // Main primary
      600: '#FF5252',
      700: '#E53E3E',
      800: '#C53030',
      900: '#9B2C2C',
    },
    
    // Secondary Colors
    secondary: {
      50: '#FFF9F5',
      100: '#FFEDE0',
      200: '#FFD4B8',
      300: '#FFB88F',
      400: '#FF9C66',
      500: '#FF8E53', // Main secondary
      600: '#F56500',
      700: '#C05621',
      800: '#9C4221',
      900: '#7B341E',
    },

    // Neutral Colors
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    // Semantic Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Surface Colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F8F9FA',
  },

  // Spacing System (8px grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Border Radius (Mjukare hörn för bättre touch)
  radius: {
    none: 0,
    xs: 4,
    sm: 8,      // Mjukare än tidigare
    md: 16,     // Extra rundade hörn
    lg: 24,     // Mycket mjuka
    xl: 32,     // Super mjuka hörn
    xxl: 40,    // Extremt mjuka
    full: 9999,
  },

  // Shadow System
  shadows: {
    none: 'none',
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },

  // Border Widths
  borderWidth: {
    none: 0,
    hairline: 0.5,
    thin: 1,
    thick: 2,
  },
};

// =============================================================================
// COMPONENT VARIANTS
// =============================================================================

export const ComponentVariants = {
  // Button Variants
  button: {
    primary: {
      backgroundColor: DesignTokens.colors.primary[500],
      color: '#FFFFFF',
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: DesignTokens.colors.primary[500],
      borderWidth: DesignTokens.borderWidth.thin,
      borderColor: DesignTokens.colors.primary[500],
    },
    ghost: {
      backgroundColor: 'transparent',
      color: DesignTokens.colors.primary[500],
      borderWidth: 0,
    },
  },

  // Card Variants
  card: {
    default: {
      backgroundColor: DesignTokens.colors.surface,
      borderRadius: DesignTokens.radius.lg,
      padding: DesignTokens.spacing.md,
      ...DesignTokens.shadows.md,
    },
    outlined: {
      backgroundColor: DesignTokens.colors.surface,
      borderRadius: DesignTokens.radius.lg,
      padding: DesignTokens.spacing.md,
      borderWidth: DesignTokens.borderWidth.thin,
      borderColor: DesignTokens.colors.gray[200],
    },
    elevated: {
      backgroundColor: DesignTokens.colors.surface,
      borderRadius: DesignTokens.radius.lg,
      padding: DesignTokens.spacing.md,
      ...DesignTokens.shadows.lg,
    },
  },

  // Input Variants  
  input: {
    default: {
      backgroundColor: DesignTokens.colors.surfaceVariant,
      borderRadius: DesignTokens.radius.md, // Mjukare hörn för input
      paddingHorizontal: DesignTokens.spacing.md,
      paddingVertical: DesignTokens.spacing.sm,
      borderWidth: DesignTokens.borderWidth.thin,
      borderColor: DesignTokens.colors.gray[300],
      minHeight: 44, // Touch target
    },
    focused: {
      borderColor: DesignTokens.colors.primary[500],
      borderWidth: DesignTokens.borderWidth.thick,
    },
    error: {
      borderColor: DesignTokens.colors.error,
      borderWidth: DesignTokens.borderWidth.thick,
    },
  },
};

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================

export const Layout = {
  // Screen padding
  screenPadding: DesignTokens.spacing.md,
  
  // Component spacing
  componentSpacing: DesignTokens.spacing.lg,
  
  // Touch targets
  minTouchTarget: 44,
  
  // Header height
  headerHeight: 64,
  
  // Tab bar height
  tabBarHeight: 80,
  
  // Safe areas
  statusBarHeight: 44,
  bottomSafeArea: 34,
};

// =============================================================================
// FIGMA COMPONENT FACTORY
// =============================================================================

/**
 * Factory för att skapa standardiserade Figma design system styles
 */
export const FigmaComponentFactory = {
  /**
   * Skapa text style från design tokens
   */
  createTextStyle: (variant: keyof typeof DesignTokens.typography, color?: string) => ({
    ...DesignTokens.typography[variant],
    color: color || DesignTokens.colors.gray[900],
  }),

  /**
   * Skapa container style från design tokens  
   */
  createContainerStyle: (variant: 'card' | 'input' | 'button' = 'card') => {
    switch (variant) {
      case 'card':
        return ComponentVariants.card.default;
      case 'input':
        return ComponentVariants.input.default;
      case 'button':
        return ComponentVariants.button.primary;
      default:
        return ComponentVariants.card.default;
    }
  },

  /**
   * Skapa spacing array för margins/padding
   */
  createSpacing: (...values: Array<keyof typeof DesignTokens.spacing>) => 
    values.map(key => DesignTokens.spacing[key]),
};

// =============================================================================
// FIGMA DESIGN SYSTEM EXPORT
// =============================================================================

export default {
  tokens: DesignTokens,
  variants: ComponentVariants,
  layout: Layout,
  factory: FigmaComponentFactory,
};