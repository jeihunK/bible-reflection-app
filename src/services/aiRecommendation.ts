import { JournalEntry, BibleVerse } from '../types';
import { bibleApiService } from './bibleApi';

interface SentimentAnalysis {
  mood: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
  emotions: string[];
  themes: string[];
}

interface VerseRecommendation {
  verse: BibleVerse;
  reason: string;
  relevanceScore: number;
}

class AIRecommendationService {
  /**
   * Analyze the sentiment and themes of a journal entry
   */
  analyzeSentiment(entry: JournalEntry): SentimentAnalysis {
    const text = `${entry.title} ${entry.content}`.toLowerCase();
    const words = text.split(/\s+/).filter(word => word.length > 2);

    // Emotion keywords mapping
    const emotionKeywords = {
      anxious: ['anxious', 'worry', 'worried', 'stress', 'stressed', 'fear', 'afraid', 'nervous', 'panic'],
      sad: ['sad', 'depressed', 'down', 'grief', 'sorrow', 'crying', 'tears', 'heartbroken', 'lonely'],
      angry: ['angry', 'mad', 'furious', 'frustrated', 'irritated', 'annoyed', 'rage', 'upset'],
      joyful: ['happy', 'joy', 'joyful', 'excited', 'glad', 'cheerful', 'blessed', 'celebrate', 'praise'],
      grateful: ['grateful', 'thankful', 'blessed', 'appreciate', 'thank', 'grace', 'favor'],
      hopeful: ['hope', 'hopeful', 'optimistic', 'future', 'dream', 'aspire', 'faith', 'believe'],
      peaceful: ['peace', 'peaceful', 'calm', 'quiet', 'still', 'serene', 'rest', 'comfort'],
      confused: ['confused', 'lost', 'uncertain', 'doubt', 'question', 'wonder', 'unclear'],
      overwhelmed: ['overwhelmed', 'too much', 'burden', 'heavy', 'exhausted', 'tired', 'weary']
    };

    // Theme keywords mapping
    const themeKeywords = {
      family: ['family', 'mother', 'father', 'child', 'children', 'spouse', 'husband', 'wife', 'parent'],
      work: ['work', 'job', 'career', 'boss', 'colleague', 'office', 'business', 'project'],
      health: ['health', 'sick', 'illness', 'doctor', 'hospital', 'pain', 'healing', 'medicine'],
      relationships: ['friend', 'friendship', 'relationship', 'love', 'partner', 'conflict', 'forgive'],
      faith: ['god', 'lord', 'jesus', 'christ', 'pray', 'prayer', 'church', 'bible', 'faith', 'spirit'],
      purpose: ['purpose', 'calling', 'ministry', 'serve', 'mission', 'direction', 'path', 'plan'],
      growth: ['learn', 'grow', 'change', 'improve', 'better', 'wisdom', 'understand', 'mature'],
      challenges: ['difficult', 'hard', 'struggle', 'challenge', 'problem', 'trial', 'test', 'obstacle']
    };

    // Detect emotions
    const detectedEmotions: string[] = [];
    let positiveScore = 0;
    let negativeScore = 0;

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword) || keyword.includes(word))
      ).length;
      
      if (matches > 0) {
        detectedEmotions.push(emotion);
        
        // Score sentiment
        if (['joyful', 'grateful', 'hopeful', 'peaceful'].includes(emotion)) {
          positiveScore += matches;
        } else if (['anxious', 'sad', 'angry', 'confused', 'overwhelmed'].includes(emotion)) {
          negativeScore += matches;
        }
      }
    });

    // Detect themes
    const detectedThemes: string[] = [];
    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
      const matches = keywords.filter(keyword => 
        words.some(word => word.includes(keyword) || keyword.includes(word))
      ).length;
      
      if (matches > 0) {
        detectedThemes.push(theme);
      }
    });

    // Determine overall mood
    let mood: 'positive' | 'negative' | 'neutral' | 'mixed';
    let confidence: number;

    if (positiveScore > negativeScore * 1.5) {
      mood = 'positive';
      confidence = Math.min(0.9, 0.5 + (positiveScore / (positiveScore + negativeScore)) * 0.4);
    } else if (negativeScore > positiveScore * 1.5) {
      mood = 'negative';
      confidence = Math.min(0.9, 0.5 + (negativeScore / (positiveScore + negativeScore)) * 0.4);
    } else if (positiveScore > 0 && negativeScore > 0) {
      mood = 'mixed';
      confidence = 0.6;
    } else {
      mood = 'neutral';
      confidence = 0.5;
    }

    // Add mood from journal entry if available
    if (entry.mood) {
      const moodLower = entry.mood.toLowerCase();
      if (['happy', 'joyful', 'blessed', 'grateful', 'peaceful'].some(m => moodLower.includes(m))) {
        positiveScore += 2;
      } else if (['sad', 'angry', 'anxious', 'stressed', 'frustrated'].some(m => moodLower.includes(m))) {
        negativeScore += 2;
      }
    }

    return {
      mood,
      confidence,
      emotions: detectedEmotions,
      themes: detectedThemes
    };
  }

  /**
   * Get Bible verse recommendations based on journal entry analysis
   */
  async getRecommendations(entry: JournalEntry): Promise<VerseRecommendation[]> {
    const analysis = this.analyzeSentiment(entry);
    const recommendations: VerseRecommendation[] = [];

    // Emotion-based recommendations
    const emotionVerses: { [key: string]: { refs: string[], reason: string } } = {
      anxious: {
        refs: ['Philippians 4:6-7', 'Matthew 6:25-26', 'Isaiah 41:10'],
        reason: 'For comfort and peace in times of anxiety'
      },
      sad: {
        refs: ['Psalm 34:18', 'Matthew 5:4', '2 Corinthians 1:3-4'],
        reason: 'For comfort and healing in times of sadness'
      },
      angry: {
        refs: ['Ephesians 4:26-27', 'Proverbs 15:1', 'James 1:19-20'],
        reason: 'For guidance in managing anger with wisdom'
      },
      joyful: {
        refs: ['Psalm 118:24', 'Philippians 4:4', '1 Thessalonians 5:16'],
        reason: 'To amplify and celebrate your joy'
      },
      grateful: {
        refs: ['1 Thessalonians 5:18', 'Psalm 100:4', 'Colossians 3:17'],
        reason: 'To deepen your spirit of gratitude'
      },
      hopeful: {
        refs: ['Jeremiah 29:11', 'Romans 15:13', 'Psalm 42:11'],
        reason: 'To strengthen your hope and faith'
      },
      peaceful: {
        refs: ['John 14:27', 'Philippians 4:7', 'Isaiah 26:3'],
        reason: 'To sustain your sense of peace'
      },
      confused: {
        refs: ['Proverbs 3:5-6', 'James 1:5', 'Psalm 119:105'],
        reason: 'For wisdom and guidance in uncertainty'
      },
      overwhelmed: {
        refs: ['Matthew 11:28-30', 'Psalm 55:22', 'Isaiah 40:31'],
        reason: 'For strength and rest when feeling overwhelmed'
      }
    };

    // Theme-based recommendations
    const themeVerses: { [key: string]: { refs: string[], reason: string } } = {
      family: {
        refs: ['Ephesians 6:1-4', 'Proverbs 22:6', '1 Timothy 5:8'],
        reason: 'For wisdom and strength in family relationships'
      },
      work: {
        refs: ['Colossians 3:23-24', 'Proverbs 16:3', 'Ecclesiastes 3:13'],
        reason: 'For purpose and excellence in your work'
      },
      health: {
        refs: ['Jeremiah 30:17', '3 John 1:2', 'Psalm 103:2-3'],
        reason: 'For healing and strength in health challenges'
      },
      relationships: {
        refs: ['1 Corinthians 13:4-8', 'Ephesians 4:32', 'Romans 12:10'],
        reason: 'For wisdom in building loving relationships'
      },
      faith: {
        refs: ['Hebrews 11:1', 'Romans 10:17', '2 Timothy 1:7'],
        reason: 'To strengthen and encourage your faith journey'
      },
      purpose: {
        refs: ['Jeremiah 1:5', 'Ephesians 2:10', 'Romans 8:28'],
        reason: 'To discover and fulfill your God-given purpose'
      },
      growth: {
        refs: ['2 Peter 3:18', 'Philippians 1:6', 'Proverbs 27:17'],
        reason: 'For continued spiritual growth and maturity'
      },
      challenges: {
        refs: ['Romans 5:3-5', '1 Peter 5:7', 'James 1:2-4'],
        reason: 'For strength and perspective in difficult times'
      }
    };

    // Add emotion-based recommendations
    for (const emotion of analysis.emotions) {
      const emotionData = emotionVerses[emotion];
      if (emotionData) {
        for (const ref of emotionData.refs.slice(0, 1)) { // Take first verse to avoid too many
          try {
            const verse = await bibleApiService.getVerse(ref);
            if (verse) {
              recommendations.push({
                verse,
                reason: emotionData.reason,
                relevanceScore: 0.8
              });
            }
          } catch (error) {
            console.error(`Error fetching emotion verse ${ref}:`, error);
          }
        }
      }
    }

    // Add theme-based recommendations
    for (const theme of analysis.themes) {
      const themeData = themeVerses[theme];
      if (themeData) {
        for (const ref of themeData.refs.slice(0, 1)) { // Take first verse to avoid too many
          try {
            const verse = await bibleApiService.getVerse(ref);
            if (verse) {
              recommendations.push({
                verse,
                reason: themeData.reason,
                relevanceScore: 0.7
              });
            }
          } catch (error) {
            console.error(`Error fetching theme verse ${ref}:`, error);
          }
        }
      }
    }

    // If no specific recommendations, provide encouraging general verses
    if (recommendations.length === 0) {
      const generalRefs = ['Jeremiah 29:11', 'Philippians 4:13', 'Romans 8:28'];
      for (const ref of generalRefs) {
        try {
          const verse = await bibleApiService.getVerse(ref);
          if (verse) {
            recommendations.push({
              verse,
              reason: 'An encouraging word for your journey',
              relevanceScore: 0.5
            });
          }
        } catch (error) {
          console.error(`Error fetching general verse ${ref}:`, error);
        }
      }
    }

    // Sort by relevance score and return top 3
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);
  }

  /**
   * Generate reflection prompts based on a Bible verse and journal entry
   */
  generateReflectionPrompts(verse: BibleVerse, entry?: JournalEntry): string[] {
    const basePrompts = [
      `What does ${verse.book} ${verse.chapter}:${verse.verse} mean to you personally?`,
      `How can you apply this verse to your current situation?`,
      `What emotions does this verse bring up for you?`,
      `How does this verse give you hope or comfort?`,
      `What is God teaching you through this verse?`
    ];

    if (!entry) {
      return basePrompts;
    }

    const analysis = this.analyzeSentiment(entry);
    const customPrompts: string[] = [];

    // Add emotion-specific prompts
    if (analysis.emotions.includes('anxious')) {
      customPrompts.push('How does this verse speak to your worries and anxieties?');
    }
    if (analysis.emotions.includes('grateful')) {
      customPrompts.push('How does this verse deepen your gratitude to God?');
    }
    if (analysis.emotions.includes('confused')) {
      customPrompts.push('What clarity or direction does this verse provide for your situation?');
    }

    // Add theme-specific prompts
    if (analysis.themes.includes('family')) {
      customPrompts.push('How can this verse guide your family relationships?');
    }
    if (analysis.themes.includes('work')) {
      customPrompts.push('How does this verse apply to your work and career?');
    }
    if (analysis.themes.includes('faith')) {
      customPrompts.push('How does this verse strengthen your faith journey?');
    }

    // Combine custom and base prompts, prioritizing custom ones
    return [...customPrompts, ...basePrompts].slice(0, 5);
  }

  /**
   * Get a summary of the sentiment analysis for display
   */
  getSentimentSummary(analysis: SentimentAnalysis): string {
    let summary = `You seem to be feeling ${analysis.mood}`;
    
    if (analysis.emotions.length > 0) {
      summary += `, particularly ${analysis.emotions.slice(0, 2).join(' and ')}`;
    }
    
    if (analysis.themes.length > 0) {
      summary += `. Your thoughts centered around ${analysis.themes.slice(0, 2).join(' and ')}`;
    }
    
    summary += '.';
    return summary;
  }
}

export const aiRecommendationService = new AIRecommendationService();