import { useCallback, useReducer } from 'react';
import { type FilterAction, type FilterState } from '@/types/search';
import { parseUrlFilterParams } from '@/utils/urlUtils';
import { $countFilter, $onlyPriceChanged } from '@/stores/searchStore';

const initialState: FilterState = {
  price: {
    max: 0,
    min: 0,
  },
  rooms: {
    baths: 0,
    bedrooms: 0,
    beds: 0,
  },
  amenities: [],
  reservations: [],
  propertyTypeGroups: [],
};

export const analyzeFilterChanges = (
  current: FilterState,
  initial: FilterState
) => {
  let count = 0;

  const priceChanged =
    current.price.min !== initial.price.min ||
    current.price.max !== initial.price.max;
  if (priceChanged) count++;

  const bedsChanged = current.rooms.beds !== initial.rooms.beds;
  const bathsChanged = current.rooms.baths !== initial.rooms.baths;
  const bedroomsChanged = current.rooms.bedrooms !== initial.rooms.bedrooms;
  count += [bedsChanged, bathsChanged, bedroomsChanged].filter(Boolean).length;

  const amenitiesChanged = current.amenities.length > 0;
  if (amenitiesChanged) count += current.amenities.length;

  const propertyTypeChanged = current.propertyTypeGroups.length > 0;
  if (propertyTypeChanged) count += current.propertyTypeGroups.length;

  const reservationsChanged = current.reservations.length > 0;
  if (reservationsChanged) count += current.reservations.length;

  const onlyPriceChanged =
    priceChanged &&
    !bedsChanged &&
    !bathsChanged &&
    !bedroomsChanged &&
    !amenitiesChanged &&
    !propertyTypeChanged &&
    !reservationsChanged;

  return { count, onlyPriceChanged };
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_PRICE':
      return {
        ...state,
        price: {
          min: action.payload.min,
          max: action.payload.max,
        },
      };
    case 'SET_ROOMS':
      return {
        ...state,
        rooms: {
          baths: action.payload.baths,
          bedrooms: action.payload.bedrooms,
          beds: action.payload.beds,
        },
      };
    case 'SET_ROOM_TYPE':
      return {
        ...state,
        rooms: {
          ...state.rooms,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'TOGGLE_AMENITY':
      return {
        ...state,
        amenities: state.amenities.includes(action.payload)
          ? state.amenities.filter((id) => id !== action.payload)
          : [...state.amenities, action.payload],
      };
    case 'TOGGLE_RESERVATION_OPTION':
      return {
        ...state,
        reservations: state.reservations.includes(action.payload)
          ? state.reservations.filter((id) => id !== action.payload)
          : [...state.reservations, action.payload],
      };
    case 'TOGGLE_PROPERTY_TYPE':
      return {
        ...state,
        propertyTypeGroups: state.propertyTypeGroups.includes(action.payload)
          ? state.propertyTypeGroups.filter((id) => id !== action.payload)
          : [...state.propertyTypeGroups, action.payload],
      };
    case 'SET_AMENITIES':
      return {
        ...state,
        amenities: action.payload,
      };
    case 'SET_RESERVATIONS':
      return {
        ...state,
        reservations: action.payload,
      };
    case 'SET_PROPERTY_TYPE_GROUP':
      return {
        ...state,
        propertyTypeGroups: action.payload,
      };
    case 'LOAD_FROM_URL':
      return {
        ...state,
        ...action.payload,
      };
    case 'RESET_FILTERS':
      return {
        price: { min: 0, max: 0 },
        rooms: { baths: 0, bedrooms: 0, beds: 0 },
        amenities: [],
        reservations: [],
        propertyTypeGroups: [],
      };
    default:
      return state;
  }
}

export const useFilterState = () => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const updatePrice = useCallback((min: number, max: number) => {
    dispatch({ type: 'SET_PRICE', payload: { min, max } });
  }, []);

  const updateRooms = useCallback(
    (baths: number, bedrooms: number, beds: number) => {
      dispatch({
        type: 'SET_ROOMS',
        payload: { baths, bedrooms, beds },
      });
    },
    []
  );

  const updateRoomType = useCallback(
    (key: keyof FilterState['rooms'], value: number) => {
      dispatch({ type: 'SET_ROOM_TYPE', payload: { key, value } });
    },
    []
  );
  const setAmenities = useCallback((ids: string[]) => {
    dispatch({ type: 'SET_AMENITIES', payload: ids });
  }, []);

  const setReservations = useCallback((ids: string[]) => {
    dispatch({ type: 'SET_RESERVATIONS', payload: ids });
  }, []);

  const setPropertyTypes = useCallback((ids: string[]) => {
    dispatch({ type: 'SET_PROPERTY_TYPE_GROUP', payload: ids });
  }, []);

  const analyzeFilterCount = useCallback(() => {
    const { count, onlyPriceChanged } = analyzeFilterChanges(
      state,
      initialState
    );
    $countFilter.set(count);
    $onlyPriceChanged.set(onlyPriceChanged);
  }, [state]);

  const loadFromUrl = useCallback(() => {
    const urlData = parseUrlFilterParams();
    const mergedState: FilterState = {
      price: {
        ...initialState.price,
        ...urlData.price,
      },
      rooms: {
        ...initialState.rooms,
        ...urlData.rooms,
      },
      amenities: urlData.amenities ?? initialState.amenities,
      reservations: urlData.reservations ?? initialState.reservations,
      propertyTypeGroups:
        urlData.propertyTypeGroups ?? initialState.propertyTypeGroups,
    };
    dispatch({ type: 'LOAD_FROM_URL', payload: mergedState });
    const { count } = analyzeFilterChanges(mergedState, initialState);
    $countFilter.set(count);
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return {
    state,
    actions: {
      updatePrice,
      updateRooms,
      updateRoomType,
      setAmenities,
      setReservations,
      setPropertyTypes,
      loadFromUrl,
      resetFilters,
      analyzeFilterCount,
    },
  };
};
