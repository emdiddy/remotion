import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, BEAT, DURATION} from '../theme.js';

const Crosshair = ({size = 56, stroke = 2, color, opacity}) => (
  <svg width={size} height={size} viewBox="0 0 56 56" style={{opacity}}>
    <circle cx="28" cy="28" r="13" fill="none" stroke={color} strokeWidth={stroke} />
    <line x1="28" y1="0" x2="28" y2="56" stroke={color} strokeWidth={stroke} />
    <line x1="0" y1="28" x2="56" y2="28" stroke={color} strokeWidth={stroke} />
  </svg>
);

// Farbkontrollstreifen wie am Bogenrand einer Offsetmaschine.
const ColorBar = ({opacity}) => (
  <div style={{display: 'flex', gap: 4, opacity}}>
    {[C.cyan, C.magenta, C.yellow, C.key, C.cyan, C.magenta].map((col, i) => (
      <div
        key={i}
        style={{
          width: 26,
          height: 12,
          background: col,
          opacity: i > 3 ? 0.45 : 1,
        }}
      />
    ))}
  </div>
);

export const PressSheet = () => {
  const frame = useCurrentFrame();

  const marksIn = interpolate(frame, [BEAT.marksIn, BEAT.marksIn + 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const marksOut = interpolate(frame, [BEAT.exit, DURATION - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Passermarken pulsen leicht mit, wenn eine Platte gelegt wird.
  const pulse = [BEAT.passC, BEAT.passM, BEAT.passY, BEAT.passK].reduce(
    (acc, b) =>
      acc +
      interpolate(frame, [b, b + 4, b + 12], [0, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      }),
    0
  );

  const markOpacity = marksIn * marksOut * (0.42 + pulse * 0.5);
  const sheetIn = interpolate(frame, [BEAT.sheetIn, BEAT.sheetIn + 26], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill>
      {/* Andruckbogen - bewusst dunkel, kein weisses Papier */}
      <div
        style={{
          position: 'absolute',
          inset: '72px 64px',
          border: `1px solid ${C.sheetEdge}`,
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0) 55%)',
          opacity: sheetIn * marksOut,
          transform: `translateY(${interpolate(sheetIn, [0, 1], [40, 0])}px)`,
        }}
      />

      {[
        {top: 28, left: 28},
        {top: 28, right: 28},
        {bottom: 28, left: 28},
        {bottom: 28, right: 28},
      ].map((pos, i) => (
        <div key={i} style={{position: 'absolute', ...pos}}>
          <Crosshair color={C.cyan} opacity={markOpacity} />
        </div>
      ))}

      <div style={{position: 'absolute', top: 42, left: '50%', transform: 'translateX(-50%)'}}>
        <ColorBar opacity={markOpacity * 0.9} />
      </div>
      <div style={{position: 'absolute', bottom: 42, left: '50%', transform: 'translateX(-50%)'}}>
        <ColorBar opacity={markOpacity * 0.9} />
      </div>
    </AbsoluteFill>
  );
};
