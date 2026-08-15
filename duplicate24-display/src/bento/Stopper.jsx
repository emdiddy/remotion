import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';
import {C, BEAT} from './tokens.js';

const {fontFamily: DISPLAY} = loadFont();

// Phase 1: 1,5 Sekunden, in denen nur eines passiert - jemand bleibt stehen.
// Vollton Gelb, darauf das Achteck als Stoppzeichen. Die Form ist bewusst die
// eines Verkehrsschilds: sie wird erkannt, bevor sie gelesen wird.
export const Stopper = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame,
    fps,
    config: {damping: 11, mass: 0.7, stiffness: 190},
    durationInFrames: 26,
  });

  // Das Achteck faehrt am Ende ueber den Rand hinaus auf und gibt das Bild an
  // die Kacheln ab, statt einfach auszublenden.
  const blowUp = interpolate(frame, [BEAT.tiles - 10, BEAT.tiles], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const scale = interpolate(pop, [0, 1], [0.2, 1]) * interpolate(blowUp, [0, 1], [1, 7]);
  const spin = interpolate(pop, [0, 1], [-24, 0]);
  const textOut = interpolate(blowUp, [0, 0.35], [1, 0], {extrapolateRight: 'clamp'});

  const subIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 16, mass: 0.6, stiffness: 170},
    durationInFrames: 18,
  });

  return (
    <AbsoluteFill style={{backgroundColor: C.yellow}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            width: 980,
            height: 980,
            backgroundColor: C.ink,
            // Achteck
            clipPath:
              'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            transform: `scale(${scale}) rotate(${spin}deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: textOut * interpolate(pop, [0.4, 1], [0, 1], {extrapolateLeft: 'clamp'}),
          transform: `translateY(-40px)`,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 132,
            lineHeight: 0.92,
            letterSpacing: '-0.04em',
            color: C.yellow,
            textAlign: 'center',
            textTransform: 'uppercase',
            maxWidth: 780,
          }}
        >
          Was darf&rsquo;s sein?
        </div>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 210,
          opacity: subIn * textOut,
          transform: `translateY(${interpolate(subIn, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: '0.06em',
            color: C.ink,
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          Wir drucken &amp; gestalten alles.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
