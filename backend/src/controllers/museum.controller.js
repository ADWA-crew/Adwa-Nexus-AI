import * as museumService from '../services/museum.service.js';
import { success } from '../utils/apiResponse.js';

export async function list(req, res, next) {
  try {
    const museums = await museumService.listMuseums({
      status: req.query.status,
    });
    return success(res, museums, { count: museums.length });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const museum = await museumService.getMuseumById(req.params.id);
    return success(res, museum);
  } catch (error) {
    return next(error);
  }
}
