const shouldDrop = (v: unknown): v is '' | 0 | null | undefined =>
  v === '' || v === 0 || v === null || v === undefined;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export const omitEmptyAndZero = <T extends Record<string, unknown>>(
  input: T
): Partial<T> => {
  const clean = (val: unknown): unknown => {
    if (Array.isArray(val)) {
      const arr = val.map(clean).filter((x) => !shouldDrop(x));
      return arr.length ? arr : undefined;
    }
    if (isPlainObject(val)) {
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(val)) {
        const cv = clean((val as Record<string, unknown>)[key]);
        if (!shouldDrop(cv)) out[key] = cv;
      }
      return Object.keys(out).length ? out : undefined;
    }
    return val;
  };

  const result = clean(input);
  return (isPlainObject(result) ? result : {}) as Partial<T>;
};
