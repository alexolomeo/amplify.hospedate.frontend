// src/features/edit-listing/subtexts/priceRows.ts
import { toPercent } from './_format';
import type { PricesSection } from '@/types/host/edit-listing/editListingValues';

export type PriceRow =
  | { key: 'perNight'; label: string }
  | { key: 'perWeekend'; label: string }
  | { key: 'weekly'; label: string }
  | { key: 'monthly'; label: string };

export function buildPriceRows(
  tr: (k: string) => string,
  pricesSection?: PricesSection
): PriceRow[] {
  const rows: Array<PriceRow | undefined> = [];

  const night = pricesSection?.perNight?.price;
  if (typeof night === 'number' && night > 0) {
    rows.push({
      key: 'perNight',
      label: tr('price.perNight').replace('{amount}', `Bs ${night}`),
    });
  }

  const weekend = pricesSection?.perWeekend?.price;
  if (typeof weekend === 'number' && weekend > 0) {
    rows.push({
      key: 'perWeekend',
      label: tr('price.perWeekend').replace('{amount}', `Bs ${weekend}`),
    });
  }

  const weeklyPct = toPercent(pricesSection?.discounts?.weekly);
  if (weeklyPct > 0) {
    rows.push({
      key: 'weekly',
      label: tr('price.weeklyDiscount').replace('{percent}', String(weeklyPct)),
    });
  }

  const monthlyPct = toPercent(pricesSection?.discounts?.monthly);
  if (monthlyPct > 0) {
    rows.push({
      key: 'monthly',
      label: tr('price.monthlyDiscount').replace(
        '{percent}',
        String(monthlyPct)
      ),
    });
  }

  return rows.filter(Boolean) as PriceRow[];
}
