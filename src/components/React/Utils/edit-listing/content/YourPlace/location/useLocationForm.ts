import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LocationForm } from './locationValidators';
import { formatCoordsForBackend } from '@/components/React/Utils/location';

export type UseLocationForm = {
  form: LocationForm;
  isDirty: boolean;
  reset: () => void;
  setAddress: (v: string) => void;
  setApt: (v: string) => void;
  setCity: (v: string) => void;
  setStateText: (v: string) => void;
  setShowExact: (v: boolean) => void;
  setPrivacy: (v: boolean) => void;
  setCoordinates: (lat: number, lng: number) => void;
};

export function useLocationForm(initial: LocationForm): UseLocationForm {
  const [form, setForm] = useState<LocationForm>(initial);
  const [baseline, setBaseline] = useState<LocationForm>(initial);

  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setAddress = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, address: v }));
  }, []);
  const setApt = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, apt: v }));
  }, []);
  const setCity = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, city: v }));
  }, []);
  const setStateText = useCallback((v: string) => {
    setForm((prev) => ({ ...prev, state: v }));
  }, []);
  const setShowExact = useCallback((v: boolean) => {
    setForm((prev) => ({ ...prev, showExact: v }));
  }, []);
  const setPrivacy = useCallback((v: boolean) => {
    setForm((prev) => ({ ...prev, addressPrivacyOnCancel: v }));
  }, []);

  const setCoordinates = useCallback((lat: number, lng: number) => {
    const formatted = formatCoordsForBackend({ latitude: lat, longitude: lng });
    setForm((prev) => ({
      ...prev,
      coordinates: {
        latitude: formatted.latitude,
        longitude: formatted.longitude,
      },
    }));
  }, []);

  const isDirty = useMemo<boolean>(() => {
    return JSON.stringify(form) !== JSON.stringify(baseline);
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    setAddress,
    setApt,
    setCity,
    setStateText,
    setShowExact,
    setPrivacy,
    setCoordinates,
  };
}
