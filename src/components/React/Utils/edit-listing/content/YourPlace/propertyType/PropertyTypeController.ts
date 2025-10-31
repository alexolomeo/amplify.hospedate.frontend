import type {
  SectionController,
  Unsubscribe,
  FieldErrors as ControllerFieldErrors,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type { PropertyTypeFormNormalized } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import { toPropertyTypePayload } from '@/components/React/Utils/edit-listing/content/YourPlace/propertyType/propertyTypeAdapter';
import {
  validatePropertyTypeForm,
  type PropertyTypeValidationMessages,
} from './propertyTypeValidators';

type Watcher<T> = Set<(v: T) => void>;

export function createPropertyTypeController(params: {
  slug: Slug;
  readOnly: boolean;
  getNormalized: () => PropertyTypeFormNormalized;
  isDirty: () => boolean;
  reset: () => void;
  messages: PropertyTypeValidationMessages;
  setExternalErrors: (errs: ControllerFieldErrors | null) => void;
  getIsValid: () => boolean;
}): SectionController {
  const {
    slug,
    readOnly,
    getNormalized,
    isDirty,
    reset,
    messages,
    setExternalErrors,
    getIsValid,
  } = params;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(ws: Watcher<T>, v: T): void => {
    ws.forEach((fn) => fn(v));
  };

  const validate = (): ControllerValidationResult => {
    if (readOnly) return { ok: true };

    const normalized = getNormalized();
    const res = validatePropertyTypeForm(normalized, messages);
    if (res.ok) {
      setExternalErrors(null);
      publish(validWatchers, true);
      return { ok: true };
    }
    setExternalErrors(res.errors);
    publish(validWatchers, false);
    return { ok: false, errors: res.errors };
  };

  return {
    getSlug(): Slug {
      return slug;
    },

    isDirty(): boolean {
      return !readOnly && isDirty();
    },

    validate,

    buildPatch() {
      const normalized = getNormalized();
      return toPropertyTypePayload(normalized);
    },

    discard(): void {
      reset();
      setExternalErrors(null);
      publish(dirtyWatchers, false);
      publish(validWatchers, true);
    },

    applyServerErrors(errors: ControllerFieldErrors): void {
      setExternalErrors(errors);
      publish(validWatchers, false);
    },

    supportsFooterSave(): boolean {
      return !readOnly;
    },

    watchDirty(cb: (dirty: boolean) => void): Unsubscribe {
      dirtyWatchers.add(cb);
      cb(!readOnly && isDirty());
      return () => {
        dirtyWatchers.delete(cb);
      };
    },

    watchValidity(cb: (valid: boolean) => void): Unsubscribe {
      validWatchers.add(cb);
      const initialValid = readOnly ? true : getIsValid();
      cb(initialValid);
      return () => {
        validWatchers.delete(cb);
      };
    },
  };
}
