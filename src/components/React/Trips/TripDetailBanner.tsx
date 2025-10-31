import React from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import { TripDetailStatusColor } from '@/types/tripDetail';
//import HeartIcon from '/src/icons/heart-linear.svg?react';
//import ShareIcon from '/src/icons/share.svg?react';
import PhotoIcon from '/src/icons/photo.svg?react';
// import { navigate } from 'astro/virtual-modules/transitions-router.js';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { GalleryContainer } from '../Listing/GalleryContainer';
import { useModalParam } from '../Hooks/useModalParam';
import { useFetch } from '../Hooks/useFetch';
import { fetchListingById } from '@/services/listings';
import { mediaPictureToPhoto } from '@/adapters/image';

interface TripDetailBannerProps {
  tripDetail: TripDetail;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  status: {
    text: string | undefined;
    color: TripDetailStatusColor | undefined;
  };
  isHost?: boolean;
}

const TripDetailBanner: React.FC<TripDetailBannerProps> = ({
  tripDetail,
  t,
  status,
  lang,
  //isHost = false,
}) => {
  const listingId = tripDetail.listing.id;

  // Modal logic for GalleryContainer
  const { isOpen, open, close } = useModalParam(
    'modal',
    'PHOTO_TOUR_SCROLLABLE'
  );

  const fetcher = React.useCallback(() => {
    if (listingId == null) {
      throw new Error('Listing ID is required');
    }
    return fetchListingById(listingId);
  }, [listingId]);

  const { data, isLoading, error, fetchData } = useFetch(fetcher);

  React.useEffect(() => {
    if (listingId) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const getStatusColorClasses = (
    statusColor?: TripDetailStatusColor
  ): string => {
    if (!statusColor) {
      return 'border-neutral text-neutral';
    }

    const styleMap: Record<TripDetailStatusColor, string> = {
      [TripDetailStatusColor.TODAY]: 'border-success text-success',
      [TripDetailStatusColor.DAYS]: 'border-info text-info',
      [TripDetailStatusColor.PENDING]: 'border-warning text-warning',
      [TripDetailStatusColor.CANCELLED]: 'border-error text-error bg-error/10',
      [TripDetailStatusColor.REVIEW]: 'border-success text-success',
    };

    return styleMap[statusColor] || 'border-neutral text-neutral bg-neutral/10';
  };

  const handleShowAllPhotos = () => {
    open();
  };

  return (
    <section className="flex flex-col gap-4 px-4 sm:gap-6 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-base-content text-start text-sm font-bold md:text-base">
          {translate(t, 'tripDetail.title')}
        </h1>
        <h2 className="text-base-content text-2xl leading-tight font-bold md:text-4xl lg:text-5xl">
          {tripDetail.title}
        </h2>
      </div>

      {/* Status and Actions */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-0">
        {status.text && (
          <div
            className={`relative flex h-6 flex-shrink-0 flex-row items-center justify-center gap-2 rounded-full border px-2 py-0 shadow-sm ${getStatusColorClasses(status.color)}`}
          >
            <span className="text-xs font-semibold">{status.text}</span>
          </div>
        )}

        {/*  {!isHost && (
          <div className="flex gap-1">
            <button
              onClick={handleSaveTrip}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent px-3"
            >
              <span className="text-primary text-sm underline">
                {translate(t, 'tripDetail.actions.save')}
              </span>
              <HeartIcon className="text-primary h-3.5 w-3.5" />
            </button>

            <button
              onClick={handleShareTrip}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-transparent px-2"
            >
              <span className="text-primary text-sm underline">
                {translate(t, 'tripDetail.actions.share')}
              </span>
              <ShareIcon className="text-primary h-3.5 w-3.5" />
            </button>
          </div>
        )} */}
      </div>

      {/* Photo Gallery */}
      <div className="relative flex h-auto flex-col gap-4 lg:h-[273px] lg:flex-row">
        {/* Main Image */}
        <div className="relative flex h-[200px] max-h-[300px] flex-1 items-center justify-center overflow-hidden rounded-3xl sm:h-[250px] lg:h-full lg:max-h-none">
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-gray-100">
            <ResponsiveImage
              photo={mediaPictureToPhoto(tripDetail.photos[0])}
              alt={`Property photo 1`}
              className="h-full w-full object-cover object-center"
              loading="eager"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Show all photos button - positioned on main image for mobile */}
          <button
            onClick={handleShowAllPhotos}
            className="bg-base-200 absolute bottom-3 left-3 flex h-10 cursor-pointer items-center gap-2 rounded-full px-3 py-0 shadow-sm sm:bottom-4 sm:left-4 sm:h-12 sm:px-4 lg:hidden"
          >
            <span className="text-base-content text-xs font-semibold sm:text-sm">
              {translate(t, 'tripDetail.actions.showAllPhotos')}
            </span>
            <PhotoIcon className="text-base-content h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>

        {/* Grid of smaller images */}
        <div className="grid w-full grid-cols-2 gap-2 sm:gap-4 lg:flex-1">
          {tripDetail.photos.slice(1, 5).map((photo, index) => (
            <div
              key={index}
              className="h-[100px] w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-[120px] lg:aspect-auto lg:h-[128.5px] lg:rounded-3xl"
            >
              <ResponsiveImage
                photo={mediaPictureToPhoto(photo)}
                alt={`Property photo ${index + 2}`}
                className="h-full w-full object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>

        {/* Show all photos button - positioned on entire gallery for desktop */}
        <button
          onClick={handleShowAllPhotos}
          className="bg-base-200 absolute bottom-6 left-6 hidden h-12 cursor-pointer items-center gap-2 rounded-full px-4 py-0 shadow-sm lg:flex"
          disabled={!listingId}
        >
          <span className="text-base-content text-sm font-semibold">
            {translate(t, 'tripDetail.actions.showAllPhotos')}
          </span>
          <PhotoIcon className="text-base-content h-4 w-4" />
        </button>
      </div>

      {/* Show all photos modal */}
      {isOpen && !isLoading && !error && (
        <GalleryContainer
          spaces={data?.spaces ?? []}
          lang={lang}
          isOpen={isOpen}
          open={open}
          close={close}
        />
      )}
    </section>
  );
};

export default TripDetailBanner;
