import React from 'react';
import { Muscle } from '../data/exercises';
import { FatigueMap } from '../lib/engine';

type Shape =
  | { t: 'r'; x: number; y: number; w: number; h: number; rx: number }
  | { t: 'e'; cx: number; cy: number; rx: number; ry: number };

interface Region { muscle: Muscle | null; shape: Shape }

const r = (x: number, y: number, w: number, h: number, rx: number): Shape => ({ t: 'r', x, y, w, h, rx });
const e = (cx: number, cy: number, rx: number, ry: number): Shape => ({ t: 'e', cx, cy, rx, ry });

// Silueta base compartida (frente y espalda), desplazada por `ox`.
function base(ox: number): Region[] {
  return [
    { muscle: null, shape: e(100 + ox, 30, 17, 19) },
    { muscle: null, shape: r(92 + ox, 46, 16, 14, 5) },
    { muscle: null, shape: r(66 + ox, 58, 68, 116, 24) },
    { muscle: null, shape: r(38 + ox, 126, 15, 40, 7) },
    { muscle: null, shape: r(147 + ox, 126, 15, 40, 7) },
    { muscle: null, shape: r(76 + ox, 150, 48, 26, 12) },
    { muscle: null, shape: e(86 + ox, 254, 8, 7) },
    { muscle: null, shape: e(114 + ox, 254, 8, 7) },
    { muscle: null, shape: r(74 + ox, 320, 22, 10, 5) },
    { muscle: null, shape: r(104 + ox, 320, 22, 10, 5) },
  ];
}

const FRONT: Region[] = [
  ...base(0),
  { muscle: 'hombro', shape: e(62, 74, 15, 14) },
  { muscle: 'hombro', shape: e(138, 74, 15, 14) },
  { muscle: 'pecho', shape: r(70, 62, 29, 34, 11) },
  { muscle: 'pecho', shape: r(101, 62, 29, 34, 11) },
  ...[101, 118, 135].flatMap((y) => [
    { muscle: 'abdomen' as Muscle, shape: r(83, y, 16, 14, 4) },
    { muscle: 'abdomen' as Muscle, shape: r(101, y, 16, 14, 4) },
  ]),
  { muscle: 'biceps', shape: r(42, 86, 16, 38, 8) },
  { muscle: 'biceps', shape: r(142, 86, 16, 38, 8) },
  { muscle: 'cuadriceps', shape: r(74, 174, 24, 72, 12) },
  { muscle: 'cuadriceps', shape: r(102, 174, 24, 72, 12) },
  { muscle: 'pantorrilla', shape: r(77, 264, 18, 52, 9) },
  { muscle: 'pantorrilla', shape: r(105, 264, 18, 52, 9) },
];

const BACK: Region[] = [
  ...base(200),
  { muscle: 'espalda', shape: r(276, 52, 48, 14, 7) },
  { muscle: 'hombro', shape: e(262, 74, 15, 14) },
  { muscle: 'hombro', shape: e(338, 74, 15, 14) },
  { muscle: 'espalda', shape: r(270, 70, 29, 52, 12) },
  { muscle: 'espalda', shape: r(301, 70, 29, 52, 12) },
  { muscle: 'espalda', shape: r(285, 125, 30, 24, 8) },
  { muscle: 'triceps', shape: r(242, 86, 16, 38, 8) },
  { muscle: 'triceps', shape: r(342, 86, 16, 38, 8) },
  { muscle: 'gluteo', shape: e(287, 166, 14, 15) },
  { muscle: 'gluteo', shape: e(313, 166, 14, 15) },
  { muscle: 'femoral', shape: r(274, 184, 24, 64, 12) },
  { muscle: 'femoral', shape: r(302, 184, 24, 64, 12) },
  { muscle: 'pantorrilla', shape: r(277, 262, 18, 54, 9) },
  { muscle: 'pantorrilla', shape: r(305, 262, 18, 54, 9) },
];

const COLORS = {
  idle: '#2b2b2b',
  ayer: '#E50914',
  antier: '#F59E0B',
  target: '#22C55E',
  silhouette: '#181818',
};

interface Props {
  fatigue: FatigueMap;
  target?: Muscle[];
  onToggle?: (m: Muscle) => void;
  compact?: boolean;
}

export default function BodyMap({ fatigue, target = [], onToggle, compact }: Props) {
  const fillFor = (m: Muscle | null) => {
    if (!m) return COLORS.silhouette;
    if (fatigue[m]) return COLORS[fatigue[m]!];
    if (target.includes(m)) return COLORS.target;
    return COLORS.idle;
  };

  const render = (reg: Region, i: number) => {
    const m = reg.muscle;
    const fill = fillFor(m);
    const active = !!m && (!!fatigue[m] || target.includes(m));
    const common = {
      fill,
      stroke: m ? (active ? fill : 'rgba(255,255,255,0.07)') : 'none',
      strokeWidth: 1.2,
      style: {
        transition: 'fill .35s ease, filter .35s ease',
        cursor: m && onToggle ? 'pointer' : 'default',
        filter: active ? `drop-shadow(0 0 6px ${fill}aa)` : undefined,
        opacity: m && !fatigue[m] && target.includes(m) ? 0.85 : 1,
      } as React.CSSProperties,
      onClick: m && onToggle ? () => onToggle(m) : undefined,
      className: m && !fatigue[m] && target.includes(m) ? 'ip-pulse' : undefined,
    };
    const s = reg.shape;
    return s.t === 'r'
      ? <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} {...common} />
      : <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} {...common} />;
  };

  return (
    <svg
      viewBox="0 0 400 352"
      className={`w-full ${compact ? 'max-w-[260px]' : 'max-w-[380px]'} mx-auto select-none`}
      role="img"
      aria-label="Mapa muscular frente y espalda"
    >
      {FRONT.map(render)}
      {BACK.map(render)}
      <text x="100" y="347" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="700" letterSpacing="3">FRENTE</text>
      <text x="300" y="347" textAnchor="middle" fill="#6b7280" fontSize="11" fontWeight="700" letterSpacing="3">ESPALDA</text>
    </svg>
  );
}
