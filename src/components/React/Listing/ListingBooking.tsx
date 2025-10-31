import type {
  CalendarSettings,
  Pricing,
  UseCalendarReturn,
} from '@/types/listing/pricing';
import type { Guests } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { differenceInCalendarDays } from 'date-fns';
import ListingCalendar from './ListingCalendar';
import { useSearch } from '../Hooks/useSearch';
import GuestCounter from '../GuestCounter';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import BookingPriceSummary from './BookingPriceSummary';
import AppButton from '../Common/AppButton';
import ChevronRightMiniIcon from '/src/icons/chevron-right-mini.svg?react';
import { $userStore } from '@/stores/userStore';
import { useStore } from '@nanostores/react';
import XMarkIcon from '/src/icons/x-mark-mini.svg?react';
import { AuthEventEmitter } from '@/utils/authEventEmitter';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface Props {
  calendarResult: UseCalendarReturn;
  checkIn: Date | null;
  checkout: Date | null;
  calendarSettings: CalendarSettings;
  pricing: Pricing | null;
  guestCount: Guests;
  onUpdateGuest: (guest: Guests) => void;
  lang?: SupportedLanguages;
  onReloadAvailability: () => void;
  city: string;
  petsAllowed: boolean;
  maxGuests: number;
  maxPets?: number;
  isGuestCountValid: boolean;
  isLoading: boolean;
  listingId: number;
  isError: boolean;
  isAvailable: boolean;
}

