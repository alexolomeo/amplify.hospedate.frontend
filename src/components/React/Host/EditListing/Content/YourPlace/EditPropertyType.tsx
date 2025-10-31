import { useEffect, useMemo, useState } from 'react';
import DropdownV2, { type Option } from '@/components/React/Common/DropdownV2';
import QuantitySelector from '@/components/React/Common/QuantitySelector';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';
import type { SectionController } from '@/components/React/Utils/edit-listing/section-controller';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';

import {
  toPropertyTypeForm,
  type PropertyTypeForm,
} from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import { usePropertyTypeForm } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/usePropertyTypeForm';
import { createPropertyTypeController } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/PropertyTypeController';
import {
  validatePropertyTypeForm,
  type PropertyTypeValidationMessages,
} from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeValidators';

import { toKeyIn } from '@/components/React/Utils/edit-listing/keyify';

type Props = {
  selectors: CatalogsSelectors;
  lang?: SupportedLanguages;
  initialValues: ListingEditorValues | null;
  onRegisterController: (ctrl: SectionController | null) => () => void;
};

export default function EditPropertyType({
  selectors,
  lang = 'es',
  initialValues,
  onRegisterController,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  // --- Validations
  const messages = useMemo<PropertyTypeValidationMessages>(
    () => ({
      requiredGroup:
        t.hostContent.editListing.content.editPropertyType.validation
          .requiredGroup,
      requiredType:
        t.hostContent.editListing.content.editPropertyType.validation
          .requiredType,
      floorsMin:
        t.hostContent.editListing.content.editPropertyType.validation.floorsMin,
      floorsMax:
        t.hostContent.editListing.content.editPropertyType.validation.floorsMax,
      yearRange:
        t.hostContent.editListing.content.editPropertyType.validation.yearRange,
      sizePositive:
        t.hostContent.editListing.content.editPropertyType.validation
          .sizePositive,
      sizeMaxTwoDecimals:
        t.hostContent.editListing.content.editPropertyType.validation
          .sizeMaxTwoDecimals,
      sizeMaxIntegerDigits:
        t.hostContent.editListing.content.editPropertyType.validation
          .sizeMaxIntegerDigits,
      unitRequired:
        t.hostContent.editListing.content.editPropertyType.validation
          .unitRequired,
      sizeRequiredIfUnit:
        t.hostContent.editListing.content.editPropertyType.validation
          .sizeRequiredIfUnit,
    }),
    [t.hostContent.editListing.content.editPropertyType.validation]
  );

  // --- i18n: mappings
  const groupsMap = t.hostContent.editListing.content.editPropertyType
    .groups as Record<string, string>;
  const typesMap = t.hostContent.editListing.content.editPropertyType
    .types as Record<string, string>;
  const sizeUnitsDict = t.hostContent.editListing.content.editPropertyType
    .sizeUnits as Record<string, string>;

  // --- Adapter
  const initialForm: PropertyTypeForm = useMemo(
    () => toPropertyTypeForm(initialValues, selectors),
    [initialValues, selectors]
  );

  // --- Form + setters
  const {
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
  } = usePropertyTypeForm(initialForm, selectors);

  // --- Errors
  const [externalErrors, setExternalErrors] = useState<Record<
    string,
    string
  > | null>(null);

  // --- Watchers
  const getIsValid = useMemo(() => {
    return () => validatePropertyTypeForm(getNormalized(), messages).ok;
  }, [getNormalized, messages]);

  // --- Controller
  const controller = useMemo<SectionController>(() => {
    return createPropertyTypeController({
      slug: 'property-type',
      readOnly: isReadOnly,
      getNormalized,
      isDirty: () => isDirty,
      reset,
      messages,
      setExternalErrors,
      getIsValid,
    });
  }, [isReadOnly, getNormalized, reset, messages, getIsValid, isDirty]);

  useEffect(() => {
    const cleanup = onRegisterController(controller);
    return cleanup;
  }, [controller, onRegisterController]);

  const groupOptions: Option<number>[] = useMemo(() => {
    return selectors.propertyTypeGroups.map((g) => {
      const key = toKeyIn(g.name, groupsMap);
      const label = key ? groupsMap[key] : g.name;
      return { value: g.id, label };
    });
  }, [selectors.propertyTypeGroups, groupsMap]);

  const typeOptions: Option<number>[] = useMemo(() => {
    if (form.groupId === null) return [];

    const grp = selectors.propertyTypeGroups.find((g) => g.id === form.groupId);
    if (!grp) return [];

    return grp.propertyTypes.map((pt) => {
      const key = toKeyIn(pt.name, typesMap);
      const label = key ? typesMap[key] : pt.name;
      return { value: pt.id, label };
    });
  }, [form.groupId, selectors.propertyTypeGroups, typesMap]);

  const unitOptions: Option<string>[] = useMemo(() => {
    return selectors.propertySizeUnits.map((u) => ({
      value: u.id,
      label: sizeUnitsDict[u.id] ?? u.id,
    }));
  }, [selectors.propertySizeUnits, sizeUnitsDict]);

  const clientValidation = useMemo(
    () => validatePropertyTypeForm(getNormalized(), messages),
    [getNormalized, messages]
  );
  const clientErrors = clientValidation.ok ? null : clientValidation.errors;
  const mergedErrors = externalErrors ?? clientErrors;

  return (
    <section className="flex flex-col gap-8 pb-12">
      <h2 className="text-base-content text-xl font-semibold">
        {t.hostContent.editListing.content.editPropertyType.stepTitle}
      </h2>

      {/* Group */}
      <div className="flex w-full flex-col gap-1">
        <label className="px-4 text-sm text-[var(--color-neutral)]">
          {t.hostContent.editListing.content.editPropertyType.descriptionLabel}
        </label>
        <DropdownV2
          options={groupOptions}
          value={form.groupId}
          onChange={(v) => {
            if (!isReadOnly) setGroupId(v);
          }}
          placeholder={
            t.hostContent.editListing.content.editPropertyType
              .descriptionPlaceholder
          }
          buttonHeight="h-10"
          disabled={isReadOnly}
        />
        {!isReadOnly && mergedErrors?.groupId && (
          <p className="text-error mt-1 px-4 text-sm">{mergedErrors.groupId}</p>
        )}
      </div>

      {/* Type */}
      <div className="flex w-full flex-col gap-1">
        <label className="px-4 text-sm text-[var(--color-neutral)]">
          {t.hostContent.editListing.content.editPropertyType.propertyTypeLabel}
        </label>
        <DropdownV2
          options={typeOptions}
          value={form.typeId}
          onChange={(v) => {
            if (!isReadOnly) setTypeId(v);
          }}
          placeholder={
            t.hostContent.editListing.content.editPropertyType
              .propertyTypePlaceholder
          }
          buttonHeight="h-10"
          disabled={isReadOnly || form.groupId === null}
        />
        {!isReadOnly && mergedErrors?.typeId && (
          <p className="text-error mt-1 px-4 text-sm">{mergedErrors.typeId}</p>
        )}
      </div>

      {/* Floors */}
      <div className="w-full px-4">
        <QuantitySelector
          title={t.hostContent.editListing.content.editPropertyType.floorsLabel}
          value={form.floorNumber}
          onIncrement={() => {
            if (!isReadOnly)
              setFloorNumber(Math.min(300, form.floorNumber + 1));
          }}
          onDecrement={() => {
            if (!isReadOnly) setFloorNumber(Math.max(1, form.floorNumber - 1));
          }}
          min={1}
          max={300}
          titleClassName="text-sm text-[var(--color-neutral)]"
          buttonSizeClass="w-4 h-8"
          disabled={isReadOnly}
        />
        {!isReadOnly && mergedErrors?.floorNumber && (
          <p className="text-error mt-1 px-4 text-sm">
            {mergedErrors.floorNumber}
          </p>
        )}
      </div>

      {/* Year built */}
      <div className="flex w-full flex-col gap-1">
        <label className="px-3 text-sm text-[var(--color-neutral)]">
          {t.hostContent.editListing.content.editPropertyType.yearBuiltLabel}
        </label>
        <input
          type="number"
          placeholder={
            t.hostContent.editListing.content.editPropertyType
              .yearBuiltPlaceholder
          }
          className="input focus:border-primary w-full rounded-full px-4 py-2 text-base font-semibold outline-none focus:ring-0 focus:outline-none"
          value={form.yearBuiltRaw}
          onChange={(e) => {
            if (!isReadOnly) setYearBuiltRaw(e.target.value);
          }}
          readOnly={isReadOnly}
          onKeyDown={(e) => {
            const blocked = ['.', ',', 'e', 'E', '+', '-'];
            if (blocked.includes(e.key)) e.preventDefault();
          }}
          aria-readonly={isReadOnly}
          aria-invalid={!isReadOnly && Boolean(mergedErrors?.yearBuiltRaw)}
          aria-describedby={
            !isReadOnly && mergedErrors?.yearBuiltRaw ? 'year-error' : undefined
          }
        />
        {!isReadOnly && mergedErrors?.yearBuiltRaw && (
          <p id="year-error" className="text-error mt-1 px-4 text-sm">
            {mergedErrors.yearBuiltRaw}
          </p>
        )}
      </div>

      {/* Size + Unit */}
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-end gap-4">
          <div className="flex w-[clamp(200px,50%,372px)] flex-col gap-1">
            <label className="px-3 text-sm text-[var(--color-neutral)]">
              {t.hostContent.editListing.content.editPropertyType.sizeLabel}
            </label>
            <input
              type="number"
              value={form.sizeRaw}
              onChange={(e) => {
                if (!isReadOnly) setSizeRaw(e.target.value);
              }}
              placeholder={
                t.hostContent.editListing.content.editPropertyType
                  .sizePlaceholder
              }
              readOnly={isReadOnly}
              aria-readonly={isReadOnly}
              aria-invalid={
                !isReadOnly &&
                Boolean(mergedErrors?.sizeRaw || mergedErrors?.unitId)
              }
              aria-describedby={
                !isReadOnly && (mergedErrors?.sizeRaw || mergedErrors?.unitId)
                  ? 'size-unit-error'
                  : undefined
              }
              className="input focus:border-primary w-full rounded-full px-4 py-2 text-base leading-6 font-semibold outline-none focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex flex-1 flex-col">
            <label className="sr-only">
              {
                t.hostContent.editListing.content.editPropertyType
                  .sizeUnitPlaceholder
              }
            </label>
            <DropdownV2
              options={unitOptions}
              value={form.unitId}
              onChange={(v) => {
                if (!isReadOnly) setUnitId(v);
              }}
              placeholder={
                t.hostContent.editListing.content.editPropertyType
                  .sizeUnitPlaceholder
              }
              className="w-full"
              buttonHeight="h-10"
              disabled={isReadOnly}
            />
          </div>
        </div>

        {!isReadOnly && (mergedErrors?.sizeRaw || mergedErrors?.unitId) && (
          <p id="size-unit-error" className="text-error mt-1 pl-3 text-sm">
            {mergedErrors.sizeRaw ?? mergedErrors.unitId ?? ''}
          </p>
        )}
      </div>
    </section>
  );
}
