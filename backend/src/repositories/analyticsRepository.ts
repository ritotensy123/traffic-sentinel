import { pool } from '../database/pool.js';

export interface TimeSeriesDataPoint {
  bucket: Date;
  count: number;
}

export interface StatusDistribution {
  status_code: string;
  count: number;
}

export interface TopService {
  service_name: string;
  request_count: number;
}

export interface LatencyPercentiles {
  p50: number;
  p95: number;
  p99: number;
}

export async function getTotalRequests(
  startTime: Date,
  endTime: Date,
  serviceName?: string
): Promise<number> {
  const query = serviceName
    ? `SELECT COUNT(*) as total FROM logs WHERE timestamp >= $1 AND timestamp <= $2 AND service_name = $3`
    : `SELECT COUNT(*) as total FROM logs WHERE timestamp >= $1 AND timestamp <= $2`;

  const values = serviceName ? [startTime, endTime, serviceName] : [startTime, endTime];

  const result = await pool.query<{ total: string }>(query, values);
  return parseInt(result.rows[0].total, 10);
}

export async function getErrorRate(
  startTime: Date,
  endTime: Date,
  serviceName?: string
): Promise<number> {
  const query = serviceName
    ? `
      SELECT 
        COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
        COUNT(*) as total_count
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2 AND service_name = $3
    `
    : `
      SELECT 
        COUNT(*) FILTER (WHERE status_code >= 400) as error_count,
        COUNT(*) as total_count
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2
    `;

  const values = serviceName ? [startTime, endTime, serviceName] : [startTime, endTime];

  const result = await pool.query<{ error_count: string; total_count: string }>(query, values);
  const errorCount = parseInt(result.rows[0].error_count, 10);
  const totalCount = parseInt(result.rows[0].total_count, 10);

  return totalCount > 0 ? (errorCount / totalCount) * 100 : 0;
}

export async function getAverageLatency(
  startTime: Date,
  endTime: Date,
  serviceName?: string
): Promise<number> {
  const query = serviceName
    ? `SELECT AVG(latency_ms) as avg_latency FROM logs WHERE timestamp >= $1 AND timestamp <= $2 AND service_name = $3`
    : `SELECT AVG(latency_ms) as avg_latency FROM logs WHERE timestamp >= $1 AND timestamp <= $2`;

  const values = serviceName ? [startTime, endTime, serviceName] : [startTime, endTime];

  const result = await pool.query<{ avg_latency: number | null }>(query, values);
  return result.rows[0].avg_latency || 0;
}

export async function getStatusDistribution(
  startTime: Date,
  endTime: Date,
  serviceName?: string
): Promise<StatusDistribution[]> {
  const query = serviceName
    ? `
      SELECT 
        CASE 
          WHEN status_code >= 200 AND status_code < 300 THEN '2xx'
          WHEN status_code >= 300 AND status_code < 400 THEN '3xx'
          WHEN status_code >= 400 AND status_code < 500 THEN '4xx'
          WHEN status_code >= 500 AND status_code < 600 THEN '5xx'
          ELSE 'other'
        END as status_group,
        COUNT(*)::integer as count
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2 AND service_name = $3
      GROUP BY 
        CASE 
          WHEN status_code >= 200 AND status_code < 300 THEN '2xx'
          WHEN status_code >= 300 AND status_code < 400 THEN '3xx'
          WHEN status_code >= 400 AND status_code < 500 THEN '4xx'
          WHEN status_code >= 500 AND status_code < 600 THEN '5xx'
          ELSE 'other'
        END
      ORDER BY status_group
    `
    : `
      SELECT 
        CASE 
          WHEN status_code >= 200 AND status_code < 300 THEN '2xx'
          WHEN status_code >= 300 AND status_code < 400 THEN '3xx'
          WHEN status_code >= 400 AND status_code < 500 THEN '4xx'
          WHEN status_code >= 500 AND status_code < 600 THEN '5xx'
          ELSE 'other'
        END as status_group,
        COUNT(*)::integer as count
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2
      GROUP BY 
        CASE 
          WHEN status_code >= 200 AND status_code < 300 THEN '2xx'
          WHEN status_code >= 300 AND status_code < 400 THEN '3xx'
          WHEN status_code >= 400 AND status_code < 500 THEN '4xx'
          WHEN status_code >= 500 AND status_code < 600 THEN '5xx'
          ELSE 'other'
        END
      ORDER BY status_group
    `;

  const values = serviceName ? [startTime, endTime, serviceName] : [startTime, endTime];

  const result = await pool.query<{ status_group: string; count: number }>(query, values);
  return result.rows.map((row) => ({
    status_code: row.status_group,
    count: row.count,
  }));
}

export async function getRequestsOverTime(
  startTime: Date,
  endTime: Date,
  granularity: 'minute' | 'hour' | 'day',
  serviceName?: string
): Promise<TimeSeriesDataPoint[]> {
  const intervalMap = {
    minute: '1 minute',
    hour: '1 hour',
    day: '1 day',
  };

  const query = serviceName
    ? `
      SELECT time_bucket($1, timestamp) as bucket, COUNT(*) as count
      FROM logs
      WHERE timestamp >= $2 AND timestamp <= $3 AND service_name = $4
      GROUP BY bucket
      ORDER BY bucket
    `
    : `
      SELECT time_bucket($1, timestamp) as bucket, COUNT(*) as count
      FROM logs
      WHERE timestamp >= $2 AND timestamp <= $3
      GROUP BY bucket
      ORDER BY bucket
    `;

  const values = serviceName
    ? [intervalMap[granularity], startTime, endTime, serviceName]
    : [intervalMap[granularity], startTime, endTime];

  const result = await pool.query<{ bucket: Date; count: string }>(query, values);
  return result.rows.map((row) => ({
    bucket: row.bucket,
    count: parseInt(row.count, 10),
  }));
}

export async function getLatencyPercentiles(
  startTime: Date,
  endTime: Date,
  serviceName?: string
): Promise<LatencyPercentiles> {
  const query = serviceName
    ? `
      SELECT
        percentile_cont(0.50) WITHIN GROUP (ORDER BY latency_ms) as p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2 AND service_name = $3
    `
    : `
      SELECT
        percentile_cont(0.50) WITHIN GROUP (ORDER BY latency_ms) as p50,
        percentile_cont(0.95) WITHIN GROUP (ORDER BY latency_ms) as p95,
        percentile_cont(0.99) WITHIN GROUP (ORDER BY latency_ms) as p99
      FROM logs
      WHERE timestamp >= $1 AND timestamp <= $2
    `;

  const values = serviceName ? [startTime, endTime, serviceName] : [startTime, endTime];

  const result = await pool.query<LatencyPercentiles>(query, values);
  return result.rows[0] || { p50: 0, p95: 0, p99: 0 };
}

export async function getTopServices(startTime: Date, endTime: Date, limit: number): Promise<TopService[]> {
  const query = `
    SELECT service_name, COUNT(*) as request_count
    FROM logs
    WHERE timestamp >= $1 AND timestamp <= $2
    GROUP BY service_name
    ORDER BY request_count DESC
    LIMIT $3
  `;

  const result = await pool.query<{ service_name: string; request_count: string }>(query, [
    startTime,
    endTime,
    limit,
  ]);

  return result.rows.map((row) => ({
    service_name: row.service_name,
    request_count: parseInt(row.request_count, 10),
  }));
}


