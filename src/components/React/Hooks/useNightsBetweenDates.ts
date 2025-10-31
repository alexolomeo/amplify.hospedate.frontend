import { useMemo } from 'react';

export function useNightsBetweenDates(
  startDate: string,
  endDate: string
): number {
  return useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const msPerDay = 1000 * 60 * 60 * 24;
    const diffMs = end.getTime() - start.getTime();

    const nights = Math.floor(diffMs / msPerDay);
    return nights > 0 ? nights : 0;
  }, [startDate, endDate]);
}
