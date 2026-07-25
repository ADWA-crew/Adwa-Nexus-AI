import * as routeService from '../services/route.service.js';

export async function list(req, res, next) {
  try {
    const routes = await routeService.listRoutes({
      profile: req.query.profile,
    });
    return res.json({ data: routes });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const route = await routeService.getRouteById(req.params.id);
    return res.json({ data: route });
  } catch (error) {
    return next(error);
  }
}
