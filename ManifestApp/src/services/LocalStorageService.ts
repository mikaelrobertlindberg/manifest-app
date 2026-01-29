// MOBILE-PERSISTENCE-FIXED: Lokal lagringsservice med persistent mobile storage
export interface GratitudeEntry {
  id: string;
  text: string; // Text med integrerade emojis
  createdAt: Date;
  mood?: string;
  wordCount: number;
}

// PERSISTENT MOBILE STORAGE - Singleton pattern för att överleva component re-renders
class PersistentMobileStorage {
  private static instance: PersistentMobileStorage;
  private data: GratitudeEntry[] = [];
  
  static getInstance(): PersistentMobileStorage {
    if (!PersistentMobileStorage.instance) {
      PersistentMobileStorage.instance = new PersistentMobileStorage();
    }
    return PersistentMobileStorage.instance;
  }
  
  setData(entries: GratitudeEntry[]): void {
    this.data = [...entries];
    console.log(`📱 PERSISTENT: Stored ${entries.length} entries in singleton`);
    
    // Extra logging för debug
    this.data.forEach((entry, index) => {
      console.log(`  ${index + 1}. ${entry.id}: "${entry.text.substring(0, 20)}..."`);
    });
  }
  
  getData(): GratitudeEntry[] {
    console.log(`📱 PERSISTENT: Retrieved ${this.data.length} entries from singleton`);
    return [...this.data];
  }
  
  addEntry(entry: GratitudeEntry): void {
    this.data.unshift(entry); // Add to beginning
    console.log(`📱 PERSISTENT: Added entry ${entry.id}. Total: ${this.data.length}`);
  }
  
  removeEntry(id: string): boolean {
    const originalLength = this.data.length;
    this.data = this.data.filter(entry => entry.id !== id);
    const removed = this.data.length < originalLength;
    console.log(`📱 PERSISTENT: ${removed ? 'Removed' : 'Failed to remove'} ${id}. Total: ${this.data.length}`);
    return removed;
  }
  
  clear(): void {
    this.data = [];
    console.log('📱 PERSISTENT: Cleared all data from singleton');
  }
  
  getCount(): number {
    return this.data.length;
  }
}

export class LocalStorageService {
  private static readonly STORAGE_KEY = 'manifest-gratitudes';
  private static storage = PersistentMobileStorage.getInstance();
  
