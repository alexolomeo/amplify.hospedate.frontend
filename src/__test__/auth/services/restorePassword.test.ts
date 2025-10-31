import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { restorePassword } from '@/services/auth';

vi.mock('@/utils/api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('restorePassword', () => {
  const token = 'fake-restore-token';
  const newPassword = 'NewPassword#2025';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the API with default skipGlobal404Redirect and resolves on success', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await expect(restorePassword(token, newPassword)).resolves.toBeUndefined();

    expect(api.post).toHaveBeenCalledWith(
      '/auth/restore-password',
      { token, newPassword },
      { skipGlobal404Redirect: true }
    );
  });

  it('adds AbortSignal to the config when provided', async () => {
    const controller = new AbortController();
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await restorePassword(token, newPassword, { signal: controller.signal });

    expect(api.post).toHaveBeenCalledWith(
      '/auth/restore-password',
      { token, newPassword },
      { skipGlobal404Redirect: true, signal: controller.signal }
    );
  });

  it('throws "restoreTokenNotFound" on 404', async () => {
    const error = { isAxiosError: true, response: { status: 404 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(restorePassword(token, newPassword)).rejects.toThrow(
      'restoreTokenNotFound'
    );
  });

  it('throws "invalidTokenResponse" on 401', async () => {
    const error = { isAxiosError: true, response: { status: 401 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(restorePassword(token, newPassword)).rejects.toThrow(
      'invalidTokenResponse'
    );
  });

  it('throws "restoreValidationFailed" on 400', async () => {
    const error = { isAxiosError: true, response: { status: 400 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(restorePassword(token, newPassword)).rejects.toThrow(
      'restoreValidationFailed'
    );
  });

  it('throws "networkError" on other axios errors', async () => {
    const error = { isAxiosError: true, response: { status: 500 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(restorePassword(token, newPassword)).rejects.toThrow(
      'networkError'
    );
  });

  it('throws "networkError" on non-axios errors', async () => {
    (api.post as Mock).mockRejectedValueOnce(new Error('boom'));

    await expect(restorePassword(token, newPassword)).rejects.toThrow(
      'networkError'
    );
  });
});
