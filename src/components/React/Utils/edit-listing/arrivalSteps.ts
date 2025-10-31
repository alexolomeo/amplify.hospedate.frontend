export const ARRIVAL_STEP_MAP = {
  directions: 0,
  'check-in-method': 1,
} as const;

export type ArrivalStepSlug = keyof typeof ARRIVAL_STEP_MAP;

export const arrivalSteps: { id: number; slug: ArrivalStepSlug }[] = [
  { id: 1, slug: 'directions' },
  { id: 2, slug: 'check-in-method' },
];
