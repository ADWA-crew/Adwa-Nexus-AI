import bcrypt from 'bcryptjs';
import {
  PrismaClient,
  ArtifactStatus,
  MediaType,
  MuseumStatus,
  Role,
} from '@prisma/client';
import { buildQrUrl } from '../src/utils/generateQR.js';

const prisma = new PrismaClient();

const MUSEUM_ID = 'seed-museum-adwa';

const GALLERIES = [
  {
    id: 'seed-gallery-independence',
    name: 'Hall of Independence',
    description: 'The Battle of Adwa and the defence of Ethiopian sovereignty.',
    floor: '1',
    room: 'A',
  },
  {
    id: 'seed-gallery-portrait',
    name: 'Portrait Gallery',
    description: 'Leaders, strategists and founders of modern Ethiopia.',
    floor: '1',
    room: 'B',
  },
  {
    id: 'seed-gallery-main',
    name: 'Main Hall',
    description: 'Primary exhibition hall with arms, standards and manuscripts.',
    floor: '1',
    room: 'C',
  },
];

/** Matches frontend exhibit shape (ScanStage / ExhibitViewer). */
const EXHIBITS = [
  {
    id: 'adwa-victory',
    slug: 'adwa-victory',
    galleryId: 'seed-gallery-independence',
    title: 'The Victory of Adwa',
    subtitle: 'The battle that kept a nation free',
    description:
      'On 1 March 1896, Ethiopian forces defeated the Italian army near Adwa and secured recognition of Ethiopian sovereignty.',
    era: '1 March 1896',
    category: 'battle',
    location: 'Hall of Independence',
    coverImage: null,
    paragraphs: [
      'On 1 March 1896, Ethiopian forces under Emperor Menelik II and Empress Taytu Betul met the invading Italian army in the mountains near Adwa. Tens of thousands of soldiers had marched north from every corner of the empire, carrying supplies over highland passes that no European map had charted properly.',
      'By the afternoon the Italian columns had been separated and surrounded in unfamiliar terrain. The defeat forced Italy to recognise Ethiopian sovereignty in the Treaty of Addis Ababa, and the victory echoed far beyond Africa as proof that a colonial army could be beaten decisively.',
    ],
    kidsText:
      'A long time ago, soldiers from far away came to take Ethiopia. People from every village walked over the mountains to stop them. On one day in March, they won the battle at Adwa — and Ethiopia stayed free.',
    facts: [
      { label: 'Date', value: '1 March 1896' },
      { label: 'Location', value: 'Adwa, Tigray' },
      { label: 'Outcome', value: 'Ethiopian victory' },
      { label: 'Treaty', value: 'Addis Ababa, 1896' },
    ],
    youtubeId: 'Qp1Kk820zK4',
    videoCaption: 'A short film on the campaign and the day of the battle.',
    sortOrder: 1,
  },
  {
    id: 'menelik-ii',
    slug: 'menelik-ii',
    galleryId: 'seed-gallery-portrait',
    title: 'Emperor Menelik II',
    subtitle: 'The strategist who modernised an empire',
    description:
      'Menelik II unified Ethiopia’s regions, modernised the state, and led the army that triumphed at Adwa.',
    era: 'Reign 1889 – 1913',
    category: 'royalty',
    location: 'Portrait Gallery',
    coverImage: null,
    paragraphs: [
      'Menelik II drew Ethiopia’s regions into a single state and built the army that would triumph at Adwa. He negotiated with European envoys while quietly importing modern rifles, judging correctly that diplomacy alone would not hold the empire’s borders.',
      'His reign brought the first railway, telegraph lines, schools and a new capital at Addis Ababa. The city he founded with Empress Taytu grew from a hot-spring camp into the political heart of the country.',
    ],
    kidsText:
      'Menelik II was an emperor and a very clever planner. He brought the first trains and telephones to Ethiopia, built a brand new capital city, and led the army that won at Adwa.',
    facts: [
      { label: 'Reign', value: '1889 – 1913' },
      { label: 'Capital', value: 'Addis Ababa' },
      { label: 'Known for', value: 'Adwa, modernisation' },
      { label: 'Consort', value: 'Empress Taytu Betul' },
    ],
    youtubeId: 'Qp1Kk820zK4',
    videoCaption: 'Portraits, letters and photographs from the imperial court.',
    sortOrder: 2,
  },
  {
    id: 'empress-taytu',
    slug: 'empress-taytu',
    galleryId: 'seed-gallery-independence',
    title: 'Empress Taytu Betul',
    subtitle: 'Commander, diplomat, city founder',
    description:
      'Empress Taytu Betul led troops at Mekelle, shaped treaty negotiations, and named Addis Ababa.',
    era: '1851 – 1918',
    category: 'royalty',
    location: 'Hall of Independence',
    coverImage: null,
    paragraphs: [
      'Empress Taytu Betul led troops in her own right. At the siege of Mekelle she directed the operation that cut the fortress water supply, forcing the Italian garrison to surrender before the campaign reached Adwa.',
      'She was also the sharpest reader of treaty language at court, rejecting clauses that would have quietly made Ethiopia a protectorate. She named Addis Ababa — “new flower” — and shaped the city’s earliest years.',
    ],
    kidsText:
      'Empress Taytu was brave and smart. She led soldiers to a fort and stopped its water, so the enemy had to give up. She also chose the name of Addis Ababa, which means "new flower".',
    facts: [
      { label: 'Lived', value: '1851 – 1918' },
      { label: 'Role', value: 'Empress and commander' },
      { label: 'Known for', value: 'Siege of Mekelle' },
      { label: 'Legacy', value: 'Named Addis Ababa' },
    ],
    youtubeId: 'Qp1Kk820zK4',
    videoCaption: 'Her campaign role and the founding of Addis Ababa.',
    sortOrder: 3,
  },
];

