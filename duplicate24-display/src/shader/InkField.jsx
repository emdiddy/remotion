import React, {useRef, useLayoutEffect} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

// Vier Farbstroeme, die auseinanderdriften und im Passer-Moment zusammen-
// laufen. Aufgebaut wie eine Autotypie: jede Farbe liegt als Rasterpunkte in
// ihrem echten Druckwinkel, der Punktdurchmesser kommt aus der Deckung. Wo
// sich die vier Winkel ueberlagern, entsteht die Rosette - deshalb laufen die
// Farben ineinander, ohne sich zu Weiss auszuloeschen: die Punkte liegen
// nebeneinander, nicht uebereinander.

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;
uniform float uTime;
uniform float uConverge;   // 0 = auseinander, 1 = im Passer
uniform float uIntensity;
uniform float uCell;       // Rasterweite in Pixeln
uniform float uFocus;      // Zusammenlauf ueber der Bildmitte, 0..1 der Hoehe
uniform float uHold;       // Traeger unter dem Lockup, 0..1

const vec3 INK_C = vec3(0.00, 0.68, 0.94);
const vec3 INK_M = vec3(0.93, 0.00, 0.55);
const vec3 INK_Y = vec3(1.00, 0.95, 0.00);
// Die Schwarzplatte bleibt dunkel. Liefe sie hell, waere sie der eigentliche
// Weissmacher: sie deckt am staerksten und saesse genau in der Mitte.
const vec3 INK_K = vec3(0.12, 0.14, 0.20);

// Echte Rasterwinkel aus dem Vierfarbdruck, in Grad.
const float ANG_C = 15.0;
const float ANG_M = 75.0;
const float ANG_Y = 0.0;
const float ANG_K = 45.0;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}

// Deckung eines Farbstroms an dieser Stelle. Der gemeinsame Warp kommt von
// aussen, hier kommt nur ein eigener kleiner Versatz dazu - sonst laegen alle
// vier Straenge deckungsgleich.
float stream(vec2 uv, vec2 c, float r, float seed, vec2 aniso) {
  float wob = noise(uv * 5.2 + seed + uTime * 0.28) - 0.5;
  float dist = length((uv - c) * aniso) + wob * 0.055;
  // Volle Deckung bis knapp zur halben Strecke, dann abfallen. Setzt man den
  // inneren Wert zu klein, bleibt nur ein winziger dichter Kern und das Feld
  // franst ueber die Breite des Lockups aus.
  return smoothstep(r, r * 0.45, dist);
}

// Ein Rasterpunkt. Die Deckung steuert den Durchmesser, nicht die Helligkeit -
// so arbeitet ein Autotypie-Raster. Die Kante ist eine Pixelbreite weich,
// damit die Punkte beim Skalieren nicht flimmern.
float halftone(vec2 px, float angleDeg, float coverage, float cell) {
  float a = radians(angleDeg);
  float s = sin(a), c = cos(a);
  vec2 rp = vec2(px.x * c - px.y * s, px.x * s + px.y * c);
  vec2 g = mod(rp, cell) - cell * 0.5;

  // Flaeche waechst mit der Deckung, also Radius ueber die Wurzel. Bei 0.5 *
  // cell stossen benachbarte Punkte aneinander - der Faktor bleibt darunter,
  // damit das Raster offen bleibt und die Buntfarbe nicht zulaeuft.
  float r = sqrt(clamp(coverage, 0.0, 1.0)) * cell * 0.52;
  return 1.0 - smoothstep(r - 0.7, r + 0.7, length(g));
}

