import { useEffect, useRef } from 'react';
import {
  $creationOptions,
  $isCreateListingReset,
} from '@/stores/createListing/creationOptionsStore';
import { getListingCreationData } from '@/services/createListing';

export function useCreationOptions() {
  const inFlight = useRef(false);

  useEffect(() => {
    if ($isCreateListingReset.get()) return;
    if ($creationOptions.get() || inFlight.current) return;

    inFlight.current = true;
    getListingCreationData()
      .then((res) => $creationOptions.set(res))
      .catch((err) => console.error('[creationOptions] load failed', err))
      .finally(() => {
        inFlight.current = false;
      });
  }, []);
}
