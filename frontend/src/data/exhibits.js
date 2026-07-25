import adwaHero from '../assets/images/heroes/adwa_hero.png';

/* ============================================================
   EXHIBITS — offline fallback keyed by QR payload
   Live data comes from GET /api/artifacts/:id and POST /api/qr/resolve.
   Keep this shape identical to the backend exhibit DTO.
   ============================================================ */

export const EXHIBITS = {
  'adwa-victory': {
    id: 'adwa-victory',
    title: 'The Victory of Adwa',
    subtitle: 'The battle that kept a nation free',
    era: '1 March 1896',
    gallery: 'Hall of Independence',
    image: adwaHero,
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
  },
  'menelik-ii': {
    id: 'menelik-ii',
    title: 'Emperor Menelik II',
    subtitle: 'The strategist who modernised an empire',
    era: 'Reign 1889 – 1913',
    gallery: 'Portrait Gallery',
    image: null,
    paragraphs: [
      'Menelik II drew Ethiopia\u2019s regions into a single state and built the army that would triumph at Adwa. He negotiated with European envoys while quietly importing modern rifles, judging correctly that diplomacy alone would not hold the empire\u2019s borders.',
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
  },
  'empress-taytu': {
    id: 'empress-taytu',
    title: 'Empress Taytu Betul',
    subtitle: 'Commander, diplomat, city founder',
    era: '1851 – 1918',
    gallery: 'Hall of Independence',
    image: null,
    paragraphs: [
      'Empress Taytu Betul led troops in her own right. At the siege of Mekelle she directed the operation that cut the fortress water supply, forcing the Italian garrison to surrender before the campaign reached Adwa.',
      'She was also the sharpest reader of treaty language at court, rejecting clauses that would have quietly made Ethiopia a protectorate. She named Addis Ababa \u2014 \u201cnew flower\u201d \u2014 and shaped the city\u2019s earliest years.',
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
  },
};

export const EXHIBIT_IDS = Object.keys(EXHIBITS);

export const exhibitList = () => EXHIBIT_IDS.map((id) => EXHIBITS[id]);

/** Younger visitors get the short version of every story */
export const exhibitParagraphs = (exhibit, simple = false) => {
  if (!exhibit) return [];
  return simple && exhibit.kidsText ? [exhibit.kidsText] : exhibit.paragraphs;
};

/** Full narration script for the audio format */
export const exhibitScript = (exhibit, simple = false) =>
  exhibit ? `${exhibit.title}. ${exhibitParagraphs(exhibit, simple).join(' ')}` : '';

/** Rough reading time in minutes, floored at one */
export const readingMinutes = (exhibit, simple = false) => {
  if (!exhibit) return 0;
  const words = exhibitParagraphs(exhibit, simple)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/** Turn a scanned QR payload (plain id or URL) into an exhibit id */
export const parseExhibitId = (payload) => {
  if (!payload) return null;
  const value = String(payload).trim();

  try {
    const url = new URL(value);
    const fromQuery = url.searchParams.get('exhibit') || url.searchParams.get('id');
    if (fromQuery) return fromQuery.toLowerCase();
    const lastSegment = url.pathname.split('/').filter(Boolean).pop();
    if (lastSegment) return lastSegment.toLowerCase();
  } catch {
    /* not a URL — fall through and treat the payload as an id */
  }

  return value.toLowerCase();
};

export const getExhibit = (payload) => EXHIBITS[parseExhibitId(payload)] || null;
