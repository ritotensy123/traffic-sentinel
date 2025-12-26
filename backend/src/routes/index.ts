import { Router } from 'express';
import { healthRouter } from './health.js';
import { logsRouter } from './logs.js';
import { analyticsRouter } from './analytics.js';

export const router = Router();

router.use(healthRouter);
router.use(logsRouter);
router.use(analyticsRouter);

