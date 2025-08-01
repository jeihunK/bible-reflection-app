// Web-compatible database service using IndexedDB
import { JournalEntry, BibleVerse, UserPreferences, Reflection } from '../types';

class WebDatabaseService {
  private db: IDBDatabase | null = null;
  private dbName = 'BibleReflectionDB';
  private version = 1;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('Web database initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create journal entries store
        if (!db.objectStoreNames.contains('journal_entries')) {
          const entriesStore = db.createObjectStore('journal_entries', { keyPath: 'id' });
          entriesStore.createIndex('date', 'date', { unique: false });
        }

        // Create user preferences store
        if (!db.objectStoreNames.contains('user_preferences')) {
          db.createObjectStore('user_preferences', { keyPath: 'id' });
        }

        // Create bible verses store
        if (!db.objectStoreNames.contains('bible_verses')) {
          db.createObjectStore('bible_verses', { keyPath: 'id' });
        }

        // Create reflections store
        if (!db.objectStoreNames.contains('reflections')) {
          db.createObjectStore('reflections', { keyPath: 'id' });
        }
      };
    });
  }

  async createJournalEntry(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const fullEntry: JournalEntry = {
      ...entry,
      id,
      createdAt: now,
      updatedAt: now,
      tags: entry.tags || [],
      bibleVerses: []
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journal_entries'], 'readwrite');
      const store = transaction.objectStore('journal_entries');
      const request = store.add(fullEntry);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Failed to create journal entry'));
    });
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journal_entries'], 'readonly');
      const store = transaction.objectStore('journal_entries');
      const request = store.getAll();

      request.onsuccess = () => {
        const entries = request.result.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        resolve(entries);
      };
      request.onerror = () => reject(new Error('Failed to get journal entries'));
    });
  }

  async updateJournalEntry(id: string, updates: Partial<JournalEntry>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journal_entries'], 'readwrite');
      const store = transaction.objectStore('journal_entries');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const entry = getRequest.result;
        if (!entry) {
          reject(new Error('Entry not found'));
          return;
        }

        const updatedEntry = {
          ...entry,
          ...updates,
          updatedAt: new Date().toISOString()
        };

        const putRequest = store.put(updatedEntry);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to update entry'));
      };

      getRequest.onerror = () => reject(new Error('Failed to find entry'));
    });
  }

  async deleteJournalEntry(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['journal_entries'], 'readwrite');
      const store = transaction.objectStore('journal_entries');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to delete entry'));
    });
  }

  // Reflection Methods
  async createReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = Date.now().toString();
    const now = new Date().toISOString();
    
    const fullReflection: Reflection = {
      id,
      entryId: reflection.entryId,
      verseId: reflection.verseId,
      content: reflection.content,
      createdAt: now,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reflections'], 'readwrite');
      const store = transaction.objectStore('reflections');
      const request = store.add(fullReflection);

      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(new Error('Failed to create reflection'));
    });
  }

  async getReflections(): Promise<Reflection[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reflections'], 'readonly');
      const store = transaction.objectStore('reflections');
      const request = store.getAll();

      request.onsuccess = () => {
        const reflections = request.result.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(reflections);
      };
      request.onerror = () => reject(new Error('Failed to get reflections'));
    });
  }

  async getReflectionsByEntry(entryId: string): Promise<Reflection[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['reflections'], 'readonly');
      const store = transaction.objectStore('reflections');
      const request = store.getAll();

      request.onsuccess = () => {
        const allReflections = request.result;
        const entryReflections = allReflections
          .filter(r => r.entryId === entryId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(entryReflections);
      };
      request.onerror = () => reject(new Error('Failed to get reflections'));
    });
  }

  async deleteReflection(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      console.log('WebDB: Attempting to delete reflection with ID:', id, typeof id);
      
      const transaction = this.db!.transaction(['reflections'], 'readwrite');
      const store = transaction.objectStore('reflections');
      
      // First verify the item exists
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        console.log('WebDB: Item exists check:', item ? 'YES' : 'NO');
        
        if (!item) {
          console.log('WebDB: Item not found, rejection deletion');
          reject(new Error(`Reflection with ID ${id} not found`));
          return;
        }
        
        console.log('WebDB: Found item, proceeding with deletion:', item);
        
        // Now delete the item
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
          console.log('WebDB: Delete request successful');
          resolve();
        };
        
        deleteRequest.onerror = () => {
          console.log('WebDB: Delete request failed:', deleteRequest.error);
          reject(new Error(`Failed to delete reflection: ${deleteRequest.error?.message}`));
        };
      };
      
      getRequest.onerror = () => {
        console.log('WebDB: Get request failed:', getRequest.error);
        reject(new Error(`Failed to find reflection: ${getRequest.error?.message}`));
      };
      
      transaction.onerror = () => {
        console.log('WebDB: Transaction failed:', transaction.error);
        reject(new Error(`Transaction failed: ${transaction.error?.message}`));
      };
    });
  }

  async getUserPreferences(): Promise<UserPreferences> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['user_preferences'], 'readonly');
      const store = transaction.objectStore('user_preferences');
      const request = store.get(1);

      request.onsuccess = () => {
        const prefs = request.result;
        if (prefs) {
          resolve({
            fontSize: prefs.fontSize || 'medium',
            theme: prefs.theme || 'light',
            simplifiedMode: prefs.simplifiedMode || false,
            voiceInputEnabled: prefs.voiceInputEnabled || false,
            dailyReminderTime: prefs.dailyReminderTime
          });
        } else {
          // Return default preferences
          const defaultPrefs: UserPreferences = {
            fontSize: 'medium',
            theme: 'light',
            simplifiedMode: false,
            voiceInputEnabled: false
          };
          resolve(defaultPrefs);
        }
      };
      request.onerror = () => reject(new Error('Failed to get user preferences'));
    });
  }

  async updateUserPreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['user_preferences'], 'readwrite');
      const store = transaction.objectStore('user_preferences');
      
      // Get existing preferences first
      const getRequest = store.get(1);
      
      getRequest.onsuccess = () => {
        const existing = getRequest.result || {
          id: 1,
          fontSize: 'medium',
          theme: 'light',
          simplifiedMode: false,
          voiceInputEnabled: false
        };

        const updated = { ...existing, ...preferences };
        const putRequest = store.put(updated);
        
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to update preferences'));
      };

      getRequest.onerror = () => reject(new Error('Failed to get existing preferences'));
    });
  }
}

// Create web-compatible database service
export const webDatabaseService = new WebDatabaseService();