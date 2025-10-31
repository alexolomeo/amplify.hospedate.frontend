export interface Guests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface QueryParams {
  adults: number;

  children?: number;
  infants?: number;
  numPets?: number;

  checkInDate?: string;
  checkoutDate?: string;

  placeId?: string;
  roomType?: RoomType;
  flexible?: Flexible;

  northEastLat?: string;
  northEastLng?: string;
  southWestLat?: string;
  southWestLng?: string;

  zoom?: number;
  searchType: SearchType;

  limit: number;
  offset?: number;

  maxPrice?: number;
  minPrice?: number;

  minBeds?: number;
  minBaths?: number;
  minRooms?: number;
  amenities?: string[];
  propertyTypeGroups?: string[];
  reservationOptions?: string[];
}

export interface UseSearchReturn {
  getGuestSubtitle: (defaultText: string) => string;
  getValidatedGuestCount: (type: keyof Guests, value: number) => number;
  isIncreaseDisabled: (type: keyof Guests) => boolean;
  isDecreaseDisabled: (type: keyof Guests) => boolean;
}

export enum Flexible {
  Week = 'WEEK',
  Weekend = 'WEEKEND',
  Month = 'MONTH',
}

export enum RoomType {
  EntireHome = 'ENTIRE_HOME',
  PrivateRoom = 'PRIVATE_ROOM',
  SharedRoom = 'SHARED_ROOM',
}

export enum SearchType {
  List = 'LIST',
  Map = 'MAP',
}

export type Bounds = {
  northEastLat: number;
  northEastLng: number;
  southWestLat: number;
  southWestLng: number;
};

export type MapState = {
  bounds: Bounds;
  zoom: number;
};

export enum SearchCalendarTab {
  Calendar = 'CALENDAR',
  Months = 'MONTHS',
  Flexible = 'FLEXIBLE',
}
export interface SearchState {
  destination: {
    placeId: string | null;
    googleDescription: string;
    userInput: string;
  };
  guestCount: Guests;
  dates: {
    checkIn: Date | null;
    checkOut: Date | null;
    monthlyStart: Date;
    monthlyEnd: Date;
    flexible: Flexible | null;
    activeTab: SearchCalendarTab;
  };
}
export interface FilterState {
  price: {
    max: number;
    min: number;
  };
  rooms: {
    baths: number;
    bedrooms: number;
    beds: number;
  };
  amenities: string[];
  reservations: string[];
  propertyTypeGroups: string[];
}

export type SearchAction =
  | {
      type: 'SET_DESTINATION';
      payload: {
        placeId: string | null;
        googleDescription: string;
        userInput: string;
      };
    }
  | { type: 'SET_GUEST_COUNT'; payload: Guests }
  | {
      type: 'SET_CALENDAR_DATES';
      payload: { checkIn: Date | null; checkOut: Date | null };
    }
  | { type: 'SET_MONTHLY_DATES'; payload: { start: Date; end: Date } }
  | { type: 'SET_FLEXIBLE'; payload: Flexible }
  | { type: 'SET_ACTIVE_TAB'; payload: SearchCalendarTab }
  | { type: 'LOAD_FROM_URL'; payload: Partial<SearchState> }
  | { type: 'RESET_SEARCH' };

export type FilterAction =
  | {
      type: 'SET_PRICE';
      payload: { min: number; max: number };
    }
  | {
      type: 'SET_ROOMS';
      payload: { baths: number; bedrooms: number; beds: number };
    }
  | {
      type: 'SET_ROOM_TYPE';
      payload: { key: keyof FilterState['rooms']; value: number };
    }
  | { type: 'TOGGLE_AMENITY'; payload: string }
  | { type: 'TOGGLE_RESERVATION_OPTION'; payload: string }
  | { type: 'TOGGLE_PROPERTY_TYPE'; payload: string }
  | { type: 'SET_AMENITIES'; payload: string[] }
  | { type: 'SET_RESERVATIONS'; payload: string[] }
  | { type: 'SET_PROPERTY_TYPE_GROUP'; payload: string[] }
  | { type: 'LOAD_FROM_URL'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' };

export interface Filters {
  amenities: Amenity[];
  priceRange: PriceRange;
  propertyTypes: PropertyType[];
  reservationOptions: ReservationOption[];
  roomsAndBeds: RoomsAndBeds;
}
export interface PriceRange {
  max: number;
  min: number;
  currency: string;
}
export interface PropertyType {
  icon: string;
  id: string;
  name: string;
}
export interface ReservationOption {
  icon: string;
  id: string;
  name: string;
}
export interface RoomsAndBeds {
  baths?: number;
  bedrooms?: number;
  beds?: number;
}
export interface Amenity {
  amenityGroup: string;
  icon: string;
  id: string;
  name: string;
}
