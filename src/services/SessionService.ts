import { refreshToken } from '@/services/auth';
import { $auth } from '@/stores/auth';
import { $isLoggedInHint } from '@/stores/authHint';
import { $userStore } from '@/stores/userStore';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import axios from 'axios';
import { clearTimezone } from '@/stores/timezoneStore';
import { clearSelectedListingIds } from '@/stores/selectedListingsStore';
import {
  resetAllForSecurity,
  purgeAllEditListingSessionKeys,
} from '@/stores/host/editListing/editListingSession';
import { resetGalleryForSecurity } from '@/stores/host/editListing/gallery.store';

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
const TAB_ID = Math.random().toString(36).slice(2);

class SessionService {
  private accessToken: string | null = null;
  private isInitialized = false;
  private inflight: Promise<void> | null = null;
  private bc: BroadcastChannel | null =
    typeof window !== 'undefined' && 'BroadcastChannel' in window
      ? new BroadcastChannel('auth_channel')
      : null;

  public initClient(): void {
    if (this.isInitialized) return;

    // Multi-tab logout usando localStorage
    window.addEventListener('storage', (event) => {
      if (event.key === 'logoutEvent') {
        this.clearTokens(false);
      }
    });

    // Multi-tab login/logout con BroadcastChannel
    this.bc?.addEventListener('message', (ev: MessageEvent) => {
      const { type, from } = ev.data || {};
      if (from === TAB_ID) return; // ignora tus propios mensajes

      if (type === 'logout') {
        this.clearTokens(false);
      }

      if (type === 'login') {
        // Otra pestaña refrescó → hidratar el token desde $auth
        const storeToken = $auth.get().accessToken;
        if (storeToken) {
          this.accessToken = storeToken;
          $isLoggedInHint.set(true);
          $auth.setKey('isLoading', false);
        }
      }
    });

    // Handle computer sleep/wake scenarios
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.accessToken) {
        console.log('[AUTH] Tab visible after being hidden, checking session');
        // Proactively refresh when tab becomes visible if we have a token
        // This helps recover from sleep scenarios
        this.refreshWithLock().catch((err) => {
          console.warn(
            '[AUTH] Visibility refresh failed, but session preserved unless invalid',
            err
          );
        });
      }
    });

    void this.initializeSession();
    this.isInitialized = true;
  }

  public async initializeSession(): Promise<void> {
    try {
      const storeToken = $auth.get().accessToken;
      const memToken = this.accessToken;

      if (memToken) {
        $auth.setKey('isLoading', false);
        return;
      }

      if (storeToken) {
        this.accessToken = storeToken;
        $auth.setKey('isLoading', false);
        return;
      }

      if ($isLoggedInHint.get()) {
        await this.refreshWithLock();
      }
    } catch (e) {
      console.error('Session initialization failed:', e);
      setTimeout(() => this.refreshWithLock().catch(() => {}), 30000);
    } finally {
      $auth.setKey('isLoading', false);
    }
  }

  public get userMightBeLoggedIn(): boolean {
    return $isLoggedInHint.get();
  }

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public async refreshWithLock(maxAttempts = 4): Promise<void> {
    if (this.inflight) return this.inflight;

    this.inflight = (async () => {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const newTokens = await refreshToken();

          if (!newTokens?.access || !newTokens.accessExpiresIn) {
            console.error('[AUTH] refresh:missing-access', newTokens);
            throw new Error('RefreshMissingAccess');
          }

          this.setTokens(newTokens.access, newTokens.accessExpiresIn);
          AuthEventEmitter.emit('auth.sessionReady');
          return;
        } catch (err: unknown) {
          const { status, code } = extractStatusAndCode(err);
          if (isInvalidRefresh(status, code)) {
            this.clearTokens();
            AuthEventEmitter.emit('auth.refreshFailed');
            throw err;
          }

          const canRetry = attempt < maxAttempts && isTransient(status);
          if (canRetry) {
            const waitMs =
              5000 * Math.pow(2, attempt - 1) +
              Math.floor(Math.random() * 1000);
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          throw err;
        }
      }
    })().finally(() => {
      this.inflight = null;
    });
    return this.inflight;
  }

  public setTokens(token: string, expiresIn: number): void {
    this.accessToken = token;
    $auth.setKey('accessToken', token);
    $auth.setKey('isLoading', false);
    $isLoggedInHint.set(true);

    this.scheduleTokenRefresh(expiresIn);

    try {
      localStorage.setItem('loginEvent', Date.now().toString());
      this.bc?.postMessage({ type: 'login', from: TAB_ID });
    } catch {
      //silencio
    }
  }

  public clearTokens(emit: boolean = true): void {
    const currentUserId = $userStore.get()?.id;
    try {
      if (currentUserId != null) {
        clearSelectedListingIds(currentUserId);
      }
    } catch {
      /* noop */
    }

    this.accessToken = null;
    $auth.setKey('accessToken', null);
    $auth.setKey('isLoading', false);
    $isLoggedInHint.set(false);
    $userStore.set(null);
    resetAllForSecurity();
    purgeAllEditListingSessionKeys();
    resetGalleryForSecurity();
    clearTimezone();

    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }

    if (emit && typeof window !== 'undefined') {
      try {
        localStorage.setItem('logoutEvent', Date.now().toString());
        this.bc?.postMessage({ type: 'logout', from: TAB_ID });
      } catch {
        /* noop */
      }
    }
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    const seconds = Math.max(0, Math.floor(Number(expiresIn) || 0));

    if (refreshTimer) clearTimeout(refreshTimer);

    const refreshMs =
      seconds > 60 ? (seconds - 60) * 1000 : Math.max(5000, seconds * 500);

    refreshTimer = setTimeout(() => {
      this.refreshWithLock().catch((err) =>
        console.error('Scheduled token refresh failed:', err)
      );
    }, refreshMs);
  }
}

export const sessionService = new SessionService();

export function extractStatusAndCode(err: unknown): {
  status?: number;
  code?: string;
} {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data: unknown = err.response?.data;
    const code =
      typeof (data as { error?: string })?.error === 'string'
        ? (data as { error?: string }).error
        : typeof (data as { code?: string })?.code === 'string'
          ? (data as { code?: string }).code
          : undefined;
    return { status, code };
  }
  return {};
}
export function isInvalidRefresh(status?: number, code?: string): boolean {
  // Only clear session for explicit authentication failures
  if (
    status === 401 &&
    (code === 'invalid_grant' ||
      code === 'invalid_token' ||
      code === 'token_revoked' ||
      code === 'refresh_token_expired' ||
      code === 'refresh_token_invalid')
  ) {
    return true;
  }

  // Generic 401 on refresh endpoint = invalid refresh token
  if (status === 401) {
    return true;
  }

  // Don't treat all 400s as invalid refresh - could be validation errors
  // Only specific codes indicate token issues
  if (
    code === 'invalid_grant' ||
    code === 'invalid_token' ||
    code === 'token_revoked'
  ) {
    return true;
  }

  return false;
}

export function isTransient(status?: number): boolean {
  if (!status) return true;
  if (status >= 500 && status <= 599) return true;
  if (status === 429) return true;
  return false;
}
