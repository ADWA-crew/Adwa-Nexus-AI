<<<<<<< HEAD
import * as reportService from '../services/report.service.js';
import { success } from '../utils/apiResponse.js';

export async function engagement(req, res, next) {
  try {
    const report = await reportService.getEngagementReport();
    return success(res, report);
  } catch (error) {
    return next(error);
  }
=======
// Reserved for report export (PDF/CSV) — not used by current frontend.
export function notImplemented(req, res) {
  return res.status(501).json({
    success: false,
    data: null,
    error: { message: 'Reports not implemented yet', code: 'NOT_IMPLEMENTED' },
  });
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
}
