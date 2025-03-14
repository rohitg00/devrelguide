import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Custom hook for fetching visualization data with fallback
 */
export function useFetchVisualization<T>(endpoint: string, fallbackData: T) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if API is available (port 8001 is running)
  const isApiAvailable = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(1000) // 1 second timeout
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  };

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // First check if API is available
      const apiAvailable = await isApiAvailable();
      
      if (!apiAvailable) {
        console.log('API not available, using fallback data');
        setData(fallbackData);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      
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