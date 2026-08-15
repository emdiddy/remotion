import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {loadFont as loadDisplay} from '@remotion/google-fonts/InterTight';
import {C, BEAT, SERVICES} from '../theme.js';

const {fontFamily: DISPLAY} = loadDisplay();

// Mechanischer Flip wie eine Fallblattanzeige. Die Kante bekommt beim Umschlag
// kurz Cyan - der Rest bleibt neutral, damit die Schrift lesbar bleibt.
export const ServiceFlip = () => {
  const frame = useCurrentFrame();
  const local = frame - BEAT.services;
  const step = BEAT.serviceStep;

  if (local < -step || local > SERVICES.length * step + step) return null;

  const index = Math.min(Math.floor(local / step), SERVICES.length - 1);
  const t = (local - index * step) / step;

  const label = SERVICES[Math.max(index, 0)];

  const rot = interpolate(t, [0, 0.35, 1], [78, 0, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const fade = interpolate(local, [-6, 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const out = interpolate(
    local,
    [SERVICES.length * step - 4, SERVICES.length * step + 6],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const edge = interpolate(t, [0, 0.3, 0.6], [1, 0.5, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 430,
        perspective: 1400,
        opacity: fade * out,
      }}
    >
      <div
        style={{
          transform: `rotateX(${rot}deg)`,
          transformOrigin: 'center top',
          fontFamily: DISPLAY,
          fontSize: 108,
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: C.key,
          padding: '18px 46px',
          borderTop: `3px solid ${C.cyan}`,
          borderBottom: `3px solid rgba(0,174,239,${edge})`,
          textShadow: `0 0 ${edge * 34}px ${C.brand}`,
        }}
      >
        {label}
      </div>
    </AbsoluteFill>
  );
};
