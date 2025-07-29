export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  bibleVerses?: BibleVerse[];
  createdAt: string;
  updatedAt: string;
}

export interface BibleVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'high-contrast';
  simplifiedMode: boolean;
  voiceInputEnabled: boolean;
  dailyReminderTime?: string;
}

export interface Reflection {
  id: string;
  entryId: string;
  verseId: string;
  content: string;
  createdAt: string;
}

export interface VerseRecommendation {
  verse: BibleVerse;
  reason: string;
  relevanceScore: number;
}

export interface SentimentAnalysis {
  mood: 'positive' | 'negative' | 'neutral' | 'mixed';
  confidence: number;
  emotions: string[];
  themes: string[];
}

export interface BibleTranslation {
  code: string;
  name: string;
  language: string;
}

export type RootStackParamList = {
  Home: undefined;
  Journal: undefined;
  NewEntry: { entryId?: string };
  BibleSearch: undefined;
  Settings: undefined;
  Reflection: { verseId: string; entryId?: string };
};