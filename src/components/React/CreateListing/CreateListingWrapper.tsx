import { useEffect, useLayoutEffect } from 'react';
import { type SupportedLanguages } from '@/utils/i18n';
import { ToastProvider } from './ToastContext';
import { ConfirmDialogProvider } from '@/components/React/CreateListing/ConfirmDialogContext';
import CreateListingWizard from '@/components/React/CreateListing/CreateListingWizard';
import { resetCreateListingState } from '@/components/React/Hooks/CreateListing/createListing.reset';
import { $isCreateListingReset } from '@/stores/createListing/creationOptionsStore';

interface Props {
  listingId?: string;
  lang: SupportedLanguages;
  stepSlug?: string;
}

export default function CreateListingWrapper({
  listingId,
  lang = 'es',
  stepSlug,
}: Props) {
  useLayoutEffect(() => {
    resetCreateListingState();
    $isCreateListingReset.set(false);
  }, []);

  useEffect(() => {
    let cleaned = false;
    const basePath = '/listing/create';

    const doCleanup = () => {
      if (cleaned) return;
      if (window.location.pathname.startsWith(basePath)) {
        cleaned = true;
        resetCreateListingState();
      }
    };

    const onPageHide = () => doCleanup();
    const onBeforeUnload = () => doCleanup();

    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      doCleanup();
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  return (
    <ToastProvider>
      <ConfirmDialogProvider lang={lang}>
        <CreateListingWizard
          listingId={listingId}
          lang={lang}
          stepSlug={stepSlug}
        />
      </ConfirmDialogProvider>
    </ToastProvider>
  );
}
