/**
 * Normalize a string to KEY_CASE:
 * - NFKD + remove accent
 * - Uppercase
 * - Replace non-alphanumeric characters with _
 * - Collapse multiple _ and trim _ at the beginning/end
 */
export function keyify(s: string): string {
  return s
    .normalize?.('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/_{2,}/g, '_');
}

export function toKeyIn<K extends string>(
  raw: string,
  dict: Record<K, unknown>
): K | undefined {
  const k = keyify(raw) as K;
  return k in dict ? k : undefined;
}

export function keyFromLabel<K extends string>(
  label: string,
  dict: Record<K, string>
): K | undefined {
  for (const [k, v] of Object.entries(dict) as [K, string][]) {
    if (v === label) return k;
  }
  return undefined;
}
