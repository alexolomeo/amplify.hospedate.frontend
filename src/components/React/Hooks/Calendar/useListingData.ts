import { useState, useEffect, useCallback } from 'react';
import {
  fetchCalendar,
  fetchCalendarPreferenceSettingValue,
} from '@/services/host/calendar';
import type { HostCalendar } from '@/types/host/calendar/hostCalendar';
import type { CalendarPreferenceSettingValues } from '@/types/host/calendar/preferenceSetting';

interface UseListingDataResult {
  calendarData: HostCalendar | null;
  values: CalendarPreferenceSettingValues | null;
  isLoading: boolean;
  isLoadingCalendar: boolean;
  error: string | null;
  refetchCalendar: () => Promise<void>;
  refetchValues: () => Promise<void>;
}

export const useListingData = (
  listingId: number | null
): UseListingDataResult => {
  const [calendarData, setCalendarData] = useState<HostCalendar | null>(null);
  const [values, setValues] = useState<CalendarPreferenceSettingValues | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetchCalendar = useCallback(async () => {
    if (!listingId) {
      setError('Listing ID is missing or invalid.');
      return;
    }
    setIsLoadingCalendar(true);
    setError(null);
    try {
      const calendarResult = await fetchCalendar(String(listingId));
      if (calendarResult) {
        setCalendarData(calendarResult);
      } else {
        setError('Failed to fetch calendar data.');
      }
    } catch (err) {
      console.error('An error occurred during calendar API call:', err);
      setError('An unexpected error occurred.');
    } finally {
      setIsLoadingCalendar(false);
    }
  }, [listingId]);

  const refetchValues = useCallback(async () => {
    if (!listingId) {
      setError('Listing ID is missing or invalid.');
      return;
    }
    setError(null);
    try {
      const valuesResult = await fetchCalendarPreferenceSettingValue(listingId);
      if (valuesResult) {
        setValues(valuesResult);
      } else {
        setError('Failed to fetch settings values.');
      }
    } catch (err) {
      console.error('An error occurred during values API call:', err);
      setError('An unexpected error occurred.');
    }
  }, [listingId]);

  useEffect(() => {
    if (!listingId) {
      setIsLoading(false);
      setError('Listing ID is missing or invalid.');
      return;
    }
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [calendarResult, valuesResult] = await Promise.all([
          fetchCalendar(String(listingId)),
          fetchCalendarPreferenceSettingValue(listingId),
        ]);
        if (calendarResult) {
          setCalendarData(calendarResult);
        } else {
          setError('Failed to fetch calendar data.');
        }
        if (valuesResult) {
          setValues(valuesResult);
        } else {
          setError('Failed to fetch settings values.');
        }
      } catch (err) {
        console.error('An error occurred during API calls:', err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [listingId]);

  return {
    calendarData,
    values,
    isLoading,
    isLoadingCalendar,
    error,
    refetchCalendar,
    refetchValues,
  };
};
