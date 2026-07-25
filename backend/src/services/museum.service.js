import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';

export async function listMuseums({ status = 'ACTIVE' } = {}) {
  return prisma.museum.findMany({
    where: status ? { status } : undefined,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { artifacts: true, galleries: true } },
    },
  });
}

export async function getMuseumById(id) {
  const museum = await prisma.museum.findUnique({
    where: { id },
    include: {
      galleries: { orderBy: { name: 'asc' } },
      artifacts: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          category: true,
          era: true,
          description: true,
          location: true,
          galleryId: true,
        },
      },
    },
  });

  if (!museum) {
    throw new AppError('Museum not found', 404, 'MUSEUM_NOT_FOUND');
  }

  return museum;
}
