import React from 'react';
import {
  translate,
  getTranslation,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import UsersIcon from '/src/icons/users.svg?react';
import ArrowLeftOnRectangleIcon from '/src/icons/arrow-left-on-rectangle.svg?react';
import ArrowRightOnRectangleIcon from '/src/icons/arrow-right-on-rectangle.svg?react';
import { parseISO } from 'date-fns';

interface TripDetailBookingProps {
  tripDetail: TripDetail;
  lang: SupportedLanguages;
}

const TripDetailBooking: React.FC<TripDetailBookingProps> = ({
  tripDetail,
  lang,
}) => {
  const t = getTranslation(lang);
  const booking = tripDetail.booking;

  const formatDate = (dateLike: unknown) => {
    const date =
      dateLike instanceof Date ? dateLike : parseISO(dateLike as string);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getGuestsText = () => {
    const adults = Number(booking.adults ?? 0);
    const children = Number(booking.children ?? 0);
    const pets = Number(booking.pets ?? 0);

    const people = adults + children;
    const peopleLabel = translate(
      t,
      people === 1 ? 'trips.peopleOne' : 'trips.peopleOther'
    );

    if (pets > 0) {
      const petLabel = translate(t, pets === 1 ? 'trips.petOne' : 'trips.pets');
      const andWord = translate(t, 'trips.and');
      return `${people} ${peopleLabel} ${andWord} ${pets} ${petLabel}`;
    }

    return `${people} ${peopleLabel}`;
  };

  return (
    <section className="flex flex-col gap-4 px-4 sm:px-0">
      <h3 className="text-base-content text-lg font-bold sm:text-xl">
        {translate(t, 'tripDetail.booking.title')}
      </h3>

      <div className="flex flex-col gap-3 sm:flex-row">
        {/* How Many */}
        <div className="bg-base-200/30 flex min-h-[100px] flex-1 flex-col items-center gap-2 rounded-xl p-3 sm:min-h-0 sm:rounded-2xl sm:p-4">
          <UsersIcon className="text-secondary h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-base-content text-center text-xs font-bold sm:text-sm">
            {translate(t, 'tripDetail.booking.howMany')}
          </span>
          <span className="text-neutral text-center text-xs sm:text-sm">
            {getGuestsText()}
          </span>
        </div>

        {/* Check In */}
        <div className="bg-base-200/30 flex min-h-[100px] flex-1 flex-col items-center gap-2 rounded-xl p-3 sm:min-h-0 sm:rounded-2xl sm:p-4">
          <ArrowLeftOnRectangleIcon className="text-secondary h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-base-content text-center text-xs font-bold sm:text-sm">
            {translate(t, 'tripDetail.booking.checkIn')}
          </span>
          <span className="text-neutral text-center text-xs leading-tight sm:text-sm">
            {formatDate(booking.checkInDate)}
          </span>
        </div>

        {/* Check Out */}
        <div className="bg-base-200/30 flex min-h-[100px] flex-1 flex-col items-center gap-2 rounded-xl p-3 sm:min-h-0 sm:rounded-2xl sm:p-4">
          <ArrowRightOnRectangleIcon className="text-secondary h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-base-content text-center text-xs font-bold sm:text-sm">
            {translate(t, 'tripDetail.booking.checkOut')}
          </span>
          <span className="text-neutral text-center text-xs leading-tight sm:text-sm">
            {formatDate(booking.checkoutDate)}
          </span>
        </div>
      </div>
    </section>
  );
};

export default TripDetailBooking;
