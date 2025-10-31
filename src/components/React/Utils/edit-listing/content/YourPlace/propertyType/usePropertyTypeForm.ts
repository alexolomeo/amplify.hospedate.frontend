import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  PropertyTypeForm,
  PropertyTypeFormNormalized,
} from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import { normalizeForm } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';

export function usePropertyTypeForm(
  initial: PropertyTypeForm,
  selectors: CatalogsSelectors
) {
  const [form, setForm] = useState<PropertyTypeForm>(initial);
  const [baseline, setBaseline] = useState<PropertyTypeForm>(initial);

  // Rehydrate if initial changes
  useEffect(() => {
    setBaseline(initial);
    setForm(initial);
  }, [initial]);

  const setGroupId = useCallback(
    (id: number | null) => {
      setForm((prev) => {
        let nextTypeId: number | null = prev.typeId;
        if (id === null) {
          nextTypeId = null;
        } else {
          const grp =
            selectors.propertyTypeGroups.find((g) => g.id === id) ?? null;
          const stillValid =
            grp?.propertyTypes.some(
              (pt) => pt.id === (prev.typeId as number)
            ) ?? false;
          if (!stillValid) nextTypeId = null;
        }
        return { ...prev, groupId: id, typeId: nextTypeId };
      });
    },
    [selectors.propertyTypeGroups]
  );

  const setTypeId = useCallback((id: number | null) => {
    setForm((prev) => ({ ...prev, typeId: id }));
  }, []);

  const setFloorNumber = useCallback((n: number) => {
    setForm((prev) => ({ ...prev, floorNumber: n }));
  }, []);

  const setYearBuiltRaw = useCallback((raw: string) => {
    setForm((prev) => ({ ...prev, yearBuiltRaw: raw }));
  }, []);

  const setSizeRaw = useCallback((raw: string) => {
    setForm((prev) => ({ ...prev, sizeRaw: raw }));
  }, []);

  const setUnitId = useCallback((id: string | null) => {
    setForm((prev) => ({ ...prev, unitId: id }));
  }, []);

  const getNormalized = useCallback((): PropertyTypeFormNormalized => {
    return normalizeForm(form);
  }, [form]);

  const isDirty = useMemo<boolean>(() => {
    const a = normalizeForm(form);
    const b = normalizeForm(baseline);

    const eq = (x: unknown, y: unknown): boolean => {
      if (Number.isNaN(x as number) && Number.isNaN(y as number)) return true;
      return (x ?? null) === (y ?? null);
    };

    return !(
      eq(a.groupId, b.groupId) &&
      eq(a.typeId, b.typeId) &&
      eq(a.floorNumber, b.floorNumber) &&
      eq(a.yearBuilt, b.yearBuilt) &&
      eq(a.propertySize, b.propertySize) &&
      eq(a.unitId, b.unitId)
    );
  }, [form, baseline]);

  const reset = useCallback(() => {
    setForm(baseline);
  }, [baseline]);

  return {
    form,
    isDirty,
    reset,
    getNormalized,
    setGroupId,
    setTypeId,
    setFloorNumber,
    setYearBuiltRaw,
    setSizeRaw,
    setUnitId,
  };
}
