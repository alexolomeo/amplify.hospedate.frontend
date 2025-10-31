import { useCallback, useReducer } from 'react';
import { startOfMonth, addMonths } from 'date-fns';
import {
  Flexible,
  SearchCalendarTab,
  type SearchAction,
  type SearchState,
} from '@/types/search';
import { parseUrlParams } from '@/utils/urlUtils';

const today = new Date();
const initialState: SearchState = {
  guestCount: {
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  },
  destination: {
    placeId: '',
    googleDescription: '',
    userInput: '',
  },
  dates: {
    checkIn: null,
    checkOut: null,
    monthlyStart: startOfMonth(addMonths(today, 1)),
    monthlyEnd: startOfMonth(addMonths(today, 3)),
    flexible: null,
    activeTab: SearchCalendarTab.Calendar,
  },
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_DESTINATION':
      return {
        ...state,
        destination: action.payload,
      };
    case 'SET_GUEST_COUNT':
      return { ...state, guestCount: action.payload };
    case 'SET_CALENDAR_DATES':
      return {
        ...state,
        dates: {
          ...state.dates,
          checkIn: action.payload.checkIn,
          checkOut: action.payload.checkOut,
          activeTab: SearchCalendarTab.Calendar,
        },
      };
    case 'SET_MONTHLY_DATES':
      return {
        ...state,
        dates: {
          ...state.dates,
          monthlyStart: action.payload.start,
          monthlyEnd: action.payload.end,
          activeTab: SearchCalendarTab.Months,
        },
      };
    case 'SET_FLEXIBLE':
      return {
        ...state,
        dates: {
          ...state.dates,
          flexible: action.payload,
          activeTab: SearchCalendarTab.Flexible,
        },
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        dates: {
          ...state.dates,
          activeTab: action.payload,
        },
      };
    case 'LOAD_FROM_URL':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const useSearchState = () => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const updateDestination = useCallback(
    (placeId: string | null, googleDescription: string, userInput: string) => {
      dispatch({
        type: 'SET_DESTINATION',
        payload: { placeId, googleDescription, userInput },
      });
    },
    []
  );

  const updateGuestCount = useCallback(
    (guestCount: SearchState['guestCount']) => {
      dispatch({ type: 'SET_GUEST_COUNT', payload: guestCount });
    },
    []
  );

  const updateCalendarDates = useCallback(
    (checkIn: Date | null, checkOut: Date | null) => {
      dispatch({ type: 'SET_CALENDAR_DATES', payload: { checkIn, checkOut } });
    },
    []
  );

  const updateMonthlyDates = useCallback((start: Date, end: Date) => {
    dispatch({ type: 'SET_MONTHLY_DATES', payload: { start, end } });
  }, []);

  const updateFlexible = useCallback((flexible: Flexible) => {
    dispatch({ type: 'SET_FLEXIBLE', payload: flexible });
  }, []);

  const updateActiveTab = useCallback((activeTab: SearchCalendarTab) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: activeTab });
  }, []);

  const loadFromUrl = useCallback(() => {
    const urlData = parseUrlParams();
    dispatch({ type: 'LOAD_FROM_URL', payload: urlData });
  }, []);

  const resetSearch = useCallback(() => {
    dispatch({ type: 'RESET_SEARCH' });
  }, []);

  return {
    state,
    actions: {
      updateDestination,
      updateGuestCount,
      updateCalendarDates,
      updateMonthlyDates,
      updateFlexible,
      updateActiveTab,
      loadFromUrl,
      resetSearch,
    },
  };
};
