import { ToastProvider } from '@/components/React/CreateListing/ToastContext';
import EditListingSection from '@/components/React/Host/EditListing/EditListingSection';
import type { SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
  listingId: string;
  stepSlug: string;
}

export default function EditListingWrapper({
  lang = 'es',
  listingId,
  stepSlug,
}: Props) {
  return (
    <ToastProvider containerClassName="bottom-20 md:bottom-24">
      <EditListingSection
        lang={lang}
        listingId={listingId}
        stepSlug={stepSlug}
      />
    </ToastProvider>
  );
}
