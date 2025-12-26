import { logEventSchema, batchLogEventsSchema } from '../validators/logSchema.js';
import * as logRepository from '../repositories/logRepository.js';

export async function processLog(log: unknown) {
  const validated = logEventSchema.parse(log);
  const inserted = await logRepository.insertLog(validated);
  return inserted;
}

export async function processLogsBatch(logs: unknown) {
  const validated = batchLogEventsSchema.parse(logs);
  const count = await logRepository.insertLogsBatch(validated);
  return { inserted: count };
}

export async function fetchRecentLogs(limit?: number, offset?: number) {
  const logs = await logRepository.getRecentLogs(limit, offset);
  return logs;
}

export async function fetchLogsWithFilters(filters: logRepository.LogFilters) {
  const result = await logRepository.getLogsWithFilters(filters);
  return result;
}

export async function fetchAvailableServices() {
  const services = await logRepository.getAvailableServices();
  return services;
}

