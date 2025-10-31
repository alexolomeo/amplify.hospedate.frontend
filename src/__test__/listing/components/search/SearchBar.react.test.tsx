import { render, screen } from '@testing-library/react';
import { Flexible, SearchCalendarTab, type SearchState } from '@/types/search';
import SearchBar from '@/components/React/Search/SearchBar';
import { addMonths, startOfMonth } from 'date-fns';

Object.defineProperty(window, 'google', {
  value: {
    maps: {
      places: {
        AutocompleteService: jest.fn(),
        PlacesServiceStatus: { OK: 'OK' },
      },
    },
  },
});

jest.mock('@/stores/recentSearchesStore', () => ({
  $recentSearches: {
    get: jest.fn(),
    listen: jest.fn(() => () => {}),
  },
}));

// Mock import.meta
Object.defineProperty(globalThis, 'import', {
  value: { meta: { env: { PUBLIC_GOOGLE_MAPS_API_KEY: 'test' } } },
});

jest.mock('@/components/React/Hooks/useLoadGoogleMaps', () => ({
  __esModule: true,
  default: () => ({ isLoaded: true, loadError: null }),
}));

jest.mock('@/components/React/Hooks/usePlaceAutocompleteSuggestions', () => ({
  __esModule: true,
  usePlaceAutocompleteSuggestions: () => ({ suggestions: [], loading: false }),
}));

const today = new Date();

const mockState: SearchState = {
  guestCount: {
    adults: 9,
    children: 7,
    infants: 5,
    pets: 5,
  },
  destination: {
    placeId: 'asassa',
    googleDescription: 'string',
    userInput: 'string',
  },
  dates: {
    checkIn: null,
    checkOut: null,
    monthlyStart: startOfMonth(addMonths(today, 1)),
    monthlyEnd: startOfMonth(addMonths(today, 3)),
    flexible: Flexible.Week,
    activeTab: SearchCalendarTab.Flexible,
  },
};

test('The button must be enabled if there is a destination', async () => {
  render(
    <SearchBar
      state={mockState}
      onUpdateCalendar={() => {}}
      onUpdateDestination={() => {}}
      onUpdateGuest={() => {}}
      onSearch={() => {}}
      lang="es"
      compactMode={false}
      onUpdateFlexible={() => {}}
      onUpdateMonths={() => {}}
      onUpdateActiveTab={() => {}}
    />
  );
  const searchButton = screen.getByTestId('button-search-listing');
  expect(searchButton).toBeEnabled();
});
