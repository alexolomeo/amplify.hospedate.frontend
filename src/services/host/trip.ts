import api from '@/utils/api';

export const patchTripRequest = async (
  tripId: string,
  { isConfirmed }: { isConfirmed: boolean }
): Promise<boolean> => {
  try {
    await api.patch(
      `/hostings/trips/${tripId}/change-status`,
      { isConfirmed },
      {
        skipGlobal404Redirect: true,
      }
    );
    return true;
  } catch (error) {
    console.error(`Failed to patch trip status for id ${tripId}`, error);
    return false;
  }
};
