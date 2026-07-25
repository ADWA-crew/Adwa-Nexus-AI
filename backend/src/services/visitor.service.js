import { randomUUID } from 'crypto';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

const ROUTES_BY_PROFILE = {
  minor: [
    { id: 'r-adwa-kids', title: 'Heroes of Adwa', duration: '35 min', stops: 6 },
    { id: 'r-lucy-kids', title: 'Meet Lucy the Ancestor', duration: '25 min', stops: 4 },
    { id: 'r-crowns', title: 'Crowns, Shields and Kings', duration: '30 min', stops: 5 },
  ],
  research: [
    { id: 'r-adwa-archive', title: 'Adwa 1896: Primary Sources', duration: '90 min', stops: 14 },
    { id: 'r-aksum', title: 'Aksumite Steles and Inscriptions', duration: '75 min', stops: 11 },
    { id: 'r-manuscripts', title: "Ge'ez Manuscript Collection", duration: '80 min', stops: 9 },
  ],
  tourist: [
    { id: 'r-adwa-story', title: 'The Road to Adwa', duration: '55 min', stops: 9 },
    { id: 'r-lalibela', title: 'Rock-Hewn Lalibela', duration: '60 min', stops: 8 },
    { id: 'r-highlands', title: 'Highland Heritage Trail', duration: '45 min', stops: 7 },
  ],
};

function isMinorVisitor(visitorType, ageGroup) {
  if (visitorType === 'child') return true;
  if (visitorType === 'research') return false;
  return ageGroup === 'under18';
}

function deriveExperience({ visitorType, ageGroup }) {
  const minor = isMinorVisitor(visitorType, ageGroup);

  if (minor) {
    return {
      profile: 'minor',
      tone: 'playful',
      readingLevel: 'simple',
      contentDepth: 'summary',
      features: {
        audioGuide: true,
        quizMode: true,
        illustrations: true,
        citations: false,
        archiveAccess: false,
      },
      recommendedRoutes: ROUTES_BY_PROFILE.minor,
      summary: 'A story-led tour with short chapters, illustrations and quizzes.',
    };
  }

  if (visitorType === 'research') {
    return {
      profile: 'research',
      tone: 'academic',
      readingLevel: 'advanced',
      contentDepth: 'deep',
      features: {
        audioGuide: false,
        quizMode: false,
        illustrations: false,
        citations: true,
        archiveAccess: true,
      },
      recommendedRoutes: ROUTES_BY_PROFILE.research,
      summary: 'Full catalogue records with citations, provenance and archive access.',
    };
  }

  return {
    profile: 'tourist',
    tone: 'narrative',
    readingLevel: 'standard',
    contentDepth: 'standard',
    features: {
      audioGuide: true,
      quizMode: false,
      illustrations: true,
      citations: false,
      archiveAccess: false,
    },
    recommendedRoutes: ROUTES_BY_PROFILE.tourist,
    summary: 'A cinematic narrative walkthrough of Ethiopia\u2019s defining moments.',
  };
}

function toSessionResponse(row) {
  const experience = deriveExperience({
    visitorType: row.visitorType,
    ageGroup: row.ageGroup,
  });

  return {
    sessionId: row.token,
    createdAt: row.startedAt,
    visitor: {
      fullName: row.fullName,
      visitorType: row.visitorType,
      ageGroup: row.ageGroup,
      education: row.education,
    },
    experience,
  };
}

export async function createSession(payload) {
  const fullName = String(payload.fullName || '').trim();
  const visitorType = payload.visitorType;
  const ageGroup = visitorType === 'tourist' ? payload.ageGroup : null;
  const education = payload.education;
  const museumId = payload.museumId || 'seed_museum_adwa';

  const museum = await prisma.museum.findUnique({ where: { id: museumId } });

  const row = await prisma.visitorSession.create({
    data: {
      token: randomUUID(),
      museumId: museum ? museumId : null,
      fullName,
      visitorType,
      ageGroup,
      education,
      visitGoal: visitorType,
      language: payload.language || 'en',
      lastActiveAt: new Date(),
    },
  });

  await prisma.visitorEvent.create({
    data: {
      sessionId: row.id,
      type: 'SESSION_START',
      metadata: { visitorType, source: 'personalization' },
    },
  });

  return toSessionResponse(row);
}

export async function getSessionByToken(token) {
  const row = await prisma.visitorSession.findUnique({
    where: { token },
  });

  if (!row) {
    throw new AppError('Visitor session not found', 404);
  }

  return toSessionResponse(row);
}
