import { useCallback, useMemo } from 'react';
import type { Guests, UseSearchReturn } from '@/types/search.ts';
import { translate, translatePlural } from '@/utils/i18n';

export function useSearch(
  guestCount: Guests,
  t: ReturnType<typeof translate>,
  maxGuests = 16,
  petsAllowed = true
): UseSearchReturn {
  const getGuestSubtitle = useMemo(() => {
    return (defaultText: string): string => {
      const totalGuests = guestCount.adults + guestCount.children;
      if (guestCount.adults === 0) {
        return defaultText;
      }
      const guestsLabel = translatePlural(t, `search.guest`, totalGuests);
      const infantsLabel = translatePlural(
        t,
        `search.guests.infant`,
        guestCount.infants
      );
      const petsLabel = translatePlural(
        t,
        `search.guests.pet`,
        guestCount.pets
      );
      let subtitle = guestsLabel;
      if (guestCount.infants) {
        subtitle += `, ${infantsLabel}`;
      }
      if (guestCount.pets) {
        subtitle += `, ${petsLabel}`;
      }
      return subtitle;
    };
  }, [guestCount, t]);

  const getMaxLimit = useCallback(
    (type: keyof Guests): number => {
      return type === 'infants' || type === 'pets' ? 5 : maxGuests;
    },
    [maxGuests]
  );
  const getMinLimit = (type: keyof Guests): number => {
    return type === 'adults' ? 1 : 0;
  };

  const getValidatedGuestCount = useCallback(
    (type: keyof Guests, value: number): number => {
      if (type === 'pets' && !petsAllowed) return 0;
      const maxLimit = getMaxLimit(type);
      const minLimit = getMinLimit(type);
      let newValue = Math.max(minLimit, Math.min(maxLimit, value));
      if (type === 'adults' || type === 'children') {
        const otherType = type === 'adults' ? 'children' : 'adults';
        const otherCount = guestCount[otherType];
        const remaining = maxGuests - otherCount;
        newValue = Math.min(newValue, remaining);
      }
      return newValue;
    },
    [getMaxLimit, guestCount, maxGuests, petsAllowed]
  );

  const isIncreaseDisabled = useCallback(
    (type: keyof Guests): boolean => {
      const current = guestCount[type];
      const nextValue = current + 1;
      const validated = getValidatedGuestCount(type, nextValue);
      return validated === current;
    },
    [guestCount, getValidatedGuestCount]
  );

  const isDecreaseDisabled = useCallback(
    (type: keyof Guests): boolean => {
      const current = guestCount[type];
      const nextValue = current - 1;
      const validated = getValidatedGuestCount(type, nextValue);
      return validated === current;
    },
    [guestCount, getValidatedGuestCount]
  );

  return {
    getGuestSubtitle,
    getValidatedGuestCount,
    isIncreaseDisabled,
    isDecreaseDisabled,
  };
}
