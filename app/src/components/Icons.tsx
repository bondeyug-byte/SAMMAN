// One coherent line-icon family. All icons use currentColor strokes and are decorative
// (aria-hidden) unless a label is passed.
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size: number, vb: number, p: P) => ({
  width: size,
  height: size,
  viewBox: `0 0 ${vb} ${vb}`,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: vb === 48 ? 1.6 : 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
  ...p,
});

/* ── Navigation (24) ───────────────────────── */
export const IconCompass = ({ size = 26, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5 13.4 13.4 8.5 15.5 10.6 10.6z" />
    <circle cx="12" cy="12" r="0.6" />
  </svg>
);
export const IconGrid = ({ size = 26, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="0.5" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="0.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="0.5" />
    <path d="M13.5 17.5v-3.5a.5.5 0 0 1 .5-.5h5.5a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H16" />
  </svg>
);
export const IconPeople = ({ size = 26, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <circle cx="12" cy="7" r="2.4" />
    <circle cx="5.5" cy="9" r="2" />
    <circle cx="18.5" cy="9" r="2" />
    <path d="M8 18.5v-1.8a4 4 0 0 1 8 0v1.8z" />
    <path d="M2.5 18.5v-1a3 3 0 0 1 4.6-2.5M21.5 18.5v-1a3 3 0 0 0-4.6-2.5" />
  </svg>
);
export const IconLifeRing = ({ size = 26, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" />
  </svg>
);
export const IconBook = ({ size = 22, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
  </svg>
);
export const IconStart = ({ size = 22, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <rect x="5" y="4" width="14" height="17" rx="1.5" />
    <path d="M9 4V3h6v1M8.5 12.5l2.2 2.2 4.8-4.8" />
  </svg>
);
export const IconBuilding = ({ size = 22, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <path d="M3 9.5 12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" />
  </svg>
);
export const IconDocument = ({ size = 22, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <path d="M6 3.5h8l4 4v13H6z" />
    <path d="M14 3.5v4h4M9 12h6M9 15h6M9 18h4" />
  </svg>
);
export const IconArrowUpRight = ({ size = 16, ...p }: P) => (
  <svg {...base(size, 24, p)} strokeWidth={2}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const IconArrowRight = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 24, p)} strokeWidth={1.8}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);
export const IconPause = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 24, p)} strokeWidth={2}>
    <path d="M8.5 5v14M15.5 5v14" />
  </svg>
);
export const IconChat = ({ size = 18, ...p }: P) => (
  <svg {...base(size, 24, p)}>
    <path d="M12 4c4.7 0 8.5 3.1 8.5 7s-3.8 7-8.5 7c-1 0-2-.1-2.9-.4L4.5 20l1.3-3.8C4.3 14.9 3.5 13 3.5 11c0-3.9 3.8-7 8.5-7z" />
    <path d="M8.5 10h7M8.5 13h4.5" />
  </svg>
);

/* ── Topic symbols (48) ────────────────────── */
export const SymbolHand = ({ size = 72, ...p }: P) => (
  <svg {...base(size, 48, p)}>
    <path d="M17 27V12.5a2.5 2.5 0 0 1 5 0V24" />
    <path d="M22 23V9.5a2.5 2.5 0 0 1 5 0V23" />
    <path d="M27 23V11a2.5 2.5 0 0 1 5 0v13" />
    <path d="M32 24v-7.5a2.5 2.5 0 0 1 5 0V29c0 7-5 12-11.5 12S15 37.5 13 33.5l-4-7.5a2.6 2.6 0 0 1 4.3-2.8L17 27.5" />
  </svg>
);
export const SymbolEquality = ({ size = 72, ...p }: P) => (
  <svg {...base(size, 48, p)}>
    <circle cx="12" cy="10.5" r="3.6" />
    <path d="M8.5 17.5h7a2 2 0 0 1 2 2V29h-2v11h-7V29h-2v-9.5a2 2 0 0 1 2-2z" />
    <circle cx="36" cy="10.5" r="3.6" />
    <path d="M32.5 17.5h7a2 2 0 0 1 2 2V29h-2v11h-7V29h-2v-9.5a2 2 0 0 1 2-2z" />
    <path d="M21.5 23h5M21.5 27.5h5" />
  </svg>
);
export const SymbolSpeak = ({ size = 72, ...p }: P) => (
  <svg {...base(size, 48, p)}>
    <path d="M9 7h18a4.5 4.5 0 0 1 4.5 4.5v9A4.5 4.5 0 0 1 27 25H16l-6.5 5.5V25H9a4.5 4.5 0 0 1-4.5-4.5v-9A4.5 4.5 0 0 1 9 7z" />
    <path d="M15.3 13.2a2.8 2.8 0 1 1 3.9 2.6c-.9.4-1.2 1-1.2 1.8v.6" />
    <circle cx="18" cy="21" r="0.5" fill="currentColor" />
    <path d="M34.5 17H39a4.5 4.5 0 0 1 4.5 4.5v8.5A4.5 4.5 0 0 1 39 34.5h-.5V40l-6.5-5.5h-8a4.5 4.5 0 0 1-4.5-4.5v-1" />
    <path d="M27 26.5h9M27 30h6" />
  </svg>
);
export const SymbolSupport = ({ size = 72, ...p }: P) => (
  <svg {...base(size, 48, p)}>
    <path d="M18.5 5h11a3.5 3.5 0 0 1 3.5 3.5v5.5a3.5 3.5 0 0 1-3.5 3.5h-3.5l-3 3v-3h-4.5A3.5 3.5 0 0 1 15 14V8.5A3.5 3.5 0 0 1 18.5 5z" />
    <path d="M20 10h8M20 13h5" />
    <path d="M6 22v10c0 3 1.5 5 4 7l5.5 4.5H22V36c0-2-1-3.5-2.5-4.5L14 27a2 2 0 0 0-2.8 2.8L15 34" />
    <path d="M42 22v10c0 3-1.5 5-4 7l-5.5 4.5H26V36c0-2 1-3.5 2.5-4.5L34 27a2 2 0 0 1 2.8 2.8L33 34" />
  </svg>
);