const OBJECTS = [
  {
    id: 'seed-artifact-shield',
    slug: 'warrior-shield',
    galleryId: 'seed-gallery-main',
    title: 'Warrior Shield',
    subtitle: 'Arms of the highland infantry',
    description: 'Traditional shield used during the Battle of Adwa.',
    era: '19th century',
    category: 'weapons',
    location: 'Hall A-1',
    paragraphs: [
      'Wooden and hide shields like this one were carried by Ethiopian infantry at Adwa. They were light enough for mountain marches and strong enough to turn aside bayonet thrusts in close fighting.',
    ],
    kidsText:
      'Soldiers carried round shields made of wood and animal skin to protect themselves in battle.',
    facts: [
      { label: 'Material', value: 'Wood & hide' },
      { label: 'Era', value: '19th century' },
      { label: 'Use', value: 'Infantry defence' },
    ],
    youtubeId: null,
    videoCaption: null,
    sortOrder: 10,
  },
  {
    id: 'seed-artifact-crown',
    slug: 'royal-crown',
    galleryId: 'seed-gallery-main',
    title: 'Royal Crown Replica',
    subtitle: 'Symbol of Ethiopian monarchy',
    description: 'Symbolic crown representing Ethiopian monarchy.',
    era: '19th century',
    category: 'royalty',
    location: 'Hall A-2',
    paragraphs: [
      'Crowns signalled imperial authority across Ethiopia’s highland courts. This replica stands for the ceremonial power Menelik II and Taytu Betul projected before and after Adwa.',
    ],
    kidsText: 'Kings and queens wore special crowns to show they were leaders of the country.',
    facts: [
      { label: 'Type', value: 'Ceremonial replica' },
      { label: 'Era', value: '19th century' },
    ],
    youtubeId: null,
    videoCaption: null,
    sortOrder: 11,
  },
  {
    id: 'seed-artifact-manuscript',
    slug: 'geez-manuscript',
    galleryId: 'seed-gallery-main',
    title: "Ge'ez Manuscript",
    subtitle: 'Sacred and scholarly writing',
    description: "Historical manuscript in Ge'ez script.",
    era: '18th century',
    category: 'manuscripts',
    location: 'Hall A-3',
    paragraphs: [
      "Ge'ez manuscripts preserved liturgy, law and history for centuries. Researchers use them to reconstruct how Ethiopian courts recorded diplomacy and faith.",
    ],
    kidsText: 'Long ago, people wrote important stories and prayers in a special script called Ge\'ez.',
    facts: [
      { label: 'Script', value: "Ge'ez" },
      { label: 'Era', value: '18th century' },
    ],
    youtubeId: null,
    videoCaption: null,
    sortOrder: 12,
  },
  {
    id: 'seed-artifact-flag',
    slug: 'battle-standard',
    galleryId: 'seed-gallery-main',
    title: 'Battle Standard',
    subtitle: 'Colours of the Ethiopian host',
    description: 'Flag associated with Ethiopian forces at Adwa.',
    era: '19th century',
    category: 'symbols',
    location: 'Hall A-4',
    paragraphs: [
      'Battle standards marked units on the field and rallied troops across the ridges around Adwa. Colour and emblem told soldiers where their commanders stood.',
    ],
    kidsText: 'Flags helped soldiers find their friends and leaders during the big battle.',
    facts: [
      { label: 'Role', value: 'Unit marker' },
      { label: 'Era', value: '19th century' },
    ],
    youtubeId: null,
    videoCaption: null,
    sortOrder: 13,
  },
];

