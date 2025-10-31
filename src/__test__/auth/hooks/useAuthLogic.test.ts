import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthLogic } from '@/components/React/Hooks/Auth/useAuthLogic';
import * as authService from '@/services/auth';

// Mock modules
vi.mock('@/services/auth');
vi.mock('@/services/users');
vi.mock('@/services/SessionService');
vi.mock('@/utils/authEventEmitter');

vi.mock('@/stores/authHint', () => ({
  $isLoggedInHint: {
    get: vi.fn(() => false),
    set: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    listen: vi.fn(() => () => {}),
  },
}));

vi.mock('@/stores/userStore', () => ({
  $userStore: {
    get: vi.fn(() => null),
    set: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    listen: vi.fn(() => () => {}),
  },
}));

vi.mock('@/utils/i18n', () => ({
  getTranslation: () => ({
    register: {
      passwordTooShort: 'Password must be at least 8 characters long.',
      passwordCannotBeAllNumbers: 'The password cannot be all numbers',
      passwordCannotBeAllLetters: 'The password cannot be all letters',
      passwordNeedsNumberOrSymbol:
        'Password must contain at least one number or symbol.',
      passwordContainsPersonalInfo:
        'Password must not contain your username or email.',
      passwordNotCommon: 'The password must not be too common.',
    },
    auth: {
      error: {
        networkError: 'Network error occurred',
      },
    },
  }),
  SupportedLanguages: {},
}));

