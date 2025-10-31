import { persistentAtom } from '@nanostores/persistent';
import type { EditListingCatalog } from '@/types/host/edit-listing/editListingCatalog';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import { getTabScope } from '@/components/React/Utils/edit-listing/tabScope';

const EDIT_SESSION_PREFIX = 'host.editListing.session.v2.' as const;

export interface ListingDraft {
  listingId?: string;
}

export interface ListingValuesState {
  serverValues?: ListingEditorValues;
  workingValues?: ListingEditorValues;
  dirtySections: string[];
  lastFetchedAt?: string;
  hasPatchedOnce?: boolean;
}

export interface EditListingSession {
  catalogs?: EditListingCatalog;
  listingDraft?: ListingDraft;
  valuesByListingId?: Record<string, ListingValuesState>;
}

const DEFAULT_VALUE: EditListingSession = {
  catalogs: undefined,
  listingDraft: undefined,
  valuesByListingId: {},
};

const { persistKey } = getTabScope();
const PERSIST_KEY = persistKey('host.editListing.session', {
  includeRuntime: true,
});

export const $editListingSession = persistentAtom<EditListingSession>(
  PERSIST_KEY,
  DEFAULT_VALUE,
  {
    encode: (v) => JSON.stringify(v),
    decode: (s) => {
      try {
        const parsed = JSON.parse(s) as EditListingSession;
        const byId: Record<string, ListingValuesState> = {
          ...(parsed?.valuesByListingId ?? {}),
        };

        Object.keys(byId).forEach((k) => {
          const it = byId[k];
          byId[k] = {
            dirtySections: Array.isArray(it?.dirtySections)
              ? it.dirtySections
              : [],
            serverValues: it?.serverValues,
            workingValues: it?.workingValues,
            lastFetchedAt: it?.lastFetchedAt,
            hasPatchedOnce: it?.hasPatchedOnce ?? false,
          };
        });

        return {
          catalogs: parsed?.catalogs,
          listingDraft: parsed?.listingDraft,
          valuesByListingId: byId,
        };
      } catch {
        return DEFAULT_VALUE;
      }
    },
  }
);

export const getSession = (): EditListingSession => $editListingSession.get();
export const setSession = (next: EditListingSession): void =>
  $editListingSession.set(next);
export const resetEditListingSession = (): void =>
  $editListingSession.set(DEFAULT_VALUE);

export const setDraftListingId = (listingId: string): void => {
  const current = getSession();
  setSession({
    ...current,
    listingDraft: { ...current.listingDraft, listingId },
  });
};

function cloneValues(values: ListingEditorValues): ListingEditorValues {
  if (typeof structuredClone === 'function') return structuredClone(values);
  return JSON.parse(JSON.stringify(values)) as ListingEditorValues;
}

export const setListingValues = (
  listingId: string,
  values: ListingEditorValues
): void => {
  const current = getSession();
  const nextByListing: Record<string, ListingValuesState> = {
    ...(current.valuesByListingId ?? {}),
  };

  const prev: ListingValuesState = nextByListing[listingId] ?? {
    dirtySections: [],
  };

  nextByListing[listingId] = {
    ...prev,
    serverValues: values,
    workingValues: cloneValues(values),
    lastFetchedAt: new Date().toISOString(),
    hasPatchedOnce: prev.hasPatchedOnce ?? false,
  };

  setSession({
    ...current,
    listingDraft: { ...(current.listingDraft ?? {}), listingId },
    valuesByListingId: nextByListing,
  });
};

export const getHasPatchedOnce = (listingId: string): boolean =>
  Boolean(getSession().valuesByListingId?.[listingId]?.hasPatchedOnce);

export const markHasPatchedOnce = (listingId: string): void => {
  const current = getSession();
  const byId: Record<string, ListingValuesState> = {
    ...(current.valuesByListingId ?? {}),
  };
  const prev: ListingValuesState = byId[listingId] ?? { dirtySections: [] };

  byId[listingId] = { ...prev, hasPatchedOnce: true };

  setSession({ ...current, valuesByListingId: byId });
};

export function removeListingValues(listingId: string): void {
  const current = getSession();
  const byId = { ...(current.valuesByListingId ?? {}) };
  if (byId[listingId]) {
    delete byId[listingId];
    setSession({ ...current, valuesByListingId: byId });
  }
}

export function clearCatalogs(): void {
  const current = getSession();
  setSession({
    ...current,
    catalogs: undefined,
  });
}

export function clearListingDraftIfEqual(listingId: string): void {
  const current = getSession();
  const same = current.listingDraft?.listingId === listingId;
  setSession({
    ...current,
    listingDraft: same ? undefined : current.listingDraft,
  });
}

export function removeListingValuesAndMaybeCleanup(listingId: string): void {
  const current = getSession();
  const byId = { ...(current.valuesByListingId ?? {}) };

  if (byId[listingId]) delete byId[listingId];

  const noMoreListings = Object.keys(byId).length === 0;

  setSession({
    ...current,
    valuesByListingId: byId,
    catalogs: noMoreListings ? undefined : current.catalogs,
    listingDraft: noMoreListings ? undefined : current.listingDraft,
  });
}

export function resetAllForSecurity(): void {
  resetEditListingSession();
}

export function purgeAllEditListingSessionKeys(): void {
  if (typeof window === 'undefined') return;

  try {
    const ls = window.localStorage;
    for (let i = ls.length - 1; i >= 0; i--) {
      const key: string | null = ls.key(i);
      if (key !== null && key.startsWith(EDIT_SESSION_PREFIX)) {
        ls.removeItem(key);
      }
    }
  } catch {
    /* noop */
  }
}
