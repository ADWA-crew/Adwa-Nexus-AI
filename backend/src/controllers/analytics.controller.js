import * as analyticsService from '../services/analytics.service.js';
import { success } from '../utils/apiResponse.js';

export async function getStats(req, res, next) {
  try {
    const stats = await analyticsService.getOverviewStats();
    return success(res, stats);
  } catch (error) {
    return next(error);
  }
}

export async function getVisitorStats(req, res, next) {
  try {
    const stats = await analyticsService.getVisitorStats();
    return success(res, stats);
  } catch (error) {
    return next(error);
  }
}
