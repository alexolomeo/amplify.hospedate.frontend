import { useCallback } from 'react';
import { addDays } from 'date-fns';
import type { Flexible, SearchCalendarTab, SearchState } from '@/types/search';
import { buildSearchParams } from '@/utils/urlUtils';
import { addOrUpdateRecentSearch } from '@/stores/recentSearchesStore';

const shouldStoreRecentSearch = (state: SearchState): boolean => {
  return !!(
    state.dates.activeTab !== 'FLEXIBLE' &&
    state.destination.placeId &&
    ((state.dates.checkIn && state.dates.checkOut) ||
      (state.dates.monthlyStart && state.dates.monthlyEnd))
  );
};

export const useSearchNavigation = () => {
  const navigate = useCallback((searchState: SearchState) => {
    try {
      let stateWithDefaults = {
        ...searchState,
        dates: {
          ...searchState.dates,
          checkOut:
            searchState.dates.checkOut ||
            (searchState.dates.checkIn
              ? addDays(searchState.dates.checkIn, 1)
              : null),
        },
      };
      if (
        stateWithDefaults.dates.activeTab === 'CALENDAR' &&
        !stateWithDefaults.dates.checkIn &&
        !stateWithDefaults.dates.checkOut
      ) {
        stateWithDefaults = {
          ...stateWithDefaults,
          dates: {
            ...stateWithDefaults.dates,
            activeTab: 'FLEXIBLE' as SearchCalendarTab,
            flexible: 'WEEK' as Flexible,
          },
        };
      }
      if (shouldStoreRecentSearch(stateWithDefaults)) {
        const searchDataToStore = {
          placeId: stateWithDefaults.destination.placeId,
          googleDescription: stateWithDefaults.destination.googleDescription,
          userInput: stateWithDefaults.destination.userInput,
          dates: stateWithDefaults.dates,
          guestCount: stateWithDefaults.guestCount,
        };
        addOrUpdateRecentSearch(searchDataToStore);
      }
      const params = buildSearchParams(stateWithDefaults);
      const searchUrl = `/search?${params.toString()}`;
      window.location.href = searchUrl;
    } catch (error) {
      console.error('Error navigating to search:', error);
      window.location.href = '/search';
    }
  }, []);
  return { navigate };
};
