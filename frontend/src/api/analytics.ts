import { fetchFromApi } from './client';
import { AnalyticsSummary, TimeSeriesPoint, StatusDistribution, RecentLog, PaginatedResponse, LogFilters } from '../types';

interface SummaryResponse {
  totalRequests: number;
  errorRate: number;
  averageLatency: number;
  timeRange: {
    start: string;
    end: string;
  };
}

interface TimeSeriesResponse {
  timeSeries: Array<{ bucket: string; count: number }>;
  granularity: string;
  timeRange: {
    start: string;
    end: string;
  };
}

interface DetailedResponse {
  summary: AnalyticsSummary;
  statusDistribution: StatusDistribution[];
  timeSeries: TimeSeriesPoint[];
}

export async function fetchSummary(): Promise<AnalyticsSummary> {
  const data = await fetchFromApi<SummaryResponse>('/api/analytics/summary');
  return {
    totalRequests: data.totalRequests,
    errorRate: data.errorRate,
    averageLatency: data.averageLatency,
  };
}

export async function fetchTimeSeries(): Promise<TimeSeriesPoint[]> {
  const data = await fetchFromApi<TimeSeriesResponse>('/api/analytics/timeseries');
  return data.timeSeries;
}

export async function fetchDetailed(startTime?: string, endTime?: string): Promise<DetailedResponse> {
  const params = new URLSearchParams();
  if (startTime) params.append('startTime', startTime);
  if (endTime) params.append('endTime', endTime);
  
  const query = params.toString();
  return await fetchFromApi<DetailedResponse>(`/api/analytics/detailed${query ? `?${query}` : ''}`);
}

export async function fetchRecentLogs(filters?: LogFilters): Promise<PaginatedResponse<RecentLog>> {
  const params = new URLSearchParams();
  
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.serviceName) params.append('serviceName', filters.serviceName);
  if (filters?.statusCode) params.append('statusCode', filters.statusCode);
  if (filters?.startTime) params.append('startTime', filters.startTime);
  
  const query = params.toString();
  return await fetchFromApi<PaginatedResponse<RecentLog>>(`/api/logs/recent${query ? `?${query}` : ''}`);
}

export async function fetchAvailableServices(): Promise<string[]> {
  return await fetchFromApi<string[]>('/api/logs/services');
}

