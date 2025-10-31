import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CapacityForm } from './capacityValidators';

type UseCapacityForm = {
  form: CapacityForm;
  isDirty: boolean;
  reset: () => void;
  setPeople: (n: number) => void;
};

export function useCapacityForm(initial: CapacityForm): UseCapacityForm {
  const [form, setForm] = useState<CapacityForm>(initial);
  const [baseline, setBaseline] = useState<CapacityForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setPeople = useCallback((n: number) => {
    setForm((prev) => ({ ...prev, people: Math.floor(n) }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return form.people !== baseline.people;
  }, [form.people, baseline.people]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, isDirty, reset, setPeople };
}
