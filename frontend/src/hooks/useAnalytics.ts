import { useState, useEffect } from 'react';
import { fetchDetailed } from '../api/analytics.js';
import { AnalyticsSummary, TimeSeriesPoint, StatusDistribution } from '../types/index.js';

interface AnalyticsData {
  summary: AnalyticsSummary;
  timeSeries: TimeSeriesPoint[];
  statusDistribution: StatusDistribution[];
}

interface UseAnalyticsResult {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useAnalytics(): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;
    
    const doFetch = async (showLoading: boolean) => {
      if (showLoading) setIsLoading(true);
      
      try {
        const response = await fetchDetailed();
        
        if (isMounted) {
          setData(response);
          setLastUpdated(new Date());
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch');
          setIsLoading(false);
        }
      }
    };
    
    doFetch(true);
    
    intervalId = setInterval(() => doFetch(false), 5000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, isLoading, error, lastUpdated };
}
