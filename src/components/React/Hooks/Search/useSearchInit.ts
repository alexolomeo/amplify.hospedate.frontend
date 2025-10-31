import { useEffect, useState } from 'react';

export const useSearchInit = (loadFromUrl: () => void) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const initializeSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        loadFromUrl();
        setLoading(false);
      } catch (err) {
        console.error('Error initializing search:', err);
        setError('Failed to initialize search. Please try again.');
        setLoading(false);
      }
    };
    initializeSearch();
  }, [loadFromUrl]);

  return { loading, error };
};
