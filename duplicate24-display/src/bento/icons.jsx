import React from 'react';
import {interpolate, Easing} from 'remotion';

// Acht gezeichnete Icons statt Emoji. Emoji rendern je nach System
// unterschiedlich und haben ihre eigene Farbigkeit - auf einer Kachel, die in
// 1,5 Sekunden gelesen wird, braucht es eine Form, die die Kachelfarbe
// mittraegt. Jedes Icon bekommt p (0..1) ueber die Standzeit seiner Kachel.

const BOX = 430;
const SW = 13;

const Svg = ({children}) => (
  <svg width={BOX} height={BOX} viewBox="0 0 360 360" fill="none">
    {children}
  </svg>
);

const ease = (p, a, b, easing = Easing.out(Easing.cubic)) =>
  interpolate(p, [0, 1], [a, b], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

// Stoppuhr. Der Zeiger laeuft in der Standzeit gut zweimal um - schneller als
// eine echte Uhr, darum geht es ja.
const Stopwatch = ({p, ink}) => {
  const hand = ease(p, -90, 630, Easing.inOut(Easing.cubic));
  return (
    <Svg>
      <rect x="152" y="28" width="56" height="34" rx="12" fill={ink} />
      <line x1="180" y1="58" x2="180" y2="92" stroke={ink} strokeWidth={SW} />
      <circle cx="180" cy="212" r="126" stroke={ink} strokeWidth={SW} />
      {[0, 90, 180, 270].map((a) => (
        <line
          key={a}
          x1="180"
          y1="102"
          x2="180"
          y2="126"
          stroke={ink}
          strokeWidth={SW}
          transform={`rotate(${a} 180 212)`}
        />
      ))}
      <line
        x1="180"
        y1="212"
        x2="180"
        y2="124"
        stroke={ink}
        strokeWidth={SW}
        strokeLinecap="round"
        transform={`rotate(${hand} 180 212)`}
      />
      <circle cx="180" cy="212" r="14" fill={ink} />
    </Svg>
  );
};

// Digitaldruck: drei Bogen fahren nacheinander aus dem Schacht.
const Printer = ({p, ink}) => (
  <Svg>
    {[0, 1, 2].map((i) => {
      const local = interpolate(p, [i * 0.18, i * 0.18 + 0.45], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.out(Easing.cubic),
      });
      return (
        <g key={i} transform={`translate(0 ${ease(local, 40, -78 - i * 46)})`} opacity={local}>
          <rect x="96" y="150" width="168" height="118" rx="8" fill={ink} opacity={0.14} />
          <rect x="96" y="150" width="168" height="118" rx="8" stroke={ink} strokeWidth={SW} />
          <line x1="128" y1="188" x2="232" y2="188" stroke={ink} strokeWidth={11} />
          <line x1="128" y1="220" x2="204" y2="220" stroke={ink} strokeWidth={11} />
        </g>
      );
    })}
    <rect x="52" y="232" width="256" height="96" rx="18" fill={ink} />
    <rect x="104" y="256" width="152" height="20" rx="10" fill="#FFFFFF" opacity={0.85} />
  </Svg>
);

// Grossformat: die Rolle liegt links, der Bogen zieht nach rechts auf.
const Plan = ({p, ink}) => {
  const w = ease(p, 0, 214);
  return (
    <Svg>
      <clipPath id="planClip">
        <rect x="94" y="96" width={w} height="200" />
      </clipPath>
      <g clipPath="url(#planClip)">
        <rect x="94" y="96" width="214" height="200" fill={ink} opacity={0.12} />
        <rect x="94" y="96" width="214" height="200" stroke={ink} strokeWidth={SW} />
        <rect x="132" y="140" width="86" height="66" stroke={ink} strokeWidth={10} />
        <line x1="132" y1="238" x2="268" y2="238" stroke={ink} strokeWidth={10} />
        <line x1="238" y1="140" x2="268" y2="140" stroke={ink} strokeWidth={10} />
      </g>
      <rect x="56" y="80" width="46" height="232" rx="23" fill={ink} />
      <line x1="79" y1="330" x2="79" y2="300" stroke={ink} strokeWidth={SW} />
    </Svg>
  );
};

// Bindungen: der Deckel klappt auf, der Buchblock bleibt stehen.
const Book = ({p, ink}) => {
  const open = ease(p, 0, 62);
  return (
    <Svg>
      <g transform="translate(180 200)">
        <rect x="0" y="-118" width="128" height="236" rx="6" fill={ink} opacity={0.14} />
        <rect x="0" y="-118" width="128" height="236" rx="6" stroke={ink} strokeWidth={SW} />
        {[-70, -34, 2, 38].map((y) => (
          <line key={y} x1="28" y1={y} x2="104" y2={y} stroke={ink} strokeWidth={9} />
        ))}
        <g transform={`skewY(${-open * 0.18}) scale(${Math.cos((open * Math.PI) / 180)} 1)`}>
          <rect x="-128" y="-118" width="128" height="236" rx="6" fill={ink} />
        </g>
        <rect x="-6" y="-124" width="12" height="248" rx="6" fill={ink} />
      </g>
    </Svg>
  );
};

