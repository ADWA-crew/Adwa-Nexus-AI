import { Router } from 'express';
import * as artifactController from '../controllers/artifact.controller.js';

const router = Router();

router.get('/', artifactController.list);
<<<<<<< HEAD
router.get('/:id/exhibit', artifactController.getExhibit);
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
router.get('/:id', artifactController.getById);

export default router;
