import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AvailabilityForm, NoticeKey } from './availabilityValidators';

type UseAvailabilityForm = {
  form: AvailabilityForm;
  isDirty: boolean;
  reset: () => void;

  setMinNightsRaw: (v: string) => void;
  setMaxNightsRaw: (v: string) => void;
  setNoticeKey: (k: NoticeKey | null) => void;
  setSameDayCutoffLabel: (label: string | null) => void;
  setAllowRequestSameDay: (v: boolean) => void;
};

export function useAvailabilityForm(
  initial: AvailabilityForm
): UseAvailabilityForm {
  const [form, setForm] = useState<AvailabilityForm>(initial);
  const [baseline, setBaseline] = useState<AvailabilityForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setMinNightsRaw = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, minNightsRaw: v }));
  }, []);

  const setMaxNightsRaw = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, maxNightsRaw: v }));
  }, []);

  const setNoticeKey = useCallback((k: NoticeKey | null) => {
    setForm((prev) => ({
      ...prev,
      noticeKey: k,
      sameDayCutoffLabel: k === 'SAME_DAY' ? prev.sameDayCutoffLabel : null,
    }));
  }, []);

  const setSameDayCutoffLabel = useCallback((label: string | null) => {
    setForm((prev) => ({ ...prev, sameDayCutoffLabel: label }));
  }, []);

  const setAllowRequestSameDay = useCallback((v: boolean) => {
    setForm((prev) => ({ ...prev, allowRequestSameDay: v }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    const a = form;
    const b = baseline;

    return !(
      a.minNightsRaw === b.minNightsRaw &&
      a.maxNightsRaw === b.maxNightsRaw &&
      a.noticeKey === b.noticeKey &&
      a.sameDayCutoffLabel === b.sameDayCutoffLabel &&
      a.allowRequestSameDay === b.allowRequestSameDay
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    setMinNightsRaw,
    setMaxNightsRaw,
    setNoticeKey,
    setSameDayCutoffLabel,
    setAllowRequestSameDay,
  };
}
