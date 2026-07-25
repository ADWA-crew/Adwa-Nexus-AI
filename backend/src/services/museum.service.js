import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { toMuseumDto } from '../utils/exhibitDto.js';

export async function listMuseums({ status = 'ACTIVE' } = {}) {
  const museums = await prisma.museum.findMany({
    where: status ? { status } : undefined,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { artifacts: true, galleries: true } },
    },
  });

  return museums.map(toMuseumDto);
}

export async function getMuseumById(id) {
  const museum = await prisma.museum.findUnique({
    where: { id },
    include: {
      galleries: { orderBy: { name: 'asc' } },
      artifacts: {
        where: { status: 'PUBLISHED' },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        include: {
          gallery: { select: { id: true, name: true } },
          media: { where: { type: 'IMAGE' }, take: 1 },
          qrCode: { select: { code: true, url: true } },
        },
      },
      _count: { select: { artifacts: true, galleries: true } },
    },
  });

  if (!museum) {
    throw new AppError('Museum not found', 404, 'MUSEUM_NOT_FOUND');
  }

  return toMuseumDto(museum);
}
