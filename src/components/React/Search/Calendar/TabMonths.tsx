import { formatDate } from '@/utils/dateUtils';
import {
  getTranslation,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import { addMonths, differenceInMonths, startOfMonth } from 'date-fns';
import React, { useEffect, useState } from 'react';
import type { DateRange } from 'react-day-picker';

interface SelectDateProps {
  lang?: SupportedLanguages;
  startMonth: Date;
  endMonth: Date;
  onUpdate: (monthStartDate: Date, monthEndDate: Date) => void;
}
const TabMonths: React.FC<SelectDateProps> = ({
  lang = 'es',
  onUpdate,
  startMonth,
  endMonth,
}) => {
  const t = getTranslation(lang);
  const [months, setMonths] = useState<number>(
    Math.max(1, differenceInMonths(endMonth, startMonth))
  );
  const [selected, setSelected] = React.useState<DateRange>({
    from: startMonth,
    to: endMonth,
  });
  useEffect(() => {
    const endDate = startOfMonth(addMonths(startMonth, months));
    setSelected({ from: startMonth, to: endDate });
    onUpdate(startMonth, endDate);
  }, [months, onUpdate, startMonth]);
  return (
    <div className="tab-content pt-8">
      <div className="space-y-4">
        <p className="text-center" data-testid="test-tab-months-question">
          {t.search.dates.whenIsYourTrip}
        </p>
        <div className="flex justify-between space-x-6">
          <p className="flex-none font-semibold">
            {translatePlural(t, `search.dates.monthCount`, 1)}
          </p>
          <input
            type="range"
            min={1}
            max={12}
            value={months}
            step={1}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="range range-primary [--range-fill:0]"
          />
          <div className="flex-none font-semibold">
            {' '}
            {translatePlural(t, `search.dates.monthCount`, 12)}
          </div>
        </div>
        <p className="text-center text-xl lg:text-3xl">
          {translatePlural(t, `search.dates.monthCount`, months)}
        </p>
      </div>
      {selected.from && selected.to && (
        <p className="pt-8 text-center text-sm">
          {formatDate(selected.from, lang)} - {formatDate(selected.to, lang)}
        </p>
      )}
    </div>
  );
};

export default TabMonths;
