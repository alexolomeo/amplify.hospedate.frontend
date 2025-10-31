import { useCallback, useEffect, useState } from 'react';
import { fetchListingPreview } from '@/services/host/edit-listing/editListing';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { ListingDetail } from '@/types/listing/listing';

type Status = 'idle' | 'loading' | 'ready' | 'error';

export function useListingPreview(
  listingId: string,
  lang: SupportedLanguages = 'es'
) {
  const t = getTranslation(lang);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ListingDetail | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    setError(null);

    const data = await fetchListingPreview(listingId);
    if (!data) {
      setStatus('error');
      setError(t.hostContent.editListing.commonMessages.failedFetch);
      return;
    }

    setPreviewData(data);
    setStatus('ready');
  }, [listingId, t.hostContent.editListing.commonMessages.failedFetch]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  return {
    status,
    error,
    previewData,
    refresh,
  };
}
