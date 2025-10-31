import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { updateListingStatus } from '@/services/host/edit-listing/editListing';

vi.mock('@/utils/api', () => {
  return {
    default: {
      patch: vi.fn(),
    },
  };
});

describe('updateListingStatus', () => {
  it('calls PATCH with encoded listingId and body (newStatus + reasons) and succeeds on 204', async () => {
    (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

    await expect(
      updateListingStatus('abc/123', 'PENDING_APPROVAL', [10, 20])
    ).resolves.toBeUndefined();

    expect(api.patch).toHaveBeenCalledWith('/listings/abc%2F123/statuses', {
      newStatus: 'PENDING_APPROVAL',
      reasons: [10, 20],
    });
  });

  it('accepts 200 as success as well', async () => {
    (api.patch as Mock).mockResolvedValueOnce({ status: 200 });

    await expect(updateListingStatus(42, 'PUBLISHED')).resolves.toBeUndefined();

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/42/statuses',
      expect.objectContaining({ newStatus: 'PUBLISHED' })
    );
  });

  it('throws on unexpected status codes', async () => {
    (api.patch as Mock).mockResolvedValueOnce({ status: 202 });

    await expect(updateListingStatus('777', 'UNLISTED')).rejects.toThrow(
      '[updateListingStatus] Unexpected status=202'
    );

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/777/statuses',
      expect.objectContaining({ newStatus: 'UNLISTED' })
    );
  });

  it('propagates errors from api.patch (network or server error)', async () => {
    (api.patch as Mock).mockRejectedValueOnce(new Error('network down'));

    await expect(
      updateListingStatus('123', 'PENDING_APPROVAL')
    ).rejects.toThrow('network down');

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/123/statuses',
      expect.objectContaining({ newStatus: 'PENDING_APPROVAL' })
    );
  });
});
