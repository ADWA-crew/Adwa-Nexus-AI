/* ============================================================
   MUSEUM ROUTES — Adwa Victory Memorial Museum, Addis Ababa

   Route ids match the ones the visitor session returns, so a
   personalised recommendation can be resolved to a full route.

   NOTE FOR THE TEAM: hall names and floors follow the museum's
   published layout at a general level (welcome atrium, exhibition
   levels, panorama hall, library, amphitheatre). Replace the stop
   names and minutes with the official master plan when we get it —
   the UI reads everything from this file.
   ============================================================ */

export const MUSEUM = {
  name: 'Adwa Victory Memorial Museum',
  city: 'Addis Ababa',
  area: 'Piassa, beside Menelik II Square',
  opened: 2024,
};

export const ROUTE_FILTERS = [
  { id: 'all',       label: 'All routes' },
  { id: 'tourist',   label: 'Guided visit' },
  { id: 'minor',     label: 'Family' },
  { id: 'research',  label: 'Research' },
  { id: 'accessible', label: 'Step-free' },
];

export const ROUTES = [
  {
    id: 'r-adwa-story',
    title: 'The Road to Adwa',
    tagline: 'The whole story, from the Treaty of Wuchale to the victory and its echo',
    profile: 'tourist',
    audience: 'Guided visit',
    duration: '55 min',
    floors: 'Ground → Level 2',
    accessible: true,
    start: 'Welcome Atrium, ground floor',
    summary:
      'The main route through the museum, walked in the order the history happened. It ends in the panorama hall, where the battle fills the walls.',
    stops: [
      {
        name: 'Welcome Atrium',
        floor: 'Ground',
        minutes: 5,
        note: 'Orientation under the memorial dome. Pick up a headset and set your language.',
      },
      {
        name: 'Ethiopia Before 1896',
        floor: 'Ground',
        minutes: 6,
        note: 'Maps of the Horn, the regions of the empire, and the powers circling the coast.',
      },
      {
        name: 'The Treaty of Wuchale',
        floor: 'Ground',
        minutes: 6,
        note: 'Article 17 read side by side in Amharic and Italian — the sentence that led to war.',
      },
      {
        name: 'Call to Arms',
        floor: 'Level 1',
        minutes: 7,
        note: 'Menelik\u2019s mobilisation proclamation and the regiments that answered it.',
        exhibitId: 'menelik-ii',
      },
      {
        name: 'March to the North',
        floor: 'Level 1',
        minutes: 6,
        note: 'Supply lines, pack animals and the porters who carried an army over the highlands.',
      },
      {
        name: 'Siege of Mekelle',
        floor: 'Level 1',
        minutes: 6,
        note: 'The fortress cut off from its water, and the negotiation that followed.',
        exhibitId: 'empress-taytu',
      },
      {
        name: 'Panorama Hall — 1 March 1896',
        floor: 'Level 2',
        minutes: 10,
        note: 'The battle painted around you, hour by hour, from dawn to the afternoon.',
        exhibitId: 'adwa-victory',
      },
      {
        name: 'After the Victory',
        floor: 'Level 2',
        minutes: 6,
        note: 'Prisoners, peace terms and the Treaty of Addis Ababa signed later that year.',
      },
      {
        name: 'Adwa in the World',
        floor: 'Level 2',
        minutes: 5,
        note: 'How the news travelled, and what it meant far beyond Ethiopia.',
      },
    ],
  },

  {
    id: 'r-adwa-kids',
    title: 'Heroes of Adwa',
    tagline: 'A short, story-led walk for young explorers',
    profile: 'minor',
    audience: 'Family',
    duration: '35 min',
    floors: 'Ground → Level 2',
    accessible: true,
    start: 'Welcome Atrium, ground floor',
    summary:
      'Six stops, big pictures and short stories. Every stop can be read aloud, so nobody has to do the reading.',
    stops: [
      {
        name: 'Welcome Atrium',
        floor: 'Ground',
        minutes: 4,
        note: 'Say hello to the museum and find the giant map on the floor.',
      },
      {
        name: 'Meet the Emperor',
        floor: 'Level 1',
        minutes: 6,
        note: 'Menelik II, the leader who brought trains and telephones — and won a battle.',
        exhibitId: 'menelik-ii',
      },
      {
        name: 'Meet the Empress',
        floor: 'Level 1',
        minutes: 6,
        note: 'Taytu Betul, who led soldiers and gave Addis Ababa its name.',
        exhibitId: 'empress-taytu',
      },
      {
        name: 'The Big Day',
        floor: 'Level 2',
        minutes: 8,
        note: 'Stand inside the painting of the battle and find the flags.',
        exhibitId: 'adwa-victory',
      },
      {
        name: 'Drums, Horns and Flags',
        floor: 'Level 2',
        minutes: 6,
        note: 'The sounds an army marched to. Some of them you can try.',
      },
      {
        name: 'Make Your Own Badge',
        floor: 'Ground',
        minutes: 5,
        note: 'Draw a shield in the activity corner and take it home.',
      },
    ],
  },

  {
    id: 'r-adwa-archive',
    title: 'Adwa 1896: Primary Sources',
    tagline: 'Documents, correspondence and photography for close study',
    profile: 'research',
    audience: 'Research',
    duration: '90 min',
    floors: 'Level 2 → Library',
    accessible: true,
    start: 'Library reception, request a reader pass',
    summary:
      'A slower route built around the written record. Bring a reader pass; some rooms ask for an appointment.',
    stops: [
      {
        name: 'Library Reading Room',
        floor: 'Library',
        minutes: 15,
        note: 'Catalogue orientation, finding aids and the rules for handling originals.',
      },
      {
        name: 'Treaty Documents',
        floor: 'Library',
        minutes: 12,
        note: 'Wuchale and Addis Ababa in facsimile, with the translation dispute annotated.',
      },
      {
        name: 'Correspondence and Telegrams',
        floor: 'Library',
        minutes: 12,
        note: 'Court letters and wires exchanged during the mobilisation.',
      },
      {
        name: 'Campaign Maps',
        floor: 'Level 2',
        minutes: 10,
        note: 'Troop positions across the Adwa hills, compared against modern survey.',
      },
      {
        name: 'Photographic Archive',
        floor: 'Level 2',
        minutes: 12,
        note: 'Contemporary plates and the European press engravings made from them.',
        exhibitId: 'adwa-victory',
      },
      {
        name: 'Panorama Study Balcony',
        floor: 'Level 2',
        minutes: 10,
        note: 'The panorama viewed from above, with the sources each scene was painted from.',
      },
      {
        name: 'Oral Histories Booth',
        floor: 'Library',
        minutes: 12,
        note: 'Recorded family accounts from the regions that sent regiments north.',
      },
      {
        name: 'Conservation Window',
        floor: 'Library',
        minutes: 7,
        note: 'Watch paper and textile conservation in progress.',
      },
    ],
  },

  {
    id: 'r-adwa-step-free',
    title: 'Step-free Highlights',
    tagline: 'The essential stops, lifts all the way, seating at each one',
    profile: 'tourist',
    audience: 'Step-free',
    duration: '30 min',
    floors: 'Ground → Level 2 by lift',
    accessible: true,
    start: 'Accessible entrance, ground floor',
    summary:
      'A short visit that avoids stairs entirely and keeps a bench within reach of every stop.',
    stops: [
      {
        name: 'Welcome Atrium',
        floor: 'Ground',
        minutes: 5,
        note: 'Step-free entry, cloakroom and the lift to the exhibition levels.',
      },
      {
        name: 'Panorama Hall',
        floor: 'Level 2',
        minutes: 12,
        note: 'The battle panorama, with seating along the centre of the room.',
        exhibitId: 'adwa-victory',
      },
      {
        name: 'Portrait Gallery',
        floor: 'Level 2',
        minutes: 7,
        note: 'The leaders of the campaign at eye level, with large-print labels.',
        exhibitId: 'menelik-ii',
      },
      {
        name: 'Legacy Hall',
        floor: 'Level 1',
        minutes: 5,
        note: 'What Adwa came to mean, in film and in voices.',
      },
      {
        name: 'Courtyard Café',
        floor: 'Ground',
        minutes: 5,
        note: 'Rest, water and a quiet view of the square.',
      },
    ],
  },
];

export const getRoute = (id) => ROUTES.find((route) => route.id === id) || null;

export const routeStopCount = (route) => route?.stops?.length ?? 0;

/** Total minutes across the stops, used as a sanity figure beside duration */
export const routeMinutes = (route) =>
  route?.stops?.reduce((total, stop) => total + (stop.minutes || 0), 0) ?? 0;

/** Floors in visiting order, each with the stops that sit on it */
export const routeFloors = (route) => {
  const order = [];
  const byFloor = new Map();

  route?.stops?.forEach((stop) => {
    if (!byFloor.has(stop.floor)) {
      byFloor.set(stop.floor, []);
      order.push(stop.floor);
    }
    byFloor.get(stop.floor).push(stop);
  });

  return order.map((floor) => ({ floor, stops: byFloor.get(floor) }));
};

export const filterRoutes = (filter) => {
  if (filter === 'all') return ROUTES;
  if (filter === 'accessible') return ROUTES.filter((route) => route.accessible);
  return ROUTES.filter((route) => route.profile === filter);
};
