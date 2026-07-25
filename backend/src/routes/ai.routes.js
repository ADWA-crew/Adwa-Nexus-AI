import { Router } from 'express';
import multer from 'multer';
import * as aiController from '../controllers/ai.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { chatSchema } from '../validators/ai.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
});

const router = Router();

router.get('/languages', aiController.listLanguages);
router.post('/chat', validate(chatSchema), aiController.chat);
router.post('/voice', upload.single('audio'), aiController.voice);

export default router;
