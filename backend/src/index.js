import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  artifacts,
  journeysByRoute,
  mapLocations,
  exploreItems,
  chatSuggestions,
  session,
} from './data/mock.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function personalizeFromProfile(profile) {
  const ageGroup = profile.ageGroup || 'ADULT';
  const language = profile.language || 'ENGLISH';
  const accessibilityNeeds = profile.accessibilityNeeds || [];
  const hasAccessNeeds = accessibilityNeeds.some((n) => n && n !== 'None');

  const routeMap = {
    CHILD: 'CHILD_ROUTE',
    TEEN: 'STANDARD_ROUTE',
    ADULT: 'STANDARD_ROUTE',
    SENIOR: 'ACCESSIBLE_ROUTE',
    FAMILY: 'FAMILY_ROUTE',
    SCHOLAR: 'DEEP_DIVE_ROUTE',
    TOURIST: 'STANDARD_ROUTE',
  };

  const contentMap = {
    CHILD: 'SIMPLE',
    TEEN: 'SIMPLE',
    ADULT: 'STANDARD',
    SENIOR: 'STANDARD',
    FAMILY: 'SIMPLE',
    SCHOLAR: 'ACADEMIC',
    TOURIST: 'STANDARD',
  };

  const themeMap = {
    CHILD: 'FUN',
    TEEN: 'IMMERSIVE',
    ADULT: 'IMMERSIVE',
    SENIOR: 'EDITORIAL',
    FAMILY: 'FUN',
    SCHOLAR: 'MINIMAL',
    TOURIST: 'EDITORIAL',
  };

  const durationMap = {
    CHILD: 60,
    TEEN: 70,
    ADULT: 75,
    SENIOR: 80,
    FAMILY: 90,
    SCHOLAR: 120,
    TOURIST: 60,
  };

  const featureMap = {
    CHILD: ['simple-stories', 'images', 'videos', 'audio', 'animations', 'gamification'],
    TEEN: ['stories', 'images', 'videos', 'audio', 'interactive', 'social'],
    ADULT: ['stories', 'images', 'videos', 'audio', 'deep-context'],
    SENIOR: ['stories', 'images', 'audio', 'large-text', 'voice-narration'],
    FAMILY: ['simple-stories', 'images', 'videos', 'audio', 'gamification', 'shared'],
    SCHOLAR: ['academic-text', 'images', 'primary-sources', 'maps', 'footnotes'],
    TOURIST: ['highlights', 'images', 'audio', 'maps', 'essentials'],
  };

  const recommendedRoute = hasAccessNeeds
    ? 'ACCESSIBLE_ROUTE'
    : routeMap[ageGroup] || 'STANDARD_ROUTE';

  return {
    experienceMode: ageGroup,
    language,
    contentLevel: contentMap[ageGroup] || 'STANDARD',
    recommendedRoute,
    estimatedDuration: durationMap[ageGroup] || 75,
    theme: themeMap[ageGroup] || 'IMMERSIVE',
    voiceNarration: ageGroup === 'SENIOR' || ageGroup === 'CHILD' || hasAccessNeeds,
    animationLevel: ageGroup === 'CHILD' || ageGroup === 'TEEN' ? 'HIGH' : ageGroup === 'SCHOLAR' ? 'LOW' : 'MEDIUM',
    features: featureMap[ageGroup] || featureMap.ADULT,
  };
}

function getJourneyForRoute(route) {
  const key = route && journeysByRoute[route] ? route : session.route;
  const base = journeysByRoute[key] || journeysByRoute.STANDARD_ROUTE;
  const stops = base.stops.map((stop) => ({
    ...stop,
    completed: session.completedStopIds.includes(stop.id),
  }));
  const completed = stops.filter((s) => s.completed).length;
  const progress = stops.length ? Math.round((completed / stops.length) * 100) : 0;
  return { ...base, route: key, stops, progress };
}

function buildPassport() {
  const journey = getJourneyForRoute(session.route);
  const totalStamps = journey.stops.length;
  return {
    visitorName: session.visitorName,
    visitDate: new Date().toISOString(),
    route: session.route,
    stamps: session.stamps,
    totalStamps,
    completionPercent: totalStamps
      ? Math.round((session.stamps.length / totalStamps) * 100)
      : 0,
  };
}

