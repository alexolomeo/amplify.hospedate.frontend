import type {
  SectionController,
  Unsubscribe,
  FieldErrors as ControllerFieldErrors,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type {
  HouseRulesForm,
  HouseRulesValidationMessages,
} from './houseRulesValidators';
import { validateHouseRulesForm } from './houseRulesValidators';
import { toHouseRulesPayload } from './houseRulesAdapters';

type Watcher<T> = Set<(value: T) => void>;

export function createHouseRulesController(params: {
  slug: Slug;
  readOnly: boolean;
  form: HouseRulesForm;
  isDirty: () => boolean;
  reset: () => void;
  messages: HouseRulesValidationMessages;
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

  const publish = <T>(ws: Watcher<T>, v: T): void => ws.forEach((fn) => fn(v));

  const validate = (): ControllerValidationResult => {
    if (readOnly) return { ok: true };
    const res = validateHouseRulesForm(form, messages);
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
      return toHouseRulesPayload(form);
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
