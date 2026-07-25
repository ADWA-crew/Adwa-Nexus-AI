import { AppError, fail } from '../utils/apiResponse.js';

export function notFoundHandler(req, res) {
  return fail(res, { message: `Route not found: ${req.method} ${req.originalUrl}`, code: 'NOT_FOUND' }, 404);
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return fail(
      res,
      { message: err.message, code: err.code, details: err.details },
      err.status,
    );
  }

  if (err?.name === 'ZodError') {
    return fail(
      res,
      {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: err.flatten?.() ?? err.errors,
      },
      400,
    );
  }

  console.error(err);
  return fail(
    res,
    {
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
      code: 'INTERNAL_ERROR',
    },
    500,
  );
}
