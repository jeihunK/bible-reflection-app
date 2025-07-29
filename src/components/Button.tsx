import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  theme: Theme;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  theme,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const getButtonHeight = () => {
    switch (size) {
      case 'large': return 56;
      case 'medium': return 48;
      case 'small': return 40;
      default: return 48;
    }
  };

  const buttonStyles = StyleSheet.create({
    container: {
      width: fullWidth ? '100%' : 'auto',
    },
    button: {
      height: getButtonHeight(),
      paddingHorizontal: size === 'large' ? theme.spacing.xl : size === 'medium' ? theme.spacing.lg : theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      ...theme.shadows.md,
    },
    primary: {
      backgroundColor: disabled ? theme.colors.border : theme.colors.primary,
    },
    secondary: {
      backgroundColor: disabled ? theme.colors.border : theme.colors.secondary,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: disabled ? theme.colors.border : theme.colors.primary,
      ...theme.shadows.none,
    },
    ghost: {
      backgroundColor: disabled ? 'transparent' : theme.colors.primaryLight,
      ...theme.shadows.none,
    },
    gradient: {
      backgroundColor: 'transparent',
      ...theme.shadows.primary,
    },
    gradientBackground: {
      flex: 1,
      borderRadius: theme.borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    text: {
      fontSize: theme.fonts.button,
      fontWeight: '600',
      textAlign: 'center',
    },
    primaryText: {
      color: disabled ? theme.colors.textSecondary : '#FFFFFF',
    },
    secondaryText: {
      color: disabled ? theme.colors.textSecondary : '#FFFFFF',
    },
    outlineText: {
      color: disabled ? theme.colors.textSecondary : theme.colors.primary,
    },
    ghostText: {
      color: disabled ? theme.colors.textSecondary : theme.colors.primary,
    },
    gradientText: {
      color: disabled ? theme.colors.textSecondary : '#FFFFFF',
    },
    iconContainer: {
      marginRight: icon ? theme.spacing.sm : 0,
    },
  });

  const renderContent = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && <View style={buttonStyles.iconContainer}>{icon}</View>}
      <Text
        style={[
          buttonStyles.text,
          buttonStyles[`${variant}Text` as keyof typeof buttonStyles],
          textStyle,
        ]}
      >
        {title}
      </Text>
    </View>
  );

  if (variant === 'gradient' && !disabled) {
    return (
      <View style={[buttonStyles.container, style]}>
        <TouchableOpacity
          style={[buttonStyles.button, buttonStyles.gradient]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={theme.colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={buttonStyles.gradientBackground}
          >
            {renderContent()}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[buttonStyles.container, style]}>
      <TouchableOpacity
        style={[
          buttonStyles.button,
          buttonStyles[variant],
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    </View>
  );
};