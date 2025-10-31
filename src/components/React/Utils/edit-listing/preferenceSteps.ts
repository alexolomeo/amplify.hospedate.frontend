export const PREFERENCE_STEP_MAP = {
  'listing-state': 0,
  // 'delete-listing': 1,
} as const;

export type PreferenceStepSlug = keyof typeof PREFERENCE_STEP_MAP;

interface PreferenceStep {
  id: number;
  slug: PreferenceStepSlug;
}

export const preferenceSteps: PreferenceStep[] = [
  { id: 1, slug: 'listing-state' },
  // { id: 2, slug: 'delete-listing' },
];
