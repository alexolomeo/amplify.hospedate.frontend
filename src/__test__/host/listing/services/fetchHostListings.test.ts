import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { fetchHostListings } from '@/services/host/listings';
import type { ListingsResponse } from '@/types/host/listing';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

describe('fetchHostListings', () => {
  it('should return listings response when successful', async () => {
    const testData: ListingsResponse = {
      limit: 10,
      offset: 0,
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          title: 'Hermoso Departamento Centro',
          status: 'PUBLISHED',
          createdAt: '2025-08-14T14:08:47.775622+00:00',
          propertyType: 'home',
          location: {
            address: 'Av. Las Américas',
            city: 'Santa Cruz',
            state: 'Santa Cruz',
            country: 'Bolivia',
          },
          photo: {
            original: 'https://example.com/image.jpg',
            srcsetWebp: 'https://example.com/image.webp 480w',
            srcsetAvif: 'https://example.com/image.avif 480w',
          },
        },
      ],
    };

    (api.get as Mock).mockResolvedValueOnce({ data: testData });

    const result = await fetchHostListings();

    expect(result).toEqual(testData);
    expect(api.get).toHaveBeenCalledWith(
      '/hostings/listings?limit=200&offset=0'
    );
  });

  it('should throw an error on failure', async () => {
    const errorMessage = 'Internal Server Error';
    (api.get as Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchHostListings()).rejects.toThrow(errorMessage);
    expect(api.get).toHaveBeenCalledWith(
      '/hostings/listings?limit=200&offset=0'
    );
  });
});
