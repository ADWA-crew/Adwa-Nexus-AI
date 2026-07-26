import * as museumService from '../services/museum.service.js';
<<<<<<< HEAD
import { success } from '../utils/apiResponse.js';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

export async function list(req, res, next) {
  try {
    const museums = await museumService.listMuseums({
      status: req.query.status,
    });
<<<<<<< HEAD
    return success(res, museums, { count: museums.length });
=======
    return res.json({ data: museums });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const museum = await museumService.getMuseumById(req.params.id);
<<<<<<< HEAD
    return success(res, museum);
=======
    return res.json({ data: museum });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}
