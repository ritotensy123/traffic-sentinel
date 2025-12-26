import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchRecentLogs } from '../api/analytics.js';
import { LogFilters, RecentLog } from '../types/index.js';

interface UseLogsResult {
  logs: RecentLog[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  setPage: (page: number) => void;
  setFilters: (filters: LogFilters) => void;
}

export function useLogs(): UseLogsResult {
  const [logs, setLogs] = useState<RecentLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPageState] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFiltersState] = useState<LogFilters>({});
  const [fetchTrigger, setFetchTrigger] = useState(0);
  
  const isMountedRef = useRef(true);
  const isFirstLoadRef = useRef(true);

  const doFetch = useCallback(async (currentPage: number, currentFilters: LogFilters, showLoading: boolean) => {
    if (showLoading) {
      setIsLoading(true);
    }
    
    try {
      const response = await fetchRecentLogs({
        ...currentFilters,
        page: currentPage,
        limit: 10
      });
      
      if (isMountedRef.current) {
        setLogs(response.logs || []);
        setTotal(response.total || 0);
        setTotalPages(response.totalPages || 0);
        setIsLoading(false);
        isFirstLoadRef.current = false;
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
        isFirstLoadRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    doFetch(page, filters, isFirstLoadRef.current);
    
    const intervalId = setInterval(() => {
      doFetch(page, filters, false);
    }, 5000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [page, fetchTrigger, doFetch, filters]);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const setFilters = useCallback((newFilters: LogFilters) => {
    setFiltersState(newFilters);
    setPageState(1);
    setFetchTrigger(prev => prev + 1);
  }, []);

  return {
    logs,
    total,
    page,
    totalPages,
    isLoading,
    setPage,
    setFilters
  };
}
