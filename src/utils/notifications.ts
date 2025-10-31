export const LATER_KEY = 'notifyLater';
export const DECLINED_KEY = 'notifyDeclined';
export const DAYS_TO_WAIT = 1; // in days

export function getNotificationPermission():
  | NotificationPermission
  | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export function shouldShowNotificationRequest(): boolean {
  const permission = getNotificationPermission();
  if (permission !== 'default') return false;

  if (localStorage.getItem(DECLINED_KEY) === 'true') return false;

  const later = localStorage.getItem(LATER_KEY);
  if (later) {
    const savedTime = parseInt(later, 10);
    const now = Date.now();
    const diffDays = (now - savedTime) / (1000 * 60 * 60 * 24);
    if (diffDays < DAYS_TO_WAIT) return false;
  }

  return true;
}
