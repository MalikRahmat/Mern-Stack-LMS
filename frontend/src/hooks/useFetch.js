import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction(...args);
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred');
      setLoading(false);
      throw err;
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, setData };
};

export default useFetch;
