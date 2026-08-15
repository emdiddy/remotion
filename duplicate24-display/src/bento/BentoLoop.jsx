import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, BEAT} from './tokens.js';
import {Stopper} from './Stopper.jsx';
import {Tiles} from './Tiles.jsx';
import {Outro, Seam} from './Outro.jsx';

// Bento-Loop: 10 Sekunden, drei Phasen, kein Ton.
//   0 -  45  Stopper, Vollton
//  45 - 225  vier Paare zu je zwei Kacheln, Walzenlauf
// 225 - 300  Marke, Adresse, QR
export const BentoLoop = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {frame < BEAT.tiles ? <Stopper /> : null}
      {frame >= BEAT.tiles - 10 ? <Tiles /> : null}
      <Outro />
      <Seam />
    </AbsoluteFill>
  );
};
