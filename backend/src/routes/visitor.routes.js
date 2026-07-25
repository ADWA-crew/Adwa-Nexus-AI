import { Router } from 'express';
import * as visitorController from '../controllers/visitor.controller.js';
import { requireVisitorSession } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  startSessionSchema,
  updateProfileSchema,
  recordEventSchema,
  recommendationsQuerySchema,
} from '../validators/visitor.validator.js';

const router = Router();

router.post('/sessions', validate(startSessionSchema), visitorController.startSession);

router.get('/sessions/me', requireVisitorSession, visitorController.getSession);
router.get('/sessions/me/experience', requireVisitorSession, visitorController.getExperience);
router.post('/sessions/me/end', requireVisitorSession, visitorController.endSession);
router.patch(
  '/sessions/me/profile',
  requireVisitorSession,
  validate(updateProfileSchema),
  visitorController.updateMyProfile,
);

router.post(
  '/events',
  requireVisitorSession,
  validate(recordEventSchema),
  visitorController.recordEvent,
);
router.get('/events', requireVisitorSession, visitorController.listEvents);

router.get(
  '/recommendations',
  requireVisitorSession,
  validate(recommendationsQuerySchema, 'query'),
  visitorController.getRecommendations,
);

/** FE legacy-style paths: GET/PUT /api/visitors/:id */
router.get('/:id', visitorController.getById);
router.put('/:id', validate(updateProfileSchema), visitorController.updateProfile);

export default router;
