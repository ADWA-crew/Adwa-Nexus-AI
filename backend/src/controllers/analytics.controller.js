import * as analyticsService from '../services/analytics.service.js';

export async function getStats(req, res, next) {
  try {
    const stats = await analyticsService.getOverviewStats();
    return res.json({ data: stats });
  } catch (error) {
    return next(error);
  }
}

export async function getVisitorStats(req, res, next) {
  try {
    const stats = await analyticsService.getVisitorStats();
    return res.json({ data: stats });
  } catch (error) {
    return next(error);
  }
}
