import { useMemo, useCallback, useEffect, useState } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
//import PlusIcon from '/src/icons/plus.svg?react';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import SearchIcon from '/src/icons/search.svg?react';
import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';
import { SelectedAmenitiesList } from './SelectedAmenitiesList';
import { AmenitiesPicker } from './AmenitiesPicker';
import { translateAmenity } from '@/utils/translateAmenity';
import { translateAmenityGroup } from '@/utils/translateAmenityGroup';

interface Props {
  selectors: CatalogsSelectors;
  lang?: SupportedLanguages;
  initialSelectedAmenityIds?: number[];
}

export default function EditAmenities({
  selectors,
  lang = 'es',
  initialSelectedAmenityIds = [],
}: Props) {
  const t = getTranslation(lang);
  const trAmenity = (icon: string) => translateAmenity(icon, t);
  const trAmenityGroup = (name: string) => translateAmenityGroup(name, t);

  const [isEditing, setIsEditing] = useState(false);
  const [query, setQuery] = useState('');

  const allAmenities = useMemo(() => {
    const seen = new Set<number>();
    const out: { id: number; name: string; icon: string }[] = [];
    for (const g of selectors.amenityGroups) {
      for (const a of g.amenities) {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          out.push(a);
        }
      }
    }
    return out;
  }, [selectors.amenityGroups]);

  const allAmenityIds = useMemo(
    () => new Set(allAmenities.map((a) => a.id)),
    [allAmenities]
  );

  const normalizeIds = useCallback(
    (ids: number[]) => {
      const uniq: number[] = [];
      const seen = new Set<number>();
      for (const id of ids) {
        if (!seen.has(id) && allAmenityIds.has(id)) {
          seen.add(id);
          uniq.push(id);
        }
      }
      return uniq;
    },
    [allAmenityIds]
  );

  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>(() =>
    normalizeIds(initialSelectedAmenityIds)
  );

  useEffect(() => {
    const next = normalizeIds(initialSelectedAmenityIds);

    const sameLength =
      selectedAmenityIds.length === next.length &&
      selectedAmenityIds.every((v, i) => v === next[i]);

    if (!sameLength) {
      setSelectedAmenityIds(next);
    }
  }, [initialSelectedAmenityIds, normalizeIds, selectedAmenityIds]);

  const toggleAmenity = (id: number) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      {isEditing ? (
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(false)}
              className="cursor-pointer"
            >
              <ChevronLeftIcon />
            </button>
            <h1 className="edit-listing-title">
              {t.hostContent.editListing.content.amenities.addTitle}
            </h1>
          </div>
          <label className="focus-within:ring-primary flex h-7 max-w-64 items-center gap-2 rounded-full border border-gray-300 px-4 focus-within:ring-1">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                t.hostContent.editListing.content.amenities.searchPlaceholder
              }
              className="w-full text-sm outline-none placeholder:text-sm"
            />
            <SearchIcon className="h-4 w-4" />
          </label>
        </div>
      ) : (
        <div className="flex justify-between">
          <h1 className="edit-listing-title">
            {t.hostContent.editListing.content.amenities.title}
          </h1>
          {/* <button
            onClick={() => setIsEditing(true)}
            className="btn btn-outline btn-secondary btn-sm flex gap-2 rounded-full"
          >
            {t.hostContent.editListing.content.amenities.edit}
            <PlusIcon className="h-4 w-4" />
          </button> */}
        </div>
      )}

      {isEditing ? (
        <AmenitiesPicker
          selectors={selectors}
          query={query}
          selectedAmenityIds={selectedAmenityIds}
          onToggleAmenity={toggleAmenity}
          translateAmenityLabel={trAmenity}
          translateAmenityGroupLabel={trAmenityGroup}
          lang={lang}
        />
      ) : (
        <SelectedAmenitiesList
          title={t.hostContent.editListing.content.amenities.offeredAmenities}
          allAmenities={allAmenities}
          selectedAmenityIds={selectedAmenityIds}
          translateAmenityLabel={trAmenity}
        />
      )}
    </div>
  );
}
