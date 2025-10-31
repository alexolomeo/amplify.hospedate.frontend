import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Summary } from '@/types/host/calendar/availability';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
  lang: SupportedLanguages;
  summary: Summary;
  price: number;
}

export default function SummaryDayDetail({ lang, summary, price }: Props) {
  const t = getTranslation(lang);
  const calendarText = t.hostContent.calendar;
  const currency = 'BOB';
  return (
    <div className="flex justify-center">
      <div className="dropdown dropdown-center rounded-lg text-sm font-bold">
        <div
          className="text-primary flex cursor-pointer items-center justify-between gap-2"
          tabIndex={0}
          role="button"
        >
          {calendarText.guestPrice} {formatCurrency(price, currency, lang)}
        </div>

        <ul className="dropdown-content rounded-box bg-base-100 z-10 m-2 w-xs space-y-2 p-5 text-base font-normal shadow-lg">
          <li className="flex justify-between">
            <span className="text-neutral">
              {calendarText.summary.basePrice}
            </span>
            <span className="font-bold">
              {formatCurrency(summary.basePrice, currency, lang)}
            </span>
          </li>
          <li className="flex justify-between">
            <span className="text-neutral">
              {calendarText.summary.serviceFee}
            </span>
            <span>
              {formatCurrency(summary.guestServiceFee, currency, lang)}
            </span>
          </li>
          <li className="flex justify-between gap-x-5">
            <span className="text-neutral">
              {calendarText.summary.guestPrice}
            </span>
            <span>{formatCurrency(summary.guestPrice, currency, lang)}</span>
          </li>
          <li className="border-base-200 border-b"></li>
          <li className="flex justify-between">
            <span className="text-neutral">
              {calendarText.summary.hostEarnings}
            </span>
            <span>{formatCurrency(summary.hostPrice, currency, lang)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
