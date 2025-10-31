import {
  getTranslation,
  translatePlural,
  type SupportedLanguages,
} from '@/utils/i18n';
import type { SelectedDayInfo } from './CalendarContainer';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import { SelectedType } from '@/types/host/calendar/availability';
import { useCallback } from 'react';
import { isContinuousRange } from '@/utils/calendarHelpers';
import {} from '@/services/host/calendar';
import { useDayDetails } from '../../Hooks/Calendar/useDayDetails';
import PanelSkeleton from './skeleton/PanelSkeleton';
import { translate } from '@/utils/i18n';
import { formatDayMonth } from '@/utils/dateUtils';
import { useHasChanged } from '../../Hooks/useHasChanged';

interface Props {
  lang: SupportedLanguages;
  dayInfo: SelectedDayInfo | null;
  onDaySelect: (dayInfo: SelectedDayInfo | null) => void;
  listingId: number;
  refetchCalendar: () => Promise<void>;
  priceMin: number;
  priceMax: number;
}

export default function DayDetailsPanel({
  lang,
  dayInfo,
  onDaySelect,
  listingId,
  refetchCalendar,
  priceMax,
  priceMin,
}: Props) {
  const t = getTranslation(lang);
  const {
    availabilityData,
    isLoading,
    isSaving,
    error,
    updateAvailability,
    initialUpdateAvailability,
    validationError,
    handleSave,
    handleAvailabilityChange,
    handlePriceChange,
    handleNoteChange,
    isEnabledNote,
  } = useDayDetails({
    dayInfo,
    listingId,
    refetchCalendar,
    priceMin,
    priceMax,
    priceErrorMessage: translate(t, `hostContent.calendar.priceError`, {
      priceMin: priceMin,
      priceMax: priceMax,
    }),
  });
  const hasChanges = useHasChanged(
    updateAvailability,
    initialUpdateAvailability
  );

  const calendarText = t.hostContent.calendar;
  const handleClearSelection = useCallback(() => {
    onDaySelect(null);
  }, [onDaySelect]);

  if (!dayInfo || !availabilityData) {
    return <PanelSkeleton></PanelSkeleton>;
  }
  const isRange = isContinuousRange(dayInfo.dates);
  const sortedDates = [...dayInfo.dates].sort(
    (a, b) => a.getTime() - b.getTime()
  );
  const startStr = sortedDates[0];
  const endStr = sortedDates[sortedDates.length - 1];
  const title =
    isRange && sortedDates.length > 1
      ? `${formatDayMonth(startStr, lang)} - ${formatDayMonth(endStr, lang)}`
      : `${dayInfo.dates.length} ${translatePlural(
          t,
          `hostContent.calendar.night`,
          dayInfo.dates.length
        )} `;
  const isMixedAvailability =
    availabilityData.availabilitySection.selectedType === SelectedType.Mixed;
  const isMixedPrice =
    availabilityData.priceSection.selectedType === SelectedType.Mixed;
  const pricePlaceholder = isMixedPrice
    ? `${availabilityData.priceSection.mixedPrice?.min} - ${availabilityData.priceSection.mixedPrice?.max}`
    : `${availabilityData.priceSection.nightlyPrice}`;
  const mixedAvailability =
    availabilityData.availabilitySection.mixedAvailability;

  if (isLoading) {
    return <PanelSkeleton></PanelSkeleton>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  if (!availabilityData) {
    return <div></div>;
  }
  return (
    <div className="flex h-full flex-col">
      {/* header  */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-lg leading-tight font-semibold">{title}</p>
        <button
          className="btn btn-primary btn-circle btn-sm"
          onClick={handleClearSelection}
        >
          <XMarkMini className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-grow space-y-6 overflow-y-auto">
        {/* availability */}
        <div>
          <div className="flex w-full flex-col items-center gap-2">
            {isMixedAvailability && (
              <div className="border-primary w-full rounded-xl border bg-[var(--color-base-150)] px-4 py-1.5">
                <p className="text-primary font-bold">
                  {calendarText.mixedAvailability}
                </p>
                {mixedAvailability && (
                  <p className="text-neutral text-sm">
                    {mixedAvailability.nightsAvailable}{' '}
                    {calendarText.nightsAvailable},{' '}
                    {mixedAvailability.blockedNights}{' '}
                    {calendarText.nightsBlocked}
                  </p>
                )}
              </div>
            )}
            <div className="border-base-200 flex w-full items-center justify-between rounded-xl border bg-[var(--color-base-150)] px-4 py-1.5">
              <p className="text-primary">
                {sortedDates.length > 1
                  ? calendarText.allOpen
                  : calendarText.open}
              </p>
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={
                  updateAvailability.availabilitySection?.availability === true
                }
                onChange={() => handleAvailabilityChange(true)}
              />
            </div>
            <div className="border-base-200 flex w-full items-center justify-between rounded-xl border bg-[var(--color-base-150)] px-4 py-1.5">
              <p className="text-primary">
                {sortedDates.length > 1
                  ? calendarText.allClosed
                  : calendarText.closed}
              </p>
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                checked={
                  updateAvailability.availabilitySection?.availability === false
                }
                onChange={() => handleAvailabilityChange(false)}
              />
            </div>
          </div>
        </div>
        {/* prices */}
        <div className="space-y-4">
          <p className="font-bold">
            {isMixedPrice
              ? calendarText.differentPrices
              : calendarText.nightlyPrice}
          </p>
          <input
            type="number"
            value={
              updateAvailability.priceSection?.nightlyPrice
                ? updateAvailability.priceSection?.nightlyPrice === 0
                  ? ''
                  : updateAvailability.priceSection?.nightlyPrice
                : ''
            }
            onChange={handlePriceChange}
            min={0}
            placeholder={pricePlaceholder}
            className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
          />
        </div>
        {validationError && (
          <div className="text-error mt-2 text-center text-xs">
            {validationError}
          </div>
        )}
        {/* notes */}
        {isEnabledNote && (
          <div className="flex flex-col gap-y-2">
            <p className="font-bold">{calendarText.yourPrivateNotes}</p>
            <div className="space-y-1.5">
              <p className="edit-listing-description px-3">
                {calendarText.writePrivateComment}
              </p>
              <textarea
                className="edit-listing-text-area text-sm"
                rows={1}
                placeholder={calendarText.writeHere}
                value={updateAvailability.note ?? ''}
                onChange={handleNoteChange}
                disabled={!isEnabledNote}
              ></textarea>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving || !hasChanges || !!validationError}
        className="btn btn-primary mt-4 mb-2 w-full rounded-full"
      >
        {isSaving ? t.hostContent.calendar.saving : t.hostContent.calendar.save}
      </button>
    </div>
  );
}
