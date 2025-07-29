import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { Theme } from '../utils/theme';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'title' | 'heading' | 'body' | 'caption';
  color?: string;
  theme: Theme;
  style?: TextStyle;
  weight?: 'normal' | 'bold' | '600';
  align?: 'left' | 'center' | 'right';
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color,
  theme,
  style,
  weight = 'normal',
  align = 'left',
}) => {
  const typographyStyles = StyleSheet.create({
    base: {
      color: color || theme.colors.text,
      textAlign: align,
    },
    title: {
      fontSize: theme.fonts.title,
      fontWeight: 'bold',
      lineHeight: theme.fonts.title * 1.2,
    },
    heading: {
      fontSize: theme.fonts.heading,
      fontWeight: '600',
      lineHeight: theme.fonts.heading * 1.3,
    },
    body: {
      fontSize: theme.fonts.body,
      lineHeight: theme.fonts.body * 1.5,
    },
    caption: {
      fontSize: theme.fonts.caption,
      lineHeight: theme.fonts.caption * 1.4,
    },
    normal: {
      fontWeight: 'normal',
    },
    bold: {
      fontWeight: 'bold',
    },
    semiBold: {
      fontWeight: '600',
    },
  });

  const weightStyle = weight === 'bold' ? typographyStyles.bold 
    : weight === '600' ? typographyStyles.semiBold 
    : typographyStyles.normal;

  return (
    <Text 
      style={[
        typographyStyles.base,
        typographyStyles[variant],
        weightStyle,
        style,
      ]}
    >
      {children}
    </Text>
  );
};