import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

async function resolveMuseum(museumId) {
  const museum = museumId
    ? await prisma.museum.findFirst({
        where: { id: museumId, status: 'ACTIVE' },
      })
    : await prisma.museum.findFirst({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'asc' },
      });

  if (!museum) {
    throw new AppError('Museum not found', 404);
  }

  return museum;
}

export async function getMuseum(query = {}) {
  const museum = await resolveMuseum(query.museumId);

  const [galleries, artifactCount, publishedCount] = await Promise.all([
    prisma.gallery.findMany({
      where: { museumId: museum.id },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
      select: {
        id: true,
        name: true,
        description: true,
        floor: true,
        room: true,
        _count: { select: { artifacts: true } },
      },
    }),
    prisma.artifact.count({ where: { museumId: museum.id } }),
    prisma.artifact.count({ where: { museumId: museum.id, status: 'PUBLISHED' } }),
  ]);

  return {
    ...museum,
    stats: {
      galleries: galleries.length,
      artifacts: artifactCount,
      publishedArtifacts: publishedCount,
    },
    galleries,
  };
}

/**
 * Map layout grouped by floor → galleries → artifact markers
 */
export async function getMuseumMap(query = {}) {
  const museum = await resolveMuseum(query.museumId);

  const galleries = await prisma.gallery.findMany({
    where: { museumId: museum.id },
    orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    include: {
      artifacts: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          category: true,
          era: true,
          location: true,
          qrCode: { select: { code: true, url: true } },
          media: {
            where: { type: 'IMAGE' },
            take: 1,
            select: { id: true, url: true },
          },
        },
        orderBy: { title: 'asc' },
      },
    },
  });

  const floorsMap = new Map();

  for (const gallery of galleries) {
    const floorKey = gallery.floor || 'unassigned';
    if (!floorsMap.has(floorKey)) {
      floorsMap.set(floorKey, {
        floor: gallery.floor,
        label: gallery.floor ? `Floor ${gallery.floor}` : 'Unassigned',
        galleries: [],
      });
    }

    floorsMap.get(floorKey).galleries.push({
      id: gallery.id,
      name: gallery.name,
      description: gallery.description,
      room: gallery.room,
      markers: gallery.artifacts.map((artifact, index) => ({
        id: artifact.id,
        type: 'artifact',
        title: artifact.title,
        category: artifact.category,
        era: artifact.era,
        location: artifact.location,
        position: {
          // Simple grid coords for frontend map rendering (no geo schema yet)
          x: ((index % 4) + 1) * 20,
          y: (Math.floor(index / 4) + 1) * 20,
        },
        thumbnail: artifact.media[0]?.url ?? null,
        qrCode: artifact.qrCode,
      })),
    });
  }

  return {
    museum: {
      id: museum.id,
      name: museum.name,
      address: museum.address,
      coverImage: museum.coverImage,
    },
    floors: Array.from(floorsMap.values()),
  };
}

/**
 * Tour routes derived from galleries (stable ids: route-<galleryId>)
 * plus an "highlights" full-museum route.
 */
export async function listMuseumRoutes(query = {}) {
  const museum = await resolveMuseum(query.museumId);
  const routes = await buildRoutes(museum.id);

  return {
    museumId: museum.id,
    routes: routes.map(summarizeRoute),
  };
}

export async function getMuseumRouteById(routeId, query = {}) {
  const museum = await resolveMuseum(query.museumId);
  const routes = await buildRoutes(museum.id);
  const route = routes.find((r) => r.id === routeId);

  if (!route) {
    throw new AppError('Museum route not found', 404);
  }

  return route;
}

async function buildRoutes(museumId) {
  const galleries = await prisma.gallery.findMany({
    where: { museumId },
    orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    include: {
      artifacts: {
        where: { status: 'PUBLISHED' },
        orderBy: { title: 'asc' },
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          era: true,
          location: true,
          galleryId: true,
          qrCode: { select: { code: true, url: true } },
          media: {
            where: { type: 'IMAGE' },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

  const galleryRoutes = galleries
    .filter((g) => g.artifacts.length > 0)
    .map((gallery, galleryIndex) => {
      const stops = gallery.artifacts.map((artifact, stopIndex) =>
        toStop(artifact, stopIndex + 1)
      );

      return {
        id: `route-${gallery.id}`,
        museumId,
        name: `${gallery.name} Tour`,
        description:
          gallery.description ||
          `A guided path through ${gallery.name}${gallery.room ? ` (Room ${gallery.room})` : ''}.`,
        type: 'gallery',
        floor: gallery.floor,
        room: gallery.room,
        galleryId: gallery.id,
        estimatedMinutes: Math.max(10, stops.length * 5),
        stopCount: stops.length,
        stops,
        order: galleryIndex + 1,
      };
    });

  const allStops = galleries.flatMap((g) => g.artifacts).map((artifact, i) => toStop(artifact, i + 1));

  const highlights = {
    id: 'route-highlights',
    museumId,
    name: 'Museum Highlights',
    description: 'A curated path across published artifacts in the museum.',
    type: 'highlights',
    floor: null,
    room: null,
    galleryId: null,
    estimatedMinutes: Math.max(15, allStops.length * 4),
    stopCount: allStops.length,
    stops: allStops,
    order: 0,
  };

  return [highlights, ...galleryRoutes];
}

function toStop(artifact, order) {
  return {
    order,
    artifactId: artifact.id,
    title: artifact.title,
    description: artifact.description,
    category: artifact.category,
    era: artifact.era,
    location: artifact.location,
    galleryId: artifact.galleryId,
    thumbnail: artifact.media?.[0]?.url ?? null,
    qrCode: artifact.qrCode,
  };
}

function summarizeRoute(route) {
  return {
    id: route.id,
    museumId: route.museumId,
    name: route.name,
    description: route.description,
    type: route.type,
    floor: route.floor,
    room: route.room,
    galleryId: route.galleryId,
    estimatedMinutes: route.estimatedMinutes,
    stopCount: route.stopCount,
    order: route.order,
  };
}
