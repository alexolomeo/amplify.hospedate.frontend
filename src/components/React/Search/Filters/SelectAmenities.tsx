import type { Amenity } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useEffect, useState } from 'react';
import AppIcon from '../../Common/AppIcon';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';
import ChevronUpIcon from '/src/icons/chevron-up.svg?react';

interface Props {
  amenities: Amenity[];
  selectId: string[];
  lang?: SupportedLanguages;
  onUpdateAmenities: (ids: string[]) => void;
}

export default function SelectAmenities({
  amenities,
  lang = 'es',
  onUpdateAmenities,
  selectId,
}: Props) {
  const t = getTranslation(lang);
  const [selectedAmenities, setSelectedAmenities] =
    useState<string[]>(selectId);
  const [showAllGroups, setShowAllGroups] = useState(false);
  const groups: Record<string, Amenity[]> = {};
  amenities.forEach((amenity) => {
    const group = amenity.amenityGroup;
    groups[group] ??= [];
    groups[group].push(amenity);
  });
  const groupNames = Object.keys(groups).sort();
  const hasMoreThanOneGroup = groupNames.length > 1;
  const firstGroupName = groupNames[0];
  const groupsToDisplay = showAllGroups ? groupNames : [firstGroupName];

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(
      (prev) =>
        prev.includes(id)
          ? prev.filter((amenityId) => amenityId !== id) // Unselect
          : [...prev, id] // Select
    );
  };

  useEffect(() => {
    onUpdateAmenities(selectedAmenities);
  }, [selectedAmenities, onUpdateAmenities]);

  useEffect(() => {
    setSelectedAmenities(selectId);
  }, [selectId]);

  return (
    <div className="mx-auto w-full space-y-3">
      <p
        className="text-sm font-bold"
        data-testid="test-filter-amenities-title"
      >
        {t.filter.amenities}
      </p>
      {groupsToDisplay.map((groupName) => (
        <div
          key={groupName}
          data-testid={`test-amenity-group-${groupName.toLowerCase().replace(/\s/g, '-')}`}
        >
          <h3
            className="pb-2 text-sm"
            data-testid={`test-amenity-group-title-${groupName.toLowerCase().replace(/\s/g, '-')}`}
          >
            {translate(t, `amenityGroups.${groupName}`)}
          </h3>

          <ul className="flex flex-wrap gap-2">
            {groups[groupName].map((type) => {
              const isSelected = selectedAmenities.includes(type.id);
              return (
                <button
                  key={type.id}
                  className={
                    isSelected
                      ? 'btn btn-secondary btn-sm flex cursor-pointer items-center gap-x-1 rounded-full text-xs font-normal'
                      : 'btn btn-secondary btn-sm btn-outline flex cursor-pointer items-center gap-x-1 rounded-full text-xs font-normal'
                  }
                  onClick={() => toggleAmenity(type.id)}
                  data-testid={`test-amenity-button-${type.id}`}
                >
                  <AppIcon
                    iconName={type.icon}
                    folder="amenities"
                    className="h-3 w-3"
                  />
                  {translate(t, `amenities.${type.icon}`)}
                </button>
              );
            })}
          </ul>
        </div>
      ))}
      {/* Show More/Less Button */}
      {hasMoreThanOneGroup && (
        <div className="flex justify-start">
          <button
            onClick={() => setShowAllGroups((prev) => !prev)}
            data-testid="test-show-more-less-button"
            className="text-primary flex cursor-pointer items-center gap-x-1 p-0 text-sm font-normal"
          >
            {showAllGroups ? t.filter.showLess : t.filter.showMore}{' '}
            {showAllGroups ? (
              <ChevronUpIcon className="h-3 w-3"></ChevronUpIcon>
            ) : (
              <ChevronDownIcon className="h-4 w-4"></ChevronDownIcon>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
