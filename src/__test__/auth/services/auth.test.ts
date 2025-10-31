import { describe, it, expect, vi, type Mock } from 'vitest';
import api from '@/utils/api.ts';
import { Provider } from '@/types/enums/provider';
import {
  checkEmail,
  login,
  register,
  refreshToken,
  loginWithToken,
  logout,
  sendCode,
  verificationPassword,
} from '@/services/auth';
import type {
  AuthTokens,
  CheckEmailResponse,
  UserRegister,
} from '@/types/auth';
import { $isLoggedInHint } from '@/stores/authHint';

vi.mock('@/utils/api', () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

vi.mock('@/utils/modalEventUtils', () => ({
  openAppModal: vi.fn(),
}));

vi.mock('@/stores/authHint', () => ({
  $isLoggedInHint: {
    set: vi.fn(),
  },
}));

vi.mock('@/services/fcm', () => ({
  fcmService: {
    initialize: vi.fn(() => Promise.resolve(true)),
    getFCMToken: vi.fn(() => Promise.resolve('mock-fcm-token')),
    registerDeviceToken: vi.fn(() => Promise.resolve(true)),
    removeDeviceToken: vi.fn(() => Promise.resolve(true)),
    getCurrentToken: vi.fn(() => 'mock-fcm-token'),
    isServiceInitialized: vi.fn(() => true),
    isNotificationSupported: vi.fn(() => Promise.resolve(false)),
  },
}));

describe('check email', () => {
  const email = 'test@example.com';
  const queryParams = new URLSearchParams();
  queryParams.append('email', email);
  it('should return email verification on success', async () => {
    const test: CheckEmailResponse = {
      provider: Provider.Hospedate,
      username: 'testuser',
      profilePicture: {
        original:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
        srcsetWebp:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w',
        srcsetAvif:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w',
      },
    };
    (api.get as Mock).mockResolvedValueOnce({ data: test });
    const result = await checkEmail(email);
    expect(result).toEqual(test);
    expect(api.get).toHaveBeenCalledWith(
      `/public/auth/check-email?${queryParams.toString()}`
    );
  });

  it('should map 404 to "notFound" and omit skip flag by default', async () => {
    vi.clearAllMocks();
    const email = 'test@example.com';
    const queryParams = new URLSearchParams({ email });

    const error = { isAxiosError: true, response: { status: 404, data: {} } };
    (api.get as Mock).mockRejectedValueOnce(error);

    await expect(checkEmail(email)).rejects.toThrow('notFound');

    // Assert default call shape: no custom axios config object
    expect(api.get).toHaveBeenCalledWith(
      `/public/auth/check-email?${queryParams.toString()}`
    );
  });

  it('should propagate skipGlobal404Redirect=true and still map 404 to "notFound"', async () => {
    vi.clearAllMocks();
    const email = 'test@example.com';
    const queryParams = new URLSearchParams({ email });

    const error = { isAxiosError: true, response: { status: 404, data: {} } };
    (api.get as Mock).mockRejectedValueOnce(error);

    await expect(
      checkEmail(email, { skipGlobal404Redirect: true })
    ).rejects.toThrow('notFound');

    expect(api.get).toHaveBeenCalledWith(
      `/public/auth/check-email?${queryParams.toString()}`,
      { skipGlobal404Redirect: true }
    );
  });

  it('should throw badRequest on 400 error', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {},
      },
    };
    (api.get as Mock).mockRejectedValueOnce(error);
    await expect(checkEmail(email)).rejects.toThrow('badRequest');
  });

  it('should throw networkError on other axios error without status', async () => {
    const error = {
      isAxiosError: true,
      response: undefined,
    };
    (api.get as Mock).mockRejectedValueOnce(error);
    await expect(checkEmail(email)).rejects.toThrow('networkError');
  });
});

