import { useState, useEffect } from 'react';
import type { Listing } from '@/types/host/listing';
import type { SelectedDayInfo } from '../../Host/Calendar/CalendarContainer';
import { isContinuousRange } from '@/utils/calendarHelpers';

export const useCalendarState = (
  initialListing: Listing | null,
  initialDayInfo: SelectedDayInfo | null
) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(
    initialListing
  );
  const [selectedDayInfo, setSelectedDayInfo] =
    useState<SelectedDayInfo | null>(initialDayInfo);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isModalListingOpen, setIsModalListingOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialListing !== selectedListing) {
      setSelectedListing(initialListing);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialListing]);

  useEffect(() => {
    if (initialDayInfo !== selectedDayInfo) {
      setSelectedDayInfo(initialDayInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDayInfo]);

  const handleDaySelection = (dayInfo: SelectedDayInfo | null) => {
    setSelectedDayInfo(dayInfo);
    if (dayInfo && selectedListing && isContinuousRange(dayInfo.dates)) {
      const sortedDates = [...dayInfo.dates].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      const startStr = sortedDates[0].toISOString().split('T')[0];
      const endStr = sortedDates[sortedDates.length - 1]
        .toISOString()
        .split('T')[0];
      const newUrl = `/hosting/calendar/${selectedListing.id}/dates/${startStr}/${endStr}`;
      window.history.pushState({}, '', newUrl);
    } else if (selectedListing) {
      const newUrl = `/hosting/calendar/${selectedListing.id}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    const newUrl = `/hosting/calendar/${listing.id}`;
    window.history.pushState({}, '', newUrl);
    setSelectedDayInfo(null);
  };

  return {
    isPanelOpen,
    setIsPanelOpen,
    selectedDayInfo,
    setSelectedDayInfo,
    handleDaySelection,
    selectedListing,
    handleListingSelect,
    isModalListingOpen,
    setIsModalListingOpen,
  };
};
