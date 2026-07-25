import { prisma } from '../config/database.js';
import * as analyticsService from './analytics.service.js';

/** Lightweight engagement report for staff dashboards */
export async function getEngagementReport() {
  const [overview, visitors, topArtifacts, topQr] = await Promise.all([
    analyticsService.getOverviewStats(),
    analyticsService.getVisitorStats(),
    prisma.visitorEvent.groupBy({
      by: ['artifactId'],
      where: { artifactId: { not: null }, type: 'ARTIFACT_VIEW' },
      _count: { _all: true },
      orderBy: { _count: { artifactId: 'desc' } },
      take: 10,
    }),
    prisma.qrScan.groupBy({
      by: ['artifactId'],
      _count: { _all: true },
      orderBy: { _count: { artifactId: 'desc' } },
      take: 10,
    }),
  ]);

  const artifactIds = [
    ...new Set([
      ...topArtifacts.map((r) => r.artifactId).filter(Boolean),
      ...topQr.map((r) => r.artifactId).filter(Boolean),
    ]),
  ];

  const artifacts = artifactIds.length
    ? await prisma.artifact.findMany({
        where: { id: { in: artifactIds } },
        select: { id: true, slug: true, title: true },
      })
    : [];

  const titleById = Object.fromEntries(
    artifacts.map((a) => [a.id, { title: a.title, slug: a.slug }]),
  );

  return {
    overview,
    visitors,
    topViewedArtifacts: topArtifacts.map((row) => ({
      artifactId: row.artifactId,
      slug: titleById[row.artifactId]?.slug ?? null,
      title: titleById[row.artifactId]?.title ?? row.artifactId,
      views: row._count._all,
    })),
    topScannedArtifacts: topQr.map((row) => ({
      artifactId: row.artifactId,
      slug: titleById[row.artifactId]?.slug ?? null,
      title: titleById[row.artifactId]?.title ?? row.artifactId,
      scans: row._count._all,
    })),
    generatedAt: new Date().toISOString(),
  };
}