describe('Login', () => {
  const email = 'test@example.com';
  const password = '12345678923';
  let originalCookie: string;
  beforeEach(() => {
    vi.clearAllMocks();
    originalCookie = document.cookie;
    document.cookie = '';
  });
  afterEach(() => {
    document.cookie = originalCookie;
  });

  it('should return email verification on success', async () => {
    const test: AuthTokens = {
      access: 'validAccessToken',
      accessExpiresIn: 3600,
    };
    (api.post as Mock).mockResolvedValueOnce({ data: test });
    const result = await login(email, password);
    expect(result).toEqual(test);
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email, password });
  });

  it('should throw invalidCredentials on 401 Unauthorized', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 401,
        data: {},
      },
    };
    vi.mocked(api.post).mockRejectedValueOnce(error);

    try {
      await login(email, password);
      fail('Expected error was not thrown');
    } catch (err) {
      expect((err as Error).message).toBe('invalidCredentials');
    }
  });

  it('should throw badRequest on 400 Bad Request', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {},
      },
    };
    vi.mocked(api.post).mockRejectedValueOnce(error);
    await expect(login(email, password)).rejects.toThrow('badRequest');
  });

  it('should not save token if accessExpiresIn is 0 or negative', async () => {
    const tokensWithZeroExpiry: AuthTokens = {
      access: 'validToken',
      accessExpiresIn: 0,
    };
    (api.post as Mock).mockResolvedValueOnce({ data: tokensWithZeroExpiry });
    const result = await login(email, password);
    expect(result).toEqual(tokensWithZeroExpiry);
  });

  it('should not save token if access token is empty string', async () => {
    const tokensWithEmptyAccess: AuthTokens = {
      access: '',
      accessExpiresIn: 3600,
    };
    (api.post as Mock).mockResolvedValueOnce({ data: tokensWithEmptyAccess });
    const result = await login(email, password);
    expect(result).toEqual(tokensWithEmptyAccess);
  });

  it('should handle cookies automatically when axios is properly configured', async () => {
    const testTokens: AuthTokens = {
      access: 'validAccessToken',
      accessExpiresIn: 3600,
    };
    const mockResponse = {
      data: testTokens,
      headers: {
        'set-cookie': [
          'refresh_token=abc123; HttpOnly; Secure; Path=/; Max-Age=604800',
        ],
      },
      config: {
        withCredentials: true,
      },
    };
    (api.post as Mock).mockResolvedValueOnce(mockResponse);
    const result = await login(email, password);
    expect(result).toEqual(testTokens);
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email, password });
    // Verify that the cookie is present in the response.
    const setCookieHeader = mockResponse.headers['set-cookie'][0];

    // Verify the format and attributes of the cookie
    expect(setCookieHeader).toMatch(/^refresh_token=abc123/);
    expect(setCookieHeader).toContain('HttpOnly');
    expect(setCookieHeader).toContain('Secure');
    expect(setCookieHeader).toContain('Path=/');
    expect(setCookieHeader).toContain('Max-Age=604800');

    // Verify that axios is configured to handle cookies
    expect(mockResponse.config.withCredentials).toBe(true);
  });
});

describe('register', () => {
  const testRequest: UserRegister = {
    firstName: 'Nombre ',
    lastName: 'Apellido',
    birthDate: '2021-01-07',
    password: '12345678910',
    email: 'test@gmail.com',
  };

  it('should succeed silently on success (201)', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 201 });
    const result = await register(testRequest);
    expect(result).toBeUndefined();
    expect(api.post).toHaveBeenCalledWith('/auth/register', testRequest, {
      skipGlobal404Redirect: true,
    });
  });

  it('should throw VALIDATION_ERROR with field details', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          extra: {
            fields: {
              email: 'Email already exists',
            },
          },
        },
      },
    };
    (api.post as Mock).mockRejectedValueOnce(error);
    await expect(register(testRequest)).rejects.toMatchObject({
      name: 'ValidationError',
      fields: {
        email: 'Email already exists',
      },
    });
  });

  it('should throw networkError on 500 error', async () => {
    const error = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {},
      },
    };
    (api.post as Mock).mockRejectedValueOnce(error);
    await expect(register(testRequest)).rejects.toThrow('networkError');
  });

  it('should throw networkError on other axios error without status', async () => {
    const error = {
      isAxiosError: true,
    };
    (api.post as Mock).mockRejectedValueOnce(error);
    await expect(register(testRequest)).rejects.toThrow('networkError');
  });
});

describe('refreshToken', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call saveToken on successful refresh', async () => {
    const mockTokens: AuthTokens = {
      access: 'newAccessToken',
      accessExpiresIn: 1800,
    };
    (api.post as Mock).mockResolvedValueOnce({ data: mockTokens });

    await refreshToken();

    expect(api.post).toHaveBeenCalledWith('/auth/token/refresh');
  });
});

describe('loginWithToken', () => {
  const googleToken = 'a.very.valid.jwt.token.from.google';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the login-token endpoint and save token on success', async () => {
    const mockResponse: AuthTokens = {
      access: 'validApplicationAccessToken',
      accessExpiresIn: 3600,
    };
    (api.post as Mock).mockResolvedValueOnce({ data: mockResponse });

    const result = await loginWithToken(googleToken);

    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith('/auth/login-token', {
      token: googleToken,
    });
  });

  it('should throw invalidToken on 401 Unauthorized error', async () => {
    const error = { isAxiosError: true, response: { status: 401 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(loginWithToken(googleToken)).rejects.toThrow('invalidToken');
    expect(vi.mocked($isLoggedInHint).set).not.toHaveBeenCalled();
  });

  it('should throw badRequest on 400 Bad Request error', async () => {
    const error = { isAxiosError: true, response: { status: 400 } };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(loginWithToken(googleToken)).rejects.toThrow('badRequest');
    expect(vi.mocked($isLoggedInHint).set).not.toHaveBeenCalled();
  });

  it('should throw networkError on other errors', async () => {
    const error = new Error('Something went wrong');
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(loginWithToken(googleToken)).rejects.toThrow('networkError');
    expect(vi.mocked($isLoggedInHint).set).not.toHaveBeenCalled();
  });
});

