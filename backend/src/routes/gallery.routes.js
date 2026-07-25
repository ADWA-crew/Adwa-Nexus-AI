import { Router } from 'express';
import * as galleryController from '../controllers/gallery.controller.js';

const router = Router();

router.get('/', galleryController.list);
router.get('/:id', galleryController.getById);

export default router;
