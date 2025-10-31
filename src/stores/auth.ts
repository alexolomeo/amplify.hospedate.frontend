import { map } from 'nanostores';

export const $auth = map({
  isLoading: true,
  accessToken: null as string | null,
});
