import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { getTheme } from '../utils/theme';
import { Typography } from '../components';

const TermsOfServiceScreen = ({ navigation }: any) => {
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
            Terms of Service Summary
          </Typography>
          <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
            Last Updated: January 29, 2025
          </Typography>
        </View>

        <View style={styles.highlight}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Welcome to Bible Reflection
          </Typography>
          <Typography variant="body" theme={theme} style={styles.paragraph}>
            By using our app, you agree to these terms. We've made them as simple as possible.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            What You Can Do
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Journal Freely:</Typography> Write personal reflections and spiritual thoughts
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Get Bible Recommendations:</Typography> Receive AI-suggested verses for your entries
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Sync Your Data:</Typography> Optional cloud backup to access across devices
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Share Inspiration:</Typography> Share encouraging content where features allow
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            What You Can't Do
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Harmful Content:</Typography> No offensive, illegal, or inappropriate material
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Respect Others:</Typography> No harassment, discrimination, or spam
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Stay Secure:</Typography> Don't try to hack or damage our systems
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Commercial Use:</Typography> Personal use only (no business purposes)
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Your Content
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">You Own It:</Typography> Your journal entries and reflections belong to you
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">You Control It:</Typography> Export, delete, or modify your content anytime
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Keep It Appropriate:</Typography> Make sure your content follows our guidelines
          </Typography>
        </View>

        <View style={styles.highlight}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Important Disclaimers
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Personal Tool:</Typography> This app is for journaling, not professional spiritual counseling
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">AI Suggestions:</Typography> Verse recommendations are algorithmic, not divine guidance
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Consult Leaders:</Typography> For important spiritual decisions, talk to qualified religious advisors
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Backup Important Data:</Typography> We're not responsible for data loss
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Our Service
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Free to Use:</Typography> Bible Reflection is currently free
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Always Improving:</Typography> We regularly update features and fix issues
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">May Change:</Typography> Features may be added, modified, or removed
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Not Perfect:</Typography> We do our best but can't guarantee 100% uptime
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Age Requirement
          </Typography>
          <Typography variant="body" theme={theme} style={styles.paragraph}>
            You must be 13 or older to use Bible Reflection.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Problems or Questions?
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Support:</Typography> Contact support@biblereflectionapp.com
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Legal Issues:</Typography> Email legal@biblereflectionapp.com
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • <Typography variant="body" theme={theme} weight="600">Response Time:</Typography> We aim to reply within 48-72 hours
          </Typography>
        </View>

        <View style={styles.highlight}>
          <Typography variant="subheading" theme={theme} style={styles.sectionTitle}>
            Bottom Line
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • Use the app respectfully and legally
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • Your spiritual content remains private and yours
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • We're here to support your faith journey, not replace spiritual guidance
          </Typography>
          <Typography variant="body" theme={theme} style={styles.bulletPoint}>
            • Be kind, be authentic, be encouraged
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="body" theme={theme} style={styles.paragraph} weight="600">
            Bible Reflection is designed to support your spiritual growth in a safe, private environment.
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
            This is a simplified version of our Terms of Service. For complete legal details, please visit our website or contact us directly.
          </Typography>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;