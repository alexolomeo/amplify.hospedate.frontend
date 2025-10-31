import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import CollapseCard from '../../Common/CollapseCard';
import Toggle from '@/components/React/Common/ToggleSwitch';
import { useEffect, useMemo, useState } from 'react';
import SliderProgress from '@/components/React/Common/SliderProgress';
import type {
  PriceSection,
  PriceValidationErrors,
} from '@/types/host/calendar/preferenceSetting';
import {
  applyDiscount,
  computeBaseTotal,
  MONTH_WEEKDAY_NIGHTS,
  MONTH_WEEKEND_NIGHTS,
  WEEK_WEEKDAY_NIGHTS,
  WEEK_WEEKEND_NIGHTS,
} from '../../Utils/priceMath';
interface Props {
  lang: SupportedLanguages;
  prices: PriceSection;
  onPricesChange: (newPrices: PriceSection) => void;
  priceMin: number;
  priceMax: number;
  currency?: string;
}

function toPercent(dec: number | null | undefined): number {
  if (dec == null) return 0;
  const pct = Math.round(dec * 100);
  return Number.isFinite(pct) ? pct : 0;
}

export default function PricePanel({
  lang,
  prices,
  onPricesChange,
  priceMax,
  priceMin,
  currency = 'BOB',
}: Props) {
  const t = getTranslation(lang);
  const [mounted, setMounted] = useState(false);
  const [touchedPerNight, setTouchedPerNight] = useState(false);
  const [touchedPerWeekend, setTouchedPerWeekend] = useState(false);
  const [localErrors, setLocalErrors] = useState<PriceValidationErrors>({});

  useEffect(() => setMounted(true), []);

  const handleWeeklyDiscountChange = (value: number) => {
    const newWeeklyDiscount = value / 100;

    const monthly = prices.discounts.monthly;
    if (monthly !== null && newWeeklyDiscount > monthly) {
      setLocalErrors((prev) => ({
        ...prev,
        discounts: t.hostContent.calendar.weeklyError,
      }));
      return;
    }
    setLocalErrors((prev) => ({
      ...prev,
      discounts: '',
    }));
    onPricesChange({
      ...prices,
      discounts: {
        ...prices.discounts,
        weekly: newWeeklyDiscount,
      },
    });
  };

  const handleMonthlyDiscountChange = (value: number) => {
    const newMonthlyDiscount = value / 100;

    const weekly = prices.discounts.weekly;
    if (weekly !== null && newMonthlyDiscount < weekly) {
      setLocalErrors((prev) => ({
        ...prev,
        discounts: t.hostContent.calendar.monthlyError,
      }));
      return;
    }
    setLocalErrors((prev) => ({
      ...prev,
      discounts: '',
    }));
    onPricesChange({
      ...prices,
      discounts: {
        ...prices.discounts,
        monthly: newMonthlyDiscount,
      },
    });
  };

  const validatePrice = (value: number) => {
    if (value < priceMin || value > priceMax) {
      return translate(t, `hostContent.calendar.priceError`, {
        priceMin: priceMin,
        priceMax: priceMax,
      });
    }
    return '';
  };

  const weeklyDisplayValue = useMemo(() => {
    const base = computeBaseTotal(
      prices.perNight,
      prices.perWeekend !== null,
      prices.perWeekend ?? prices.perNight,
      WEEK_WEEKDAY_NIGHTS,
      WEEK_WEEKEND_NIGHTS
    );
    return base == null
      ? undefined
      : applyDiscount(base, toPercent(prices.discounts.weekly));
  }, [prices.perNight, prices.perWeekend, prices.discounts.weekly]);

  const monthlyDisplayValue = useMemo(() => {
    const base = computeBaseTotal(
      prices.perNight,
      prices.perWeekend !== null,
      prices.perWeekend ?? prices.perNight,
      MONTH_WEEKDAY_NIGHTS,
      MONTH_WEEKEND_NIGHTS
    );
    return base == null
      ? undefined
      : applyDiscount(base, toPercent(prices.discounts.monthly));
  }, [prices.perNight, prices.perWeekend, prices.discounts.monthly]);

  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-1">
      <CollapseCard title={t.hostContent.calendar.price} className="w-full">
        <div>
          <label className="text-neutral mb-1 text-xs">
            {t.hostContent.calendar.nightlyPrice}
          </label>
          <input
            type="number"
            value={prices.perNight === 0 ? '' : prices.perNight}
            onChange={(e) => {
              const v = Number(e.target.value);
              onPricesChange({
                ...prices,
                perNight: Number.isFinite(v) && v >= 0 ? v : 0,
              });
              if (touchedPerNight && v >= priceMin && v <= priceMax) {
                setLocalErrors((prev) => ({ ...prev, perNight: '' }));
              }
            }}
            onBlur={() => {
              setTouchedPerNight(true);
              const error = validatePrice(prices.perNight);
              if (error) {
                setLocalErrors((prev) => ({ ...prev, perNight: error }));
              }
            }}
            min={0}
            className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
          />
          {touchedPerNight && localErrors.perNight && (
            <p className="text-error mt-2 text-center text-xs">
              {localErrors.perNight}
            </p>
          )}
        </div>
      </CollapseCard>
      <CollapseCard
        title={t.hostContent.calendar.weekendPrice}
        className="w-full"
      >
        <div className="flex flex-col gap-y-4">
          <Toggle
            title={t.hostContent.calendar.customWeekendPrice}
            checked={prices.perWeekend !== null}
            onChange={(enabled) => {
              onPricesChange({
                ...prices,
                perWeekend: enabled ? prices.perNight : null,
              });
            }}
          />
          {prices.perWeekend !== null && (
            <div>
              <label className="text-neutral text-xs">
                {t.hostContent.calendar.nightlyPrice}
              </label>
              <input
                type="number"
                value={prices.perWeekend === 0 ? '' : prices.perWeekend}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  onPricesChange({
                    ...prices,
                    perWeekend: Number.isFinite(v) && v >= 0 ? v : 0,
                  });
                  // Re-validate input on user input
                  if (touchedPerWeekend && v >= priceMin && v <= priceMax) {
                    setLocalErrors((prev) => ({ ...prev, perWeekend: '' }));
                  }
                }}
                onBlur={() => {
                  if (prices.perWeekend !== null) {
                    setTouchedPerWeekend(true);
                    const error = validatePrice(prices.perWeekend);
                    if (error) {
                      setLocalErrors((prev) => ({
                        ...prev,
                        perWeekend: error,
                      }));
                    }
                  }
                }}
                min={0}
                className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
              />
              {touchedPerWeekend && localErrors.perWeekend && (
                <p className="text-error mt-2 text-center text-xs">
                  {localErrors.perWeekend}
                </p>
              )}
            </div>
          )}
        </div>
      </CollapseCard>
      <CollapseCard title={t.hostContent.calendar.discounts} className="w-full">
        <Toggle
          title={t.hostContent.calendar.toggleDiscounts}
          checked={
            prices.discounts.monthly !== null ||
            prices.discounts.weekly !== null
          }
          onChange={(enabled) => {
            onPricesChange({
              ...prices,
              discounts: {
                weekly: enabled ? prices.discounts.weekly || 0 : null,
                monthly: enabled ? prices.discounts.monthly || 0 : null,
              },
            });
          }}
        />
        {(prices.discounts.monthly !== null ||
          prices.discounts.weekly !== null) && (
          <div className="mt-4 flex flex-col gap-6">
            <div>
              <p className="mb-1 text-sm font-semibold">
                {t.hostContent.calendar.weekly}
              </p>
              <p className="text-neutral text-xs">
                {t.hostContent.calendar.weeklyHint}
              </p>
              {mounted && (
                <SliderProgress
                  value={toPercent(prices.discounts.weekly)}
                  onChange={handleWeeklyDiscountChange}
                  displayValue={weeklyDisplayValue}
                  displayUnit={currency}
                  min={0}
                  max={99}
                />
              )}
            </div>
            <div>
              <p className="mb-1 text-sm font-semibold">
                {t.hostContent.calendar.monthly}
              </p>
              <p className="text-neutral text-xs">
                {t.hostContent.calendar.monthlyHint}
              </p>
              {mounted && (
                <SliderProgress
                  value={toPercent(prices.discounts.monthly)}
                  onChange={handleMonthlyDiscountChange}
                  displayValue={monthlyDisplayValue}
                  displayUnit={currency}
                  min={0}
                  max={99}
                />
              )}
            </div>
            {localErrors.discounts && (
              <div className="text-error mt-2 text-center text-xs">
                {localErrors.discounts}
              </div>
            )}
          </div>
        )}
      </CollapseCard>
    </div>
  );
}
