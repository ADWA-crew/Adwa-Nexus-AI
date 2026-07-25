import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';

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

  if (!route) {
    throw new AppError('Route not found', 404, 'ROUTE_NOT_FOUND');
  }

  return route;
}
