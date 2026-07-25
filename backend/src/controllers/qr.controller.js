import * as artifactService from '../services/artifact.service.js';
import { success } from '../utils/apiResponse.js';

/** GET /qr/:code — resolve a printed QR payload to an exhibit DTO */
export async function resolve(req, res, next) {
  try {
    const exhibit = await artifactService.resolveByQrPayload(req.params.code);
    return success(res, exhibit);
  } catch (error) {
    return next(error);
  }
}

/** POST /qr/resolve { payload } — same, for full URL bodies from scanners */
export async function resolveBody(req, res, next) {
  try {
    const payload = req.body?.payload ?? req.body?.code ?? req.body?.url;
    const exhibit = await artifactService.resolveByQrPayload(payload);
    return success(res, exhibit);
  } catch (error) {
    return next(error);
  }
}
