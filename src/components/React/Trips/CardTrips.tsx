import React from 'react';
//import HeartLinearIcon from '/src/icons/heart-linear.svg?react';
//import HeartFillIcon from '/src/icons/heart-fill.svg?react';
import StarIcon from '/src/icons/star.svg?react';
import Carousel from '@/components/React/Common/Carousel';
import OptimizedImage from '@/components/React/Common/OptimizedImage';
import type { ListingPhoto } from '@/types/listing/display-map/searchListingMarker';
import { StatusColor } from '@/types/trips';
import { navigate } from 'astro:transitions/client';

interface CardTripsProps {
  id: number;
  images: ListingPhoto[];
  title: string;
  rating: number;
  dateRange: string;
  status?: string;
  statusColor?: StatusColor;
  address: string;
  hostName: string;
  hostAvatar: string;
  onHeartClick?: () => void;
  isLiked?: boolean;
}

const CardTrips: React.FC<CardTripsProps> = ({
  id,
  images,
  title,
  rating,
  dateRange,
  status,
  statusColor,
  address,
  hostName,
  hostAvatar,
  //onHeartClick,
  //isLiked = false,
}) => {
  const getStatusColorClasses = (): string => {
    // Handle undefined or null statusColor
    if (!statusColor) {
      return 'border-neutral text-neutral';
    }

    // Define consistent styling patterns
    const styleMap: Record<StatusColor, string> = {
      [StatusColor.TODAY]: 'border-success text-success',
      [StatusColor.DAYS]: 'border-info text-info',
      [StatusColor.PENDING]: 'border-warning text-warning',
      [StatusColor.CANCELLED]: 'border-error text-error bg-error/10',
      [StatusColor.REJECTED]: 'border-error text-error bg-error/5',
    };

    // Return the mapped style or fallback for unknown values
    return styleMap[statusColor] || 'border-neutral text-neutral bg-neutral/10';
  };

  return (
    <div
      className="relative flex flex-1 cursor-pointer flex-col items-start justify-start gap-4 md:max-w-[400px]"
      onClick={() => navigate(`/users/trips/${id}`)}
    >
      {/* Carousel Slider */}
      <div className="relative flex h-[272.83px] flex-shrink-0 flex-row items-start justify-start gap-0 self-stretch overflow-hidden rounded-2xl">
        {/* Use the existing Carousel component */}
        <Carousel images={images} />

        {/* Wishlist Icon */}
        {/* <div className="absolute top-6 right-6 z-30 flex flex-shrink-0 flex-row items-start justify-start gap-0">
          <button
            className={`${isLiked ? 'bg-base-300 border-base-300' : 'border-base-100 bg-neutral/10'} relative flex h-8 w-8 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-2xl border px-3 py-0 shadow-sm`}
            onClick={onHeartClick}
          >
            {isLiked ? (
              <HeartFillIcon className="text-primary relative h-3.5 w-3.5 flex-shrink-0" />
            ) : (
              <HeartLinearIcon className="text-base-100 relative h-3.5 w-3.5 flex-shrink-0" />
            )}
          </button>
        </div> */}
      </div>

      {/* Card Body */}
      <div className="relative flex flex-shrink-0 flex-col items-start justify-start gap-2 self-stretch">
        <div className="relative flex flex-shrink-0 flex-col items-end justify-start gap-4 self-stretch">
          {/* Body */}
          <div className="relative flex flex-shrink-0 flex-col items-start justify-start gap-2 self-stretch">
            {/* Body Heading */}
            <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-4 self-stretch">
              <div className="text-base-content relative flex max-w-80 flex-1 items-center justify-start text-left text-lg leading-5 font-semibold">
                {title}
              </div>
              <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-0.5">
                <StarIcon className="text-accent relative h-5 w-5 flex-shrink-0" />
                <div className="text-base-content relative flex items-center justify-start text-left text-xs leading-3 font-normal">
                  {rating}
                </div>
              </div>
            </div>

            {/* Date and Status */}
            <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-2 self-stretch">
              <div className="text-base-content relative flex flex-1 items-center justify-start text-left text-sm leading-5 font-semibold">
                {dateRange}
              </div>
              {status && (
                <div
                  className={`relative flex h-6 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-full border px-2 py-0 shadow-sm ${getStatusColorClasses()}`}
                >
                  <div className="relative flex items-center justify-center text-center text-xs leading-3 font-semibold">
                    {status}
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="text-neutral relative flex items-center justify-start self-stretch text-left text-sm leading-5 font-normal">
              {address}
            </div>
          </div>

          {/* User and Date */}
          <div className="relative flex flex-shrink-0 flex-row items-center justify-start gap-3 self-stretch">
            <div className="relative flex h-8 w-8 flex-shrink-0 flex-row items-start justify-start gap-0 rounded-full">
              <div className="relative flex flex-1 flex-row items-start justify-start gap-0 self-stretch rounded-full">
                <OptimizedImage
                  className="relative flex-1 self-stretch rounded-full object-cover"
                  src={hostAvatar || '/images/user_profile.webp'}
                  alt={hostName}
                />
              </div>
            </div>
            <div className="relative flex flex-1 flex-col items-start justify-start gap-0">
              <div className="text-base-content relative flex items-center justify-start self-stretch text-left text-sm leading-5 font-normal">
                Host: {hostName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTrips;
