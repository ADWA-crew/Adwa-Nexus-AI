import * as galleryService from '../services/gallery.service.js';
import { success } from '../utils/apiResponse.js';

export async function list(req, res, next) {
  try {
    const galleries = await galleryService.listGalleries({
      museumId: req.query.museumId,
    });
    return success(res, galleries, { count: galleries.length });
  } catch (error) {
    return next(error);
  }
}

export async function getById(req, res, next) {
  try {
    const gallery = await galleryService.getGalleryById(req.params.id);
    return success(res, gallery);
  } catch (error) {
    return next(error);
  }
}