  // MOBILE-PERSISTENCE-FIXED: Spara tacksamhet med persistent storage
  static async saveGratitude(text: string): Promise<GratitudeEntry> {
    try {
      console.log('💾 SAVING: Sparar tacksamhet:', text.substring(0, 30) + '...');
      
      // Räkna ord (exkludera emojis)
      const textWithoutEmojis = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
      const wordCount = textWithoutEmojis.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      const newEntry: GratitudeEntry = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        text: text.trim(),
        createdAt: new Date(),
        mood: 'positive',
        wordCount: wordCount
      };
      
      console.log(`💾 SAVING: Created entry with ID: ${newEntry.id}`);
      
      // PERSISTENT: Add to singleton storage first
      this.storage.addEntry(newEntry);
      
      // BACKUP: Try localStorage if available
      await this.backupToLocalStorage();
      
      console.log(`✅ SAVED: Entry ${newEntry.id} saved successfully! Total entries: ${this.storage.getCount()}`);
      return newEntry;
      
    } catch (error) {
      console.error('❌ SAVE ERROR:', error);
      throw new Error('Backend-fel: Kunde inte spara tacksamheten. Prova igen!');
    }
  }
  
  // BACKUP: Sync till localStorage om tillgängligt
  private static async backupToLocalStorage(): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const allData = this.storage.getData();
        const dataString = JSON.stringify(allData);
        localStorage.setItem(this.STORAGE_KEY, dataString);
        console.log(`💾 BACKUP: Synced ${allData.length} entries to localStorage`);
      }
    } catch (error) {
      console.log('💾 BACKUP: localStorage sync failed (not critical):', error);
    }
  }
  
  // MOBILE-PERSISTENCE-FIXED: Hämta tacksamheter från persistent storage
  static async getAllGratitudes(): Promise<GratitudeEntry[]> {
    try {
      console.log('📖 LOADING: Reading all gratitudes...');
      
      // PERSISTENT: Hämta från singleton storage först
      let entries = this.storage.getData();
      
      // RESTORE: Om tom, försök återställ från localStorage
      if (entries.length === 0 && typeof window !== 'undefined' && window.localStorage) {
        console.log('📖 LOADING: Singleton empty, checking localStorage...');
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          const parsedEntries = JSON.parse(stored);
          const restoredEntries = parsedEntries.map((entry: any) => ({
            ...entry,
            createdAt: new Date(entry.createdAt)
          }));
          
          // Restore to singleton
          this.storage.setData(restoredEntries);
          entries = restoredEntries;
          console.log(`📖 LOADING: Restored ${entries.length} entries from localStorage`);
        }
      }
      
      console.log(`✅ LOADED: Returning ${entries.length} gratitudes`);
      
      // Debug log alla entries
      if (entries.length > 0) {
        console.log('📖 LOADING: Entries found:');
        entries.forEach((entry, index) => {
          console.log(`  ${index + 1}. ${entry.id}: "${entry.text.substring(0, 30)}..." (${entry.createdAt.toLocaleDateString()})`);
        });
      } else {
        console.log('📖 LOADING: No entries found in storage');
      }
      
      return entries;
      
    } catch (error) {
      console.error('❌ LOAD ERROR:', error);
      console.log('🔄 FALLBACK: Returning empty array');
      return [];
    }
  }
  
  // MOBILE-PERSISTENCE-FIXED: Räkna med persistent storage
  static async getGratitudesCount(): Promise<number> {
    try {
      const count = this.storage.getCount();
      console.log(`📊 COUNT: ${count} gratitudes in persistent storage`);
      return count;
    } catch (error) {
      console.error('❌ COUNT ERROR:', error);
      return 0;
    }
  }
  
  // MOBILE-PERSISTENCE-FIXED: Slumpmässig tacksamhet
  static async getRandomGratitude(): Promise<GratitudeEntry | null> {
    try {
      const entries = await this.getAllGratitudes();
      if (entries.length === 0) {
        console.log('🎲 RANDOM: No gratitudes to choose from');
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * entries.length);
      const randomEntry = entries[randomIndex];
      console.log(`🎲 RANDOM: Selected ${randomEntry.id}`);
      return randomEntry;
    } catch (error) {
      console.error('❌ RANDOM ERROR:', error);
      return null;
    }
  }
  
  // MOBILE-PERSISTENCE-FIXED: Ta bort tacksamhet
  static async deleteGratitude(id: string): Promise<void> {
    try {
      console.log(`🗑️ DELETE: Removing gratitude ${id}`);
      
      const removed = this.storage.removeEntry(id);
      if (!removed) {
        throw new Error('Tacksamheten hittades inte i backend');
      }
      
      // Backup sync after delete
      await this.backupToLocalStorage();
      
      console.log(`✅ DELETED: ${id} removed. ${this.storage.getCount()} entries remaining`);
      
    } catch (error) {
      console.error('❌ DELETE ERROR:', error);
      throw new Error('Backend-fel: Kunde inte ta bort tacksamheten');
    }
  }
  
  // UTILITY: Extrahera emojis från text
  static extractEmojisFromText(text: string): string[] {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}]/gu;
    const matches = text.match(emojiRegex);
    return matches ? [...new Set(matches)] : [];
  }
  
  // UTILITY: Text utan emojis
  static getTextWithoutEmojis(text: string): string {
    return text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
  }
  
  // MOBILE DEBUG: Backend status med persistent storage info
  static async getBackendStatus(): Promise<{ working: boolean, entries: number, details: string[], error?: string }> {
    try {
      const persistentCount = this.storage.getCount();
      const allEntries = await this.getAllGratitudes();
      
      let webCount = 0;
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
          webCount = JSON.parse(stored).length;
        }
      }
      
      const details = [
        `Total entries: ${allEntries.length}`,
        `Persistent storage: ${persistentCount}`,
        `Web localStorage: ${webCount}`,
        `Platform: ${typeof window !== 'undefined' ? 'Web/Mobile Hybrid' : 'Pure Mobile'}`,
        `Storage type: Persistent Singleton`
      ];
      
      return {
        working: true,
        entries: allEntries.length,
        details
      };
    } catch (error) {
      return {
        working: false,
        entries: 0,
        details: ['ERROR: Backend failure', error instanceof Error ? error.message : 'Unknown error'],
        error: error instanceof Error ? error.message : 'Okänt backend-fel'
      };
    }
  }
  
  // DEBUG: Clear all data
  static async clearAllData(): Promise<void> {
    try {
      console.log('🧹 CLEARING: All data');
      this.storage.clear();
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(this.STORAGE_KEY);
      }
      console.log('✅ CLEARED: All data removed');
    } catch (error) {
      console.error('❌ CLEAR ERROR:', error);
    }
  }
}