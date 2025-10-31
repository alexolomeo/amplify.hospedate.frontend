import { cleanObjectRemoveNulls } from '@/components/React/Hooks/useHasChanged';
import type {
  Availability,
  UpdateAvailability,
} from '@/types/host/calendar/availability';
import type { HostCalendar } from '@/types/host/calendar/hostCalendar';
import type {
  CalendarPreferenceSettingCatalog,
  CalendarPreferenceSettingValues,
  UpdateCalendarPreferenceSetting,
} from '@/types/host/calendar/preferenceSetting';
import type { SyncStatusResponse } from '@/types/host/calendar/sync';
import api from '@/utils/api.ts';

export const fetchCalendarPreferenceSettingValue = async (
  listingId: number
): Promise<CalendarPreferenceSettingValues | null> => {
  try {
    const { data } = await api.get<CalendarPreferenceSettingValues>(
      `/hostings/listings/${encodeURIComponent(listingId)}/calendars/settings/values`
    );
    return data;
  } catch (error) {
    console.error(
      'Failed to fetch Calendar Preferences Settings values',
      error
    );
    return null;
  }
};

export const fetchCalendarPreferenceSettingCatalog =
  async (): Promise<CalendarPreferenceSettingCatalog | null> => {
    try {
      const { data } = await api.get<CalendarPreferenceSettingCatalog>(
        `/hostings/listings/calendars/settings/catalogs`
      );
      return data;
    } catch (error) {
      console.error(
        'Failed to fetch Calendar Preferences Settings catalog',
        error
      );
      return null;
    }
  };

export const fetchCalendar = async (
  listingId: string
): Promise<HostCalendar | null> => {
  try {
    const { data } = await api.get<HostCalendar>(
      `/hostings/listings/${encodeURIComponent(listingId)}/calendars`
    );
    return data;
  } catch (error) {
    console.error('Failed to fetch Calendar', error);
    return null;
  }
};

export const fetchCalendarAvailability = async (
  listingId: number,
  dates: Date[]
): Promise<Availability | null> => {
  try {
    const queryParams = new URLSearchParams();
    dates.forEach((date) => {
      const dateString = date.toISOString().split('T')[0];
      queryParams.append('dates', dateString);
    });

    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/availability?${queryParams.toString()}`;
    const { data } = await api.get<Availability>(url);
    return data;
  } catch (error) {
    console.error('Failed to fetch Calendar', error);
    return null;
  }
};

export const updateCalendarAvailability = async (
  listingId: number,
  dates: Date[],
  body: UpdateAvailability
): Promise<boolean> => {
  try {
    const queryParams = new URLSearchParams();

    dates.forEach((date) => {
      const dateString = date.toISOString().split('T')[0];
      queryParams.append('dates', dateString);
    });
    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/availability?${queryParams.toString()}`;
    const cleanedBody = cleanObjectRemoveNulls(body);
    await api.post<Availability>(url, cleanedBody);
    return true;
  } catch (error) {
    console.error('Failed to update Calendar availability', error);
    return false;
  }
};

export const updateCalendarPreferenceSetting = async (
  listingId: number,
  body: UpdateCalendarPreferenceSetting
): Promise<boolean> => {
  try {
    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/settings/values`;
    await api.patch(url, body);
    return true;
  } catch (error) {
    console.error('Failed to update Calendar preference settings', error);
    return false;
  }
};

export const addCalendarSync = async (
  listingId: number,
  nameCalendar: string,
  urlCalendar: string
): Promise<number | null> => {
  try {
    const body = {
      name: nameCalendar,
      url: urlCalendar,
    };
    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/syncs`;
    const { data } = await api.post(url, body);
    return data.id;
  } catch (error) {
    console.error('Failed to add calendar sync', error);
    return null;
  }
};

export const deleteCalendarSync = async (
  listingId: number,
  calendarSyncId: number
): Promise<boolean> => {
  try {
    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/syncs/${encodeURIComponent(calendarSyncId)}`;
    await api.delete(url);
    return true;
  } catch (error) {
    console.error('Failed to update Calendar preference settings', error);
    return false;
  }
};

export const startCalendarSync = async (
  listingId: number,
  calendarSyncId: number
): Promise<boolean> => {
  try {
    const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/syncs/${encodeURIComponent(calendarSyncId)}`;
    await api.post(url);
    return true;
  } catch (error) {
    console.error('Failed to update Calendar preference settings', error);
    return false;
  }
};

export const getCalendarSyncStatus = async (
  listingId: number,
  calendarSyncId: number
): Promise<SyncStatusResponse> => {
  const url = `/hostings/listings/${encodeURIComponent(listingId)}/calendars/syncs/${encodeURIComponent(calendarSyncId)}/status`;

  try {
    const response = await api.get<SyncStatusResponse>(url);
    return response.data;
  } catch (error) {
    console.error('Failed to get calendar sync status', error);
    throw new Error('Failed to get calendar sync status');
  }
};
