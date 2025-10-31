import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
import PricePanel from './PricePanel';
import {
  type CalendarPreferenceSettingValues,
  type PriceSection,
  type UpdateCalendarPreferenceSetting,
} from '@/types/host/calendar/preferenceSetting';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { updateCalendarPreferenceSetting } from '@/services/host/calendar';
import { useHasChanged } from '../../Hooks/useHasChanged';
import FormSyncCalendarModal from './sync/FormSyncCalendarModal';
import ListSyncCalendarModal from './sync/ListSyncCalendarModal';
import type { Listing } from '@/types/host/listing';
import ArrowPathIcon from '/src/icons/arrow-path.svg?react';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';

interface Props {
  lang: SupportedLanguages;
  values: CalendarPreferenceSettingValues | null;
  closePanel: () => void;
  listingId: number;
  refetchCalendar: () => Promise<void>;
  refetchValues: () => Promise<void>;
  priceMin: number;
  priceMax: number;
  selectedListing: Listing;
}

export default function Panel({
  lang,
  values,
  closePanel,
  listingId,
  refetchCalendar,
  refetchValues,
  priceMax,
  priceMin,
  selectedListing,
}: Props) {
  const t = getTranslation(lang);
  const [settings, setSettings] =
    useState<UpdateCalendarPreferenceSetting | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);
  const [initialValues, setInitialValues] =
    useState<UpdateCalendarPreferenceSetting | null>(null);
  const [isModalFormSyncOpen, setIsModalFormSyncOpen] = useState(false);
  const openModalFormSync = () => setIsModalFormSyncOpen(true);
  const closeModalFormSync = () => setIsModalFormSyncOpen(false);

  const [isModalListSyncOpen, setIsModalListSyncOpen] = useState(false);
  const openModalListSync = () => setIsModalListSyncOpen(true);
  const closeModalListSync = () => setIsModalListSyncOpen(false);

  useEffect(() => {
    if (!values) {
      setSettings(null);
      return;
    }
    const updatedSettings: UpdateCalendarPreferenceSetting = {
      priceSection: {
        discounts: values.priceSection.discounts ?? {
          monthly: null,
          weekly: null,
        },
        perNight: values.priceSection.perNight,
        perWeekend: values.priceSection.perWeekend ?? null,
      },
    };
    setSettings(updatedSettings);
    setInitialValues(updatedSettings);
  }, [values]);

  const hasChanges = useHasChanged(settings, initialValues);
  if (!settings) {
    return <div></div>;
  }

  const validatePriceSettings = () => {
    if (!settings || !settings.priceSection) {
      return true;
    }
    if (
      settings.priceSection.perNight === null ||
      settings.priceSection.perNight < priceMin ||
      settings.priceSection.perNight > priceMax
    ) {
      return true;
    }

    if (
      settings.priceSection.perWeekend &&
      (settings.priceSection.perWeekend < priceMin ||
        settings.priceSection.perWeekend > priceMax)
    ) {
      return true;
    }

    return false;
  };
  const handleSave = async () => {
    if (!settings || !settings.priceSection) {
      return;
    }
    setIsSaving(true);
    setIsError(false);

    const isSuccess = await updateCalendarPreferenceSetting(
      listingId,
      settings
    );

    if (isSuccess) {
      refetchCalendar();
      refetchValues();
    } else {
      console.error('Failed to update settings');
      setIsError(true);
    }
    setIsSaving(false);
  };
  const handlePricesChange = (newPrices: PriceSection) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      priceSection: newPrices,
    }));
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-2">
          <h2 className="text-lg font-bold">
            {t.hostContent.calendar.generalConfig}
          </h2>
          <button
            className="btn btn-primary btn-circle btn-sm flex md:hidden"
            onClick={closePanel}
          >
            <XMarkMini className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          {settings.priceSection && (
            <PricePanel
              lang={lang}
              prices={settings.priceSection}
              onPricesChange={handlePricesChange}
              priceMin={priceMin}
              priceMax={priceMax}
              currency={values?.priceSection.currency}
            />
          )}

          {values && (
            <div className="m-1 pt-2">
              <button
                className="outline-base-200 flex w-full items-center gap-2 rounded-2xl p-5 font-normal outline"
                onClick={
                  values?.syncCalendarSection.syncCalendars.length === 0
                    ? openModalFormSync
                    : openModalListSync
                }
              >
                <ArrowPathIcon className="h-5 w-5"></ArrowPathIcon>
                <p className="font-bold">
                  {values?.syncCalendarSection.syncCalendars.length === 0
                    ? t.hostContent.calendar.sync.syncCalendarButton
                    : t.hostContent.calendar.sync.syncButton}
                </p>
                <ChevronRightIcon className="ml-auto h-5 w-5"></ChevronRightIcon>
              </button>
            </div>
          )}
        </div>
        {isError && (
          <p className="mt-2 text-red-500">
            {t.hostContent.calendar.updateError}
          </p>
        )}
        <button
          className="btn btn-primary mt-4 mb-2 w-full rounded-full"
          disabled={isSaving || validatePriceSettings() || !hasChanges}
          onClick={handleSave}
        >
          {isSaving
            ? t.hostContent.calendar.saving
            : t.hostContent.calendar.save}
        </button>
      </div>
      {values && selectedListing && (
        <FormSyncCalendarModal
          lang={lang}
          isOpen={isModalFormSyncOpen}
          close={closeModalFormSync}
          listing={selectedListing}
          link={values.syncCalendarSection.calendarLink}
          refetchCalendar={refetchCalendar}
          refetchValues={refetchValues}
        ></FormSyncCalendarModal>
      )}
      {values && (
        <ListSyncCalendarModal
          lang={lang}
          isOpen={isModalListSyncOpen}
          close={closeModalListSync}
          listing={selectedListing}
          syncCalendars={values.syncCalendarSection.syncCalendars}
          refetchCalendar={refetchCalendar}
          refetchValues={refetchValues}
          openModalFormSync={openModalFormSync}
        ></ListSyncCalendarModal>
      )}
    </>
  );
}
