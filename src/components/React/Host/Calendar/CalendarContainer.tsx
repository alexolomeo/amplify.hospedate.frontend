import { type SupportedLanguages } from '@/utils/i18n';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '../../Hooks/useIsMobile';
import { useAvailableHeight } from '../../Hooks/useAvailableHeight';
import Calendar from './Calendar';
import Panel from './Panel';
import DayDetailsPanel from './DayDetailsPanel';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import ModalSelectListing from './ModalSelectListing';
import FilterIcon from '/src/icons/adjusments-horizontal.svg?react';
import { useCalendarState } from '../../Hooks/Calendar/useCalendarState';
import { useCalendarListing } from '../../Hooks/Calendar/useCalendarListing';
import { useListingData } from '../../Hooks/Calendar/useListingData';
import EmptyListingsState from '../Common/EmptyListingsState';
import CalendarSkeleton from './skeleton/CalendarSkeleton';
import PanelSkeleton from './skeleton/PanelSkeleton';
import { MIN_NIGHT_PRICE } from '../../Utils/priceMath';
import { useState } from 'react';
import InformationCircleSolidIcon from '/src/icons/information-circle-solid.svg?react';
import ModalInfoCalendar from './ModalInfoCalendar';

interface Props {
  lang: SupportedLanguages;
  listingIdFromUrl?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}
export interface SelectedDayInfo {
  dates: Date[];
}

export default function CalendarContainer({
  lang,
  listingIdFromUrl,
  action,
  startDate,
  endDate,
}: Props) {
  const isMobile = useIsMobile(1024);
  const availableHeight = useAvailableHeight('header');
  const priceMin = MIN_NIGHT_PRICE;
  const priceMax = 10000;
  const {
    listings,
    selectedListing: initialSelectedListing,
    selectedDayInfo: initialSelectedDayInfo,
    isLoading: listingLoading,
    error: listingError,
  } = useCalendarListing({
    listingIdFromUrl,
    action,
    startDate,
    endDate,
  });

  // Lógica de estado e interacciones del usuario
  const {
    isPanelOpen,
    setIsPanelOpen,
    selectedDayInfo,
    selectedListing,
    setSelectedDayInfo,
    handleDaySelection,
    handleListingSelect,
    isModalListingOpen,
    setIsModalListingOpen,
  } = useCalendarState(initialSelectedListing, initialSelectedDayInfo);

  const [isModalInfoCalendarOpen, setIsModalInfoCalendarOpen] = useState(false);
  const openModalInfoCalendarOpen = () => setIsModalInfoCalendarOpen(true);
  const closeModalInfoCalendarOpen = () => setIsModalInfoCalendarOpen(false);

  const {
    calendarData,
    values,
    isLoading: dataLoading,
    error: dataError,
    refetchCalendar,
    refetchValues,
  } = useListingData(selectedListing?.id || null);
  if (listingLoading || dataLoading) {
    return (
      <div className="flex flex-col gap-x-8 px-2 pt-6 md:flex-row md:px-8">
        <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto md:w-9/12">
          <CalendarSkeleton></CalendarSkeleton>
        </div>
        {!isMobile && (
          <div className="hide-scrollbar w-full overflow-y-auto md:w-3/12">
            <PanelSkeleton></PanelSkeleton>
          </div>
        )}
      </div>
    );
  }

  if (listingError || dataError) {
    return <div></div>;
  }
  if (!listings || listings.length === 0) {
    return <EmptyListingsState lang={lang}></EmptyListingsState>;
  }
  if (!selectedListing) {
    return <div></div>;
  }

  const closePanel = () => {
    setIsPanelOpen(false);
    setSelectedDayInfo(null);
  };

  const showDayDetailsPanel = !!selectedDayInfo;
  const isMobilePanelActive = isMobile && (isPanelOpen || showDayDetailsPanel);
  const panelContent = selectedDayInfo ? (
    <DayDetailsPanel
      lang={lang}
      dayInfo={selectedDayInfo}
      onDaySelect={handleDaySelection}
      listingId={selectedListing.id}
      refetchCalendar={refetchCalendar}
      priceMin={priceMin}
      priceMax={priceMax}
    />
  ) : (
    <Panel
      values={values}
      lang={lang}
      closePanel={closePanel}
      listingId={selectedListing.id}
      refetchCalendar={refetchCalendar}
      refetchValues={refetchValues}
      priceMin={priceMin}
      priceMax={priceMax}
      selectedListing={selectedListing}
    />
  );

  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };

  return (
    <div
      style={{ height: availableHeight }}
      className="flex flex-col gap-x-8 px-2 pt-6 md:flex-row md:px-8"
    >
      <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto md:w-9/12">
        <div className="flex items-center justify-end gap-2">
          <button
            className="btn btn-secondary btn-outline btn-circle rounded-full p-2 font-normal"
            onClick={openModalInfoCalendarOpen}
          >
            <InformationCircleSolidIcon className="h-5 w-5"></InformationCircleSolidIcon>
          </button>
          {isMobile && (
            <div className="flex items-center justify-end">
              <button
                className="cursor-pointer rounded-full p-2"
                onClick={() => {
                  setIsPanelOpen(!isPanelOpen);
                  setSelectedDayInfo(null);
                }}
              >
                <FilterIcon className="text-secondary h-6 w-6" />
              </button>
            </div>
          )}
          <button
            onClick={() => setIsModalListingOpen(true)}
            className="btn btn-outline btn-secondary flex items-center gap-2 rounded-full p-2 md:w-54"
          >
            <div className="h-6 w-6 flex-none rounded">
              <ResponsiveImage
                photo={selectedListing.photo || fallbackPhoto}
                alt={`listing-${selectedListing.id}`}
                className="h-6 w-6 rounded-full object-cover"
              ></ResponsiveImage>
            </div>
            <p className="hidden truncate text-xs font-normal md:block md:text-sm">
              {selectedListing.title}
            </p>
          </button>
        </div>
        {calendarData && values && (
          <Calendar
            lang={lang}
            onDaySelect={handleDaySelection}
            preSelectedDayInfo={selectedDayInfo}
            calendarData={calendarData}
            values={values}
          />
        )}
      </div>

      {!isMobile && (
        <div className="hide-scrollbar w-full overflow-y-auto md:w-3/12">
          {panelContent}
        </div>
      )}

      {isMobile && (
        <AnimatePresence mode="wait">
          {isMobilePanelActive && (
            <motion.div
              key={showDayDetailsPanel ? 'day-details-mobile' : 'panel-mobile'}
              initial={{ y: '100%', opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.7 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="relative h-11/12 rounded-t-lg"
            >
              <div className="pt-5">{panelContent}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <ModalSelectListing
        open={isModalListingOpen}
        onClose={() => setIsModalListingOpen(false)}
        listings={listings}
        selectedListing={selectedListing}
        handleListingSelect={handleListingSelect}
        lang={lang}
        multiple={false}
      ></ModalSelectListing>
      <ModalInfoCalendar
        lang={lang}
        isOpen={isModalInfoCalendarOpen}
        close={closeModalInfoCalendarOpen}
      ></ModalInfoCalendar>
    </div>
  );
}
