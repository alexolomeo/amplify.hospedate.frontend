import React from 'react';
import CheckCircleSolidIcon from '/src/icons/check-mini.svg?react';
import CardTripsUnified from './CardTripsUnified';
import { translate } from '@/utils/i18n';
import type { Trip } from '@/types/trips';
import { groupTripsByMonth } from '@/utils/trips';

interface TimelineTripsPanelProps {
  lang: string;
  t: ReturnType<typeof translate>;
  trips: Trip[];
  variant: 'finished' | 'cancelled' | 'rejected';
  onReviewClick?: (tripId: number) => void;
  onHeartClick?: (tripId: number) => void;
  emptyStateMessage?: string;
}

const TimelineTripsPanel: React.FC<TimelineTripsPanelProps> = ({
  lang,
  t,
  trips,
  variant,
  onReviewClick,
  onHeartClick,
  emptyStateMessage,
}) => {
  const timelineGroups = groupTripsByMonth(trips, lang);

  // If no trips and we have an empty state message, show it
  if (!trips.length && emptyStateMessage) {
    return (
      <div className="text-center">
        <p className="text-neutral text-base">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-start">
      {/* Vertical line */}
      <div className="bg-base-300 absolute top-2 bottom-6 left-2 z-0 w-1 rounded-full sm:left-7.5" />

      {timelineGroups.map((group) => (
        <div key={group.month} className="flex w-full flex-row">
          {/* Timeline column */}
          <div className="relative flex w-10 flex-col items-start pt-1 sm:w-16 sm:items-center">
            <div className="bg-base-100 py-1">
              <CheckCircleSolidIcon className="text-base-100 bg-base-content z-10 h-4 w-4 rounded-full p-0.5" />
            </div>
          </div>

          {/* Content column */}
          <div className="flex flex-1 flex-col pb-10">
            <div className="mt-0.5 ml-1 flex items-center gap-2">
              <div className="text-base-content text-base font-medium">
                {group.month}
              </div>
            </div>

            {/* Cards */}
            <div className="mt-4 flex flex-col gap-6 pl-2">
              {group.trips.map((trip) => (
                <CardTripsUnified
                  key={trip.id}
                  trip={trip}
                  t={t}
                  lang={lang}
                  variant={variant}
                  onReviewClick={onReviewClick}
                  onHeartClick={onHeartClick}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* End marker */}
      <div className="flex w-full flex-row">
        <div className="relative flex w-10 flex-col items-start pt-1 sm:w-16 sm:items-center">
          <CheckCircleSolidIcon className="text-base-100 bg-base-content z-10 h-4 w-4 rounded-full p-0.5" />
        </div>
        <div className="text-base-content flex items-center gap-2 text-base font-medium">
          {translate(t, 'trips.timeline.noMoreReservations')}
        </div>
      </div>
    </div>
  );
};

export default TimelineTripsPanel;
