import {
  getTranslation,
  translate,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n.ts';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { enUS, es } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import type {
  CalendarSettings,
  UseCalendarReturn,
} from '@/types/listing/pricing';
import { differenceInCalendarDays, getISODay } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AppButton from '../Common/AppButton';
import { formatDate } from '@/utils/dateUtils';

interface SelectDateProps {
  calendarResult: UseCalendarReturn;
  city: string;
  lang?: SupportedLanguages;
  modal: boolean;
  calendarSettings: CalendarSettings;
}
const ListingCalendar: React.FC<SelectDateProps> = ({
  calendarResult,
  calendarSettings,
  city,
  lang = 'es',
  modal = true,
}) => {
  const t = getTranslation(lang);
  const {
    initialRange,
    month,
    setMonth,
    selected,
    preparationDates,
    handleSelect,
    handleReset,
    isAboveMaxDays,
    isBelowMinDays,
    disabledDays,
    blockedDatesArray,
  } = calendarResult;
  const defaultClassNames = getDefaultClassNames();
  const calendarLocale = useMemo(() => (lang === 'es' ? es : enUS), [lang]);
  const noCheckout = (date: Date) =>
    calendarSettings?.restrictedCheckoutDays?.includes(getISODay(date)) ||
    false;
  const noCheckIn = (date: Date) =>
    calendarSettings?.restrictedCheckInDays?.includes(getISODay(date)) || false;
  const minDays = translatePlural(
    t,
    'calendar.minDay',
    calendarSettings?.minTripLength || 1
  );
  const maxDays = translatePlural(
    t,
    'calendar.maxDay',
    calendarSettings?.maxTripLength || 1
  );
  const canUseAsCheckout = useCallback(
    (d: Date) => {
      if (!selected?.from || selected?.to) return false;
      return (
        !!calendarSettings &&
        differenceInCalendarDays(d, selected.from) >=
          (calendarSettings.minTripLength ?? 1)
      );
    },
    [selected, calendarSettings]
  );

  const visibleBlockedForUI = useMemo(() => {
    if (!selected?.from || selected?.to) return blockedDatesArray;
    return blockedDatesArray.filter((d: Date) => !canUseAsCheckout(d));
  }, [selected?.from, selected?.to, blockedDatesArray, canUseAsCheckout]);

  const modifiers = {
    start: selected?.from,
    end: selected?.to,
    'min-days': isBelowMinDays,
    'max-days': isAboveMaxDays,
    'preparation-days': preparationDates,
    'no-checkout': selected?.from ? noCheckout : undefined,
    'no-checkIn': !selected?.from && !selected?.to ? noCheckIn : undefined,
    blocked: visibleBlockedForUI,
  };
  const arrivalDayMessage = translate(t, t.calendar.arrivalDay);
  const departureDayMessage = translate(t, t.calendar.departureDay);
  const noCheckoutMessage = translate(t, t.calendar.noCheckout);
  const noCheckInMessage = translate(t, t.calendar.noCheckIn);
  const preparationTimeDatesMessage = translate(t, t.calendar.preparationDay);
  const [numberOfMonths, setNumberOfMonths] = useState<number | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 1300 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (modal && selected?.from && selected?.to) {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [selected, modal]);

  return (
    <>
      <div className="space-y-6">
        {!modal && (
          <div>
            {!initialRange ? (
              <div id="booking-section">
                <h1 className="title-listing">
                  {translate(t, t.calendar.selectArrivalDate)}
                </h1>
                <p className="description-listing">
                  {translate(t, t.calendar.addTravelDates)}
                </p>
              </div>
            ) : (
              <div>
                {initialRange.from && initialRange.to && (
                  <h1 className="title-listing">
                    {translatePlural(
                      t,
                      'listingDetail.calendar.title',
                      differenceInCalendarDays(
                        initialRange.to,
                        initialRange.from
                      ),
                      {
                        count: differenceInCalendarDays(
                          initialRange.to,
                          initialRange.from
                        ),
                        location: city,
                      }
                    )}
                  </h1>
                )}
                <p className="description-listing">
                  {initialRange.from ? formatDate(initialRange.from) : ''} -{' '}
                  {initialRange.to ? formatDate(initialRange.to) : ''}
                </p>
              </div>
            )}
          </div>
        )}
        {numberOfMonths && (
          <>
            <div className="calendar-container">
              <DayPicker
                locale={calendarLocale}
                mode="range"
                numberOfMonths={numberOfMonths}
                disabled={disabledDays}
                modifiers={modifiers}
                modifiersClassNames={{
                  start: 'range-start',
                  end: 'range-end',
                  'no-checkout': 'no-checkout',
                  'no-checkIn': 'no-checkIn',
                  'min-days': 'min-days',
                  'max-days': 'max-days',
                  'preparation-days': 'preparation-days',
                  blocked: 'blocked-day',
                }}
                selected={
                  selected?.from && !selected?.to
                    ? { from: selected.from, to: selected.from }
                    : selected
                }
                onSelect={handleSelect}
                classNames={{
                  selected: `border-none`,
                  root: `${defaultClassNames.root} px-5`,
                  chevron: `${defaultClassNames.chevron} w-5 h-5`,
                  months: 'flex flex-row gap-x-5',
                  disabled: `line-through text-gray-400`,
                  caption_label: 'text-sm font-normal',
                  weekday: 'text-sm font-normal',
                }}
                month={month}
                onMonthChange={setMonth}
              />
            </div>
            <div className="space-x-2 text-center">
              <AppButton
                label={translate(t, t.calendar.removeDates)}
                onClick={handleReset}
                aria-label="Reset Calendar"
                outline={true}
              ></AppButton>
            </div>
          </>
        )}
      </div>
      {/* TODO: Extract the inline styles in the <style> tag into a separate CSS or SCSS file to improve maintainability. */}
      <style>{`
        .calendar-container .rdp-day {
          position: relative;
          font-size: 14px;
        }
        .calendar-container .rdp-day:hover::after {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 8px;
          background-color: rgb(31 41 55); /* Tailwind bg-gray-800 */
          color: white;
          font-size: 11px;
          border-radius: 4px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 10;
          opacity: 0.95;
        }
        .calendar-container .range-start:hover::after {
          content: "${arrivalDayMessage}";
        }
        .calendar-container .range-end:hover::after {
          content: "${departureDayMessage}";
        }
        .calendar-container .no-checkout:hover::after {
          content: "${noCheckoutMessage}";
        }
        .calendar-container .no-checkIn:hover::after {
          content: "${noCheckInMessage}";
        }
        .calendar-container .min-days:hover::after {
        content: " ${minDays} ";
        }
        .calendar-container .max-days:hover::after {
          content: " ${maxDays} ";
        }
        .calendar-container .preparation-days:hover::after {
          content: " ${preparationTimeDatesMessage} ";
        }
      `}</style>
    </>
  );
};

export default ListingCalendar;
