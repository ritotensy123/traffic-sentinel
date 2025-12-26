import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiResponse } from '../types/index.js';

// Temporarily increased to 10000 to prevent 429 errors while testing frontend fixes
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (_req) => {
    return _req.ip || 'unknown';
  },
  handler: (_req, res) => {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Too many requests, please try again later',
    };
    res.status(429).json(response);
  },
});

