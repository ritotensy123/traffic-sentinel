import express, { Express } from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import { requestIdMiddleware } from './requestId.js';
import { applySecurityHeaders } from './securityHeaders.js';
import { rateLimiter } from './rateLimiter.js';
import { errorHandler } from './errorHandler.js';

export function applyMiddleware(app: Express): void {
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      genReqId: (req: express.Request) => req.id,
      serializers: {
        req: (req: { id: string; method: string; url: string; remoteAddress?: string }) => ({
          id: req.id,
          method: req.method,
          url: req.url,
          remoteAddress: req.remoteAddress,
        }),
        res: (res: { statusCode: number }) => ({
          statusCode: res.statusCode,
        }),
      },
    })
  );
  applySecurityHeaders(app);
  const corsOptions = {
    origin:
      env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(rateLimiter);
  app.use(express.json({ limit: '1mb' }));
  app.use(errorHandler);
}

