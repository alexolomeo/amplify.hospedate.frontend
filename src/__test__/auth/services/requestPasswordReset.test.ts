import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { requestPasswordReset } from '@/services/auth';

vi.mock('@/utils/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('requestPasswordReset', () => {
  const email = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the API and resolves on success', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await expect(requestPasswordReset(email)).resolves.toBeUndefined();

    expect(api.post).toHaveBeenCalledWith(
      '/auth/forgot-password',
      { email },
      {}
    );
  });

  it('includes AbortSignal and skipGlobal404Redirect when provided', async () => {
    const controller = new AbortController();
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await requestPasswordReset(email, {
      signal: controller.signal,
      skipGlobal404Redirect: true,
    });

    expect(api.post).toHaveBeenCalledWith(
      '/auth/forgot-password',
      { email },
      { signal: controller.signal, skipGlobal404Redirect: true }
    );
  });

  it('throws the server message on 400 with message payload', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: { message: 'tooCommon' } },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(requestPasswordReset(email)).rejects.toThrow('tooCommon');
  });

  it('throws "badRequest" on 400 without message payload', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: {} },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(requestPasswordReset(email)).rejects.toThrow('badRequest');
  });

  it('throws "networkError" on non-400 axios errors', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 500, data: {} },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(requestPasswordReset(email)).rejects.toThrow('networkError');
  });

  it('throws "networkError" on non-axios errors', async () => {
    (api.post as Mock).mockRejectedValueOnce(new Error('boom'));

    await expect(requestPasswordReset(email)).rejects.toThrow('networkError');
  });
});
