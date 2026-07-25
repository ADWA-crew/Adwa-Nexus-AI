import * as researchService from '../services/research.service.js';
import { success } from '../utils/apiResponse.js';

export async function listExhibits(req, res, next) {
  try {
    const data = await researchService.listExhibits();
    return success(res, data, 'Research exhibits retrieved');
  } catch (err) {
    return next(err);
  }
}

export async function getExhibit(req, res, next) {
  try {
    const data = await researchService.getExhibitByCode(req.params.code);
    return success(res, data, 'Research exhibit retrieved');
  } catch (err) {
    return next(err);
  }
}
