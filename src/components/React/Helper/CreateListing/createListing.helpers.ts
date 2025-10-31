import {
  SLUG_TO_STEP,
  STEP_SLUGS,
} from '@/components/React/Utils/create-listing.step-slugs';
import type { CreateListingData } from '@/types/createListing';

export type StepValidationMap = Record<
  number,
  (data: CreateListingData) => boolean
>;

function hasWindow(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.location !== 'undefined'
  );
}

export function parseRequestedStepFromLocation(): number | undefined {
  if (!hasWindow()) return undefined;
  const parts = window.location.pathname.split('/').filter(Boolean);
  const slug = parts[parts.length - 1] ?? '';
  const step = SLUG_TO_STEP[slug as keyof typeof SLUG_TO_STEP];
  return Number.isFinite(step as number) ? (step as number) : undefined;
}

export function buildPath(
  listingId: string | null | undefined,
  step: number
): string {
  const slug = STEP_SLUGS[step] ?? STEP_SLUGS[0];
  const base = '/listing/create';
  return listingId ? `${base}/${listingId}/${slug}` : `${base}/${slug}`;
}

export function pushUrlIfChanged(path: string): void {
  if (!hasWindow()) return;
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
}

export function replaceUrl(path: string): void {
  if (!hasWindow()) return;
  if (window.location.pathname !== path) {
    window.history.replaceState({}, '', path);
  }
}

export function isStepValid(
  step: number,
  data: CreateListingData,
  rules: StepValidationMap
): boolean {
  const validator = rules[step];
  return typeof validator !== 'function' ? true : !!validator(data);
}

export function nearestIncompleteOrRequested(
  requested: number,
  data: CreateListingData,
  rules: StepValidationMap
): number {
  const target = Math.max(0, requested);
  for (let s = 0; s <= target; s++) {
    if (!isStepValid(s, data, rules)) return s;
  }
  return target;
}
