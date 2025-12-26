export interface AnalyticsSummary {
  totalRequests: number;
  errorRate: number;
  averageLatency: number;
}

export interface TimeSeriesPoint {
  bucket: string;
  count: number;
}

export interface StatusDistribution {
  status_code: string;
  count: number;
}

export interface RecentLog {
  id: string;
  service_name: string;
  timestamp: string;
  status_code: number;
  latency_ms: number;
  origin_ip: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  logs: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface LogFilters {
  page?: number;
  limit?: number;
  search?: string;
  serviceName?: string;
  statusCode?: string;
  startTime?: string;
}

