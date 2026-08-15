import React from 'react';
import {AbsoluteFill} from 'remotion';

// Rasterpunkte im echten Druckwinkel. Liegt als Multiply ueber der Farbe und
// gibt den Flaechen die Anmutung eines Andrucks statt eines Screens.
export const Halftone = ({angle = 15, size = 6, opacity = 0.35}) => (
  <AbsoluteFill
    style={{
      overflow: 'hidden',
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity,
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: '-40%',
        transform: `rotate(${angle}deg)`,
        backgroundImage: `radial-gradient(circle at center, #000 0 32%, transparent 34%)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  </AbsoluteFill>
);
