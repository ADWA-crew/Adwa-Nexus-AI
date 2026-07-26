import { prisma } from '../config/database.js';

function normalize(value) {
  return (value ?? '').toString().trim().toLowerCase();
}

export function isMinorVisitor(visitorType, ageGroup) {
  // Demo rule: age group wins when present
  if (ageGroup === 'under18') return true;
  if (ageGroup === 'above18') return false;
  if (visitorType === 'child') return true;
  if (visitorType === 'research') return false;
  return false;
}

/**
 * Demo mapping:
 * - under18 → child (minor) experience
 * - above18 → researcher experience
 */
export function resolveExperienceProfile(visitorType, ageGroup) {
  if (ageGroup === 'under18' || visitorType === 'child') return 'minor';
  if (ageGroup === 'above18' || visitorType === 'research') return 'research';
  return 'tourist';
}

/** Normalize form age into the visitorType we persist */
export function resolveStoredVisitorType(visitorType, ageGroup) {
  if (ageGroup === 'under18') return 'child';
  if (ageGroup === 'above18') return 'research';
  return visitorType;
}

export function resolveRedirectPath(profile) {
  if (profile === 'minor') return '/routes';
  if (profile === 'research') return '/artifacts';
  return '/profile';
}

function deriveExperienceFeatures(profile) {
  if (profile === 'minor') {
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
      summary: 'A story-led tour with short chapters, illustrations and quizzes.',
    };
  }

  if (profile === 'research') {
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
    summary: "A cinematic narrative walkthrough of Ethiopia's defining moments.",
  };
}

function interestsFromProfile(visitorType, education) {
  if (visitorType === 'research') return ['manuscripts', 'symbols', 'royalty'];
  if (visitorType === 'child') return ['symbols', 'weapons'];
  if (normalize(education).includes('university')) return ['royalty', 'manuscripts'];
  return ['weapons', 'symbols', 'royalty'];
}

function scoreArtifact(artifact, session, viewedIds) {
  let score = 0;
  const category = normalize(artifact.category);
  const era = normalize(artifact.era);
  const interests = (session.interests ?? []).map(normalize);

  if (category && interests.includes(category)) score += 5;

  for (const interest of interests) {
    if (interest && (category.includes(interest) || interest.includes(category))) score += 2;
    if (interest && era.includes(interest)) score += 1;
  }

  if (viewedIds.has(artifact.id)) score -= 4;
  return score;
}

export async function getRecommendations(session, limit = 10) {
  // Avoid Prisma enum+Int bind bug (integer = text) by filtering type in JS
  const viewedEvents = await prisma.visitorEvent.findMany({
    where: {
      sessionId: Number(session.id),
      artifactId: { not: null },
    },
    select: { artifactId: true, type: true },
  });

  const viewedIds = new Set(
    viewedEvents
      .filter((event) => event.type === 'ARTIFACT_VIEW')
      .map((event) => event.artifactId)
      .filter(Boolean),
  );

  const artifacts = await prisma.artifact.findMany({
    where: {
      status: 'PUBLISHED',
      ...(session.museumId ? { museumId: session.museumId } : {}),
    },
    select: {
      id: true,
<<<<<<< HEAD
      slug: true,
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
      title: true,
      category: true,
      era: true,
      galleryId: true,
      museumId: true,
      description: true,
      location: true,
    },
  });

  return artifacts
    .map((artifact) => ({
      ...artifact,
<<<<<<< HEAD
      publicId: artifact.slug || artifact.id,
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
      score: scoreArtifact(artifact, session, viewedIds),
      viewed: viewedIds.has(artifact.id),
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export async function getRecommendedRoutes(profile) {
  const routes = await prisma.tourRoute.findMany({
    where: { profile },
    orderBy: { title: 'asc' },
<<<<<<< HEAD
    include: {
      routeStops: {
        orderBy: { order: 'asc' },
        include: {
          artifact: { select: { id: true, slug: true, title: true } },
        },
      },
    },
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  });

  return routes.map((route) => ({
    id: route.slug || route.id,
    title: route.title,
    duration: route.duration,
<<<<<<< HEAD
    stops: route.stops || route.routeStops.length,
    description: route.description,
    stopList: route.routeStops.map((stop) => ({
      order: stop.order,
      artifactId: stop.artifact?.slug || stop.artifactId,
      title: stop.title || stop.artifact?.title || null,
    })),
=======
    stops: route.stops,
    description: route.description,
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
  }));
}

/**
 * Frontend-compatible experience config (matches visitorSession.mock.js)
 */
export async function buildExperienceConfig(session) {
  const profile = resolveExperienceProfile(session.visitorType, session.ageGroup);
  const base = deriveExperienceFeatures(profile);
  const recommendedRoutes = await getRecommendedRoutes(profile);
  const recommendations = await getRecommendations(session, 8);

  return {
    ...base,
    recommendedRoutes,
    recommendations,
    suggestedPath: recommendations.slice(0, 5).map((artifact, index) => ({
      order: index + 1,
      artifactId: artifact.id,
      title: artifact.title,
      category: artifact.category,
      location: artifact.location,
    })),
    meta: {
      generatedAt: new Date().toISOString(),
      strategy: 'rule-based-v1',
    },
  };
}

export function deriveInterests(visitorType, education) {
  return interestsFromProfile(visitorType, education);
}
