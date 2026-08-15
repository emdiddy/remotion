import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  spring,
  useVideoConfig,
  Easing,
  staticFile,
} from 'remotion';
import {C, BEAT, SCREEN_ANGLE, DURATION, LOCKUP_RISE} from '../theme.js';
import {Halftone} from './Halftone.jsx';

// Das Logo ist 4996x772, also 6,47:1. Breite gibt den Ton an, die Hoehe faellt
// daraus - das Lockup wird nie umgebaut.
const LOGO_RATIO = 772 / 4996;
const LOGO_W = 900;
const LOGO_H = Math.round(LOGO_W * LOGO_RATIO);

// Jeder Durchgang legt dieselbe Logo-Silhouette - nur versetzt. Im
// Passer-Moment fahren alle Versaetze auf null und die vier Platten werden zu
// einem Bild.
const PASSES = [
  {key: 'passC', color: C.cyan, offset: [-26, 14], angle: SCREEN_ANGLE.cyan, blend: 'screen'},
  {key: 'passM', color: C.magenta, offset: [22, -18], angle: SCREEN_ANGLE.magenta, blend: 'screen'},
  {key: 'passY', color: C.yellow, offset: [-12, -26], angle: SCREEN_ANGLE.yellow, blend: 'screen'},
  {key: 'passK', color: C.key, offset: [8, 10], angle: SCREEN_ANGLE.key, blend: 'normal'},
];

// Die Logodatei liegt als Alphamaske vor: die Flaeche kommt aus der Farbe, die
// Form aus der Maske. So laesst sich dieselbe Datei in jeder Druckfarbe legen.
const Plate = ({src, color, style, children}) => {
  const url = `url(${staticFile(src)})`;
  return (
    <div
      style={{
        position: 'relative',
        width: LOGO_W,
        height: LOGO_H,
        backgroundColor: color,
        maskImage: url,
        maskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskImage: url,
        WebkitMaskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Wordmark = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Der Snap: drei Frames, in denen alles einrastet. Kein Ease-Out, sondern
  // ein kurzes Ueberschwingen - so fuehlt sich Mechanik an.
  const snap = spring({
    frame: frame - BEAT.snap,
    fps,
    config: {damping: 12, mass: 0.5, stiffness: 220},
    durationInFrames: 18,
  });

  // Im Einrast-Moment loesen die vier Druckplatten das echte Logo ab. Die
  // Ueberblende ueberlappt bewusst, damit die Farbe ins Logo hineinblutet.
  const logoIn = interpolate(frame, [BEAT.snap, BEAT.snap + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const platesOut = interpolate(frame, [BEAT.snap + 2, BEAT.snap + 14], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exit = interpolate(frame, [BEAT.exit, DURATION - 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Sanfte Drift gegen Einbrennen: das Logo steht nie exakt still.
  const driftX = Math.sin(frame / 47) * 5;
  const driftY = Math.cos(frame / 61) * 4;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${driftX}px, ${driftY - LOCKUP_RISE}px)`,
        opacity: exit,
      }}
    >
      {PASSES.map(({key, color, offset, angle, blend}) => {
        const start = BEAT[key];

        const ink = interpolate(frame, [start, start + 6], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.quad),
        });

        // Versatz faehrt mit dem Snap auf null.
        const ox = interpolate(snap, [0, 1], [offset[0], 0]);
        const oy = interpolate(snap, [0, 1], [offset[1], 0]);

        // Vor dem Snap steht die Platte leicht schief im Bogen.
        const skew = interpolate(snap, [0, 1], [offset[0] * 0.02, 0]);

        return (
          <div
            key={key}
            style={{
              position: 'absolute',
              transform: `translate(${ox}px, ${oy}px) rotate(${skew}deg)`,
              mixBlendMode: blend,
              opacity: ink * platesOut,
              filter: `blur(${interpolate(snap, [0, 1], [1.4, 0])}px)`,
            }}
          >
            <Plate src="logo-full.png" color={color}>
              <Halftone angle={angle} size={7} opacity={interpolate(snap, [0, 1], [0.5, 0.12])} />
            </Plate>
          </div>
        );
      })}

      {/* Das fertige Logo steht komplett in Schwarz - als Aussparung in der
          Farbe, nicht als Farbe auf dem Bogen. Die Schwarzplatte ist der
          letzte Durchgang, alles davor war nur Buntfarbe. */}
      <div
        style={{
          position: 'absolute',
          width: LOGO_W,
          height: LOGO_H,
          opacity: logoIn,
        }}
      >
        {/* Unterfuetterung, im Druck der Choke: eine minimal groessere, weiche
            Schwarzplatte unter der scharfen. Ohne sie knabbern die Rasterpunkte
            an den Buchstabenkanten und duenne Stellen wie die Tagline franzen
            aus. */}
        <Plate
          src="logo-full.png"
          color={C.ink}
          style={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(7px)',
            transform: 'scale(1.015)',
          }}
        />
        <Plate src="logo-full.png" color={C.ink} style={{position: 'absolute', inset: 0}} />
      </div>

      {/* Der Cyan-Impuls im Einrast-Moment - der eigentliche Blickfang. */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${C.brand}55 0%, transparent 62%)`,
          opacity: interpolate(frame, [BEAT.snap, BEAT.snap + 5, BEAT.snap + 26], [0, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
