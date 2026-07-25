import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@adwa.nexus' },
    update: {
      password: passwordHash,
      role: 'ADMIN',
      name: 'Adwa Admin',
    },
    create: {
      email: 'admin@adwa.nexus',
      password: passwordHash,
      name: 'Adwa Admin',
      role: 'ADMIN',
    },
  });

  const curator = await prisma.user.upsert({
    where: { email: 'curator@adwa.nexus' },
    update: {
      password: passwordHash,
      role: 'CURATOR',
      name: 'Adwa Curator',
    },
    create: {
      email: 'curator@adwa.nexus',
      password: passwordHash,
      name: 'Adwa Curator',
      role: 'CURATOR',
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'visitor@adwa.nexus' },
    update: {
      password: passwordHash,
      role: 'VIEWER',
      name: 'Demo Visitor',
    },
    create: {
      email: 'visitor@adwa.nexus',
      password: passwordHash,
      name: 'Demo Visitor',
      role: 'VIEWER',
    },
  });

  const museum = await prisma.museum.upsert({
    where: { id: 'seed_museum_adwa' },
    update: {
      name: 'Adwa Victory Museum',
      description: 'Heritage museum showcasing Ethiopian history and the Battle of Adwa.',
      status: 'ACTIVE',
      address: 'Addis Ababa, Ethiopia',
    },
    create: {
      id: 'seed_museum_adwa',
      name: 'Adwa Victory Museum',
      description: 'Heritage museum showcasing Ethiopian history and the Battle of Adwa.',
      status: 'ACTIVE',
      address: 'Addis Ababa, Ethiopia',
      openingHours: {
        mon: '09:00-17:00',
        tue: '09:00-17:00',
        wed: '09:00-17:00',
        thu: '09:00-17:00',
        fri: '09:00-17:00',
        sat: '10:00-16:00',
        sun: 'Closed',
      },
    },
  });

  const gallery1 = await prisma.gallery.upsert({
    where: { id: 'seed_gallery_hall_a' },
    update: { name: 'Hall of Heroes', museumId: museum.id },
    create: {
      id: 'seed_gallery_hall_a',
      museumId: museum.id,
      name: 'Hall of Heroes',
      description: 'Artifacts related to Ethiopian leaders and resistance.',
      floor: '1',
      room: 'A1',
    },
  });

  const gallery2 = await prisma.gallery.upsert({
    where: { id: 'seed_gallery_hall_b' },
    update: { name: 'Arms & Diplomacy', museumId: museum.id },
    create: {
      id: 'seed_gallery_hall_b',
      museumId: museum.id,
      name: 'Arms & Diplomacy',
      description: 'Weapons, treaties, and diplomatic gifts.',
      floor: '1',
      room: 'B2',
    },
  });

  const artifact1 = await prisma.artifact.upsert({
    where: { id: 'seed_artifact_shield' },
    update: { title: 'Ceremonial Shield', museumId: museum.id },
    create: {
      id: 'seed_artifact_shield',
      museumId: museum.id,
      galleryId: gallery1.id,
      title: 'Ceremonial Shield',
      description: 'A decorated shield associated with Adwa-era warriors.',
      era: '19th Century',
      category: 'weapon',
      status: 'PUBLISHED',
      location: 'Hall A / Case 3',
      createdById: curator.id,
    },
  });

  await prisma.artifact.upsert({
    where: { id: 'seed_artifact_flag' },
    update: { title: 'Battle Standard', museumId: museum.id },
    create: {
      id: 'seed_artifact_flag',
      museumId: museum.id,
      galleryId: gallery1.id,
      title: 'Battle Standard',
      description: 'Replica standard carried during the Battle of Adwa.',
      era: '1896',
      category: 'textile',
      status: 'PUBLISHED',
      location: 'Hall A / Wall 2',
      createdById: curator.id,
    },
  });

  await prisma.artifact.upsert({
    where: { id: 'seed_artifact_letter' },
    update: { title: 'Diplomatic Letter', museumId: museum.id },
    create: {
      id: 'seed_artifact_letter',
      museumId: museum.id,
      galleryId: gallery2.id,
      title: 'Diplomatic Letter',
      description: 'Correspondence related to late-19th century diplomacy.',
      era: '1890s',
      category: 'document',
      status: 'DRAFT',
      location: 'Archive Room',
      createdById: admin.id,
    },
  });

  await prisma.media.deleteMany({ where: { artifactId: artifact1.id } });
  await prisma.media.create({
    data: {
      artifactId: artifact1.id,
      url: 'https://images.unsplash.com/photo-1566127444979-b3f0b6e6f0e7',
      type: 'IMAGE',
      filename: 'ceremonial-shield.jpg',
      mimeType: 'image/jpeg',
      size: 245000,
      uploadedById: curator.id,
    },
  });

  const qr = await prisma.qrCode.upsert({
    where: { artifactId: artifact1.id },
    update: {
      code: 'ADWA-SHIELD-001',
      url: 'https://adwa.nexus/a/ADWA-SHIELD-001',
    },
    create: {
      code: 'ADWA-SHIELD-001',
      artifactId: artifact1.id,
      url: 'https://adwa.nexus/a/ADWA-SHIELD-001',
    },
  });

  const existingScan = await prisma.qrScan.findFirst({
    where: { qrCodeId: qr.id },
  });
  if (!existingScan) {
    await prisma.qrScan.create({
      data: {
        qrCodeId: qr.id,
        artifactId: artifact1.id,
        ipAddress: '127.0.0.1',
        userAgent: 'seed-script',
      },
    });
  }

  console.log('Seed complete:');
  console.log(`  Admin:   admin@adwa.nexus / Admin123! (${admin.id})`);
  console.log(`  Curator: curator@adwa.nexus / Admin123! (${curator.id})`);
  console.log(`  Viewer:  visitor@adwa.nexus / Admin123! (${viewer.id})`);
  console.log(`  Museum:  ${museum.name} (${museum.id})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
