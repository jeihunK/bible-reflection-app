import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, JournalEntry } from '../types';
import { Button, Card, Typography } from '../components';

const JournalScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const theme = getTheme(preferences);

  useEffect(() => {
    loadUserPreferences();
    loadEntries();
    
    // Refresh entries when screen is focused
    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });

    return unsubscribe;
  }, [navigation]);

  const loadUserPreferences = async () => {
    try {
      await databaseService.init();
      const userPrefs = await databaseService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadEntries = async () => {
    try {
      const journalEntries = await databaseService.getJournalEntries();
      setEntries(journalEntries);
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await databaseService.deleteJournalEntry(entryId);
      loadEntries(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete entry:', error);
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    addButton: {
      marginBottom: theme.spacing.xl,
    },
    journalHeader: {
      marginBottom: theme.spacing.xl,
    },
    entryCard: {
      marginBottom: theme.spacing.lg,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    entryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    entryDate: {
      marginBottom: theme.spacing.xs,
    },
    entryTitle: {
      marginBottom: theme.spacing.sm,
      flex: 1,
    },
    entryContent: {
      marginBottom: theme.spacing.md,
      backgroundColor: 'rgba(103, 126, 234, 0.03)',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    moodContainer: {
      backgroundColor: theme.colors.surfaceElevated,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    entryActions: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    actionButton: {
      flex: 1,
    },
    deleteButton: {
      backgroundColor: theme.colors.error,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl * 2,
    },
    emptyCard: {
      alignItems: 'center',
      padding: theme.spacing.xxl,
    },
    emptyText: {
      marginBottom: theme.spacing.lg,
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <Button
            title="📝 Create First Entry"
            onPress={() => navigation.navigate('NewEntry')}
            theme={theme}
            variant="gradient"
            size="large"
            fullWidth
            style={styles.addButton}
          />
          
          <Card theme={theme} variant="elevated" style={styles.emptyCard}>
            <Typography 
              variant="title" 
              theme={theme} 
              align="center"
              style={styles.emptyText}
            >
              📖 No journal entries yet
            </Typography>
            <Typography 
              variant="body" 
              theme={theme} 
              align="center" 
              color={theme.colors.textSecondary}
              style={styles.emptyText}
            >
              Start your spiritual journey by writing your first journal entry and discovering God's word through reflection
            </Typography>
            <Button
              title="✨ Write Your First Entry"
              onPress={() => navigation.navigate('NewEntry')}
              theme={theme}
              variant="primary"
              size="large"
              fullWidth
            />
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Button
          title="📝 New Journal Entry"
          onPress={() => navigation.navigate('NewEntry')}
          theme={theme}
          variant="gradient"
          size="large"
          fullWidth
          style={styles.addButton}
        />

        <Typography 
          variant="title" 
          theme={theme} 
          style={styles.journalHeader}
        >
          📋 My Journal ({entries.length} entries)
        </Typography>

        {entries.map((entry) => (
          <Card key={entry.id} theme={theme} variant="elevated" style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryTitle}>
                <Typography 
                  variant="caption" 
                  theme={theme} 
                  color={theme.colors.textSecondary}
                  style={styles.entryDate}
                >
                  {formatDate(entry.date)}
                </Typography>
                <Typography variant="heading" theme={theme}>
                  {entry.title}
                </Typography>
              </View>
            </View>
            
            <View style={styles.entryContent}>
              <Typography 
                variant="body" 
                theme={theme}
              >
                {truncateText(entry.content, 200)}
              </Typography>
            </View>

            {entry.mood && (
              <View style={styles.moodContainer}>
                <Typography 
                  variant="caption" 
                  theme={theme} 
                  color={theme.colors.primary}
                  weight="600"
                >
                  😌 {entry.mood}
                </Typography>
              </View>
            )}

            <View style={styles.entryActions}>
              <Button
                title="📜 Read & Edit"
                onPress={() => navigation.navigate('NewEntry', { entryId: entry.id })}
                theme={theme}
                variant="primary"
                size="medium"
                style={styles.actionButton}
              />
              <Button
                title="🗑️ Delete"
                onPress={() => handleDeleteEntry(entry.id)}
                theme={theme}
                variant="ghost"
                size="medium"
                style={styles.actionButton}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default JournalScreen;