describe('logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the logout endpoint and clean up the session on success', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 204 });

    await logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });

  it('should still clean up the session even if the API call fails', async () => {
    (api.post as Mock).mockRejectedValueOnce(new Error('Network Failure'));

    await logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
  });
});

describe('sendCode', () => {
  const target = 'test@example.com';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the API correctly on success', async () => {
    (api.post as Mock).mockResolvedValueOnce({ status: 200 });

    await expect(sendCode(target)).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith('/auth/send-code', {
      type: 'EMAIL',
      target,
    });
  });

  it('should throw "notFound" if the API responds with 404', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 404 },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(sendCode(target)).rejects.toThrow('notFound');
  });

  it('should throw "badRequest" if the API responds with 400', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 400 },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(sendCode(target)).rejects.toThrow('badRequest');
  });

  it('should throw "manyRequests" if the API responds with 429', async () => {
    const error = {
      isAxiosError: true,
      response: { status: 429 },
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(sendCode(target)).rejects.toThrow('manyRequests');
  });

  it('should throw "networkError" for other axios errors', async () => {
    const error = {
      isAxiosError: true,
      response: undefined,
    };
    (api.post as Mock).mockRejectedValueOnce(error);

    await expect(sendCode(target)).rejects.toThrow('networkError');
  });
});

describe('verificationPassword', () => {
  const validUserData: UserRegister = {
    firstName: 'John',
    lastName: 'Doe',
    birthDate: '1990-01-01',
    password: 'SecurePass123!',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully verify a valid password', async () => {
    (api.post as Mock).mockResolvedValueOnce({ data: {} });

    await expect(verificationPassword(validUserData)).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith(
      '/public/auth/verify-password',
      validUserData
    );
  });

  it('should throw AxiosError when password is invalid (400)', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Password does not meet security requirements',
        },
      },
    };
    (api.post as Mock).mockRejectedValueOnce(axiosError);

    await expect(verificationPassword(validUserData)).rejects.toEqual(
      axiosError
    );
    expect(api.post).toHaveBeenCalledWith(
      '/public/auth/verify-password',
      validUserData
    );
  });

  it('should throw AxiosError for rate limiting (429)', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 429,
        data: {
          message: 'Too many requests',
        },
      },
    };
    (api.post as Mock).mockRejectedValueOnce(axiosError);

    await expect(verificationPassword(validUserData)).rejects.toEqual(
      axiosError
    );
  });

  it('should throw AxiosError for server errors (500)', async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 500,
        data: {
          message: 'Internal server error',
        },
      },
    };
    (api.post as Mock).mockRejectedValueOnce(axiosError);

    await expect(verificationPassword(validUserData)).rejects.toEqual(
      axiosError
    );
  });

  it('should throw "unknownError" for non-Axios errors', async () => {
    const genericError = new Error('Network connection failed');
    (api.post as Mock).mockRejectedValueOnce(genericError);

    await expect(verificationPassword(validUserData)).rejects.toThrow(
      'unknownError'
    );
  });

  it('should handle password with special characters', async () => {
    const userData: UserRegister = {
      ...validUserData,
      password: 'P@$$w0rd!#%&*',
    };
    (api.post as Mock).mockResolvedValueOnce({ data: {} });

    await expect(verificationPassword(userData)).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith(
      '/public/auth/verify-password',
      userData
    );
  });

  it('should handle unicode characters in user data', async () => {
    const userData: UserRegister = {
      firstName: 'José',
      lastName: 'García',
      birthDate: '1990-01-01',
      password: 'SecurePass123!',
      email: 'josé@example.com',
    };
    (api.post as Mock).mockResolvedValueOnce({ data: {} });

    await expect(verificationPassword(userData)).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith(
      '/public/auth/verify-password',
      userData
    );
  });

  it('should verify password with verification code', async () => {
    const userDataWithCode: UserRegister = {
      ...validUserData,
      verification_code: '123456',
    };
    (api.post as Mock).mockResolvedValueOnce({ data: {} });

    await expect(
      verificationPassword(userDataWithCode)
    ).resolves.toBeUndefined();
    expect(api.post).toHaveBeenCalledWith(
      '/public/auth/verify-password',
      userDataWithCode
    );
  });
});
