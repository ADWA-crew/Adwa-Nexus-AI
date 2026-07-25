import * as museumService from '../services/museum.service.js';

export async function list(req, res, next) {
  try {
    const museums = await museumService.listMuseums({
      status: req.query.status,
    });
    return res.json({ data: museums });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const museum = await museumService.getMuseumById(req.params.id);
    return res.json({ data: museum });
  } catch (error) {
    return next(error);
  }
}
