import bcrypt from 'bcryptjs';
import { PrismaClient, ArtifactStatus, MuseumStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

const ROUTES = [
  {
    id: 'seed-route-adwa-kids',
    slug: 'r-adwa-kids',
    title: 'Heroes of Adwa',
    duration: '35 min',
    stops: 6,
    profile: 'minor',
    description: 'Story-led path for young explorers.',
  },
  {
    id: 'seed-route-lucy-kids',
    slug: 'r-lucy-kids',
    title: 'Meet Lucy the Ancestor',
    duration: '25 min',
    stops: 4,
    profile: 'minor',
  },
  {
    id: 'seed-route-crowns',
    slug: 'r-crowns',
    title: 'Crowns, Shields and Kings',
    duration: '30 min',
    stops: 5,
    profile: 'minor',
  },
  {
    id: 'seed-route-adwa-archive',
    slug: 'r-adwa-archive',
    title: 'Adwa 1896: Primary Sources',
    duration: '90 min',
    stops: 14,
    profile: 'research',
  },
  {
    id: 'seed-route-aksum',
    slug: 'r-aksum',
    title: 'Aksumite Steles and Inscriptions',
    duration: '75 min',
    stops: 11,
    profile: 'research',
  },
  {
    id: 'seed-route-manuscripts',
    slug: 'r-manuscripts',
    title: "Ge'ez Manuscript Collection",
    duration: '80 min',
    stops: 9,
    profile: 'research',
  },
  {
    id: 'seed-route-adwa-story',
    slug: 'r-adwa-story',
    title: 'The Road to Adwa',
    duration: '55 min',
    stops: 9,
    profile: 'tourist',
  },
  {
    id: 'seed-route-lalibela',
    slug: 'r-lalibela',
    title: 'Rock-Hewn Lalibela',
    duration: '60 min',
    stops: 8,
    profile: 'tourist',
  },
  {
    id: 'seed-route-highlands',
    slug: 'r-highlands',
    title: 'Highland Heritage Trail',
    duration: '45 min',
    stops: 7,
    profile: 'tourist',
  },
];

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@adwa.nexus' },
    update: { password: passwordHash, role: Role.ADMIN, name: 'Adwa Admin' },
    create: {
      email: 'admin@adwa.nexus',
      password: passwordHash,
      name: 'Adwa Admin',
      role: Role.ADMIN,
    },
  });

  const museum = await prisma.museum.upsert({
    where: { id: 'seed-museum-adwa' },
    update: {},
    create: {
      id: 'seed-museum-adwa',
      name: 'Adwa Victory Memorial Museum',
      description: 'A museum celebrating Ethiopian heritage and the Battle of Adwa.',
      address: 'Addis Ababa, Ethiopia',
      status: MuseumStatus.ACTIVE,
      openingHours: {
        monday: '09:00-17:00',
        tuesday: '09:00-17:00',
        wednesday: '09:00-17:00',
        thursday: '09:00-17:00',
        friday: '09:00-17:00',
        saturday: '10:00-16:00',
        sunday: 'closed',
      },
    },
  });

  const gallery = await prisma.gallery.upsert({
    where: { id: 'seed-gallery-main' },
    update: {},
    create: {
      id: 'seed-gallery-main',
      museumId: museum.id,
      name: 'Main Hall',
      description: 'Primary exhibition hall',
      floor: '1',
      room: 'A',
    },
  });

  const artifacts = [
    {
      id: 'seed-artifact-shield',
      title: 'Warrior Shield',
      description: 'Traditional shield used during the Battle of Adwa.',
      era: '19th century',
      category: 'weapons',
      location: 'Hall A-1',
    },
    {
      id: 'seed-artifact-crown',
      title: 'Royal Crown Replica',
      description: 'Symbolic crown representing Ethiopian monarchy.',
      era: '19th century',
      category: 'royalty',
      location: 'Hall A-2',
    },
    {
      id: 'seed-artifact-manuscript',
      title: "Ge'ez Manuscript",
      description: "Historical manuscript in Ge'ez script.",
      era: '18th century',
      category: 'manuscripts',
      location: 'Hall A-3',
    },
    {
      id: 'seed-artifact-flag',
      title: 'Battle Standard',
      description: 'Flag associated with Ethiopian forces at Adwa.',
      era: '19th century',
      category: 'symbols',
      location: 'Hall A-4',
    },
  ];

  for (const artifact of artifacts) {
    await prisma.artifact.upsert({
      where: { id: artifact.id },
      update: {
        status: ArtifactStatus.PUBLISHED,
        galleryId: gallery.id,
      },
      create: {
        ...artifact,
        museumId: museum.id,
        galleryId: gallery.id,
        status: ArtifactStatus.PUBLISHED,
      },
    });

    await prisma.qrCode.upsert({
      where: { artifactId: artifact.id },
      update: {},
      create: {
        id: `seed-qr-${artifact.id}`,
        code: `QR-${artifact.id.toUpperCase()}`,
        artifactId: artifact.id,
        url: `https://adwa.nexus/artifacts/${artifact.id}`,
      },
    });
  }

  for (const route of ROUTES) {
    await prisma.tourRoute.upsert({
      where: { slug: route.slug },
      update: {
        title: route.title,
        duration: route.duration,
        stops: route.stops,
        profile: route.profile,
        description: route.description ?? null,
        museumId: museum.id,
      },
      create: {
        id: route.id,
        slug: route.slug,
        title: route.title,
        duration: route.duration,
        stops: route.stops,
        profile: route.profile,
        description: route.description ?? null,
        museumId: museum.id,
      },
    });
  }

  console.log('Seed complete:', {
    museumId: museum.id,
    artifacts: artifacts.length,
    routes: ROUTES.length,
    admin: 'admin@adwa.nexus / Admin123!',
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
