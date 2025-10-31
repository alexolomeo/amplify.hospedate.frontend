import type { ArrivalStepSlug } from './arrivalSteps';
import type { PreferenceStepSlug } from './preferenceSteps';
import type { StepSlug } from './yourPlaceSteps';

export type CombinedSlug =
  | StepSlug
  | ArrivalStepSlug
  | PreferenceStepSlug
  | 'photo-gallery/photos' //all photos
  | `photo-gallery/${string}` // show a space
  | `photo-gallery/${string}/space-photo/${string}`; // show a photo
