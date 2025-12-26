import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
import * as logService from '../services/logService.js';

export const logsRouter = Router();

logsRouter.post('/api/logs', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await logService.processLog(req.body);
    const response: ApiResponse<typeof log> = {
      success: true,
      data: log,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

logsRouter.post('/api/logs/batch', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await logService.processLogsBatch(req.body);
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

logsRouter.get('/api/logs/services', authMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await logService.fetchAvailableServices();
    const response: ApiResponse<typeof services> = {
      success: true,
      data: services,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

logsRouter.get('/api/logs/recent', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
      search: req.query.search as string | undefined,
      serviceName: req.query.serviceName as string | undefined,
      statusCode: req.query.statusCode as string | undefined,
      startTime: req.query.startTime as string | undefined,
    };

    const result = await logService.fetchLogsWithFilters(filters);
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

