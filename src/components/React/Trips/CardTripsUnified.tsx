import React from 'react';
//import StarLinearIcon from '/src/icons/star-line.svg?react';
import StarIcon from '/src/icons/star.svg?react';
// import HeartLinearIcon from '/src/icons/heart-linear.svg?react';
// import HeartFillIcon from '/src/icons/heart-fill.svg?react';
import Carousel from '@/components/React/Common/Carousel';
import OptimizedImage from '@/components/React/Common/OptimizedImage';
import { translate } from '@/utils/i18n';
import type { Trip } from '@/types/trips';
import { BookingCancellationBy } from '@/types/trips';
import { formatDateRange } from './CurrentTripsPanel';
import { navigate } from 'astro:transitions/client';

interface CardTripsUnifiedProps {
  trip: Trip;
  t: ReturnType<typeof translate>;
  onReviewClick?: (tripId: number) => void;
  onHeartClick?: (tripId: number) => void;
  lang: string;
  variant?: 'finished' | 'cancelled' | 'rejected';
}

const CardTripsUnified: React.FC<CardTripsUnifiedProps> = ({
  trip,
  t,
  onReviewClick,
  // onHeartClick,
  lang,
  variant,
}) => {
  const getStatusInfo = () => {
    switch (variant) {
      case 'cancelled':
        if (
          trip.bookingCancellationBy === BookingCancellationBy.CancelledByGuest
        ) {
          return {
            text: translate(t, 'trips.status.rejectedByGuest'),
            color: 'text-error border-error',
          };
        }
        if (
          trip.bookingCancellationBy === BookingCancellationBy.CancelledByHost
        ) {
          return {
            text: translate(t, 'trips.status.rejectedByHost'),
            color: 'text-error border-error',
          };
        }
        return {
          text: translate(t, 'trips.status.cancelled'),
          color: 'text-error border-error',
        };

      case 'rejected':
        return {
          text: translate(t, 'trips.status.rejected'),
          color: 'text-[var(--color-info-bg)] border-[var(--color-info-bg)]',
        };

      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  //const showReviewButton = variant === 'finished' && trip.pendingReview;
  const showReviewBadge = variant === 'finished' && trip.pendingReview;

  return (
    <div
      className="relative flex w-full flex-shrink-0 cursor-pointer flex-col items-start justify-start gap-4 sm:flex-row"
      onClick={() => navigate(`/users/trips/${trip.id}`)}
    >
      {/* Carousel */}
      <div className="relative flex h-64 w-full max-w-86 flex-shrink-0 flex-row items-start justify-start gap-0 overflow-hidden rounded-2xl sm:w-62">
        <Carousel images={trip.photos} />
        {/* Wishlist Icon */}
        {/* <div className="absolute top-6 right-6 z-30 flex flex-shrink-0 flex-row items-start justify-start gap-0">
          <button
            className={`${trip.wishlisted ? 'bg-base-300 border-base-300' : 'border-base-100 bg-neutral/10'} relative flex h-8 w-8 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-2xl border px-3 py-0 shadow-sm`}
            onClick={() => onHeartClick && onHeartClick(trip.id)}
          >
            {trip.wishlisted ? (
              <HeartFillIcon className="text-primary relative h-3.5 w-3.5 flex-shrink-0" />
            ) : (
              <HeartLinearIcon className="text-base-100 relative h-3.5 w-3.5 flex-shrink-0" />
            )}
          </button>
        </div> */}
      </div>
      {/* Card Body */}
      <div className="relative flex flex-1 flex-col items-start justify-start gap-2">
        <div className="relative flex flex-shrink-0 flex-col items-start justify-start gap-4 self-stretch">
          {/* Body */}
          <div className="relative flex flex-shrink-0 flex-col items-start justify-start gap-2 self-stretch">
            {/* Body Heading */}
            <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-1 self-stretch">
              <div className="text-base-content relative flex max-w-80 flex-1 items-center justify-start text-left text-lg leading-5 font-semibold">
                {trip.title}
              </div>
              {trip.score && trip.score > 0 && (
                <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-0.5">
                  <StarIcon className="text-accent relative h-5 w-5 flex-shrink-0" />
                  <div className="text-base-content relative flex items-center justify-start text-left text-xs leading-3 font-normal">
                    {trip.score}
                  </div>
                </div>
              )}
            </div>
            {/* Date and Status */}
            <div className="relative flex flex-shrink-0 flex-col items-start justify-center gap-2 self-stretch">
              <div className="text-base-content relative flex items-center justify-start self-stretch text-left text-sm leading-5 font-semibold">
                {formatDateRange(trip.startDate, trip.endDate, lang)}
              </div>
              {/* Review Badge */}
              {showReviewBadge && (
                <button
                  className="border-success relative flex h-6 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-full border px-2 py-0 shadow-sm"
                  onClick={() => onReviewClick && onReviewClick(trip.id)}
                >
                  <div className="text-success relative flex items-center justify-center text-center text-xs leading-3 font-semibold">
                    {translate(t, 'trips.actions.leaveReview')}
                  </div>
                </button>
              )}
              {/* Status Badge */}
              {statusInfo && statusInfo.text && (
                <div
                  className={`relative flex h-6 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-full border px-2 py-0 shadow-sm ${statusInfo.color}`}
                >
                  <div className="relative flex items-center justify-center text-center text-xs leading-3 font-semibold">
                    {statusInfo.text}
                  </div>
                </div>
              )}
            </div>
            {/* Address */}
            <div className="text-neutral relative flex items-center justify-start self-stretch text-left text-sm leading-5 font-normal">
              {trip.location?.address}
            </div>
          </div>
          {/* User Info */}
          <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-3 self-stretch">
            <div className="relative flex h-8 w-8 flex-shrink-0 flex-row items-start justify-start gap-0 rounded-full">
              <div className="relative flex flex-1 flex-row items-start justify-start gap-0 self-stretch rounded-full">
                <OptimizedImage
                  className="relative flex-1 self-stretch rounded-full object-cover"
                  src={
                    trip.host?.profilePicture?.original ||
                    '/images/user_profile.webp'
                  }
                  alt={trip.host?.username || 'Host profile'}
                />
              </div>
            </div>
            <div className="relative flex flex-1 flex-col items-start justify-start gap-0">
              <div className="text-base-content relative flex items-center justify-start self-stretch text-left text-sm leading-5 font-normal">
                Host: {trip.host?.username}
              </div>
            </div>
          </div>
          {/* Review Button (for finished trips that need review) */}
          {/* {showReviewButton && (
            <button
              className="bg-accent relative flex h-8 flex-shrink-0 cursor-pointer flex-row items-center justify-center gap-2 rounded-full px-3 py-0 shadow-sm"
              onClick={() => onReviewClick && onReviewClick(trip.id)}
            >
              <div className="text-base-content relative flex items-center justify-center text-center text-sm leading-3.5 font-semibold">
                {translate(t, 'trips.actions.leaveReview')}
              </div>
              <StarLinearIcon className="relative h-3.5 w-3.5 flex-shrink-0" />
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CardTripsUnified;
