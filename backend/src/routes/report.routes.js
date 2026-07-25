import { Router } from 'express';
import * as reportController from '../controllers/report.controller.js';
import { requireStaffAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/engagement', requireStaffAuth, reportController.engagement);

export default router;
