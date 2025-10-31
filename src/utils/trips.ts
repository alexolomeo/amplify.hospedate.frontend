import {
  BookingCancellationBy,
  Status,
  StatusColor,
  type Trip,
} from '@/types/trips';
import { translate } from '@/utils/i18n';
import type { TripDetail } from '@/types/tripDetail';
import {
  CancelledBy,
  TripDetailsCases,
  TripDetailStatusColor,
  TripStatus,
} from '@/types/tripDetail';
import { formatDate, getHourWithAmPm } from './dateUtils';
import { differenceInDays, isSameDay } from 'date-fns';

const DEFAULT_CHECK_IN_HOUR = 15;
const DEFAULT_CHECK_OUT_HOUR = 11;

export interface TimelineGroup {
  month: string;
  trips: Trip[];
}

/**
 * Helper: parse YYYY-MM-DD as local date (ignores timezone shift).
 * Improved with better error handling
 */
function parseLocalDate(dateStr: string): Date {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    console.warn(`Invalid date format: ${dateStr}`);
    return new Date(); // Return current date as fallback
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  // Validate that the parsed date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateStr}`);
    return new Date(); // Return current date as fallback
  }

  return date;
}

// Memoization cache for month grouping
const monthGroupCache = new Map<string, TimelineGroup[]>();

/**
 * Groups trips by month and returns them sorted by newest first
 * Now with memoization for better performance
 */
export const groupTripsByMonth = (
  trips: Trip[],
  lang: string
): TimelineGroup[] => {
  // Create cache key based on trips data and language
  const cacheKey = `${lang}-${trips.map((t) => `${t.id}-${t.endDate}`).join('|')}`;

  // Check cache first
  if (monthGroupCache.has(cacheKey)) {
    return monthGroupCache.get(cacheKey)!;
  }

  const monthMap = new Map<string, Trip[]>();

  trips.forEach((trip) => {
    const date = parseLocalDate(trip.endDate);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, []);
    }
    monthMap.get(monthKey)!.push(trip);
  });

  // Convert to array and sort by month (newest first)
  const result = Array.from(monthMap.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, trips]) => ({
      month: formatDate(parseLocalDate(trips[0].endDate), lang),
      trips: trips.sort(
        (a, b) =>
          parseLocalDate(b.endDate).getTime() -
          parseLocalDate(a.endDate).getTime()
      ),
    }));

  // Cache the result (limit cache size to prevent memory leaks)
  if (monthGroupCache.size > 50) {
    const firstKey = monthGroupCache.keys().next().value;
    if (firstKey) {
      monthGroupCache.delete(firstKey);
    }
  }
  monthGroupCache.set(cacheKey, result);

  return result;
};

function getCheckInDate(trip: Trip): Date {
  const checkInDate = parseLocalDate(trip.startDate);
  checkInDate.setHours(DEFAULT_CHECK_IN_HOUR, 0, 0, 0);
  return checkInDate;
}

function getCheckOutDate(trip: Trip): Date {
  const checkOutDate = parseLocalDate(trip.endDate);
  checkOutDate.setHours(DEFAULT_CHECK_OUT_HOUR, 0, 0, 0);
  return checkOutDate;
}

function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isCurrentlyCheckedIn(
  now: Date,
  checkInDate: Date,
  checkOutDate: Date
): boolean {
  return now >= checkInDate && now < checkOutDate;
}

function isCheckingInToday(now: Date, checkInDate: Date): boolean {
  return (
    now.getFullYear() === checkInDate.getFullYear() &&
    now.getMonth() === checkInDate.getMonth() &&
    now.getDate() === checkInDate.getDate() &&
    now < checkInDate
  );
}

export const getTripStatus = (t: ReturnType<typeof translate>, trip: Trip) => {
  const isWaitingPayment = trip.status === Status.WaitingPaymentConfirmation;
  const isWaitingConfirmation = trip.status === Status.WaitingConfirmation;

  if (isWaitingPayment) {
    return {
      text: translate(t, 'tripDetail.status.pendingPayment'),
      color: StatusColor.DAYS,
    };
  }

  if (isWaitingConfirmation) {
    return {
      text: translate(t, 'tripDetail.status.pendingApproval'),
      color: StatusColor.PENDING,
    };
  }

  if (trip.status === Status.Rejected) {
    if (trip.bookingCancellationBy === BookingCancellationBy.CancelledByGuest) {
      return {
        text: translate(t, 'trips.status.rejectedByGuest'),
        color: StatusColor.CANCELLED,
      };
    }
    if (trip.bookingCancellationBy === BookingCancellationBy.CancelledByHost) {
      return {
        text: translate(t, 'trips.status.rejectedByHost'),
        color: StatusColor.CANCELLED,
      };
    }
  }

  const now = new Date();
  const checkInDate = getCheckInDate(trip);
  const checkOutDate = getCheckOutDate(trip);
  const today = getToday();
  const diffDays = differenceInDays(checkInDate, today);

  if (isCurrentlyCheckedIn(now, checkInDate, checkOutDate)) {
    return {
      text: translate(t, 'trips.status.checkedInNow'),
      color: StatusColor.TODAY,
    };
  }

  if (isCheckingInToday(now, checkInDate)) {
    return {
      text: translate(t, 'trips.status.checkingInToday'),
      color: StatusColor.TODAY,
    };
  }

  if (diffDays > 0) {
    return {
      text: translate(t, 'trips.status.checkingInDays', { days: diffDays }),
      color: StatusColor.DAYS,
    };
  }

  return {
    text: undefined,
    color: undefined,
  };
};

