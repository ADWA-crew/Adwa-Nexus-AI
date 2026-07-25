import { Router } from 'express';
import * as routeController from '../controllers/route.controller.js';

const router = Router();

router.get('/', routeController.list);
router.get('/:id', routeController.getById);

export default router;
