export interface Discounts {
  monthly: number | null;
  weekly: number | null;
}
export interface TripDuration {
  max: number;
  min: number;
}

//Update
export interface AvailabilitySection {
  notice: Notice;
  tripDuration: TripDuration;
}

export interface Notice {
  advanceNoticeHours: EnumAdvanceNoticeHours;
  allowRequestSameDay: boolean;
  sameDayAdvanceNoticeTime: number;
}

export interface PriceSection {
  discounts: Discounts;
  perNight: number;
  perWeekend: number | null;
}

export interface UpdateCalendarPreferenceSetting {
  availabilitySection?: AvailabilitySection;
  priceSection?: PriceSection;
}

export enum EnumAdvanceNoticeHours {
  SAME_DAY = 15,
  AT_LEAST_ONE_DAY = 24,
  AT_LEAST_TWO_DAYS = 48,
  AT_LEAST_THREE_DAYS = 72,
  AT_LEAST_SEVEN_DAYS = 168,
}
// Catalogo
export interface CalendarPreferenceSettingCatalog {
  availabilitySection: {
    advanceNoticeHours: AdvanceNoticeHourCatalog[];
    sameDayAdvanceNoticeTime: SameDayAdvanceNoticeTimeCatalog[];
  };
}

export interface AdvanceNoticeHourCatalog {
  id: EnumAdvanceNoticeHours;
  name: string;
}

export interface SameDayAdvanceNoticeTimeCatalog {
  id: number;
  name: string;
}

//values
export interface CalendarPreferenceSettingValues {
  availabilitySection: AvailabilitySectionValues;
  priceSection: PriceSectionValues;
  syncCalendarSection: SyncCalendarSection;
}

export interface AvailabilitySectionValues {
  notice?: NoticeValues;
  tripDuration: TripDuration;
}

export interface NoticeValues {
  advanceNoticeHours?: EnumAdvanceNoticeHours | null;
  allowRequestSameDay: boolean;
  sameDayAdvanceNoticeTime: number;
}

export interface PriceSectionValues {
  currency: string;
  discounts?: Discounts;
  perNight: number;
  perWeekend?: number;
}

export interface SyncCalendarSection {
  calendarLink: string;
  syncCalendars: SyncCalendar[];
}

export interface SyncCalendar {
  id: number;
  name: string;
  url: string;
  updatedAt: string;
}

//Errors
export interface PriceValidationErrors {
  perNight?: string;
  perWeekend?: string;
  discounts?: string;
}
