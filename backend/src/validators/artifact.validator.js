const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export function validateCreateArtifact(req) {
  const errors = [];
  const { museumId, title, status, galleryId } = req.body || {};

  if (!museumId || typeof museumId !== 'string') {
    errors.push({ field: 'museumId', message: 'museumId is required' });
  }
  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push({ field: 'title', message: 'title is required' });
  }
  if (status && !STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `status must be one of: ${STATUSES.join(', ')}` });
  }
  if (galleryId !== undefined && galleryId !== null && typeof galleryId !== 'string') {
    errors.push({ field: 'galleryId', message: 'galleryId must be a string or null' });
  }

  return errors;
}

export function validateUpdateArtifact(req) {
  const errors = [];
  const body = req.body || {};

  if (Object.keys(body).length === 0) {
    errors.push({ field: 'body', message: 'At least one field is required' });
  }
  if (body.title !== undefined && (typeof body.title !== 'string' || !body.title.trim())) {
    errors.push({ field: 'title', message: 'title must be a non-empty string' });
  }
  if (body.status !== undefined && !STATUSES.includes(body.status)) {
    errors.push({ field: 'status', message: `status must be one of: ${STATUSES.join(', ')}` });
  }
  if (body.museumId !== undefined && (typeof body.museumId !== 'string' || !body.museumId)) {
    errors.push({ field: 'museumId', message: 'museumId must be a non-empty string' });
  }

  return errors;
}

export function validateArtifactStatus(req) {
  const errors = [];
  const { status } = req.body || {};

  if (!status || !STATUSES.includes(status)) {
    errors.push({ field: 'status', message: `status must be one of: ${STATUSES.join(', ')}` });
  }

  return errors;
}
