export interface DecimalParts {
  intPart: string;
  fracPart: string;
}

export function decimalParts(n: number): DecimalParts {
  if (!Number.isFinite(n)) return { intPart: '', fracPart: '' };

  const s = String(Math.abs(n));
  const [intPartRaw, fracPartRaw = ''] = s.split('.');

  return {
    intPart: intPartRaw ?? '',
    fracPart: fracPartRaw ?? '',
  };
}
