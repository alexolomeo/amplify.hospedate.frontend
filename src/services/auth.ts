import type { AuthTokens, CheckEmailResponse } from '@/types/auth';
import type { UserRegister } from '@/types/auth';
import api from '@/utils/api';
import axios from 'axios';
import { ValidationError } from '@/errors/CustomErrors';
import { optionalArg } from '@/utils/http.ts';
import { fcmService } from './fcm';
import { sessionService } from './SessionService';

export interface CheckEmailOptions {
  /** When true, prevents global 404 redirect in the API interceptor */
  skipGlobal404Redirect?: boolean;
}

export interface RestorePasswordOptions {
  signal?: AbortSignal;
  skipGlobal404Redirect?: boolean;
}

export interface RequestPasswordResetOptions {
  signal?: AbortSignal;
  skipGlobal404Redirect?: boolean;
}

export type PublicTokenType =
  | 'RESTORE_PASSWORD'
  | 'LOGIN_SOCIAL'
  | 'LOGIN_BY_TOKEN';

export interface ValidateTokenOptions {
  signal?: AbortSignal;
  skipGlobal404Redirect?: boolean;
}

export const checkEmail = async (
  email: string,
  opts?: CheckEmailOptions
): Promise<CheckEmailResponse> => {
  try {
    const url = `/public/auth/check-email?${new URLSearchParams({ email }).toString()}`;

    const response = await api.get<CheckEmailResponse>(
      url,
      ...optionalArg(opts?.skipGlobal404Redirect, {
        skipGlobal404Redirect: true,
      })
    );

    return response.data;
  } catch (error) {
    console.error(`Failed to checkEmail with id ${email}`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('notFound');
      if (status === 400) throw new Error('badRequest');
    }
    throw new Error('networkError');
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthTokens> => {
  try {
    const response = await api.post<AuthTokens>('/auth/login', {
      email,
      password,
    });
    if (response.data.access && response.data.accessExpiresIn) {
      // Initialize FCM and register device token after successful login without blocking the login flow
      sessionService.setTokens(
        response.data.access,
        response.data.accessExpiresIn
      );
      // Fetch user data after successful login
    }
    return response.data;
  } catch (error) {
    console.error(`Failed to login with`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) throw new Error('invalidCredentials');
      if (status === 400) throw new Error('badRequest');
    }
    throw new Error('networkError');
  }
};

export const register = async (data: UserRegister) => {
  try {
    await api.post('/auth/register', data, {
      skipGlobal404Redirect: true,
    });
  } catch (error) {
    console.error(`Failed to register with`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 && error.response?.data?.extra?.fields) {
        throw new ValidationError(error.response.data.extra.fields);
      }
      if (status === 404) throw new Error('notFoundVerificationCode');
      if (status === 400) throw new Error('badRequest');
      if (status === 429) throw new Error('manyRequests');
    }
    throw new Error('networkError');
  }
};

export const verificationPassword = async (data: UserRegister) => {
  try {
    await api.post('/public/auth/verify-password', data);
  } catch (error) {
    console.error(`Failed to verify password`, error);
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('unknownError');
  }
};

export const refreshToken = async (): Promise<AuthTokens> => {
  try {
    const res = await api.post<AuthTokens>('/auth/token/refresh');
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
    throw new Error('unknownError');
  }
};

// Global in-flight guard to prevent duplicate token login calls
const tokenLoginInFlight = new Map<string, Promise<AuthTokens>>();

