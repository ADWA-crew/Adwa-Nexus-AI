import * as reportService from '../services/report.service.js';
import { success } from '../utils/apiResponse.js';

export async function engagement(req, res, next) {
  try {
    const report = await reportService.getEngagementReport();
    return success(res, report);
  } catch (error) {
    return next(error);
  }
}
