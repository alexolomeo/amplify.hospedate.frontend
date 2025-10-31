import type {
  SectionController,
  ValidationResult,
  Unsubscribe,
} from '@/components/React/Utils/edit-listing/section-controller';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import { updateListingStatus } from '@/services/host/edit-listing/editListing';

type Watcher<T> = Set<(v: T) => void>;

export function createRequestedChangesController(params: {
  slug?: Slug;
  listingId: string | number;
  startDirty?: boolean;
}): SectionController {
  const { slug = 'request-changes', listingId, startDirty } = params;

  let dirty = !!startDirty;

  const dirtyWatchers: Watcher<boolean> = new Set();
  const validWatchers: Watcher<boolean> = new Set();

  const publish = <T>(ws: Watcher<T>, v: T): void => {
    ws.forEach((fn) => fn(v));
  };

  return {
    getSlug() {
      return slug;
    },

    isDirty(): boolean {
      return dirty;
    },

    validate(): ValidationResult {
      return { ok: true };
    },

    buildPatch() {
      return {};
    },

    async customSave(): Promise<void> {
      if (!dirty) return;

      await updateListingStatus(listingId, 'PENDING_APPROVAL');

      dirty = false;
      publish(dirtyWatchers, false);
      publish(validWatchers, true);
    },

    discard(): void {
      if (dirty) {
        dirty = false;
        publish(dirtyWatchers, false);
        publish(validWatchers, true);
      }
    },

    supportsFooterSave(): boolean {
      return true;
    },

    watchDirty(cb: (d: boolean) => void): Unsubscribe {
      dirtyWatchers.add(cb);
      cb(dirty);
      return () => void dirtyWatchers.delete(cb);
    },

    watchValidity(cb: (v: boolean) => void): Unsubscribe {
      validWatchers.add(cb);
      cb(true);
      return () => void validWatchers.delete(cb);
    },
  };
}
