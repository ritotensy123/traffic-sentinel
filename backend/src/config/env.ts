import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1),
  API_KEY_HASH: z.string().min(60),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(1000),
});
const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success) {
  console.error('Environment validation failed:', parseResult.error.format());
  process.exit(1);
}
export const env = parseResult.data;

