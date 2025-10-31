import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  extractStatusAndCode,
  isInvalidRefresh,
  sessionService,
} from '@/services/SessionService';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { $auth } from '@/stores/auth';
import { $timezone, detectTimezone } from '@/stores/timezoneStore';
/**
 * Endpoints that do NOT require Authorization
 * or hydration barrier.
 */

const PUBLIC_PATHS = [
  '/public/',
  '/auth/login',
  '/auth/register',
  '/public/auth/check-email',
  '/auth/send-code',
  '/auth/verify-code',
  '/auth/forgot-password',
  '/auth/restore-password',
  '/auth/login-token',
  '/auth/token/refresh',
  '/public/listings/search',
  '/public/listings/',
  '/public/devices/register',
];

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  /** Internal flag to avoid infinite retries on 401 */
  __retriedOnce?: boolean;
  /** Allows the caller to suppress global handling of 404 */
  skipGlobal404Redirect?: boolean;
};

const api = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? import.meta.env.INTERNAL_API_URL || import.meta.env.PUBLIC_API_URL
      : import.meta.env.PUBLIC_API_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

/**
 * Waits for the auth store hydration to complete
 * before sending private requests.
 */
async function waitForAuthHydration(): Promise<void> {
  if (!$auth.get().isLoading) return;
  await new Promise<void>((resolve) => {
    const off = $auth.listen((state) => {
      if (!state.isLoading) {
        off();
        resolve();
      }
    });
  });
}

function isPublic(url?: string) {
  if (!url) return false;
  return PUBLIC_PATHS.some((p) => url.includes(p));
}

/* ===========================
   REQUEST INTERCEPTOR
   - Hydration barrier
   - Token from SessionService
   (NO refresca aquí: el refresh se maneja SOLO en response)
=========================== */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const url = config.url ?? '';

    // (Pre) Header X-Timezone (IANA) — aplicar también a rutas públicas
    const tz =
      typeof window !== 'undefined'
        ? $timezone.get() || detectTimezone()
        : $timezone.get() || 'UTC';
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['X-Timezone'] = tz;

    // Public routes: do not block or add Authorization
    if (isPublic(url)) return config;

    // 1) Hydration barrier
    await waitForAuthHydration();

    // 2) Token si lo hay
    const token = sessionService.getAccessToken();

    // 3) Inyectar Authorization si tenemos token
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${token}`;
    }

    // 4) Header X-Timezone (IANA)
    // (ya se estableció arriba para públicas y privadas)

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
   - Manejo centralizado de 401 con refresh (single-flight)
   - Reintento de la request original tras refresh
   - Manejo de 403/404 con eventos globales
=========================== */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const cfg = (error.config || {}) as RetriableRequestConfig;

    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = cfg.url;
    const isRefreshCall = url?.includes('/auth/token/refresh');

    // 401: only for non-public routes and not the refresh endpoint
    // utils/api.ts (en el response interceptor, dentro del bloque 401)
    if (status === 401 && !isRefreshCall && !isPublic(url)) {
      if (!cfg.__retriedOnce) {
        cfg.__retriedOnce = true;
        console.log('[API] 401 detected, attempting refresh', {
          url,
          hasAccessToken: !!sessionService.getAccessToken(),
        });

        try {
          await sessionService.refreshWithLock();
          const newToken = sessionService.getAccessToken();

          if (newToken) {
            console.log('[API] Refresh successful, retrying request', { url });
            cfg.headers = cfg.headers ?? {};
            (cfg.headers as Record<string, string>)['Authorization'] =
              `Bearer ${newToken}`;
            return api(cfg);
          } else {
            // Refresh succeeded but no token - unexpected state
            console.error(
              '[API] Refresh succeeded but no token available - this should not happen',
              { url }
            );
            AuthEventEmitter.emit('auth.required', { status, url });
          }
        } catch (err: unknown) {
          const { status: refreshStatus, code } = extractStatusAndCode(err);
          const invalid = isInvalidRefresh(refreshStatus, code);

          console.log('[API] Refresh attempt result', {
            url,
            refreshStatus,
            code,
            invalid,
            willClearSession: invalid,
          });

          if (invalid) {
            console.warn('[API] Invalid refresh token, clearing session', {
              refreshStatus,
              code,
            });
            AuthEventEmitter.emit('auth.required', { status, url });
          } else {
            // Transient error - keep session alive
            console.warn('[API] Transient refresh failure, keeping session', {
              url,
              status,
              code,
              message: 'Session preserved despite refresh failure',
            });
          }
        }
      } else {
        console.log('[API] 401 already retried once, rejecting', { url });
      }
      return Promise.reject(error);
    }

    // 403: prohibido
    if (status === 403 && !isPublic(url)) {
      AuthEventEmitter.emit('route.forbidden');
      return Promise.reject(error);
    }

    // 404: not found (redir global salvo que el caller lo suprima)
    if (status === 404 && !cfg.skipGlobal404Redirect) {
      AuthEventEmitter.emit('route.notfound');
    }

    return Promise.reject(error);
  }
);

export default api;
