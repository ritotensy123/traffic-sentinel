import { z } from 'zod';

const SERVICE_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const DEFAULT_START_TIME = () => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
const DEFAULT_END_TIME = () => new Date().toISOString();

export const analyticsQuerySchema = z
  .object({
    startTime: z.string().datetime().optional().default(DEFAULT_START_TIME),
    endTime: z.string().datetime().optional().default(DEFAULT_END_TIME),
    serviceName: z
      .string()
      .regex(SERVICE_NAME_REGEX, 'Service name must contain only alphanumeric characters, hyphens, and underscores')
      .optional(),
    granularity: z.enum(['minute', 'hour', 'day']).optional().default('hour'),
  })
  .refine(
    (data) => {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      return start < end;
    },
    'startTime must be before endTime'
  );

export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;

export const logFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().min(1).max(100).optional(),
  serviceName: z
    .string()
    .regex(SERVICE_NAME_REGEX, 'Service name must contain only alphanumeric characters, hyphens, and underscores')
    .optional(),
  statusCode: z.string().regex(/^(2xx|3xx|4xx|5xx|\d{3})$/, 'Status code must be 2xx, 3xx, 4xx, 5xx, or a specific 3-digit code').optional(),
});

export type LogFiltersInput = z.infer<typeof logFiltersSchema>;

