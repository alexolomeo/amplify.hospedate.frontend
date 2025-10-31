import type {
  SectionController,
  Unsubscribe,
  FieldErrors as ControllerFieldErrors,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type { TitleForm, TitleValidationMessages } from './titleValidators';
import { validateTitleForm } from './titleValidators';
import { toTitlePayload } from './titleAdapters';

type Watcher<T> = Set<(value: T) => void>;

export function createTitleController(params: {
  slug: Slug; // 'title'
  readOnly: boolean;
  form: TitleForm;
  isDirty: () => boolean;
  reset: () => void;
  messages: TitleValidationMessages;
  /** Para mostrar errores de servidor en la vista */
  setExternalError: (msg: string | null) => void;
  /** Para obtener validez actual sin efectos colaterales */
  getIsValid: () => boolean;
}): SectionController {
  const {
    slug,
    readOnly,
    form,
    isDirty,
    reset,
    messages,
    setExternalError,
    getIsValid,
  } = params;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(watchers: Watcher<T>, v: T): void => {
    watchers.forEach((fn) => fn(v));
  };

  const validate = (): ControllerValidationResult => {
    if (readOnly) return { ok: true };

    // validación pura
    const res = validateTitleForm(form, messages);
    if (res.ok) {
      // limpia el error externo si estaba presente
      setExternalError(null);
      publish(validWatchers, true);
      return { ok: true };
    }
    publish(validWatchers, false);
    return { ok: false, errors: res.errors };
  };

  return {
    getSlug(): Slug {
      return slug;
    },

    isDirty(): boolean {
      // En modo readOnly nunca hay cambios “guardables”
      return !readOnly && isDirty();
    },

    validate,

    buildPatch() {
      return toTitlePayload(form);
    },

    discard(): void {
      reset();
      setExternalError(null);
      publish(dirtyWatchers, false);
      publish(validWatchers, true);
    },

    applyServerErrors(errors: ControllerFieldErrors): void {
      // Sencillo: si API devolvió mensaje para 'title', lo mostramos en UI
      const msg = errors.title ?? '';
      if (msg.length > 0) {
        setExternalError(msg);
        publish(validWatchers, false);
      }
    },

    supportsFooterSave(): boolean {
      // El orquestador además chequea isReadOnly global
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
      // “validez” inicial: readOnly => true; si no, según el validador actual
      const initialValid = readOnly ? true : getIsValid();
      cb(initialValid);
      return () => {
        validWatchers.delete(cb);
      };
    },
  };
}
