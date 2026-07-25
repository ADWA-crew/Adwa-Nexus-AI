import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
import { toArtifactCardDto } from '../utils/exhibitDto.js';

export async function listGalleries({ museumId } = {}) {
  return prisma.gallery.findMany({
    where: museumId ? { museumId } : undefined,
    orderBy: { name: 'asc' },
    include: {
      museum: { select: { id: true, name: true } },
      _count: { select: { artifacts: true } },
    },
  });
}

export async function getGalleryById(id) {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      museum: { select: { id: true, name: true } },
      artifacts: {
        where: { status: 'PUBLISHED' },
        orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        include: {
          gallery: { select: { id: true, name: true } },
          media: { where: { type: 'IMAGE' }, take: 1 },
          qrCode: { select: { code: true, url: true } },
        },
      },
    },
  });

  if (!gallery) {
    throw new AppError('Gallery not found', 404, 'GALLERY_NOT_FOUND');
  }

  return {
    id: gallery.id,
    name: gallery.name,
    description: gallery.description,
    floor: gallery.floor,
    room: gallery.room,
    museum: gallery.museum,
    artifacts: gallery.artifacts.map(toArtifactCardDto),
  };
}
