import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useListingProgress } from '@/components/React/Hooks/CreateListing/useListingProgress';
import {
  $listingId,
  $currentStep,
  $progressLoadedFor,
  $listingData,
  $maxStepAllowed,
} from '@/stores/createListing/listingStore';
import { getListingProgressData } from '@/services/createListing';
import type { ListingProgressData } from '@/types/createListing';

vi.mock('@/components/React/CreateListing/ToastContext', () => ({
  useToast: () => ({
    showToast: vi.fn(),
  }),
}));

vi.mock('@/utils/i18n', () => ({
  getTranslation: () => ({
    createListing: {
      toast: {
        errors: {
          fetchFailed: 'No se pudo obtener la información.',
        },
      },
    },
  }),
}));

vi.mock('@/components/React/Utils/create-listing.step-mapping', () => ({
  stepMapping: { '3-1': 7 } as Record<string, number>,
}));

vi.mock('@/components/React/Utils/create-listing.step-slugs', () => ({
  STEP_SLUGS: [
    'overview',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'mock-slug',
  ] as string[],
}));

vi.mock('@/services/createListing', () => ({
  getListingProgressData: vi.fn(),
}));

const getProgressMock = vi.mocked(getListingProgressData);

function resetStores() {
  $listingId.set(null);
  $currentStep.set(0);
  $progressLoadedFor.set(null);
  $maxStepAllowed.set(0);
  $listingData.set({
    place_information: { showSpecificLocation: false },
    place_features: {},
    place_setup: {},
  });
}

function makeProgressData(): ListingProgressData {
  return {
    placeTypeId: 2,
    location: {
      address: 'Main St 123',
      city: 'La Paz',
      state: 'LP',
      country: 'BO',
      coordinates: { latitude: -16.5, longitude: -68.15 },
      apt: '5B',
    },
    guestNumber: 3,
    roomNumber: 1,
    bedNumber: 2,
    bathNumber: 1,
    showSpecificLocation: true,

    amenities: [
      { id: 10, name: 'Wi-Fi', icon: 'wifi', amenityGroupType: 'Preferred' },
    ],
    photos: [
      {
        id: 99,
        order: 1,
        original: 'x',
        srcsetWebp: '',
        srcsetAvif: '',
        caption: '',
      },
    ],
    title: 'My place',
    description: 'Nice',

    nightlyPrice: 100,
    discount: { weeklyDiscount: 5, monthlyDiscount: 10 },

    currentStep: 3,
    currentSubStep: 1,
  };
}

describe('useListingProgress', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetStores();
    window.history.replaceState({}, '', '/');
  });

  it('loads progress when there is an initialListingId, updates stores and replaces the URL with the slug', async () => {
    const mockRes = makeProgressData();
    getProgressMock.mockResolvedValueOnce(mockRes);

    const setLoading = vi.fn();

    renderHook(() =>
      useListingProgress({
        initialListingId: '123',
        stepSlug: undefined,
        setLoading,
        lang: 'es',
      })
    );

    await waitFor(() => {
      expect(getProgressMock).toHaveBeenCalledWith('123', {
        skipGlobal404Redirect: true,
      });

      expect($listingId.get()).toBe('123');
      expect($progressLoadedFor.get()).toBe('123');
      expect($currentStep.get()).toBe(7);
      expect($maxStepAllowed.get()).toBe(7);

      expect(window.location.pathname).toBe('/listing/create/123/mock-slug');

      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });

  it('if progress was already loaded for that ID, does not call the API and only sets loading=false', async () => {
    $progressLoadedFor.set('abc');

    const setLoading = vi.fn();

    renderHook(() =>
      useListingProgress({
        initialListingId: 'abc',
        stepSlug: undefined,
        setLoading,
        lang: 'es',
      })
    );

    await waitFor(() => {
      expect(getProgressMock).not.toHaveBeenCalled();
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });

  it('if there is no initialListingId and no $listingId, does nothing and sets loading=false', async () => {
    const setLoading = vi.fn();

    renderHook(() =>
      useListingProgress({
        initialListingId: undefined,
        stepSlug: undefined,
        setLoading,
        lang: 'es',
      })
    );

    await waitFor(() => {
      expect(getProgressMock).not.toHaveBeenCalled();
      expect(setLoading).toHaveBeenCalledWith(false);
      expect($listingId.get()).toBeNull();
    });
  });

  it('if stepSlug is provided, does not replace the URL (keeps the current URL)', async () => {
    const mockRes = makeProgressData();
    getProgressMock.mockResolvedValueOnce(mockRes);

    const setLoading = vi.fn();

    window.history.replaceState({}, '', '/listing/create/123/overview');

    renderHook(() =>
      useListingProgress({
        initialListingId: '123',
        stepSlug: 'overview',
        setLoading,
        lang: 'es',
      })
    );

    await waitFor(() => {
      expect(getProgressMock).toHaveBeenCalledWith('123', {
        skipGlobal404Redirect: true,
      });
      expect($currentStep.get()).toBe(7);
      expect($maxStepAllowed.get()).toBe(7);
      expect(window.location.pathname).toBe('/listing/create/123/overview');
      expect(setLoading).toHaveBeenCalledWith(false);
    });
  });
});
