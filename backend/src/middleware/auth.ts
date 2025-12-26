import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { ApiResponse } from '../types/index.js';

declare global {
  namespace Express {
    interface Request {
      isAuthenticated: boolean;
    }
  }
}
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || typeof apiKey !== 'string') {
    const response: ApiResponse<never> = {
      success: false,
      error: 'API key required',
    };
    res.status(401).json(response);
    return;
  }

  try {
    const isValid = await bcrypt.compare(apiKey, env.API_KEY_HASH);
    
    if (!isValid) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Invalid API key',
      };
      res.status(403).json(response);
      return;
    }
    req.isAuthenticated = true;
    next();
  } catch (error) {
    const response: ApiResponse<never> = {
      success: false,
      error: 'Authentication error',
    };
    res.status(500).json(response);
  }
}

