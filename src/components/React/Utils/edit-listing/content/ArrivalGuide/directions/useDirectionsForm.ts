import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DirectionsForm } from './directionsValidators';

type UseDirectionsForm = {
  form: DirectionsForm;
  isDirty: boolean;
  reset: () => void;
  setText: (v: string) => void;
};

export function useDirectionsForm(initial: DirectionsForm): UseDirectionsForm {
  const [form, setForm] = useState<DirectionsForm>(initial);
  const [baseline, setBaseline] = useState<DirectionsForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setText = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, text: v }));
  }, []);

  const isDirty = useMemo<boolean>(
    () => form.text !== baseline.text,
    [form, baseline]
  );

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, isDirty, reset, setText };
}
