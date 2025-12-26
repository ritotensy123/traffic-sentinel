import { analyticsQuerySchema } from '../validators/analyticsSchema.js';
import * as analyticsRepository from '../repositories/analyticsRepository.js';

export async function getDashboardMetrics(query: unknown) {
  const validated = analyticsQuerySchema.parse(query);
  const startTime = new Date(validated.startTime);
  const endTime = new Date(validated.endTime);

  const [totalRequests, errorRate, averageLatency] = await Promise.all([
    analyticsRepository.getTotalRequests(startTime, endTime, validated.serviceName),
    analyticsRepository.getErrorRate(startTime, endTime, validated.serviceName),
    analyticsRepository.getAverageLatency(startTime, endTime, validated.serviceName),
  ]);
  return {
    totalRequests,
    errorRate,
    averageLatency,
    timeRange: {
      start: validated.startTime,
      end: validated.endTime,
    },
  };
}
export async function getTimeSeriesData(query: unknown) {
  const validated = analyticsQuerySchema.parse(query);
  const startTime = new Date(validated.startTime);
  const endTime = new Date(validated.endTime);

  const timeSeries = await analyticsRepository.getRequestsOverTime(
    startTime,
    endTime,
    validated.granularity,
    validated.serviceName
  );

  return {
    timeSeries,
    granularity: validated.granularity,
    timeRange: {
      start: validated.startTime,
      end: validated.endTime,
    },
  };
}
export async function getDetailedAnalytics(query: unknown) {
  const validated = analyticsQuerySchema.parse(query);
  const startTime = new Date(validated.startTime);
  const endTime = new Date(validated.endTime);
  const [
    totalRequests,
    errorRate,
    averageLatency,
    statusDistribution,
    latencyPercentiles,
    topServices,
    timeSeries,
  ] = await Promise.all([
    analyticsRepository.getTotalRequests(startTime, endTime, validated.serviceName),
    analyticsRepository.getErrorRate(startTime, endTime, validated.serviceName),
    analyticsRepository.getAverageLatency(startTime, endTime, validated.serviceName),
    analyticsRepository.getStatusDistribution(startTime, endTime, validated.serviceName),
    analyticsRepository.getLatencyPercentiles(startTime, endTime, validated.serviceName),
    analyticsRepository.getTopServices(startTime, endTime, 10),
    analyticsRepository.getRequestsOverTime(
      startTime,
      endTime,
      validated.granularity,
      validated.serviceName
    ),
  ]);
  return {
    summary: {
      totalRequests,
      errorRate,
      averageLatency,
    },
    statusDistribution,
    latencyPercentiles,
    topServices,
    timeSeries,
    timeRange: {
      start: validated.startTime,
      end: validated.endTime,
    },
    granularity: validated.granularity,
  };
}

