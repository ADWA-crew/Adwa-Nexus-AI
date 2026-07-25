import { randomBytes } from 'crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import {
  buildExperienceConfig,
  deriveInterests,
  resolveExperienceProfile,
  resolveRedirectPath,
  resolveStoredVisitorType,
} from './personalization.service.js';

function generateToken() {
  return randomBytes(32).toString('hex');
}

function toVisitorDto(session) {
  return {
    fullName: session.fullName,
    visitorType: session.visitorType,
    ageGroup: session.ageGroup,
    education: session.education,
  };
}

function toSessionDto(session) {
  return {
    id: session.id,
    token: session.token,
    museumId: session.museumId,
    language: session.language,
    interests: session.interests,
    ageGroup: session.ageGroup,
    visitGoal: session.visitGoal,
    fullName: session.fullName,
    visitorType: session.visitorType,
    education: session.education,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    lastActiveAt: session.lastActiveAt,
  };
}

/**
 * FE contract (PersonalizationForm + mock):
 * { sessionId, token, createdAt, visitor, experience }
 */
export async function startSession(input = {}) {
  const museumId = input.museumId ?? 'seed-museum-adwa';

  if (museumId) {
    const museum = await prisma.museum.findUnique({ where: { id: museumId } });
    if (!museum) {
      throw new AppError('Museum not found', 404, 'MUSEUM_NOT_FOUND');
    }
  }

  // Demo: under18 → child, above18 → researcher (saved + used for experience)
  const visitorType = resolveStoredVisitorType(input.visitorType, input.ageGroup);
  const experienceProfile = resolveExperienceProfile(visitorType, input.ageGroup);
  const interests = deriveInterests(visitorType, input.education);
  const token = generateToken();

  const session = await prisma.visitorSession.create({
    data: {
      token,
      museumId,
      language: input.language ?? 'en',
      interests,
      ageGroup: input.ageGroup ?? null,
      visitGoal: visitorType,
      fullName: input.fullName,
      visitorType,
      education: input.education,
    },
  });

  await prisma.visitorEvent.createMany({
    data: [
      {
        sessionId: session.id,
        type: 'SESSION_START',
        metadata: {
          fullName: input.fullName,
          formVisitorType: input.visitorType,
          visitorType,
          ageGroup: input.ageGroup ?? null,
          education: input.education,
        },
      },
      {
        sessionId: session.id,
        type: 'PERSONALIZATION_UPDATE',
        metadata: {
          source: 'personalization_form',
          formVisitorType: input.visitorType,
          visitorType,
          ageGroup: input.ageGroup ?? null,
          education: input.education,
          interests,
          experienceProfile,
        },
      },
    ],
  });

  const experience = await buildExperienceConfig(session);

  return {
    sessionId: session.id,
    token: session.token,
    createdAt: session.startedAt.toISOString(),
    visitor: toVisitorDto(session),
    experience,
    // Hint for frontend navigation after successful submit
    redirectTo: resolveRedirectPath(experienceProfile),
  };
}

function parseSessionId(id) {
  const parsed = Number.parseInt(String(id), 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError('Invalid visitor session id', 400, 'INVALID_SESSION_ID');
  }
  return parsed;
}

export async function getSessionById(id) {
  const sessionId = parseSessionId(id);
  const session = await prisma.visitorSession.findUnique({ where: { id: sessionId } });
  if (!session || session.endedAt) {
    throw new AppError('Visitor session not found', 404, 'VISITOR_SESSION_NOT_FOUND');
  }
  return {
    sessionId: session.id,
    token: session.token,
    createdAt: session.startedAt.toISOString(),
    visitor: toVisitorDto(session),
    session: toSessionDto(session),
  };
}

export async function getSessionByToken(token) {
  const session = await prisma.visitorSession.findUnique({ where: { token } });
  if (!session) {
    throw new AppError('Invalid visitor session', 401, 'VISITOR_SESSION_INVALID');
  }
  if (session.endedAt) {
    throw new AppError('Visitor session has ended', 401, 'VISITOR_SESSION_ENDED');
  }
  return toSessionDto(session);
}

