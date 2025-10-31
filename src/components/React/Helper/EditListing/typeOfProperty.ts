// src/features/edit-listing/subtexts/groupName.ts
import {
  GROUP_NAME_TO_KEY,
  fallbackNameToKey,
  isGroupKey,
  type GroupKey,
} from './_i18n';

export function resolveGroupKeyFromName(name?: string): GroupKey | undefined {
  if (!name) return undefined;
  return (
    GROUP_NAME_TO_KEY[name] ??
    (isGroupKey(fallbackNameToKey(name))
      ? (fallbackNameToKey(name) as GroupKey)
      : undefined)
  );
}

export function translateGroupNameFromKey(
  groupsDict: Record<string, string>,
  key?: string,
  fallback?: string
): string | undefined {
  if (!key) return fallback;
  return groupsDict[key] ?? fallback;
}
