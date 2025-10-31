import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n.ts';
import React, { useCallback, useEffect, useState } from 'react';
import {
  DayPicker,
  getDefaultClassNames,
  type DateRange,
} from 'react-day-picker';
import { enUS, es } from 'react-day-picker/locale';
import 'react-day-picker/style.css';
import { isSameDay } from 'date-fns';

interface SelectDateProps {
  monthStyle: string;
  check_in_date: Date | null;
  check_out_date: Date | null;
  lang?: SupportedLanguages;
  onUpdate: (checkIn: Date | null, checkout: Date | null) => void;
  numberMonths: number;
  ismobile?: boolean;
}
const TabCalendar: React.FC<SelectDateProps> = ({
  monthStyle,
  lang = 'es',
  onUpdate,
  check_in_date,
  check_out_date,
  numberMonths,
  ismobile = false,
}) => {
  const t = getTranslation(lang);
  const [selected, setSelected] = React.useState<DateRange>();
  const defaultClassNames = getDefaultClassNames();
  const today = new Date();
  const [month, setMonth] = useState(today);

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      if (!range?.from) {
        setSelected({ from: undefined, to: undefined });
        onUpdate(null, null);
        return;
      }
      if (!range.to) {
        setSelected({ from: range.from, to: undefined });
        onUpdate(range.from, null);
        return;
      }
      if (isSameDay(range.from, range?.to)) {
        setSelected({ from: range.from, to: undefined });
        onUpdate(range.from, null);
        return;
      }
      setSelected(range);
      onUpdate(range.from, range.to);
    },
    [onUpdate]
  );

  const handleResetClick = useCallback(() => {
    setSelected(undefined);
    onUpdate(null, null);
  }, [onUpdate]);

  const getCalendarLocale = () => {
    return lang === 'es' ? es : enUS;
  };
  useEffect(() => {
    setSelected({
      from: check_in_date ?? undefined,
      to: check_out_date ?? undefined,
    });
  }, [check_in_date, check_out_date]);
  return (
    <div className="tab-content pt-8">
      <DayPicker
        locale={getCalendarLocale()}
        animate
        mode="range"
        numberOfMonths={numberMonths}
        disabled={{ before: new Date() }}
        onSelect={handleSelect}
        selected={
          selected?.from && !selected?.to
            ? { from: selected.from, to: selected.from }
            : selected
        }
        classNames={{
          // selected: `text-sm  bg-primary`,
          root: `${defaultClassNames.root} ${ismobile ? '' : 'px-5'}`,
          chevron: `${defaultClassNames.chevron}  w-5 h-5 `,
          months: monthStyle,
          caption_label: 'text-sm font-normal', // Títulos de mes y año
          day: 'text-sm', // Números del calendario
          weekday: 'text-xs font-normal',
          selected: ``, // Día seleccionado (inicio o fin)
          // range_start: 'rounded-full bg-primary text-white bg-base-200',
          // range_end: 'rounded-full bg-primary text-white bg-base-200',
          range_middle: 'bg-base-200 border-none ',
        }}
        month={month}
        onMonthChange={setMonth}
        startMonth={today}
        endMonth={new Date(today.getFullYear() + 2, today.getMonth())}
      />
      <div className="text-center">
        <button
          onClick={handleResetClick}
          className="btn btn-small btn-soft btn-primary mx-2 my-1"
        >
          {translate(t, t.calendar.removeDates)}
        </button>
      </div>
    </div>
  );
};

export default TabCalendar;
