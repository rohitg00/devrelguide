import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching visualization data with fallback
 */
export function useFetchVisualization<T>(endpoint: string, fallbackData: T) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(`Error fetching visualization data: ${err}`);
      setError(err instanceof Error ? err : new Error(String(err)));
      // Fall back to sample data on error
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Retry function
  const retry = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  return { data, loading, error, retry };
} 