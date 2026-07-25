import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signStaffToken(user, expiresIn = '7d') {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn },
  );
}

export function verifyStaffToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
