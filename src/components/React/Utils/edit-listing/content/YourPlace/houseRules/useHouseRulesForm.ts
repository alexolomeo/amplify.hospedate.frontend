import { useCallback, useEffect, useMemo, useState } from 'react';
import type { HouseRulesForm } from './houseRulesValidators';
import { PETS_MIN } from './houseRulesValidators';

export function useHouseRulesForm(initial: HouseRulesForm) {
  const [form, setForm] = useState<HouseRulesForm>(initial);
  const [baseline, setBaseline] = useState<HouseRulesForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setPetsAllowed = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        petsAllowed: v,
        numPets: v ? Math.max(prev.permissions.numPets, PETS_MIN) : 0,
      },
    }));
  }, []);

  const setNumPets = useCallback((n: number) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, numPets: n },
    }));
  }, []);

  const setEventsAllowed = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, eventsAllowed: v },
    }));
  }, []);

  const setSmokingAllowed = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, smokingAllowed: v },
    }));
  }, []);

  const setCommercialPhotographyAllowed = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, commercialPhotographyAllowed: v },
    }));
  }, []);

  const setGuestNumber = useCallback((n: number) => {
    setForm((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, guestNumber: n },
    }));
  }, []);

  const setQuietEnabled = useCallback((v: boolean) => {
    setForm((prev) => ({
      ...prev,
      quietHours: { ...prev.quietHours, isEnabled: v },
    }));
  }, []);

  const setQuietStartId = useCallback((id: number | null) => {
    setForm((prev) => ({
      ...prev,
      quietHours: { ...prev.quietHours, startId: id },
    }));
  }, []);

  const setQuietEndId = useCallback((id: number | null) => {
    setForm((prev) => ({
      ...prev,
      quietHours: { ...prev.quietHours, endId: id },
    }));
  }, []);

  const setCheckinStartId = useCallback((id: number | null) => {
    setForm((prev) => ({
      ...prev,
      checkInOut: { ...prev.checkInOut, checkInStartId: id },
    }));
  }, []);

  const setCheckinEndId = useCallback((id: number | null) => {
    setForm((prev) => ({
      ...prev,
      checkInOut: { ...prev.checkInOut, checkInEndId: id },
    }));
  }, []);

  const setCheckoutId = useCallback((id: number | null) => {
    setForm((prev) => ({
      ...prev,
      checkInOut: { ...prev.checkInOut, checkoutId: id },
    }));
  }, []);

  const setAdditionalRulesText = useCallback((txt: string) => {
    setForm((prev) => ({ ...prev, additionalRulesText: txt }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    const a = form,
      b = baseline;
    return JSON.stringify(a) !== JSON.stringify(b);
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    setPetsAllowed,
    setNumPets,
    setEventsAllowed,
    setSmokingAllowed,
    setCommercialPhotographyAllowed,
    setGuestNumber,
    setQuietEnabled,
    setQuietStartId,
    setQuietEndId,
    setCheckinStartId,
    setCheckinEndId,
    setCheckoutId,
    setAdditionalRulesText,
  };
}
