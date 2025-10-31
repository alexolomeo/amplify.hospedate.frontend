import { analyzeFilterChanges } from '@/components/React/Hooks/Search/useFilterState';
import type { FilterState } from '@/types/search';

describe('analyzeFilterChanges', () => {
  const initial: FilterState = {
    price: { min: 0, max: 0 },
    rooms: { baths: 0, bedrooms: 0, beds: 0 },
    amenities: [],
    reservations: [],
    propertyTypeGroups: [],
  };

  it('should return 0 count and onlyPriceChanged false for initial state', () => {
    const current: FilterState = { ...initial };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(0);
    expect(onlyPriceChanged).toBe(false);
  });

  //  Price Changes
  it('should count 1 and set onlyPriceChanged true if only price changes', () => {
    const current: FilterState = { ...initial, price: { min: 50, max: 200 } };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(true);
  });

  it('should count 1 and set onlyPriceChanged true if only min price changes', () => {
    const current: FilterState = { ...initial, price: { min: 1, max: 0 } };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(true);
  });

  it('should count 1 and set onlyPriceChanged true if only max price changes', () => {
    const current: FilterState = { ...initial, price: { min: 0, max: 100 } };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(true);
  });

  //  Rooms Changes
  it('should count 1 if only beds change', () => {
    const current: FilterState = {
      ...initial,
      rooms: { ...initial.rooms, beds: 1 },
    };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(false); // Not only price
  });

  it('should count 2 if beds and baths change', () => {
    const current: FilterState = {
      ...initial,
      rooms: { ...initial.rooms, beds: 1, baths: 1 },
    };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(2);
    expect(onlyPriceChanged).toBe(false);
  });

  //  Amenities Changes
  it('should count number of amenities if amenities change', () => {
    const current: FilterState = { ...initial, amenities: ['wifi', 'pool'] };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(2);
    expect(onlyPriceChanged).toBe(false);
  });

  // Property Type Changes
  it('should count number of property types if propertyTypeGroup changes', () => {
    const current: FilterState = {
      ...initial,
      propertyTypeGroups: ['entire_place'],
    };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(false);
  });

  // Reservations Changes
  it('should count number of reservations if reservations change', () => {
    const current: FilterState = { ...initial, reservations: ['instant_book'] };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(1);
    expect(onlyPriceChanged).toBe(false);
  });

  // Mixed Changes
  it('should count correctly for mixed changes (price, rooms, amenities)', () => {
    const current: FilterState = {
      price: { min: 10, max: 100 }, // 1
      rooms: { baths: 1, bedrooms: 2, beds: 0 }, // 2
      amenities: ['wifi'], // 1
      reservations: [],
      propertyTypeGroups: [],
    };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(4); // 1+2+1=4
    expect(onlyPriceChanged).toBe(false);
  });

  it('should count correctly for mixed changes (all types)', () => {
    const current: FilterState = {
      price: { min: 10, max: 100 }, // +1
      rooms: { baths: 1, bedrooms: 2, beds: 3 }, // +3
      amenities: ['wifi', 'pool'], // +2
      reservations: ['instant_book'], // +1
      propertyTypeGroups: ['entire_place', 'private_room'], // +2
    };
    const { count, onlyPriceChanged } = analyzeFilterChanges(current, initial);
    expect(count).toBe(9); // 1 + 3 + 2 + 1 + 2 = 9
    expect(onlyPriceChanged).toBe(false);
  });
});
