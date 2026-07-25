import { prisma } from '../config/database.js';

export async function getOverviewStats() {
  const [museums, artifacts, activeSessions, totalSessions, events, qrScans] =
    await Promise.all([
      prisma.museum.count({ where: { status: 'ACTIVE' } }),
      prisma.artifact.count({ where: { status: 'PUBLISHED' } }),
      prisma.visitorSession.count({ where: { endedAt: null } }),
      prisma.visitorSession.count(),
      prisma.visitorEvent.count(),
      prisma.qrScan.count(),
    ]);

  return {
    museums,
    artifacts,
    activeSessions,
    totalSessions,
    events,
    qrScans,
  };
}

export async function getVisitorStats() {
  const [byType, byDay, recent] = await Promise.all([
    prisma.visitorSession.groupBy({
      by: ['visitorType'],
      _count: { _all: true },
    }),
    prisma.$queryRaw`
      SELECT DATE("startedAt") AS day, COUNT(*)::int AS count
      FROM "visitor_sessions"
      WHERE "startedAt" >= NOW() - INTERVAL '14 days'
      GROUP BY DATE("startedAt")
      ORDER BY day ASC
    `,
    prisma.visitorSession.findMany({
      take: 10,
      orderBy: { startedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        visitorType: true,
        ageGroup: true,
        education: true,
        startedAt: true,
        endedAt: true,
      },
    }),
  ]);

  return {
    byType: byType.map((row) => ({
      visitorType: row.visitorType ?? 'unknown',
      count: row._count._all,
    })),
    byDay,
    recent,
  };
}
