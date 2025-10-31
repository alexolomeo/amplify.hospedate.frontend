import { STEP_VALIDATIONS } from '@/components/React/Validation/create-listing-validation.rules';
import { STEPS } from '@/components/React/Utils/create-listing.steps';
import type { CreateListingData, ListingPhoto } from '@/types/createListing';

const createMockData = (
  overrides: Partial<CreateListingData>
): CreateListingData => ({
  place_information: {},
  place_features: {},
  place_setup: {},
  ...overrides,
});

describe('STEP_VALIDATIONS', () => {
  describe('PLACE_INFORMATION_PLACE_TYPE', () => {
    it('should pass if placeTypeId is defined', () => {
      const data = createMockData({ place_information: { placeTypeId: 1 } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_PLACE_TYPE](data);
      expect(result).toBe(true);
    });

    it('should fail if placeTypeId is undefined', () => {
      const data = createMockData({ place_information: {} });
      const result = STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_PLACE_TYPE](data);
      expect(result).toBe(false);
    });
  });

  describe('PLACE_INFORMATION_PICK_LOCATION', () => {
    it('should pass if coordinates are valid', () => {
      const data = createMockData({
        place_information: {
          location: {
            address: '',
            city: '',
            state: '',
            country: '',
            coordinates: { latitude: -17.8, longitude: -63.2 },
          },
        },
      });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_PICK_LOCATION](data);
      expect(result).toBe(true);
    });

    it('should fail if coordinates are not defined', () => {
      const data = createMockData({
        place_information: {
          location: {
            address: '',
            city: '',
            state: '',
            country: '',
            coordinates: undefined!,
          },
        },
      });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_PICK_LOCATION](data);
      expect(result).toBe(false);
    });

    it('should fail if location itself is not defined', () => {
      const data = createMockData({ place_information: {} });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_PICK_LOCATION](data);
      expect(result).toBe(false);
    });
  });

  describe('PLACE_INFORMATION_CONFIRM_LOCATION', () => {
    it('should pass if all required fields are defined', () => {
      const data = createMockData({
        place_information: {
          location: {
            address: 'Av. Principal',
            city: 'Santa Cruz',
            state: 'Santa Cruz',
            country: 'Bolivia',
            coordinates: { latitude: -17.8, longitude: -63.2 },
          },
          showSpecificLocation: false,
        },
      });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_CONFIRM_LOCATION](data);
      expect(result).toBe(true);
    });

    it('should fail if any required location text field is missing', () => {
      const data = createMockData({
        place_information: {
          location: {
            address: 'Av. Principal',
            city: '',
            state: 'Santa Cruz',
            country: 'Bolivia',
            coordinates: { latitude: -17.8, longitude: -63.2 },
          },
          showSpecificLocation: false,
        },
      });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_CONFIRM_LOCATION](data);
      expect(result).toBe(false);
    });

    it('should fail if showSpecificLocation is undefined', () => {
      const data = createMockData({
        place_information: {
          location: {
            address: 'Av. Principal',
            city: 'Santa Cruz',
            state: 'Santa Cruz',
            country: 'Bolivia',
            coordinates: { latitude: -17.8, longitude: -63.2 },
          },
        },
      });
      const result =
        STEP_VALIDATIONS[STEPS.PLACE_INFORMATION_CONFIRM_LOCATION](data);
      expect(result).toBe(false);
    });
  });

  describe('PLACE_FEATURES_UPLOAD_PHOTOS', () => {
    const mockPhoto: ListingPhoto = {
      id: 1,
      original: 'url',
      srcsetWebp: '',
      srcsetAvif: '',
      caption: '',
      order: 1,
    };

    it('should return false if photos array is not present', () => {
      const data = createMockData({ place_features: {} });
      const result = STEP_VALIDATIONS[STEPS.PLACE_FEATURES_UPLOAD_PHOTOS](data);
      expect(result).toBe(false);
    });

    it('should return false if photos array is empty', () => {
      const data = createMockData({ place_features: { photos: [] } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_FEATURES_UPLOAD_PHOTOS](data);
      expect(result).toBe(false);
    });

    it('should return true if at least one photo exists', () => {
      const data = createMockData({ place_features: { photos: [mockPhoto] } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_FEATURES_UPLOAD_PHOTOS](data);
      expect(result).toBe(true);
    });
  });

  describe('PLACE_FEATURES_GALLERY', () => {
    const mockPhoto: ListingPhoto = {
      id: 1,
      original: 'url',
      srcsetWebp: '',
      srcsetAvif: '',
      caption: '',
      order: 1,
    };

    it('should return false if less than 5 photos are present', () => {
      const data = createMockData({
        place_features: { photos: Array(4).fill(mockPhoto) },
      });
      const result = STEP_VALIDATIONS[STEPS.PLACE_FEATURES_GALLERY](data);
      expect(result).toBe(false);
    });

    it('should return true if exactly 5 photos are present', () => {
      const data = createMockData({
        place_features: { photos: Array(5).fill(mockPhoto) },
      });
      const result = STEP_VALIDATIONS[STEPS.PLACE_FEATURES_GALLERY](data);
      expect(result).toBe(true);
    });
  });

  describe('PLACE_FEATURES_TITLE', () => {
    it('should pass if title has content', () => {
      const data = createMockData({
        place_features: { title: 'Hermoso lugar' },
      });
      expect(STEP_VALIDATIONS[STEPS.PLACE_FEATURES_TITLE](data)).toBe(true);
    });

    it('should fail if title is empty or just spaces', () => {
      const data = createMockData({ place_features: { title: '  ' } });
      expect(STEP_VALIDATIONS[STEPS.PLACE_FEATURES_TITLE](data)).toBe(false);
    });
  });

  describe('PLACE_FEATURES_DESCRIPTION', () => {
    it('should fail if description is empty or just spaces', () => {
      const data = createMockData({ place_features: { description: '  ' } });
      expect(STEP_VALIDATIONS[STEPS.PLACE_FEATURES_DESCRIPTION](data)).toBe(
        false
      );
    });

    it('should return true if description has valid text', () => {
      const data = createMockData({
        place_features: { description: 'Cómodo apartamento.' },
      });
      expect(STEP_VALIDATIONS[STEPS.PLACE_FEATURES_DESCRIPTION](data)).toBe(
        true
      );
    });
  });

  describe('PLACE_SETUP_PRICING', () => {
    it('should return false if nightlyPrice is below 50', () => {
      const data = createMockData({ place_setup: { nightlyPrice: 49 } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_PRICING](data);
      expect(result).toBe(false);
    });

    it('should return true if nightlyPrice is exactly 50', () => {
      const data = createMockData({ place_setup: { nightlyPrice: 50 } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_PRICING](data);
      expect(result).toBe(true);
    });

    it('should return true if nightlyPrice is exactly 10000', () => {
      const data = createMockData({ place_setup: { nightlyPrice: 10000 } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_PRICING](data);
      expect(result).toBe(true);
    });

    it('should return false if nightlyPrice is greater than 10000', () => {
      const data = createMockData({ place_setup: { nightlyPrice: 10001 } });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_PRICING](data);
      expect(result).toBe(false);
    });
  });

  describe('PLACE_SETUP_DISCOUNT', () => {
    it('should return true if discount object is not present', () => {
      const data = createMockData({ place_setup: {} });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_DISCOUNT](data);
      expect(result).toBe(true);
    });

    it('should return false if both discounts are > 0 and monthly <= weekly', () => {
      const data = createMockData({
        place_setup: { discount: { weeklyDiscount: 15, monthlyDiscount: 10 } },
      });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_DISCOUNT](data);
      expect(result).toBe(false);
    });

    it('should return true if both are > 0 and monthly > weekly', () => {
      const data = createMockData({
        place_setup: { discount: { weeklyDiscount: 10, monthlyDiscount: 15 } },
      });
      const result = STEP_VALIDATIONS[STEPS.PLACE_SETUP_DISCOUNT](data);
      expect(result).toBe(true);
    });
  });
});
