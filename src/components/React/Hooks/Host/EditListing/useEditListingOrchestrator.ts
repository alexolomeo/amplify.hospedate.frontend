import { useCallback, useEffect, useRef, useState } from 'react';
import { parseEditRoute } from '@/components/React/Utils/edit-listing/parseEditRoute';
import { updateEditListingValues } from '@/services/host/edit-listing/editListing';
import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type {
  SectionController,
  PatchPayload,
  ValidationResult,
  Unsubscribe,
} from '@/components/React/Utils/edit-listing/section-controller';

export type NavOptions = { subpath?: string; replace?: boolean };

interface Params {
  listingId: string;
  refresh: () => Promise<void>;
  navigateTo: (slug: Slug, opts?: NavOptions) => void;
  applyRoute: (slug: Slug, subpath: string) => void;
  confirmDiscard: () => Promise<boolean> | boolean;
  isReadOnly?: boolean;
}

export function useEditListingOrchestrator({
  listingId,
  refresh,
  navigateTo,
  applyRoute,
  confirmDiscard,
  isReadOnly = false,
}: Params) {
  const controllerRef = useRef<SectionController | null>(null);

  const [saving, setSaving] = useState(false);
  const [canSave, setCanSave] = useState(false);

  // Derived states from the controller (via watchers)
  const validRef = useRef<boolean>(true);
  const dirtyRef = useRef<boolean>(false);

  // Keep the last applied route to sync popstate
  const lastRouteRef = useRef<{ slug: Slug; subpath: string } | null>(null);
  const ignoreNextPop = useRef(false);

  const ask = useCallback(async (): Promise<boolean> => {
    const res = await confirmDiscard();
    return typeof res === 'boolean' ? res : false;
  }, [confirmDiscard]);

  /** Recomputes canSave by combining global flags and section state */
  const recomputeCanSave = useCallback((): boolean => {
    if (isReadOnly) return false;
    const c = controllerRef.current;
    const supports = c?.supportsFooterSave?.() ?? true;
    return (
      Boolean(c) && supports && dirtyRef.current && validRef.current && !saving
    );
  }, [isReadOnly, saving]);

  /** Syncs canSave with the current state */
  const syncCanSave = useCallback(() => {
    setCanSave(recomputeCanSave());
  }, [recomputeCanSave]);

  /** Registers the active controller and sets up dirty/valid watchers */
  const registerController = useCallback(
    (ctrl: SectionController | null): (() => void) => {
      // Clear previous references
      controllerRef.current = null;

      // Previous unsubscriptions (if any)
      let unwatchDirty: Unsubscribe | null = null;
      let unwatchValid: Unsubscribe | null = null;

      if (ctrl) {
        controllerRef.current = ctrl;

        // Initialize snapshots
        dirtyRef.current = ctrl.isDirty();

        const v: ValidationResult = ctrl.validate();
        validRef.current = v.ok;

        // Set up watchers if the section provides them
        if (typeof ctrl.watchDirty === 'function') {
          unwatchDirty = ctrl.watchDirty((dirty) => {
            dirtyRef.current = dirty;
            syncCanSave();
          });
        }
        if (typeof ctrl.watchValidity === 'function') {
          unwatchValid = ctrl.watchValidity((valid) => {
            validRef.current = valid;
            syncCanSave();
          });
        }
      }

      // Sync CTA with the initial state of the new controller
      syncCanSave();

      // Automatic cleanup when the controller changes
      return () => {
        if (unwatchDirty) unwatchDirty();
        if (unwatchValid) unwatchValid();
      };
    },
    [syncCanSave]
  );

  /** Centralized save triggered from Footer */
  const saveCurrent = useCallback(async (): Promise<'ok' | 'error'> => {
    if (isReadOnly) return 'error';
    const ctrl = controllerRef.current;
    if (!ctrl) return 'error';

    const v = ctrl.validate();
    if (!v.ok) {
      validRef.current = false;
      syncCanSave();
      return 'error';
    }

    try {
      setSaving(true);
      syncCanSave();

      if (typeof ctrl.customSave === 'function') {
        // custom route (e.g., PATCH /photos/{id})
        await ctrl.customSave();
      } else {
        // traditional editor route
        const payload: PatchPayload = ctrl.buildPatch();
        await updateEditListingValues(listingId, payload);
      }

      await refresh();
      ctrl.discard();
      dirtyRef.current = false;
      validRef.current = true;
      return 'ok';
    } catch {
      return 'error';
    } finally {
      setSaving(false);
      syncCanSave();
    }
  }, [isReadOnly, listingId, refresh, syncCanSave]);

  /** Navigation guard: confirms if there are unsaved changes */
  const guardAndNavigate = useCallback(
    async (slug: Slug, opts?: NavOptions) => {
      const ctrl = controllerRef.current;
      if (ctrl?.isDirty()) {
        const proceed = await ask();
        if (!proceed) return;
        ctrl.discard();
        dirtyRef.current = false;
        validRef.current = true; // the section will recalculate later
        syncCanSave();
      }
      navigateTo(slug, opts);
    },
    [navigateTo, ask, syncCanSave]
  );

  /** Syncs popstate (Back/Forward) with discard guards */
  useEffect(() => {
    const onPop = async (ev: PopStateEvent) => {
      if (ignoreNextPop.current) {
        ignoreNextPop.current = false;
        return;
      }

      const ctrl = controllerRef.current;
      if (ctrl?.isDirty()) {
        ev.preventDefault();
        const proceed = await ask();
        if (!proceed) {
          ignoreNextPop.current = true;
          window.history.pushState({}, '', window.location.pathname);
          return;
        }
        ctrl.discard();
        dirtyRef.current = false;
        validRef.current = true;
        syncCanSave();
      }

      const next = parseEditRoute(window.location.pathname, listingId);
      const prev = lastRouteRef.current;
      if (!prev || prev.slug !== next.slug || prev.subpath !== next.subpath) {
        applyRoute(next.slug, next.subpath);
        lastRouteRef.current = next;
      }
    };

    // Initial seed to avoid unnecessary re-applications
    lastRouteRef.current = parseEditRoute(window.location.pathname, listingId);

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [ask, listingId, applyRoute, syncCanSave]);

  /** Confirms on tab close if there are unsaved changes */
  useEffect(() => {
    const beforeUnload = (e: BeforeUnloadEvent) => {
      const ctrl = controllerRef.current;
      if (ctrl?.isDirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  return { registerController, saveCurrent, canSave, saving, guardAndNavigate };
}
