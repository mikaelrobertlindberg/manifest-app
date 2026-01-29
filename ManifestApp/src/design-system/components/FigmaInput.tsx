/**
 * 📐 FIGMA INPUT COMPONENT
 * 
 * Pixel-perfect input field following Figma design system principles
 */

import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';
import { DesignTokens, ComponentVariants, FigmaComponentFactory } from '../FigmaDesignSystem';

interface FigmaInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helpText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const FigmaInput: React.FC<FigmaInputProps> = ({
  label,
  error,
  helpText,
  disabled = false,
  fullWidth = true,
  style,
  inputStyle,
  onFocus,
  onBlur,
  ...inputProps
}) => {
  
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };
  
  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };
  
  // Build container style
  const containerStyle: ViewStyle = {
    ...(fullWidth && { width: '100%' }),
    ...style,
  };
  
  // Build input style based on state
  const getInputStyle = (): ViewStyle => {
    let baseStyle: ViewStyle = { ...ComponentVariants.input.default };
    
    if (isFocused) {
      baseStyle = { ...baseStyle, ...ComponentVariants.input.focused };
    }
    
    if (error) {
      baseStyle = { ...baseStyle, ...ComponentVariants.input.error };
    }
    
    if (disabled) {
      baseStyle = { ...baseStyle, opacity: 0.6 };
    }
    
    return baseStyle;
  };
  
  const labelStyle = FigmaComponentFactory.createTextStyle('body2', DesignTokens.colors.gray[700]);
  const errorStyle = FigmaComponentFactory.createTextStyle('caption', DesignTokens.colors.error);
  const helpStyle = FigmaComponentFactory.createTextStyle('caption', DesignTokens.colors.gray[600]);

  return (
    <View style={containerStyle}>
      {/* Label */}
      {label && (
        <Text style={[labelStyle, styles.label]}>
          {label}
        </Text>
      )}
      
      {/* Input Field */}
      <TextInput
        style={[
          getInputStyle(),
          FigmaComponentFactory.createTextStyle('body1'),
          inputStyle,
        ]}
        editable={!disabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={DesignTokens.colors.gray[500]}
        selectionColor={DesignTokens.colors.primary[500]}
        {...inputProps}
      />
      
      {/* Error Message */}
      {error && (
        <Text style={[errorStyle, styles.errorText]}>
          {error}
        </Text>
      )}
      
      {/* Help Text */}
      {helpText && !error && (
        <Text style={[helpStyle, styles.helpText]}>
          {helpText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: DesignTokens.spacing.xs,
  },
  errorText: {
    marginTop: DesignTokens.spacing.xs,
  },
  helpText: {
    marginTop: DesignTokens.spacing.xs,
  },
});

export default FigmaInput;