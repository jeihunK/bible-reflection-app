import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, JournalEntry, VerseRecommendation } from '../types';
import { Button, Card, Typography, TextInput } from '../components';
import { aiRecommendationService } from '../services/aiRecommendation';

interface NewEntryScreenProps {
  navigation: any;
  route: {
    params?: {
      entryId?: string;
    };
  };
}

const NewEntryScreen: React.FC<NewEntryScreenProps> = ({ navigation, route }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const [recommendations, setRecommendations] = useState<VerseRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const theme = getTheme(preferences);
  const { entryId } = route.params || {};

  useEffect(() => {
    loadUserPreferences();
    if (entryId) {
      loadEntry(entryId);
      setIsEditing(true);
      setCurrentEntryId(entryId);
    }
  }, [entryId]);

  const loadUserPreferences = async () => {
    try {
      await databaseService.init();
      const userPrefs = await databaseService.getUserPreferences();
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const loadEntry = async (id: string) => {
    try {
      const entries = await databaseService.getJournalEntries();
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setTitle(entry.title);
        setContent(entry.content);
        setMood(entry.mood || '');
      }
    } catch (error) {
      console.error('Failed to load entry:', error);
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const analyzeEntry = async () => {
    if (!title.trim() && !content.trim()) {
      setRecommendations([]);
      return;
    }

    setIsAnalyzing(true);
    try {
      const tempEntry: JournalEntry = {
        id: 'temp',
        date: new Date().toISOString().split('T')[0],
        title: title.trim(),
        content: content.trim(),
        mood: mood.trim() || undefined,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const recs = await aiRecommendationService.getRecommendations(tempEntry);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to analyze entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && currentEntryId) {
        await databaseService.updateJournalEntry(currentEntryId, {
          title: title.trim(),
          content: content.trim(),
          mood: mood.trim() || undefined,
        });
        Alert.alert('Success', 'Entry updated successfully');
      } else {
        await databaseService.createJournalEntry({
          date: new Date().toISOString().split('T')[0],
          title: title.trim(),
          content: content.trim(),
          mood: mood.trim() || undefined,
          tags: [],
        });
        Alert.alert('Success', 'Entry saved successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    }
  };

  const handleCancel = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Writing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
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
    headerCard: {
      marginBottom: theme.spacing.xl,
    },
    entryCard: {
      marginBottom: theme.spacing.xl,
    },
    recommendationsCard: {
      marginBottom: theme.spacing.xl,
    },
    actionButtonsContainer: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.xl,
      marginHorizontal: -theme.spacing.lg, // Extend to screen edges
    },
    buttonRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    moodContainer: {
      marginBottom: theme.spacing.lg,
    },
    recommendationItem: {
      marginBottom: theme.spacing.md,
    },
    verseCard: {
      marginBottom: theme.spacing.md,
      backgroundColor: 'rgba(103, 126, 234, 0.05)',
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    verseText: {
      fontStyle: 'italic',
      marginBottom: theme.spacing.sm,
      fontSize: theme.fonts.body + 2,
      lineHeight: theme.fonts.body * 1.6,
    },
    verseReference: {
      marginBottom: theme.spacing.sm,
    },
    recommendationReason: {
      marginBottom: theme.spacing.md,
      backgroundColor: theme.colors.surfaceElevated,
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.lg,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card theme={theme} variant="elevated" style={styles.headerCard}>
          <Typography variant="title" theme={theme} style={{ marginBottom: theme.spacing.sm }}>
            {isEditing ? '✏️ Edit Entry' : '📝 New Journal Entry'}
          </Typography>
          
          {!isEditing && (
            <Typography 
              variant="body" 
              theme={theme} 
              color={theme.colors.textSecondary}
              style={{ marginBottom: theme.spacing.lg }}
            >
              {currentDate}
            </Typography>
          )}

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="What's on your heart today?"
            theme={theme}
            error={errors.title}
          />

          <TextInput
            label="Your Thoughts"
            value={content}
            onChangeText={setContent}
            placeholder="Share your thoughts, prayers, and reflections..."
            multiline
            numberOfLines={8}
            theme={theme}
            error={errors.content}
          />

          <View style={styles.moodContainer}>
            <TextInput
              label="Mood (Optional)"
              value={mood}
              onChangeText={setMood}
              placeholder="How are you feeling? (e.g., grateful, anxious, peaceful)"
              theme={theme}
            />
          </View>

          <View style={styles.actionButtonsContainer}>
            <Button
              title={isEditing ? 'Update Entry' : 'Save Entry'}
              onPress={handleSave}
              theme={theme}
              variant="gradient"
              size="large"
              fullWidth
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              theme={theme}
              variant="ghost"
              size="medium"
              fullWidth
            />
          </View>
        </Card>

        {/* AI-Powered Bible Verse Recommendations */}
        <Card theme={theme} variant="elevated" style={styles.recommendationsCard}>
          <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
            🌟 Suggested Bible Verses
          </Typography>
          
          {!recommendations.length && !isAnalyzing && (title.trim() || content.trim()) && (
            <View style={{ marginBottom: theme.spacing.md }}>
              <Typography 
                variant="body" 
                theme={theme} 
                color={theme.colors.textSecondary}
                style={{ marginBottom: theme.spacing.md }}
              >
                Get personalized Bible verse recommendations based on your journal entry
              </Typography>
              <Button
                title="✨ Get Verse Recommendations"
                onPress={analyzeEntry}
                theme={theme}
                variant="gradient"
                size="medium"
                fullWidth
              />
            </View>
          )}

          {isAnalyzing && (
            <Typography 
              variant="body" 
              theme={theme} 
              color={theme.colors.textSecondary}
              align="center"
            >
              Analyzing your entry and finding relevant verses...
            </Typography>
          )}

          {recommendations.length > 0 && (
            <View>
              <Typography 
                variant="body" 
                theme={theme} 
                color={theme.colors.textSecondary}
                style={{ marginBottom: theme.spacing.md }}
              >
                Based on your journal entry, here are some verses that might encourage you:
              </Typography>
              
              {recommendations.map((rec, index) => (
                <Card key={rec.verse.id} theme={theme} variant="outlined" style={styles.verseCard}>
                  <Typography 
                    variant="body" 
                    theme={theme} 
                    style={styles.verseText}
                  >
                    "{rec.verse.text}"
                  </Typography>
                  <Typography 
                    variant="body" 
                    theme={theme} 
                    weight="600"
                    color={theme.colors.primary}
                    style={styles.verseReference}
                  >
                    {rec.verse.book} {rec.verse.chapter}:{rec.verse.verse}
                  </Typography>
                  <View style={styles.recommendationReason}>
                    <Typography 
                      variant="caption" 
                      theme={theme} 
                      color={theme.colors.textSecondary}
                    >
                      💡 {rec.reason}
                    </Typography>
                  </View>
                  <Button
                    title="🤔 Reflect on This Verse"
                    onPress={() => navigation.navigate('Reflection', { 
                      verseId: rec.verse.id, 
                      verse: rec.verse,
                      entryId: currentEntryId 
                    })}
                    theme={theme}
                    variant="primary"
                    size="medium"
                    fullWidth
                  />
                </Card>
              ))}
              
              <Button
                title={isAnalyzing ? '🔄 Analyzing...' : '🔄 Refresh Recommendations'}
                onPress={analyzeEntry}
                theme={theme}
                variant="ghost"
                size="medium"
                fullWidth
                disabled={isAnalyzing}
              />
            </View>
          )}

          {!recommendations.length && !isAnalyzing && (!title.trim() && !content.trim()) && (
            <Typography 
              variant="body" 
              theme={theme} 
              color={theme.colors.textSecondary}
              align="center"
            >
              Start writing your journal entry to get personalized Bible verse recommendations
            </Typography>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewEntryScreen;