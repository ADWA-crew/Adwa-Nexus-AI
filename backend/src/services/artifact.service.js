import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';

export async function getPublishedArtifactById(id) {
  const artifact = await prisma.artifact.findFirst({
    where: {
      id,
      status: 'PUBLISHED',
    },
    include: {
      media: true,
      gallery: {
        select: { id: true, name: true, floor: true, room: true },
      },
      qrCode: {
        select: { id: true, code: true, url: true },
      },
    },
  });

  if (!artifact) {
    throw new AppError('Artifact not found', 404, 'ARTIFACT_NOT_FOUND');
  }

  return artifact;
}

export async function listPublishedArtifacts({ museumId, limit = 50 } = {}) {
  return prisma.artifact.findMany({
    where: {
      status: 'PUBLISHED',
      ...(museumId ? { museumId } : {}),
    },
    take: limit,
    orderBy: { title: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      era: true,
      category: true,
      galleryId: true,
      museumId: true,
      location: true,
    },
  });
}
