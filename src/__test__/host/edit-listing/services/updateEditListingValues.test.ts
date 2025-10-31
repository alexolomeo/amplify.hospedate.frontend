import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api';
import { updateEditListingValues } from '@/services/host/edit-listing/editListing';
import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';

vi.mock('@/utils/api', () => {
  return {
    default: {
      patch: vi.fn(),
    },
  };
});

describe('updateEditListingValues', () => {
  it('throws if payload has neither yourPlace nor arrivalGuide', async () => {
    await expect(updateEditListingValues('123', {})).rejects.toThrow(
      'Empty payload for updateEditListingValues'
    );
    expect(api.patch).not.toHaveBeenCalled();
  });

  it('calls PATCH with encoded listingId and yourPlace payload', async () => {
    const payload: UpdateListingEditorPayload = {
      yourPlace: {
        titleSection: { listingTitle: 'Nuevo título' },
      },
    };

    (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

    await updateEditListingValues('abc/123', payload);

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/abc%2F123/editors/values',
      payload
    );
  });

  it('calls PATCH with arrivalGuide-only payload', async () => {
    const payload: UpdateListingEditorPayload = {
      arrivalGuide: {
        indicationsSection: { indications: 'Cómo llegar...' },
      },
    };

    (api.patch as Mock).mockResolvedValueOnce({ status: 204 });

    await updateEditListingValues('42', payload);

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/42/editors/values',
      payload
    );
  });

  it('propagates errors from api.patch', async () => {
    const payload: UpdateListingEditorPayload = {
      yourPlace: {
        pricesSection: {
          perNight: { price: 500 },
          perWeekend: { price: null },
          discounts: { weekly: null, monthly: null },
        },
      },
    };

    (api.patch as Mock).mockRejectedValueOnce(new Error('network down'));

    await expect(updateEditListingValues('777', payload)).rejects.toThrow(
      'network down'
    );

    expect(api.patch).toHaveBeenCalledWith(
      '/listings/777/editors/values',
      payload
    );
  });
});
