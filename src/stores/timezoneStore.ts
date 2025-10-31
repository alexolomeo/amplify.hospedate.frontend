import { persistentAtom } from '@nanostores/persistent';

export const $timezone = persistentAtom<string | null>('tz.iana', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Detects and sets the timezone if the store is empty (null).
 * Called during bootstrap when loading the app and also on login.
 */
export function refreshTimezoneIfNeeded() {
  if (typeof window === 'undefined') return;
  const curr = $timezone.get();
  if (!curr) {
    $timezone.set(detectTimezone());
  }
}

export function clearTimezone() {
  $timezone.set(null);
}
