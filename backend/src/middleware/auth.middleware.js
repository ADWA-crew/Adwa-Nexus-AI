import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { verifyStaffToken } from '../utils/tokens.js';

const VISITOR_TOKEN_HEADER = 'x-visitor-token';

export async function requireVisitorSession(req, res, next) {
  try {
    const token = req.header(VISITOR_TOKEN_HEADER);

    if (!token) {
      throw new AppError('Visitor session token is required', 401, 'VISITOR_TOKEN_REQUIRED');
    }

    const session = await prisma.visitorSession.findUnique({
      where: { token },
    });

    if (!session) {
      throw new AppError('Invalid visitor session', 401, 'VISITOR_SESSION_INVALID');
    }

    if (session.endedAt) {
      throw new AppError('Visitor session has ended', 401, 'VISITOR_SESSION_ENDED');
    }

    const now = new Date();
    await prisma.visitorSession.update({
      where: { id: session.id },
      data: { lastActiveAt: now },
    });

    req.visitorSession = { ...session, lastActiveAt: now };
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function requireStaffAuth(req, res, next) {
  try {
    const header = req.header('authorization') || '';
    const [, token] = header.split(' ');

    if (!token) {
      throw new AppError('Staff token required', 401, 'STAFF_TOKEN_REQUIRED');
    }

    let payload;
    try {
      payload = verifyStaffToken(token);
    } catch {
      throw new AppError('Invalid or expired staff token', 401, 'STAFF_TOKEN_INVALID');
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new AppError('Staff user not found', 401, 'STAFF_NOT_FOUND');
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
    }
    return next();
  };
}
