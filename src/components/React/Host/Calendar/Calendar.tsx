import { type SupportedLanguages } from '@/utils/i18n';
import type { SelectedDayInfo } from './CalendarContainer';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { useEffect, useMemo, useState } from 'react';
import { CustomDay } from './CustomDay';
import {
  Status,
  type CalendarDate,
  type HostCalendar,
} from '@/types/host/calendar/hostCalendar';
import { type CalendarPreferenceSettingValues } from '@/types/host/calendar/preferenceSetting';
import { enUS, es } from 'react-day-picker/locale';
import { addDays, endOfDay, isAfter, setHours } from 'date-fns';

interface Props {
  lang: SupportedLanguages;
  onDaySelect: (dayInfo: SelectedDayInfo | null) => void;
  preSelectedDayInfo: SelectedDayInfo | null;
  calendarData: HostCalendar | null;
  values: CalendarPreferenceSettingValues;
}

export default function Calendar({
  onDaySelect,
  preSelectedDayInfo,
  calendarData,
  values,
  lang,
}: Props) {
  const defaultClassNames = getDefaultClassNames();
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const today = useMemo(() => new Date(), []);
  const availabilityWindowEnd = useMemo(() => {
    const windowInDays = calendarData?.availabilityWindowInDays || 365;
    return addDays(today, windowInDays);
  }, [calendarData?.availabilityWindowInDays, today]);

  const calendarLocale = useMemo(() => (lang === 'es' ? es : enUS), [lang]);
  const calendarDatesMap = useMemo(() => {
    if (!calendarData?.calendarDates) return new Map<string, CalendarDate>();
    return new Map(
      calendarData.calendarDates.map((dateObj) => [dateObj.date, dateObj])
    );
  }, [calendarData]);

  const { notice } = values.availabilitySection;
  const shouldDisableToday = useMemo(() => {
    if (!notice) {
      return false;
    }
    if (!notice.advanceNoticeHours) {
      return false;
    }
    if (notice.allowRequestSameDay) {
      return false;
    }
    const now = new Date();
    const cutoffTime = setHours(
      endOfDay(today),
      notice.sameDayAdvanceNoticeTime
    );
    return isAfter(now, cutoffTime);
  }, [notice, today]);

  const daysToDisable = useMemo(() => {
    if (!calendarData?.calendarDates) return [];
    return calendarData.calendarDates
      .filter(
        (dateObj) =>
          dateObj.status === Status.PreparationTime ||
          dateObj.status === Status.Booked ||
          dateObj.status === Status.BlockedExternal
      )
      .map((dateObj) => new Date(`${dateObj.date}T00:00:00`));
  }, [calendarData]);

  const disabledDates = useMemo(() => {
    const disableTodayCondition = shouldDisableToday
      ? [{ before: addDays(today, 1) }]
      : [{ before: today }];

    return [
      ...disableTodayCondition,
      ...daysToDisable,
      { after: availabilityWindowEnd },
    ];
  }, [today, daysToDisable, availabilityWindowEnd, shouldDisableToday]);

  useEffect(() => {
    setSelectedDates(preSelectedDayInfo?.dates);
  }, [preSelectedDayInfo]);

  const handleDayPickerSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates);
    if (dates && dates.length > 0) {
      onDaySelect({ dates });
    } else {
      onDaySelect(null);
    }
  };

  if (!calendarData) {
    return <div></div>;
  }
  return (
    <div>
      <DayPicker
        locale={calendarLocale}
        mode="multiple"
        selected={selectedDates}
        onSelect={handleDayPickerSelect}
        disabled={disabledDates}
        components={{
          DayButton: ({ day: { date }, modifiers, ...props }) => (
            <CustomDay
              date={date}
              {...props}
              calendarDatesMap={calendarDatesMap}
              priceValues={values.priceSection}
              bookedDates={calendarData.bookedDates}
              lang={lang}
              modifiers={modifiers}
            />
          ),
        }}
        classNames={{
          root: `${defaultClassNames.root} p-1 md:p-2`, // Add a shadow to the root element
          caption_label: `${defaultClassNames.root} text-2xl font-medium capitalize`,
          day: `w-100`,
          day_button: `w-full h-[120px] md:h-[146px]`,
          selected: ``,
          today: 'bg-[var(--color-base-150)]',
          disabled: '',
          chevron: `rounded-full fill-white bg-primary p-1`,
          weekday: 'py-5 text-sm text-start font-medium',
        }}
        modifiers={{
          'before-today': { before: today },
          'day-to-disabled': daysToDisable,
          'availability-window-end': { after: availabilityWindowEnd },
        }}
        modifiersClassNames={{
          'before-today': 'opacity-50',
          'availability-window-end': 'opacity-60',
          'day-to-disabled': '',
        }}
      />
    </div>
  );
}
