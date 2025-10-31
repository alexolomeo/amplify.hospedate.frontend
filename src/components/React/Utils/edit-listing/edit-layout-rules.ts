import type { Slug } from './slugs';
import { YOUR_PLACE_STEP_MAP } from './yourPlaceSteps';
import { ARRIVAL_STEP_MAP } from './arrivalSteps';
import { PREFERENCE_STEP_MAP } from './preferenceSteps';
import type { LayoutMode } from './edit-layout';

export function getLayoutModeForSlug(slug: Slug): LayoutMode {
  if (slug === 'overview') return 'SIDEBAR_ONLY';
  if (slug === 'photo-gallery') return 'SIDEBAR_ONLY';
  if (slug === 'amenities') return 'SIDEBAR_ONLY';
  if (slug === 'preview') return 'FULL_WIDTH';
  if (slug === 'listing-state') return 'SIDEBAR_ONLY';

  if (slug in ARRIVAL_STEP_MAP) return 'FULL';

  if (slug in PREFERENCE_STEP_MAP) return 'FULL';

  if (slug in YOUR_PLACE_STEP_MAP) return 'FULL';

  return 'FULL';
}
