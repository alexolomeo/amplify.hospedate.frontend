import type { CatalogsSelectors } from '@/components/React/Hooks/Host/EditListing/useEditListing';

export function getAmenityIcons(
  selectors: CatalogsSelectors,
  ids: Array<number | string> | undefined | null
): string[] {
  if (!ids || ids.length === 0) return [];

  const normalizedIds = ids
    .map((id) => {
      const parsed = Number(id);
      return isNaN(parsed) ? null : parsed;
    })
    .filter((id): id is number => id !== null);

  if (normalizedIds.length === 0) return [];

  const amenityMap = new Map<number, string>();
  for (const group of selectors.amenityGroups) {
    for (const amenity of group.amenities) {
      amenityMap.set(amenity.id, amenity.icon);
    }
  }

  return normalizedIds
    .map((id) => amenityMap.get(id))
    .filter((icon): icon is string => Boolean(icon));
}
