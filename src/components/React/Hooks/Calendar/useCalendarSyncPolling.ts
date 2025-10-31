import { useEffect, useRef, useState } from 'react';
import {
  getCalendarSyncStatus,
  startCalendarSync,
  addCalendarSync,
} from '@/services/host/calendar';
import { SyncStatus } from '@/types/host/calendar/sync';

interface UseCalendarSyncPollingProps {
  listingId: number;
  maxAttempts?: number;
  delaySeconds?: number;
}

interface PollingState {
  calendarId: number | null;
  isPolling: boolean;
  status: SyncStatus | null;
  message: string | null;
}

/**
 * Custom hook for managing calendar synchronization polling operations.
 * Handles both adding new calendars and updating existing ones with real-time status polling.
 *
 * @param listingId - The ID of the listing to sync calendars for
 * @param maxAttempts - Maximum number of polling attempts (default: 25)
 * @param delaySeconds - Delay between polling attempts in seconds (default: 5)
 * @returns Object containing polling state and control functions
 */

export const useCalendarSyncPolling = ({
  listingId,
  maxAttempts = 25,
  delaySeconds = 5,
}: UseCalendarSyncPollingProps) => {
  const [pollingState, setPollingState] = useState<PollingState>({
    calendarId: null,
    isPolling: false,
    status: null,
    message: null,
  });

  const isActiveRef = useRef(true);

  useEffect(() => {
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  const updatePollingState = (updates: Partial<PollingState>) => {
    if (!isActiveRef.current) return;
    setPollingState((prev) => ({ ...prev, ...updates }));
  };

  const pollStatus = async (id: number) => {
    let attempts = 0;

    try {
      while (attempts < maxAttempts && isActiveRef.current) {
        await new Promise((resolve) =>
          setTimeout(resolve, delaySeconds * 1000)
        );
        if (!isActiveRef.current) return;
        attempts++;
        const statusData = await getCalendarSyncStatus(listingId, id);
        console.log(
          `Polling attempt ${attempts} for calendar ${id}:`,
          statusData
        );
        if (statusData.status === SyncStatus.Success) {
          updatePollingState({
            calendarId: id,
            isPolling: false,
            status: SyncStatus.Success,
            message: statusData.message ?? 'Sync successful.',
          });
          return;
        }

        if (statusData.status === SyncStatus.Failed) {
          updatePollingState({
            calendarId: id,
            isPolling: false,
            status: SyncStatus.Failed,
            message: statusData.message ?? 'Sync failed.',
          });
          return;
        }
      }
      updatePollingState({
        calendarId: id,
        isPolling: false,
        status: SyncStatus.Failed,
        message: 'Sync process timed out.',
      });
    } catch (e) {
      console.error('Calendar sync polling failed:', e);
      const errorMessage =
        e instanceof Error
          ? `Sync failed: ${e.message}`
          : 'An unexpected error occurred during sync.';

      if (!isActiveRef.current) return;

      updatePollingState({
        calendarId: id,
        isPolling: false,
        status: SyncStatus.Failed,
        message: errorMessage,
      });
    }
  };

  // Function to start an existing synchronization
  const startUpdatePolling = async (calendarId: number) => {
    if (!calendarId || calendarId <= 0) {
      console.error('Invalid calendarId provided to startUpdatePolling');
      return;
    }
    updatePollingState({
      calendarId,
      isPolling: true,
      status: null,
      message: null,
    });

    const success = await startCalendarSync(listingId, calendarId);
    console.log(`Start sync for calendar ${calendarId}:`, success);
    if (success) {
      await pollStatus(calendarId);
    } else {
      updatePollingState({
        calendarId,
        isPolling: false,
        status: SyncStatus.Failed,
        message: 'Failed to start sync process.',
      });
    }
  };

  // Function to initiate synchronization of a new calendar
  const startAddPolling = async (name: string, url: string) => {
    if (!name?.trim() || !url?.trim()) {
      console.error('Name and URL are required for startAddPolling');
      return;
    }
    updatePollingState({
      calendarId: null,
      isPolling: true,
      status: null,
      message: null,
    });

    const newCalendarId = await addCalendarSync(listingId, name, url);
    console.log(`Add calendar result:`, newCalendarId);
    if (newCalendarId) {
      await pollStatus(newCalendarId);
    } else {
      updatePollingState({
        calendarId: null,
        isPolling: false,
        status: SyncStatus.Failed,
        message: 'Failed to add calendar.',
      });
    }
  };

  return { ...pollingState, startUpdatePolling, startAddPolling };
};
