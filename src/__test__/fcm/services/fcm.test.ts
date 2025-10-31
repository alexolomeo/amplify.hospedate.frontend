/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { getToken } from 'firebase/messaging';
import { fcmService } from '@/services/fcm';
import { getMessagingInstance } from '@/firebase/client';
import { registerDevice, removeDevice } from '@/services/devices';
import { DeviceType } from '@/types/device';

process.env.PUBLIC_ENABLE_WEB_PUSH = 'true';

vi.mock('firebase/messaging', () => ({
  getToken: vi.fn(),
  onMessage: vi.fn(),
}));

vi.mock('@/firebase/client', () => ({
  getMessagingInstance: vi.fn(),
}));

vi.mock('@/services/devices', () => ({
  registerDevice: vi.fn(),
  removeDevice: vi.fn(),
}));

Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    getRegistration: vi.fn().mockResolvedValue(null),
  },
  writable: true,
});

Object.defineProperty(window, 'Notification', {
  value: {
    requestPermission: vi.fn().mockResolvedValue('granted'),
    permission: 'granted',
  },
  writable: true,
});

describe('FCMService - Basic Tests', () => {
  const mockMessaging = {
    app: { name: 'test-app' },
  };
  const mockToken = 'test-fcm-token-123';

  beforeEach(() => {
    (fcmService as any).currentToken = null;
    (fcmService as any).isInitialized = false;
    (fcmService as any).lastRegisteredToken = null;

    vi.stubEnv('PUBLIC_FIREBASE_VAPID_KEY', 'test-vapid-key');

    vi.clearAllMocks();

    (getMessagingInstance as Mock).mockReturnValue(mockMessaging);

    (getToken as Mock).mockResolvedValue(mockToken);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getFCMToken', () => {
    it('should return token when Firebase messaging is available', async () => {
      const token = await fcmService.getFCMToken();

      expect(token).toBe(mockToken);
      expect(getToken).toHaveBeenCalledWith(mockMessaging, {
        vapidKey: 'test-vapid-key',
      });
    });

    it('should return null when Firebase messaging is not available', async () => {
      (getMessagingInstance as Mock).mockReturnValue(null);

      const token = await fcmService.getFCMToken();

      expect(token).toBeNull();
    });

    it('should return cached token when already available', async () => {
      (fcmService as any).currentToken = 'cached-token';

      const token = await fcmService.getFCMToken();

      expect(token).toBe('cached-token');
      expect(getToken).not.toHaveBeenCalled();
    });

    it('should return null when token retrieval fails', async () => {
      (getToken as Mock).mockRejectedValue(new Error('Token error'));

      const token = await fcmService.getFCMToken();

      expect(token).toBeNull();
    });

    it('should return null when no token is available', async () => {
      (getToken as Mock).mockResolvedValue(null);

      const token = await fcmService.getFCMToken();

      expect(token).toBeNull();
    });
  });

  describe('registerDeviceToken', () => {
    it('should register device token successfully', async () => {
      (registerDevice as Mock).mockResolvedValue(undefined);

      const result = await fcmService.registerDeviceToken();

      expect(result).toBe(true);
      expect(registerDevice).toHaveBeenCalledWith({
        deviceToken: mockToken,
        deviceType: DeviceType.Web,
        appVersion: '1.0.0',
      });
    });

    it('should return false when no token is available', async () => {
      (getToken as Mock).mockResolvedValue(null);

      const result = await fcmService.registerDeviceToken();

      expect(result).toBe(false);
      expect(registerDevice).not.toHaveBeenCalled();
    });

    it('should skip registration when token is already registered', async () => {
      (fcmService as any).lastRegisteredToken = mockToken;

      const result = await fcmService.registerDeviceToken();

      expect(result).toBe(true);
      expect(registerDevice).not.toHaveBeenCalled();
    });

    it('should return false when registration fails', async () => {
      (registerDevice as Mock).mockRejectedValue(
        new Error('Registration failed')
      );

      const result = await fcmService.registerDeviceToken();

      expect(result).toBe(false);
    });
  });

  describe('removeDeviceToken', () => {
    it('should remove device token successfully', async () => {
      (fcmService as any).currentToken = mockToken;
      (removeDevice as Mock).mockResolvedValue(undefined);

      const result = await fcmService.removeDeviceToken();

      expect(result).toBe(true);
      expect(removeDevice).toHaveBeenCalledWith(mockToken);
      expect((fcmService as any).currentToken).toBeNull();
    });

    it('should return false when no current token exists', async () => {
      const result = await fcmService.removeDeviceToken();

      expect(result).toBe(false);
      expect(removeDevice).not.toHaveBeenCalled();
    });

    it('should return false when removal fails', async () => {
      (fcmService as any).currentToken = mockToken;
      (removeDevice as Mock).mockRejectedValue(new Error('Removal failed'));

      const result = await fcmService.removeDeviceToken();

      expect(result).toBe(false);
    });
  });

  describe('getCurrentToken', () => {
    it('should return current token', () => {
      (fcmService as any).currentToken = mockToken;

      const token = fcmService.getCurrentToken();

      expect(token).toBe(mockToken);
    });

    it('should return null when no current token', () => {
      const token = fcmService.getCurrentToken();

      expect(token).toBeNull();
    });
  });

  describe('isServiceInitialized', () => {
    it('should return initialization status', () => {
      expect(fcmService.isServiceInitialized()).toBe(false);

      (fcmService as any).isInitialized = true;
      expect(fcmService.isServiceInitialized()).toBe(true);
    });
  });

  describe('getAppVersion', () => {
    it('should return app version', () => {
      const version = (fcmService as any).getAppVersion();

      expect(version).toBe('1.0.0');
    });
  });
});
