import {
  Status,
  type BookedDate,
  type CalendarDate,
} from '@/types/host/calendar/hostCalendar';
import type { MouseEventHandler } from 'react';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import type { PriceSectionValues } from '@/types/host/calendar/preferenceSetting';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface CustomDayProps {
  date: Date;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  calendarDatesMap: Map<string, CalendarDate>;
  priceValues: PriceSectionValues;
  bookedDates: BookedDate[];
  lang: SupportedLanguages;
  modifiers: Record<string, boolean>;
}
const statusClasses: Record<Status, string> = {
  BOOKED: '',
  PREPARATION_TIME: '',
  BLOCKED_BY_USER: 'bg-error-content',
  PRICE_CHANGED: '',
  NOTE: '',
  BLOCKED_EXTERNAL: '',
};

const getBookingForDay = (
  day: Date,
  bookings: BookedDate[]
): BookedDate | undefined => {
  const normalizedDay = new Date(day);
  normalizedDay.setHours(0, 0, 0, 0);
  return bookings.find((booking) => {
    const startDate = new Date(`${booking.startDate}T00:00:00`);
    const endDate = new Date(`${booking.endDate}T00:00:00`);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    return normalizedDay >= startDate && normalizedDay <= endDate;
  });
};

export const CustomDay = (props: CustomDayProps) => {
  const {
    date,
    calendarDatesMap,
    priceValues,
    className,
    bookedDates,
    lang,
    modifiers,
    ...dayPickerProps
  } = props;
  const t = getTranslation(lang);
  const dayOfMonth = date.getDate();
  const dayString = date.toISOString().split('T')[0];
  const dayData = calendarDatesMap.get(dayString);

  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
  const displayPrice =
    dayData?.price ??
    (isWeekend
      ? (priceValues.perWeekend ?? priceValues.perNight)
      : priceValues.perNight);
  const statusClass = dayData ? statusClasses[dayData.status] : '';
  const dayClassName = `${className} ${statusClass} flex flex-col justify-between py-4 text-start border ${modifiers.selected ? 'border-primary' : 'border-neutral-content'}`;

  const booking = getBookingForDay(date, bookedDates);
  const isSameDay = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === date.getTime();
  };

  const isBookingStartDate = booking && isSameDay(booking.startDate);
  const isBookingEndDate = booking && isSameDay(booking.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayBeforeEndDate = booking && new Date(`${booking.endDate}T00:00:00`);
  if (dayBeforeEndDate) {
    dayBeforeEndDate.setDate(dayBeforeEndDate.getDate() - 1);
  }
  const isDayBeforeBookingEndDate =
    dayBeforeEndDate && date.getTime() === dayBeforeEndDate.getTime();

  return (
    <button {...dayPickerProps} className={dayClassName}>
      <div className="flex items-center justify-between px-2 text-sm md:px-4">
        <span>{dayOfMonth}</span>
        {date.toDateString() === today.toDateString() && (
          <span className="text-primary font-bold">
            {t.hostContent.calendar.today}
          </span>
        )}
      </div>
      <div className="w-full">
        {booking && (
          <>
            {isBookingStartDate ? (
              <div
                className={`bg-primary text-primary-content flex w-full items-center ${
                  isBookingEndDate ? 'rounded-full' : 'rounded-l-full'
                } `}
              >
                {booking.guest.profilePicture && (
                  <ResponsiveImage
                    photo={booking.guest.profilePicture}
                    alt={'avatar'}
                    className="hidden h-8 w-8 rounded-full object-cover md:block"
                  />
                )}
                <p className="ml-1 hidden text-xs md:block">
                  {booking.guest.username} ● {booking.totalPrice.toFixed()}
                </p>
                <p className="ml-1 block w-10 truncate text-xs md:hidden">
                  {booking.guest.username}
                </p>
              </div>
            ) : isDayBeforeBookingEndDate ? (
              <div
                className={`bg-primary text-primary-content w-full rounded-r-full py-2 md:py-4`}
              ></div>
            ) : isBookingEndDate ? (
              <></>
            ) : (
              <div
                className={`bg-primary text-primary-content w-full py-2 md:py-4`}
              ></div>
            )}
          </>
        )}
        {dayData?.status == Status.PreparationTime && (
          <div
            className={`bg-warning text-primary-content w-full rounded-full py-2`}
          >
            <span className="ml-1 hidden text-xs md:block">
              {t.hostContent.calendar.inPreparation}
            </span>
          </div>
        )}
        {dayData?.status == Status.BlockedExternal && (
          <div
            className={`bg-error text-error-content w-full items-center rounded-full py-2`}
          >
            <p className="ml-1 hidden w-10 text-xs md:block">
              <span className="w-10 truncate">
                {t.hostContent.calendar.blockedExternal}
              </span>
            </p>
          </div>
        )}
      </div>
      <span className="mt-1 px-2 text-xs md:px-4 md:text-sm">
        {priceValues.currency} {displayPrice}
      </span>
    </button>
  );
};
