import { Router } from 'express';
import * as museumController from '../controllers/museum.controller.js';

const router = Router();

router.get('/', museumController.list);
router.get('/:id', museumController.getById);

export default router;
