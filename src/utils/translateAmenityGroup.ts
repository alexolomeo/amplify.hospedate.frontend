export function translateAmenityGroup(
  groupName: string,
  t: { amenityGroups: Record<string, string> }
): string {
  return groupName in t.amenityGroups ? t.amenityGroups[groupName] : groupName;
}
