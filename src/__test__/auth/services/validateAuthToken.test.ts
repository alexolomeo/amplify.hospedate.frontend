import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import api from '@/utils/api';
import { validateAuthToken, type PublicTokenType } from '@/services/auth';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('validateAuthToken (service)', () => {
  const token = 'public-restore-token';
  const tokenType: PublicTokenType = 'RESTORE_PASSWORD';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls API and resolves on success (no options)', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await expect(validateAuthToken(token, tokenType)).resolves.toBeUndefined();

    expect(api.post).toHaveBeenCalledWith(
      '/auth/validate-token',
      { token, tokenType },
      {}
    );
  });

  it('includes AbortSignal and skipGlobal404Redirect when provided', async () => {
    const controller = new AbortController();
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await validateAuthToken(token, tokenType, {
      signal: controller.signal,
      skipGlobal404Redirect: true,
    });

    expect(api.post).toHaveBeenCalledWith(
      '/auth/validate-token',
      { token, tokenType },
      { signal: controller.signal, skipGlobal404Redirect: true }
    );
  });

  it('throws "invalidToken" on 400 Bad Request', async () => {
    const error = { isAxiosError: true, response: { status: 400 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(validateAuthToken(token, tokenType)).rejects.toThrow(
      'invalidToken'
    );
  });

  it('throws "unauthorized" on 401 Unauthorized', async () => {
    const error = { isAxiosError: true, response: { status: 401 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(validateAuthToken(token, tokenType)).rejects.toThrow(
      'unauthorized'
    );
  });

  it('throws "notFound" on 404 Not Found', async () => {
    const error = { isAxiosError: true, response: { status: 404 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(validateAuthToken(token, tokenType)).rejects.toThrow(
      'notFound'
    );
  });

  it('throws "networkError" on other axios errors', async () => {
    const error = { isAxiosError: true, response: { status: 500 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(validateAuthToken(token, tokenType)).rejects.toThrow(
      'networkError'
    );
  });

  it('throws "networkError" on non-axios errors', async () => {
    (api.post as Mock).mockRejectedValueOnce(new Error('boom'));

    await expect(validateAuthToken(token, tokenType)).rejects.toThrow(
      'networkError'
    );
  });
});
