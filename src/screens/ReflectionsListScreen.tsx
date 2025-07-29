import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { platformDatabase as databaseService } from '../services/platformDatabase';
import { getTheme } from '../utils/theme';
import { UserPreferences, Reflection } from '../types';
import { Button, Card, Typography } from '../components';

const ReflectionsListScreen = ({ navigation }: any) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    theme: 'light',
    simplifiedMode: false,
    voiceInputEnabled: false,
  });

  const [reflections, setReflections] = useState<Reflection[]>([]);
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
    } catch (error) {
      console.error('Failed to load reflections:', error);
      Alert.alert('Error', 'Failed to load reflections. Please try again.');
    } finally {
      setLoading(false);
    }
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
              await databaseService.deleteReflection(id);
              setReflections(prev => prev.filter(r => r.id !== id));
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
        {reflections.map((reflection) => (
          <Card key={reflection.id} theme={theme} style={styles.reflectionCard}>
            <View style={styles.reflectionHeader}>
              <View style={{ flex: 1 }}>
                <Typography variant="body" theme={theme} style={styles.verseReference}>
                  Verse ID: {reflection.verseId}
                </Typography>
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
            
            <View style={styles.reflectionContent}>
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
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReflectionsListScreen;