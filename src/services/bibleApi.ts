import { BibleVerse } from '../types';

interface BibleApiResponse {
  verses: Array<{
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
  }>;
  reference: string;
  version: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

interface SearchResult {
  verse: BibleVerse;
  reference: string;
}

class BibleApiService {
  private readonly baseUrl = 'https://bible-api.com';
  private readonly fallbackTranslation = 'kjv'; // King James Version as fallback

  /**
   * Get a specific Bible verse by reference
   * @param reference - Bible reference like "John 3:16" or "Romans 8:28"
   * @param translation - Translation code (kjv, niv, esv, etc.)
   */
  async getVerse(reference: string, translation: string = this.fallbackTranslation): Promise<BibleVerse | null> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const url = `${this.baseUrl}/${encodedRef}?translation=${translation}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Bible API request failed: ${response.status}`);
      }

      const data: BibleApiResponse = await response.json();
      
      if (!data.verses || data.verses.length === 0) {
        return null;
      }

      const firstVerse = data.verses[0];
      return {
        id: `${firstVerse.book_id}-${firstVerse.chapter}-${firstVerse.verse}-${translation}`,
        book: firstVerse.book_name,
        chapter: firstVerse.chapter,
        verse: firstVerse.verse,
        text: firstVerse.text.trim(),
        translation: data.translation_name || translation.toUpperCase()
      };
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      return null;
    }
  }

  /**
   * Get multiple verses from a passage
   * @param reference - Bible reference like "Psalm 23:1-6" or "Romans 8:28-30"
   * @param translation - Translation code
   */
  async getPassage(reference: string, translation: string = this.fallbackTranslation): Promise<BibleVerse[]> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const url = `${this.baseUrl}/${encodedRef}?translation=${translation}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Bible API request failed: ${response.status}`);
      }

      const data: BibleApiResponse = await response.json();
      
      if (!data.verses || data.verses.length === 0) {
        return [];
      }

      return data.verses.map(verse => ({
        id: `${verse.book_id}-${verse.chapter}-${verse.verse}-${translation}`,
        book: verse.book_name,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text.trim(),
        translation: data.translation_name || translation.toUpperCase()
      }));
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      return [];
    }
  }

  /**
   * Search for verses containing specific keywords
   * This is a simplified search using common verses - in a real implementation,
   * you'd use a more comprehensive Bible search API
   */
  async searchVerses(query: string, translation: string = this.fallbackTranslation): Promise<SearchResult[]> {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 2);
    
    // Common verses for different themes/keywords
    const verseDatabase = [
      // Hope and Future
      { ref: 'Jeremiah 29:11', keywords: ['hope', 'future', 'plans', 'prosper'] },
      { ref: 'Romans 8:28', keywords: ['good', 'purpose', 'works', 'love'] },
      { ref: 'Isaiah 41:10', keywords: ['fear', 'strength', 'help', 'uphold'] },
      
      // Peace and Comfort
      { ref: 'Philippians 4:6-7', keywords: ['anxiety', 'worry', 'peace', 'prayer'] },
      { ref: 'Psalm 23:1-4', keywords: ['shepherd', 'comfort', 'valley', 'rod', 'staff'] },
      { ref: 'Matthew 11:28-30', keywords: ['weary', 'burden', 'rest', 'yoke'] },
      
      // Love and Grace
      { ref: 'John 3:16', keywords: ['love', 'world', 'eternal', 'life'] },
      { ref: '1 Corinthians 13:4-8', keywords: ['love', 'patient', 'kind', 'endures'] },
      { ref: 'Ephesians 2:8-9', keywords: ['grace', 'saved', 'faith', 'gift'] },
      
      // Strength and Courage
      { ref: 'Philippians 4:13', keywords: ['strength', 'christ', 'all', 'things'] },
      { ref: 'Joshua 1:9', keywords: ['strong', 'courage', 'afraid', 'dismayed'] },
      { ref: 'Isaiah 40:31', keywords: ['wait', 'lord', 'strength', 'wings', 'eagles'] },
      
      // Trust and Faith
      { ref: 'Proverbs 3:5-6', keywords: ['trust', 'heart', 'understanding', 'paths'] },
      { ref: 'Hebrews 11:1', keywords: ['faith', 'hope', 'evidence', 'unseen'] },
      { ref: 'Psalm 46:1', keywords: ['refuge', 'strength', 'trouble', 'help'] },
      
      // Forgiveness and Redemption
      { ref: '1 John 1:9', keywords: ['confess', 'forgive', 'cleanse', 'unrighteousness'] },
      { ref: 'Psalm 103:12', keywords: ['transgressions', 'far', 'east', 'west'] },
      { ref: 'Romans 3:23-24', keywords: ['sin', 'justified', 'grace', 'redemption'] },
      
      // Gratitude and Joy
      { ref: '1 Thessalonians 5:16-18', keywords: ['rejoice', 'pray', 'thanks', 'everything'] },
      { ref: 'Psalm 118:24', keywords: ['day', 'lord', 'rejoice', 'glad'] },
      { ref: 'Philippians 4:4', keywords: ['rejoice', 'lord', 'always'] }
    ];

    const matchedRefs = verseDatabase.filter(entry => 
      entry.keywords.some(keyword => 
        keywords.some(queryWord => keyword.includes(queryWord) || queryWord.includes(keyword))
      )
    );

    const results: SearchResult[] = [];
    
    // Fetch the top 5 most relevant verses
    for (const match of matchedRefs.slice(0, 5)) {
      try {
        const verse = await this.getVerse(match.ref, translation);
        if (verse) {
          results.push({
            verse,
            reference: match.ref
          });
        }
      } catch (error) {
        console.error(`Error fetching verse ${match.ref}:`, error);
      }
    }

    return results;
  }

  /**
   * Get daily verse - rotates through a selection of encouraging verses
   */
  async getDailyVerse(translation: string = this.fallbackTranslation): Promise<BibleVerse | null> {
    const dailyVerses = [
      'Psalm 118:24',
      'Lamentations 3:22-23',
      'Philippians 4:13',
      'Jeremiah 29:11',
      'Romans 8:28',
      'Isaiah 41:10',
      'Proverbs 3:5-6'
    ];

    // Use current date to select verse (changes daily)
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const selectedRef = dailyVerses[dayOfYear % dailyVerses.length];

    return await this.getVerse(selectedRef, translation);
  }

  /**
   * Get verses by theme/category
   */
  async getVersesByTheme(theme: string, translation: string = this.fallbackTranslation): Promise<BibleVerse[]> {
    const themes: { [key: string]: string[] } = {
      comfort: ['Psalm 23:4', 'Matthew 11:28', '2 Corinthians 1:3-4'],
      hope: ['Jeremiah 29:11', 'Romans 15:13', 'Psalm 42:11'],
      love: ['John 3:16', '1 John 4:7-8', 'Romans 8:38-39'],
      peace: ['Philippians 4:6-7', 'John 14:27', 'Isaiah 26:3'],
      strength: ['Philippians 4:13', 'Isaiah 40:31', 'Psalm 46:1'],
      forgiveness: ['1 John 1:9', 'Ephesians 4:32', 'Colossians 3:13'],
      faith: ['Hebrews 11:1', 'Romans 10:17', 'Matthew 17:20'],
      gratitude: ['1 Thessalonians 5:18', 'Psalm 100:4', 'Colossians 3:17']
    };

    const references = themes[theme.toLowerCase()] || [];
    const verses: BibleVerse[] = [];

    for (const ref of references) {
      try {
        const verse = await this.getVerse(ref, translation);
        if (verse) {
          verses.push(verse);
        }
      } catch (error) {
        console.error(`Error fetching themed verse ${ref}:`, error);
      }
    }

    return verses;
  }

  /**
   * Get available translations
   */
  getAvailableTranslations() {
    return [
      { code: 'kjv', name: 'King James Version', language: 'English' },
      { code: 'niv', name: 'New International Version', language: 'English' },
      { code: 'esv', name: 'English Standard Version', language: 'English' },
      { code: 'nlt', name: 'New Living Translation', language: 'English' },
      { code: 'nasb', name: 'New American Standard Bible', language: 'English' },
      { code: 'nkjv', name: 'New King James Version', language: 'English' }
    ];
  }
}

export const bibleApiService = new BibleApiService();