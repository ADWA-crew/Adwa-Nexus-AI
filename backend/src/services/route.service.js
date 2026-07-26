import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
<<<<<<< HEAD
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
=======

export async function listRoutes({ profile } = {}) {
  return prisma.tourRoute.findMany({
    where: profile ? { profile } : undefined,
    orderBy: { title: 'asc' },
  });
}

export async function getRouteById(id) {
  const route =
    (await prisma.tourRoute.findUnique({ where: { id } })) ||
    (await prisma.tourRoute.findUnique({ where: { slug: id } }));
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534

  if (!route) {
    throw new AppError('Route not found', 404, 'ROUTE_NOT_FOUND');
  }

<<<<<<< HEAD
  return toRouteDto(route);
=======
  return route;
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
}
