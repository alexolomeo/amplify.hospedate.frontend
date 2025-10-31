import type { Photo } from '@/types/listing/space';
import React, { useState } from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DayButtonProps,
} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ResponsiveImage } from '../../Common/ResponsiveImage';

// TODO: hardcode date to tests
interface Guest {
  id: number;
  username: string;
  photo: Photo;
}

interface Booking {
  startDate: string;
  endDate: string;
  totalPrice: number;
  currency: string;
  guest: Guest;
}
const bookedDatesFromBackend: Booking[] = [
  {
    startDate: '2025-08-04',
    endDate: '2025-08-04',
    totalPrice: 7949,
    currency: 'BOB',
    guest: {
      id: 544,
      username: 'carmen',
      photo: {
        original:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
        srcsetWebp:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
        srcsetAvif:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
      },
    },
  },
  {
    startDate: '2025-08-25',
    endDate: '2025-08-29',
    totalPrice: 798,
    currency: 'BOB',
    guest: {
      id: 544,
      username: 'Eduardo',
      photo: {
        original:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
        srcsetWebp:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
        srcsetAvif:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
      },
    },
  },
  {
    startDate: '2025-09-05',
    endDate: '2025-09-08',
    totalPrice: 5000,
    currency: 'BOB',
    guest: {
      id: 545,
      username: 'John Doe',
      photo: {
        original:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.jpg',
        srcsetWebp:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.webp 1920w',
        srcsetAvif:
          'https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 480w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 768w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1024w, https://hospedate-dev.s3.us-east-1.amazonaws.com/users/1/b58e5eae-4c07-4f81-a0b7-aead5d423ff6.avif 1920w',
      },
    },
  },
];

const getBookingForDay = (
  day: Date,
  bookings: Booking[]
): Booking | undefined => {
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

const MyDayButton = (props: DayButtonProps) => {
  const dayDate = props.day.date;
  const normalizedDay = new Date(dayDate);
  normalizedDay.setHours(0, 0, 0, 0);

  const dayOfMonth = dayDate.getDate();
  const price = 250;
  const booking = getBookingForDay(props.day.date, bookedDatesFromBackend);

  const isSameDay = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === normalizedDay.getTime();
  };

  const isBookingStartDate = booking && isSameDay(booking.startDate);
  const isBookingEndDate = booking && isSameDay(booking.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isBeforeToday = normalizedDay.getTime() < today.getTime();
  return (
    <button {...props} className="cal-day-btn">
      <div className="flex h-full flex-col items-start justify-between py-4">
        <p className="px-4 text-sm font-medium">{dayOfMonth}</p>
        {booking && (
          <div className="w-full">
            {isBookingStartDate ? (
              <div
                className={`flex w-full items-center ${
                  isBookingEndDate ? 'rounded-full' : 'rounded-l-full'
                } ${isBeforeToday ? 'bg-base-200' : 'bg-primary text-primary-content'}`}
              >
                {booking.guest.photo && (
                  <ResponsiveImage
                    photo={booking.guest.photo}
                    alt={'avatar'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <p className="ml-1 text-xs">
                  {booking.guest.username} {booking.totalPrice}
                </p>
              </div>
            ) : (
              <div
                className={`bg-primary text-primary-content flex w-full py-4 ${
                  isBookingEndDate ? 'rounded rounded-r-full' : ''
                }`}
              ></div>
            )}
          </div>
        )}
        <p className="px-4 text-center">BOB {price}</p>
      </div>
    </button>
  );
};

export default function BookingCalendar() {
  const defaultClassNames = getDefaultClassNames();
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();

  return (
    <div>
      <DayPicker
        mode="multiple"
        selected={selectedDates}
        onSelect={setSelectedDates}
        disabled={{ before: new Date() }}
        components={{
          DayButton: MyDayButton,
        }}
        classNames={{
          root: `${defaultClassNames.root} p-5`, // Add a shadow to the root element
          day: `w-100 outline outline-neutral-content`,
          selected: `outline outline-primary`,
          range_start: 'outline outline-primary',
          range_end: 'outline outline-primary',
          range_middle: 'outline outline-primary',
          today: 'bg-[var(--color-base-150)] text-primary ',
          disabled: 'opacity-60',
        }}
        modifiers={{
          'blocked-days': (day: Date) => {
            const blockedDays = [new Date(2025, 7, 15), new Date(2025, 7, 16)];
            return blockedDays.some(
              (blocked) => blocked.getTime() === day.getTime()
            );
          },
        }}
        modifiersClassNames={{
          'blocked-days': 'bg-red-50',
        }}
      />
      <style>{`
        .cal-day-btn {
          width: 100%;
          height: 146px;
        }
      `}</style>
    </div>
  );
}
