import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';

const router = Router();

router.get('/stats', analyticsController.getStats);
router.get('/visitors', analyticsController.getVisitorStats);

export default router;
