import * as analyticsService from '../services/analytics.service.js';
<<<<<<< HEAD
import { success } from '../utils/apiResponse.js';
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

export async function getStats(req, res, next) {
  try {
    const stats = await analyticsService.getOverviewStats();
<<<<<<< HEAD
    return success(res, stats);
=======
    return res.json({ data: stats });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}

export async function getVisitorStats(req, res, next) {
  try {
    const stats = await analyticsService.getVisitorStats();
<<<<<<< HEAD
    return success(res, stats);
=======
    return res.json({ data: stats });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  } catch (error) {
    return next(error);
  }
}
