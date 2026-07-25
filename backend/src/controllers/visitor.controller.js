import * as visitorService from '../services/visitor.service.js';
import { success } from '../utils/apiResponse.js';

export async function createSession(req, res, next) {
  try {
    const data = await visitorService.createSession(req.body);
    return success(res, data, 'Visitor session created', 201);
  } catch (err) {
    return next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const data = await visitorService.getSessionByToken(req.params.sessionId);
    return success(res, data, 'Visitor session retrieved');
  } catch (err) {
    return next(err);
  }
}
