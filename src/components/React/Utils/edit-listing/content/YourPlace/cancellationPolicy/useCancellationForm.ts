import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CancellationForm } from './cancellationValidators';
import type {
  StandardPolicyId,
  LongStayPolicyId,
} from '@/components/React/Utils/edit-listing/cancellationPolicy';

type UseCancellationForm = {
  form: CancellationForm;
  isDirty: boolean;
  reset: () => void;

  setStandardId: (id: StandardPolicyId) => void;
  setLongStayId: (id: LongStayPolicyId) => void;
};

export function useCancellationForm(
  initial: CancellationForm
): UseCancellationForm {
  const [form, setForm] = useState<CancellationForm>(initial);
  const [baseline, setBaseline] = useState<CancellationForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setStandardId = useCallback((id: StandardPolicyId) => {
    setForm((prev) => ({ ...prev, standardId: id }));
  }, []);

  const setLongStayId = useCallback((id: LongStayPolicyId) => {
    setForm((prev) => ({ ...prev, longStayId: id }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return (
      form.standardId !== baseline.standardId ||
      form.longStayId !== baseline.longStayId
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, isDirty, reset, setStandardId, setLongStayId };
}
