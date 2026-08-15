import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';
import {C, BEAT, PAIRS, GRID, TILE_W, TILE_H} from './tokens.js';
import {ICONS} from './icons.jsx';

const {fontFamily: DISPLAY} = loadFont();

const Tile = ({spec, p}) => {
  const Icon = ICONS[spec.icon];
  const bg = C[spec.bg];
  const ink = C[spec.ink];

  return (
    <div
      style={{
        width: TILE_W,
        height: TILE_H,
        backgroundColor: bg,
        borderRadius: 34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        padding: 56,
        boxSizing: 'border-box',
      }}
    >
      <Icon p={p} ink={ink} />
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: spec.title.length > 12 ? 92 : 112,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: ink,
            textTransform: 'uppercase',
          }}
        >
          {spec.title}
        </div>
        {spec.sub ? (
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: spec.sub.length > 12 ? 46 : 76,
              lineHeight: 1.0,
              letterSpacing: spec.sub.length > 12 ? '0.08em' : '-0.03em',
              color: ink,
              textTransform: 'uppercase',
              marginTop: spec.sub.length > 12 ? 16 : 4,
              opacity: spec.sub.length > 12 ? 0.75 : 1,
            }}
          >
            {spec.sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Eine Walze pro Bildhaelfte. Abgehende und einlaufende Kachel haengen an
// derselben Fortschrittszahl und stehen dadurch immer exakt 100 Prozent
// auseinander - sie laufen als ein Band durch das Fenster. Zwei getrennte
// Kurven ergaeben dazwischen eine Luecke, und damit waere es keine Walze mehr,
// sondern eine Diashow.
const Reel = ({slot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const local = frame - BEAT.tiles;
  // Nach unten mitklemmen: einen Frame vor BEAT.tiles wird die Walze schon
  // gerendert, local ist dann negativ und floor() liefert -1.
  const idx = Math.max(
    0,
    Math.min(Math.floor(local / BEAT.pairLen), PAIRS.length - 1)
  );
  const handoff = BEAT.tiles + idx * BEAT.pairLen;

  // Die untere Kachel laeuft drei Frames spaeter - der leichte Versatz macht
  // aus zwei gleichzeitigen Bewegungen einen Doppelschlag.
  const stagger = slot === 1 ? 3 : 0;

  // Das erste Paar bekommt Vorlauf: es laeuft schon ein, waehrend das
  // Achteck aus Phase 1 noch aufzieht. Ohne den Vorlauf steht zwischen
  // Stopper und erster Kachel ein knappes halbes Dutzend leerer Frames.
  const headStart = idx === 0 ? 9 : 0;

  const adv = spring({
    frame: frame - handoff - stagger + headStart,
    fps,
    config: {damping: 15, mass: 0.7, stiffness: 190},
    durationInFrames: 15,
  });

  // Oben laeuft das Band nach unten, unten nach oben.
  const d = slot === 0 ? 1 : -1;

  const incoming = PAIRS[idx][slot];
  const outgoing = idx > 0 ? PAIRS[idx - 1][slot] : null;

  const p = interpolate(frame, [handoff, handoff + BEAT.pairLen - 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Das letzte Paar faehrt nicht weiter: es zoomt nach aussen weg und macht
  // die Mitte fuer die Marke frei.
  const zoomOut = interpolate(frame, [BEAT.outro, BEAT.outro + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  // Das Band traegt beide Kacheln in Laufrichtung. Oben laeuft es nach unten,
  // die abgehende Kachel liegt also unter der neuen; unten ist es umgekehrt.
  const spacer = <div style={{width: TILE_W, height: TILE_H}} />;
  const outTile = outgoing ? <Tile spec={outgoing} p={1} /> : spacer;
  const inTile = <Tile spec={incoming} p={p} />;

  // In Pixeln, nicht in Prozent: Prozent bezoege sich auf die Hoehe des Bandes,
  // und das ist zwei Kacheln hoch.
  const bandY = d === 1 ? (adv - 1) * TILE_H : -adv * TILE_H;

  return (
    <div
      style={{
        width: TILE_W,
        height: TILE_H,
        overflow: 'hidden',
        borderRadius: 34,
        transform: `scale(${interpolate(zoomOut, [0, 1], [1, 2.1])})`,
        opacity: interpolate(zoomOut, [0, 0.85], [1, 0], {extrapolateRight: 'clamp'}),
      }}
    >
      <div style={{transform: `translateY(${bandY}px)`}}>
        {d === 1 ? inTile : outTile}
        {d === 1 ? outTile : inTile}
      </div>
    </div>
  );
};

export const Tiles = () => (
  <AbsoluteFill
    style={{
      padding: GRID.margin,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: GRID.gap,
    }}
  >
    {[0, 1].map((slot) => (
      <Reel key={slot} slot={slot} />
    ))}
  </AbsoluteFill>
);
