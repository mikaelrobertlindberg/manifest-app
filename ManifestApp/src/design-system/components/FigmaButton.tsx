/**
 * 📐 FIGMA BUTTON COMPONENT
 * 
 * Pixel-perfect button following Figma design system principles
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { DesignTokens, ComponentVariants, FigmaComponentFactory } from '../FigmaDesignSystem';

interface FigmaButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const FigmaButton: React.FC<FigmaButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
  textStyle,
}) => {
  
  // Get base variant styles
  const variantStyle = ComponentVariants.button[variant];
  
  // Size configurations
  const sizeConfig = {
    small: {
      height: 36,
      paddingHorizontal: DesignTokens.spacing.sm,
      fontSize: 14,
    },
    medium: {
      height: 44, // Standard touch target
      paddingHorizontal: DesignTokens.spacing.md,
      fontSize: 16,
    },
    large: {
      height: 52,
      paddingHorizontal: DesignTokens.spacing.lg,
      fontSize: 18,
    },
  };
  
  const currentSize = sizeConfig[size];
  
  // Build button style
  const buttonStyle: ViewStyle = {
    // Base button structure
    height: currentSize.height,
    paddingHorizontal: currentSize.paddingHorizontal,
    borderRadius: DesignTokens.radius.md, // Mjukare hörn för buttons
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    
    // Variant styling
    backgroundColor: variantStyle.backgroundColor,
    borderWidth: variantStyle.borderWidth || 0,
    ...(variantStyle.borderColor && { borderColor: variantStyle.borderColor }),
    
    // Full width option
    ...(fullWidth && { width: '100%' }),
    
    // Disabled state
    ...(disabled && {
      opacity: 0.6,
    }),
    
    // Custom style override
    ...style,
  };
  
  // Build text style
  const buttonTextStyle: TextStyle = {
    ...FigmaComponentFactory.createTextStyle('button'),
    fontSize: currentSize.fontSize,
    color: variantStyle.color,
    
    // Custom text style override
    ...textStyle,
  };
  
  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variantStyle.color}
          style={styles.loadingSpinner}
        />
      )}
      <Text style={buttonTextStyle} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingSpinner: {
    marginRight: DesignTokens.spacing.xs,
  },
});

export default FigmaButton;