const ROUTES = [
  {
    id: 'seed-route-adwa-kids',
    slug: 'r-adwa-kids',
    title: 'Heroes of Adwa',
    duration: '35 min',
    profile: 'minor',
    description: 'Story-led path for young explorers.',
    stopSlugs: ['adwa-victory', 'empress-taytu', 'menelik-ii', 'warrior-shield'],
  },
  {
    id: 'seed-route-lucy-kids',
    slug: 'r-lucy-kids',
    title: 'Meet Lucy the Ancestor',
    duration: '25 min',
    profile: 'minor',
    description: 'A short intro to deep history for children.',
    stopSlugs: ['warrior-shield', 'battle-standard'],
  },
  {
    id: 'seed-route-crowns',
    slug: 'r-crowns',
    title: 'Crowns, Shields and Kings',
    duration: '30 min',
    profile: 'minor',
    description: 'Objects that tell royal and warrior stories.',
    stopSlugs: ['royal-crown', 'warrior-shield', 'menelik-ii'],
  },
  {
    id: 'seed-route-adwa-archive',
    slug: 'r-adwa-archive',
    title: 'Adwa 1896: Primary Sources',
    duration: '90 min',
    profile: 'research',
    description: 'Deep dive for researchers and students.',
    stopSlugs: ['adwa-victory', 'geez-manuscript', 'empress-taytu', 'menelik-ii'],
  },
  {
    id: 'seed-route-aksum',
    slug: 'r-aksum',
    title: 'Aksumite Steles and Inscriptions',
    duration: '75 min',
    profile: 'research',
    description: 'Context trail linking empire and writing traditions.',
    stopSlugs: ['geez-manuscript', 'royal-crown'],
  },
  {
    id: 'seed-route-manuscripts',
    slug: 'r-manuscripts',
    title: "Ge'ez Manuscript Collection",
    duration: '80 min',
    profile: 'research',
    description: 'Catalogue-focused reading room path.',
    stopSlugs: ['geez-manuscript', 'adwa-victory'],
  },
  {
    id: 'seed-route-adwa-story',
    slug: 'r-adwa-story',
    title: 'The Road to Adwa',
    duration: '55 min',
    profile: 'tourist',
    description: 'Narrative walkthrough of Ethiopia’s defining victory.',
    stopSlugs: ['adwa-victory', 'menelik-ii', 'empress-taytu', 'battle-standard'],
  },
  {
    id: 'seed-route-lalibela',
    slug: 'r-lalibela',
    title: 'Rock-Hewn Lalibela',
    duration: '60 min',
    profile: 'tourist',
    description: 'Faith, stone and highland architecture.',
    stopSlugs: ['geez-manuscript', 'royal-crown'],
  },
  {
    id: 'seed-route-highlands',
    slug: 'r-highlands',
    title: 'Highland Heritage Trail',
    duration: '45 min',
    profile: 'tourist',
    description: 'A compact greatest-hits route through the halls.',
    stopSlugs: ['adwa-victory', 'warrior-shield', 'battle-standard', 'menelik-ii'],
  },
];

