import type {
  SectionController,
  Unsubscribe,
  FieldErrors as ControllerFieldErrors,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import { toPricePayload } from './priceAdapters';
import type { PriceNormalized } from './priceAdapters';

type Watcher<T> = Set<(value: T) => void>;

export function createPriceController(params: {
  slug: Slug; // 'price'
  readOnly: boolean;
  getNormalized: () => PriceNormalized;
  isDirty: () => boolean;
  reset: () => void;
  setExternalErrors: (errs: ControllerFieldErrors | null) => void;
  getIsValid: () => boolean;
}): SectionController {
  const {
    slug,
    readOnly,
    getNormalized,
    isDirty,
    reset,
    setExternalErrors,
    getIsValid,
  } = params;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(watchers: Watcher<T>, v: T): void => {
    watchers.forEach((fn) => fn(v));
  };

  const validate = (): ControllerValidationResult => {
    if (readOnly) {
      publish(validWatchers, true);
      return { ok: true };
    }
    const ok = getIsValid();
    publish(validWatchers, ok);
    return ok ? { ok: true } : { ok: false, errors: {} };
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
      return toPricePayload(getNormalized());
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
      cb(readOnly ? true : getIsValid());
      return () => {
        validWatchers.delete(cb);
      };
    },
  };
}
