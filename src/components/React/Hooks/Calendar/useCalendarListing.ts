import { useEffect, useState } from 'react';
import { fetchHostListings } from '@/services/host/listings';
import { navigate } from 'astro:transitions/client';
import type { Listing } from '@/types/host/listing';
import type { SelectedDayInfo } from '../../Host/Calendar/CalendarContainer';

interface CalendarDataState {
  listings: Listing[] | null;
  selectedListing: Listing | null;
  selectedDayInfo: SelectedDayInfo | null;
  isLoading: boolean;
  error: string | null;
}

interface CalendarDataProps {
  listingIdFromUrl?: number;
  action?: string;
  startDate?: string;
  endDate?: string;
}

export const useCalendarListing = ({
  listingIdFromUrl,
  action,
  startDate,
  endDate,
}: CalendarDataProps) => {
  const [state, setState] = useState<CalendarDataState>({
    listings: null,
    selectedListing: null,
    selectedDayInfo: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const getListings = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchHostListings();
        const listings = data?.results || [];
        let currentListing = null;
        let urlChangeNeeded = false;

        if (listingIdFromUrl) {
          const found = listings.find((l) => l.id === listingIdFromUrl);
          currentListing = found || listings[0];
          if (!found) {
            urlChangeNeeded = true;
          }
        } else if (listings.length > 0) {
          currentListing = listings[0];
          urlChangeNeeded = true;
        }

        if (urlChangeNeeded && currentListing) {
          navigate(`/hosting/calendar/${currentListing.id}`);
        }

        const selectedDayInfoFromUrl: SelectedDayInfo | null =
          action === 'dates' && startDate && endDate
            ? (() => {
                const dates = [];
                const start = new Date(`${startDate}T00:00:00`);
                const end = new Date(`${endDate}T00:00:00`);
                const currentDate = new Date(start);
                while (currentDate <= end) {
                  dates.push(new Date(currentDate));
                  currentDate.setDate(currentDate.getDate() + 1);
                }
                return { dates };
              })()
            : null;

        setState((prev) => ({
          ...prev,
          listings,
          selectedListing: currentListing,
          selectedDayInfo: selectedDayInfoFromUrl,
          isLoading: false,
        }));
      } catch (error) {
        console.error('[useCalendarListing] Error fetching listings:', error);
        setState((prev) => ({
          ...prev,
          error: 'Error fetching listings',
          listings: [],
          isLoading: false,
        }));
      }
    };
    getListings();
  }, [listingIdFromUrl, action, startDate, endDate]);

  return state;
};
