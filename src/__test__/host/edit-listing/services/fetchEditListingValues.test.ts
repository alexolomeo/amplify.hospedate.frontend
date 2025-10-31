import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { fetchEditListingValues } from '@/services/host/edit-listing/editListing';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('fetchEditListingValues', () => {
  it('should return values when request succeeds', async () => {
    const fakeData: ListingEditorValues = {
      yourPlace: {
        titleSection: { listingTitle: 'My place' },
      },
      setting: {
        statusSection: { status: 'UNLISTED' },
      },
    };

    (api.get as Mock).mockResolvedValueOnce({ data: fakeData });

    const result = await fetchEditListingValues('123');

    expect(result).toEqual(fakeData);
    expect(api.get).toHaveBeenCalledWith('/listings/123/editors/values');
  });

  it('should URL-encode the listingId in the request path', async () => {
    const fakeData: ListingEditorValues = {
      setting: { statusSection: { status: 'PUBLISHED' } },
    } as ListingEditorValues;

    (api.get as Mock).mockResolvedValueOnce({ data: fakeData });

    const result = await fetchEditListingValues('abc/123');

    expect(result).toEqual(fakeData);
    expect(api.get).toHaveBeenCalledWith('/listings/abc%2F123/editors/values');
  });

  it('should return null and log error when request fails', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (api.get as Mock).mockRejectedValueOnce(new Error('boom'));

    const result = await fetchEditListingValues('999');

    expect(result).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/listings/999/editors/values');
    expect(spy).toHaveBeenCalledWith(
      'Failed to fetch Listing Editor values',
      expect.any(Error)
    );

    spy.mockRestore();
  });
});
