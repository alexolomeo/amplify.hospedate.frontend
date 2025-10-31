import { describe, it, expect, vi, afterEach, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { createKycSession } from '@/services/verify-identity/kyc';
import type { KycSession } from '@/types/verify-identity/kyc';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe('createKycSession', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('retorna la sesión y hace trim de verifyUrl', async () => {
    const payload: KycSession = {
      id: '58edf868-c387-4506-a06a-d3be4477168d',
      token: 'token123',
      qrCode: 'data:image/png;base64,AAAABBBB',
      expiresAt: '2025-08-27T13:51:47.676Z',
    };

    (api.post as Mock).mockResolvedValueOnce({ data: payload });

    const result = await createKycSession();

    expect(api.post).toHaveBeenCalledWith('/kyc/sessions/');
    expect(result).toEqual({
      ...payload,
    });
  });

  it('re-lanza el error cuando la petición falla', async () => {
    const err = new Error('Network error');
    (api.post as Mock).mockRejectedValueOnce(err);

    await expect(createKycSession()).rejects.toThrow('Network error');
    expect(api.post).toHaveBeenCalledWith('/kyc/sessions/');
  });
});
