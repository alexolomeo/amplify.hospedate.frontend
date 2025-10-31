import {
  addCalendarSync,
  deleteCalendarSync,
  startCalendarSync,
} from '@/services/host/calendar';
import api from '@/utils/api';
import { describe, it, vi, expect, beforeEach, type Mock } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Calendar Sync Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  describe('addCalendarSync', () => {
    it('should return the calendar ID and call the API with the correct data on success', async () => {
      // Mock a successful API response that returns a calendar ID
      (api.post as Mock).mockResolvedValueOnce({
        status: 200,
        data: { id: 456 },
      });

      const listingId = 123;
      const name = 'Airbnb Calendar';
      const url = 'http://hospedate.com/calendar.ics';
      const result = await addCalendarSync(listingId, name, url);

      // ✅ Expect the result to be the ID, not a boolean
      expect(result).toBe(456);
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        `/hostings/listings/${listingId}/calendars/syncs`,
        { name: name, url: url }
      );
    });

    it('should return null and catch the error if the API call fails', async () => {
      // Mock a failed API response
      (api.post as Mock).mockRejectedValueOnce(new Error('API error'));

      const listingId = 123;
      const name = 'Airbnb Calendar';
      const url = 'http://hospedate.com/calendar.ics';

      const result = await addCalendarSync(listingId, name, url);

      // ✅ Expect the result to be null, not false
      expect(result).toBeNull();
      expect(api.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCalendarSync', () => {
    it('should return true and call the API with the correct IDs on success', async () => {
      (api.delete as Mock).mockResolvedValueOnce({ status: 204 });
      const listingId = 123;
      const calendarSyncId = 456;
      const result = await deleteCalendarSync(listingId, calendarSyncId);
      expect(result).toBe(true);
      expect(api.delete).toHaveBeenCalledTimes(1);
      expect(api.delete).toHaveBeenCalledWith(
        `/hostings/listings/${listingId}/calendars/syncs/${calendarSyncId}`
      );
    });

    it('should return false and catch the error if the API call fails', async () => {
      (api.delete as Mock).mockRejectedValueOnce(new Error('API error'));

      const listingId = 123;
      const calendarSyncId = 456;
      const result = await deleteCalendarSync(listingId, calendarSyncId);

      expect(result).toBe(false);
      expect(api.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('calendarSync', () => {
    it('should return true and call the API with the correct IDs on success', async () => {
      (api.post as Mock).mockResolvedValueOnce({ status: 200 });
      const listingId = 123;
      const calendarSyncId = 456;
      const result = await startCalendarSync(listingId, calendarSyncId);
      expect(result).toBe(true);
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith(
        `/hostings/listings/${listingId}/calendars/syncs/${calendarSyncId}`
      );
    });

    it('should return false and catch the error if the API call fails', async () => {
      (api.post as Mock).mockRejectedValueOnce(new Error('API error'));
      const listingId = 123;
      const calendarSyncId = 456;
      const result = await startCalendarSync(listingId, calendarSyncId);
      expect(result).toBe(false);
      expect(api.post).toHaveBeenCalledTimes(1);
    });
  });
});
