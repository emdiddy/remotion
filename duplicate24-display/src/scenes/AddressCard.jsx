import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Img,
  staticFile,
  Easing,
} from 'remotion';
import {loadFont as loadDisplay} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {C, BEAT, DURATION} from '../theme.js';

const {fontFamily: DISPLAY} = loadDisplay();
const {fontFamily: MONO} = loadMono();

// Lege public/qr.png ab (Ziel: Konfigurator-URL). Fehlt die Datei, bleibt der
// Rahmen als Platzhalter stehen - der Render bricht nicht ab.
const QrSlot = () => {
  const [failed, setFailed] = React.useState(false);
  return (
    <div
      style={{
        width: 190,
        height: 190,
        border: `2px solid ${C.cyan}`,
        padding: 12,
        background: failed ? 'transparent' : '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {failed ? (
        <span style={{fontFamily: MONO, fontSize: 20, color: C.muted}}>QR</span>
      ) : (
        <Img
          src={staticFile('qr.png')}
          onError={() => setFailed(true)}
          style={{width: '100%', height: '100%', objectFit: 'contain'}}
        />
      )}
    </div>
  );
};

export const AddressCard = () => {
  const frame = useCurrentFrame();

  const rise = interpolate(frame, [BEAT.address, BEAT.address + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const out = interpolate(frame, [BEAT.exit, DURATION - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 210,
        opacity: rise * out,
        transform: `translateY(${interpolate(rise, [0, 1], [50, 0])}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <QrSlot />
        <div style={{textAlign: 'left'}}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 24,
              color: C.magenta,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Frankfurt
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 56,
              fontWeight: 700,
              color: C.key,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
            }}
          >
            Mainzer
            <br />
            Landstrasse 109
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 26,
              color: C.brand,
              marginTop: 18,
            }}
          >
            duplicate24.de
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
