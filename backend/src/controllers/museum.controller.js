import * as museumService from '../services/museum.service.js';
import { success } from '../utils/apiResponse.js';

export async function getMuseum(req, res, next) {
  try {
    const data = await museumService.getMuseum(req.query);
    return success(res, data, 'Museum retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function getMap(req, res, next) {
  try {
    const data = await museumService.getMuseumMap(req.query);
    return success(res, data, 'Museum map retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function listRoutes(req, res, next) {
  try {
    const data = await museumService.listMuseumRoutes(req.query);
    return success(res, data, 'Museum routes retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function getRouteById(req, res, next) {
  try {
    const data = await museumService.getMuseumRouteById(req.params.id, req.query);
    return success(res, data, 'Museum route retrieved');
  } catch (err) {
    return next(err);
  }
}
