import { renderHook } from '@testing-library/react';
import { act } from 'react';
import {
  addDays,
  formatISO,
  getISODay,
  isBefore,
  isSameDay,
  parseISO,
} from 'date-fns';
import { useCalendar } from '@/components/React/Hooks/useCalendar';
import type {
  BlockedCalendarDays,
  CalendarSettings,
} from '@/types/listing/pricing';
import { CheckInStartTime } from '@/types/enums/houseRules/checkInStartTime';
import { CheckInEndTime } from '@/types/enums/houseRules/checkInEndTime';
import { CheckoutTime } from '@/types/enums/houseRules/checkoutTime';
import type { HouseRules } from '@/types/listing/listing';

const futureDate = (daysOffset: number) => {
  return addDays(new Date(), daysOffset);
};
const futureUnavailableDateBooking = formatISO(futureDate(20));
const preparationDateBookingBefore = formatISO(futureDate(19));
const preparationDateBookingAfter = formatISO(futureDate(21));
const futureUnavailableDateBlocked = formatISO(futureDate(30));
const mockhouseRules: HouseRules = {
  checkInStartTime: CheckInStartTime.TIME_10_AM,
  checkInEndTime: CheckInEndTime.TIME_10_AM,
  checkoutTime: CheckoutTime.TIME_10_AM,
  guestNumber: 15,
  petsAllowed: false,
  pets: 0,
  eventsAllowed: true,
  smokingAllowed: false,
  quietHoursStartTime: '20:13',
  quietHoursEndTime: '20:39',
  commercialPhotographyAllowed: true,
  additionalRules: 'Au   sustineo video amissi.',
};
const mockCalendarSettings: CalendarSettings = {
  availabilityWindowInDays: 730,
  minTripLength: 2,
  maxTripLength: 10,
  restrictedCheckoutDays: [],
  restrictedCheckInDays: [],
  advanceNoticeHours: 15,
  sameDayAdvanceNoticeTime: 18,
  allowRequestUnderAdvanceNoticeHours: false,
  preparationTimeInDays: 1,
};
const mockBlockedCalendarDays: BlockedCalendarDays = {
  blockedDates: [futureUnavailableDateBlocked],
  bookedDates: [futureUnavailableDateBooking],
  preparationTimeDates: [
    preparationDateBookingAfter,
    preparationDateBookingBefore,
  ],
};
const getNextWeekday = (weekday: number) => {
  const date = futureDate(2);
  const daysAhead = (7 + weekday - getISODay(date)) % 7 || 7;
  return addDays(date, daysAhead);
};
const getNextWeekdayAfter = (startDate: Date, weekday: number) => {
  const daysAhead = (7 + weekday - getISODay(startDate)) % 7 || 7;
  return addDays(startDate, daysAhead);
};

