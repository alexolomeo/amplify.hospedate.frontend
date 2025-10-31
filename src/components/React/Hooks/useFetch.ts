import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

export function useFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const fetchData = useCallback(
    async (isRetry = false) => {
      try {
        if (isRetry) {
          setIsRetrying(true);
          setError(null);
        } else {
          setIsLoading(true);
          setError(null);
        }
        const result = await fetcher();
        setData(result);
      } catch (err) {
        if (err && typeof err === 'object' && 'isAxiosError' in err) {
          const axiosError = err as AxiosError;
          let errorMessage: string | undefined;
          const data = axiosError.response?.data;
          function hasMessage(obj: unknown): obj is { message: string } {
            return (
              typeof obj === 'object' &&
              obj !== null &&
              'message' in obj &&
              typeof (obj as { message: unknown }).message === 'string'
            );
          }
          if (hasMessage(data)) {
            errorMessage = data.message;
          } else if (typeof data === 'string') {
            errorMessage = data;
          } else {
            errorMessage = axiosError.message;
          }
          setError(errorMessage || 'Unknown error');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setIsLoading(false);
        setIsRetrying(false);
      }
    },
    [fetcher]
  );

  // Initial fetch can be triggered in the component with useEffect(() => { fetchData(); }, []);
  const retry = () => fetchData(true);

  return { data, isLoading, error, isRetrying, fetchData, retry };
}
