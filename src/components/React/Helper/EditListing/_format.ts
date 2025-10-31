export const take = (s?: string, n = 80) =>
  typeof s === 'string' ? (s.length > n ? s.slice(0, n) + '…' : s) : undefined;

export const joinCompact = (
  parts: Array<string | number | undefined | null>,
  sep = ' · '
) => parts.filter(Boolean).join(sep);

export const formatBs = (value: number, locale: string = 'es-BO') =>
  `Bs ${Math.round(value).toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export const toPercent = (n?: number | null) =>
  typeof n === 'number' && n > 0 ? Math.round(n * 100) : 0;

export const fmt = (
  tr: (k: string) => string,
  count: number | undefined,
  singularKey: string,
  pluralKey: string
) => {
  if (typeof count !== 'number' || count <= 0) return undefined;
  const key = count === 1 ? singularKey : pluralKey;
  return tr(key).replace('{count}', String(count));
};
