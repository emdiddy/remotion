// Duplicate24 - Display Loop Tokens
// Alle Zeiten in Frames @ 30fps. 300 Frames = 10s.

// Wie weit das Lockup ueber der Bildmitte steht, in Pixeln. Wortmarke und
// Farbfeld teilen sich den Wert: die Straenge muessen dort zusammenlaufen, wo
// das Logo steht, sonst sitzt es am duennen Rand der Flaeche.
export const LOCKUP_RISE = 130;

export const FPS = 30;
export const DURATION = 300;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Bewusst dunkel gehalten: der Screen steht im Schaufenster und laeuft nachts
// durch. Grosse helle Flaechen blenden die Strasse und brennen ein.
export const C = {
  bg: '#06070A',
  sheet: '#0E1015',
  sheetEdge: '#1B1F29',
  cyan: '#00AEEF',
  magenta: '#EC008C',
  yellow: '#FFF200',
  key: '#E8EAF0',
  brand: '#1FC1ED',
  muted: '#6C7385',
  // Das Blau direkt aus der Logodatei - liegt bereit, falls das Lockup doch
  // farbig stehen soll.
  logo: '#046EB6',
  // Schwarz fuer die Logo-Aussparung. Etwas tiefer als C.bg, damit sich das
  // Logo auch dort abhebt, wo die Farbpfuetze duenn wird.
  ink: '#000000',
};

// Echte Rasterwinkel aus dem Vierfarbdruck.
export const SCREEN_ANGLE = {
  cyan: 15,
  magenta: 75,
  yellow: 0,
  key: 45,
};

export const BEAT = {
  marksIn: 0,
  sheetIn: 8,
  passC: 36,
  passM: 57,
  passY: 78,
  passK: 99,
  snap: 120,
  snapEnd: 138,
  tagline: 150,
  services: 210,
  serviceStep: 12,
  address: 258,
  exit: 288,
};

export const SERVICES = [
  // Reihenfolge ist fix: Druckerei immer vor Copyshop.
  'Druckerei',
  'Copyshop',
  'Werbetechnik',
  'Konfigurator',
];
