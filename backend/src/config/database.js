import { prisma } from '../lib/prisma.js';

export { prisma };

export async function checkDatabaseConnection() {
  await prisma.$queryRaw`SELECT 1`;
  return true;
}
