import { createKycSession } from '@/services/verify-identity/kyc';
import { isMobileDevice } from '@/utils/deviceDetection';
import type { KycSession } from '@/types/verify-identity/kyc';

/**
 * Centralized KYC session management utility
 * Handles both mobile and desktop verification flows
 */
export class KycSessionManager {
  /**
   * Initiates KYC verification process for the current device
   * Mobile users: Creates session and redirects to verification page
   * Desktop users: Creates session for modal display
   */
  static async initiateVerification(): Promise<{
    type: 'redirect' | 'modal';
    session?: KycSession;
  }> {
    try {
      const session = await createKycSession();

      if (isMobileDevice()) {
        // Mobile: Redirect to verification page with session token and current page as redirect
        const currentUrl = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/kyc/verify/${session.token}?isApp=false&redirectUri=${currentUrl}`;
        return { type: 'redirect' };
      } else {
        // Desktop: Return session for modal display
        return { type: 'modal', session };
      }
    } catch (error) {
      console.error('Failed to initiate KYC verification:', error);
      throw error;
    }
  }

  /**
   * Creates a KYC session specifically for mobile redirect
   * @returns Promise resolving to session token
   */
  static async createSessionForMobile(): Promise<string> {
    try {
      const session = await createKycSession();
      return session.token;
    } catch (error) {
      console.error('Failed to create mobile KYC session:', error);
      throw error;
    }
  }

  /**
   * Creates a KYC session specifically for desktop modal
   * @returns Promise resolving to complete session data
   */
  static async createSessionForDesktop(): Promise<KycSession> {
    try {
      return await createKycSession();
    } catch (error) {
      console.error('Failed to create desktop KYC session:', error);
      throw error;
    }
  }

  /**
   * Handles the verification flow with callback support
   * @param onDesktopSession - Callback for desktop modal with session
   * @param onMobileRedirect - Optional callback before mobile redirect
   */
  static async handleVerification(
    onDesktopSession: (session: KycSession) => void,
    onMobileRedirect?: () => void
  ): Promise<void> {
    try {
      const session = await createKycSession();

      if (isMobileDevice()) {
        onMobileRedirect?.();
        const currentUrl = encodeURIComponent(
          window.location.pathname + window.location.search
        );
        window.location.href = `/kyc/verify/${session.token}?isApp=false&redirectUri=${currentUrl}`;
      } else {
        onDesktopSession(session);
      }
    } catch (error) {
      console.error('Failed to handle KYC verification:', error);
      throw error;
    }
  }
}

/**
 * Simple function to start KYC verification process
 * Returns the appropriate action based on device type
 */
export async function startKycVerification(): Promise<{
  type: 'redirect' | 'modal';
  session?: KycSession;
}> {
  return KycSessionManager.initiateVerification();
}

/**
 * Hook-style function for React components
 * @param onModalOpen - Callback when desktop modal should open
 * @returns Function to trigger verification
 */
export function useKycVerification(onModalOpen: (session: KycSession) => void) {
  return async () => {
    await KycSessionManager.handleVerification(onModalOpen);
  };
}
