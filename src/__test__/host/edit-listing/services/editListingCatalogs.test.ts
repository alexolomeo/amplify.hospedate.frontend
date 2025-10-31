import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { fetchEditListingCatalogs } from '@/services/host/edit-listing/editListing';
import type { EditListingCatalog } from '@/types/host/edit-listing/editListingCatalog';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('fetchEditListingCatalogs', () => {
  it('should return catalogs when request succeeds', async () => {
    const fakeData: EditListingCatalog = {
      amenitiesSection: {
        amenityGroups: [
          {
            id: 1,
            name: 'Basic',
            amenities: [
              { id: 1, name: 'Air conditioning', icon: 'air-conditioning' },
              { id: 2, name: 'Dryer', icon: 'dryer' },
            ],
          },
        ],
      },
      availabilitySection: {
        advanceNoticeHours: [
          { id: 15, name: 'SAME_DAY' },
          { id: 24, name: 'AT_LEAST_ONE_DAY' },
        ],
        sameDayAdvanceNoticeTimes: [
          { id: 0, name: '12 a.m.' },
          { id: 1, name: '1 a.m.' },
        ],
      },
      houseRulesSection: {
        quietHours: {
          startTimes: [{ id: 0, name: '12 a.m.' }],
          endTimes: [{ id: 1, name: '1 a.m.' }],
        },
        checkInOut: {
          checkInStartTimes: [{ id: -1, name: 'Flexible' }],
          checkInEndTimes: [{ id: 10, name: '10 a.m.' }],
          checkoutTimes: [{ id: 11, name: '11 a.m.' }],
        },
      },
      propertyTypeSection: {
        propertyTypeGroups: [
          {
            id: 1,
            name: 'Apartment',
            propertyTypes: [
              {
                id: 1,
                name: 'Rental Unit',
                description: '',
                isBuilding: false,
              },
              { id: 2, name: 'Condo', description: '', isBuilding: false },
            ],
          },
        ],
        propertySizeUnits: [
          { id: 'SQUARE_FEET', name: 'SQUARE_FEET' },
          { id: 'SQUARE_METERS', name: 'SQUARE_METERS' },
        ],
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: fakeData });

    const result = await fetchEditListingCatalogs();

    expect(result).toEqual(fakeData);
    expect(api.get).toHaveBeenCalledWith('/listings/editors/catalogs');
  });

  it('should return null and log error when request fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (api.get as Mock).mockRejectedValueOnce(new Error('boom'));

    const result = await fetchEditListingCatalogs();

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/listings/editors/catalogs');
    expect(spy).toHaveBeenCalledWith(
      'Failed to fetch Edit Listing catalogs',
      expect.any(Error)
    );

    spy.mockRestore();
  });
});