async function upsertArtifact(museumId, artifact) {
  const data = {
    museumId,
    galleryId: artifact.galleryId,
    slug: artifact.slug,
    title: artifact.title,
    subtitle: artifact.subtitle ?? null,
    description: artifact.description ?? null,
    era: artifact.era ?? null,
    category: artifact.category ?? null,
    location: artifact.location ?? null,
    coverImage: artifact.coverImage ?? null,
    paragraphs: artifact.paragraphs ?? [],
    kidsText: artifact.kidsText ?? null,
    facts: artifact.facts ?? [],
    youtubeId: artifact.youtubeId ?? null,
    videoCaption: artifact.videoCaption ?? null,
    sortOrder: artifact.sortOrder ?? 0,
    status: ArtifactStatus.PUBLISHED,
  };

  await prisma.artifact.upsert({
    where: { id: artifact.id },
    update: data,
    create: { id: artifact.id, ...data },
  });

  const code = artifact.slug;
  await prisma.qrCode.upsert({
    where: { artifactId: artifact.id },
    update: {
      code,
      url: buildQrUrl(code),
    },
    create: {
      id: `seed-qr-${artifact.id}`,
      code,
      artifactId: artifact.id,
      url: buildQrUrl(code),
    },
  });
}

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
    where: { id: MUSEUM_ID },
    update: {
      name: 'Adwa Victory Memorial Museum',
      description:
        'A living memorial to the Battle of Adwa and the heritage of Ethiopian sovereignty.',
      address: 'Addis Ababa, Ethiopia',
      status: MuseumStatus.ACTIVE,
      coverImage: null,
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
    create: {
      id: MUSEUM_ID,
      name: 'Adwa Victory Memorial Museum',
      description:
        'A living memorial to the Battle of Adwa and the heritage of Ethiopian sovereignty.',
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

  for (const gallery of GALLERIES) {
    await prisma.gallery.upsert({
      where: { id: gallery.id },
      update: {
        name: gallery.name,
        description: gallery.description,
        floor: gallery.floor,
        room: gallery.room,
        museumId: museum.id,
      },
      create: {
        ...gallery,
        museumId: museum.id,
      },
    });
  }

  const allArtifacts = [...EXHIBITS, ...OBJECTS];
  for (const artifact of allArtifacts) {
    await upsertArtifact(museum.id, artifact);
  }

  /* Cover image media rows for catalogue UIs */
  for (const artifact of allArtifacts) {
    if (!artifact.coverImage) continue;
    const existing = await prisma.media.findFirst({
      where: { artifactId: artifact.id, type: MediaType.IMAGE },
    });
    if (!existing) {
      await prisma.media.create({
        data: {
          artifactId: artifact.id,
          url: artifact.coverImage,
          type: MediaType.IMAGE,
          filename: `${artifact.slug}-cover`,
        },
      });
    }
  }

  const slugToId = Object.fromEntries(allArtifacts.map((a) => [a.slug, a.id]));

  for (const route of ROUTES) {
    const stopSlugs = route.stopSlugs ?? [];
    await prisma.tourRoute.upsert({
      where: { slug: route.slug },
      update: {
        title: route.title,
        duration: route.duration,
        stops: stopSlugs.length,
        profile: route.profile,
        description: route.description ?? null,
        museumId: museum.id,
      },
      create: {
        id: route.id,
        slug: route.slug,
        title: route.title,
        duration: route.duration,
        stops: stopSlugs.length,
        profile: route.profile,
        description: route.description ?? null,
        museumId: museum.id,
      },
    });

    const saved = await prisma.tourRoute.findUnique({ where: { slug: route.slug } });
    await prisma.tourRouteStop.deleteMany({ where: { routeId: saved.id } });

    for (let i = 0; i < stopSlugs.length; i += 1) {
      const artifactId = slugToId[stopSlugs[i]] ?? null;
      await prisma.tourRouteStop.create({
        data: {
          id: `${saved.id}-stop-${i + 1}`,
          routeId: saved.id,
          artifactId,
          order: i + 1,
          title: allArtifacts.find((a) => a.slug === stopSlugs[i])?.title ?? null,
        },
      });
    }
  }

  console.log('Seed complete:', {
    museumId: museum.id,
    galleries: GALLERIES.length,
    exhibits: EXHIBITS.length,
    objects: OBJECTS.length,
    routes: ROUTES.length,
    admin: 'admin@adwa.nexus / Admin123!',
    qrCodes: allArtifacts.map((a) => a.slug),
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
