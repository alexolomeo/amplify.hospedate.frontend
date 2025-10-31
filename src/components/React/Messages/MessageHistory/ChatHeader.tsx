import React, { useMemo } from 'react';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import type { SupportedLanguages } from '@/utils/i18n.ts';
import { formatFriendlyDateRange } from '@/utils/dateUtils.ts';

interface Props {
  isSkeleton: boolean;
  title: string;
  headerAvatars: React.ReactNode;
  onBack: () => void;
  onShowTripListingInfo: () => void;
  loadingTripDetails: boolean;
  showLoadingTripDetails: boolean;
  actionLabel: string;
  backAriaLabel: string;
  checkInDate?: string | null;
  checkOutDate?: string | null;
  location?: string | null;
  lang?: SupportedLanguages;
}

const ChatHeader: React.FC<Props> = ({
  isSkeleton,
  title,
  checkInDate,
  checkOutDate,
  location,
  lang = 'es',
  headerAvatars,
  onBack,
  onShowTripListingInfo,
  loadingTripDetails,
  showLoadingTripDetails,
  actionLabel,
  backAriaLabel,
}) => {
  const subtitle = useMemo(() => {
    const friendly = formatFriendlyDateRange(checkInDate, checkOutDate, lang);
    const loc = location ? ` • ${location}` : '';
    return friendly ? friendly + loc : (location ?? '');
  }, [checkInDate, checkOutDate, location, lang]);

  return (
    <>
      {/* Desktop header */}
      <div className="md:bg-base-100 hidden w-full md:sticky md:top-0 md:z-10 md:flex md:items-center md:justify-between md:py-6 md:shadow-sm">
        <div className="w-20" />
        <div className="flex flex-col text-center">
          <div className="mt-2 flex w-full justify-center">
            <h3 className="line-clamp-1 w-full text-center text-base leading-6 font-bold">
              {title}
            </h3>
          </div>
          <div className="text-base-content line-clamp-1 w-full text-xs">
            {isSkeleton ? (
              <div className="mx-auto mt-2 h-3 w-28 animate-pulse rounded bg-gray-200" />
            ) : (
              subtitle
            )}
          </div>
        </div>
        <button
          onClick={onShowTripListingInfo}
          className="bg-neutral-content/40 flex w-20 cursor-pointer items-center justify-center rounded-full px-2 py-1.5"
        >
          {showLoadingTripDetails && loadingTripDetails ? (
            <span className="border-t-primary inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300" />
          ) : (
            actionLabel
          )}
        </button>
      </div>

      {/* Mobile header */}
      <header className="bg-base-100 sticky top-0 z-10 h-24 w-full shadow-md md:hidden">
        <div className="flex h-full items-center py-1">
          <button
            type="button"
            onClick={onBack}
            className="flex h-12 w-20 cursor-pointer items-center justify-start pl-5"
            aria-label={backAriaLabel}
            tabIndex={0}
          >
            <ChevronLeftIcon className="text-base-content h-7 w-7" />
          </button>
          <div className="flex flex-1 flex-col items-center">
            <div className="flex justify-center">{headerAvatars}</div>
            <div className="mt-2 flex w-full justify-center">
              <h3 className="line-clamp-1 w-full text-center text-base leading-6 font-bold">
                {title}
              </h3>
            </div>
            <div className="text-base-content line-clamp-1 flex w-full justify-center text-xs">
              {subtitle}
            </div>
          </div>
          <div className="w-20">
            <button
              onClick={onShowTripListingInfo}
              className="bg-neutral-content/40 rounded-full px-2 py-1.5"
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default ChatHeader;
