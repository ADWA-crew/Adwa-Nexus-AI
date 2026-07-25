import { Router } from 'express';
import * as visitorController from '../controllers/visitor.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { validateCreateSession } from '../validators/visitor.validator.js';

const router = Router();

router.post(
  '/sessions',
  validate(validateCreateSession),
  visitorController.createSession
);

router.get('/sessions/:sessionId', visitorController.getSession);

export default router;
