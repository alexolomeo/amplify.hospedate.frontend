import type { KeyboardEvent } from 'react';

export type NumericKeyBlockOptions = {
  allowNegative?: boolean;
  allowDecimal?: boolean;
  blockExponent?: boolean;
};

const DEFAULTS: Required<NumericKeyBlockOptions> = {
  allowNegative: false,
  allowDecimal: false,
  blockExponent: true,
};

export function preventNonNumericKeydown(
  e: KeyboardEvent<HTMLInputElement>,
  opts?: NumericKeyBlockOptions
): void {
  const { allowNegative, allowDecimal, blockExponent } = {
    ...DEFAULTS,
    ...opts,
  };

  if (e.ctrlKey || e.metaKey || e.altKey) return;

  const k = e.key;

  if (blockExponent && (k === 'e' || k === 'E')) {
    e.preventDefault();
    return;
  }

  if (!allowNegative && (k === '+' || k === '-')) {
    e.preventDefault();
    return;
  }

  if (!allowDecimal && (k === '.' || k === ',')) {
    e.preventDefault();
  }
}

export function handleIntegerKeydown(e: KeyboardEvent<HTMLInputElement>): void {
  preventNonNumericKeydown(e, {
    allowNegative: false,
    allowDecimal: false,
    blockExponent: true,
  });
}
