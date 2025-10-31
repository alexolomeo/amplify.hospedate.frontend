import { useCallback, useEffect, useMemo, useState } from 'react';
import type { PhotoCaptionForm } from './photoCaptionValidators';

type UsePhotoCaptionForm = {
  form: PhotoCaptionForm;
  isDirty: boolean;
  reset: () => void;
  setText: (v: string) => void;
};

export function usePhotoCaptionForm(
  initial: PhotoCaptionForm
): UsePhotoCaptionForm {
  const [form, setForm] = useState<PhotoCaptionForm>(initial);
  const [baseline, setBaseline] = useState<PhotoCaptionForm>(initial);

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
