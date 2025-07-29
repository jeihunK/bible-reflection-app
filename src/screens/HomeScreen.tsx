import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, JournalEntry, BibleVerse } from '../types';
import { Button, Card, Typography } from '../components';
import { bibleApiService } from '../services/bibleApi';

const HomeScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);

  const theme = getTheme(preferences);

  useEffect(() => {
    loadUserPreferences();
    loadRecentEntries();
    loadDailyVerse();
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

  const loadRecentEntries = async () => {
    try {
      const entries = await databaseService.getJournalEntries();
      setRecentEntries(entries.slice(0, 3)); // Get last 3 entries
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const loadDailyVerse = async () => {
    try {
      const verse = await bibleApiService.getDailyVerse();
      setDailyVerse(verse);
    } catch (error) {
      console.error('Failed to load daily verse:', error);
      // Set a fallback verse if API fails
      setDailyVerse({
        id: 'fallback',
        book: 'Psalm',
        chapter: 118,
        verse: 24,
        text: 'This is the day that the Lord has made; let us rejoice and be glad in it.',
        translation: 'ESV'
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    welcomeCard: {
      marginBottom: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    actionButtonsContainer: {
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    dailyVerseCard: {
      marginBottom: theme.spacing.xl,
    },
    verseText: {
      fontStyle: 'italic',
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    verseReference: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    entryCard: {
      marginBottom: theme.spacing.md,
    },
    entryHeader: {
      marginBottom: theme.spacing.sm,
    },
    entryDate: {
      marginBottom: theme.spacing.xs,
    },
    entryTitle: {
      marginBottom: theme.spacing.sm,
    },
    entryContent: {
      marginBottom: theme.spacing.md,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <Card theme={theme} variant="elevated" style={styles.welcomeCard} gradient>
          <Typography variant="title" theme={theme} align="center" color="#FFFFFF">
            Welcome to Bible Reflection
          </Typography>
          <Typography 
            variant="body" 
            theme={theme} 
            align="center" 
            color="rgba(255, 255, 255, 0.9)"
            style={{ marginTop: theme.spacing.sm }}
          >
            Share your thoughts and find inspiration in God's word
          </Typography>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="New Journal Entry"
            onPress={() => navigation.navigate('NewEntry')}
            theme={theme}
            variant="gradient"
            size="large"
            fullWidth
          />
          <View style={styles.buttonRow}>
            <Button
              title="Browse Bible"
              onPress={() => navigation.navigate('BibleSearch')}
              theme={theme}
              variant="outline"
              size="medium"
              style={{ flex: 1 }}
            />
            <Button
              title="My Journal"
              onPress={() => navigation.navigate('Journal')}
              theme={theme}
              variant="ghost"
              size="medium"
              style={{ flex: 1 }}
            />
          </View>
        </View>

        {/* Daily Verse */}
        {dailyVerse && (
          <View style={styles.section}>
            <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
              ✨ Today's Verse
            </Typography>
            <Card theme={theme} variant="elevated" style={styles.dailyVerseCard}>
              <Typography 
                variant="body" 
                theme={theme} 
                style={styles.verseText}
              >
                "{dailyVerse.text}"
              </Typography>
              <Typography 
                variant="body" 
                theme={theme} 
                weight="600"
                color={theme.colors.primary}
                style={styles.verseReference}
              >
                {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
              </Typography>
              <Button
                title="Reflect on This Verse"
                onPress={() => navigation.navigate('Reflection', { 
                  verseId: dailyVerse.id, 
                  verse: dailyVerse 
                })}
                theme={theme}
                variant="primary"
                size="medium"
                fullWidth
              />
            </Card>
          </View>
        )}

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <View style={styles.section}>
            <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
              📖 Recent Entries
            </Typography>
            {recentEntries.map((entry) => (
              <Card key={entry.id} theme={theme} variant="outlined" style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Typography 
                    variant="caption" 
                    theme={theme} 
                    color={theme.colors.textTertiary}
                    style={styles.entryDate}
                  >
                    {formatDate(entry.date)}
                  </Typography>
                  <Typography variant="heading" theme={theme} style={styles.entryTitle}>
                    {entry.title}
                  </Typography>
                </View>
                <Typography 
                  variant="body" 
                  theme={theme} 
                  color={theme.colors.textSecondary}
                  style={styles.entryContent}
                >
                  {truncateText(entry.content, 120)}
                </Typography>
                <Button
                  title="Continue Reading"
                  onPress={() => navigation.navigate('NewEntry', { entryId: entry.id })}
                  theme={theme}
                  variant="ghost"
                  size="small"
                />
              </Card>
            ))}
            
            <Button
              title="View All Entries"
              onPress={() => navigation.navigate('Journal')}
              theme={theme}
              variant="outline"
              size="medium"
              fullWidth
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;