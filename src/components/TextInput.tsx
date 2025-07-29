import React from 'react';
import { TextInput as RNTextInput, StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { Theme } from '../utils/theme';

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  theme: Theme;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  error?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines = 1,
  theme,
  style,
  inputStyle,
  error,
  disabled = false,
}) => {
  const inputStyles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontSize: theme.fonts.body,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      borderWidth: 2,
      borderColor: error ? theme.colors.error : theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: theme.fonts.body,
      color: theme.colors.text,
      backgroundColor: disabled ? theme.colors.border : theme.colors.background,
      minHeight: multiline ? 120 : 50,
      textAlignVertical: multiline ? 'top' : 'center',
    },
    error: {
      fontSize: theme.fonts.caption,
      color: theme.colors.error,
      marginTop: theme.spacing.xs,
    },
  });

  return (
    <View style={[inputStyles.container, style]}>
      {label && (
        <Text style={inputStyles.label}>{label}</Text>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={[inputStyles.input, inputStyle]}
        editable={!disabled}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {error && (
        <Text style={inputStyles.error}>{error}</Text>
      )}
    </View>
  );
};