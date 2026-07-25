import * as adminService from '../services/admin.service.js';
import { success } from '../utils/apiResponse.js';

export async function login(req, res, next) {
  try {
    const result = await adminService.loginAdmin(req.body);
    return success(res, result, 'Login successful');
  } catch (err) {
    return next(err);
  }
}

export async function dashboard(req, res, next) {
  try {
    const data = await adminService.getDashboard();
    return success(res, data, 'Dashboard statistics retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function visitors(req, res, next) {
  try {
    const data = await adminService.listVisitors(req.query);
    return success(res, data, 'Visitors retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function artifacts(req, res, next) {
  try {
    const data = await adminService.listAdminArtifacts(req.query);
    return success(res, data, 'Admin artifacts retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function reports(req, res, next) {
  try {
    const result = await adminService.getReports(req.query);

    if (req.query.format === 'csv') {
      const csv = adminService.reportsToCsv(result.report);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="admin-report.csv"');
      return res.status(200).send(csv);
    }

    return success(res, result.report, 'Reports retrieved');
  } catch (err) {
    return next(err);
  }
}