void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 uv = px / uRes;
  float aspect = uRes.x / uRes.y;
  uv.x = (uv.x - 0.5) * aspect + 0.5;

  // Nach der Aspect-Korrektur liegt die Bildmitte wieder auf 0.5. Der
  // Zusammenlauf sitzt aber nicht dort, sondern auf dem Lockup - gl_FragCoord
  // zaehlt von unten, das Logo steht darueber, also plus.
  vec2 center = vec2(0.5, 0.5 + uFocus);

  // Ein gemeinsames Stroemungsfeld, das langsam nach oben zieht. Alle vier
  // Farben schwimmen darin und ziehen faserig aus, statt als runde Wolken
  // nebeneinanderzuliegen. Im Passer beruhigt es sich.
  float amp = mix(0.20, 0.045, uConverge);
  vec2 fq = uv * 2.3 + vec2(0.0, -uTime * 0.16);
  vec2 warp = (vec2(fbm(fq), fbm(fq + vec2(4.7, 2.1))) - 0.5) * amp;
  vec2 flow = uv + warp;

  // Auch im Passer bleibt ein Rest Versatz stehen - sonst laegen alle vier
  // Platten exakt uebereinander und die Buntfarbe waere im dichtesten Moment
  // verschwunden.
  float spread = mix(0.32, 0.075, uConverge);
  float drift = uTime * 0.35;

  // Auseinander kreisen die Straenge frei. Im Passer flacht die senkrechte
  // Komponente ab, sie legen sich seitlich am Lockup entlang. Bliebe der
  // Restversatz senkrecht, laege die Luecke zwischen den Straengen genau auf
  // Hoehe der Schrift.
  float squash = mix(1.0, 0.22, uConverge);

  vec2 pC = center + vec2(cos(drift + 0.0), sin(drift * 0.8 + 0.0) * squash) * spread;
  vec2 pM = center + vec2(cos(drift + 1.57), sin(drift * 0.8 + 1.57) * squash) * spread;
  vec2 pY = center + vec2(cos(drift + 3.14), sin(drift * 0.8 + 3.14) * squash) * spread;
  vec2 pK = center + vec2(cos(drift + 4.71), sin(drift * 0.8 + 4.71) * squash) * spread * 0.6;

  float radius = mix(0.22, 0.28, uConverge);

  // Auseinander sind die Straenge rund. Im Passer ziehen sie in die Breite:
  // das Lockup ist 6,5:1, ein runder Fleck laesst dessen Enden abfallen.
  vec2 aniso = vec2(1.0, mix(1.0, 1.7, uConverge));

  // Vignette wirkt auf die Deckung, nicht auf die Helligkeit: zum Rand hin
  // werden die Punkte kleiner, statt dass die Farbe ausgeblendet wird.
  float vig = smoothstep(1.15, 0.25, length((uv - center) * vec2(1.0, 1.25)));
  float gain = uIntensity * vig;

  // Traeger unter dem Lockup. Die globale Farbintensitaet geht nach dem Passer
  // planmaessig zurueck, damit das Feld die Leistungen nicht ueberlagert - das
  // ausgesparte Logo braucht aber bis zum Ausblenden Deckung unter sich. Der
  // Traeger hebt deshalb nur dieses schmale Band an, nicht die ganze Flaeche.
  float bandD = length((uv - center) * vec2(1.0, 3.1));
  float hold = uHold * 0.78 * (1.0 - smoothstep(0.16, 0.34, bandD));
  float g = max(gain, hold);

  // Der Deckel haelt die Rosette offen. Ohne ihn laufen die vier Platten in
  // der Mitte zu und die Buntfarbe schlaegt in Weiss um.
  float wC = clamp(stream(flow, pC, radius, 11.0, aniso) * g, 0.0, 0.62);
  float wM = clamp(stream(flow, pM, radius, 23.0, aniso) * g, 0.0, 0.62);
  float wY = clamp(stream(flow, pY, radius, 37.0, aniso) * g, 0.0, 0.62);
  float wK = clamp(stream(flow, pK, radius * 0.8, 51.0, aniso) * g, 0.0, 0.55);

  // Die Rasterweite atmet leicht mit dem Stroemungsfeld - ein Andruck ist nie
  // ueber die ganze Flaeche gleich streng.
  float cell = uCell * (1.0 + (fbm(uv * 1.7 + uTime * 0.05) - 0.5) * 0.06);

  vec3 col = vec3(0.0);
  col += INK_C * halftone(px, ANG_C, wC, cell);
  col += INK_M * halftone(px, ANG_M, wM, cell);
  col += INK_Y * halftone(px, ANG_Y, wY, cell);
  col += INK_K * halftone(px, ANG_K, wK, cell) * 1.6;

  // Papierfaser: die Farbe sitzt nicht gleichmaessig auf, sondern zieht
  // ungleich ein.
  float fiber = 0.88 + noise(px * 0.9 + 13.0) * 0.24;
  col *= fiber;

  // Feines Korn gegen Banding in den offenen Rasterpartien.
  col += (hash(px + fract(uTime) * 91.0) - 0.5) * 0.03;

  outColor = vec4(max(col, vec3(0.0)), 1.0);
}`;

const compile = (gl, type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(s) ?? 'shader error');
  }
  return s;
};

export const InkField = ({
  converge = 0,
  intensity = 1,
  cell = 9,
  focus = 0,
  hold = 0,
  style,
}) => {
  const ref = useRef(null);
  const glRef = useRef(null);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // useLayoutEffect statt useEffect: Remotion schiesst den Screenshot nach dem
  // React-Commit, der Draw muss also synchron vor dem Paint passieren.
  useLayoutEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    if (!glRef.current) {
      const gl = canvas.getContext('webgl2', {
        preserveDrawingBuffer: true,
        antialias: false,
      });
      if (!gl) return;

      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);

      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const loc = gl.getAttribLocation(prog, 'aPos');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      glRef.current = {
        gl,
        u: {
          res: gl.getUniformLocation(prog, 'uRes'),
          time: gl.getUniformLocation(prog, 'uTime'),
          converge: gl.getUniformLocation(prog, 'uConverge'),
          intensity: gl.getUniformLocation(prog, 'uIntensity'),
          cell: gl.getUniformLocation(prog, 'uCell'),
          focus: gl.getUniformLocation(prog, 'uFocus'),
          hold: gl.getUniformLocation(prog, 'uHold'),
        },
      };
    }

    const ctx = glRef.current;
    if (!ctx) return;
    const {gl, u} = ctx;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, frame / fps);
    gl.uniform1f(u.converge, converge);
    gl.uniform1f(u.intensity, intensity);
    gl.uniform1f(u.cell, cell);
    gl.uniform1f(u.focus, focus);
    gl.uniform1f(u.hold, hold);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, [frame, fps, converge, intensity, cell, focus, hold]);

  return (
    // Volle Aufloesung: ein hochskaliertes Raster waere weichgezeichnet, und
    // die harte Punktkante ist genau das, was den Andruck ausmacht.
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style,
      }}
    />
  );
};
