export function translateAmenity(
  icon: string,
  t: { amenities: Record<string, string> }
): string {
  return t.amenities[icon as keyof typeof t.amenities] ?? icon;
}
