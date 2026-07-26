import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
<<<<<<< HEAD
import { toMuseumDto } from '../utils/exhibitDto.js';

export async function listMuseums({ status = 'ACTIVE' } = {}) {
  const museums = await prisma.museum.findMany({
=======

export async function listMuseums({ status = 'ACTIVE' } = {}) {
  return prisma.museum.findMany({
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
    where: status ? { status } : undefined,
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { artifacts: true, galleries: true } },
    },
  });
<<<<<<< HEAD

  return museums.map(toMuseumDto);
=======
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
}

export async function getMuseumById(id) {
  const museum = await prisma.museum.findUnique({
    where: { id },
    include: {
      galleries: { orderBy: { name: 'asc' } },
      artifacts: {
        where: { status: 'PUBLISHED' },
<<<<<<< HEAD
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        include: {
          gallery: { select: { id: true, name: true } },
          media: { where: { type: 'IMAGE' }, take: 1 },
          qrCode: { select: { code: true, url: true } },
        },
      },
      _count: { select: { artifacts: true, galleries: true } },
=======
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
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
    },
  });

  if (!museum) {
    throw new AppError('Museum not found', 404, 'MUSEUM_NOT_FOUND');
  }

<<<<<<< HEAD
  return toMuseumDto(museum);
=======
  return museum;
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
}
