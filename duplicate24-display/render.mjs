import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdir} from 'node:fs/promises';

// Duplicate24 faellt unter die Remotion Free License (bis 3 Mitarbeiter).
// Der licenseKey deklariert das und unterdrueckt die Konsolenwarnung.
const LICENSE_KEY = 'free-license';

const COMPOSITION = process.argv[2] ?? 'DisplayLoop';
const OUT_DIR = path.resolve('out');

const main = async () => {
  await mkdir(OUT_DIR, {recursive: true});

  console.log('Bundle wird gebaut ...');
  const serveUrl = await bundle({
    entryPoint: path.resolve('src/index.jsx'),
    onProgress: (p) => process.stdout.write(`\rBundle ${p}%`),
  });
  process.stdout.write('\n');

  const composition = await selectComposition({serveUrl, id: COMPOSITION});

  const outputLocation = path.join(OUT_DIR, `${COMPOSITION}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation,
    licenseKey: LICENSE_KEY,
    // Der Screen laeuft stundenlang: hohe Qualitaet, damit der Loop nicht
    // sichtbar atmet, und keyframeIntervall kurz fuer sauberes Nahtlos-Looping.
    crf: 16,
    x264Preset: 'slow',
    everyNthFrame: 1,
    chromiumOptions: {gl: 'angle'},
    onProgress: ({progress}) =>
      process.stdout.write(`\rRender ${Math.round(progress * 100)}%`),
  });

  process.stdout.write('\n');
  console.log(`Fertig: ${outputLocation}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
