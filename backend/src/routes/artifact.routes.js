import { Router } from 'express';
import * as artifactController from '../controllers/artifact.controller.js';

const router = Router();

router.get('/', artifactController.list);
router.get('/:id', artifactController.getById);

export default router;
