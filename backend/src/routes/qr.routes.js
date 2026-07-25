import { Router } from 'express';
import * as qrController from '../controllers/qr.controller.js';

const router = Router();

router.post('/resolve', qrController.resolveBody);
router.get('/:code', qrController.resolve);

export default router;
