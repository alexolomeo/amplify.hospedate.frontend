import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addHours,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfDay,
  getISODay,
  isBefore,
  isSameDay,
  parseISO,
  setHours,
  startOfDay,
} from 'date-fns';
import type {
  BlockedCalendarDays,
  UseCalendarParams,
  UseCalendarReturn,
} from '@/types/listing/pricing';
import type { DateRange } from 'react-day-picker';
import { CheckInStartTime } from '@/types/enums/houseRules/checkInStartTime';
import { CheckInEndTime } from '@/types/enums/houseRules/checkInEndTime';
export function useCalendar({
  checkIn,
  checkout,
  onUpdate,
  calendarSettings,
  blockedCalendarDays,
  houseRules,
}: UseCalendarParams): UseCalendarReturn {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState(today);
  const invalidDatesSet = useMemo(
    () => buildInvalidDatesSet(blockedCalendarDays),
    [blockedCalendarDays]
  );
  const createDateRange = useCallback(
    (
      checkIn: Date | undefined | null,
      checkout: Date | undefined | null
    ): DateRange | undefined => {
      if (checkIn && checkout) return { from: checkIn, to: checkout };
      if (checkIn) return { from: checkIn, to: undefined };
      return undefined;
    },
    []
  );
  const initialRange = createDateRange(checkIn, checkout);
  const [selected, setSelected] = useState<DateRange | undefined>(initialRange);

  const blockedDatesArray = useMemo(() => {
    return Array.from(invalidDatesSet).map((timestamp) => new Date(timestamp));
  }, [invalidDatesSet]);

  const preparationDates = useMemo(() => {
    return (blockedCalendarDays?.preparationTimeDates ?? []).map((dateStr) =>
      parseISO(dateStr)
    );
  }, [blockedCalendarDays]);

  useEffect(() => {
    const newRange = createDateRange(checkIn, checkout);
    if (newRange?.from && newRange?.to && selected?.from && selected?.to) {
      const isSameRange =
        isSameDay(selected.from, newRange.from) &&
        isSameDay(selected.to, newRange.to);
      if (!isSameRange) {
        setSelected(newRange);
      }
    }
  }, [checkIn, checkout, createDateRange, selected]);

  const isBelowMinDays = useCallback(
    (date: Date): boolean => {
      if (!selected?.from) {
        return false;
      }
      const fromDate = startOfDay(selected.from);
      const currentDate = startOfDay(date);
      const min = calendarSettings?.minTripLength ?? 1;
      if (isBefore(currentDate, fromDate)) return false;
      if (isSameDay(currentDate, fromDate)) return false;
      const diffNights = differenceInCalendarDays(currentDate, fromDate);
      return diffNights < min;
    },
    [selected?.from, calendarSettings?.minTripLength]
  );

  const isAboveMaxDays = useCallback(
    (date: Date): boolean => {
      if (!selected?.from) return false;
      const fromDate = startOfDay(selected.from);
      const currentDate = startOfDay(date);
      const max = calendarSettings?.maxTripLength ?? Infinity;
      if (isBefore(currentDate, fromDate)) return false;
      const diffNights = differenceInCalendarDays(currentDate, fromDate);
      return diffNights > max;
    },
    [selected?.from, calendarSettings?.maxTripLength]
  );

  const getBlockedByUnavailableDates = useCallback(() => {
    if (!selected) return undefined;
    const { from, to } = selected;
    if (!from && !to) return undefined;
    const unavailable = [...invalidDatesSet].sort((a, b) => a - b);
    if (from && !to) {
      const nextUnavailable = unavailable.find((item) => item > from.getTime());
      return nextUnavailable
        ? (date: Date) => date.getTime() > nextUnavailable
        : undefined;
    }
    if (to && !from) {
      const previousUnavailable = unavailable
        .slice()
        .reverse()
        .find((item) => item < to.getTime());
      return previousUnavailable
        ? (date: Date) => date.getTime() < previousUnavailable
        : undefined;
    }
    return undefined;
  }, [selected, invalidDatesSet]);

  const getDisabledByAdvanceNotice = useCallback(() => {
    const advanceNoticeHours = calendarSettings.advanceNoticeHours;
    const checkInStartTime = houseRules.checkInStartTime;
    const checkInEndTime = houseRules.checkInEndTime;

    if (!advanceNoticeHours) {
      return () => false;
    }

    return (date: Date) => {
      const now = new Date();
      const startOfToday = startOfDay(now);

      if (isBefore(date, startOfToday)) {
        return false;
      }
      const cutoffMoment = addHours(now, advanceNoticeHours);
      let checkInMomentForDate: Date;
      // Case A: Flexible check-in (we use the end of the day as a reference)
      if (checkInStartTime === CheckInStartTime.TIME_FLEXIBLE) {
        if (checkInEndTime === CheckInEndTime.TIME_FLEXIBLE) {
          //We use the end of the day (midnight) as the latest check-in reference"
          checkInMomentForDate = endOfDay(date);
        } else {
          checkInMomentForDate = setHours(startOfDay(date), checkInEndTime!);
        }
      } else {
        // Case B: Check-in with a fixed start time
        checkInMomentForDate = setHours(startOfDay(date), checkInStartTime!);
      }
      return isBefore(checkInMomentForDate, cutoffMoment);
    };
  }, [calendarSettings, houseRules]);

  const isValidRange = useCallback(
    (range: DateRange): boolean => {
      if (!range.from || !range.to) return false;
      if (
        isRestrictedCheckOut(range.to, calendarSettings?.restrictedCheckoutDays)
      )
        return false;
      if (
        isTripLengthInvalid(
          range.from,
          range.to,
          calendarSettings?.minTripLength ?? 1,
          calendarSettings?.maxTripLength ?? Infinity
        )
      )
        return false;
      return true;
    },
    [
      calendarSettings?.restrictedCheckoutDays,
      calendarSettings?.minTripLength,
      calendarSettings?.maxTripLength,
    ]
  );

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setSelected(range);
        onUpdate(null, null);
        return;
      }
      if (!range.to) {
        setSelected(range);
        onUpdate(range.from, null);
        return;
      }
      const sortedRange =
        range.from < range.to
          ? { from: range.from, to: range.to }
          : { from: range.to, to: range.from };
      if (
        isRestrictedCheckIn(
          sortedRange.from,
          calendarSettings?.restrictedCheckInDays
        )
      ) {
        return;
      }
      if (isSameDay(sortedRange.from, sortedRange.to)) {
        setSelected({ from: sortedRange.from, to: undefined });
        return;
      }
      if (!isValidRange(sortedRange)) {
        return;
      }
      if (
        !isDateRangeAvailable(invalidDatesSet, sortedRange.from, sortedRange.to)
      ) {
        if (
          isRestrictedCheckIn(
            sortedRange.to,
            calendarSettings?.restrictedCheckInDays
          )
        ) {
          return;
        }
        setSelected({ from: range.to, to: undefined });
        onUpdate(range.to, null);
        return;
      }
      setSelected(sortedRange);
      onUpdate(sortedRange.from, sortedRange.to);
    },
    [
      calendarSettings?.restrictedCheckInDays,
      isValidRange,
      invalidDatesSet,
      onUpdate,
    ]
  );

  const handleReset = useCallback(() => {
    setSelected(undefined);
    onUpdate(null, null);
  }, [onUpdate]);

  const isBlockedDay = useCallback(
    (date: Date) => {
      return invalidDatesSet.has(startOfDay(date).getTime());
    },
    [invalidDatesSet]
  );
  const getDisabledAdvanceNotice = useMemo(() => {
    if (!calendarSettings.advanceNoticeHours) {
      return () => false;
    }
    if (!calendarSettings.allowRequestUnderAdvanceNoticeHours) {
      return getDisabledByAdvanceNotice();
    }
    return () => false;
  }, [
    calendarSettings.advanceNoticeHours,
    calendarSettings.allowRequestUnderAdvanceNoticeHours,
    getDisabledByAdvanceNotice,
  ]);

  const disabledDays = useMemo(() => {
    return [
      { before: startOfDay(today) },
      {
        after: addDays(
          startOfDay(today),
          calendarSettings?.availabilityWindowInDays ?? 365
        ),
      },
      (date: Date) => {
        const d = startOfDay(date);

        if (!selected?.from) {
          return isBlockedDay(d);
        }

        if (selected.from && !selected.to) {
          const canCheckoutHere =
            isValidRange({ from: selected.from, to: d }) &&
            isDateRangeAvailable(invalidDatesSet, selected.from, d);

          if (canCheckoutHere) return false;
          return isBlockedDay(d);
        }

        return isBlockedDay(d);
      },

      getDisabledAdvanceNotice,

      (date: Date) => {
        const currentDate = startOfDay(date);
        const fromDate = selected?.from ? startOfDay(selected.from) : null;
        if (fromDate && isBefore(currentDate, fromDate)) return true;
        return isAboveMaxDays(date);
      },

      ...(getBlockedByUnavailableDates()
        ? [getBlockedByUnavailableDates()!]
        : []),
    ];
  }, [
    today,
    calendarSettings,
    selected,
    isValidRange,
    invalidDatesSet,
    isAboveMaxDays,
    getBlockedByUnavailableDates,
    isBlockedDay,
    getDisabledAdvanceNotice,
  ]);

  return {
    today,
    initialRange,
    month,
    setMonth,
    selected,
    preparationDates,
    isAboveMaxDays,
    isBelowMinDays,
    handleSelect,
    handleReset,
    disabledDays: disabledDays,
    blockedDatesArray,
  };
}

