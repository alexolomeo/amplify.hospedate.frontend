import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { PriceForm } from './priceValidators';

export type PriceNormalized = {
  perNight: number;
  perWeekend: number | null;
  weekly: number | null;
  monthly: number | null;
};

// values -> form (adapter)
export function toPriceForm(
  initialValues: ListingEditorValues | null
): PriceForm {
  const perNight =
    initialValues?.yourPlace?.pricesSection?.perNight?.price ?? 0;
  const perWeekendRaw =
    initialValues?.yourPlace?.pricesSection?.perWeekend?.price ?? null;

  const weeklyDec =
    initialValues?.yourPlace?.pricesSection?.discounts?.weekly ?? null;
  const monthlyDec =
    initialValues?.yourPlace?.pricesSection?.discounts?.monthly ?? null;

  const weekendEnabled = perWeekendRaw !== null;
  const discountsEnabled = weeklyDec !== null || monthlyDec !== null;

  const toPct = (dec: number | null): number => {
    if (dec === null) return 0;
    const pct = Math.round(dec * 100);
    return Number.isFinite(pct) ? pct : 0;
  };

  const weekendRaw = weekendEnabled ? String(perWeekendRaw) : '';

  return {
    nightRaw: perNight > 0 ? String(perNight) : '',
    weekendEnabled,
    weekendRaw,
    discountsEnabled,
    weeklyPct: toPct(weeklyDec),
    monthlyPct: Math.max(toPct(monthlyDec), toPct(weeklyDec)),
  };
}

//form -> normalized (adapter)
export function toNormalized(form: PriceForm): PriceNormalized {
  const parseIntOrNaN = (s: string): number =>
    /^\d+$/.test(s.trim()) ? Number(s) : Number.NaN;

  const perNight = parseIntOrNaN(form.nightRaw);

  let perWeekend: number | null;
  if (!form.weekendEnabled) {
    perWeekend = null;
  } else {
    const raw = form.weekendRaw.trim();
    if (raw === '') {
      perWeekend = null;
    } else {
      const parsed = parseIntOrNaN(raw);
      perWeekend = Number.isFinite(parsed) ? parsed : Number.NaN;
    }
  }

  const weekly = form.discountsEnabled
    ? Math.round(form.weeklyPct) / 100
    : null;
  const monthly = form.discountsEnabled
    ? Math.round(form.monthlyPct) / 100
    : null;
  return {
    perNight,
    perWeekend,
    weekly,
    monthly,
  };
}

//normalized -> payload
function assertFiniteNumber(n: number, label: string): void {
  if (!Number.isFinite(n)) {
    throw new Error(
      `Invalid ${label}: expected finite number, got ${String(n)}`
    );
  }
}

function assertNullOrFinite(n: number | null, label: string): void {
  if (n === null) return;
  if (!Number.isFinite(n)) {
    throw new Error(
      `Invalid ${label}: expected null or finite number, got ${String(n)}`
    );
  }
}

export function toPricePayload(n: PriceNormalized): UpdateListingEditorPayload {
  assertFiniteNumber(n.perNight, 'perNight');
  assertNullOrFinite(n.perWeekend, 'perWeekend');
  assertNullOrFinite(n.weekly, 'weekly');
  assertNullOrFinite(n.monthly, 'monthly');

  return {
    yourPlace: {
      pricesSection: {
        perNight: { price: n.perNight },
        perWeekend: { price: n.perWeekend },
        discounts: {
          weekly: n.weekly,
          monthly: n.monthly,
        },
      },
    },
  };
}
