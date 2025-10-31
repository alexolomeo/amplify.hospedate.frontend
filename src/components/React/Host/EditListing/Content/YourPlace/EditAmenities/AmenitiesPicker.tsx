import AppButton from '@/components/React/Common/AppButton';
import AppIcon from '@/components/React/Common/AppIcon';
import CheckIcon from '/src/icons/check-mini.svg?react';
import PlusIcon from '/src/icons/plus.svg?react';
import { useEffect, useMemo, useState } from 'react';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  selectors: CatalogsSelectors;
  query: string;
  selectedAmenityIds: number[];
  onToggleAmenity: (id: number) => void;
  translateAmenityLabel: (icon: string) => string;
  translateAmenityGroupLabel: (name: string) => string;
  lang?: SupportedLanguages;
}

export function AmenitiesPicker({
  selectors,
  query,
  selectedAmenityIds,
  onToggleAmenity,
  translateAmenityLabel,
  translateAmenityGroupLabel,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const allLabel = t.hostContent.editListing.content.amenities.allLabel;
  function uniqueById<T extends { id: number }>(items: T[]): T[] {
    const seen = new Set<number>();
    const out: T[] = [];
    for (const it of items) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    }
    return out;
  }

  const allAmenities = useMemo(
    () => uniqueById(selectors.amenityGroups.flatMap((g) => g.amenities)),
    [selectors.amenityGroups]
  );

  const groupsWithAll = useMemo(
    () => [
      { id: 0, name: allLabel, amenities: allAmenities },
      ...selectors.amenityGroups,
    ],
    [selectors.amenityGroups, allAmenities, allLabel]
  );

  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

  useEffect(() => {
    const exists = groupsWithAll.some((g) => g.id === selectedGroupId);
    if (!exists) setSelectedGroupId(0);
  }, [groupsWithAll, selectedGroupId]);

  const selectedGroup = useMemo(
    () =>
      groupsWithAll.find((g) => g.id === selectedGroupId) ?? groupsWithAll[0],
    [groupsWithAll, selectedGroupId]
  );

  const visibleAmenities = useMemo(() => {
    const pool = selectedGroup?.amenities ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((a) => {
      const translated = translateAmenityLabel(a.icon).toLowerCase();
      return a.name.toLowerCase().includes(q) || translated.includes(q);
    });
  }, [selectedGroup, query, translateAmenityLabel]);

  const isSelected = (id: number) => selectedAmenityIds.includes(id);

  return (
    <div>
      {/* Tabs*/}
      <div className="hide-scrollbar -mx-2 flex flex-nowrap overflow-x-auto pb-4">
        {groupsWithAll.map((group) => {
          const label =
            group.id === 0 ? allLabel : translateAmenityGroupLabel(group.name);
          return (
            <AppButton
              key={group.id}
              size="sm"
              label={label}
              className="mx-2 transition-all duration-200"
              outline={selectedGroupId !== group.id}
              onClick={() => setSelectedGroupId(group.id)}
            />
          );
        })}
      </div>

      <div className="border-base-200 border-b" />

      <h2 className="my-4 text-lg font-semibold">
        {selectedGroup?.id === 0
          ? allLabel
          : translateAmenityGroupLabel(selectedGroup?.name ?? '')}
      </h2>

      {/* List*/}
      <div className="flex flex-col gap-3">
        {visibleAmenities.map((amenity) => (
          <div key={amenity.id} className="flex justify-between">
            <div className="flex items-center justify-center gap-2">
              <AppIcon
                iconName={amenity.icon}
                folder="amenities"
                className="text-secondary h-6 w-6"
                loaderCompact
              />
              <p className="text-sm">{translateAmenityLabel(amenity.icon)}</p>
            </div>
            <button
              onClick={() => onToggleAmenity(amenity.id)}
              className={`btn btn-xs btn-circle transition-all duration-200 ${
                isSelected(amenity.id)
                  ? 'btn-primary transform shadow-md'
                  : 'btn-base-200 hover:shadow-sm'
              }`}
            >
              {isSelected(amenity.id) ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <PlusIcon className="text-primary h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
