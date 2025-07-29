import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'elevated' | 'outlined' | 'gradient';
  gradient?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  theme,
  style,
  padding = 'md',
  variant = 'default',
  gradient = false,
}) => {
  const cardStyles = StyleSheet.create({
    card: {
      borderRadius: theme.borderRadius.xl,
      overflow: 'hidden',
    },
    default: {
      backgroundColor: theme.colors.surface,
      ...theme.shadows.sm,
    },
    elevated: {
      backgroundColor: theme.colors.surfaceElevated,
      ...theme.shadows.lg,
    },
    outlined: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.none,
    },
    gradient: {
      backgroundColor: 'transparent',
      ...theme.shadows.md,
    },
    contentContainer: {
      flex: 1,
    },
    paddingSmall: {
      padding: theme.spacing.md,
    },
    paddingMedium: {
      padding: theme.spacing.lg,
    },
    paddingLarge: {
      padding: theme.spacing.xl,
    },
    paddingExtraLarge: {
      padding: theme.spacing.xxl,
    },
  });

  const getPaddingStyle = () => {
    switch (padding) {
      case 'sm': return cardStyles.paddingSmall;
      case 'lg': return cardStyles.paddingLarge;
      case 'xl': return cardStyles.paddingExtraLarge;
      default: return cardStyles.paddingMedium;
    }
  };

  if (gradient) {
    return (
      <View style={[cardStyles.card, cardStyles.gradient, style]}>
        <LinearGradient
          colors={theme.colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[cardStyles.contentContainer, getPaddingStyle()]}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[cardStyles.card, cardStyles[variant], style]}>
      <View style={[cardStyles.contentContainer, getPaddingStyle()]}>
        {children}
      </View>
    </View>
  );
};