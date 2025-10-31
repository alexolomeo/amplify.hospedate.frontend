import { $loginToken } from '@/stores/loginToken';
import { useCallback, useRef } from 'react';
import { AuthEventEmitter } from '@/utils/authEventEmitter';

type PopupOptions = {
  width?: number;
  height?: number;
  windowName?: string;
};

// Global state to prevent duplicate token delivery across multiple hook instances
let globalPopupRef: Window | null = null;
let lastProcessedToken: string | null = null;
let isStorageListenerSetup = false;

const deliverToken = (token: string) => {
  if (!token || token === lastProcessedToken) {
    console.log('usePopupListener: Skipping duplicate token delivery', {
      hasToken: !!token,
      isDuplicate: token === lastProcessedToken,
    });
    return;
  }

  console.log('usePopupListener: Delivering token', {
    tokenLength: token.length,
    tokenPrefix: token.substring(0, 20),
  });
  lastProcessedToken = token;

  // Remove from localStorage FIRST to prevent re-processing
  localStorage.removeItem('googleLoginToken');

  $loginToken.set(token);
  AuthEventEmitter.emit('auth.socialToken', token);
  globalPopupRef?.close();
};

// Global storage event handler - only set up once
const handleStorageChange = (event: StorageEvent) => {
  if (event.key === 'googleLoginToken' && event.newValue) {
    deliverToken(event.newValue);
  }
};

// Set up global storage listener once
if (typeof window !== 'undefined' && !isStorageListenerSetup) {
  // Check for existing token on first load
  const existingToken = localStorage.getItem('googleLoginToken');
  if (existingToken) {
    console.log('usePopupListener: Found existing token on load');
    deliverToken(existingToken);
  }

  // Clean up stale tokens after 5 minutes (in case of errors)
  const checkStaleToken = () => {
    const token = localStorage.getItem('googleLoginToken');
    if (token) {
      console.warn('usePopupListener: Removing stale token from localStorage');
      localStorage.removeItem('googleLoginToken');
    }
  };
  setTimeout(checkStaleToken, 5 * 60 * 1000); // 5 minutes

  window.addEventListener('storage', handleStorageChange);
  isStorageListenerSetup = true;
}

// Export for testing purposes - allows cleanup/reset
export const _resetPopupListener = () => {
  if (typeof window !== 'undefined' && isStorageListenerSetup) {
    window.removeEventListener('storage', handleStorageChange);
    isStorageListenerSetup = false;
    lastProcessedToken = null;
    globalPopupRef = null;
  }
};

export const usePopupListener = () => {
  const localPopupRef = useRef<Window | null>(null);

  const openPopup = useCallback(
    (
      url: string,
      { width = 500, height = 600, windowName = 'authPopup' }: PopupOptions = {}
    ) => {
      if (globalPopupRef && !globalPopupRef.closed) {
        globalPopupRef.focus?.();
        return;
      }

      const popup = window.open(
        url,
        windowName,
        `width=${width},height=${height},resizable=yes,scrollbars=yes`
      );

      globalPopupRef = popup;
      localPopupRef.current = popup;
    },
    []
  );

  return { openPopup };
};
