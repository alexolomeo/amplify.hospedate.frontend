import { AppModal } from '@/components/React/Common/AppModal';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Listing } from '@/types/host/listing';
import { useCallback, useEffect, useState } from 'react';
import SyncSuccessModal from './SyncSuccessModal';
import { useCalendarSyncPolling } from '@/components/React/Hooks/Calendar/useCalendarSyncPolling';
import { SyncStatus } from '@/types/host/calendar/sync';
interface Props {
  lang: SupportedLanguages;
  isOpen: boolean;
  close: () => void;
  listing: Listing;
  link: string;
  refetchCalendar: () => Promise<void>;
  refetchValues: () => Promise<void>;
}

export default function FormSyncCalendarModal({
  lang,
  isOpen,
  close,
  listing,
  link,
  refetchCalendar,
  refetchValues,
}: Props) {
  const t = getTranslation(lang);
  const syncText = t.hostContent.calendar.sync;
  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };
  const [isCopied, setIsCopied] = useState(false);
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');

  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);
  const openModalSuccessOpen = () => setIsModalSuccessOpen(true);
  const closeModalSuccessOpen = () => {
    setName('');
    setUrl('');
    setIsModalSuccessOpen(false);
  };

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [link]);
  const { isPolling, status, message, startAddPolling } =
    useCalendarSyncPolling({
      listingId: listing.id,
    });

  useEffect(() => {
    if (!isPolling && status === SyncStatus.Success) {
      (async () => {
        await refetchValues();
        await refetchCalendar();
        openModalSuccessOpen();
        close();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPolling, status]);

  const handleAddCalendar = async () => {
    await startAddPolling(name, url);
  };

  return (
    <>
      <AppModal
        id="modal-form-sync-calendar"
        showHeader={true}
        title={syncText.formTitle}
        maxWidth={'max-w-md'}
        maxHeight={'max-h-[95vh]'}
        maxHeightBody={'max-h-[70vh]'}
        bgColor={'bg-primary-content'}
        isOpen={isOpen}
        onClose={close}
        titleSize="text-lg leading-tight self-stretch"
      >
        <div className="space-y-6">
          <div className="justify-center self-stretch">
            <span className="text-sm leading-tight font-normal">
              {syncText.bidirectionalSyncDescription}
            </span>
            {/* <span className="text-primary text-sm leading-tight font-normal underline">
              {syncText.videoLinkText}
            </span> */}
          </div>
          {/* listing */}
          <div className="flex w-full items-center gap-2">
            <ResponsiveImage
              photo={listing.photo || fallbackPhoto}
              alt={`listing-${listing.id}`}
              className="h-8 w-8 rounded-lg object-cover"
            ></ResponsiveImage>
            <span className="w-full truncate text-sm font-normal">
              {listing.title}
            </span>
          </div>
          {/* step 1 */}
          <div className="space-y-2">
            <p className="text-sm font-normal"> {syncText.step1Title} </p>
            <div className="space-y-1">
              <p className="edit-listing-description px-1">
                {syncText.step1Description}
              </p>
              <div className="relative flex w-full items-center">
                <input
                  className="input focus:border-primary h-10 w-full rounded-2xl pr-16 focus:ring-0 focus:outline-none"
                  type="text"
                  readOnly
                  value={link}
                />
                <button
                  onClick={handleCopy}
                  className="btn btn-primary absolute right-1 z-10 h-8 rounded-2xl"
                >
                  {isCopied ? syncText.copied : syncText.copyButton}
                </button>
              </div>
            </div>
          </div>
          {/* step 2 */}
          <div className="space-y-2">
            <p className="text-sm font-normal">{syncText.step2Title} </p>
            <div className="space-y-1">
              <p className="edit-listing-description px-1">
                {syncText.step2Description}
              </p>
              <input
                className="input focus:border-primary mt-2 h-10 w-full rounded-2xl focus:ring-0 focus:outline-none"
                placeholder={syncText.calendarNameInputPlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              <input
                className="input focus:border-primary h-10 w-full rounded-2xl focus:ring-0 focus:outline-none"
                placeholder={syncText.urlInputPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              ></input>
            </div>
          </div>
          {/* save */}
          {message && status === SyncStatus.Failed && (
            <p className="mt-2 text-sm text-red-500">{message}</p>
          )}
          <button
            className="btn btn-primary h-12 w-full rounded-full"
            onClick={handleAddCalendar}
            disabled={isPolling || !url || !name}
          >
            {isPolling ? syncText.loading : syncText.addButton}
          </button>
        </div>
      </AppModal>

      <SyncSuccessModal
        lang={lang}
        isOpen={isModalSuccessOpen}
        close={closeModalSuccessOpen}
        name={name}
      ></SyncSuccessModal>
    </>
  );
}
