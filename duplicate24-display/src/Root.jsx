import React from 'react';
import {Composition} from 'remotion';
import {DisplayLoop} from './DisplayLoop.jsx';
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
