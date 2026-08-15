import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {loadFont} from '@remotion/google-fonts/InterTight';
import {C, BEAT, DURATION} from './tokens.js';

const {fontFamily: DISPLAY} = loadFont();

const LOGO_W = 860;
const LOGO_H = Math.round((LOGO_W * 772) / 4996);

// Standort-Pin, gezeichnet statt gesetzt - ein Emoji-Pin haette in jeder
// Umgebung eine andere Farbe.
const Pin = ({size = 44, color}) => (
  <svg width={size} height={size * 1.24} viewBox="0 0 44 55" fill="none">
    <path
      d="M22 2 C10.9 2 2 10.9 2 22 C2 36 22 53 22 53 C22 53 42 36 42 22 C42 10.9 33.1 2 22 2 Z"
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <circle cx="22" cy="21" r="7.5" fill={color} />
  </svg>
);

export const Outro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const local = frame - BEAT.outro;
  if (local < -4) return null;

  const markIn = spring({
    frame: local - 6,
    fps,
    config: {damping: 15, mass: 0.7, stiffness: 170},
    durationInFrames: 20,
  });

  const lineIn = spring({
    frame: local - 14,
    fps,
    config: {damping: 17, mass: 0.6, stiffness: 160},
    durationInFrames: 18,
  });

  const cardIn = spring({
    frame: local - 22,
    fps,
    config: {damping: 17, mass: 0.7, stiffness: 150},
    durationInFrames: 20,
  });

  // Der Rahmen zieht sich einmal um den Code. Kein Blinken: ein blinkender
  // Rand macht den Code beim Scannen schwerer zu erfassen, nicht leichter.
  const RING = 4 * 236;
  const ring = interpolate(frame, [BEAT.outro + 26, BEAT.outro + 56], [RING, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const logoUrl = `url(${staticFile('logo-full.png')})`;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(-96px)`,
        }}
      >
        {/* Die Wortmarke laeuft ueber dieselbe Alphamaske wie im anderen
            Konzept, hier in Papierweiss auf Anthrazit. */}
        <div
          style={{
            width: LOGO_W,
            height: LOGO_H,
            backgroundColor: C.paper,
            maskImage: logoUrl,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskImage: logoUrl,
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            opacity: markIn,
            transform: `scale(${interpolate(markIn, [0, 1], [0.86, 1])})`,
          }}
        />

        <div
          style={{
            marginTop: 48,
            fontFamily: DISPLAY,
            fontWeight: 800,
            fontSize: 60,
            letterSpacing: '-0.02em',
            color: C.yellow,
            textTransform: 'uppercase',
            textAlign: 'center',
            opacity: lineIn,
            transform: `translateY(${interpolate(lineIn, [0, 1], [26, 0])}px)`,
          }}
        >
          Dein Print- &amp; Designpartner
        </div>

        <div
          style={{
            marginTop: 20,
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: 40,
            letterSpacing: '0.05em',
            color: C.muted,
            textAlign: 'center',
            opacity: lineIn,
          }}
        >
          Vor Ort in Frankfurt &amp; 24/7 online
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 336,
          display: 'flex',
          alignItems: 'center',
          gap: 44,
          opacity: cardIn,
          transform: `translateY(${interpolate(cardIn, [0, 1], [44, 0])}px)`,
        }}
      >
        <div style={{position: 'relative', width: 252, height: 252}}>
          <div
            style={{
              position: 'absolute',
              inset: 8,
              backgroundColor: '#FFFFFF',
              padding: 14,
              boxSizing: 'border-box',
            }}
          >
            <Img
              src={staticFile('qr.png')}
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </div>
          <svg width="252" height="252" style={{position: 'absolute', inset: 0}}>
            <rect
              x="8"
              y="8"
              width="236"
              height="236"
              fill="none"
              stroke={C.cyan}
              strokeWidth={6}
              strokeDasharray={RING}
              strokeDashoffset={ring}
            />
          </svg>
        </div>

        <div>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12}}>
            <Pin size={38} color={C.cyan} />
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 34,
                letterSpacing: '0.16em',
                color: C.cyan,
                textTransform: 'uppercase',
              }}
            >
              Frankfurt
            </span>
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontWeight: 800,
              fontSize: 54,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: C.paper,
            }}
          >
            Mainzer
            <br />
            Landstrasse 109
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 34,
              color: C.yellow,
            }}
          >
            duplicate24.de
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Die Naht: der Vollton von Frame 0 faehrt am Ende wieder auf. Ohne das
// springt der Loop vom dunklen Outro hart in die gelbe Flaeche.
export const Seam = () => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [BEAT.seam, DURATION - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  if (grow <= 0) return null;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 980,
          height: 980,
          backgroundColor: C.yellow,
          clipPath:
            'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
          transform: `scale(${interpolate(grow, [0, 1], [0.1, 7])})`,
        }}
      />
    </AbsoluteFill>
  );
};
