import React, { useEffect, useState } from 'react';
import { fcmService } from '@/services/fcm';
import NotificationPermissionModal from '../React/Common/Notifications/NotificationPermissionModal';
import { useStore } from '@nanostores/react';
import { $auth } from '@/stores/auth';
import {
  getNotificationPermission,
  shouldShowNotificationRequest,
} from '@/utils/notifications';
import type { SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
}

const GlobalFCMProvider: React.FC<Props> = ({ lang = 'es' }) => {
  const [permission, setPermission] = useState<
    NotificationPermission | 'unsupported'
  >(getNotificationPermission());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { accessToken } = useStore($auth);
  const isLoggedIn = !!accessToken;

  const initializeFCM = async (): Promise<void> => {
    try {
      await fcmService.initialize();
    } catch (error) {
      console.error('Failed to initialize FCM:', error);
    }
  };

  useEffect(() => {
    const enabled = import.meta.env.PUBLIC_ENABLE_WEB_PUSH === 'true';
    if (!enabled || !isLoggedIn) return;

    if (shouldShowNotificationRequest()) {
      setIsModalOpen(true);
    }

    if (getNotificationPermission() === 'granted') {
      initializeFCM();
    }
  }, [isLoggedIn, permission]);

  return (
    <NotificationPermissionModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onPermissionChange={setPermission}
      lang={lang}
    />
  );
};

export default GlobalFCMProvider;
