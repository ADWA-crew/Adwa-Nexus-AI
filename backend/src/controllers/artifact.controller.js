import * as artifactService from '../services/artifact.service.js';
import { success } from '../utils/apiResponse.js';

export async function list(req, res, next) {
  try {
    const result = await artifactService.listArtifacts(req.query);
    return success(res, result, 'Artifacts retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const artifact = await artifactService.getArtifactById(req.params.id);
    return success(res, artifact, 'Artifact retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function create(req, res, next) {
  try {
    const artifact = await artifactService.createArtifact(req.body, req.user?.id ?? null);
    return success(res, artifact, 'Artifact created', 201);
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const artifact = await artifactService.updateArtifact(req.params.id, req.body);
    return success(res, artifact, 'Artifact updated');
  } catch (err) {
    return next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const artifact = await artifactService.updateArtifactStatus(
      req.params.id,
      req.body.status
    );
    return success(res, artifact, 'Artifact status updated');
  } catch (err) {
    return next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const result = await artifactService.deleteArtifact(req.params.id);
    return success(res, result, 'Artifact deleted');
  } catch (err) {
    return next(err);
  }
}
