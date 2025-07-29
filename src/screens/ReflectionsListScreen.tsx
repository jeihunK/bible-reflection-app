import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, Reflection, BibleVerse } from '../types';
import { Button, Card, Typography } from '../components';

const ReflectionsListScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [verses, setVerses] = useState<{ [key: string]: BibleVerse }>({});
  const [loading, setLoading] = useState(true);

  const theme = getTheme(preferences);

  useEffect(() => {
    loadUserPreferences();
    loadReflections();
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

  const loadReflections = async () => {
    try {
      await databaseService.init();
      const reflectionsList = await databaseService.getReflections();
      setReflections(reflectionsList);
      
      // Load verse data for each reflection
      await loadVerseData(reflectionsList);
    } catch (error) {
      console.error('Failed to load reflections:', error);
      Alert.alert('Error', 'Failed to load reflections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadVerseData = async (reflectionsList: Reflection[]) => {
    // Sample verses data (same as in ReflectionScreen)
    const sampleVerses: { [key: string]: BibleVerse } = {
      'jer29-11': {
        id: 'jer29-11',
        book: 'Jeremiah',
        chapter: 29,
        verse: 11,
        text: "For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.",
        translation: 'NIV'
      },
      'prov3-5-6': {
        id: 'prov3-5-6',
        book: 'Proverbs',
        chapter: 3,
        verse: 5,
        text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
        translation: 'NIV'
      },
      'rom8-28': {
        id: 'rom8-28',
        book: 'Romans',
        chapter: 8,
        verse: 28,
        text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
        translation: 'NIV'
      },
      'ps23-1-3': {
        id: 'ps23-1-3',
        book: 'Psalm',
        chapter: 23,
        verse: 1,
        text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
        translation: 'NIV'
      }
    };

    const versesData: { [key: string]: BibleVerse } = {};
    
    reflectionsList.forEach(reflection => {
      if (sampleVerses[reflection.verseId]) {
        versesData[reflection.verseId] = sampleVerses[reflection.verseId];
      }
    });

    setVerses(versesData);
  };

  const handleDeleteReflection = async (id: string) => {
    Alert.alert(
      'Delete Reflection',
      'Are you sure you want to delete this reflection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databaseService.init(); // Ensure database is initialized
              await databaseService.deleteReflection(id);
              setReflections(prev => prev.filter(r => r.id !== id));
              Alert.alert('Success', 'Reflection deleted successfully.');
            } catch (error) {
              console.error('Failed to delete reflection:', error);
              Alert.alert('Error', 'Failed to delete reflection. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      padding: theme.spacing.md,
    },
    reflectionCard: {
      marginBottom: theme.spacing.md,
    },
    reflectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    reflectionContent: {
      marginVertical: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
    },
    reflectionText: {
      lineHeight: 22,
    },
    dateText: {
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
    },
    verseReference: {
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
      textAlign: 'right',
    },
    verseContainer: {
      backgroundColor: theme.colors.primary,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.md,
    },
    verseText: {
      color: '#FFFFFF',
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.emptyContainer]}>
          <Typography variant="body" theme={theme}>
            Loading reflections...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (reflections.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Typography variant="heading" theme={theme} style={styles.emptyText}>
            No Reflections Yet
          </Typography>
          <Typography variant="body" theme={theme} color={theme.colors.textSecondary} style={styles.emptyText}>
            Start reflecting on Bible verses to see them here.
          </Typography>
          <Button
            title="Browse Bible Verses"
            onPress={() => navigation.navigate('BibleSearch')}
            theme={theme}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {reflections.map((reflection) => {
          const verse = verses[reflection.verseId];
          
          return (
            <Card key={reflection.id} theme={theme} style={styles.reflectionCard}>
              <View style={styles.reflectionHeader}>
                <View style={{ flex: 1 }}>
                  <Typography variant="caption" theme={theme} color={theme.colors.textSecondary} style={styles.dateText}>
                    {formatDate(reflection.createdAt)}
                  </Typography>
                </View>
                <Button
                  title="Delete"
                  onPress={() => handleDeleteReflection(reflection.id)}
                  theme={theme}
                  variant="outline"
                  size="small"
                />
              </View>

              {verse && (
                <View style={styles.verseContainer}>
                  <Typography variant="body" theme={theme} style={styles.verseText}>
                    "{verse.text}"
                  </Typography>
                  <Typography variant="caption" theme={theme} style={[styles.verseReference, { color: '#FFFFFF' }]}>
                    {verse.book} {verse.chapter}:{verse.verse} ({verse.translation})
                  </Typography>
                </View>
              )}
              
              <View style={styles.reflectionContent}>
                <Typography variant="subheading" theme={theme} style={{ marginBottom: theme.spacing.sm }}>
                  My Reflection:
                </Typography>
                <Typography variant="body" theme={theme} style={styles.reflectionText}>
                  {reflection.content}
                </Typography>
              </View>
              
              {reflection.entryId && (
                <Typography variant="caption" theme={theme} color={theme.colors.textSecondary}>
                  Associated with journal entry: {reflection.entryId}
                </Typography>
              )}
            </Card>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReflectionsListScreen;