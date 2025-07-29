import { UserPreferences } from '../types';

export const colors = {
  light: {
    primary: '#667EEA',
    primaryLight: '#F0F3FF',
    primaryDark: '#4C63D2',
    secondary: '#764BA2',
    secondaryLight: '#F5F0FF',
    background: '#FFFFFF',
    backgroundSecondary: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#1A202C',
    textSecondary: '#4A5568',
    textTertiary: '#718096',
    border: '#E2E8F0',
    borderLight: '#F7FAFC',
    success: '#38A169',
    successLight: '#F0FDF4',
    warning: '#DD6B20',
    warningLight: '#FFFBF0',
    error: '#E53E3E',
    errorLight: '#FED7D7',
    accent: '#38B2AC',
    accentLight: '#E6FFFA',
    // Modern gradients
    gradientPrimary: ['#667EEA', '#764BA2'],
    gradientSecondary: ['#F093FB', '#F5576C'],
    gradientSuccess: ['#4FACFE', '#00F2FE'],
    gradientWarning: ['#FDBB2D', '#22C1C3'],
  },
  dark: {
    primary: '#7C3AED',
    primaryLight: '#1E1B4B',
    primaryDark: '#5B21B6',
    secondary: '#8B5CF6',
    secondaryLight: '#312E81',
    background: '#0F0F23',
    backgroundSecondary: '#1A1B23',
    surface: '#1F2937',
    surfaceElevated: '#374151',
    text: '#F7FAFC',
    textSecondary: '#CBD5E0',
    textTertiary: '#A0AEC0',
    border: '#4A5568',
    borderLight: '#2D3748',
    success: '#48BB78',
    successLight: '#1A202C',
    warning: '#ED8936',
    warningLight: '#1A202C',
    error: '#F56565',
    errorLight: '#1A202C',
    accent: '#4FD1C7',
    accentLight: '#1A202C',
    // Modern gradients for dark mode
    gradientPrimary: ['#7C3AED', '#8B5CF6'],
    gradientSecondary: ['#EC4899', '#EF4444'],
    gradientSuccess: ['#059669', '#0891B2'],
    gradientWarning: ['#D97706', '#DC2626'],
  },
  'high-contrast': {
    primary: '#000000',
    primaryLight: '#F5F5F5',
    primaryDark: '#000000',
    secondary: '#333333',
    secondaryLight: '#F0F0F0',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    text: '#000000',
    textSecondary: '#333333',
    textTertiary: '#666666',
    border: '#000000',
    borderLight: '#CCCCCC',
    success: '#006600',
    successLight: '#F0FFF0',
    warning: '#CC6600',
    warningLight: '#FFF8F0',
    error: '#CC0000',
    errorLight: '#FFF0F0',
    accent: '#0066CC',
    accentLight: '#F0F8FF',
    // High contrast gradients
    gradientPrimary: ['#000000', '#333333'],
    gradientSecondary: ['#333333', '#666666'],
    gradientSuccess: ['#006600', '#009900'],
    gradientWarning: ['#CC6600', '#FF9900'],
  }
};

export const fontSizes = {
  'small': {
    title: 24,
    heading: 20,
    body: 16,
    caption: 14,
    button: 18,
  },
  'medium': {
    title: 28,
    heading: 24,
    body: 18,
    caption: 16,
    button: 20,
  },
  'large': {
    title: 32,
    heading: 28,
    body: 22,
    caption: 18,
    button: 24,
  },
  'extra-large': {
    title: 36,
    heading: 32,
    body: 26,
    caption: 22,
    button: 28,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  // Colored shadows for modern effect
  primary: {
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  secondary: {
    shadowColor: '#764BA2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
};

export const getTheme = (preferences: UserPreferences) => {
  return {
    colors: colors[preferences.theme],
    fonts: fontSizes[preferences.fontSize],
    spacing,
    borderRadius,
    shadows,
  };
};

export type Theme = ReturnType<typeof getTheme>;