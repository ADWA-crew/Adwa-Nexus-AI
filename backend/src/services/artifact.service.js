import { prisma } from '../config/database.js';
import { AppError } from '../utils/apiResponse.js';
<<<<<<< HEAD
import { toArtifactCardDto, toExhibitDto } from '../utils/exhibitDto.js';
import { normalizeQrPayload } from '../utils/generateQR.js';

const exhibitInclude = {
  media: true,
  gallery: {
    select: { id: true, name: true, floor: true, room: true },
  },
  qrCode: {
    select: { id: true, code: true, url: true },
  },
};

async function findPublishedArtifact(idOrSlug) {
  const key = String(idOrSlug || '').trim();
  if (!key) return null;

  return prisma.artifact.findFirst({
    where: {
      status: 'PUBLISHED',
      OR: [{ id: key }, { slug: key.toLowerCase() }],
    },
    include: exhibitInclude,
  });
}

export async function getPublishedArtifactById(id) {
  const artifact = await findPublishedArtifact(id);
  if (!artifact) {
    throw new AppError('Artifact not found', 404, 'ARTIFACT_NOT_FOUND');
  }
  return toExhibitDto(artifact);
}

export async function listPublishedArtifacts({
  museumId,
  galleryId,
  category,
  limit = 50,
} = {}) {
  const artifacts = await prisma.artifact.findMany({
    where: {
      status: 'PUBLISHED',
      ...(museumId ? { museumId } : {}),
      ...(galleryId ? { galleryId } : {}),
      ...(category ? { category } : {}),
    },
    take: Math.min(Number(limit) || 50, 200),
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    include: {
      gallery: { select: { id: true, name: true } },
      media: { where: { type: 'IMAGE' }, take: 1 },
      qrCode: { select: { code: true, url: true } },
    },
  });

  return artifacts.map(toArtifactCardDto);
}

/** Resolve a scanned QR payload (plain slug or full URL) to an exhibit. */
export async function resolveByQrPayload(payload) {
  const code = normalizeQrPayload(payload);
  if (!code) {
    throw new AppError('QR code is required', 400, 'QR_REQUIRED');
  }

  const byQr = await prisma.qrCode.findUnique({
    where: { code },
    include: {
      artifact: { include: exhibitInclude },
    },
  });

  if (byQr?.artifact?.status === 'PUBLISHED') {
    return toExhibitDto(byQr.artifact);
  }

  const bySlug = await findPublishedArtifact(code);
  if (!bySlug) {
    throw new AppError('Exhibit not found for this QR code', 404, 'EXHIBIT_NOT_FOUND');
  }

  return toExhibitDto(bySlug);
=======

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
>>>>>>> daa6d8eefeba41a1fd120ecc8e42490f7f2aa534
}
