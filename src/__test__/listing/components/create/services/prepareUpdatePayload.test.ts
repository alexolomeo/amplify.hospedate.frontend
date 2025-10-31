import { extractPayloadFromData } from '@/components/React/Utils/prepareUpdatePayload';
import type {
  CreateListingData,
  UpdateListingStepData,
} from '@/types/createListing';

describe('extractPayloadFromData', () => {
  it('should extract data correctly from complete input', () => {
    const input: CreateListingData = {
      place_information: {
        placeTypeId: 1,
        guestNumber: 2,
        roomNumber: 1,
        bedNumber: 1,
        bathNumber: 1,
        location: {
          address: '123 St',
          city: 'Santa Cruz',
          state: 'SC',
          country: 'Bolivia',
          coordinates: {
            latitude: -17.8,
            longitude: -63.1,
          },
        },
        showSpecificLocation: true,
      },
      place_features: {
        title: 'Hermoso lugar',
        description: 'Ideal para descansar',
        amenities: [
          { id: 1, name: 'Wifi', icon: 'wifi', amenityGroupType: 'Preferred' },
          { id: 2, name: 'A/C', icon: 'ac', amenityGroupType: 'Standout' },
        ],
        photos: [],
      },
      place_setup: {
        nightlyPrice: 100,
        discount: {
          weeklyDiscount: 10,
          monthlyDiscount: 20,
        },
      },
    };

    const expected: UpdateListingStepData = {
      placeTypeId: 1,
      guestNumber: 2,
      roomNumber: 1,
      bedNumber: 1,
      bathNumber: 1,
      location: input.place_information.location,
      showSpecificLocation: true,
      title: 'Hermoso lugar',
      description: 'Ideal para descansar',
      amenities: [1, 2],
      nightlyPrice: 100,
      discount: {
        weeklyDiscount: 10,
        monthlyDiscount: 20,
      },
    };

    const result = extractPayloadFromData(input);
    expect(result).toEqual(expected);
  });

  it('should handle missing optional fields gracefully', () => {
    const input: CreateListingData = {
      place_information: {
        showSpecificLocation: false,
      },
      place_features: {},
      place_setup: {},
    };

    const result = extractPayloadFromData(input);

    expect(result).toEqual({
      placeTypeId: undefined,
      guestNumber: undefined,
      roomNumber: undefined,
      bedNumber: undefined,
      bathNumber: undefined,
      location: undefined,
      showSpecificLocation: false,
      title: undefined,
      description: undefined,
      amenities: undefined,
      nightlyPrice: undefined,
      discount: undefined,
    });
  });
});
