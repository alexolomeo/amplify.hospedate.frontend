import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  GuestSafetyForm,
  SCKey,
  SDKey,
  PIKey,
  DetailKey,
} from './guestSafetyValidators';

type UseGuestSafetyForm = {
  form: GuestSafetyForm;
  isDirty: boolean;
  reset: () => void;

  setSc: (k: SCKey, v: boolean) => void;
  setSd: (k: SDKey, v: boolean) => void;
  setPi: (k: PIKey, v: boolean) => void;
  setDetail: (key: DetailKey, value: string | null) => void;
};

export function useGuestSafetyForm(
  initial: GuestSafetyForm
): UseGuestSafetyForm {
  const [form, setForm] = useState<GuestSafetyForm>(initial);
  const [baseline, setBaseline] = useState<GuestSafetyForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setSc = useCallback((k: SCKey, v: boolean) => {
    setForm((prev) => ({ ...prev, sc: { ...prev.sc, [k]: v } }));
  }, []);

  const setSd = useCallback((k: SDKey, v: boolean) => {
    setForm((prev) => ({ ...prev, sd: { ...prev.sd, [k]: v } }));
  }, []);

  const setPi = useCallback((k: PIKey, v: boolean) => {
    setForm((prev) => ({ ...prev, pi: { ...prev.pi, [k]: v } }));
  }, []);

  const setDetail = useCallback((key: DetailKey, value: string | null) => {
    setForm((prev) => {
      const next = { ...prev.details };
      if (!value || value.trim() === '') {
        delete next[key];
        return { ...prev, details: next };
      }
      next[key] = value;
      return { ...prev, details: next };
    });
  }, []);

  const isDirty = useMemo<boolean>(() => {
    const A = form;
    const B = baseline;

    for (const [k, v] of Object.entries(A.sc)) {
      if (B.sc[k as keyof typeof B.sc] !== v) return true;
    }
    for (const [k, v] of Object.entries(A.sd)) {
      if (B.sd[k as keyof typeof B.sd] !== v) return true;
    }
    for (const [k, v] of Object.entries(A.pi)) {
      if (B.pi[k as keyof typeof B.pi] !== v) return true;
    }

    const keysA = Object.keys(A.details);
    const keysB = Object.keys(B.details);
    if (keysA.length !== keysB.length) return true;
    for (const k of keysA) {
      if (A.details[k as DetailKey] !== B.details[k as DetailKey]) {
        return true;
      }
    }

    return false;
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, isDirty, reset, setSc, setSd, setPi, setDetail };
}
