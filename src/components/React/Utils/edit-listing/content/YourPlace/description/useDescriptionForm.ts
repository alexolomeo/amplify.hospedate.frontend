import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DescriptionForm } from './descriptionValidators';

type UseDescriptionForm = {
  form: DescriptionForm;
  isDirty: boolean;
  reset: () => void;

  setListingDescription: (v: string) => void;
  setPropertyDescription: (v: string) => void;
  setAreasDescription: (v: string) => void;
  setInteractionDescription: (v: string) => void;
  setAdditionalNotes: (v: string) => void;
};

export function useDescriptionForm(
  initial: DescriptionForm
): UseDescriptionForm {
  const [form, setForm] = useState<DescriptionForm>(initial);
  const [baseline, setBaseline] = useState<DescriptionForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setListingDescription = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, listingDescription: v }));
  }, []);
  const setPropertyDescription = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, propertyDescription: v }));
  }, []);
  const setAreasDescription = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, areasDescription: v }));
  }, []);
  const setInteractionDescription = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, interactionDescription: v }));
  }, []);
  const setAdditionalNotes = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, additionalNotes: v }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return (
      form.listingDescription !== baseline.listingDescription ||
      form.propertyDescription !== baseline.propertyDescription ||
      form.areasDescription !== baseline.areasDescription ||
      form.interactionDescription !== baseline.interactionDescription ||
      form.additionalNotes !== baseline.additionalNotes
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    setListingDescription,
    setPropertyDescription,
    setAreasDescription,
    setInteractionDescription,
    setAdditionalNotes,
  };
}
