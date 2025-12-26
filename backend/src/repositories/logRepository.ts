import { pool } from '../database/pool.js';
import { LogEventInput } from '../validators/logSchema.js';

export interface LogRow {
  id: string;
  service_name: string;
  timestamp: Date;
  status_code: number;
  latency_ms: number;
  origin_ip: string;
  created_at: Date;
}

export async function insertLog(log: LogEventInput): Promise<LogRow> {
  const query = `
    INSERT INTO logs (service_name, timestamp, status_code, latency_ms, origin_ip)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, service_name, timestamp, status_code, latency_ms, origin_ip, created_at
  `;

  const values = [log.serviceName, log.timestamp, log.statusCode, log.latencyMs, log.originIp];

  const result = await pool.query<LogRow>(query, values);
  return result.rows[0];
}

export async function insertLogsBatch(logs: LogEventInput[]): Promise<number> {
  if (logs.length === 0) {
    return 0;
  }

  const values: unknown[] = [];
  const valuePlaceholders: string[] = [];

  logs.forEach((log, index) => {
    const offset = index * 5;
    valuePlaceholders.push(
      `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
    );
    values.push(log.serviceName, log.timestamp, log.statusCode, log.latencyMs, log.originIp);
  });

  const query = `
    INSERT INTO logs (service_name, timestamp, status_code, latency_ms, origin_ip)
    VALUES ${valuePlaceholders.join(', ')}
  `;

  const result = await pool.query(query, values);
  return result.rowCount || 0;
}

export async function getRecentLogs(limit: number = 100, offset: number = 0): Promise<LogRow[]> {
  const sanitizedLimit = Math.min(Math.max(1, limit), 500);
  const sanitizedOffset = Math.max(0, offset);

  const query = `
    SELECT id, service_name, timestamp, status_code, latency_ms, origin_ip, created_at
    FROM logs
    ORDER BY timestamp DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query<LogRow>(query, [sanitizedLimit, sanitizedOffset]);
  return result.rows;
}

export interface LogFilters {
  page: number;
  limit: number;
  search?: string;
  serviceName?: string;
  statusCode?: string;
  startTime?: string;
}

export interface PaginatedLogs {
  logs: LogRow[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getLogsWithFilters(filters: LogFilters): Promise<PaginatedLogs> {
  const { page, limit, search, serviceName, statusCode, startTime } = filters;
  const offset = (page - 1) * limit;
  
  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(service_name ILIKE $${paramIndex} OR origin_ip::text ILIKE $${paramIndex})`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (serviceName) {
    conditions.push(`service_name = $${paramIndex}`);
    params.push(serviceName);
    paramIndex++;
  }

  if (statusCode) {
    if (statusCode === '2xx') {
      conditions.push(`status_code >= 200 AND status_code < 300`);
    } else if (statusCode === '3xx') {
      conditions.push(`status_code >= 300 AND status_code < 400`);
    } else if (statusCode === '4xx') {
      conditions.push(`status_code >= 400 AND status_code < 500`);
    } else if (statusCode === '5xx') {
      conditions.push(`status_code >= 500 AND status_code < 600`);
    } else {
      conditions.push(`status_code = $${paramIndex}`);
      params.push(parseInt(statusCode, 10));
      paramIndex++;
    }
  }

  if (startTime) {
    conditions.push(`timestamp >= $${paramIndex}`);
    params.push(startTime);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) as total FROM logs ${whereClause}`;
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total, 10);

  const dataQuery = `
    SELECT id, service_name, timestamp, status_code, latency_ms, origin_ip, created_at
    FROM logs
    ${whereClause}
    ORDER BY timestamp DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;
  
  const dataParams = [...params, limit, offset];
  const dataResult = await pool.query<LogRow>(dataQuery, dataParams);

  return {
    logs: dataResult.rows,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAvailableServices(): Promise<string[]> {
  const query = `
    SELECT DISTINCT service_name
    FROM logs
    ORDER BY service_name
  `;

  const result = await pool.query<{ service_name: string }>(query);
  return result.rows.map((row) => row.service_name);
}

