// src/features/edit-listing/subtexts/_i18n.ts
type Dict = Record<string, string>;

export const makeTranslator =
  (dict: Dict) =>
  (key: string): string => {
    const val = key
      .split('.')
      .reduce<unknown>(
        (acc, k) =>
          acc && typeof acc === 'object' && k in acc
            ? (acc as Record<string, unknown>)[k]
            : undefined,
        dict
      );
    return typeof val === 'string' ? val : key; // fallback
  };

// Claves válidas del bloque de grupos (para type-guard estricto si lo quieres)
export const GROUP_KEYS = [
  'APARTMENT',
  'HOUSE',
  'SECONDARY_UNIT',
  'UNIQUE_SPACE',
  'BED_AND_BREAKFAST',
  'BOUTIQUE_HOTEL',
] as const;
export type GroupKey = (typeof GROUP_KEYS)[number];

export const isGroupKey = (k: string): k is GroupKey =>
  (GROUP_KEYS as readonly string[]).includes(k);

// Mapeo nombre EN -> clave enum i18n
export const GROUP_NAME_TO_KEY: Record<string, GroupKey> = {
  Apartment: 'APARTMENT',
  House: 'HOUSE',
  'Secondary Unit': 'SECONDARY_UNIT',
  'Unique Space': 'UNIQUE_SPACE',
  'Bed and breakfast': 'BED_AND_BREAKFAST',
  'Boutique Hotel': 'BOUTIQUE_HOTEL',
};

// Fallback para nombres inesperados
export const fallbackNameToKey = (name: string) =>
  name
    .trim()
    .toUpperCase()
    .replace(/&/g, 'AND')
    .replace(/[\s-]+/g, '_');
