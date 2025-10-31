import type { Guests } from '@/types/search.ts';
import clsx from 'clsx';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n.ts';
import { useCallback, useEffect, useState } from 'react';
import { useSearch } from './Hooks/useSearch';
import GuestCounterGroup from '@/components/React/Common/GuestCounterGroup';

interface GuestCounterProps {
  guestCount: Guests;
  onUpdate: (guest: Guests) => void;
  subtitle: string;
  lang?: SupportedLanguages;
  petsAllowed?: boolean;
  maxGuests?: number;
  maxPets?: number;
  dropdownSize: string;
  dropdownAlign?: string;
  textColor?: string;
  compactMode?: boolean;
  ismobile?: boolean;
}

const GuestCounter: React.FC<GuestCounterProps> = ({
  guestCount,
  onUpdate,
  subtitle,
  lang = 'es',
  maxGuests,
  maxPets,
  petsAllowed = true,
  dropdownSize = 'w-64',
  dropdownAlign = '',
  textColor = 'text-neutral',
  compactMode = false,
  ismobile = false,
}) => {
  const [localGuestCount, setLocalGuestCount] = useState<Guests>(guestCount);
  const t = getTranslation(lang);
  const { isIncreaseDisabled, isDecreaseDisabled, getValidatedGuestCount } =
    useSearch(localGuestCount, t, maxGuests, petsAllowed);

  useEffect(() => {
    setLocalGuestCount(guestCount);
  }, [guestCount]);

  const updateGuests = useCallback(
    (type: keyof Guests, value: number) => {
      let validatedValue = getValidatedGuestCount(type, value);

      if (type === 'pets' && typeof maxPets === 'number') {
        const safeMaxPets = Math.max(0, maxPets);
        validatedValue = Math.min(validatedValue, safeMaxPets);
      }

      const newGuestCount = { ...localGuestCount, [type]: validatedValue };
      setLocalGuestCount(newGuestCount);
      onUpdate(newGuestCount);
    },
    [localGuestCount, getValidatedGuestCount, onUpdate, maxPets]
  );

  const ageKeys: Record<keyof Guests, keyof typeof t.search.guests> = {
    adults: 'adultsAge',
    children: 'childrenAge',
    infants: 'infantsAge',
    pets: 'serviceAnimal',
  };
  const guestTypes: (keyof Guests)[] = petsAllowed
    ? ['adults', 'children', 'infants', 'pets']
    : ['adults', 'children', 'infants'];

  const renderGuestRow = (type: keyof Guests) => {
    const baseCanIncrease = !isIncreaseDisabled(type);
    const canIncrease =
      type === 'pets' && typeof maxPets === 'number'
        ? localGuestCount.pets < Math.max(0, maxPets) && baseCanIncrease
        : baseCanIncrease;

    return (
      <GuestCounterGroup
        key={type}
        type={type}
        value={localGuestCount[type]}
        label={translate(t, t.search.guests[type])}
        description={translate(t, t.search.guests[ageKeys[type]])}
        onChange={(newVal) => updateGuests(type, newVal)}
        canIncrease={canIncrease}
        canDecrease={!isDecreaseDisabled(type)}
      />
    );
  };
  return ismobile ? (
    <div className="flex flex-col gap-4 px-1">
      <p className="text-xl font-bold">{t.search.guestsAndCount}</p>
      <div>{guestTypes.map(renderGuestRow)}</div>
    </div>
  ) : (
    <div className={clsx('dropdown h-full w-full', dropdownAlign)}>
      <div className="flex h-full items-center">
        <div tabIndex={0} role="button">
          {!compactMode && (
            <p className={`text-xs leading-3 font-normal ${textColor}`}>
              {translate(t, t.search.who)}
            </p>
          )}
          <p className={`search_input max-w-21 truncate`}>{subtitle}</p>
        </div>
      </div>
      <ul
        tabIndex={0}
        className={clsx(
          'dropdown-content rounded-box grid-y-2 z-1 mt-7 bg-[var(--color-base-150)] shadow-sm',
          dropdownSize
        )}
      >
        {guestTypes.map(renderGuestRow)}
      </ul>
    </div>
  );
};

export default GuestCounter;
