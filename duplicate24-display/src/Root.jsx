import React from 'react';
import {Composition} from 'remotion';
import {DisplayLoop} from './DisplayLoop.jsx';
import {BentoLoop} from './bento/BentoLoop.jsx';
import {FPS, DURATION, WIDTH, HEIGHT} from './theme.js';

export const RemotionRoot = () => (
  <>
    <Composition
      id="DisplayLoop"
      component={DisplayLoop}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    {/* Zweites Konzept: acht Leistungen als Kachel-Walzenlauf. Steht
        bewusst neben DisplayLoop, nicht an dessen Stelle. */}
    <Composition
      id="BentoLoop"
      component={BentoLoop}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />

    {/* Querformat fuer einen zweiten Screen oder die Website-Einbindung */}
    <Composition
      id="DisplayLoopWide"
      component={DisplayLoop}
      durationInFrames={DURATION}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
