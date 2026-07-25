import './GashaEmblem.css';

/* ── Geometry (512 x 512 viewBox, centre 256,256) ───────── */
const C = 256;
const TICK_COUNT = 22;
const CUT = '#150A04';

/* Plate radius is 242; anything beyond that reads as protruding metal. */
const FACE = 246;

/** One tapered sunburst sliver at 12 o'clock, widest at the outer end. */
const TICK_PATH = `
  M ${C - 8.5},${C - 143}
  Q ${C},${C - 147} ${C + 8.5},${C - 143}
  L ${C + 3.6},${C - 88}
  Q ${C},${C - 85} ${C - 3.6},${C - 88}
  Z
`;

/** Full-length spear: leaf blade clears the rim at one end, butt at the other. */
const SPEAR_METAL = `
  M -340,0
  L -308,-17
  L -272,-6
  L 332,-5.5
  L 332,5.5
  L -272,6
  L -308,17
  Z
`;

/** Sword point, protruding past the rim. */
const SWORD_TIP = `
  M 340,0
  L 266,-7
  L 266,7
  Z
`;

export default function GashaEmblem({ className = '' }) {
  return (
    <div className={`gasha ${className}`.trim()}>
      {/* Ambient bloom behind the plate */}
      <div className="gasha__glow" aria-hidden="true" />

      <svg
        className="gasha__svg"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Gasha, the traditional Ethiopian shield with crossed spear and sword"
      >
        <defs>
          {/* Copper plate: light falls from the upper left */}
          <radialGradient id="gashaPlate" cx="34%" cy="28%" r="82%">
            <stop offset="0%"   stopColor="#F0BE85" />
            <stop offset="38%"  stopColor="#DC9F63" />
            <stop offset="72%"  stopColor="#BE7C42" />
            <stop offset="100%" stopColor="#95592A" />
          </radialGradient>

          {/* Rim bevel */}
          <linearGradient id="gashaRim" x1="18%" y1="8%" x2="82%" y2="96%">
            <stop offset="0%"   stopColor="#FFD9A8" />
            <stop offset="45%"  stopColor="#9A5E2B" />
            <stop offset="100%" stopColor="#54300F" />
          </linearGradient>

          {/* Weapon metal, a shade deeper than the plate so it sits behind */}
          <linearGradient id="gashaMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#E8B27B" />
            <stop offset="35%"  stopColor="#C08048" />
            <stop offset="70%"  stopColor="#8E5527" />
            <stop offset="100%" stopColor="#5E3512" />
          </linearGradient>

          {/* Specular sheen across the upper left of the plate */}
          <linearGradient id="gashaSheen" x1="10%" y1="0%" x2="70%" y2="90%">
            <stop offset="0%"   stopColor="#FFFFFF" stopOpacity="0.34" />
            <stop offset="42%"  stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Depth on the cut edges: dark recess plus a warm lit lower lip */}
          <filter id="gashaEmboss" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="0.9"
              floodColor="#FFD9A0" floodOpacity="0.42" />
            <feDropShadow dx="0" dy="-1.2" stdDeviation="0.7"
              floodColor="#3A1B08" floodOpacity="0.55" />
          </filter>

          {/* Lifts the protruding weapon ends off the background */}
          <filter id="gashaWeaponShadow" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="4" dy="8" stdDeviation="7"
              floodColor="#000000" floodOpacity="0.60" />
          </filter>
        </defs>

        {/* Contact shadow under the plate */}
        <ellipse className="gasha__contact" cx={C} cy={C + 12} rx="250" ry="250" />

        <g className="gasha__disc">

          {/* ── Weapons, drawn first so the plate covers their middles ── */}
          <g className="gasha__weapons" fill="url(#gashaMetal)" filter="url(#gashaWeaponShadow)">
            {/* Spear, blade to the upper left */}
            <g transform={`translate(${C} ${C}) rotate(45)`}>
              <path d={SPEAR_METAL} />
              <circle cx="332" cy="0" r="9" />
            </g>

            {/* Sword, point to the upper right, hilt to the lower left */}
            <g transform={`translate(${C} ${C}) rotate(-45)`}>
              <path d={SWORD_TIP} />
              <rect x="-246" y="-7" width="512" height="14" rx="3" />
              <rect x="-263" y="-39" width="14" height="78" rx="5" />
              <rect x="-318" y="-5.5" width="69" height="11" rx="5" />
              <circle cx="-328" cy="0" r="14" />
            </g>
          </g>

          {/* ── Plate ── */}
          <circle cx={C} cy={C} r="248" fill="url(#gashaRim)" />
          <circle cx={C} cy={C} r="242" fill="url(#gashaPlate)" />

          {/* ── Cut-outs ── */}
          <g fill={CUT} filter="url(#gashaEmboss)">

            {/* Weapon shafts cut across the face, meeting the rim so they
                line up with the metal ends outside it */}
            <g transform={`translate(${C} ${C}) rotate(45)`}>
              <rect x={-FACE} y="-5.5" width={FACE * 2} height="11" rx="5" />
            </g>
            <g transform={`translate(${C} ${C}) rotate(-45)`}>
              <rect x={-FACE} y="-7" width={FACE * 2} height="14" rx="6" />
            </g>

            {/* Outer motif ring */}
            <circle cx={C} cy={C} r="152" fill="none" stroke={CUT} strokeWidth="7" />

            {/* Sunburst */}
            <g className="gasha__sunburst">
              {Array.from({ length: TICK_COUNT }).map((_, i) => (
                <path
                  key={i}
                  d={TICK_PATH}
                  transform={`rotate(${(360 / TICK_COUNT) * i} ${C} ${C})`}
                />
              ))}
            </g>

            {/* Inner bands */}
            <circle cx={C} cy={C} r="78" fill="none" stroke={CUT} strokeWidth="11" />
            <circle cx={C} cy={C} r="58" fill="none" stroke={CUT} strokeWidth="4.5" />

            {/* Hub with the cross motif */}
            <g className="gasha__hub">
              <circle cx={C} cy={C} r="40" fill="none" stroke={CUT} strokeWidth="7" />
              <g transform={`rotate(45 ${C} ${C})`}>
                <rect x={C - 34} y={C - 4.5} width="68" height="9" rx="4" />
                <rect x={C - 4.5} y={C - 34} width="9" height="68" rx="4" />
              </g>
              <circle cx={C} cy={C} r="7" fill="#C4834A" />
            </g>
          </g>

          {/* Sheen sits above the cut-outs so the whole face reads as one plate */}
          <circle cx={C} cy={C} r="242" fill="url(#gashaSheen)" pointerEvents="none" />
        </g>

        {/* Rotating highlight arc, revealed on hover */}
        <circle
          className="gasha__arc"
          cx={C} cy={C} r="245"
          fill="none"
          stroke="url(#gashaSheen)"
          strokeWidth="3"
          strokeDasharray="90 420"
          pointerEvents="none"
        />
      </svg>

      {/* Diagonal light sweep on hover */}
      <div className="gasha__sweep" aria-hidden="true" />
    </div>
  );
}
