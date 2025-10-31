import type {
  FieldErrors as ControllerFieldErrors,
  SectionController,
  Unsubscribe,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type {
  DirectionsForm,
  DirectionsValidationMessages,
} from './directionsValidators';
import { validateDirectionsForm } from './directionsValidators';
import { toDirectionsPatch } from './directionsAdapters';

type Watcher<T> = Set<(v: T) => void>;

export function createDirectionsController(params: {
  slug: Slug;
  readOnly: boolean;
  form: DirectionsForm;
  isDirty: () => boolean;
  reset: () => void;
  messages: DirectionsValidationMessages;
  setExternalErrors: (errs: ControllerFieldErrors | null) => void;
  getIsValid: () => boolean;
}): SectionController {
  const {
    slug,
    readOnly,
    form,
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
    const res = validateDirectionsForm(form, messages);
    if (res.ok) {
      setExternalErrors(null);
      publish(validWatchers, true);
      return { ok: true };
    }
    publish(validWatchers, false);
    return { ok: false, errors: res.errors };
  };

  return {
    getSlug() {
      return slug;
    },
    isDirty(): boolean {
      return !readOnly && isDirty();
    },
    validate,
    buildPatch() {
      return toDirectionsPatch(form);
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
