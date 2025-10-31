import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  $editListingSession,
  getSession,
  setSession,
  removeListingValuesAndMaybeCleanup,
  setListingValues,
} from '@/stores/host/editListing/editListingSession';
import {
  fetchEditListingCatalogs,
  fetchEditListingValues,
} from '@/services/host/edit-listing/editListing';
import type { EditListingCatalog } from '@/types/host/edit-listing/editListingCatalog';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export function useEditListing(
  listingId: string,
  lang: SupportedLanguages = 'es'
) {
  const t = getTranslation(lang);
  const session = useStore($editListingSession);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const hasCatalogs: boolean = Boolean(session.catalogs);
  const listingState = session.valuesByListingId?.[listingId];
  const hasValues: boolean = Boolean(listingState?.workingValues);
  const needsFetch: boolean = !hasCatalogs || !hasValues;

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    const catalogsPromise: Promise<EditListingCatalog> = hasCatalogs
      ? Promise.resolve(session.catalogs as EditListingCatalog)
      : fetchEditListingCatalogs().then((data) => {
          if (!data) {
            return Promise.reject(new Error('Failed to fetch catalogs'));
          }
          return data;
        });

    const valuesPromise = fetchEditListingValues(listingId).then((data) => {
      if (!data) {
        return Promise.reject(new Error('Failed to fetch values'));
      }
      return data;
    });

    try {
      const [catalogs, values] = await Promise.all([
        catalogsPromise,
        valuesPromise,
      ]);

      const current = getSession();
      setSession({ ...current, catalogs });
      setListingValues(listingId, values);

      setStatus('ready');
    } catch {
      setStatus('error');
      setError(t.hostContent.editListing.commonMessages.failedFetch);
    }
  }, [
    hasCatalogs,
    session.catalogs,
    listingId,
    t.hostContent.editListing.commonMessages.failedFetch,
  ]);

  useEffect(() => {
    return () => {
      removeListingValuesAndMaybeCleanup(listingId);
    };
  }, [listingId]);

  useEffect(() => {
    if (needsFetch && status !== 'loading') {
      void load();
    } else if (!needsFetch && status !== 'ready') {
      setStatus('ready');
    }
  }, [needsFetch, status, load]);

  const selectors = useMemo(() => {
    const catalogs: EditListingCatalog | undefined = session.catalogs;
    return {
      propertyTypeGroups:
        catalogs?.propertyTypeSection.propertyTypeGroups ?? [],
      propertySizeUnits: catalogs?.propertyTypeSection.propertySizeUnits ?? [],
      advanceNoticeHours:
        catalogs?.availabilitySection.advanceNoticeHours ?? [],
      sameDayAdvanceNoticeTimes:
        catalogs?.availabilitySection.sameDayAdvanceNoticeTimes ?? [],
      amenityGroups: catalogs?.amenitiesSection.amenityGroups ?? [],
      quietHoursStartTimes:
        catalogs?.houseRulesSection.quietHours.startTimes ?? [],
      quietHoursEndTimes: catalogs?.houseRulesSection.quietHours.endTimes ?? [],
      checkInStartTimes:
        catalogs?.houseRulesSection.checkInOut.checkInStartTimes ?? [],
      checkInEndTimes:
        catalogs?.houseRulesSection.checkInOut.checkInEndTimes ?? [],
      checkoutTimes: catalogs?.houseRulesSection.checkInOut.checkoutTimes ?? [],
    };
  }, [session.catalogs]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const values: ListingEditorValues | undefined =
    session.valuesByListingId?.[listingId]?.workingValues;

  const serverValues: ListingEditorValues | undefined =
    session.valuesByListingId?.[listingId]?.serverValues;

  return {
    status,
    error,
    selectors,
    catalogs: session.catalogs,
    values,
    serverValues,
    refresh,
  };
}

export type CatalogsSelectors = ReturnType<typeof useEditListing>['selectors'];
