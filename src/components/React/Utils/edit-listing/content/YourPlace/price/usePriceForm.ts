import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PriceForm } from './priceValidators';
import { toNormalized, type PriceNormalized } from './priceAdapters';
import { clampWeekly, clampMonthly } from '@/components/React/Utils/priceMath';

type UsePriceForm = {
  form: PriceForm;
  isDirty: boolean;
  reset: () => void;

  getNormalized: () => PriceNormalized;

  setNightRaw: (v: string) => void;
  setWeekendEnabled: (v: boolean) => void;
  setWeekendRaw: (v: string) => void;
  setDiscountsEnabled: (v: boolean) => void;
  setWeeklyPct: (pct0to100: number) => void;
  setMonthlyPct: (pct0to100: number) => void;
};

export function usePriceForm(initial: PriceForm): UsePriceForm {
  const [form, setForm] = useState<PriceForm>(initial);
  const [baseline, setBaseline] = useState<PriceForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setNightRaw = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, nightRaw: v }));
  }, []);

  const setWeekendEnabled = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      weekendEnabled: v,
      weekendRaw: prev.weekendRaw,
    }));
  }, []);

  const setWeekendRaw = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, weekendRaw: v }));
  }, []);

  const setDiscountsEnabled = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      discountsEnabled: v,
      monthlyPct: v
        ? Math.max(prev.monthlyPct, prev.weeklyPct)
        : prev.monthlyPct,
    }));
  }, []);

  const setWeeklyPct = useCallback((pct0to100: number) => {
    setForm((prev) => {
      const nextWeekly = clampWeekly(pct0to100, prev.monthlyPct);
      const nextMonthly = Math.max(prev.monthlyPct, Math.round(pct0to100));
      return {
        ...prev,
        weeklyPct: nextWeekly,
        monthlyPct: nextMonthly,
      };
    });
  }, []);

  const setMonthlyPct = useCallback((pct0to100: number) => {
    setForm((prev) => {
      const nextMonthly = clampMonthly(pct0to100, prev.weeklyPct);
      const nextWeekly = Math.min(prev.weeklyPct, Math.round(pct0to100));
      return {
        ...prev,
        monthlyPct: nextMonthly,
        weeklyPct: nextWeekly,
      };
    });
  }, []);

  const getNormalized = useCallback((): PriceNormalized => {
    return toNormalized(form);
  }, [form]);

  const isDirty = useMemo<boolean>(() => {
    const a = toNormalized(form);
    const b = toNormalized(baseline);

    const eq = (x: number | null, y: number | null): boolean => x === y;

    return !(
      eq(a.perNight, b.perNight) &&
      eq(a.perWeekend, b.perWeekend) &&
      eq(a.weekly, b.weekly) &&
      eq(a.monthly, b.monthly)
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    getNormalized,
    setNightRaw,
    setWeekendEnabled,
    setWeekendRaw,
    setDiscountsEnabled,
    setWeeklyPct,
    setMonthlyPct,
  };
}
