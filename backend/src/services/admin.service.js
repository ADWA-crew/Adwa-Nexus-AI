import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../middleware/error.middleware.js';
import { signToken } from '../middleware/auth.middleware.js';
import { listArtifacts } from './artifact.service.js';

const ADMIN_ROLES = ['ADMIN', 'CURATOR'];

export async function loginAdmin({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    throw new AppError('Access denied. Admin or curator role required', 403);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new AppError('Invalid email or password', 401);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return {
    token: signToken(safeUser),
    user: safeUser,
  };
}

export async function getDashboard() {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const start7d = new Date(now);
  start7d.setDate(start7d.getDate() - 7);

  const start30d = new Date(now);
  start30d.setDate(start30d.getDate() - 30);

  const [
    museumsTotal,
    museumsActive,
    artifactsTotal,
    artifactsByStatus,
    mediaTotal,
    usersTotal,
    usersByRole,
    scansToday,
    scans7d,
    scans30d,
    topScanned,
    recentArtifacts,
    recentScans,
  ] = await Promise.all([
    prisma.museum.count(),
    prisma.museum.count({ where: { status: 'ACTIVE' } }),
    prisma.artifact.count(),
    prisma.artifact.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.media.count(),
    prisma.user.count(),
    prisma.user.groupBy({ by: ['role'], _count: { _all: true } }),
    prisma.qrScan.count({ where: { scannedAt: { gte: startOfToday } } }),
    prisma.qrScan.count({ where: { scannedAt: { gte: start7d } } }),
    prisma.qrScan.count({ where: { scannedAt: { gte: start30d } } }),
    prisma.qrScan.groupBy({
      by: ['artifactId'],
      _count: { _all: true },
      orderBy: { _count: { artifactId: 'desc' } },
      take: 5,
    }),
    prisma.artifact.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        createdAt: true,
        museum: { select: { id: true, name: true } },
      },
    }),
    prisma.qrScan.findMany({
      take: 5,
      orderBy: { scannedAt: 'desc' },
      include: {
        artifact: { select: { id: true, title: true } },
      },
    }),
  ]);

  const artifactIds = topScanned.map((row) => row.artifactId);
  const artifactMap = artifactIds.length
    ? Object.fromEntries(
        (
          await prisma.artifact.findMany({
            where: { id: { in: artifactIds } },
            select: { id: true, title: true },
          })
        ).map((a) => [a.id, a])
      )
    : {};

  return {
    totals: {
      museums: museumsTotal,
      museumsActive,
      artifacts: artifactsTotal,
      media: mediaTotal,
      users: usersTotal,
    },
    artifactsByStatus: Object.fromEntries(
      artifactsByStatus.map((row) => [row.status, row._count._all])
    ),
    usersByRole: Object.fromEntries(
      usersByRole.map((row) => [row.role, row._count._all])
    ),
    scans: {
      today: scansToday,
      last7Days: scans7d,
      last30Days: scans30d,
    },
    topArtifactsByScans: topScanned.map((row) => ({
      artifactId: row.artifactId,
      title: artifactMap[row.artifactId]?.title ?? null,
      scanCount: row._count._all,
    })),
    recentArtifacts,
    recentScans,
  };
}

export async function listVisitors(query = {}) {
  const pageNum = Math.max(1, Number(query.page) || 1);
  const take = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const skip = (pageNum - 1) * take;
  const search = query.search?.trim();

  // Visitors = VIEWER users + recent QR scan activity (no separate Visitor model)
  const userWhere = {
    role: 'VIEWER',
    ...(search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const [users, usersTotal, recentScans, scansTotal] = await Promise.all([
    prisma.user.findMany({
      where: userWhere,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.user.count({ where: userWhere }),
    prisma.qrScan.findMany({
      take: 20,
      orderBy: { scannedAt: 'desc' },
      include: {
        artifact: { select: { id: true, title: true, museumId: true } },
      },
    }),
    prisma.qrScan.count(),
  ]);

  return {
    visitors: users,
    pagination: {
      page: pageNum,
      limit: take,
      total: usersTotal,
      totalPages: Math.ceil(usersTotal / take) || 1,
    },
    scanActivity: {
      totalScans: scansTotal,
      recent: recentScans,
    },
  };
}

export async function listAdminArtifacts(query = {}) {
  return listArtifacts(query);
}

export async function getReports(query = {}) {
  const { museumId, from, to, format } = query;

  const dateFilter = {};
  if (from || to) {
    dateFilter.scannedAt = {};
    if (from) dateFilter.scannedAt.gte = new Date(from);
    if (to) dateFilter.scannedAt.lte = new Date(to);
  }

  const artifactWhere = {};
  if (museumId) artifactWhere.museumId = museumId;

  const scanWhere = { ...dateFilter };
  if (museumId) {
    scanWhere.artifact = { museumId };
  }

  const [artifacts, scans, museums, artifactsByStatus] = await Promise.all([
    prisma.artifact.findMany({
      where: artifactWhere,
      select: {
        id: true,
        title: true,
        status: true,
        category: true,
        era: true,
        museumId: true,
        createdAt: true,
        museum: { select: { name: true } },
        _count: { select: { qrScans: true, media: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.qrScan.findMany({
      where: scanWhere,
      include: {
        artifact: { select: { id: true, title: true, museumId: true } },
      },
      orderBy: { scannedAt: 'desc' },
      take: 500,
    }),
    prisma.museum.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        _count: { select: { artifacts: true, galleries: true } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.artifact.groupBy({
      by: ['status'],
      where: artifactWhere,
      _count: { _all: true },
    }),
  ]);

  // Group scans by day in JS (portable across DBs)
  const scansByDayMap = {};
  for (const scan of scans) {
    const day = scan.scannedAt.toISOString().slice(0, 10);
    scansByDayMap[day] = (scansByDayMap[day] || 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    filters: { museumId: museumId || null, from: from || null, to: to || null },
    summary: {
      museums: museums.length,
      artifacts: artifacts.length,
      scans: scans.length,
      artifactsByStatus: Object.fromEntries(
        artifactsByStatus.map((row) => [row.status, row._count._all])
      ),
    },
    museums,
    artifacts,
    scans,
    scansByDay: Object.entries(scansByDayMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };

  if (format === 'csv') {
    return { format: 'csv', report };
  }

  return { format: 'json', report };
}

export function reportsToCsv(report) {
  const lines = [
    'section,id,title,status,category,museum,scans,createdAt',
  ];

  for (const a of report.artifacts) {
    lines.push(
      [
        'artifact',
        a.id,
        csvEscape(a.title),
        a.status,
        csvEscape(a.category || ''),
        csvEscape(a.museum?.name || ''),
        a._count?.qrScans ?? 0,
        a.createdAt.toISOString(),
      ].join(',')
    );
  }

  lines.push('');
  lines.push('section,id,artifactId,artifactTitle,ipAddress,scannedAt');
  for (const s of report.scans) {
    lines.push(
      [
        'scan',
        s.id,
        s.artifactId,
        csvEscape(s.artifact?.title || ''),
        csvEscape(s.ipAddress || ''),
        s.scannedAt.toISOString(),
      ].join(',')
    );
  }

  return lines.join('\n');
}

function csvEscape(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
