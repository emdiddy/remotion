import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {C, BEAT} from '../theme.js';

const {fontFamily: MONO} = loadMono();

const LINE = 'Gedruckt um die Ecke. Gesehen in der ganzen Stadt.';

export const Tagline = () => {
  const frame = useCurrentFrame();

  const chars = Math.round(
    interpolate(frame, [BEAT.tagline, BEAT.tagline + 42], [0, LINE.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const out = interpolate(frame, [BEAT.services - 6, BEAT.services + 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cursor blinkt im Vierertakt - ersetzt den fehlenden Ton als Taktgeber.
  const cursor = frame % 16 < 8 && chars < LINE.length ? 1 : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 420,
        opacity: out,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 40,
          fontWeight: 400,
          color: C.brand,
          letterSpacing: '0.01em',
          maxWidth: 820,
          textAlign: 'center',
          lineHeight: 1.45,
        }}
      >
        {LINE.slice(0, chars)}
        <span style={{opacity: cursor, color: C.magenta}}>_</span>
      </div>
    </AbsoluteFill>
  );
};
