import { persistentAtom } from '@nanostores/persistent';

export const $isLoggedInHint = persistentAtom<boolean>('authHint', false, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