describe('useAuthLogic - Password Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleRegister with verificationPassword', () => {
    it('should successfully validate password and return true', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'SecurePass123!',
        email: 'test@example.com',
      };

      vi.mocked(authService.verificationPassword).mockResolvedValueOnce(
        undefined
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      let registerResult: boolean | undefined;
      await act(async () => {
        registerResult = await result.current.handleRegister(userData);
      });

      expect(registerResult).toBe(true);
      expect(authService.verificationPassword).toHaveBeenCalledWith(userData);
      expect(result.current.operationStates.register.isLoading).toBe(false);
      expect(result.current.operationStates.register.error).toBeNull();
      expect(result.current.dataRegister).toEqual(userData);
    });

    it('should return false and set error when password verification fails', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'weak',
        email: 'test@example.com',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Password too weak' },
        },
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        axiosError
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      let registerResult: boolean | undefined;
      await act(async () => {
        registerResult = await result.current.handleRegister(userData);
      });

      expect(registerResult).toBe(false);
      expect(authService.verificationPassword).toHaveBeenCalledWith(userData);
      expect(result.current.operationStates.register.isLoading).toBe(false);
      expect(result.current.operationStates.register.error).toBeTruthy();
      expect(result.current.operationStates.register.error).toContain('•');
      expect(result.current.dataRegister).toBeNull();
    });

    it('should show all password requirements on validation failure', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: '12345',
        email: 'test@example.com',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation failed' },
        },
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        axiosError
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      await act(async () => {
        await result.current.handleRegister(userData);
      });

      const errorMessage = result.current.operationStates.register.error;
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toContain(
        'Password must be at least 8 characters long.'
      );
      expect(errorMessage).toContain('The password cannot be all numbers');
      expect(errorMessage).toContain('The password cannot be all letters');
      expect(errorMessage).toContain(
        'Password must contain at least one number or symbol.'
      );
      expect(errorMessage).toContain(
        'Password must not contain your username or email.'
      );
      expect(errorMessage).toContain('The password must not be too common.');
    });

    it('should set loading state correctly during verification', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'SecurePass123!',
        email: 'test@example.com',
      };

      let resolveVerification: () => void;
      const verificationPromise = new Promise<void>((resolve) => {
        resolveVerification = resolve;
      });

      vi.mocked(authService.verificationPassword).mockReturnValueOnce(
        verificationPromise
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      // Start verification
      act(() => {
        result.current.handleRegister(userData);
      });

      // Check loading state is true
      await waitFor(() => {
        expect(result.current.operationStates.register.isLoading).toBe(true);
      });

      // Resolve the verification
      await act(async () => {
        resolveVerification!();
        await verificationPromise;
      });

      // Check loading state is false after completion
      await waitFor(() => {
        expect(result.current.operationStates.register.isLoading).toBe(false);
      });
    });

    it('should handle network errors gracefully', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'SecurePass123!',
        email: 'test@example.com',
      };

      const networkError = new Error('Network connection failed');
      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        networkError
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      let registerResult: boolean | undefined;
      await act(async () => {
        registerResult = await result.current.handleRegister(userData);
      });

      expect(registerResult).toBe(false);
      expect(result.current.operationStates.register.isLoading).toBe(false);
      expect(result.current.operationStates.register.error).toBeTruthy();
    });

    it('should handle rate limiting errors', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'SecurePass123!',
        email: 'test@example.com',
      };

      const rateLimitError = {
        isAxiosError: true,
        response: {
          status: 429,
          data: { message: 'Too many requests' },
        },
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        rateLimitError
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      let registerResult: boolean | undefined;
      await act(async () => {
        registerResult = await result.current.handleRegister(userData);
      });

      expect(registerResult).toBe(false);
      expect(result.current.operationStates.register.error).toBeTruthy();
    });
  });

  describe('buildPasswordRequirementsMessage', () => {
    it('should build multi-line error message with bullets', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'weak',
        email: 'test@example.com',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation failed' },
        },
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        axiosError
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      await act(async () => {
        await result.current.handleRegister(userData);
      });

      const errorMessage = result.current.operationStates.register.error;
      expect(errorMessage).toBeTruthy();

      // Check that the message has bullet points
      const lines = errorMessage!.split('\n');
      expect(lines.length).toBeGreaterThan(1);
      lines.forEach((line) => {
        expect(line).toMatch(/^• /);
      });
    });

    it('should support Spanish language', async () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        birthDate: '1990-01-01',
        password: 'débil',
        email: 'test@example.com',
      };

      const axiosError = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: 'Validation failed' },
        },
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        axiosError
      );

      const { result } = renderHook(() => useAuthLogic('es'));

      await act(async () => {
        await result.current.handleRegister(userData);
      });

      const errorMessage = result.current.operationStates.register.error;
      expect(errorMessage).toBeTruthy();
      expect(errorMessage).toContain('•');
      // The error message should be formatted as bullet points
      const lines = errorMessage!.split('\n');
      expect(lines.length).toBeGreaterThan(1);
    });
  });

  describe('resetOperationState', () => {
    it('should reset register operation state', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'weak',
        email: 'test@example.com',
      };

      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        new Error('Validation failed')
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      // First, create an error
      await act(async () => {
        await result.current.handleRegister(userData);
      });

      expect(result.current.operationStates.register.error).toBeTruthy();

      // Now reset
      act(() => {
        result.current.resetOperationState('register');
      });

      expect(result.current.operationStates.register.error).toBeNull();
      expect(result.current.operationStates.register.isLoading).toBe(false);
    });
  });

  describe('Integration scenarios', () => {
    it('should allow retry after failed verification', async () => {
      const weakPassword = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'weak',
        email: 'test@example.com',
      };

      const strongPassword = {
        ...weakPassword,
        password: 'SecurePass123!',
      };

      // First attempt fails
      vi.mocked(authService.verificationPassword).mockRejectedValueOnce(
        new Error('Validation failed')
      );

      const { result } = renderHook(() => useAuthLogic('en'));

      let firstResult: boolean | undefined;
      await act(async () => {
        firstResult = await result.current.handleRegister(weakPassword);
      });

      expect(firstResult).toBe(false);
      expect(result.current.operationStates.register.error).toBeTruthy();

      // Second attempt succeeds
      vi.mocked(authService.verificationPassword).mockResolvedValueOnce(
        undefined
      );

      let secondResult: boolean | undefined;
      await act(async () => {
        secondResult = await result.current.handleRegister(strongPassword);
      });

      expect(secondResult).toBe(true);
      expect(result.current.operationStates.register.error).toBeNull();
      expect(result.current.dataRegister).toEqual(strongPassword);
    });

    it('should clear previous data on new registration attempt', async () => {
      const firstUser = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '1990-01-01',
        password: 'SecurePass123!',
        email: 'john@example.com',
      };

      const secondUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        birthDate: '1995-05-15',
        password: 'AnotherPass456!',
        email: 'jane@example.com',
      };

      vi.mocked(authService.verificationPassword)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuthLogic('en'));

      // First registration
      await act(async () => {
        await result.current.handleRegister(firstUser);
      });

      expect(result.current.dataRegister).toEqual(firstUser);

      // Second registration
      await act(async () => {
        await result.current.handleRegister(secondUser);
      });

      expect(result.current.dataRegister).toEqual(secondUser);
      expect(result.current.dataRegister).not.toEqual(firstUser);
    });
  });
});
