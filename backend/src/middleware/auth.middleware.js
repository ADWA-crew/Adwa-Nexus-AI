import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { fail } from '../utils/apiResponse.js';

/**
 * Auth contract: req.user = { id, role, email?, name? }
 * Supports:
 * - Authorization: Bearer <JWT> (from admin login)
 * - x-user-id + optional x-user-role (hackathon stub)
 */
export function optionalAuth(req, _res, next) {
  req.user = extractUser(req);
  next();
}

export function requireAuth(req, res, next) {
  const user = extractUser(req);
  if (!user?.id) {
    return fail(res, 'Authentication required', 401);
  }
  req.user = user;
  return next();
}

export function requireRole(roles = []) {
  return (req, res, next) => {
    if (!req.user?.id) {
      return fail(res, 'Authentication required', 401);
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return fail(res, 'Forbidden', 403);
    }
    return next();
  };
}

export function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    env.jwtSecret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

function extractUser(req) {
  const headerId = req.headers['x-user-id'];
  const headerRole = req.headers['x-user-role'] || 'CURATOR';

  if (headerId) {
    return {
      id: String(headerId),
      role: String(headerRole).toUpperCase(),
    };
  }

  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;

  const token = auth.slice(7).trim();
  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    return {
      id: decoded.id,
      role: (decoded.role || 'VIEWER').toUpperCase(),
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    return null;
  }
}
