import { Router } from 'express';
import * as researchController from '../controllers/research.controller.js';

const router = Router();

router.get('/exhibits', researchController.listExhibits);
router.get('/exhibits/:code', researchController.getExhibit);

export default router;
