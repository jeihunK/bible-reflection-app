// Note: This file is only used on native platforms (iOS/Android)
// Web platform uses webDatabase.ts instead
import * as SQLite from 'expo-sqlite';
import { JournalEntry, BibleVerse, UserPreferences, Reflection } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('bible_reflection.db');
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables() {
    if (!this.db) throw new Error('Database not initialized');

    // Journal entries table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT,
        tags TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    // Bible verses table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS bible_verses (
        id TEXT PRIMARY KEY,
        book TEXT NOT NULL,
        chapter INTEGER NOT NULL,
        verse INTEGER NOT NULL,
        text TEXT NOT NULL,
        translation TEXT NOT NULL
      );
    `);

    // User preferences table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        font_size TEXT DEFAULT 'medium',
        theme TEXT DEFAULT 'light',
        simplified_mode INTEGER DEFAULT 0,
        voice_input_enabled INTEGER DEFAULT 0,
        daily_reminder_time TEXT
      );
    `);

    // Reflections table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS reflections (
        id TEXT PRIMARY KEY,
        entry_id TEXT NOT NULL,
        verse_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (entry_id) REFERENCES journal_entries (id),
        FOREIGN KEY (verse_id) REFERENCES bible_verses (id)
      );
    `);

    // Entry-verse association table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS entry_verses (
        entry_id TEXT NOT NULL,
        verse_id TEXT NOT NULL,
        PRIMARY KEY (entry_id, verse_id),
        FOREIGN KEY (entry_id) REFERENCES journal_entries (id),
        FOREIGN KEY (verse_id) REFERENCES bible_verses (id)
      );
    `);

    // Initialize default preferences
    await this.db.execAsync(`
      INSERT OR IGNORE INTO user_preferences (id) VALUES (1);
    `);
  }

  // Journal Entry Methods
  async createJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const now = new Date().toISOString();
    const tags = JSON.stringify(entry.tags || []);

    await this.db.runAsync(
      `INSERT INTO journal_entries (id, date, title, content, mood, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, entry.date, entry.title, entry.content, entry.mood || null, tags, now, now]
    );

    return id;
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      `SELECT * FROM journal_entries ORDER BY date DESC`
    );

    return result.map((row: any) => ({
      id: row.id,
      date: row.date,
      title: row.title,
      content: row.content,
      mood: row.mood,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      bibleVerses: [] // Will be populated separately if needed
    }));
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = new Date().toISOString();
    const tags = updates.tags ? JSON.stringify(updates.tags) : undefined;

    const fields = [];
    const values = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.content !== undefined) {
      fields.push('content = ?');
      values.push(updates.content);
    }
    if (updates.mood !== undefined) {
      fields.push('mood = ?');
      values.push(updates.mood);
    }
    if (tags !== undefined) {
      fields.push('tags = ?');
      values.push(tags);
    }

    fields.push('updated_at = ?');
    values.push(now, id);

    await this.db.runAsync(
      `UPDATE journal_entries SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  }

  async deleteJournalEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM journal_entries WHERE id = ?', [id]);
    await this.db.runAsync('DELETE FROM entry_verses WHERE entry_id = ?', [id]);
    await this.db.runAsync('DELETE FROM reflections WHERE entry_id = ?', [id]);
  }

  // Reflection Methods
  async createReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO reflections (id, entry_id, verse_id, content, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [id, reflection.entryId, reflection.verseId, reflection.content, now]
    );

    return id;
  }

  async getReflections(): Promise<Reflection[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      `SELECT * FROM reflections ORDER BY created_at DESC`
    );

    return result.map((row: any) => ({
      id: row.id,
      entryId: row.entry_id,
      verseId: row.verse_id,
      content: row.content,
      createdAt: row.created_at,
    }));
  }

  async getReflectionsByEntry(entryId: string): Promise<Reflection[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      `SELECT * FROM reflections WHERE entry_id = ? ORDER BY created_at DESC`,
      [entryId]
    );

    return result.map((row: any) => ({
      id: row.id,
      entryId: row.entry_id,
      verseId: row.verse_id,
      content: row.content,
      createdAt: row.created_at,
    }));
  }

  async deleteReflection(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM reflections WHERE id = ?', [id]);
  }

  // User Preferences Methods
  async getUserPreferences(): Promise<UserPreferences> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      'SELECT * FROM user_preferences WHERE id = 1'
    ) as any;

    return {
      fontSize: result.font_size as UserPreferences['fontSize'],
      theme: result.theme as UserPreferences['theme'],
      simplifiedMode: Boolean(result.simplified_mode),
      voiceInputEnabled: Boolean(result.voice_input_enabled),
      dailyReminderTime: result.daily_reminder_time
    };
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields = [];
    const values = [];

    if (preferences.fontSize !== undefined) {
      fields.push('font_size = ?');
      values.push(preferences.fontSize);
    }
    if (preferences.theme !== undefined) {
      fields.push('theme = ?');
      values.push(preferences.theme);
    }
    if (preferences.simplifiedMode !== undefined) {
      fields.push('simplified_mode = ?');
      values.push(preferences.simplifiedMode ? 1 : 0);
    }
    if (preferences.voiceInputEnabled !== undefined) {
      fields.push('voice_input_enabled = ?');
      values.push(preferences.voiceInputEnabled ? 1 : 0);
    }
    if (preferences.dailyReminderTime !== undefined) {
      fields.push('daily_reminder_time = ?');
      values.push(preferences.dailyReminderTime);
    }

    if (fields.length > 0) {
      values.push(1);
      await this.db.runAsync(
        `UPDATE user_preferences SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  }
}

export const databaseService = new DatabaseService();