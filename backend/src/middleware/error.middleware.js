import { fail } from '../utils/apiResponse.js';

export function notFoundHandler(req, res) {
  return fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  if (err.code === 'P2025') {
    return fail(res, 'Record not found', 404);
  }
  if (err.code === 'P2003') {
    return fail(res, 'Related record not found', 400);
  }
  if (err.code === 'P2002') {
    return fail(res, 'Duplicate record', 409);
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return fail(res, message, status);
}

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
