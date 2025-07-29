import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, BibleVerse, JournalEntry } from '../types';
import { Button, Card, Typography, TextInput } from '../components';
import { aiRecommendationService } from '../services/aiRecommendation';

interface ReflectionScreenProps {
  navigation: any;
  route: {
    params: {
      verseId: string;
      verse?: any; // BibleVerse passed directly
      entryId?: string;
    };
  };
}

const ReflectionScreen: React.FC<ReflectionScreenProps> = ({ navigation, route }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });

  const [reflection, setReflection] = useState('');
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [reflectionPrompts, setReflectionPrompts] = useState<string[]>([]);

  const theme = getTheme(preferences);
  const { verseId, verse: passedVerse, entryId } = route.params;

  useEffect(() => {
    loadUserPreferences();
    loadVerse();
    if (entryId) {
      loadEntry();
    }
  }, []);

  useEffect(() => {
    if (verse) {
      generateReflectionPrompts();
    }
  }, [verse, currentEntry]);

  const loadUserPreferences = async () => {
    try {
      await databaseService.init();
      const userPrefs = await databaseService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadVerse = () => {
    // If verse was passed directly (from recommendations), use it
    if (passedVerse) {
      setVerse(passedVerse);
      return;
    }

    // Otherwise, try to load from fallback data
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

    setVerse(sampleVerses[verseId] || null);
  };

  const loadEntry = async () => {
    if (!entryId) return;

    try {
      const entries = await databaseService.getJournalEntries();
      const entry = entries.find(e => e.id === entryId);
      setCurrentEntry(entry || null);
    } catch (error) {
      console.error('Failed to load entry:', error);
    }
  };

  const generateReflectionPrompts = () => {
    if (!verse) return;

    const prompts = aiRecommendationService.generateReflectionPrompts(verse, currentEntry || undefined);
    setReflectionPrompts(prompts);
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim()) return;

    try {
      // TODO: Save reflection to database
      // For now, we'll just show a success message
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save reflection:', error);
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
    verseCard: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.primary,
    },
    verseText: {
      color: '#FFFFFF',
      marginBottom: theme.spacing.md,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    verseReference: {
      color: '#FFFFFF',
      textAlign: 'center',
    },
    reflectionCard: {
      marginBottom: theme.spacing.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: theme.spacing.lg,
    },
    button: {
      flex: 1,
      marginHorizontal: theme.spacing.xs,
    },
    promptCard: {
      marginBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
    },
    promptText: {
      marginBottom: theme.spacing.sm,
    },
  });


  if (!verse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.scrollContainer, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
          <Typography variant="heading" theme={theme} align="center">
            Verse not found
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card theme={theme} style={styles.verseCard}>
          <Typography 
            variant="body" 
            theme={theme} 
            style={styles.verseText}
          >
            "{verse.text}"
          </Typography>
          <Typography 
            variant="body" 
            theme={theme} 
            weight="600"
            style={styles.verseReference}
          >
            {verse.book} {verse.chapter}:{verse.verse} ({verse.translation})
          </Typography>
        </Card>

        <Card theme={theme} style={styles.promptCard}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            Reflection Prompts
          </Typography>
          
          {currentEntry && (
            <Typography 
              variant="body" 
              theme={theme} 
              color={theme.colors.textSecondary}
              style={{ marginBottom: theme.spacing.md, fontStyle: 'italic' }}
            >
              These prompts are personalized based on your journal entry "{currentEntry.title}"
            </Typography>
          )}
          
          {reflectionPrompts.map((prompt, index) => (
            <Typography 
              key={index}
              variant="body" 
              theme={theme} 
              style={styles.promptText}
            >
              • {prompt}
            </Typography>
          ))}
        </Card>

        <Card theme={theme} style={styles.reflectionCard}>
          <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            Your Reflection
          </Typography>
          
          <TextInput
            label="Write your thoughts about this verse"
            value={reflection}
            onChangeText={setReflection}
            placeholder="Take a moment to reflect on this verse. What is God speaking to your heart?"
            multiline
            numberOfLines={10}
            theme={theme}
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              theme={theme}
              variant="outline"
              style={styles.button}
            />
            <Button
              title="Save Reflection"
              onPress={handleSaveReflection}
              theme={theme}
              style={styles.button}
              disabled={!reflection.trim()}
            />
          </View>
        </Card>

        {entryId && (
          <Card theme={theme}>
            <Typography variant="heading" theme={theme} style={{ marginBottom: theme.spacing.md }}>
              Add to Journal Entry
            </Typography>
            <Typography 
              variant="body" 
              theme={theme} 
              color={theme.colors.textSecondary}
              style={{ marginBottom: theme.spacing.md }}
            >
              You can also add this verse and reflection to your current journal entry.
            </Typography>
            <Button
              title="Add to Entry"
              onPress={() => {
                // TODO: Add verse to journal entry
                navigation.goBack();
              }}
              theme={theme}
              variant="secondary"
            />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReflectionScreen;