import type { AvailabilityWindowInDays } from '@/types/enums/calendar/availabilityWindowInDays';
import type { Photo } from '@/types/listing/space';

export interface HostCalendar {
  availabilityWindowInDays: AvailabilityWindowInDays;
  bookedDates: BookedDate[];
  calendarDates: CalendarDate[];
}

export interface BookedDate {
  bookingStatus: BookingStatus;
  currency: string;
  endDate: string;
  guest: GuestCalendar;
  startDate: string;
  totalPrice: number;
}

export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Rejected = 'REJECTED',
  WaitingConfirmation = 'WAITING_CONFIRMATION',
  WaitingPaymentConfirmation = 'WAITING_PAYMENT_CONFIRMATION',
}

/**
 * GuestCalendar
 */
export interface GuestCalendar {
  id: number;
  profilePicture?: Photo;
  /**
   * User preferred name or first name
   */
  username: string;
}

/**
 * MediaPicture
 */

export interface CalendarDate {
  availability: boolean;
  comment: null | string;
  date: string;
  price: number | null;
  status: Status;
}

export enum Status {
  BlockedByUser = 'BLOCKED_BY_USER',
  BlockedExternal = 'BLOCKED_EXTERNAL',
  Booked = 'BOOKED',
  Note = 'NOTE',
  PreparationTime = 'PREPARATION_TIME',
  PriceChanged = 'PRICE_CHANGED',
}
