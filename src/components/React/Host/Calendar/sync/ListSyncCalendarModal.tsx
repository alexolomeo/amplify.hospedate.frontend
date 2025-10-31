import { AppModal } from '@/components/React/Common/AppModal';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import type { SyncCalendar } from '@/types/host/calendar/preferenceSetting';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import type { Listing } from '@/types/host/listing';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';
import { useEffect, useState } from 'react';
import { deleteCalendarSync } from '@/services/host/calendar';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useCalendarSyncPolling } from '@/components/React/Hooks/Calendar/useCalendarSyncPolling';
import { SyncStatus } from '@/types/host/calendar/sync';

interface Props {
  isOpen: boolean;
  close: () => void;
  lang?: SupportedLanguages;
  syncCalendars: SyncCalendar[];
  listing: Listing;
  refetchCalendar: () => Promise<void>;
  refetchValues: () => Promise<void>;
  openModalFormSync: () => void;
}
const ListSyncCalendarModal: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  close,
  syncCalendars,
  listing,
  refetchCalendar,
  refetchValues,
  openModalFormSync,
}) => {
  const t = getTranslation(lang);
  const syncText = t.hostContent.calendar.sync;
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState<SyncCalendar | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const { isPolling, calendarId, status, message, startUpdatePolling } =
    useCalendarSyncPolling({ listingId: listing.id });

  useEffect(() => {
    if (!isPolling && calendarId !== null) {
      refetchValues();
      refetchCalendar();
    }
  }, [isPolling, calendarId, refetchValues, refetchCalendar]);

  const handleUpdate = (calendar: SyncCalendar) => {
    startUpdatePolling(calendar.id);
  };

  const openDeleteModal = (calendar: SyncCalendar) => {
    setCalendarToDelete(calendar);
    setIsModalDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalDeleteOpen(false);
    setCalendarToDelete(null);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    if (calendarToDelete) {
      const success = await deleteCalendarSync(listing.id, calendarToDelete.id);
      if (success) {
        refetchValues();
        refetchCalendar();
        setIsLoading(false);
        closeDeleteModal();
      } else {
        setIsLoading(false);
        console.error('Failed to delete calendar');
      }
    }
  };

  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };
  return (
    <div>
      <AppModal
        id="modal-list-sync-calendar"
        showHeader={true}
        title={syncText.syncedCalendarsTitle}
        maxWidth={'max-w-sm'}
        maxHeight={'max-h-[95vh]'}
        maxHeightBody={'max-h-[70vh]'}
        bgColor={'bg-primary-content'}
        isOpen={isOpen}
        onClose={close}
        titleSize="text-lg"
      >
        <div className="space-y-6">
          <p> {syncText.syncedCalendarsDescription}</p>
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
          {syncCalendars.map((calendar) => (
            <div key={calendar.name}>
              <div className="border-neutral rounded-2xl border p-2">
                <p className="justify-center self-stretch text-base leading-tight font-normal">
                  {calendar.name}
                </p>
                <p className="text-neutral justify-center self-stretch text-sm leading-none font-normal">
                  {syncText.lastUpdated}{' '}
                  {format(parseISO(calendar.updatedAt), 'd LLL, h:mm a', {
                    locale: lang === 'en' ? enUS : es,
                  })}
                </p>
                <div className="flex items-center justify-end">
                  <button
                    className="text-secondary cursor-pointer p-2 text-sm leading-3"
                    onClick={() => handleUpdate(calendar)}
                    disabled={isPolling}
                  >
                    {isPolling && calendarId === calendar.id
                      ? syncText.updatingButton
                      : syncText.updateButton}
                  </button>
                  <button
                    className="text-secondary cursor-pointer p-2 text-sm leading-3"
                    onClick={() => openDeleteModal(calendar)}
                  >
                    {syncText.deleteButton}
                  </button>
                </div>
              </div>
              {isPolling && calendarId === calendar.id && (
                <span className="text-xs">{syncText.updatingButton}...</span>
              )}
              {calendarId === calendar.id && status === SyncStatus.Success && (
                <span className="text-success text-xs">
                  {syncText.successSync}
                </span>
              )}
              {calendarId === calendar.id && status === SyncStatus.Failed && (
                <span className="text-error text-xs">{message}</span>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between p-1">
            <p>{syncText.syncAnotherCalendarButton}</p>
            <button
              className="btn btn-primary btn-ghost btn-circle"
              onClick={() => {
                openModalFormSync();
                close();
              }}
            >
              <ChevronRightIcon></ChevronRightIcon>
            </button>
          </div>
        </div>
      </AppModal>
      <AppModal
        id="modal-delete-sync-calendar"
        showHeader={false}
        maxWidth={'max-w-sm'}
        maxHeight={'max-h-[95vh]'}
        maxHeightBody={'max-h-[70vh]'}
        bgColor={'bg-secondary-content'}
        isOpen={isModalDeleteOpen}
        onClose={closeDeleteModal}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-error self-stretch text-lg leading-tight">
              {syncText.deleteConfirmationTitle}
            </h1>
            <button
              onClick={closeDeleteModal}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]"
            >
              <XMarkMini className="h-5 w-5 flex-shrink-0" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="btn btn-link text-error"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? syncText.deleting : syncText.confirmDeleteButton}
            </button>
            <button
              className="btn btn-primary rounded-full"
              onClick={closeDeleteModal}
              disabled={isLoading}
            >
              {syncText.goBack}
            </button>
          </div>
        </div>
      </AppModal>
    </div>
  );
};
export default ListSyncCalendarModal;
