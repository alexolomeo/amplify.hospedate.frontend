import type { PropertyTypeFormNormalized } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import { decimalParts } from '@/components/React/Utils/Validation/decimal';

export type PropertyTypeFieldErrors = {
  groupId?: string;
  typeId?: string;
  floorNumber?: string;
  yearBuiltRaw?: string;
  sizeRaw?: string;
  unitId?: string;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: PropertyTypeFieldErrors };

export type PropertyTypeValidationMessages = {
  requiredGroup: string;
  requiredType: string;
  floorsMin: string;
  floorsMax: string;
  yearRange: string;
  sizePositive: string;
  sizeMaxTwoDecimals: string;
  sizeMaxIntegerDigits: string;
  unitRequired: string;
  sizeRequiredIfUnit: string;
};

export function validatePropertyTypeForm(
  f: PropertyTypeFormNormalized,
  m: PropertyTypeValidationMessages
): ValidationResult {
  const errors: PropertyTypeFieldErrors = {};

  // group/type
  if (f.groupId === null) {
    errors.groupId = m.requiredGroup;
  }
  if (f.typeId === null) {
    errors.typeId = m.requiredType;
  }

  // floors
  if (f.floorNumber < 1) {
    errors.floorNumber = m.floorsMin;
  } else if (f.floorNumber > 300) {
    errors.floorNumber = m.floorsMax;
  }

  // yearBuilt
  if (f.yearBuilt !== null) {
    const current = new Date().getFullYear();
    if (
      !Number.isInteger(f.yearBuilt) ||
      f.yearBuilt < 1000 ||
      f.yearBuilt > current
    ) {
      errors.yearBuiltRaw = m.yearRange;
    }
  }

  // size + unit
  if (f.propertySize === null) {
    if (f.unitId !== null) {
      errors.unitId = m.sizeRequiredIfUnit;
    }
  } else if (Number.isNaN(f.propertySize as number)) {
    errors.sizeRaw = m.sizePositive;
  } else {
    const { intPart, fracPart } = decimalParts(f.propertySize as number);
    if (intPart.length > 9) {
      errors.sizeRaw = m.sizeMaxIntegerDigits;
    } else if (fracPart.length > 2) {
      errors.sizeRaw = m.sizeMaxTwoDecimals;
    } else if ((f.propertySize as number) <= 0) {
      errors.sizeRaw = m.sizePositive;
    }
    if (f.unitId === null) {
      errors.unitId = m.unitRequired;
    }
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true };
}
