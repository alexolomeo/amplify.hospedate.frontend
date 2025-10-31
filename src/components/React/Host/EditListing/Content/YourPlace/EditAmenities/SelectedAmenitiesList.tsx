import AppIcon from '@/components/React/Common/AppIcon';
import { memo } from 'react';

export interface AmenityLite {
  id: number;
  name: string;
  icon: string;
}

interface Props {
  title: string;
  allAmenities: AmenityLite[];
  selectedAmenityIds: number[];
  translateAmenityLabel: (icon: string) => string;
}

export const SelectedAmenitiesList = memo(function SelectedAmenitiesList({
  title,
  allAmenities,
  selectedAmenityIds,
  translateAmenityLabel,
}: Props) {
  const byId = new Map(allAmenities.map((a) => [a.id, a]));

  return (
    <div>
      <p className="pb-6 font-bold">{title}</p>
      <div className="flex flex-col gap-3">
        {selectedAmenityIds.map((id) => {
          const amenity = byId.get(id);
          if (!amenity) return null;
          return (
            <div
              key={amenity.id}
              className="flex items-center justify-start gap-2"
            >
              <AppIcon
                iconName={amenity.icon}
                folder="amenities"
                className="text-secondary h-6 w-6"
                loaderCompact
              />
              <p className="text-sm">{translateAmenityLabel(amenity.icon)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
});
