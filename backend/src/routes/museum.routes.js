import { Router } from 'express';
import * as museumController from '../controllers/museum.controller.js';

const router = Router();

router.get('/', museumController.getMuseum);
router.get('/map', museumController.getMap);
router.get('/routes', museumController.listRoutes);
router.get('/routes/:id', museumController.getRouteById);

export default router;