app.get('/', (_req, res) => {
  res.json({ message: 'Adwa Nexus AI API is running', version: '1.0.0' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/visitor/personalize', (req, res) => {
  const profile = req.body || {};
  session.visitorName = profile.name || 'Visitor';
  session.completedStopIds = [];
  session.stamps = [];

  const personalization = personalizeFromProfile(profile);
  session.route = personalization.recommendedRoute;

  res.json(personalization);
});

app.get('/api/visitor/:id/personalization', (req, res) => {
  res.json(
    personalizeFromProfile({
      name: session.visitorName,
      ageGroup: 'ADULT',
      language: 'ENGLISH',
      accessibilityNeeds: [],
    }),
  );
});

app.get('/api/artifacts', (_req, res) => {
  res.json(artifacts);
});

app.get('/api/artifacts/scan/:code', (req, res) => {
  const code = decodeURIComponent(req.params.code);
  const artifact =
    artifacts.find((a) => a.qrCode === code) ||
    artifacts.find((a) => a.id === code) ||
    artifacts[0];

  if (!artifact) {
    return res.status(404).json({ message: 'QR code not recognized' });
  }

  if (!session.stamps.some((s) => s.artifactId === artifact.id)) {
    session.stamps.push({
      id: `stamp-${artifact.id}`,
      artifactId: artifact.id,
      title: artifact.title,
      earnedAt: new Date().toISOString(),
      imageUrl: artifact.media[0]?.url,
    });
  }

  res.json(artifact);
});

app.get('/api/artifacts/:id', (req, res) => {
  const artifact = artifacts.find((a) => a.id === req.params.id);
  if (!artifact) {
    return res.status(404).json({ message: 'Artifact not found' });
  }
  res.json(artifact);
});

app.get('/api/journey', (req, res) => {
  const route = req.query.route;
  if (route && journeysByRoute[route]) {
    session.route = route;
  }
  res.json(getJourneyForRoute(session.route));
});

app.post('/api/journey/stops/:stopId/complete', (req, res) => {
  const { stopId } = req.params;
  if (!session.completedStopIds.includes(stopId)) {
    session.completedStopIds.push(stopId);
  }

  const journey = getJourneyForRoute(session.route);
  const stop = journey.stops.find((s) => s.id === stopId);
  if (stop?.artifactId) {
    const artifact = artifacts.find((a) => a.id === stop.artifactId);
    if (artifact && !session.stamps.some((s) => s.artifactId === artifact.id)) {
      session.stamps.push({
        id: `stamp-${artifact.id}`,
        artifactId: artifact.id,
        title: artifact.title,
        earnedAt: new Date().toISOString(),
        imageUrl: artifact.media[0]?.url,
      });
    }
  }

  res.json(getJourneyForRoute(session.route));
});

app.get('/api/passport', (_req, res) => {
  res.json(buildPassport());
});

app.post('/api/passport/stamps', (req, res) => {
  const { artifactId } = req.body || {};
  const artifact = artifacts.find((a) => a.id === artifactId);
  if (!artifact) {
    return res.status(404).json({ message: 'Artifact not found' });
  }
  if (!session.stamps.some((s) => s.artifactId === artifact.id)) {
    session.stamps.push({
      id: `stamp-${artifact.id}`,
      artifactId: artifact.id,
      title: artifact.title,
      earnedAt: new Date().toISOString(),
      imageUrl: artifact.media[0]?.url,
    });
  }
  res.json(buildPassport());
});

app.get('/api/certificate', (_req, res) => {
  const journey = getJourneyForRoute(session.route);
  res.json({
    visitorName: session.visitorName,
    visitDate: new Date().toISOString(),
    routeTitle: journey.title,
    achievements: [
      `Completed ${session.stamps.length} artifact discoveries`,
      `Followed the ${journey.route.replace(/_/g, ' ').toLowerCase()}`,
      'Engaged with Adwa Nexus AI companion',
      'Preserved Ethiopian heritage through learning',
    ],
    certificateId: `ADWA-${Date.now().toString(36).toUpperCase()}`,
    museumName: 'Adwa Victory Memorial Museum',
  });
});

app.post('/api/ai/chat', (req, res) => {
  const { message = '', context } = req.body || {};
  const lower = message.toLowerCase();

  let reply =
    'Adwa Nexus AI is here to guide you. The Battle of Adwa (March 1, 1896) was a decisive Ethiopian victory against Italian colonial forces under Emperor Menelik II and Empress Taytu Betul. Ask about artifacts, leaders, or what to explore next.';

  if (lower.includes('taytu') || lower.includes('empress')) {
    reply =
      'Empress Taytu Betul was a formidable strategist and advisor. She influenced diplomacy and military decisions, inspired Ethiopian forces, and remains one of the most important figures in the Adwa story.';
  } else if (lower.includes('menelik')) {
    reply =
      'Emperor Menelik II unified Ethiopian forces, secured modern arms through diplomacy, and led the victory at Adwa that preserved Ethiopian independence and inspired anti-colonial movements across Africa.';
  } else if (lower.includes('adwa') || lower.includes('battle')) {
    reply =
      'The Battle of Adwa took place on March 1, 1896 in northern Ethiopia. Ethiopian armies defeated Italian colonial forces, making Adwa a landmark of African resistance and sovereignty.';
  } else if (lower.includes('next') || lower.includes('recommend')) {
    reply =
      'I recommend continuing your personalized route: visit the Hall of Victory for the Flag of Adwa, then the Armory Gallery. You can also scan nearby QR codes to unlock stamp rewards.';
  } else if (lower.includes('flag')) {
    reply =
      'The Flag of Adwa symbolizes Ethiopian sovereignty and unity. It is one of the most emotionally powerful artifacts in the museum — a reminder that history here is lived, not only remembered.';
  }

  if (context?.artifactId) {
    const artifact = artifacts.find((a) => a.id === context.artifactId);
    if (artifact) {
      reply = `Regarding "${artifact.title}": ${artifact.shortDescription} ${reply}`;
    }
  }

  res.json({
    message: reply,
    suggestions: chatSuggestions.slice(0, 3),
  });
});

app.get('/api/ai/suggestions', (_req, res) => {
  res.json(chatSuggestions);
});

app.get('/api/map/locations', (_req, res) => {
  res.json(mapLocations);
});

app.get('/api/explore', (_req, res) => {
  res.json(exploreItems);
});

app.listen(PORT, () => {
  console.log(`Adwa Nexus AI API running on http://localhost:${PORT}`);
});
