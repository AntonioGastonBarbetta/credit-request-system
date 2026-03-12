import { useState, useEffect } from 'react';

export function useApi<T>(promise: Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    promise
      .then((d) => {
        if (mounted) setData(d);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [promise]);
  return { data, loading };
}
