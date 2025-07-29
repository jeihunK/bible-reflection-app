import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { getTheme } from '../utils/theme';
import { UserPreferences, BibleVerse, BibleTranslation } from '../types';
import { Button, Card, Typography, TextInput } from '../components';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { bibleApiService } from '../services/bibleApi';

const BibleSearchScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState('kjv');
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null);
  const [popularVerses, setPopularVerses] = useState<BibleVerse[]>([]);

  const theme = getTheme(preferences);

  useEffect(() => {
    loadUserPreferences();
    loadDailyVerse();
    loadPopularVerses();
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

  const loadDailyVerse = async () => {
    try {
      const verse = await bibleApiService.getDailyVerse(selectedTranslation);
      setDailyVerse(verse);
    } catch (error) {
      console.error('Failed to load daily verse:', error);
    }
  };

  const loadPopularVerses = async () => {
    try {
      const verses = await bibleApiService.getVersesByTheme('hope', selectedTranslation);
      setPopularVerses(verses);
    } catch (error) {
      console.error('Failed to load popular verses:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Check if it's a specific verse reference (e.g., "John 3:16")
      const verseRefPattern = /^\s*\d?\s*[a-zA-Z]+\s+\d+:\d+/;
      if (verseRefPattern.test(searchQuery)) {
        const verse = await bibleApiService.getVerse(searchQuery.trim(), selectedTranslation);
        if (verse) {
          setSearchResults([verse]);
        } else {
          Alert.alert('Verse Not Found', 'Please check your verse reference and try again.');
        }
      } else {
        // Search by keywords
        const searchResultsData = await bibleApiService.searchVerses(searchQuery.trim(), selectedTranslation);
        const verses = searchResultsData.map(result => result.verse);
        setSearchResults(verses);
      }
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Search Error', 'Unable to search verses. Please check your internet connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleVerseSelect = (verse: BibleVerse) => {
    navigation.navigate('Reflection', { verseId: verse.id, verse });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
    },
    scrollContainer: {
      padding: theme.spacing.lg,
    },
    searchCard: {
      marginBottom: theme.spacing.xl,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionHeader: {
      marginBottom: theme.spacing.lg,
    },
    verseCard: {
      marginBottom: theme.spacing.md,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
      backgroundColor: 'rgba(103, 126, 234, 0.05)',
    },
    verseText: {
      marginBottom: theme.spacing.sm,
      fontStyle: 'italic',
      fontSize: theme.fonts.body + 2,
      lineHeight: theme.fonts.body * 1.6,
    },
    verseReference: {
      marginBottom: theme.spacing.md,
    },
    buttonContainer: {
      marginTop: theme.spacing.md,
    },
    quickAccessContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    quickAccessButton: {
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    searchButton: {
      marginTop: theme.spacing.lg,
    },
  });

  const translations = bibleApiService.getAvailableTranslations();

  const renderVerseCard = (verse: BibleVerse, showReflectButton: boolean = true) => (
    <Card key={verse.id} theme={theme} variant="outlined" style={styles.verseCard}>
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
        color={theme.colors.primary}
        style={styles.verseReference}
      >
        {verse.book} {verse.chapter}:{verse.verse} ({verse.translation})
      </Typography>
      
      {showReflectButton && (
        <View style={styles.buttonContainer}>
          <Button
            title="🤔 Reflect on This Verse"
            onPress={() => handleVerseSelect(verse)}
            theme={theme}
            variant="primary"
            size="medium"
            fullWidth
          />
        </View>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card theme={theme} variant="elevated" style={styles.searchCard}>
          <Typography variant="title" theme={theme} style={{ marginBottom: theme.spacing.md }}>
            🔍 Search Bible Verses
          </Typography>
          
          <TextInput
            label="Search for verses"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Enter keywords (hope, peace) or verse reference (John 3:16)..."
            theme={theme}
          />
          
          <Button
            title={isSearching ? "🔍 Searching..." : "🔍 Search Verses"}
            onPress={handleSearch}
            theme={theme}
            variant="gradient"
            size="large"
            fullWidth
            style={styles.searchButton}
            disabled={isSearching || !searchQuery.trim()}
          />

          <Typography 
            variant="caption" 
            theme={theme} 
            color={theme.colors.textSecondary}
            style={{ marginTop: theme.spacing.sm }}
          >
            Try searching for "hope", "peace", "strength" or specific verses like "Psalm 23:1"
          </Typography>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <View style={styles.section}>
            <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
              📋 Search Results
            </Typography>
            {searchResults.map(verse => renderVerseCard(verse))}
          </View>
        )}

        {/* Daily Verse */}
        {dailyVerse && (
          <View style={styles.section}>
            <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
              ✨ Today's Verse
            </Typography>
            {renderVerseCard(dailyVerse)}
          </View>
        )}

        {/* Popular/Themed Verses */}
        {popularVerses.length > 0 && (
          <View style={styles.section}>
            <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
              🌟 Verses of Hope
            </Typography>
            {popularVerses.map(verse => renderVerseCard(verse))}
          </View>
        )}

        {/* Translation Selection */}
        <Card theme={theme} variant="outlined" style={styles.section}>
          <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
            📖 Bible Translation
          </Typography>
          <Typography 
            variant="body" 
            theme={theme} 
            color={theme.colors.textSecondary}
            style={{ marginBottom: theme.spacing.md }}
          >
            Currently using: {translations.find(t => t.code === selectedTranslation)?.name || 'King James Version'}
          </Typography>
          <View style={styles.buttonContainer}>
            <Button
              title="⚙️ Change Translation"
              onPress={() => {
                // TODO: Add translation selection modal
                Alert.alert('Coming Soon', 'Translation selection will be available soon');
              }}
              theme={theme}
              variant="ghost"
              size="medium"
              fullWidth
            />
          </View>
        </Card>

        {/* Quick Access */}
        <Card theme={theme} variant="elevated" style={styles.section}>
          <Typography variant="heading" theme={theme} style={styles.sectionHeader}>
            ⚡ Quick Access
          </Typography>
          <View style={styles.quickAccessContainer}>
            {['Peace', 'Hope', 'Love', 'Strength', 'Comfort', 'Faith'].map(theme_name => (
              <Button
                key={theme_name}
                title={theme_name}
                onPress={async () => {
                  setIsSearching(true);
                  try {
                    const verses = await bibleApiService.getVersesByTheme(theme_name.toLowerCase(), selectedTranslation);
                    setSearchResults(verses);
                  } catch (error) {
                    Alert.alert('Error', 'Failed to load verses for this theme');
                  } finally {
                    setIsSearching(false);
                  }
                }}
                theme={theme}
                variant="ghost"
                size="small"
                style={styles.quickAccessButton}
              />
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BibleSearchScreen;