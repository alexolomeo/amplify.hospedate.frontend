import React, { useState } from 'react';
import { translate, type SupportedLanguages } from '@/utils/i18n';
import type { HouseRules, TripDetail } from '@/types/tripDetail';
import { formatHour } from '@/utils/formatHour';
import ClockIcon from '/src/icons/clock.svg?react';
import UsersIcon from '/src/icons/users.svg?react';
import ModalHouseRules from './ModalHouseRules';
import type { ListingDetail } from '@/types/listing/listing.ts';

interface TripDetailHouseRulesProps {
  tripDetail?: TripDetail | null;
  t: ReturnType<typeof translate>;
  lang: SupportedLanguages;
  listingDetail?: ListingDetail | null;
  isConversationCard?: boolean;
}

function getHouseRules(
  trip?: TripDetail | null,
  listing?: ListingDetail | null
): HouseRules {
  const src = trip?.houseRules ?? listing?.houseRules;
  if (!src) {
    throw new Error(
      'TripDetailHouseRules requires houseRules from tripDetail or listingDetail'
    );
  }

  // Local compat type: allows `guestNumber` alongside `guests`
  type HouseRulesCompat = HouseRules & { guestNumber?: number };

  const hr = src as HouseRulesCompat;

  // If only `guestNumber` exists, alias it to `guests`
  if (typeof hr.guestNumber === 'number') {
    return { ...hr, guests: hr.guestNumber };
  }

  // Otherwise return original; caller may handle missing guests
  return hr;
}

const TripDetailHouseRules: React.FC<TripDetailHouseRulesProps> = ({
  tripDetail,
  t,
  lang,
  listingDetail,
  isConversationCard,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const houseRules = getHouseRules(tripDetail, listingDetail);

  const guests = houseRules.guests;

  // Convert time values from tripDetail format to expected format
  // tripDetail uses direct numeric values, we need to handle the flexible time case
  const checkInStartTime = houseRules.checkInStartTime;
  const checkInEndTime = houseRules.checkInEndTime;

  // Build check-in message based on the logic from ListingDetailThingsToKnow.astro
  let checkInMessage: string;
  if (checkInStartTime === -1 && checkInEndTime === -1) {
    // Both are flexible
    checkInMessage = translate(
      t,
      'listingDetail.thingsToKnow.houseRules.checkInOut.flexibleCheckIn'
    );
  } else if (checkInStartTime !== -1 && checkInEndTime === -1) {
    // Start time specified, end time flexible
    const formattedStart = formatHour(checkInStartTime);
    checkInMessage = translate(
      t,
      'listingDetail.thingsToKnow.houseRules.checkInOut.checkInFrom',
      {
        start: formattedStart,
      }
    );
  } else {
    // Both start and end times specified
    const formattedStart = formatHour(checkInStartTime);
    const formattedEnd = formatHour(checkInEndTime);
    checkInMessage = translate(
      t,
      'listingDetail.thingsToKnow.houseRules.checkInOut.startEnd',
      {
        start: formattedStart,
        end: formattedEnd,
      }
    );
  }

  // Build checkout message
  const formattedCheckout = formatHour(houseRules.checkoutTime);
  const checkoutMessage = translate(
    t,
    'listingDetail.thingsToKnow.houseRules.checkInOut.checkout',
    {
      checkout: formattedCheckout,
    }
  );

  return (
    <>
      <section className="relative flex flex-col gap-4 px-4 sm:gap-6 sm:px-0">
        <h3 className="text-base-content text-lg font-bold sm:text-xl">
          {translate(t, 'tripDetail.houseRules.title')}
        </h3>

        <div className="flex flex-wrap items-end justify-between">
          <div className="flex flex-col gap-0">
            <div className="flex h-auto items-start gap-3 py-1 sm:h-9 sm:items-center sm:py-0">
              <ClockIcon className="text-secondary mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
              <span className="text-base-content flex-1 text-xs leading-relaxed sm:text-sm">
                {checkInMessage}
              </span>
            </div>

            <div className="flex h-auto items-start gap-3 py-1 sm:h-9 sm:items-center sm:py-0">
              <ClockIcon className="text-secondary mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
              <span className="text-base-content flex-1 text-xs leading-relaxed sm:text-sm">
                {checkoutMessage}
              </span>
            </div>

            <div className="flex h-auto items-start gap-3 py-1 sm:h-9 sm:items-center sm:py-0">
              <UsersIcon className="text-secondary mt-0.5 h-5 w-5 flex-shrink-0 sm:mt-0 sm:h-6 sm:w-6" />
              <span className="text-base-content flex-1 text-xs leading-relaxed sm:text-sm">
                {translate(t, 'tripDetail.houseRules.maxGuests', {
                  count: guests,
                })}
              </span>
            </div>
          </div>

          <button
            className={`${!isConversationCard && 'relative right-0 sm:absolute sm:right-0 sm:bottom-4'} ml-auto flex h-8 cursor-pointer items-center justify-center rounded-full bg-transparent px-3 py-0`}
            onClick={() => setIsModalOpen(true)}
          >
            <span className="text-primary text-xs underline sm:text-sm">
              {translate(t, 'tripDetail.actions.viewMore')}
            </span>
          </button>
        </div>
      </section>

      <ModalHouseRules
        houseRules={houseRules}
        checkInMessage={checkInMessage}
        checkoutMessage={checkoutMessage}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        t={t}
        lang={lang}
      />
    </>
  );
};

export default TripDetailHouseRules;
