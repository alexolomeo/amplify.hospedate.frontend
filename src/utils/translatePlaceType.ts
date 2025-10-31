export function translatePlaceType(
  icon: string,
  t: { placeTypes: Record<string, string> }
): string {
  return t.placeTypes[icon as keyof typeof t.placeTypes] ?? icon;
}
