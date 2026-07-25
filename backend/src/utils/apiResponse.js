export function success(res, data = null, meta = undefined, status = 200) {
  const body = { success: true, data, error: null };
  if (meta !== undefined) {
    body.meta = meta;
  }
  return res.status(status).json(body);
}

export function fail(res, error, status = 400) {
  const payload =
    typeof error === 'string'
      ? { message: error }
      : {
          message: error.message || 'Request failed',
          ...(error.code ? { code: error.code } : {}),
          ...(error.details ? { details: error.details } : {}),
        };

  return res.status(status).json({
    success: false,
    data: null,
    error: payload,
  });
}

export class AppError extends Error {
  constructor(message, status = 400, code = undefined, details = undefined) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
