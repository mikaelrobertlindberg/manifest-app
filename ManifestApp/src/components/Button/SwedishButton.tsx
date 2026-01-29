import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SwedishForestTheme, Theme } from '../../theme/SwedishForestTheme';

interface SwedishButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  theme?: Theme;
}

export const SwedishButton: React.FC<SwedishButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  theme = SwedishForestTheme,
}) => {
  const styles = createStyles(theme);
  
  const getButtonStyle = () => {
    const base = [styles.button, styles[size]];
    
    switch (variant) {
      case 'primary':
        return [...base, styles.primary];
      case 'secondary':
        return [...base, styles.secondary];
      case 'text':
        return [...base, styles.textButton];
      default:
        return [...base, styles.primary];
    }
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'text':
        return styles.textButtonText;
      default:
        return styles.primaryText;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        (disabled || loading) && styles.disabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? theme.colors.text.inverse : theme.colors.primary} 
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), (disabled || loading) && styles.disabledText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.button,
  },
  
  // Storleksvarianter
  small: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  
  // Stilvarianter
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  
  // Textstilar
  primaryText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: '500',
    color: theme.colors.text.inverse,
  },
  secondaryText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: '500',
    color: theme.colors.text.inverse,
  },
  textButtonText: {
    fontSize: theme.typography.fontSize.body,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  
  // Tillståndsstilar
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.text.disabled,
  },
});