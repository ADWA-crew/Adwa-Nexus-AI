import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireStaffAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { loginSchema } from '../validators/admin.validator.js';

const router = Router();

router.post('/auth/login', validate(loginSchema), adminController.login);
router.get('/me', requireStaffAuth, adminController.me);

export default router;
