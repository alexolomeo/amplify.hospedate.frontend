import type { Listing } from '@/types/listing/listing';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { useNightsBetweenDates } from '@/components/React/Hooks/useNightsBetweenDates';
//import clsx from 'clsx';
import type { QueryParams } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
//import HeartFilledIcon from '/src/icons/heart-fill.svg?react';
//import HeartOutlineIcon from '/src/icons/heart-linear.svg?react';
import StarIcon from '/src/icons/star.svg?react';
import { formatDateRange } from '@/utils/dateUtils';
import { toKeyIn } from '@/components/React/Utils/edit-listing/keyify';

interface Props {
  listing: Listing;
  lang?: SupportedLanguages;
  queryParams?: QueryParams;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function translateListingType(
  rawType: string,
  dict: Record<string, string>
): string {
  const key = toKeyIn(rawType, dict);
  return key ? dict[key] : rawType;
}

export default function ListingCard({
  listing,
  lang = 'es',
  queryParams,
  onMouseEnter,
  onMouseLeave,
}: Props) {
  const {
    id,
    photos,
    location,
    pricing,
    score,
    availabilitySummary,
    //wishlisted,
  } = listing;
  const t = getTranslation(lang);

  const nights = useNightsBetweenDates(
    availabilitySummary?.startDate ?? '',
    availabilitySummary?.endDate ?? ''
  );

  const handleCardClick = () => {
    const params = new URLSearchParams();
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
    } else if (availabilitySummary) {
      params.append('adults', '1');
      params.append('checkInDate', availabilitySummary.startDate);
      params.append('checkoutDate', availabilitySummary.endDate);
    }
    window.open(`/listing/${id}?${params.toString()}`, '_blank');
  };

  return (
    <div
      role="article"
      data-testid="listing-card"
      className="flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[16px] bg-[var(--color-base-100)]"
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[10/11] w-full overflow-hidden rounded-[16px]">
        {photos && photos.length > 0 ? (
          <ResponsiveImage
            photo={photos[0]}
            alt={`${location.city} - ${listing.placeInfo.placeType}`}
            className="h-full w-full object-cover"
            loading="lazy"
            sizes="240px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-base-200)]">
            <span className="text-sm text-[var(--color-neutral)]">
              {t.common.noImageAvailable}
            </span>
          </div>
        )}
        {/* <div className="absolute top-4 right-4 z-10">
          <button
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              'group flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] shadow-sm transition-all duration-150 ease-in-out',
              'hover:scale-105',
              wishlisted
                ? 'bg-[var(--color-base-200)]'
                : 'border border-[var(--color-base-100)] bg-[var(--color-neutral-10)] hover:border-transparent hover:bg-[var(--color-base-200)]'
            )}
          >
            {wishlisted ? (
              <HeartFilledIcon className="h-[14px] w-[14px] flex-shrink-0 text-[var(--color-primary)]" />
            ) : (
              <HeartOutlineIcon
                className={clsx(
                  'h-[14px] w-[14px] flex-shrink-0',
                  'text-[var(--color-base-100)] group-hover:text-[var(--color-primary)]'
                )}
              />
            )}
          </button>
        </div> */}
      </div>

      <div className="flex flex-col gap-2 px-0 py-3">
        {/* title and address */}
        <div className="flex flex-col gap-[2px]">
          <div className="flex items-center justify-between gap-4">
            <h3 className="max-w-[320px] flex-1 truncate text-lg leading-5 font-semibold text-[var(--color-base-content)]">
              {translate(t, 'contentSwitcher.card.title', {
                type: translateListingType(
                  listing.placeInfo.placeType,
                  t.hostContent.editListing.content.editPropertyType.types
                ),
                location: location.city,
              })}
            </h3>
            {score > 0 && (
              <div className="flex items-center gap-[2px] text-xs font-normal text-[var(--color-base-content)]">
                <StarIcon className="text-accent h-5 w-5" />
                {score.toFixed(1)}
              </div>
            )}
          </div>

          <p className="line-clamp-1 text-sm text-[var(--color-neutral)]">
            {location.address}
          </p>
        </div>

        {/* availability */}
        {availabilitySummary && (
          <p className="text-xs text-[var(--color-base-content-secondary)]">
            {`${formatDateRange(availabilitySummary.startDate, availabilitySummary.endDate, lang)}`}
          </p>
        )}

        {/* pricing */}
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[var(--color-base-content)]">
            {pricing.currency} {pricing.subtotal}
          </span>
          {nights > 0 && (
            <span className="text-xs font-normal text-[var(--color-neutral)]">
              {translate(
                t,
                nights === 1
                  ? 'contentSwitcher.card.perNights_one'
                  : 'contentSwitcher.card.perNights_other',
                { count: nights }
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
