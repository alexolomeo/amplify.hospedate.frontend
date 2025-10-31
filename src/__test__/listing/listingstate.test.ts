import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import api from '@/utils/api';
import {
  getListingStatusReasons,
  unpublishListing,
  type ListingStatusReason,
} from '@/services/host/edit-listing/listingstate';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockedGet = () => api.get as unknown as Mock;
const mockedPatch = () => api.patch as unknown as Mock;

describe('listingstate service', () => {
  beforeEach(() => {
    mockedGet().mockReset();
    mockedPatch().mockReset();
  });

  it('getListingStatusReasons: normaliza type_label/type_order -> typeLabel/typeOrder', async () => {
    mockedGet().mockResolvedValue({
      data: [
        { id: 1, name: 'A', type: 'X', type_label: 'Label X', type_order: 5 },
        { id: 2, name: 'B', type: 'Y', typeLabel: 'Label Y', typeOrder: 2 },
      ],
    });

    const res = await getListingStatusReasons();

    expect(mockedGet()).toHaveBeenCalledWith('/listings/status/reasons', {
      signal: undefined,
      headers: undefined,
    });

    expect(res).toEqual<ListingStatusReason[]>([
      { id: 1, name: 'A', type: 'X', typeLabel: 'Label X', typeOrder: 5 },
      { id: 2, name: 'B', type: 'Y', typeLabel: 'Label Y', typeOrder: 2 },
    ]);
  });

  it('getListingStatusReasons: envía Accept-Language cuando hay lang', async () => {
    mockedGet().mockResolvedValue({ data: [] });

    await getListingStatusReasons(undefined, 'es');

    expect(mockedGet()).toHaveBeenCalledWith('/listings/status/reasons', {
      signal: undefined,
      headers: { 'Accept-Language': 'es' },
    });
  });

  it('getListingStatusReasons: retorna [] si AbortError', async () => {
    mockedGet().mockRejectedValue({ name: 'AbortError' });

    const res = await getListingStatusReasons();
    expect(res).toEqual([]);
  });

  it('getListingStatusReasons: retorna [] si ERR_CANCELED', async () => {
    mockedGet().mockRejectedValue({ code: 'ERR_CANCELED' });

    const res = await getListingStatusReasons();
    expect(res).toEqual([]);
  });

  it('getListingStatusReasons: lanza error para fallos no controlados', async () => {
    const err = new Error('Network fail');
    mockedGet().mockRejectedValue(err);

    await expect(getListingStatusReasons()).rejects.toThrow('Network fail');
  });

  it('getListingStatusReasons: si data no es array, devuelve []', async () => {
    mockedGet().mockResolvedValue({ data: undefined });

    const res = await getListingStatusReasons();
    expect(res).toEqual([]);
  });

  it('unpublishListing: hace PATCH con url/payload/signal correctos', async () => {
    mockedPatch().mockResolvedValue({ data: {} });
    const ac = new AbortController();

    await unpublishListing('123', [10, 11], ac.signal);

    expect(mockedPatch()).toHaveBeenCalledWith(
      '/listings/123/status',
      { status: 'UNPUBLISHED', reasonIds: [10, 11] },
      { signal: ac.signal }
    );
  });
});
