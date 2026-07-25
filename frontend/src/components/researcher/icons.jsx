/* Shared line icons for the researcher experience.
   Stroke uses currentColor so buttons control their own tint. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const ScanIcon = ({ size = 17 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base} strokeWidth={2}>
    <polyline points="3,7 3,3 7,3" />
    <polyline points="13,3 17,3 17,7" />
    <polyline points="17,13 17,17 13,17" />
    <polyline points="7,17 3,17 3,13" />
    <line x1="3" y1="10" x2="17" y2="10" />
  </svg>
);

export const TextIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base}>
    <line x1="4" y1="5" x2="16" y2="5" />
    <line x1="4" y1="9" x2="16" y2="9" />
    <line x1="4" y1="13" x2="12" y2="13" />
  </svg>
);

export const SpeakerIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base}>
    <polygon points="4,8 7,8 11,4 11,16 7,12 4,12" />
    <path d="M14 7.5a4 4 0 0 1 0 5" />
  </svg>
);

export const VideoIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base}>
    <rect x="3" y="5" width="10" height="10" rx="2" />
    <path d="M13 9l4-2.5v7L13 11z" />
  </svg>
);

export const PlayIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d="M6 4.2v11.6a.8.8 0 0 0 1.22.68l9.1-5.8a.8.8 0 0 0 0-1.36l-9.1-5.8A.8.8 0 0 0 6 4.2z" />
  </svg>
);

export const PauseIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} fill="currentColor" aria-hidden="true">
    <rect x="5" y="4" width="3.6" height="12" rx="1.2" />
    <rect x="11.4" y="4" width="3.6" height="12" rx="1.2" />
  </svg>
);

export const RestartIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base}>
    <path d="M16 10a6 6 0 1 1-1.9-4.35" />
    <polyline points="16,3 16,6.2 12.8,6.2" />
  </svg>
);

export const ArrowRightIcon = ({ size = 15 }) => (
  <svg viewBox="0 0 20 20" width={size} height={size} {...base}>
    <line x1="4" y1="10" x2="16" y2="10" />
    <polyline points="11,5 16,10 11,15" />
  </svg>
);

export const CloseIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} strokeWidth={2}>
    <line x1="5" y1="5" x2="19" y2="19" />
    <line x1="19" y1="5" x2="5" y2="19" />
  </svg>
);

export const QrGlyph = ({ size = 60 }) => (
  <svg viewBox="0 0 48 48" width={size} height={size} {...base} strokeWidth={1.6}>
    <rect x="5" y="5" width="13" height="13" rx="3" />
    <rect x="30" y="5" width="13" height="13" rx="3" />
    <rect x="5" y="30" width="13" height="13" rx="3" />
    <path d="M30 30h5v5h-5zM38 30h5M30 38h5M38 38h5" />
  </svg>
);