// Textildruck: das Motiv schlaegt auf die Brust durch.
const Shirt = ({p, ink}) => {
  const hit = interpolate(p, [0.22, 0.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(2)),
  });
  return (
    <Svg>
      <path
        d="M124 84 L84 108 L58 168 L104 194 L114 182 L114 308 L246 308 L246 182 L256 194 L302 168 L276 108 L236 84 C232 122 128 122 124 84 Z"
        fill={ink}
        opacity={0.12}
      />
      <path
        d="M124 84 L84 108 L58 168 L104 194 L114 182 L114 308 L246 308 L246 182 L256 194 L302 168 L276 108 L236 84 C232 122 128 122 124 84 Z"
        stroke={ink}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
      <g transform={`translate(180 226) scale(${hit})`} opacity={hit}>
        <circle r="46" fill={ink} />
        <circle r="20" fill="#FFFFFF" opacity={0.9} />
      </g>
    </Svg>
  );
};

// Werbetechnik: das Roll-up faehrt aus der Kassette hoch.
const Sign = ({p, ink}) => {
  const h = ease(p, 0, 212);
  return (
    <Svg>
      <clipPath id="signClip">
        <rect x="86" y={288 - h} width="188" height={h} />
      </clipPath>
      <g clipPath="url(#signClip)">
        <rect x="86" y="76" width="188" height="212" fill={ink} opacity={0.12} />
        <rect x="86" y="76" width="188" height="212" stroke={ink} strokeWidth={SW} />
        <rect x="118" y="120" width="124" height="26" rx="13" fill={ink} />
        <rect x="118" y="166" width="86" height="18" rx="9" fill={ink} opacity={0.6} />
      </g>
      <rect x="70" y="288" width="220" height="34" rx="17" fill={ink} />
      <line x1="180" y1="322" x2="180" y2="336" stroke={ink} strokeWidth={SW} />
    </Svg>
  );
};

// Verpackungen: die Laschen klappen zu.
const Box = ({p, ink}) => {
  // Nicht ganz zuklappen: eine flach geschlossene Kiste ist nur noch ein
  // Quadrat, der Rest Lasche muss stehen bleiben, damit man Karton sieht.
  const fold = ease(p, 0, 0.72);
  return (
    <Svg>
      <rect x="86" y="150" width="188" height="180" fill={ink} opacity={0.12} />
      <rect x="86" y="150" width="188" height="180" stroke={ink} strokeWidth={SW} />
      <g transform={`translate(86 150) scale(1 ${1 - fold})`} style={{transformOrigin: '0 0'}}>
        <rect x="0" y="-104" width="188" height="104" fill={ink} opacity={0.3} />
        <rect x="0" y="-104" width="188" height="104" stroke={ink} strokeWidth={SW} />
      </g>
      <g transform={`translate(86 150) scale(${1 - fold} 1)`} style={{transformOrigin: '0 0'}}>
        <rect x="-86" y="0" width="86" height="180" fill={ink} opacity={0.22} />
        <rect x="-86" y="0" width="86" height="180" stroke={ink} strokeWidth={SW} />
      </g>
      <g transform={`translate(274 150) scale(${1 - fold} 1)`} style={{transformOrigin: '0 0'}}>
        <rect x="0" y="0" width="86" height="180" fill={ink} opacity={0.22} />
        <rect x="0" y="0" width="86" height="180" stroke={ink} strokeWidth={SW} />
      </g>
    </Svg>
  );
};

// Grafik & Design plus Lettershop: der Strich wird gezogen, das Kuvert steht.
const Brush = ({p, ink}) => {
  const LEN = 300;
  const draw = ease(p, LEN, 0);
  const env = interpolate(p, [0.4, 0.72], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <Svg>
      <path
        d="M52 176 C110 68 196 262 300 118"
        stroke={ink}
        strokeWidth={26}
        strokeLinecap="round"
        strokeDasharray={LEN}
        strokeDashoffset={draw}
      />
      <g transform={`translate(0 ${ease(env, 40, 0)})`} opacity={env}>
        <rect x="92" y="212" width="176" height="118" rx="10" fill={ink} opacity={0.14} />
        <rect x="92" y="212" width="176" height="118" rx="10" stroke={ink} strokeWidth={SW} />
        <path d="M92 222 L180 284 L268 222" stroke={ink} strokeWidth={SW} strokeLinejoin="round" />
      </g>
    </Svg>
  );
};

export const ICONS = {
  stopwatch: Stopwatch,
  printer: Printer,
  plan: Plan,
  book: Book,
  shirt: Shirt,
  sign: Sign,
  box: Box,
  brush: Brush,
};
