import { persistentAtom } from '@nanostores/persistent';

export const $loginToken = persistentAtom<string | null>('loginToken', null, {
  encode: String,
  decode: (value) => value,
});
