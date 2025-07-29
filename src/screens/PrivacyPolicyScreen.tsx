import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { getTheme } from '../utils/theme';
import { Typography } from '../components';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  const theme = getTheme({ theme: 'light' });

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
    sectionTitle: {
      marginBottom: theme.spacing.sm,
    },
    paragraph: {
      marginBottom: theme.spacing.md,
      lineHeight: 24,
    },
    bulletPoint: {
      marginLeft: theme.spacing.md,
      marginBottom: theme.spacing.xs,
    },
    highlight: {
      backgroundColor: theme.colors.primaryLight,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        
        <View style={styles.section}>
          <Typography variant="heading" theme={theme} style={styles.sectionTitle}>
            Privacy Policy Summary
          </Typography>
          <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
            Last Updated: January 29, 2025
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            What We Collect
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Your Journal Entries:</Typography> Stored securely on your device
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">App Preferences:</Typography> Settings, themes, and notification choices
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Usage Data:</Typography> How you use the app to improve our service
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            How We Use Your Data
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Personal Use:</Typography> Store and sync your spiritual reflections
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Bible Recommendations:</Typography> AI suggests relevant verses based on your entries
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">App Improvement:</Typography> Anonymous usage data helps us enhance features
          </Typography>
        </View>

        <View style={styles.highlight}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Your Privacy Rights
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Full Control:</Typography> View, export, or delete your data anytime
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Offline Mode:</Typography> Use the app completely offline if preferred
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">No Selling:</Typography> We never sell your personal information
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Data Security
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Local Storage:</Typography> Your entries are stored securely on your device
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Encryption:</Typography> All personal data is encrypted for protection
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Optional Cloud Sync:</Typography> You choose whether to enable backup
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Third-Party Services
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Bible APIs:</Typography> For scripture content
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">AI Services:</Typography> For verse recommendations
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Analytics:</Typography> Anonymous data only, can be disabled
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Your Choices
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Data Export:</Typography> Download your journal entries anytime
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Account Deletion:</Typography> Permanently remove all your data
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Privacy Settings:</Typography> Control what data is shared and synced
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Age Requirement
          </Typography>
          <Typography variant="body" theme={theme} style={styles.paragraph}>
            Bible Reflection is for users 13 years and older.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Contact Us
          </Typography>
          <Typography variant="body" theme={theme} style={styles.paragraph}>
            Questions about privacy? Email: privacy@biblereflectionapp.com
          </Typography>
        </View>

        <View style={styles.highlight}>
          <Typography variant="body" theme={theme} style={styles.paragraph} weight="600">
            Your spiritual journey is personal. We're committed to keeping it private and secure.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
            This is a simplified version of our Privacy Policy. For complete legal details, please visit our website or contact us directly.
          </Typography>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicyScreen;