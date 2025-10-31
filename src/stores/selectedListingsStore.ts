import { persistentAtom } from '@nanostores/persistent';

export function makeSelectedListingIdsStore(userId: string | number) {
  return persistentAtom<number[]>(`host:${userId}:selectedListingIds`, [], {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        const v = JSON.parse(str);
        return Array.isArray(v) ? v.filter((n) => Number.isFinite(n)) : [];
      } catch {
        return [];
      }
    },
  });
}

export function clearSelectedListingIds(userId: string | number) {
  localStorage.removeItem(`host:${userId}:selectedListingIds`);
}