export const loginWithToken = async (token: string): Promise<AuthTokens> => {
  // Check if this token is already being processed
  const existingRequest = tokenLoginInFlight.get(token);
  if (existingRequest) {
    console.warn(
      'loginWithToken: Request already in progress for this token, returning existing promise'
    );
    return existingRequest;
  }

  // Create the new request
  const requestPromise = (async () => {
    let response;
    try {
      console.log('[AUTH] Attempting login with token', {
        tokenLength: token?.length,
        tokenPrefix: token?.substring(0, 20),
      });

      response = await api.post<AuthTokens>('/auth/login-token', {
        token,
      });

      console.log('[AUTH] Login with token successful', {
        hasAccess: !!response.data.access,
      });

      if (response.data.access && response.data.accessExpiresIn) {
        sessionService.setTokens(
          response.data.access,
          response.data.accessExpiresIn
        );
      }
      return response.data;
    } catch (error) {
      console.error('[AUTH] Failed to login with token', {
        error,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        data: axios.isAxiosError(error) ? error.response?.data : undefined,
        tokenLength: token?.length,
      });

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const errorData = error.response?.data as {
          error?: string;
          message?: string;
        };

        if (status === 401) throw new Error('invalidTokenResponse');
        if (status === 400) {
          // Log the specific 400 error reason
          console.error('[AUTH] 400 Bad Request details:', errorData);
          throw new Error(
            `badRequest: ${errorData?.error || errorData?.message || 'unknown'}`
          );
        }
      }
      throw new Error('networkError');
    }
  })();

  // Store the promise in the map
  tokenLoginInFlight.set(token, requestPromise);

  // Clean up the map when the request completes (success or failure)
  try {
    const result = await requestPromise;
    return result;
  } finally {
    tokenLoginInFlight.delete(token);
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');

    // Remove FCM device token after logout
    const handleFCMDeviceTokenRemoval = async () => {
      if (import.meta.env.PUBLIC_ENABLE_WEB_PUSH !== 'true') return;
      try {
        await fcmService.removeDeviceToken();
      } catch (error) {
        console.error(
          'Failed to remove FCM device token during logout:',
          error
        );
      }
    };
    handleFCMDeviceTokenRemoval();
  } catch (error) {
    console.error(
      '[Service Logout] The logout endpoint call failed, but local cleanup will proceed.',
      error
    );
  }
};

export const sendCode = async (target: string) => {
  try {
    await api.post('/auth/send-code', {
      type: 'EMAIL',
      target,
    });
  } catch (error) {
    console.error(`Failed to sendCode`, error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 404) throw new Error('notFound');
      if (status === 400) throw new Error('badRequest');
      if (status === 429) throw new Error('manyRequests');
    }
    throw new Error('networkError');
  }
};

// Change password API call
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.patch('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    console.error('Failed to change password', error);
    if (axios.isAxiosError(error)) {
      console.log(error);
      const status = error.response?.status;
      if (status === 400 && error.response?.data) {
        // la API puede devolver con o sin wrapper "error"
        const data = error.response.data as {
          message?: string;
          error?: { message?: string };
        };

        const msg = data.error?.message || data.message || 'badRequest';
        throw new Error(msg);
      }
      if (status === 401) throw new Error('invalidCredentials');
    }
    throw new Error('networkError');
  }
};

// Deactivate account API call
export const deactivateAccount = async (): Promise<void> => {
  try {
    await api.patch('/auth/deactivate');
  } catch (error) {
    console.error('Failed to deactivate account', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400 && error.response?.data) {
        // ApidogModel error
        const apiError = error.response.data.error;
        throw new Error(apiError?.message || 'badRequest');
      }
    }
    throw new Error('networkError');
  }
};

export const requestPasswordReset = async (
  email: string,
  opts?: RequestPasswordResetOptions
): Promise<void> => {
  try {
    const config: Record<string, unknown> = {};
    if (opts?.signal) config.signal = opts.signal;
    if (opts?.skipGlobal404Redirect) config.skipGlobal404Redirect = true;

    await api.post<void>('/auth/forgot-password', { email }, config);
  } catch (error) {
    console.error('Failed to request password reset', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) {
        const data = error.response?.data as { message?: string } | undefined;
        throw new Error(data?.message || 'badRequest');
      }
    }
    throw new Error('networkError');
  }
};

export const restorePassword = async (
  token: string,
  newPassword: string,
  opts?: RestorePasswordOptions
): Promise<void> => {
  try {
    const config: Record<string, unknown> = {
      skipGlobal404Redirect: true,
    };
    if (opts?.signal) config.signal = opts.signal;

    await api.post<void>(
      '/auth/restore-password',
      { token, newPassword },
      config
    );
  } catch (error) {
    console.error('Failed to restore password', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404) {
        throw new Error('restoreTokenNotFound');
      }
      if (status === 401) {
        throw new Error('invalidTokenResponse');
      }
      if (status === 400) {
        throw new Error('restoreValidationFailed');
      }
    }
    throw new Error('networkError');
  }
};

export const validateAuthToken = async (
  token: string,
  tokenType: PublicTokenType,
  opts?: ValidateTokenOptions
): Promise<void> => {
  try {
    const config: Record<string, unknown> = {};
    if (opts?.signal) config.signal = opts.signal;
    if (opts?.skipGlobal404Redirect) config.skipGlobal404Redirect = true;

    await api.post<void>('/auth/validate-token', { token, tokenType }, config);
  } catch (error) {
    console.error('Failed to validate auth token', error);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 400) throw new Error('invalidToken');
      if (status === 401) throw new Error('unauthorized');
      if (status === 404) throw new Error('notFound');
    }
    throw new Error('networkError');
  }
};
