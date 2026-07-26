import * as routeService from '../services/route.service.js';
<<<<<<< HEAD
import { success } from '../utils/apiResponse.js';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

export async function list(req, res, next) {
  try {
    const routes = await routeService.listRoutes({
      profile: req.query.profile,
<<<<<<< HEAD
      museumId: req.query.museumId,
    });
    return success(res, routes, { count: routes.length });
=======
    });
    return res.json({ data: routes });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const route = await routeService.getRouteById(req.params.id);
<<<<<<< HEAD
    return success(res, route);
=======
    return res.json({ data: route });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}
