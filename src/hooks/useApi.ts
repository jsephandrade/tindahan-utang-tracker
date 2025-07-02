
// CUSTOM HOOK: API operations with loading states and error handling
// This hook provides a consistent way to handle API calls across the application

import { useState, useCallback } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export const useApi = <T = any>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // API CALL: Execute the provided API function
      const result = await apiCall(...args);
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(errorMessage));
      }
      
      console.error('API Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// CUSTOM HOOK: For fetching data on component mount
export const useApiData = <T = any>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiReturn<T> & { refetch: () => void } => {
  const { data, loading, error, execute, reset } = useApi(apiCall);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  // Fetch data on mount and when dependencies change
  React.useEffect(() => {
    execute();
  }, dependencies);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    refetch,
  };
};

export default useApi;
