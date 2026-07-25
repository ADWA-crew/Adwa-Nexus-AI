import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { toRouteDto } from '../utils/exhibitDto.js';

const routeInclude = {
  routeStops: {
    orderBy: { order: 'asc' },
    include: {
      artifact: {
        include: {
          gallery: { select: { id: true, name: true } },
          media: { where: { type: 'IMAGE' }, take: 1 },
          qrCode: { select: { code: true, url: true } },
        },
      },
    },
  },
};

export async function listRoutes({ profile, museumId } = {}) {
  const routes = await prisma.tourRoute.findMany({
    where: {
      ...(profile ? { profile } : {}),
      ...(museumId ? { museumId } : {}),
    },
    orderBy: { title: 'asc' },
    include: routeInclude,
  });

  return routes.map(toRouteDto);
}

export async function getRouteById(id) {
  const key = String(id || '').trim();
  const route =
    (await prisma.tourRoute.findUnique({ where: { id: key }, include: routeInclude })) ||
    (await prisma.tourRoute.findUnique({ where: { slug: key }, include: routeInclude }));

  if (!route) {
    throw new AppError('Route not found', 404, 'ROUTE_NOT_FOUND');
  }

  return toRouteDto(route);
}
