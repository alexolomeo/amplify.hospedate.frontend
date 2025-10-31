import * as React from 'react';

import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

import Chevron from '/src/icons/chevron-left.svg?react';
import Laptop from '/src/icons/amenities/tv.svg?react';
import Mobile from '/src/icons/amenities/device-phone-mobile.svg?react';
import { useListingPreview } from '../../Hooks/Host/EditListing/useListingPreview';
import LoadingSpinner from '../../Common/LoadingSpinner';

type Props = {
  lang?: SupportedLanguages;
  listingIdRecived?: string;
};

export default function ListingDetailPage({
  lang = 'es',
  listingIdRecived,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);
  const listingId = listingIdRecived ?? '';
  const {
    previewData: listing,
    status,
    error,
  } = useListingPreview(listingId, lang);
  const [isMobileMode, setIsMobileMode] = React.useState(false);

  React.useEffect(() => {
    const readMode = () =>
      typeof window !== 'undefined' &&
      new URL(window.location.href).searchParams.get('mode') === 'mobile';

    setIsMobileMode(readMode());

    const onPop = () => setIsMobileMode(readMode());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const setMode = React.useCallback((mode: 'mobile' | 'laptop') => {
    if (typeof window === 'undefined') return;
    const u = new URL(window.location.href);
    if (mode === 'mobile') u.searchParams.set('mode', 'mobile');
    else u.searchParams.delete('mode');
    window.history.pushState({}, '', u.toString());
    setIsMobileMode(mode === 'mobile');
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setMode('mobile');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMode]);

  const lapBtnClass = `btn btn-sm rounded-full hidden md:flex ${isMobileMode ? 'bg-base-200' : 'btn-primary'}`;
  const mobBtnClass = `btn btn-sm rounded-full ${isMobileMode ? 'btn-primary' : 'bg-base-200'}`;

  return (
    <>
      <div className="w-full bg-[var(--color-base-150)] pl-6">
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 bg-[var(--color-base-150)] px-5 py-3">
          <a
            href={`/hosting/listing/edit/${encodeURIComponent(listingId)}/title`}
            role="button"
            className="text-primary flex items-center gap-2 justify-self-start text-sm font-medium hover:underline"
          >
            <span className="text-xl leading-none">
              <Chevron className="h-4" />
            </span>
            {t.auth.goBack}
          </a>

          <div className="bg-base-200 flex items-center gap-2 justify-self-center rounded-full p-1 shadow-sm">
            <a
              href="#"
              role="button"
              aria-pressed={!isMobileMode}
              className={lapBtnClass}
              data-device="laptop"
              onClick={(e) => {
                e.preventDefault();
                setMode('laptop');
              }}
            >
              {t.preview.laptop}
              <Laptop className="h-4" />
            </a>
            <a
              href="#"
              role="button"
              aria-pressed={isMobileMode}
              className={mobBtnClass}
              data-device="mobile"
              onClick={(e) => {
                e.preventDefault();
                setMode('mobile');
              }}
            >
              {t.common.mobile}
              <Mobile className="h-6" />
            </a>
          </div>

          <div className="justify-self-end" />
        </div>
      </div>
      {!isMobileMode ? (
        <div className="h-[100dvh] w-full overflow-hidden bg-[var(--color-base-150)]">
          <div className="mx-auto mb-10 max-w-7xl px-5 py-10">
            <div className="border-base-300 bg-base-100 sticky top-20 overflow-hidden rounded-[32px] border shadow-sm">
              {/* 🔹 Aquí va la condición */}
              {status === 'loading' || !listing ? (
                <div className="flex min-h-[60vh] items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : status === 'error' ? (
                <div className="flex min-h-[60vh] flex-col items-center justify-center">
                  <div className="text-error mb-4 text-center">
                    {error ?? 'Failed to load listing.'}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    {t.hostContent.editListing.commonMessages.retry}
                  </button>
                </div>
              ) : (
                <section
                  id="detail-scroll"
                  className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain pb-24 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent"
                >
                  <iframe
                    src={`/hosting/listing/edit/${encodeURIComponent(listingId)}/preview-frame`}
                    style={{
                      border: 'none',
                      width: '100%',
                      height: '100%',
                      minHeight: '80vh',
                    }}
                    className="bg-base-100"
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center bg-[var(--color-base-150)] py-6">
          <div
            className="border-primary/30 overflow-y-scroll rounded-[28px] border shadow-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{
              width: 400,
              height: 'clamp(560px, 80dvh, 844px)',
            }}
          >
            <iframe
              src={`/hosting/listing/edit/${encodeURIComponent(listingId)}/preview-frame`}
              style={{ border: 'none', width: '100%', height: '100%' }}
              className="bg-base-100"
            />
          </div>
        </div>
      )}
    </>
  );
}
