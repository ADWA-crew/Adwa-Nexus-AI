import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { validateAdminLogin } from '../validators/admin.validator.js';

const router = Router();

// Public admin login
router.post('/auth/login', validate(validateAdminLogin), adminController.login);

// Protected admin routes
router.use(requireAuth, requireRole(['ADMIN', 'CURATOR']));

router.get('/dashboard', adminController.dashboard);
router.get('/visitors', adminController.visitors);
router.get('/artifacts', adminController.artifacts);
router.get('/reports', adminController.reports);

export default router;
