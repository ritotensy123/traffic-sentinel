import { Router } from 'express';
import { ApiResponse } from '../types/index.js';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  const response: ApiResponse<{ status: string; timestamp: string }> = {
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  };
  res.json(response);
});