function isRestrictedCheckIn(
  date: Date,
  restrictedDays: number[] = []
): boolean {
  return restrictedDays.includes(getISODay(date));
}

function isRestrictedCheckOut(
  date: Date,
  restrictedDays: number[] = []
): boolean {
  return restrictedDays.includes(getISODay(date));
}

function isTripLengthInvalid(
  from: Date,
  to: Date,
  min: number,
  max: number
): boolean {
  const nights = differenceInCalendarDays(to, from);
  return nights < min || nights > max;
}

function buildInvalidDatesSet(
  calendar?: BlockedCalendarDays | null
): Set<number> {
  if (!calendar) {
    return new Set();
  }
  const { blockedDates, bookedDates, preparationTimeDates } = calendar;
  return new Set([
    ...blockedDates.map((d) => startOfDay(parseISO(d)).getTime()),
    ...bookedDates.map((d) => startOfDay(parseISO(d)).getTime()),
    ...preparationTimeDates.map((d) => startOfDay(parseISO(d)).getTime()),
  ]);
}

function isDateRangeAvailable(
  invalidDatesSet: Set<number>,
  checkIn: Date,
  checkOut: Date
): boolean {
  if (invalidDatesSet.size === 0) return true;
  const start = startOfDay(checkIn);
  const lastNight = startOfDay(addDays(checkOut, -1));
  if (isBefore(lastNight, start)) return true;
  const selectedDates = eachDayOfInterval({ start, end: lastNight });
  return !selectedDates.some((d) =>
    invalidDatesSet.has(startOfDay(d).getTime())
  );
}
