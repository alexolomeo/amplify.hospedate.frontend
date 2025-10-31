import { useEffect, useState } from 'react';
import { loginWithToken } from '@/services/auth';
import { fetchUserMe } from '@/services/users';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface MobileLoginHandlerProps {
  token: string;
  redirectUri: string;
  lang?: SupportedLanguages;
}

export default function MobileLoginHandler({
  token,
  redirectUri,
  lang = 'es',
}: MobileLoginHandlerProps) {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const t = getTranslation(lang);

  useEffect(() => {
    async function handleMobileLogin() {
      if (!token) {
        console.error('[MOBILE_LOGIN] No token provided');
        window.location.href = '/auth?error=missing_token';
        return;
      }

      try {
        console.log('[MOBILE_LOGIN] Starting token login process');

        // Call the centralized login function
        await loginWithToken(token);

        console.log('[MOBILE_LOGIN] Token login successful');

        // Emit login success event for other listeners
        AuthEventEmitter.emit('auth.loginSuccess');

        // Check if user needs to complete registration
        try {
          const userMe = await fetchUserMe();
          if (userMe && !userMe.isRegisterCompleted) {
            console.log(
              '[MOBILE_LOGIN] Registration incomplete, redirecting to auth'
            );
            window.location.href = `/auth?redirect=${encodeURIComponent(redirectUri)}`;
            return;
          }
        } catch (userError) {
          // If we can't fetch user data, proceed with normal redirect
          console.warn('[MOBILE_LOGIN] Could not fetch user data:', userError);
        }

        // Redirect to the target page
        console.log('[MOBILE_LOGIN] Redirecting to:', redirectUri);
        window.location.href = decodeURIComponent(redirectUri);
      } catch (error) {
        console.error('[MOBILE_LOGIN] Login failed:', error);

        const message =
          error instanceof Error ? error.message : 'unknown_error';
        setErrorMessage(message);
        setStatus('error');

        // Redirect after showing error briefly
        setTimeout(() => {
          window.location.href = `/auth?error=${encodeURIComponent(message)}&redirect=${encodeURIComponent(redirectUri)}`;
        }, 2000);
      }
    }

    handleMobileLogin();
  }, [token, redirectUri]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      {status === 'loading' && (
        <>
          <div className="spinner h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
          <p className="text-lg font-medium">
            {t.auth.mobileLogin.authenticating}
          </p>
          <p className="text-sm text-gray-500">
            {t.auth.mobileLogin.pleaseWait}
          </p>
        </>
      )}
      {status === 'error' && (
        <>
          <div className="text-red-500">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-red-600">
            {t.auth.mobileLogin.authError}
          </p>
          <p className="text-sm text-gray-500">
            {t.auth.mobileLogin.redirecting}
          </p>
          {errorMessage && (
            <p className="text-xs text-gray-400">{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
}
