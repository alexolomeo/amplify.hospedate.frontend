import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BookingForm, BookingTypeId } from './bookingValidators';

type UseBookingForm = {
  form: BookingForm;
  isDirty: boolean;
  reset: () => void;

  setSelectedType: (id: BookingTypeId) => void;
  setMessageForType: (id: BookingTypeId, value: string) => void;
};

export function useBookingForm(initial: BookingForm): UseBookingForm {
  const [form, setForm] = useState<BookingForm>(initial);
  const [baseline, setBaseline] = useState<BookingForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setSelectedType = useCallback((id: BookingTypeId) => {
    setForm((prev) => ({ ...prev, selectedTypeId: id }));
  }, []);

  const setMessageForType = useCallback((id: BookingTypeId, value: string) => {
    setForm((prev) => ({
      ...prev,
      messagesByType: { ...prev.messagesByType, [id]: value },
    }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    const a = form;
    const b = baseline;

    if (a.selectedTypeId !== b.selectedTypeId) return true;
    const keys: BookingTypeId[] = ['INSTANT', 'APPROVAL_REQUIRED'];
    for (const k of keys) {
      if ((a.messagesByType[k] ?? '') !== (b.messagesByType[k] ?? '')) {
        return true;
      }
    }
    return false;
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, isDirty, reset, setSelectedType, setMessageForType };
}