export async function endSession(sessionId) {
  const id = typeof sessionId === 'number' ? sessionId : parseSessionId(sessionId);
  const session = await prisma.visitorSession.findUnique({ where: { id } });
  if (!session) {
    throw new AppError('Invalid visitor session', 401, 'VISITOR_SESSION_INVALID');
  }
  if (session.endedAt) {
    return toSessionDto(session);
  }

  const ended = await prisma.$transaction(async (tx) => {
    const updated = await tx.visitorSession.update({
      where: { id },
      data: { endedAt: new Date(), lastActiveAt: new Date() },
    });
    await tx.visitorEvent.create({
      data: { sessionId: id, type: 'SESSION_END' },
    });
    return updated;
  });

  return toSessionDto(ended);
}

export async function updateProfile(sessionId, profile) {
  const id = typeof sessionId === 'number' ? sessionId : parseSessionId(sessionId);
  const current = await prisma.visitorSession.findUnique({ where: { id } });
  if (!current || current.endedAt) {
    throw new AppError('Visitor session not found', 404, 'VISITOR_SESSION_NOT_FOUND');
  }

  const nextType = profile.visitorType ?? current.visitorType;
  const nextEducation = profile.education ?? current.education;
  const interests =
    profile.interests ??
    (profile.visitorType || profile.education
      ? deriveInterests(nextType, nextEducation)
      : current.interests);

  const updated = await prisma.$transaction(async (tx) => {
    const session = await tx.visitorSession.update({
      where: { id },
      data: {
        ...(profile.fullName !== undefined ? { fullName: profile.fullName } : {}),
        ...(profile.visitorType !== undefined ? { visitorType: profile.visitorType } : {}),
        ...(profile.ageGroup !== undefined ? { ageGroup: profile.ageGroup } : {}),
        ...(profile.education !== undefined ? { education: profile.education } : {}),
        ...(profile.language !== undefined ? { language: profile.language } : {}),
        interests,
        visitGoal: nextType,
        lastActiveAt: new Date(),
      },
    });

    await tx.visitorEvent.create({
      data: {
        sessionId: id,
        type: 'PERSONALIZATION_UPDATE',
        metadata: { ...profile, source: 'profile_update' },
      },
    });

    return session;
  });

  const experience = await buildExperienceConfig(updated);

  return {
    sessionId: updated.id,
    token: updated.token,
    createdAt: updated.startedAt.toISOString(),
    visitor: toVisitorDto(updated),
    experience,
  };
}

export async function getExperience(session) {
  return buildExperienceConfig(session);
}

export async function recordEvent(session, payload, requestMeta = {}) {
  let artifactId = payload.artifactId ?? null;
  let galleryId = payload.galleryId ?? null;
  let qrCodeRecord = null;

  if (payload.type === 'QR_SCAN' && payload.qrCode) {
    qrCodeRecord = await prisma.qrCode.findUnique({ where: { code: payload.qrCode } });
    if (!qrCodeRecord) {
      throw new AppError('QR code not found', 404, 'QR_CODE_NOT_FOUND');
    }
    artifactId = qrCodeRecord.artifactId;
  }

  if (artifactId) {
    const artifact = await prisma.artifact.findUnique({ where: { id: artifactId } });
    if (!artifact) throw new AppError('Artifact not found', 404, 'ARTIFACT_NOT_FOUND');
  }

  if (galleryId) {
    const gallery = await prisma.gallery.findUnique({ where: { id: galleryId } });
    if (!gallery) throw new AppError('Gallery not found', 404, 'GALLERY_NOT_FOUND');
  }

  return prisma.$transaction(async (tx) => {
    const created = await tx.visitorEvent.create({
      data: {
        sessionId: session.id,
        type: payload.type,
        artifactId,
        galleryId,
        metadata: {
          ...(payload.metadata ?? {}),
          ...(payload.qrCode ? { qrCode: payload.qrCode } : {}),
        },
      },
    });

    if (payload.type === 'QR_SCAN') {
      if (!qrCodeRecord && artifactId) {
        qrCodeRecord = await tx.qrCode.findUnique({ where: { artifactId } });
      }
      if (!qrCodeRecord) {
        throw new AppError('QR code not found for artifact', 404, 'QR_CODE_NOT_FOUND');
      }
      await tx.qrScan.create({
        data: {
          qrCodeId: qrCodeRecord.id,
          artifactId: qrCodeRecord.artifactId,
          sessionId: session.id,
          ipAddress: requestMeta.ipAddress ?? null,
          userAgent: requestMeta.userAgent ?? null,
        },
      });
    }

    return created;
  });
}

export async function listSessionEvents(sessionId) {
  return prisma.visitorEvent.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
  });
}
