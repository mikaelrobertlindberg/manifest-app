/**
 * 📐 FIGMA CARD COMPONENT
 * 
 * Pixel-perfect card following Figma design system principles
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { DesignTokens, ComponentVariants } from '../FigmaDesignSystem';

interface FigmaCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: keyof typeof DesignTokens.spacing;
  margin?: keyof typeof DesignTokens.spacing;
  style?: ViewStyle;
}

export const FigmaCard: React.FC<FigmaCardProps> = ({
  children,
  variant = 'default',
  padding,
  margin,
  style,
}) => {
  
  // Get base variant styles
  const variantStyle = ComponentVariants.card[variant];
  
  // Build card style
  const cardStyle: ViewStyle = {
    // Base card structure
    ...variantStyle,
    
    // Override padding if specified
    ...(padding && { padding: DesignTokens.spacing[padding] }),
    
    // Add margin if specified
    ...(margin && { margin: DesignTokens.spacing[margin] }),
    
    // Custom style override
    ...style,
  };

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

export default FigmaCard;