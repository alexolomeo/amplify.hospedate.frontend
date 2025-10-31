import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';

export type PropertyTypeForm = {
  groupId: number | null;
  typeId: number | null;
  floorNumber: number;
  yearBuiltRaw: string;
  sizeRaw: string;
  unitId: string | null;
};

export type PropertyTypeFormNormalized = {
  groupId: number | null;
  typeId: number | null;
  floorNumber: number;
  yearBuilt: number | null;
  propertySize: number | null | typeof NaN;
  unitId: string | null;
};

export function normalizeYearBuilt(raw: string): number | null {
  const s = raw.trim();
  if (s === '') return null;
  if (!/^\d+$/.test(s)) return null;
  const n = Number.parseInt(s, 10);
  return Number.isFinite(n) ? n : null;
}

export function normalizeSize(raw: string): number | null | typeof NaN {
  const s = raw.trim();
  if (s === '') return null;
  const m = /^(\d+)(?:\.(\d+))?$/.exec(s);
  if (!m) return Number.NaN;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

/** form → normalizado */
export function normalizeForm(
  form: PropertyTypeForm
): PropertyTypeFormNormalized {
  return {
    groupId: form.groupId,
    typeId: form.typeId,
    floorNumber: form.floorNumber,
    yearBuilt: normalizeYearBuilt(form.yearBuiltRaw),
    propertySize: normalizeSize(form.sizeRaw),
    unitId: form.unitId,
  };
}

/** values → form */
export function toPropertyTypeForm(
  values: ListingEditorValues | null,
  selectors: CatalogsSelectors
): PropertyTypeForm {
  const v =
    values ??
    ({
      yourPlace: {
        propertyTypeSection: {
          propertyTypeGroup: { value: null as unknown as number },
          propertyType: { value: null as unknown as number },
          floorNumber: 1,
          yearBuilt: null,
          propertySize: null,
          propertySizeUnit: { value: null },
        },
      },
    } as unknown as ListingEditorValues);

  const section = v.yourPlace?.propertyTypeSection;

  const rawGroup: number | null = section?.propertyTypeGroup?.value ?? null;
  const rawType: number | null = section?.propertyType?.value ?? null;

  const groupId: number | null = rawGroup;
  let typeId: number | null = rawType;

  if (groupId !== null) {
    const grp =
      selectors.propertyTypeGroups.find((g) => g.id === groupId) ?? null;
    const validType =
      grp?.propertyTypes.some((pt) => pt.id === (typeId as number)) ?? false;
    if (!validType) typeId = null;
  } else {
    typeId = null;
  }

  const floorNumber: number = section?.floorNumber ?? 1;

  const yearBuiltRaw: string =
    section?.yearBuilt !== null && section?.yearBuilt !== undefined
      ? String(section.yearBuilt)
      : '';

  const sizeRaw: string =
    section?.propertySize !== null && section?.propertySize !== undefined
      ? String(section.propertySize)
      : '';

  const unitId: string | null = section?.propertySizeUnit?.value ?? null;

  return {
    groupId,
    typeId,
    floorNumber,
    yearBuiltRaw,
    sizeRaw,
    unitId,
  };
}

/** normalizado → minimun payload */
export function toPropertyTypePayload(
  normalized: PropertyTypeFormNormalized
): UpdateListingEditorPayload {
  return {
    yourPlace: {
      propertyTypeSection: {
        propertyTypeGroup: { value: normalized.groupId as number },
        propertyType: { value: normalized.typeId as number },
        floorNumber: normalized.floorNumber,
        yearBuilt: normalized.yearBuilt,
        propertySize: Number.isNaN(normalized.propertySize as number)
          ? null
          : (normalized.propertySize as number | null),
        propertySizeUnit: { value: normalized.unitId },
      },
    },
  };
}
