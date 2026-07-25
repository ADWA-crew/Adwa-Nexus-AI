import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

const artifactInclude = {
  media: true,
  qrCode: true,
  museum: { select: { id: true, name: true, status: true } },
  gallery: { select: { id: true, name: true, floor: true, room: true } },
  createdBy: { select: { id: true, name: true, email: true, role: true } },
};

export async function listArtifacts(query = {}) {
  const {
    museumId,
    galleryId,
    status,
    category,
    search,
    page = 1,
    limit = 20,
  } = query;

  const where = {};

  if (museumId) where.museumId = museumId;
  if (galleryId) where.galleryId = galleryId;
  if (status) where.status = status;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { era: { contains: search, mode: 'insensitive' } },
    ];
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const take = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * take;

  const [items, total] = await Promise.all([
    prisma.artifact.findMany({
      where,
      include: artifactInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.artifact.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: pageNum,
      limit: take,
      total,
      totalPages: Math.ceil(total / take) || 1,
    },
  };
}

export async function getArtifactById(id) {
  const artifact = await prisma.artifact.findUnique({
    where: { id },
    include: artifactInclude,
  });

  if (!artifact) {
    throw new AppError('Artifact not found', 404);
  }

  return artifact;
}

export async function createArtifact(data, userId = null) {
  const museum = await prisma.museum.findUnique({ where: { id: data.museumId } });
  if (!museum) {
    throw new AppError('Museum not found', 404);
  }

  if (data.galleryId) {
    const gallery = await prisma.gallery.findFirst({
      where: { id: data.galleryId, museumId: data.museumId },
    });
    if (!gallery) {
      throw new AppError('Gallery not found for this museum', 404);
    }
  }

  let createdById = null;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) createdById = user.id;
  }

  return prisma.artifact.create({
    data: {
      museumId: data.museumId,
      galleryId: data.galleryId ?? null,
      title: data.title.trim(),
      description: data.description ?? null,
      era: data.era ?? null,
      category: data.category ?? null,
      status: data.status ?? 'DRAFT',
      location: data.location ?? null,
      createdById,
    },
    include: artifactInclude,
  });
}

export async function updateArtifact(id, data) {
  const existing = await getArtifactById(id);

  if (data.museumId) {
    const museum = await prisma.museum.findUnique({ where: { id: data.museumId } });
    if (!museum) throw new AppError('Museum not found', 404);
  }

  const museumId = data.museumId ?? existing.museumId;

  if (data.galleryId) {
    const gallery = await prisma.gallery.findFirst({
      where: { id: data.galleryId, museumId },
    });
    if (!gallery) {
      throw new AppError('Gallery not found for this museum', 404);
    }
  }

  const payload = {};
  if (data.museumId !== undefined) payload.museumId = data.museumId;
  if (data.galleryId !== undefined) payload.galleryId = data.galleryId;
  if (data.title !== undefined) payload.title = data.title.trim();
  if (data.description !== undefined) payload.description = data.description;
  if (data.era !== undefined) payload.era = data.era;
  if (data.category !== undefined) payload.category = data.category;
  if (data.status !== undefined) payload.status = data.status;
  if (data.location !== undefined) payload.location = data.location;

  return prisma.artifact.update({
    where: { id },
    data: payload,
    include: artifactInclude,
  });
}

export async function updateArtifactStatus(id, status) {
  await getArtifactById(id);

  return prisma.artifact.update({
    where: { id },
    data: { status },
    include: artifactInclude,
  });
}

export async function deleteArtifact(id) {
  await getArtifactById(id);

  await prisma.artifact.delete({ where: { id } });
  return { id };
}
