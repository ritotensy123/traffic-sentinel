import { z } from 'zod';

const SERVICE_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

const THIRTY_DAYS_AGO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::1|::)$/;

const isValidIp = (ip: string): boolean => {
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

export const logEventSchema = z.object({
  serviceName: z
    .string()
    .min(1)
    .max(64)
    .regex(SERVICE_NAME_REGEX, 'Service name must contain only alphanumeric characters, hyphens, and underscores'),
  timestamp: z
    .string()
    .datetime()
    .refine((val: string) => {
      const date = new Date(val);
      const now = new Date();
      return date <= now && date >= THIRTY_DAYS_AGO;
    }, 'Timestamp must not be in the future and not older than 30 days'),
  statusCode: z.number().int().min(100).max(599),
  latencyMs: z.number().int().min(0).max(300000),
  originIp: z.string().refine(isValidIp, 'Must be a valid IPv4 or IPv6 address'),
});

export const batchLogEventsSchema = z.array(logEventSchema).max(1000, 'Batch size cannot exceed 1000 logs');

export type LogEventInput = z.infer<typeof logEventSchema>;
export type BatchLogEventsInput = z.infer<typeof batchLogEventsSchema>;

