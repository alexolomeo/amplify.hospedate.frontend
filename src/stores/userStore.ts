import { persistentAtom } from '@nanostores/persistent';
import type { UserStore } from '@/types/user';

export const $userStore = persistentAtom<UserStore | null>('user', null, {
  encode: JSON.stringify,
  decode: JSON.parse,
});
