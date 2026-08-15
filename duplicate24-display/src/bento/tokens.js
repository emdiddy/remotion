// Duplicate24 - Bento-Loop
// Eigener Tokensatz. Der Vierfarb-Andruck in ../theme.js bleibt unberuehrt,
// die beiden Konzepte teilen sich bewusst nichts ausser Format und Laenge.

export const FPS = 30;
export const DURATION = 300;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const C = {
  // Traeger ist Anthrazit, nicht Schwarz: auf einem Schaufenster-Screen wirkt
  // reines Schwarz bei Tageslicht wie ein Loch, die Kacheln stehen auf
  // Anthrazit ruhiger im Bild.
  bg: '#0B0C0F',
  ink: '#0B0C0F',
  yellow: '#FFE500',
  cyan: '#00C2FF',
  paper: '#F2F4F8',
  muted: '#8A90A0',
};

export const BEAT = {
  stopper: 0,
  tiles: 45,
  pairLen: 45,
  outro: 225,
  // Die letzten Frames holen den Vollton von Frame 0 zurueck, damit der Loop
  // beim Ruecksprung nicht sichtbar schneidet.
  seam: 288,
};

// Reihenfolge ist gesetzt: Express zuerst, danach absteigend nach Auflage.
// Jede Kachel traegt eine grosse Zeile und optional eine kleine - laenger als
// drei Woerter wird beim Vorbeigehen nicht mehr gelesen.
export const PAIRS = [
  [
    {icon: 'stopwatch', title: 'SAME DAY', sub: 'EXPRESS', bg: 'yellow', ink: 'ink'},
    {icon: 'printer', title: 'DIGITAL', sub: 'DRUCK', bg: 'cyan', ink: 'ink'},
  ],
  [
    {icon: 'plan', title: 'GROSSFORMAT', sub: '& PLÄNE', bg: 'paper', ink: 'ink'},
    {icon: 'book', title: 'BINDUNGEN', sub: 'ABSCHLUSSARBEITEN', bg: 'yellow', ink: 'ink'},
  ],
  [
    {icon: 'shirt', title: 'TEXTIL', sub: 'DRUCK', bg: 'cyan', ink: 'ink'},
    {icon: 'sign', title: 'WERBE', sub: 'TECHNIK', bg: 'paper', ink: 'ink'},
  ],
  [
    {icon: 'box', title: 'VERPACKUNGEN', sub: null, bg: 'yellow', ink: 'ink'},
    {icon: 'brush', title: 'GRAFIK & DESIGN', sub: 'LETTERSHOP', bg: 'cyan', ink: 'ink'},
  ],
];

// Kachelgeometrie. Aussenrand und Fuge bestimmen die Hoehe, damit oben und
// unten exakt gleich gross sind.
export const GRID = {
  margin: 48,
  gap: 28,
};
export const TILE_W = WIDTH - GRID.margin * 2;
export const TILE_H = (HEIGHT - GRID.margin * 2 - GRID.gap) / 2;