describe('UseCalendar - test', () => {
  it('should block ranges shorter than minTripLength', () => {
    const calendarWithMinNights = { ...mockCalendarSettings, minTripLength: 2 };
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: calendarWithMinNights,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: jest.fn(),
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    act(() => {
      result.current.handleSelect({
        from: futureDate(2),
        to: undefined,
      });
    });
    expect(result.current.isBelowMinDays(futureDate(3))).toBe(true); // 1 night
    expect(result.current.isBelowMinDays(futureDate(4))).toBe(false); // 2 nights
  });

  it('should reject check-in on restrictedCheckInDays', async () => {
    const mockOnUpdate = jest.fn();
    const nextMonday = getNextWeekday(1); // 1 = Monday
    const nextThursday = addDays(nextMonday, 3); // For the range to be valid
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: {
          ...mockCalendarSettings,
          restrictedCheckInDays: [1],
        },
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );

    await act(() => {
      result.current.handleSelect({
        from: nextMonday,
        to: nextThursday,
      });
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should reject check-out on restrictedCheckoutDays', async () => {
    const mockOnUpdate = jest.fn();
    const from = getNextWeekday(2); // Next Tuesday (2)
    const to = getNextWeekdayAfter(from, 5); // Next Friday *after* that Tuesday
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: {
          ...mockCalendarSettings,
          restrictedCheckoutDays: [5],
        }, // Friday
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    await act(() => {
      result.current.handleSelect({ from, to });
    });
    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should call onUpdate when selection is valid', () => {
    const mockOnUpdate = jest.fn();
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: mockCalendarSettings,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    const from = futureDate(2);
    const to = futureDate(6);

    act(() => {
      result.current.handleSelect({ from, to });
    });
    expect(mockOnUpdate).toHaveBeenCalledWith(from, to);
  });

  it('should select only the start date if from and to are the same', () => {
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: mockCalendarSettings,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: jest.fn(),
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    const sameDate = futureDate(3);
    act(() => {
      result.current.handleSelect({ from: sameDate, to: sameDate });
    });
    expect(result.current.selected).toEqual({ from: sameDate, to: undefined });
  });

  it('should block selection if a date in the range is unavailable', () => {
    const mockOnUpdate = jest.fn();
    const from = futureDate(15);
    const to = futureDate(24); // 20, 19 , 21 is unavailable

    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: mockCalendarSettings,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );

    act(() => {
      result.current.handleSelect({ from, to });
    });
    // You should select up to "to" as new from (fallback) but not execute onUpdate with full range
    expect(mockOnUpdate).toHaveBeenCalledWith(to, null);
  });

  it('should disable dates before today', () => {
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: mockCalendarSettings,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: jest.fn(),
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    const yesterday = addDays(new Date(), -1);
    const isDisabled = result.current.disabledDays.some((rule) => {
      if (typeof rule === 'function') {
        return rule(yesterday);
      }

      if (
        rule &&
        typeof rule === 'object' &&
        'before' in rule &&
        rule.before instanceof Date
      ) {
        return isBefore(yesterday, rule.before);
      }

      return false;
    });
    expect(isDisabled).toBe(true);
  });

  it('should block selection if trip exceeds maxTripLength', () => {
    const mockOnUpdate = jest.fn();
    const calendarWithMax = { ...mockCalendarSettings, maxTripLength: 3 };

    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: calendarWithMax,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );

    const from = futureDate(2);
    const to = futureDate(6); // 4 nights

    act(() => {
      result.current.handleSelect({ from, to });
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should allow selection if trip equals maxTripLength', () => {
    const mockOnUpdate = jest.fn();
    const calendarWithMax = { ...mockCalendarSettings, maxTripLength: 3 };

    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: calendarWithMax,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );

    const from = futureDate(2);
    const to = futureDate(5); // 3 nights

    act(() => {
      result.current.handleSelect({ from, to });
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(from, to);
  });

  it('should block selection if trip is shorter than minTripLength', () => {
    const mockOnUpdate = jest.fn();
    const calendarWithMin = { ...mockCalendarSettings, minTripLength: 3 };

    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: calendarWithMin,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );

    const from = futureDate(2);
    const to = futureDate(4); // 2 nights
    act(() => {
      result.current.handleSelect({ from, to });
    });

    expect(mockOnUpdate).not.toHaveBeenCalled();
  });

  it('should allow selection if trip equals minTripLength', () => {
    const mockOnUpdate = jest.fn();
    const calendarWithMin = { ...mockCalendarSettings, minTripLength: 3 };

    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: calendarWithMin,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: mockOnUpdate,
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    const from = futureDate(2);
    const to = futureDate(5);
    act(() => {
      result.current.handleSelect({ from, to });
    });

    expect(mockOnUpdate).toHaveBeenCalledWith(from, to);
  });

  it('should block preparation time dates', () => {
    const { result } = renderHook(() =>
      useCalendar({
        checkIn: null,
        checkout: null,
        calendarSettings: mockCalendarSettings,
        blockedCalendarDays: mockBlockedCalendarDays,
        onUpdate: jest.fn(),
        isLoading: true,
        houseRules: mockhouseRules,
      })
    );
    const preparationDate = parseISO(preparationDateBookingBefore);
    const isDisabled = result.current.disabledDays.some((rule) => {
      if (typeof rule === 'function') {
        return rule(preparationDate);
      }
      if (
        rule &&
        typeof rule === 'object' &&
        'dates' in rule &&
        Array.isArray(rule.dates)
      ) {
        return rule.dates.some((blockedDate: Date) =>
          isSameDay(blockedDate, preparationDate)
        );
      }
      if (rule instanceof Date) {
        return isSameDay(rule, preparationDate);
      }
      return false;
    });
    expect(isDisabled).toBe(true);
  });
});
