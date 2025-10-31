import type {
  SectionController,
  Unsubscribe,
  FieldErrors as ControllerFieldErrors,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import {
  validateCapacityForm,
  type CapacityForm,
  type CapacityValidationMessages,
  type CapacityRules,
} from './capacityValidators';
import { toCapacityPayload } from './capacityAdapters';

type Watcher<T> = Set<(value: T) => void>;

export function createCapacityController(params: {
  slug: Slug;
  readOnly: boolean;
  form: CapacityForm;
  isDirty: () => boolean;
  reset: () => void;
  messages: CapacityValidationMessages;
  rules: CapacityRules;
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
    rules,
    setExternalErrors,
    getIsValid,
  } = params;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(watchers: Watcher<T>, v: T): void => {
    watchers.forEach((fn) => fn(v));
  };

  const validate = (): ControllerValidationResult => {
    if (readOnly) return { ok: true };

    const res = validateCapacityForm(form, messages, rules);
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
      return toCapacityPayload(form);
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
