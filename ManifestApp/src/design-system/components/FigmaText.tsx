/**
 * 📐 FIGMA TEXT COMPONENT
 * 
 * Pixel-perfect typography following Figma design system principles
 */

import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { DesignTokens, FigmaComponentFactory } from '../FigmaDesignSystem';

interface FigmaTextProps extends TextProps {
  variant?: keyof typeof DesignTokens.typography;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

export const FigmaText: React.FC<FigmaTextProps> = ({
  variant = 'body1',
  color,
  align = 'left',
  style,
  children,
  ...textProps
}) => {
  
  // Build text style
  const textStyle: TextStyle = {
    ...FigmaComponentFactory.createTextStyle(variant, color),
    textAlign: align,
    ...(style || {}),
  };

  return (
    <Text style={textStyle} {...textProps}>
      {children}
    </Text>
  );
};

// Convenience components för common variants
export const FigmaHeading1: React.FC<Omit<FigmaTextProps, 'variant'>> = (props) => (
  <FigmaText variant="headline1" {...props} />
);

export const FigmaHeading2: React.FC<Omit<FigmaTextProps, 'variant'>> = (props) => (
  <FigmaText variant="headline2" {...props} />
);

export const FigmaHeading3: React.FC<Omit<FigmaTextProps, 'variant'>> = (props) => (
  <FigmaText variant="headline3" {...props} />
);

export const FigmaBody: React.FC<Omit<FigmaTextProps, 'variant'>> = (props) => (
  <FigmaText variant="body1" {...props} />
);

export const FigmaCaption: React.FC<Omit<FigmaTextProps, 'variant'>> = (props) => (
  <FigmaText variant="caption" {...props} />
);

export default FigmaText;