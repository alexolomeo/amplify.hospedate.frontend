import { YOUR_PLACE_STEP_MAP } from './yourPlaceSteps';
import { ARRIVAL_STEP_MAP } from './arrivalSteps';
import { PREFERENCE_STEP_MAP } from './preferenceSteps';

export type StepSlug = keyof typeof YOUR_PLACE_STEP_MAP;
export type ArrivalStepSlug = keyof typeof ARRIVAL_STEP_MAP;
export type PreferenceStepSlug = keyof typeof PREFERENCE_STEP_MAP;
export const PREVIEW_STEP_MAP = { preview: 0 } as const;

export type Slug = StepSlug | ArrivalStepSlug | PreferenceStepSlug;

export function isValidSlug(slug: string): slug is Slug {
  return (
    slug in YOUR_PLACE_STEP_MAP ||
    slug in ARRIVAL_STEP_MAP ||
    slug in PREFERENCE_STEP_MAP ||
    slug in PREVIEW_STEP_MAP
  );
}
