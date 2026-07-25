import * as artifactService from '../services/artifact.service.js';
import { success } from '../utils/apiResponse.js';

export async function list(req, res, next) {
  try {
    const artifacts = await artifactService.listPublishedArtifacts({
      museumId: req.query.museumId,
      galleryId: req.query.galleryId,
      category: req.query.category,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    return success(res, artifacts, { count: artifacts.length });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const artifact = await artifactService.getPublishedArtifactById(req.params.id);
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
  } catch (error) {
    return next(error);
  }
}
