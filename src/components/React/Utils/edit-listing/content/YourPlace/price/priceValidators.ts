import { MIN_NIGHT_PRICE } from '@/components/React/Utils/priceMath';
import { isIntegerStr } from '@/components/React/Utils/Validation/number';

export const NIGHT_MAX = 10000;

export type PriceForm = {
  nightRaw: string;
  weekendEnabled: boolean;
  weekendRaw: string;
  discountsEnabled: boolean;
  weeklyPct: number;
  monthlyPct: number;
};

export type PriceFieldErrors = Partial<{
  nightRaw: string;
  weekendRaw: string;
  weeklyPct: string;
  monthlyPct: string;
}>;

export type PriceValidationResult =
  | { ok: true }
  | { ok: false; errors: PriceFieldErrors };

export type PriceValidationMessages = {
  requiredNight: string;
  integerOnly: string;
  minNight: string;
  maxNight: string;

  minWeekend: string;
  maxWeekend: string;

  discountsRuleHint: string;
};
export function validatePriceForm(
  form: PriceForm,
  m: PriceValidationMessages
): PriceValidationResult {
  const errors: PriceFieldErrors = {};

  // nightly
  if (form.nightRaw.trim() === '') {
    errors.nightRaw = m.requiredNight;
  } else if (!isIntegerStr(form.nightRaw)) {
    errors.nightRaw = m.integerOnly;
  } else {
    const n = Number(form.nightRaw);
    if (n < MIN_NIGHT_PRICE) errors.nightRaw = m.minNight;
    else if (n > NIGHT_MAX) errors.nightRaw = m.maxNight;
  }

  // weekend
  if (form.weekendEnabled) {
    const raw = form.weekendRaw.trim();
    if (raw !== '') {
      if (!/^\d+$/.test(raw)) {
        errors.weekendRaw = m.integerOnly;
      } else {
        const w = Number(raw);
        if (w < MIN_NIGHT_PRICE) errors.weekendRaw = m.minWeekend;
        else if (w > NIGHT_MAX) errors.weekendRaw = m.maxWeekend;
      }
    }
  }

  // discounts
  if (form.discountsEnabled) {
    const wp = Math.round(form.weeklyPct);
    const mp = Math.round(form.monthlyPct);
    if (wp < 0 || wp > 100) {
      errors.weeklyPct = m.integerOnly;
    }
    if (mp < 0 || mp > 100) {
      errors.monthlyPct = m.integerOnly;
    }
    if (wp > mp) {
      errors.weeklyPct = errors.weeklyPct ?? m.discountsRuleHint;
    }
  }

  return Object.keys(errors).length === 0
    ? { ok: true }
    : { ok: false, errors };
}
