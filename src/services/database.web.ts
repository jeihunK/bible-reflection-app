// Dummy file for web builds - actual implementation is in webDatabase.ts
// This prevents expo-sqlite import errors on web platform

import { JournalEntry, BibleVerse, UserPreferences, Reflection } from '../types';

class DatabaseService {
  async init() {
    throw new Error('Native SQLite not available on web. Use webDatabase.ts instead.');
  }

  async createJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    throw new Error('Use webDatabase.ts on web platform');
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    throw new Error('Use webDatabase.ts on web platform');
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    throw new Error('Use webDatabase.ts on web platform');
  }

  async deleteJournalEntry(id: string): Promise<void> {
    throw new Error('Use webDatabase.ts on web platform');
  }

  async getUserPreferences(): Promise<UserPreferences> {
    throw new Error('Use webDatabase.ts on web platform');
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    throw new Error('Use webDatabase.ts on web platform');
  }
}

export const databaseService = new DatabaseService();