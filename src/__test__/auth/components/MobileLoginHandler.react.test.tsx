import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import MobileLoginHandler from '@/components/React/Auth/MobileLoginHandler';
import * as authService from '@/services/auth';
import * as usersService from '@/services/users';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import type { UserMe } from '@/types/user';

// Mock the services
jest.mock('@/services/auth', () => ({
  loginWithToken: jest.fn(),
}));

jest.mock('@/services/users', () => ({
  fetchUserMe: jest.fn(),
}));

// Mock window.location
const mockLocation = {
  href: '',
};

describe('MobileLoginHandler', () => {
  const mockToken = 'valid.jwt.token';
  const mockRedirectUri = '/hosting/listings/123/edit';

  const mockUser: Partial<UserMe> = {
    id: 1,
    email: 'test@example.com',
    isRegisterCompleted: true,
    firstName: 'Test',
    lastName: 'User',
    birthDate: '1990-01-01',
    phone: '+591123456',
    preferredName: 'Test',
    identityVerified: false,
    isSuperHost: false,
    isHost: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
    Object.defineProperty(window, 'location', {
      writable: true,
      value: mockLocation,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Successful Authentication', () => {
    it('should display loading state initially', () => {
      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
      expect(screen.getByText('Please wait a moment')).toBeInTheDocument();
    });

    it('should call loginWithToken with the provided token', async () => {
      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockResolvedValueOnce(mockUser as UserMe);

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(authService.loginWithToken).toHaveBeenCalledWith(mockToken);
      });
    });

    it('should emit auth.loginSuccess event after successful login', async () => {
      const emitSpy = jest.spyOn(AuthEventEmitter, 'emit');

      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockResolvedValueOnce(mockUser as UserMe);

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(emitSpy).toHaveBeenCalledWith('auth.loginSuccess');
      });
    });

    it('should redirect to the target URL after successful login', async () => {
      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockResolvedValueOnce(mockUser as UserMe);

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(window.location.href).toBe(mockRedirectUri);
      });
    });

    it('should redirect to auth page if user registration is incomplete', async () => {
      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest.mocked(usersService.fetchUserMe).mockResolvedValueOnce({
        ...mockUser,
        isRegisterCompleted: false,
      } as UserMe);

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(window.location.href).toBe(
          `/auth?redirect=${encodeURIComponent(mockRedirectUri)}`
        );
      });
    });

    it('should proceed with redirect if fetchUserMe fails', async () => {
      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockRejectedValueOnce(new Error('Network error'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(window.location.href).toBe(mockRedirectUri);
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error state when login fails', async () => {
      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('invalidTokenResponse'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Authentication error')).toBeInTheDocument();
        expect(
          screen.getByText('Redirecting to login page...')
        ).toBeInTheDocument();
      });
    });

    it('should display error message if available', async () => {
      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('invalidTokenResponse'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('invalidTokenResponse')).toBeInTheDocument();
      });
    });

    it('should redirect to auth page with error after 2 seconds', async () => {
      jest.useFakeTimers();

      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('invalidTokenResponse'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Authentication error')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(window.location.href).toBe(
          `/auth?error=${encodeURIComponent('invalidTokenResponse')}&redirect=${encodeURIComponent(mockRedirectUri)}`
        );
      });

      jest.useRealTimers();
    });

    it('should preserve redirect URL in error redirect', async () => {
      jest.useFakeTimers();

      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('networkError'));

      const customRedirect = '/hosting/listings/456/edit';

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={customRedirect}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Authentication error')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(window.location.href).toContain(
          `redirect=${encodeURIComponent(customRedirect)}`
        );
      });

      jest.useRealTimers();
    });

    it('should handle unknown errors gracefully', async () => {
      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce('String error instead of Error object');

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Authentication error')).toBeInTheDocument();
        expect(screen.getByText('unknown_error')).toBeInTheDocument();
      });
    });
  });

  describe('Internationalization', () => {
    it('should display Spanish text when lang is "es"', () => {
      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="es"
        />
      );

      expect(screen.getByText('Autenticando...')).toBeInTheDocument();
      expect(
        screen.getByText('Por favor espera un momento')
      ).toBeInTheDocument();
    });

    it('should display English text when lang is "en"', () => {
      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
      expect(screen.getByText('Please wait a moment')).toBeInTheDocument();
    });

    it('should display Spanish error messages when lang is "es"', async () => {
      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('invalidTokenResponse'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="es"
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Error de autenticación')).toBeInTheDocument();
        expect(
          screen.getByText('Redirigiendo a la página de inicio de sesión...')
        ).toBeInTheDocument();
      });
    });

    it('should default to Spanish if no lang is provided', () => {
      render(
        <MobileLoginHandler token={mockToken} redirectUri={mockRedirectUri} />
      );

      expect(screen.getByText('Autenticando...')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing token by redirecting to error page', async () => {
      render(
        <MobileLoginHandler token="" redirectUri={mockRedirectUri} lang="en" />
      );

      await waitFor(() => {
        expect(window.location.href).toBe('/auth?error=missing_token');
      });
    });

    it('should decode redirect URI before navigating', async () => {
      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockResolvedValueOnce(mockUser as UserMe);

      const encodedRedirect = encodeURIComponent('/hosting/listings/123/edit');

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={encodedRedirect}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(window.location.href).toBe('/hosting/listings/123/edit');
      });
    });
  });

  describe('Console Logging', () => {
    it('should log start of login process', async () => {
      const consoleSpy = jest.spyOn(console, 'log');

      jest.mocked(authService.loginWithToken).mockResolvedValueOnce({
        access: 'access_token',
        accessExpiresIn: 3600,
      });

      jest
        .mocked(usersService.fetchUserMe)
        .mockResolvedValueOnce(mockUser as UserMe);

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          '[MOBILE_LOGIN] Starting token login process'
        );
      });
    });

    it('should log errors when login fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error');

      jest
        .mocked(authService.loginWithToken)
        .mockRejectedValueOnce(new Error('invalidTokenResponse'));

      render(
        <MobileLoginHandler
          token={mockToken}
          redirectUri={mockRedirectUri}
          lang="en"
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '[MOBILE_LOGIN] Login failed:',
          expect.any(Error)
        );
      });
    });
  });
});
