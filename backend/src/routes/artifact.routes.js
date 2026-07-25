import { Router } from 'express';
import * as artifactController from '../controllers/artifact.controller.js';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import {
  validateCreateArtifact,
  validateUpdateArtifact,
  validateArtifactStatus,
} from '../validators/artifact.validator.js';

const router = Router();

router.get('/', optionalAuth, artifactController.list);
router.get('/:id', optionalAuth, artifactController.getById);

router.post(
  '/',
  requireAuth,
  requireRole(['ADMIN', 'CURATOR']),
  validate(validateCreateArtifact),
  artifactController.create
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'CURATOR']),
  validate(validateUpdateArtifact),
  artifactController.update
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole(['ADMIN', 'CURATOR']),
  validate(validateArtifactStatus),
  artifactController.updateStatus
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(['ADMIN', 'CURATOR']),
  artifactController.remove
);

export default router;
