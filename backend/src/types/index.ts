export interface LogEvent {
  serviceName: string;
  timestamp: Date;
  statusCode: number;
  latencyMs: number;
  originIp: string;
}

export interface AnalyticsQuery {
  startTime: Date;
  endTime: Date;
  serviceName?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

