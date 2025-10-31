import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '../AppButton';
import { AppModal } from '../AppModal';
import { LATER_KEY, DECLINED_KEY } from '@/utils/notifications';

function setNotificationPreference(pref: 'granted' | 'denied' | 'later') {
  switch (pref) {
    case 'granted':
      localStorage.removeItem(DECLINED_KEY);
      localStorage.removeItem(LATER_KEY);
      break;
    case 'denied':
      localStorage.setItem(DECLINED_KEY, 'true');
      localStorage.removeItem(LATER_KEY);
      break;
    case 'later':
      localStorage.setItem(LATER_KEY, Date.now().toString());
      localStorage.removeItem(DECLINED_KEY);
      break;
  }
}

interface Props {
  lang?: SupportedLanguages;
  isOpen: boolean;
  onClose: () => void;
  onPermissionChange?: (permission: NotificationPermission) => void;
}

const NotificationPermissionModal: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  onClose,
  onPermissionChange,
}) => {
  const t = getTranslation(lang);

  const handleActivate = async () => {
    const result = await Notification.requestPermission();
    onPermissionChange?.(result);
    if (result === 'granted') {
      setNotificationPreference('granted');
    }
    if (result === 'denied') {
      setNotificationPreference('denied');
    }
    onClose();
  };

  const handleRemindLater = () => {
    setNotificationPreference('later');
    onClose();
  };

  const handleDoNotAskAgain = () => {
    setNotificationPreference('denied');
    onClose();
  };

  return (
    <AppModal
      id="modal-notifications"
      showCloseButton={false}
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      maxWidth="max-w-sm"
      bgColor="bg-blue-50"
    >
      <div className="flex max-h-[72vh] flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <p className="text-center text-lg font-bold text-[color:var(--color-base-content)]">
                {t.notificationPermission.title}
              </p>
            </div>
            <div className="mt-14 flex justify-center">
              <img
                src={'/images/alarm.webp'}
                alt={t.notificationPermission.imageAlt}
                className="h-34 w-36 object-cover"
              />
            </div>
            <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl p-6 text-center">
              <p className="text-base font-semibold text-neutral-900">
                {t.notificationPermission.description.part1}{' '}
                <span className="font-normal">
                  {t.notificationPermission.description.part2}
                </span>
              </p>
              <p className="text-primary text-xl font-bold">
                {t.notificationPermission.description.part3}
              </p>
              <p className="mt-3 text-base text-neutral-500">
                {t.notificationPermission.description.part4}
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-4 px-0 py-4">
          <div className="flex flex-col items-center gap-2">
            <AppButton
              type="button"
              label={t.notificationPermission.activateNow}
              className="h-11 w-full max-w-[92%] rounded-2xl px-4 sm:max-w-[340px] sm:justify-center"
              onClick={handleActivate}
            />
            <AppButton
              type="button"
              label={t.notificationPermission.remindMeLater}
              className="h-11 w-full max-w-[92%] rounded-2xl border border-[var(--color-secondary)] bg-blue-50 px-4 text-[var(--color-secondary)] sm:max-w-[340px] sm:justify-center"
              onClick={handleRemindLater}
            />
            <button
              type="button"
              className="mt-1 cursor-pointer text-base font-semibold text-neutral-600 underline"
              onClick={handleDoNotAskAgain}
            >
              {t.notificationPermission.dontAskAgain}
            </button>
          </div>
        </div>
      </div>
    </AppModal>
  );
};

export default NotificationPermissionModal;
