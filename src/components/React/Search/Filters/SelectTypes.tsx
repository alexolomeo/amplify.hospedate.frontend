import type { PropertyType, ReservationOption } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import { useEffect, useState } from 'react';
import AppIcon from '../../Common/AppIcon';

interface Props {
  types: PropertyType[] | ReservationOption[];
  lang?: SupportedLanguages;
  title: string;
  onUpdateTypes: (ids: string[]) => void;
  folder: string;
  selectId: string[];
  featureTypes: string;
}

export default function SelectTypes({
  types,
  title,
  onUpdateTypes,
  selectId,
  folder,
  lang = 'es',
  featureTypes,
}: Props) {
  const [selectTypes, setSelectTypes] = useState<string[]>(selectId);
  const t = getTranslation(lang);

  const toggleAmenity = (id: string) => {
    setSelectTypes((prev) =>
      prev.includes(id)
        ? prev.filter((amenityId) => amenityId !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    onUpdateTypes(selectTypes);
  }, [selectTypes, onUpdateTypes]);

  useEffect(() => {
    setSelectTypes(selectId);
  }, [selectId]);

  return (
    <div className="mx-auto w-full space-y-3">
      <p className="text-sm font-bold">{title}</p>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const isSelected = selectTypes.includes(type.id);
          return (
            <button
              key={type.name}
              className={
                isSelected
                  ? 'btn btn-secondary btn-sm flex cursor-pointer items-center gap-x-1 rounded-full text-xs font-normal'
                  : 'btn btn-secondary btn-sm btn-outline flex cursor-pointer items-center gap-x-1 rounded-full text-xs font-normal'
              }
              onClick={() => toggleAmenity(type.id)}
            >
              <AppIcon
                iconName={type.icon}
                folder={folder}
                className="h-3 w-3"
              />
              {translate(t, `${featureTypes}.${type.icon}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
