import { fail } from '../utils/apiResponse.js';

/**
 * Runs a validator function (req) => errors[] | null
 */
export function validate(validatorFn) {
  return (req, res, next) => {
    const errors = validatorFn(req);
    if (errors && errors.length > 0) {
      return fail(res, 'Validation failed', 400, errors);
    }
    return next();
  };
}
