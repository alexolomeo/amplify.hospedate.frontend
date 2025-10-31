import { persistentAtom } from '@nanostores/persistent';
import type { SearchState } from '@/types/search';

export interface RecentSearchItem {
  placeId: string | null;
  googleDescription: string;
  userInput: string;
  dates: SearchState['dates'];
  guestCount: SearchState['guestCount'];
  timestamp: number;
}

export const recentSearches = persistentAtom<RecentSearchItem[]>(
  'recentSearches',
  [],
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

const MAX_RECENT_SEARCHES = 5;

export function addOrUpdateRecentSearch(
  newSearch: Omit<RecentSearchItem, 'timestamp'>
) {
  const currentSearches = recentSearches.get();

  // Check if there's already a search with the same placeId
  const existingSearchIndex = currentSearches.findIndex(
    (item) => item.placeId === newSearch.placeId
  );

  const newItem = { ...newSearch, timestamp: Date.now() };
  let updatedSearches;

  if (existingSearchIndex !== -1) {
    // If it exists, update it and move it to the beginning.
    const tempSearches = [...currentSearches];
    tempSearches.splice(existingSearchIndex, 1);
    updatedSearches = [newItem, ...tempSearches];
  } else {
    // If it doesn't exist, add it to the beginning.
    updatedSearches = [newItem, ...currentSearches];
  }
  const limitedSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);

  // save.
  recentSearches.set(limitedSearches);
}
