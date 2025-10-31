// src/services/notifications/fcm.ts
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging';
import { getMessagingInstance } from '@/firebase/client';
import { DeviceType } from '@/types/device';
import { registerDevice, removeDevice } from './devices';
import { showToast } from '@/components/ui/toast';

export interface FCMToken {
  token: string;
  deviceType: DeviceType;
}

export interface FCMNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, unknown>;
}

export interface StandardizedNotificationData {
  title: string;
  body: string;
  image?: string;
  type: 'info' | 'success' | 'error';
}

class FCMService {
  private currentToken: string | null = null;
  private isInitialized = false;
  private lastRegisteredToken: string | null = null;
  private swRegistration: ServiceWorkerRegistration | null = null;

  /**
   * Initialize FCM service and request permission
   */
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      if (typeof window === 'undefined') {
        console.warn('FCM initialize called on server');
        return false;
      }
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return false;
      }
      if (!('Notification' in window)) {
        console.warn('Notifications not supported');
        return false;
      }

      // Registrar service worker si no existe
      if (!this.swRegistration) {
        await this.registerServiceWorker();
      }

      // Register device in backend
      await this.registerDeviceToken();

      // Listener de mensajes
      this.setupMessageListener();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize FCM:', error);
      return false;
    }
  }

  /**
   * Register Firebase messaging service worker
   */
  private async registerServiceWorker(): Promise<void> {
    try {
      this.swRegistration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );
      console.log(
        'Service Worker registered successfully:',
        this.swRegistration
      );
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Get FCM token with persistence check
   */
  async getFCMToken(): Promise<string | null> {
    try {
      const messaging = getMessagingInstance();
      if (!messaging) {
        console.error('Firebase messaging not initialized');
        return null;
      }

      if (this.currentToken) {
        return this.currentToken;
      }

      const vapidKey = import.meta.env.PUBLIC_FIREBASE_VAPID_KEY as
        | string
        | undefined;
      if (!vapidKey || vapidKey.trim().length === 0) {
        console.error('PUBLIC_FIREBASE_VAPID_KEY is missing');
        return null;
      }

      const swReg =
        this.swRegistration ??
        (await navigator.serviceWorker.getRegistration()) ??
        undefined;

      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swReg,
      });

      if (token && token.length > 0) {
        this.currentToken = token;
        return token;
      } else {
        console.warn('No registration token available');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while retrieving token:', error);
      return null;
    }
  }

  /**
   * Register device token with backend
   */
  async registerDeviceToken(): Promise<boolean> {
    try {
      const token = await this.getFCMToken();
      if (!token) {
        console.warn('No FCM token available for registration');
        return false;
      }

      if (import.meta.env.DEV) {
        console.log('FCM token: ', token);
      }

      if (this.lastRegisteredToken === token) {
        console.log('Token already registered, skipping');
        return true;
      }

      const deviceData = {
        deviceToken: token,
        deviceType: DeviceType.Web,
        appVersion: this.getAppVersion(),
      };

      await registerDevice(deviceData);
      this.lastRegisteredToken = token;
      console.log('Device token registered successfully');
      return true;
    } catch (error) {
      console.error('Failed to register device token:', error);
      return false;
    }
  }

  /**
   * Remove device token from backend
   */
  async removeDeviceToken(): Promise<boolean> {
    try {
      if (!this.currentToken) {
        console.warn('No current token to remove');
        return false;
      }
      await removeDevice(this.currentToken);
      this.currentToken = null;
      console.log('Device token removed successfully');
      return true;
    } catch (error) {
      console.error('Failed to remove device token:', error);
      return false;
    }
  }

  /**
   * Extract notification data following service worker convention
   * data precedence for custom control, if not present, use notification
   */
  private extractNotificationData(
    payload: MessagePayload
  ): StandardizedNotificationData {
    const title =
      payload?.data?.title || payload?.notification?.title || 'Notificación';
    const body =
      payload?.data?.body ||
      payload?.notification?.body ||
      'Tienes una nueva notificación';
    const image = payload?.data?.image || payload?.notification?.image;
    const type =
      (payload?.data?.type as 'info' | 'success' | 'error') || 'info';

    return {
      title: String(title),
      body: String(body),
      image: typeof image === 'string' ? image : undefined,
      type: ['info', 'success', 'error'].includes(type)
        ? type
        : ('info' as const),
    };
  }

  /**
   * Setup listener for foreground messages
   * Following SW convention: data precedence for custom control, if not present, use notification
   * Always shows toast (no auto-display conflict in foreground)
   */
  private setupMessageListener(): void {
    const messaging = getMessagingInstance();
    if (!messaging) {
      console.error('Firebase messaging not initialized');
      return;
    }

    onMessage(messaging, (payload: MessagePayload) => {
      console.log('Message received in foreground:', payload);
      const notificationData = this.extractNotificationData(payload);
      showToast[notificationData.type](
        notificationData.body,
        notificationData.title,
        notificationData.image
      );
    });
  }

  /**
   * Get current app version
   */
  private getAppVersion(): string {
    return '1.0.0';
  }

  /**
   * Get current FCM token
   */
  getCurrentToken(): string | null {
    return this.currentToken;
  }

  /**
   * Check if service is initialized
   */
  isServiceInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Check if notifications are supported
   */
  async isNotificationSupported(): Promise<boolean> {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator
    );
  }
}

export const fcmService = new FCMService();
