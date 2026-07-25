export function validateAdminLogin(req) {
  const errors = [];
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.push({ field: 'email', message: 'email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({ field: 'email', message: 'email must be valid' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push({ field: 'password', message: 'password must be at least 6 characters' });
  }

  return errors;
}
