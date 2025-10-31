import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import type {
  HouseRules,
  ListingAvailibility,
  ParamsListingAvailibility,
} from '@/types/listing/listing';
import ListingCalendar from './ListingCalendar';
import type { Guests } from '@/types/search';
import { fetchListingAvailability } from '@/services/listings';
import { format, parse } from 'date-fns';
import ListingBooking from './ListingBooking';
import ListingCancellationPolicy from './ListingCancellationPolicy';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useCalendar } from '../Hooks/useCalendar';
import type { CalendarSettings } from '@/types/listing/pricing';
interface Props {
  id: number;
  city: string;
  petsAllowed: boolean;
  maxGuests: number;
  lang?: SupportedLanguages;
  calendarSettings: CalendarSettings;
  houseRules: HouseRules;
  preview?: boolean;
}

const BookingContainer: React.FC<Props> = ({
  id,
  city,
  petsAllowed,
  maxGuests,
  lang = 'es',
  calendarSettings,
  houseRules,
  preview = false,
}) => {
  const t = getTranslation(lang);
  const didInitRef = useRef(false);
  const [availability, setAvailability] = useState<ListingAvailibility | null>(
    null
  );
  const [calendarPortal, setCalendarPortal] = useState<HTMLElement | null>(
    null
  );
  const [bookingPortal, setBookingPortal] = useState<HTMLElement | null>(null);
  const [cancellationPolicyPortal, setCancellationPolicyPortal] =
    useState<HTMLElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const requestIdRef = useRef(0);
  const queryParams = getListingAvailabilityParams();
  const [bookingForm, setBookingForm] = useState({
    checkInDate: queryParams?.checkInDate
      ? parse(queryParams.checkInDate, 'yyyy-MM-dd', new Date())
      : null,
    checkoutDate: queryParams?.checkoutDate
      ? parse(queryParams.checkoutDate, 'yyyy-MM-dd', new Date())
      : null,
    guestCount: {
      adults: queryParams?.adults || 1,
      children: queryParams?.children || 0,
      infants: queryParams?.infants || 0,
      pets: queryParams?.pets || 0,
    },
    canUpdateBooking: true,
  });
  const [blockedMsg, setBlockedMsg] = useState<string | null>(null);

  const showBlocked = useCallback(() => {
    setBlockedMsg(`${t.listingDetail.booking.blockedComponent}`);
    setTimeout(() => setBlockedMsg(null), 5000);
  }, [t]);

  const isGuestCountValid = useMemo(
    () =>
      bookingForm.guestCount.adults + bookingForm.guestCount.children <=
      maxGuests,
    [bookingForm.guestCount.adults, bookingForm.guestCount.children, maxGuests]
  );
  const handleUrl = useCallback(
    (
      customCheckInDate?: Date | null,
      customCheckoutDate?: Date | null,
      customGuestCount?: Guests
    ) => {
      const guests = customGuestCount || bookingForm.guestCount;
      const checkIn = customCheckInDate ?? bookingForm.checkInDate;
      const checkOut = customCheckoutDate ?? bookingForm.checkoutDate;
      updateListingAvailabilityUrl(
        window.location.pathname,
        guests,
        checkIn,
        checkOut
      );
    },
    [bookingForm.guestCount, bookingForm.checkInDate, bookingForm.checkoutDate]
  );

  const updateCalendar = (
    checkInDate: Date | null,
    checkoutDate: Date | null
  ) => {
    if (preview) return showBlocked();
    if (
      checkInDate &&
      checkoutDate &&
      checkInDate.getTime() == checkoutDate.getTime()
    ) {
      return;
    }
    setBookingForm((prev) => ({
      ...prev,
      checkInDate,
      checkoutDate,
      canUpdateBooking: true,
    }));
    handleUrl(checkInDate, checkoutDate);
  };

  const updateGuest = (guest: Guests) => {
    if (preview) return showBlocked();
    setBookingForm((prev) => ({
      ...prev,
      guestCount: guest,
      canUpdateBooking: false,
    }));
    handleUrl(undefined, undefined, guest);
  };
  const fetchInitialAvailability = useCallback(async () => {
    if (preview) return;
    setIsError(false);
    setIsLoading(true);
    const currentReq = ++requestIdRef.current;
    try {
      const availability = await fetchListingAvailability(id);
      if (currentReq !== requestIdRef.current) return;
      setAvailability(availability);
      setIsError(false);
    } catch (err) {
      if (currentReq !== requestIdRef.current) return;
      console.error('Error al obtener disponibilidad inicial:', err);
      setAvailability(null);
      setIsError(true);
    } finally {
      if (currentReq === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [id, preview]);

  const reloadAvailability = useCallback(async () => {
    setIsError(false);
    if (preview) {
      return;
    }
    if (!isGuestCountValid) {
      return;
    }
    if (!bookingForm.checkInDate || !bookingForm.checkoutDate) {
      return;
    }
    const params = {
      checkInDate: format(bookingForm.checkInDate, 'yyyy-MM-dd'),
      checkoutDate: format(bookingForm.checkoutDate, 'yyyy-MM-dd'),
      adults: bookingForm.guestCount.adults,
      children: bookingForm.guestCount.children,
      infants: bookingForm.guestCount.infants,
      pets: bookingForm.guestCount.pets,
    };

    setIsLoading(true);
    const currentReq = ++requestIdRef.current;
    try {
      const availability = await fetchListingAvailability(id, params);
      if (currentReq !== requestIdRef.current) return;
      setAvailability(availability);
      setIsError(false);
    } catch (err) {
      if (currentReq !== requestIdRef.current) return;
      console.error('Error al obtener disponibilidad:', err);
      setAvailability(null);
      setIsError(true);
    } finally {
      if (currentReq === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [id, isGuestCountValid, bookingForm, preview]);

  const {
    today,
    initialRange,
    month,
    setMonth,
    selected,
    preparationDates,
    handleSelect,
    handleReset,
    isAboveMaxDays,
    isBelowMinDays,
    disabledDays,
    blockedDatesArray,
  } = useCalendar({
    checkIn: bookingForm.checkInDate,
    checkout: bookingForm.checkoutDate,
    calendarSettings: calendarSettings,
    blockedCalendarDays: availability ? availability.calendar : null,
    onUpdate: updateCalendar,
    isLoading,
    houseRules: houseRules,
  });

  useEffect(() => {
    setCalendarPortal(document.getElementById('calendar-container'));
    setBookingPortal(document.getElementById('booking-container'));
    setCancellationPolicyPortal(
      document.getElementById('cancellation-policy-container')
    );
  }, []);

  useEffect(() => {
    if (
      bookingForm.canUpdateBooking &&
      bookingForm.checkInDate &&
      bookingForm.checkoutDate &&
      bookingForm.checkInDate.getTime() !== bookingForm.checkoutDate.getTime()
    ) {
      didInitRef.current = true;
      reloadAvailability();
    } else {
      if (didInitRef.current) return;
      didInitRef.current = true;
      fetchInitialAvailability();
    }
  }, [
    bookingForm.canUpdateBooking,
    bookingForm.checkInDate,
    bookingForm.checkoutDate,
    reloadAvailability,
    fetchInitialAvailability,
  ]);
  if (!calendarSettings) {
    return null;
  }
  const isFormValid: boolean = !isLoading
    ? !isError &&
      isGuestCountValid &&
      !!bookingForm.checkInDate &&
      !!bookingForm.checkoutDate &&
      availability?.isAvailable === true
    : false;
  return (
    <>
      {calendarPortal
        ? createPortal(
            <div className="py-8">
              <ListingCalendar
                calendarResult={{
                  today,
                  initialRange,
                  month,
                  setMonth,
                  selected,
                  preparationDates,
                  blockedDatesArray,
                  handleSelect,
                  handleReset,
                  isAboveMaxDays,
                  isBelowMinDays,
                  disabledDays,
                }}
                calendarSettings={calendarSettings}
                city={city}
                lang={lang}
                modal={false}
              />
            </div>,
            calendarPortal
          )
        : null}
      {calendarPortal && blockedMsg
        ? createPortal(
            <div className="mt-2 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-700">
              {blockedMsg}
            </div>,
            calendarPortal
          )
        : null}
      {bookingPortal
        ? createPortal(
            <ListingBooking
              calendarResult={{
                today,
                initialRange,
                month,
                setMonth,
                selected,
                preparationDates,
                handleSelect,
                handleReset,
                isAboveMaxDays,
                isBelowMinDays,
                disabledDays,
                blockedDatesArray,
              }}
              pricing={availability?.pricing ?? null}
              isAvailable={availability?.isAvailable ?? true}
              calendarSettings={calendarSettings}
              onUpdateGuest={updateGuest}
              checkIn={bookingForm.checkInDate}
              checkout={bookingForm.checkoutDate}
              guestCount={bookingForm.guestCount}
              lang={lang}
              city={city}
              petsAllowed={petsAllowed}
              onReloadAvailability={reloadAvailability}
              maxGuests={maxGuests}
              maxPets={houseRules.pets}
              isGuestCountValid={isGuestCountValid}
              isLoading={isLoading}
              isError={isError}
              listingId={id}
            />,
            bookingPortal
          )
        : null}
      {bookingPortal && blockedMsg
        ? createPortal(
            <div className="mt-2 rounded-xl border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-700">
              {blockedMsg}
            </div>,
            bookingPortal
          )
        : null}
      {cancellationPolicyPortal
        ? createPortal(
            <ListingCancellationPolicy
              checkIn={bookingForm.checkInDate}
              checkout={bookingForm.checkoutDate}
              cancellationPolicy={availability?.cancellationPolicy}
              lang={lang}
              isFormValid={isFormValid}
              today={today}
              description2={true}
            />,
            cancellationPolicyPortal
          )
        : null}
    </>
  );
};

export default BookingContainer;

const getListingAvailabilityParams = (): ParamsListingAvailibility | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const checkInDate = params.get('checkInDate');
  const checkoutDate = params.get('checkoutDate');
  if (checkInDate && checkoutDate) {
    return {
      checkInDate,
      checkoutDate,
      adults: Number(params.get('adults')) || 1,
      children: Number(params.get('children')) || 0,
      infants: Number(params.get('infants')) || 0,
      pets: Number(params.get('pets')) || 0,
    };
  }
  return null;
};

const updateListingAvailabilityUrl = (
  pathname: string,
  guests: Guests,
  checkInDate?: Date | null,
  checkOutDate?: Date | null
) => {
  const params = new URLSearchParams();
  if (guests.adults > 0) params.append('adults', guests.adults.toString());
  if (guests.children > 0)
    params.append('children', guests.children.toString());
  if (guests.infants > 0) params.append('infants', guests.infants.toString());
  if (guests.pets > 0) params.append('pets', guests.pets.toString());
  if (checkInDate)
    params.append('checkInDate', format(checkInDate, 'yyyy-MM-dd'));
  if (checkOutDate)
    params.append('checkoutDate', format(checkOutDate, 'yyyy-MM-dd'));
  const newUrl = `${pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};
