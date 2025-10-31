import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CheckInMethodForm } from './checkInMethodValidators';
import type { CheckInMethodValue } from '@/types/host/edit-listing/editListingValues';

type UseCheckInMethodForm = {
  form: CheckInMethodForm;
  isDirty: boolean;
  reset: () => void;
  setSelectedMethodId: (id: CheckInMethodValue) => void;
  setInstructions: (text: string) => void;
};

export function useCheckInMethodForm(
  initial: CheckInMethodForm
): UseCheckInMethodForm {
  const [form, setForm] = useState<CheckInMethodForm>(initial);
  const [baseline, setBaseline] = useState<CheckInMethodForm>(initial);

  // Rehidrata cuando cambian los initial
  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setSelectedMethodId = useCallback((id: CheckInMethodValue) => {
    setForm((prev) => ({ ...prev, selectedMethodId: id }));
  }, []);

  const setInstructions = useCallback((text: string) => {
    setForm((prev) => ({ ...prev, instructions: text }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return !(
      form.selectedMethodId === baseline.selectedMethodId &&
      form.instructions === baseline.instructions
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    setSelectedMethodId,
    setInstructions,
  };
}
