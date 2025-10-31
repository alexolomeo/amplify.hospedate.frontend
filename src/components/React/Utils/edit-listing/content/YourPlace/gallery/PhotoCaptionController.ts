import type {
  FieldErrors as ControllerFieldErrors,
  SectionController,
  Unsubscribe,
  ValidationResult as ControllerValidationResult,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type {
  PhotoCaptionForm,
  PhotoCaptionValidationMessages,
} from './photoCaptionValidators';
import { validatePhotoCaptionForm } from './photoCaptionValidators';
import { updatePhotoCaption as updateCaptionInStore } from '@/stores/host/editListing/gallery.store';

type Watcher<T> = Set<(v: T) => void>;

export function createPhotoCaptionController(params: {
  slug: Slug;
  readOnly: boolean;
  listingId: string;
  spaceId: string | number;
  photoId: number;
  form: PhotoCaptionForm;
  isDirty: () => boolean;
  reset: () => void;
  messages: PhotoCaptionValidationMessages;
  setExternalErrors: (errs: ControllerFieldErrors | null) => void;
}): SectionController {
  const {
    slug,
    readOnly,
    spaceId,
    photoId,
    form,
    isDirty,
    reset,
    messages,
    setExternalErrors,
  } = params;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(ws: Watcher<T>, v: T): void => {
    ws.forEach((fn) => fn(v));
  };

  const validate = (): ControllerValidationResult => {
    if (readOnly) return { ok: true };
    const res = validatePhotoCaptionForm(form, messages);
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
      return {};
    },
    async customSave(): Promise<void> {
      if (readOnly) return;
      const trimmed = form.text.trim();
      await updateCaptionInStore(spaceId, photoId, trimmed);
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
      const initial = readOnly
        ? true
        : validatePhotoCaptionForm(form, messages).ok;
      cb(initial);
      return () => {
        validWatchers.delete(cb);
      };
    },
  };
}
