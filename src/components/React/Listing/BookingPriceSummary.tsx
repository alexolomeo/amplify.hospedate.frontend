import type { Pricing } from '@/types/listing/pricing';
import {
  getTranslation,
  translate,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

interface BookingPriceProps {
  pricing: Pricing;
  lang?: SupportedLanguages;
  nights: number;
}
interface DiscountRow {
  label: string;
  amount: string;
  testId: string;
}

export default function BookingPriceSummary({
  pricing,
  lang = 'es',
  nights,
}: BookingPriceProps) {
  const t = getTranslation(lang);
  const currency = pricing?.currency || 'BOB';
  const hasWeeklyDiscount = pricing.weeklyDiscountAmount > 0;
  const hasMonthlyDiscount = pricing.monthlyDiscountAmount > 0;
  const dateLabel = useMemo(() => {
    if (nights === 1) return t.listingDetail.booking.perNight;
    if (nights >= 28) return t.listingDetail.booking.monthly;
    return translate(t, 'listingDetail.booking.perNights', { nights });
  }, [nights, t]);
  const discountRows: DiscountRow[] = [
    hasMonthlyDiscount && {
      label: translate(t, t.listingDetail.booking.monthlyDiscount),
      amount: formatCurrency(pricing.monthlyDiscountAmount, currency, lang),
      testId: 'listing-booking-monthly-discount',
    },
    hasWeeklyDiscount && {
      label: translate(t, t.listingDetail.booking.weeklyDiscount),
      amount: formatCurrency(pricing.weeklyDiscountAmount, currency, lang),
      testId: 'listing-booking-weekly-discount',
    },
  ].filter(Boolean) as DiscountRow[];
  return (
    <div className="dropdown dropdown-start md:dropdown-end lg:dropdown-center rounded-lg">
      <div
        className="flex cursor-pointer flex-wrap items-end gap-x-2"
        tabIndex={0}
        role="button"
      >
        <div
          className="text-xl tracking-tight underline underline-offset-4 md:text-2xl lg:text-3xl"
          data-testid="listing-booking-title"
        >
          {currency} {pricing.total.toFixed(0)}
        </div>
        <div
          className="text-neutral text-base font-normal lg:text-xl"
          data-testid="listing-booking-subtitle"
        >
          {dateLabel}
        </div>
      </div>
      <ul className="dropdown-content rounded-box z-10 min-w-xs bg-[var(--color-base-150)] p-6 text-xs shadow-md md:min-w-sm md:text-sm">
        <li className="text-lg font-semibold">
          {t.listingDetail.booking.priceDetails}
        </li>
        <li className="py-6">
          <div className="flex justify-between">
            <span className="text-neutral font-normal">
              {nights}{' '}
              {translatePlural(t, 'listingDetail.booking.night', nights)}:
            </span>
            <span
              className="font-normal"
              data-testid="listing-booking-detail-perNight"
            >
              {formatCurrency(pricing.subtotal, currency, lang)}
            </span>
          </div>
          {discountRows.map((row, index) => (
            <div
              key={index}
              className="flex justify-between"
              data-testid={row.testId}
            >
              <span className="text-neutral font-normal">{row.label}</span>
              <span className="font-normal text-lime-600">- {row.amount}</span>
            </div>
          ))}
        </li>
        {(hasMonthlyDiscount || hasWeeklyDiscount) && (
          <li className="flex justify-between border-t border-blue-700 pt-6">
            <span>{translate(t, t.listingDetail.booking.total)}</span>
            <span data-testid="listing-booking-detail-total">
              {formatCurrency(pricing.total, currency, lang)}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
