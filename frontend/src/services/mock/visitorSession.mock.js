import { isMinorVisitor } from '../../utils/constants';

/**
 * Stand-in for the backend's visitor profile analysis.
 * Mirrors the response contract of POST /api/v1/visitors/sessions so the
 * real endpoint can replace this without touching the UI.
 */

const LATENCY_MS = 700;

const ROUTES_BY_PROFILE = {
  minor: [
    { id: 'r-adwa-kids',   title: 'Heroes of Adwa',            duration: '35 min', stops: 6 },
    { id: 'r-lucy-kids',   title: 'Meet Lucy the Ancestor',    duration: '25 min', stops: 4 },
    { id: 'r-crowns',      title: 'Crowns, Shields and Kings', duration: '30 min', stops: 5 },
  ],
  research: [
    { id: 'r-adwa-archive', title: 'Adwa 1896: Primary Sources',      duration: '90 min', stops: 14 },
    { id: 'r-aksum',        title: 'Aksumite Steles and Inscriptions', duration: '75 min', stops: 11 },
    { id: 'r-manuscripts',  title: "Ge'ez Manuscript Collection",      duration: '80 min', stops: 9 },
  ],
  tourist: [
    { id: 'r-adwa-story',  title: 'The Road to Adwa',        duration: '55 min', stops: 9 },
    { id: 'r-lalibela',    title: 'Rock-Hewn Lalibela',      duration: '60 min', stops: 8 },
    { id: 'r-highlands',   title: 'Highland Heritage Trail', duration: '45 min', stops: 7 },
  ],
};

const deriveExperience = ({ visitorType, ageGroup }) => {
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
};

const makeSessionId = () =>
  `sess_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const mockCreateSession = (payload) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        sessionId: makeSessionId(),
        createdAt: new Date().toISOString(),
        visitor: {
          fullName: payload.fullName,
          visitorType: payload.visitorType,
          ageGroup: payload.ageGroup ?? null,
          education: payload.education,
        },
        experience: deriveExperience(payload),
      });
    }, LATENCY_MS);
  });
