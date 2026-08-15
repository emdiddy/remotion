import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, BEAT, DURATION, LOCKUP_RISE, HEIGHT} from './theme.js';
import {InkField} from './shader/InkField.jsx';
import {PressSheet} from './scenes/PressSheet.jsx';
import {Wordmark} from './scenes/Wordmark.jsx';
import {Tagline} from './scenes/Tagline.jsx';
import {ServiceFlip} from './scenes/ServiceFlip.jsx';
import {AddressCard} from './scenes/AddressCard.jsx';

export const DisplayLoop = () => {
  const frame = useCurrentFrame();

  // Der Passer-Wert steuert Shader und Wortmarke gemeinsam: davor Chaos,
  // danach ein Bild.
  const converge = interpolate(frame, [BEAT.passC, BEAT.snap, BEAT.snapEnd], [0, 0.15, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const inkIntensity = interpolate(
    frame,
    [0, 20, BEAT.snap, BEAT.snap + 8, BEAT.services, DURATION - 1],
    [0.15, 0.45, 0.55, 0.9, 0.4, 0.15],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Solange das ausgesparte Logo steht, haelt der Traeger unter dem Lockup
  // die Deckung - unabhaengig davon, dass das Feld ringsum zurueckgeht.
  const inkHold = interpolate(
    frame,
    [BEAT.snap, BEAT.snap + 10, BEAT.exit, DURATION - 6],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  // Globaler Blendschutz: der letzte Frame trifft den ersten, der Loop
  // schliesst sich ohne Sprung.
  const seam = interpolate(frame, [DURATION - 8, DURATION - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <AbsoluteFill style={{opacity: 0.85 * seam}}>
        <InkField
          converge={converge}
          intensity={inkIntensity}
          focus={LOCKUP_RISE / HEIGHT}
          hold={inkHold}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{opacity: seam}}>
        <PressSheet />
        <Wordmark />
        <Tagline />
        <ServiceFlip />
        <AddressCard />
      </AbsoluteFill>

      {/* Leichte Abdunklung am unteren Rand - Text bleibt bei Tageslicht lesbar */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to top, ${C.bg}CC 0%, transparent 26%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
