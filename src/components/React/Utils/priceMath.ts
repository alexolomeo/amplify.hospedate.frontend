// Minimum nightly price allowed (validation threshold)
export const MIN_NIGHT_PRICE = 50;

// Week composition used for weekly discount math (7 nights = 5 weekdays + 2 weekend)
export const WEEK_TOTAL_NIGHTS = 7;
export const WEEK_WEEKEND_NIGHTS = 2;
export const WEEK_WEEKDAY_NIGHTS = WEEK_TOTAL_NIGHTS - WEEK_WEEKEND_NIGHTS; // 5

// Month composition used for monthly discount math (28 nights = 20 weekdays + 8 weekend)
export const MONTH_TOTAL_NIGHTS = 28;
export const MONTH_WEEKEND_NIGHTS = 8;
export const MONTH_WEEKDAY_NIGHTS = MONTH_TOTAL_NIGHTS - MONTH_WEEKEND_NIGHTS; // 20

/**
 * Computes the pre-discount total for a stay, taking weekend pricing into account.
 * Returns undefined if nightly price is invalid (< MIN_NIGHT_PRICE or <= 0).
 */
export function computeBaseTotal(
  perNight: number,
  weekendEnabled: boolean,
  weekendPrice: number,
  weekdayNights: number,
  weekendNights: number
): number | undefined {
  if (perNight <= 0 || perNight < MIN_NIGHT_PRICE) return undefined;

  // If weekend price is not enabled or invalid, fall back to nightly price
  const weekendRate =
    weekendEnabled && weekendPrice > 0 ? weekendPrice : perNight;

  return perNight * weekdayNights + weekendRate * weekendNights;
}

/**
 * Applies a percentage discount (0–100) to a base total.
 * The result is rounded to the nearest integer.
 */
export function applyDiscount(base: number, pct0to100: number): number {
  const clamped = Math.max(0, Math.min(100, Math.round(pct0to100)));
  const fraction = 1 - clamped / 100;
  return Math.round(base * fraction);
}

/**
 * Ensures weekly discount (%) never exceeds monthly discount (%).
 * Returns a value in [0, 100] clamped to <= monthlyPct.
 */
export function clampWeekly(weeklyPct: number, monthlyPct: number): number {
  return Math.min(
    Math.max(0, Math.min(100, Math.round(weeklyPct))),
    monthlyPct
  );
}

/**
 * Ensures monthly discount (%) is never below weekly discount (%).
 * Returns a value in [0, 100] clamped to >= weeklyPct.
 */
export function clampMonthly(monthlyPct: number, weeklyPct: number): number {
  return Math.max(
    Math.max(0, Math.min(100, Math.round(monthlyPct))),
    weeklyPct
  );
}
