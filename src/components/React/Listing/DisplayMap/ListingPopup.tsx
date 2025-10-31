import clsx from 'clsx';
import React, { useCallback } from 'react';
import type { SearchListingMarker } from '@/types/listing/display-map/searchListingMarker';
import { useNightsBetweenDates } from '@/components/React/Hooks/useNightsBetweenDates';
import Carousel from '@/components/React/Common/Carousel';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

//import HeartFilledIcon from '/src/icons/heart-fill.svg?react';
//import HeartOutlineIcon from '/src/icons/heart-linear.svg?react';
import CloseIcon from '/src/icons/close.svg?react';
import StarIcon from '/src/icons/star.svg?react';
import { formatDateRange } from '@/utils/dateUtils';
import { toKeyIn } from '@/components/React/Utils/edit-listing/keyify';

interface Props {
  data: SearchListingMarker;
  className?: string;
  onClose: () => void;
  params: string;
  lang?: SupportedLanguages;
}

function translateListingType(
  rawType: string,
  dict: Record<string, string>
): string {
  const key = toKeyIn(rawType, dict);
  return key ? dict[key] : rawType;
}

export default function ListingPopup({
  data,
  className,
  onClose,
  params,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const {
    photos,
    location,
    pricing,
    score,
    availabilitySummary,
    //wishlisted,
    placeInfo,
  } = data;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const base = `/listing/${data.id}`;
      const url = params ? `${base}?${params}` : base;
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    [data.id, params]
  );

  const nights = useNightsBetweenDates(
    availabilitySummary?.startDate ?? '',
    availabilitySummary?.endDate ?? ''
  );

  return (
    <div
      className={clsx(
        'flex w-[282px] cursor-pointer flex-col items-start rounded-t-2xl bg-[#EEF7FF] shadow-xl',
        className
      )}
      onClick={handleClick}
    >
      <div className="relative h-[234px] w-full overflow-hidden rounded-t-2xl">
        <Carousel images={photos} />

        <div className="absolute top-[10px] right-[9.8px] flex items-center gap-[7px]">
          {/* Wishlist Button */}
          {/* <button
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              'group flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] shadow-sm transition-all duration-150 ease-in-out',
              'hover:scale-105',
              wishlisted
                ? 'bg-[var(--color-base-150)]'
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
          </button> */}

          {/* Close Button */}
          <button
            className={clsx(
              'z-[9999] flex h-[31.2px] w-[31.2px] items-center justify-center rounded-[16px] bg-[#B9E2FB] shadow-[0px_1.3px_2.6px_rgba(0,0,0,0.05)] transition-all duration-150 ease-in-out hover:scale-105 hover:bg-[#91cceb]'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CloseIcon className="h-[18.2px] w-[18.2px]" />
          </button>
        </div>
      </div>

      <div className="flex w-full flex-col gap-0 px-3 py-3">
        <div className="flex w-full items-start justify-between gap-4">
          <span className="max-w-[320px] flex-1 truncate text-base leading-4 font-semibold text-[#152E51]">
            {translate(t, 'contentSwitcher.card.title', {
              type: translateListingType(
                placeInfo.placeType,
                t.hostContent.editListing.content.editPropertyType.types
              ),
              location: location.city,
            })}
          </span>

          {score > 0 && (
            <div className="flex items-center gap-[4px] text-sm font-medium text-[#152E51]">
              <StarIcon className="text-accent h-4 w-4" />
              {score.toFixed(1)}
            </div>
          )}
        </div>

        <div className="mt-2 flex w-full items-center justify-between text-xs">
          <div className="flex items-center gap-[4px]">
            <span className="text-sm font-semibold text-[#152E51]">
              {pricing.currency} {pricing.subtotal}
            </span>
            <span className="text-xs font-normal text-[#73787C]">
              {translate(
                t,
                nights === 1
                  ? 'contentSwitcher.card.perNights_one'
                  : 'contentSwitcher.card.perNights_other',
                { count: nights }
              )}
            </span>
          </div>

          <span className="text-right text-xs text-[#152E51]">
            {availabilitySummary
              ? ` ${formatDateRange(availabilitySummary.startDate, availabilitySummary.endDate, lang)}`
              : translate(t, 'contentSwitcher.card.notAvailable')}
          </span>
        </div>
      </div>
    </div>
  );
}
