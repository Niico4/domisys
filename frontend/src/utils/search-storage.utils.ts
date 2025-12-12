const RECENT_SEARCHES_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Gets recent searches from sessionStorage
 */
export const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = sessionStorage.getItem(RECENT_SEARCHES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading recent searches from sessionStorage:', error);
    return [];
  }
};

/**
 * Adds a search term to recent searches (max 10)
 */
export const addRecentSearch = (searchTerm: string): void => {
  if (typeof window === 'undefined' || !searchTerm.trim()) return;

  try {
    const recent = getRecentSearches();
    // Remove if already exists (to avoid duplicates)
    const filtered = recent.filter((term) => term.toLowerCase() !== searchTerm.toLowerCase());
    // Add to the beginning
    const updated = [searchTerm.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
    sessionStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search to sessionStorage:', error);
  }
};

/**
 * Clears all recent searches
 */
export const clearRecentSearches = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Error clearing recent searches from sessionStorage:', error);
  }
};
