import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { ParamsListingAvailibility } from '@/types/listing/listing';
import type { Guests } from '@/types/search';
import { useSearch } from '../Hooks/useSearch';
import { formatDateRangeWithYear } from '@/utils/dateUtils';

interface DescriptionPlaceProps {
  lang?: SupportedLanguages;
  params: ParamsListingAvailibility;
}

export default function DescriptionPlace({
  lang = 'es',
  params,
}: DescriptionPlaceProps) {
  const t = getTranslation(lang);
  const guest: Guests = {
    adults: params.adults,
    children: params.children ?? 0,
    infants: params.infants ?? 0,
    pets: params.pets ?? 0,
  };
  const addGuestsText = t.search.addGuests;
  const { getGuestSubtitle } = useSearch(guest, t);
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-normal">{t.booking.pageTitles.title}</h2>
      <div className="space-y-2 text-base">
        <div>
          <p className="text-neutral">{t.booking.details.dates}</p>
          {formatDateRangeWithYear(
            params.checkInDate,
            params.checkoutDate,
            lang
          )}
        </div>
        <div>
          <p className="text-neutral">{t.booking.details.guests}</p>
          <p>{getGuestSubtitle(addGuestsText)}</p>
        </div>
      </div>
    </div>
  );
}
