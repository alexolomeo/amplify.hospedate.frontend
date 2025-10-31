import React from 'react';
import type { TripDetail } from '@/types/tripDetail';
import InfoRowSection from './InfoRowSectiont';
import { formatDateFull } from '@/utils/dateUtils';
import {
  translate,
  getTranslation,
  type SupportedLanguages,
} from '@/utils/i18n';

interface TripDetailReservationDataProps {
  tripDetail: TripDetail;
  lang: SupportedLanguages;
  className?: string;
}

const TripDetailReservationData: React.FC<TripDetailReservationDataProps> = ({
  tripDetail,
  lang,
  className = '',
}) => {
  const t = getTranslation(lang);

  const booking = tripDetail.booking;

  const checkInDate = new Date(booking.checkInDate);
  const checkOutDate = new Date(booking.checkoutDate);
  const nights = Math.ceil(
    (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formattedCheckIn = formatDateFull(booking.checkInDate, lang);
  const formattedCheckOut = formatDateFull(booking.checkoutDate, lang);

  const adults = Number(booking.adults ?? 0);
  const children = Number(booking.children ?? 0);

  const adultsLabel = translate(
    t,
    adults === 1 ? 'trips.adultOne' : 'trips.adultOther'
  );
  const childrenLabel = translate(
    t,
    children === 1 ? 'trips.childOne' : 'trips.childOther'
  );

  const guestParts: string[] = [];
  if (adults > 0) guestParts.push(`${adults} ${adultsLabel}`);
  if (children > 0) guestParts.push(`${children} ${childrenLabel}`);

  const guestsText =
    guestParts.length > 0
      ? guestParts.join(' - ')
      : `0 ${translate(t, 'trips.adultOther')}`;

  const dayLabel = translate(
    t,
    nights === 1 ? 'trips.dayOne' : 'trips.dayOther'
  );

  const items = [
    {
      label: translate(t, 'trips.guests'),
      value: guestsText,
    },
    {
      label: translate(t, 'trips.checkIn'),
      value: formattedCheckIn,
    },
    {
      label: translate(t, 'trips.checkOut'),
      value: formattedCheckOut,
    },
    {
      label: translate(t, 'trips.bookingDays'),
      value: `${nights} ${dayLabel}`,
    },
  ];

  return (
    <div className={`space-y-2 ${className}`}>
      <InfoRowSection
        title={translate(t, 'trips.reservationData')}
        items={items}
      />
    </div>
  );
};

export default TripDetailReservationData;
