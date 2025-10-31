import {
  SearchCalendarTab,
  type FilterState,
  type Flexible,
  type SearchState,
} from '@/types/search';
import { parse, format, isValid, startOfMonth, addMonths } from 'date-fns';

export const parseUrlDate = (
  dateStr: string | null,
  fieldName: string
): Date | null => {
  if (!dateStr) return null;

  try {
    const parsed = parse(dateStr, 'yyyy-MM-dd', new Date());
    if (isValid(parsed)) {
      return parsed;
    }
    console.warn(`Invalid date format for ${fieldName}:`, dateStr);
    return null;
  } catch (error) {
    console.warn(`Error parsing ${fieldName}:`, error);
    return null;
  }
};

export const parseUrlInt = (
  value: string | null,
  fieldName: string,
  defaultValue: number
): number => {
  if (!value) return defaultValue;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    console.warn(`Invalid integer for ${fieldName}:`, value);
    return defaultValue;
  }

  return parsed;
};

export const parseUrlParams = (): Partial<SearchState> => {
  const urlParams = new URLSearchParams(window.location.search);
  const today = new Date();

  // Safe URL decoding
  const safeDecodeURIComponent = (str: string): string => {
    try {
      return decodeURIComponent(str);
    } catch (error) {
      console.warn('Error decoding URI component:', error);
      return str;
    }
  };

  return {
    destination: {
      placeId: urlParams.get('placeId') || '',
      googleDescription: urlParams.get('googleDestination')
        ? safeDecodeURIComponent(urlParams.get('googleDestination')!)
        : '',
      userInput: urlParams.get('userDestination')
        ? safeDecodeURIComponent(urlParams.get('userDestination')!)
        : '',
    },
    guestCount: {
      adults: parseUrlInt(urlParams.get('adults'), 'adults', 1),
      children: parseUrlInt(urlParams.get('children'), 'children', 0),
      infants: parseUrlInt(urlParams.get('infants'), 'infants', 0),
      pets: parseUrlInt(urlParams.get('numPets'), 'pets', 0),
    },
    dates: {
      checkIn: parseUrlDate(urlParams.get('checkInDate'), 'checkInDate'),
      checkOut: parseUrlDate(urlParams.get('checkoutDate'), 'checkoutDate'),
      monthlyStart:
        parseUrlDate(urlParams.get('monthStart'), 'monthStart') ||
        startOfMonth(addMonths(today, 1)),
      monthlyEnd:
        parseUrlDate(urlParams.get('monthEnd'), 'monthEnd') ||
        startOfMonth(addMonths(today, 3)),
      flexible: (urlParams.get('flexible') as Flexible) || null,
      activeTab:
        (urlParams.get('activeTab') as SearchCalendarTab) ||
        SearchCalendarTab.Calendar,
    },
  };
};

export const parseUrlFilterParams = (): Partial<FilterState> => {
  const urlParams = new URLSearchParams(window.location.search);
  // helpers
  const parseIntSafe = (val: string | null, fallback = 0): number =>
    val && !isNaN(parseInt(val)) ? parseInt(val) : fallback;
  const parseArray = (val: string | null): string[] =>
    val ? val.split(',').map((v) => v) : [];

  return {
    price: {
      min: parseIntSafe(urlParams.get('minPrice')),
      max: parseIntSafe(urlParams.get('maxPrice')),
    },
    rooms: {
      baths: parseIntSafe(urlParams.get('minBaths')),
      bedrooms: parseIntSafe(urlParams.get('minRooms')),
      beds: parseIntSafe(urlParams.get('minBeds')),
    },
    amenities: parseArray(urlParams.get('amenities')),
    reservations: parseArray(urlParams.get('reservationOptions')),
    propertyTypeGroups: parseArray(urlParams.get('propertyTypeGroups')),
  };
};

export const buildSearchParams = (
  searchState: SearchState
): URLSearchParams => {
  const params = new URLSearchParams();

  // Helper function to add parameter if value exists
  const addParam = (
    key: string,
    value: string | number | Date | null | undefined,
    formatter?: (v: string | number | Date) => string
  ) => {
    if (value !== null && value !== undefined && value !== '') {
      const formattedValue = formatter
        ? formatter(value as string | number | Date)
        : String(value);
      params.append(key, formattedValue);
    }
  };

  // Destination
  addParam('placeId', searchState.destination.placeId);
  addParam(
    'googleDestination',
    searchState.destination.googleDescription,
    (v) => encodeURIComponent(String(v))
  );
  addParam('userDestination', searchState.destination.userInput, (v) =>
    encodeURIComponent(String(v))
  );

  // Guest count (only add if > 0 for non-adults)
  const { adults, children, infants, pets } = searchState.guestCount;
  if (adults > 0) addParam('adults', adults);
  if (children > 0) addParam('children', children);
  if (infants > 0) addParam('infants', infants);
  if (pets > 0) addParam('numPets', pets);

  // Dates
  const { dates } = searchState;
  addParam('checkInDate', dates.checkIn, (date) => format(date, 'yyyy-MM-dd'));
  addParam('checkoutDate', dates.checkOut, (date) =>
    format(date, 'yyyy-MM-dd')
  );
  addParam('monthStart', dates.monthlyStart, (date) =>
    format(date, 'yyyy-MM-dd')
  );
  addParam('monthEnd', dates.monthlyEnd, (date) => format(date, 'yyyy-MM-dd'));
  addParam('flexible', dates.flexible);
  addParam('activeTab', dates.activeTab);

  return params;
};

export const updateUrlWithFilters = (filters: FilterState) => {
  if (
    !filters ||
    typeof filters !== 'object' ||
    !filters.price ||
    typeof filters.price.min !== 'number' ||
    typeof filters.price.max !== 'number' ||
    !filters.rooms ||
    typeof filters.rooms.beds !== 'number' ||
    typeof filters.rooms.baths !== 'number' ||
    typeof filters.rooms.bedrooms !== 'number' ||
    !Array.isArray(filters.amenities) ||
    !Array.isArray(filters.propertyTypeGroups) ||
    !Array.isArray(filters.reservations)
  ) {
    throw new Error('Invalid FilterState object provided.');
  }

  const params = buildFilterParams(filters);
  const newUrl = `${window.location.pathname}?${params.toString()}`;

  try {
    window.history.replaceState({}, '', newUrl);
  } catch (error) {
    console.error('Failed to update URL with filters:', error);
    throw new Error('Failed to update browser URL. Please try again.');
  }
};

export const buildFilterParams = (filters: FilterState): URLSearchParams => {
  const params = new URLSearchParams(window.location.search);

  const setOrDeleteParam = (
    key: string,
    value: string | number | string[] | undefined | null
  ) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','));
      } else {
        params.delete(key);
      }
    } else if (typeof value === 'number') {
      if (value > 0) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    } else if (value) {
      params.set(key, value.toString());
    } else {
      params.delete(key);
    }
  };

  setOrDeleteParam('minPrice', filters.price.min);
  setOrDeleteParam('maxPrice', filters.price.max);
  setOrDeleteParam('minBeds', filters.rooms.beds);
  setOrDeleteParam('minBaths', filters.rooms.baths);
  setOrDeleteParam('minRooms', filters.rooms.bedrooms);

  setOrDeleteParam('amenities', filters.amenities);
  setOrDeleteParam('propertyTypeGroups', filters.propertyTypeGroups);
  setOrDeleteParam('reservationOptions', filters.reservations);

  return params;
};
