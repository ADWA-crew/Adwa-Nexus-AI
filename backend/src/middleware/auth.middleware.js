import { fail } from '../utils/apiResponse.js';

/**
 * Auth contract: req.user = { id, role, email?, name? }
 * Until JWT auth is fully wired, accepts:
 * - Authorization: Bearer <base64 JSON payload> (dev)
 * - x-user-id + optional x-user-role headers (hackathon stub)
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
    // Dev-friendly: allow base64-encoded JSON { id, role }
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (decoded?.id) {
      return {
        id: decoded.id,
        role: (decoded.role || 'VIEWER').toUpperCase(),
        email: decoded.email,
        name: decoded.name,
      };
    }
  } catch {
    // Real JWT verification can replace this later
  }

  return null;
}
