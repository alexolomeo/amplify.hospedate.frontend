import { describe, it, beforeEach, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCreationOptions } from '@/components/React/Hooks/CreateListing/useCreationOptions';
import {
  $creationOptions,
  $isCreateListingReset,
} from '@/stores/createListing/creationOptionsStore';
import { getListingCreationData } from '@/services/createListing';
import type { ListingCreationData } from '@/types/createListing';

vi.mock('@/services/createListing', () => ({
  getListingCreationData: vi.fn(),
}));
const getCreationMock = vi.mocked(getListingCreationData);

function resetStores() {
  $creationOptions.set(null);
  $isCreateListingReset.set(false);
}

const mockOptions: ListingCreationData = {
  amenities: [
    { id: 1, name: 'Wi-Fi', icon: 'wifi', amenityGroupType: 'Basic' },
  ],
  placeTypes: [{ id: 2, name: 'Apartment', icon: 'apt' }],
};

describe('useCreationOptions', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    resetStores();
  });

  it('Case: options already in store -> does NOT call the service', async () => {
    $creationOptions.set(mockOptions);

    renderHook(() => useCreationOptions());

    await waitFor(() => {
      expect(getCreationMock).not.toHaveBeenCalled();
      expect($creationOptions.get()).toEqual(mockOptions);
    });
  });

  it('Case: empty options -> calls the service and stores in $creationOptions', async () => {
    $creationOptions.set(null);
    getCreationMock.mockResolvedValueOnce(mockOptions);

    renderHook(() => useCreationOptions());

    await waitFor(() => {
      expect(getCreationMock).toHaveBeenCalledTimes(1);
      expect($creationOptions.get()).toEqual(mockOptions);
    });
  });

  it('Case: $isCreateListingReset = true -> does NOT call the service', async () => {
    $isCreateListingReset.set(true);
    $creationOptions.set(null);

    renderHook(() => useCreationOptions());

    await waitFor(() => {
      expect(getCreationMock).not.toHaveBeenCalled();
      expect($creationOptions.get()).toBeNull();
    });
  });
});
