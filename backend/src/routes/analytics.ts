import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { ApiResponse } from '../types/index.js';
import * as analyticsService from '../services/analyticsService.js';

export const analyticsRouter = Router();

analyticsRouter.get('/api/analytics/summary', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await analyticsService.getDashboardMetrics(req.query);
    const response: ApiResponse<typeof metrics> = {
      success: true,
      data: metrics,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/api/analytics/timeseries', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await analyticsService.getTimeSeriesData(req.query);
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

analyticsRouter.get('/api/analytics/detailed', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const analytics = await analyticsService.getDetailedAnalytics(req.query);
    const response: ApiResponse<typeof analytics> = {
      success: true,
      data: analytics,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
});