const ListingBooking: React.FC<Props> = ({
  calendarResult,
  isAvailable,
  pricing,
  guestCount,
  checkIn,
  checkout,
  onUpdateGuest,
  calendarSettings,
  lang = 'es',
  city,
  petsAllowed = false,
  maxGuests = 10,
  maxPets,
  isGuestCountValid,
  onReloadAvailability,
  isLoading,
  listingId,
  isError = false,
}) => {
  const t = getTranslation(lang);
  const user = useStore($userStore);
  const nights = useMemo(
    () =>
      checkIn && checkout ? differenceInCalendarDays(checkout, checkIn) : 0,
    [checkIn, checkout]
  );
  const handleOpenLogin = useCallback(() => {
    const redirect = location.pathname || '/';
    AuthEventEmitter.emit('ui.openAuth', { redirect });
  }, []);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getGuestSubtitle } = useSearch(guestCount, t);

  const hasDates = Boolean(checkIn && checkout);
  const shouldShowDateError = !isLoading
    ? hasDates
      ? !isAvailable
      : false
    : false;
  const showReloadBtn = !isLoading
    ? !isError && isGuestCountValid && hasDates && !pricing
    : false;
  const shouldShowPricing = isGuestCountValid && nights > 0 && isAvailable;
  const showReserveBtn =
    isGuestCountValid && hasDates && !isError && isAvailable && pricing;

  const validBorderClass = 'border border-blue-100';
  const invalidBorderClass = 'border border-red-300 bg-red-100';
  const arrivalText = translate(t, t.search.arrival);
  const departureText = translate(t, t.search.departure);
  const addDateText = translate(t, t.search.addDate);
  const addGuestsText = translate(t, t.search.addGuests);
  const bookingText = t.listingDetail.booking;
  const inactiveDatesText = translate(t, t.listingDetail.booking.inactiveDates);
  const tryChangingDatesText = translate(t, bookingText.tryChangingDates);
  const guestLimitExceededText = translate(t, bookingText.guestLimitExceeded);
  const tryLowerGuestsText = translate(t, bookingText.tryLowerGuests);
  const checkAvailabilityText = translate(t, bookingText.checkAvailability);
  const goToBookingDataText = translate(t, bookingText.goToBookingData);

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && dropdownRef.current) {
          const focusableElements =
            dropdownRef.current.querySelectorAll('[tabindex]');
          focusableElements.forEach((element: Element) => {
            if (element instanceof HTMLElement) {
              element.blur();
            }
          });
        }
      });
    };
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    });
    const currentDropdownElement = dropdownRef.current;
    if (currentDropdownElement) {
      observer.observe(currentDropdownElement);
    }
    return () => {
      if (currentDropdownElement) {
        observer.unobserve(currentDropdownElement);
      }
      observer.disconnect();
    };
  }, []);

  const handleBooking = async () => {
    try {
      if (!user) {
        return handleOpenLogin();
      }

      const params = new URLSearchParams();
      params.set('checkInDate', checkIn?.toISOString().split('T')[0] ?? '');
      params.set('checkoutDate', checkout?.toISOString().split('T')[0] ?? '');
      if (guestCount.adults > 0) {
        params.set('adults', guestCount.adults.toString());
      }
      if (guestCount.children > 0) {
        params.set('children', guestCount.children.toString());
      }
      if (guestCount.infants > 0) {
        params.set('infants', guestCount.infants.toString());
      }
      if (guestCount.pets > 0) {
        params.set('pets', guestCount.pets.toString());
      }
      navigate(`/booking/${listingId}?${params.toString()}`);
    } catch (error) {
      console.error('Error navigating to booking page:', error);
    }
  };

  return (
    <div className="card border-base-300 mx-1 rounded-4xl border lg:mx-5">
      <div className="card-body gap-y-8 px-8 py-10">
        {/* title */}
        {shouldShowPricing ? (
          isLoading ? (
            <div className="loading loading-spinner loading-xs text-primary"></div>
          ) : (
            <div className="card-title">
              {pricing && (
                <BookingPriceSummary
                  pricing={pricing}
                  nights={nights}
                  lang={lang}
                ></BookingPriceSummary>
              )}
            </div>
          )
        ) : (
          <></>
        )}
        <div className="space-y-2">
          {/* form Date */}
          <div
            className="dropdown dropdown-center md:dropdown-end lg:dropdown-center z-50 w-full"
            ref={dropdownRef}
          >
            <div className="flex">
              <div
                tabIndex={0}
                role="button"
                aria-label={arrivalText}
                className={`basis-1/2 rounded-l-full px-5 py-2 md:px-4 lg:px-4 ${shouldShowDateError ? invalidBorderClass : validBorderClass}`}
              >
                <p
                  className={`text-xs ${shouldShowDateError ? 'text-error' : 'text-neutral'}`}
                >
                  {arrivalText}
                </p>
                <p
                  className="w-auto text-xs font-normal md:max-w-15 lg:max-w-24"
                  data-testid="listing-booking-checkin"
                >
                  {checkIn ? checkIn.toLocaleDateString() : addDateText}
                </p>
              </div>
              <div
                tabIndex={0}
                role="button"
                aria-label={departureText}
                className={`basis-1/2 rounded-r-full px-5 py-2 md:px-4 lg:px-4 ${shouldShowDateError ? invalidBorderClass : validBorderClass}`}
              >
                <p
                  className={`text-xs ${shouldShowDateError ? 'text-error' : 'text-neutral'}`}
                >
                  {departureText}
                </p>
                <p
                  className="w-auto text-xs font-normal md:max-w-15 lg:max-w-24"
                  data-testid="listing-booking-checkout"
                >
                  {checkout ? checkout.toLocaleDateString() : addDateText}
                </p>
              </div>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content rounded-box bg-base-100 z-50 shadow-sm"
            >
              <div className="pt-1 pb-4">
                <div className="flex justify-end">
                  <button
                    className="btn btn-ghost btn-circle"
                    onClick={() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }}
                  >
                    <XMarkIcon></XMarkIcon>
                  </button>
                </div>
                <ListingCalendar
                  calendarResult={calendarResult}
                  calendarSettings={calendarSettings}
                  lang={lang}
                  city={city}
                  modal={true}
                />
              </div>
            </div>
          </div>
          {/* form Who */}
          <div
            className={`flex justify-start rounded-full ${isGuestCountValid == true ? validBorderClass : invalidBorderClass}`}
          >
            <div className="w-full px-4 py-2">
              <GuestCounter
                guestCount={guestCount}
                onUpdate={onUpdateGuest}
                subtitle={getGuestSubtitle(addGuestsText)}
                lang="es"
                maxGuests={maxGuests}
                maxPets={maxPets}
                petsAllowed={petsAllowed}
                textColor={isGuestCountValid == true ? '' : 'text-error'}
                dropdownSize="w-72"
                dropdownAlign="dropdown-center"
              ></GuestCounter>
            </div>
          </div>
          {/* Validated */}
          {shouldShowDateError && (
            <div
              className="space-y-1 text-xs leading-normal font-normal"
              data-testid="listing-booking-validated-date"
            >
              <p className="text-error">{inactiveDatesText}</p>
              <p>{tryChangingDatesText}</p>
            </div>
          )}
          {isGuestCountValid == false && (
            <div
              className="space-y-1 text-xs leading-normal font-normal"
              data-testid="listing-booking-validated-guest"
            >
              <p className="text-error">{guestLimitExceededText}</p>
              <p>{tryLowerGuestsText}</p>
            </div>
          )}
        </div>
        {showReloadBtn && (
          <AppButton
            label={checkAvailabilityText}
            onClick={onReloadAvailability}
            data-testid="listing-booking-button-reload"
            aria-label="Reload availability"
            size="lg"
          ></AppButton>
        )}
        {showReserveBtn && (
          <AppButton
            label={goToBookingDataText}
            data-testid="listing-booking-button-booking"
            aria-label="Booking"
            size="lg"
            className="h-14"
            icon={ChevronRightMiniIcon}
            onClick={handleBooking}
          ></AppButton>
        )}
      </div>
    </div>
  );
};

export default ListingBooking;
