import React from 'react';
import CardTrips from './CardTrips';
import { translate } from '@/utils/i18n';
import { StatusColor, type Trip } from '@/types/trips';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface CurrentTripsPanelProps {
  lang: string;
  t: ReturnType<typeof translate>;
  trips: Trip[];
  getTripStatus: (
    t: ReturnType<typeof translate>,
    trip: Trip
  ) => { text?: string; color?: StatusColor };
}

export const formatDateRange = (
  start: string,
  end: string,
  locale: string
): string => {
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    // Get the appropriate locale object for date-fns
    const dateLocale = locale === 'es' ? es : enUS;

    // Format: "01 Jan 2024"
    const formatPattern = 'dd MMM yyyy';

    const formattedStart = format(startDate, formatPattern, {
      locale: dateLocale,
    });
    const formattedEnd = format(endDate, formatPattern, { locale: dateLocale });

    return `${formattedStart} - ${formattedEnd}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    // Fallback to original strings if parsing fails
    return `${start} - ${end}`;
  }
};

const CurrentTripsPanel: React.FC<CurrentTripsPanelProps> = ({
  lang,
  t,
  trips,
  getTripStatus,
}) => {
  if (!trips.length) {
    return (
      <div className="text-center">
        <p className="text-neutral text-base">{t.trips.content.current}</p>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {trips.map((trip) => {
        const status = getTripStatus(t, trip);
        return (
          <CardTrips
            id={trip.id}
            key={trip.id}
            images={trip.photos}
            title={trip.title}
            rating={trip.score ?? 0}
            dateRange={formatDateRange(trip.startDate, trip.endDate, lang)}
            status={status.text}
            statusColor={status.color}
            address={trip.location?.address}
            hostName={trip.host?.username}
            hostAvatar={
              trip.host?.profilePicture?.original || '/images/user_profile.webp'
            }
            onHeartClick={() => console.log('Heart clicked for trip:', trip.id)}
            isLiked={trip.wishlisted}
          />
        );
      })}
    </div>
  );
};

export default CurrentTripsPanel;
