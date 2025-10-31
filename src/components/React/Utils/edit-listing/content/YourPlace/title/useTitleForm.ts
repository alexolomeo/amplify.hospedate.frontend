import { useCallback, useEffect, useMemo, useState } from 'react';

export type TitleForm = { title: string };

export function useTitleForm(initial: TitleForm) {
  const [form, setForm] = useState<TitleForm>(initial);
  const [baseline, setBaseline] = useState<TitleForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setTitle = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, title: v }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return form.title.trim() !== baseline.title.trim();
  }, [form.title, baseline.title]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return { form, setTitle, isDirty, reset };
}
