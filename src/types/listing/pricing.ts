import type { DateRange } from 'react-day-picker';
import type { AvailabilityWindowInDays } from '../enums/calendar/availabilityWindowInDays';
import type { AdvanceNoticeHours } from '../enums/calendar/advanceNoticeHours';
import type { PreparationTimeInDays } from '../enums/calendar/preparationTimeInDays';
import type { HouseRules } from './listing';
export interface Pricing {
  subtotalBeforeServiceFee: number;
  subtotal: number;
  currency: string;
  serviceFee: number;
  weeklyDiscountAmount: number;
  monthlyDiscountAmount: number;
  total: number;
}

export interface CalendarSettings {
  availabilityWindowInDays: AvailabilityWindowInDays;
  minTripLength: number;
  maxTripLength: number;
  restrictedCheckInDays: number[];
  restrictedCheckoutDays: number[];
  advanceNoticeHours?: AdvanceNoticeHours | null;
  //Todo: no use for now, but needed for the future
  sameDayAdvanceNoticeTime: number;
  allowRequestUnderAdvanceNoticeHours: boolean;
  preparationTimeInDays: PreparationTimeInDays;
}
export interface BlockedCalendarDays {
  blockedDates: string[];
  bookedDates: string[];
  preparationTimeDates: string[];
}

export interface UseCalendarParams {
  checkIn: Date | null;
  checkout: Date | null;
  onUpdate: (checkIn: Date | null, checkout: Date | null) => void;
  isLoading: boolean;
  calendarSettings: CalendarSettings;
  blockedCalendarDays: BlockedCalendarDays | null;
  houseRules: HouseRules;
}

export interface UseCalendarReturn {
  today: Date;
  initialRange: DateRange | undefined;
  month: Date;
  setMonth: React.Dispatch<React.SetStateAction<Date>>;
  selected: DateRange | undefined;
  preparationDates: Date[];
  blockedDatesArray: Date[];
  isAboveMaxDays: (date: Date) => boolean;
  isBelowMinDays: (date: Date) => boolean;
  handleSelect: (range: DateRange | undefined) => void;
  handleReset: () => void;
  disabledDays: (
    | Date
    | { before: Date }
    | { after: Date }
    | ((date: Date) => boolean)
  )[];
}
