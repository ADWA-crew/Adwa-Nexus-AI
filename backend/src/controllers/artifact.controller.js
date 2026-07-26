import * as artifactService from '../services/artifact.service.js';
<<<<<<< HEAD
import { success } from '../utils/apiResponse.js';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

export async function list(req, res, next) {
  try {
    const artifacts = await artifactService.listPublishedArtifacts({
      museumId: req.query.museumId,
<<<<<<< HEAD
      galleryId: req.query.galleryId,
      category: req.query.category,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    return success(res, artifacts, { count: artifacts.length });
=======
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    return res.json({ data: artifacts });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const artifact = await artifactService.getPublishedArtifactById(req.params.id);
<<<<<<< HEAD
    return success(res, artifact);
  } catch (error) {
    return next(error);
  }
}

/** Alias used by FE exhibit pages: GET /artifacts/:id/exhibit */
export async function getExhibit(req, res, next) {
  try {
    const artifact = await artifactService.getPublishedArtifactById(req.params.id);
    return success(res, artifact);
=======
    return res.json({ data: artifact });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}
