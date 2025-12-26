import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  API_URL: z.string().url().default('http://backend:4000'),
  API_KEY: z.string().min(1),
  REQUESTS_PER_SECOND: z.coerce.number().int().min(1).max(100).default(10),
  BATCH_SIZE: z.coerce.number().int().min(1).max(500).default(50),
  SERVICE_NAMES: z
    .string()
    .default('auth-service,user-service,payment-service,order-service,inventory-service,notification-service'),
});

const parseResult = configSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Configuration validation failed:', parseResult.error.format());
  process.exit(1);
}

export const config = {
  ...parseResult.data,
  serviceNames: parseResult.data.SERVICE_NAMES.split(',').map((s) => s.trim()).filter(Boolean),
};

