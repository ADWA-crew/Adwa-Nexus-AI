import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.middleware.js';

function toExhibitDto(row) {
  return {
    id: row.code,
    code: row.code,
    title: row.title,
    subtitle: row.subtitle,
    era: row.era,
    gallery: row.gallery,
    image: row.imageUrl,
    paragraphs: row.paragraphs,
    facts: row.facts,
    videoUrl: row.videoUrl,
    videoCaption: row.videoCaption,
  };
}

function parseExhibitCode(payload) {
  if (!payload) return null;
  const value = String(payload).trim();

  try {
    const url = new URL(value);
    const fromQuery = url.searchParams.get('exhibit') || url.searchParams.get('id');
    if (fromQuery) return fromQuery.toLowerCase();
    const lastSegment = url.pathname.split('/').filter(Boolean).pop();
    if (lastSegment) return lastSegment.toLowerCase();
  } catch {
    /* plain code */
  }

  return value.toLowerCase();
}

export async function listExhibits() {
  const rows = await prisma.researchExhibit.findMany({
    orderBy: { title: 'asc' },
  });

  return {
    codes: rows.map((row) => row.code),
    exhibits: rows.map(toExhibitDto),
  };
}

export async function getExhibitByCode(codeOrPayload) {
  const code = parseExhibitCode(codeOrPayload);
  if (!code) {
    throw new AppError('Exhibit code is required', 400);
  }

  const row = await prisma.researchExhibit.findUnique({
    where: { code },
  });

  if (!row) {
    throw new AppError('Exhibit not found', 404);
  }

  return toExhibitDto(row);
}

export async function listExhibitCodes() {
  const rows = await prisma.researchExhibit.findMany({
    select: { code: true },
    orderBy: { code: 'asc' },
  });
  return rows.map((row) => row.code);
}
