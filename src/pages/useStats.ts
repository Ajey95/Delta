// hooks/useStats.ts
import { fetchWithAuth } from '../services/apiUtils';
import { useEffect, useState } from 'react';
import { Stats } from './types';
export const useStats = () => {
  const [stats, setStats] = useState<Stats>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchWithAuth('/stats');
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, error, isLoading };
};