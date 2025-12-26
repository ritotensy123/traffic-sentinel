import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { ApiResponse } from '../types/index.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(
    {
      err,
      requestId: req.id,
      method: req.method,
      url: req.url,
    },
    'Request error'
  );

  if (err instanceof ZodError) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Validation error',
    };
    res.status(400).json(response);
    return;
  }

  const response: ApiResponse<never> = {
    success: false,
    error: env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  };

  res.status(500).json(response);
}