export const getTripDetailStatus = (
  t: ReturnType<typeof translate>,
  trip: TripDetail,
  isHost?: boolean
) => {
  const now = new Date();
  const today = getToday();
  const checkInDate = parseLocalDate(trip.booking.checkInDate);
  checkInDate.setHours(DEFAULT_CHECK_IN_HOUR, 0, 0, 0);

  const checkOutDate = parseLocalDate(trip.booking.checkoutDate);
  checkOutDate.setHours(DEFAULT_CHECK_OUT_HOUR, 0, 0, 0);

  const role = isHost ? 'host.' : '';
  const diffDays = differenceInDays(checkInDate, today);
  const isWaitingPayment =
    trip.status === TripStatus.WaitingPaymentConfirmation;
  const isWaitingConfirmation = trip.status === TripStatus.WaitingConfirmation;

  if (isWaitingPayment) {
    return {
      text: translate(t, `tripDetail.status.${role}pendingPayment`),
      color: TripDetailStatusColor.DAYS,
      case: TripDetailsCases.PENDING_PAYMENT,
    };
  }

  if (isWaitingConfirmation) {
    return {
      text: translate(t, `tripDetail.status.${role}pendingApproval`),
      color: TripDetailStatusColor.PENDING,
      case: TripDetailsCases.PENDING_APPROVAL,
    };
  }

  if (trip.status === TripStatus.Confirmed) {
    if (isCurrentlyCheckedIn(now, checkInDate, checkOutDate)) {
      if (isSameDay(today, checkOutDate)) {
        return {
          text: translate(t, 'tripDetail.status.checkingOutToday', {
            time: trip.houseRules.checkoutTime,
          }),
          color: TripDetailStatusColor.TODAY,
          case: TripDetailsCases.CHECKING_OUT_TODAY,
        };
      }
      return {
        text: translate(t, 'tripDetail.status.checkedInNow'),
        color: TripDetailStatusColor.TODAY,
        case: TripDetailsCases.CHECKED_IN_NOW,
      };
    }

    if (isCheckingInToday(now, checkInDate)) {
      return {
        text: translate(t, 'tripDetail.status.checkingInToday', {
          time: trip.houseRules.checkInStartTime,
        }),
        color: TripDetailStatusColor.TODAY,
        case: TripDetailsCases.CHECKING_IN_TODAY,
      };
    }

    if (diffDays > 0) {
      return {
        text: translate(t, `tripDetail.status.${role}checkingInDays`, {
          days: diffDays,
        }),
        color: TripDetailStatusColor.DAYS,
        case: TripDetailsCases.CHECKING_IN_DAYS,
      };
    }

    if (today > checkOutDate && trip.pendingReview) {
      return {
        text: translate(t, `tripDetail.status.${role}leaveReview`),
        color: TripDetailStatusColor.REVIEW,
        case: TripDetailsCases.LEAVE_REVIEW,
      };
    }
  }

  if (trip.status === TripStatus.Cancelled) {
    if (!isHost) {
      return {
        text: translate(t, 'tripDetail.status.cancelled'),
        color: TripDetailStatusColor.CANCELLED,
        case: TripDetailsCases.CANCELLED,
      };
    }
    const time = getHourWithAmPm(trip.cancellation!.cancellationDate);
    const cancelledUser =
      trip.cancellation?.cancelledBy === CancelledBy.CancelledByHost
        ? 'tripDetail.status.host.cancelledByHost'
        : 'tripDetail.status.host.cancelledByGuest';
    return {
      text: translate(t, cancelledUser, { time }),
      color: TripDetailStatusColor.CANCELLED,
      case: TripDetailsCases.CANCELLED,
    };
  }

  if (trip.status === TripStatus.Rejected) {
    return {
      text: translate(t, 'tripDetail.status.rejected'),
      color: TripDetailStatusColor.CANCELLED,
      case: TripDetailsCases.REJECTED,
    };
  }

  return {
    text: undefined,
    color: undefined,
    case: undefined,
  };
};
