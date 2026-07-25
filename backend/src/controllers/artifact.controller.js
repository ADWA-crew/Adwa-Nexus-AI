import * as artifactService from '../services/artifact.service.js';

export async function list(req, res, next) {
  try {
    const artifacts = await artifactService.listPublishedArtifacts({
      museumId: req.query.museumId,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    return res.json({ data: artifacts });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const artifact = await artifactService.getPublishedArtifactById(req.params.id);
    return res.json({ data: artifact });
  } catch (error) {
    return next(error);
  }
}
