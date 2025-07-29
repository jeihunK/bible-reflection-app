import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences } from '../types';
import { Button, Card, Typography } from '../components';

const SettingsScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });

  const theme = getTheme(preferences);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      await databaseService.init();
      const userPrefs = await databaseService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const updatePreference = async (key: keyof UserPreferences, value: any) => {
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await databaseService.updateUserPreferences({ [key]: value });
    } catch (error) {
      console.error('Failed to update preference:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    optionButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginHorizontal: theme.spacing.xs,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    selectedOption: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    optionText: {
      color: theme.colors.text,
    },
    selectedOptionText: {
      color: '#FFFFFF',
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    toggleButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.border,
    },
    toggleActive: {
      backgroundColor: theme.colors.primary,
    },
    toggleText: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    toggleActiveText: {
      color: '#FFFFFF',
    },
  });

  const fontSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'high-contrast', label: 'High Contrast' },
  ];

  const renderOption = (option: { value: string; label: string }, currentValue: string, onSelect: (value: any) => void) => {
    const isSelected = option.value === currentValue;
    return (
      <TouchableOpacity
        key={option.value}
        style={[styles.optionButton, isSelected && styles.selectedOption]}
        onPress={() => onSelect(option.value)}
      >
        <Typography
          variant="body"
          theme={theme}
          style={[styles.optionText, isSelected && styles.selectedOptionText]}
        >
          {option.label}
        </Typography>
      </TouchableOpacity>
    );
  };

  const renderToggle = (value: boolean, onToggle: (value: boolean) => void) => {
    return (
      <TouchableOpacity
        style={[styles.toggleButton, value && styles.toggleActive]}
        onPress={() => onToggle(!value)}
      >
        <Typography
          variant="body"
          theme={theme}
          style={[styles.toggleText, value && styles.toggleActiveText]}
        >
          {value ? 'On' : 'Off'}
        </Typography>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card theme={theme} style={styles.section}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            Display Settings
          </Typography>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="body" theme={theme} weight="600">
                Text Size
              </Typography>
              <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                Choose a comfortable reading size
              </Typography>
              <View style={styles.optionsContainer}>
                {fontSizeOptions.map(option => 
                  renderOption(option, preferences.fontSize, (value) => updatePreference('fontSize', value))
                )}
              </View>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="body" theme={theme} weight="600">
                Theme
              </Typography>
              <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                Choose your preferred appearance
              </Typography>
              <View style={styles.optionsContainer}>
                {themeOptions.map(option => 
                  renderOption(option, preferences.theme, (value) => updatePreference('theme', value))
                )}
              </View>
            </View>
          </View>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={{ flex: 1 }}>
              <Typography variant="body" theme={theme} weight="600">
                Simplified Mode
              </Typography>
              <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                Remove clutter for easier navigation
              </Typography>
            </View>
            {renderToggle(preferences.simplifiedMode, (value) => updatePreference('simplifiedMode', value))}
          </View>
        </Card>

        <Card theme={theme} style={styles.section}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            Input Settings
          </Typography>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={{ flex: 1 }}>
              <Typography variant="body" theme={theme} weight="600">
                Voice Input
              </Typography>
              <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                Enable voice-to-text for journal entries
              </Typography>
            </View>
            {renderToggle(preferences.voiceInputEnabled, (value) => updatePreference('voiceInputEnabled', value))}
          </View>
        </Card>

        <Card theme={theme} style={styles.section}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            Notifications
          </Typography>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={{ flex: 1 }}>
              <Typography variant="body" theme={theme} weight="600">
                Daily Reminder
              </Typography>
              <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                Get reminded to write in your journal
              </Typography>
            </View>
            <Button
              title="Set Time"
              onPress={() => Alert.alert('Coming Soon', 'Daily reminders will be available in a future update')}
              theme={theme}
              variant="outline"
              size="small"
            />
          </View>
        </Card>

        <Card theme={theme} style={styles.section}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            About
          </Typography>

          <View style={styles.settingRow}>
            <Typography variant="body" theme={theme}>
              Version
            </Typography>
            <Typography variant="body" theme={theme} color={theme.colors.textSecondary}>
              1.0.0
            </Typography>
          </View>

          <View style={styles.settingRow}>
            <Typography variant="body" theme={theme}>
              Support
            </Typography>
            <Button
              title="Help"
              onPress={() => Alert.alert('Help', 'Contact support at support@biblereflection.app')}
              theme={theme}
              variant="outline"
              size="small"
            />
          </View>

          <View style={[styles.settingRow, styles.lastRow]}>
            <Typography variant="body" theme={theme}>
              Privacy Policy
            </Typography>
            <Button
              title="View"
              onPress={() => Alert.alert('Privacy Policy', 'Your data is stored locally on your device and never shared.')}
              theme={theme}
              variant="outline"
              size="small"
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;