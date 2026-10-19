// ── Motor de planificación IRON PLAN ───────────────────────────────────────
// Reglas fijas (sin IA): recuperación muscular 48–72 h, presupuesto de tiempo,
// prescripción por objetivo y nivel, cargas por %1RM estimado (Epley) y
// periodización de 4 semanas. Determinista por `seed`: el mismo enlace
// produce la misma rutina en el celular del cliente.

import { EXERCISES, Exercise, Injury, LOWER_MUSCLES, MUSCLE_LABEL, Muscle } from '../data/exercises';

export type Focus = 'pierna' | 'empuje' | 'tiron' | 'torso' | 'fullbody' | 'gluteo' | 'brazos' | 'recuperacion';
export type Goal = 'fuerza' | 'hipertrofia' | 'grasa' | 'acondicionamiento';
export type Level = 'principiante' | 'intermedio' | 'avanzado';
export type Equip = 'gym' | 'mancuernas' | 'casa';
export type Sex = 'h' | 'm';
export type FatigueMap = Partial<Record<Muscle, 'ayer' | 'antier'>>;

export interface RoutineParams {
  focus: Focus;
  time: number;
  goal: Goal;
  level: Level;
  equip: Equip;
  injuries: Injury[];
  sex: Sex;
  bw?: number;
  seed: number;
  name?: string;
  phase?: number; // 0-3 dentro de un mesociclo
  fatigue?: FatigueMap;
  swaps?: Record<number, string>; // slot → id de ejercicio
  loads?: Record<number, number>; // slot → kg ajustado por el coach
  date?: string; // AAAA-MM-DD
}

export interface RoutineItem {
  slot: number;
  exercise: Exercise;
  sets: number;
  reps: string;
  repsNum: number;
  rest: number;
  rir: number;
  load: number | null;
  loadLabel: string;
  note?: string;
  block: string; // "A", "B1", "B2"…
}

export interface Routine {
  params: RoutineParams;
  focus: Focus;
  title: string;
  muscles: Muscle[];
  items: RoutineItem[];
  warmup: string[];
  finisher?: string;
  cooldown: string[];
  minutes: number;
  reason: string;
  progression: string;
  superset: boolean;
}

// ── Catálogos ──────────────────────────────────────────────────────────────

export const FOCUS_INFO: Record<Focus, { label: string; short: string; muscles: Muscle[]; emoji: string }> = {
  pierna: { label: 'Pierna completa', short: 'Pierna', muscles: ['cuadriceps', 'femoral', 'gluteo', 'pantorrilla'], emoji: '🦵' },
  empuje: { label: 'Empuje · Pecho, hombro y tríceps', short: 'Empuje', muscles: ['pecho', 'hombro', 'triceps'], emoji: '💥' },
  tiron: { label: 'Tirón · Espalda y bíceps', short: 'Tirón', muscles: ['espalda', 'biceps'], emoji: '🔗' },
  torso: { label: 'Torso completo', short: 'Torso', muscles: ['pecho', 'espalda', 'hombro', 'biceps', 'triceps'], emoji: '🛡️' },
  fullbody: { label: 'Cuerpo completo', short: 'Full Body', muscles: ['cuadriceps', 'pecho', 'espalda', 'femoral', 'gluteo', 'hombro'], emoji: '⚡' },
  gluteo: { label: 'Glúteo y femoral', short: 'Glúteo', muscles: ['gluteo', 'femoral'], emoji: '🍑' },
  brazos: { label: 'Hombro y brazos', short: 'Brazos', muscles: ['hombro', 'biceps', 'triceps'], emoji: '💪' },
  recuperacion: { label: 'Recuperación activa', short: 'Recuperación', muscles: ['abdomen'], emoji: '🧘' },
};

export const GOAL_INFO: Record<Goal, { label: string; desc: string }> = {
  fuerza: { label: 'Fuerza', desc: 'Pocas reps, cargas altas, descansos largos' },
  hipertrofia: { label: 'Ganar músculo', desc: '8–12 reps cerca del fallo' },
  grasa: { label: 'Bajar grasa', desc: 'Superseries, descansos cortos y finisher' },
  acondicionamiento: { label: 'Condición y salud', desc: 'Volumen moderado, técnica y cardio' },
};

export const LEVEL_INFO: Record<Level, { label: string; desc: string }> = {
  principiante: { label: 'Principiante', desc: 'Menos de 6 meses entrenando' },
  intermedio: { label: 'Intermedio', desc: '6 meses a 2 años constante' },
  avanzado: { label: 'Avanzado', desc: 'Más de 2 años, domina la técnica' },
};

export const EQUIP_INFO: Record<Equip, { label: string; allowed: Exercise['eq'][] }> = {
  gym: { label: 'Gimnasio completo', allowed: ['barra', 'mancuerna', 'maquina', 'polea', 'corporal', 'cardio'] },
  mancuernas: { label: 'Solo mancuernas', allowed: ['mancuerna', 'corporal', 'cardio'] },
  casa: { label: 'En casa (sin equipo)', allowed: ['corporal', 'cardio'] },
};

export const INJURY_LABEL: Record<Injury, string> = {
  rodilla: 'Rodilla',
  hombro: 'Hombro',
  lumbar: 'Espalda baja',
};

export const PHASES = [
  { name: 'Adaptación', desc: 'Técnica y volumen base, RIR alto', rir: 1, sets: 0, setsMult: 1, load: 0.95, intensity: 70 },
  { name: 'Acumulación', desc: 'Volumen completo, cargas de trabajo', rir: 0, sets: 0, setsMult: 1, load: 1, intensity: 78 },
  { name: 'Intensificación', desc: '+1 serie en básicos, más carga, RIR bajo', rir: -1, sets: 1, setsMult: 1, load: 1.04, intensity: 86 },
  { name: 'Descarga', desc: '−40% series y −15% carga para supercompensar', rir: 2, sets: 0, setsMult: 0.6, load: 0.85, intensity: 60 },
];

// Opciones por "hueco" de cada sesión, en orden de preferencia.
const SLOTS: Record<Exclude<Focus, 'recuperacion'>, string[][]> = {
  pierna: [
    ['sentadilla', 'prensa', 'hack', 'sentadilla-goblet', 'sentadilla-corporal'],
    ['peso-muerto-rumano', 'hip-thrust', 'rumano-manc', 'puente-gluteo'],
    ['prensa', 'bulgara', 'zancadas-manc', 'hack', 'zancada-corporal'],
    ['curl-femoral', 'puente-una-pierna', 'rumano-manc'],
    ['ext-cuadriceps', 'sentadilla-goblet', 'sentadilla-corporal'],
    ['abduccion', 'patada-gluteo-polea', 'patada-gluteo-corporal'],
    ['pantorrilla-pie', 'pantorrilla-manc', 'pantorrilla-corporal'],
    ['crunch-polea', 'plancha', 'dead-bug'],
  ],
  empuje: [
    ['press-banca', 'press-maquina-pecho', 'press-manc-plano', 'lagartijas'],
    ['press-hombro-manc', 'press-militar', 'press-hombro-maquina', 'pike-pushup'],
    ['press-inclinado-manc', 'press-inclinado-barra', 'fondos', 'lagartijas-declinadas'],
    ['elev-laterales', 'elev-laterales-polea'],
    ['aperturas-polea', 'pec-deck', 'aperturas-manc', 'lagartijas'],
    ['ext-polea', 'press-frances', 'ext-trasnuca-manc', 'lagartijas-diamante'],
    ['fondos-banco', 'patada-triceps-manc', 'ext-trasnuca-manc', 'ext-polea'],
    ['plancha', 'crunch-polea', 'mountain-climbers'],
  ],
  tiron: [
    ['jalon-pecho', 'dominadas', 'remo-invertido'],
    ['remo-polea-baja', 'remo-barra', 'remo-maquina', 'remo-manc', 'remo-invertido'],
    ['remo-manc', 'remo-maquina', 'pullover-manc', 'superman'],
    ['pullover-polea', 'pullover-manc', 'superman'],
    ['face-pull', 'pajaros'],
    ['curl-barra', 'curl-manc-alterno', 'curl-polea', 'curl-mochila'],
    ['curl-martillo', 'curl-polea', 'curl-manc-alterno'],
    ['elev-piernas', 'dead-bug', 'plancha'],
  ],
  torso: [
    ['press-banca', 'press-manc-plano', 'press-maquina-pecho', 'lagartijas'],
    ['remo-polea-baja', 'remo-barra', 'remo-manc', 'remo-maquina', 'remo-invertido'],
    ['press-hombro-manc', 'press-militar', 'press-hombro-maquina', 'pike-pushup'],
    ['jalon-pecho', 'dominadas', 'pullover-manc', 'superman'],
    ['press-inclinado-manc', 'aperturas-polea', 'lagartijas-declinadas'],
    ['elev-laterales', 'face-pull', 'pajaros'],
    ['curl-manc-alterno', 'curl-polea', 'curl-barra', 'curl-mochila'],
    ['ext-polea', 'press-frances', 'ext-trasnuca-manc', 'lagartijas-diamante'],
  ],
  fullbody: [
    ['sentadilla', 'prensa', 'sentadilla-goblet', 'sentadilla-corporal'],
    ['press-banca', 'press-manc-plano', 'press-maquina-pecho', 'lagartijas'],
    ['remo-polea-baja', 'jalon-pecho', 'remo-manc', 'remo-invertido'],
    ['peso-muerto-rumano', 'hip-thrust', 'rumano-manc', 'puente-gluteo'],
    ['press-hombro-manc', 'press-hombro-maquina', 'pike-pushup'],
    ['plancha', 'dead-bug', 'crunch-polea'],
    ['curl-manc-alterno', 'curl-polea', 'curl-mochila'],
    ['ext-polea', 'ext-trasnuca-manc', 'fondos-banco'],
    ['pantorrilla-pie', 'pantorrilla-manc', 'pantorrilla-corporal'],
  ],
  gluteo: [
    ['hip-thrust', 'hip-thrust-manc', 'puente-gluteo'],
    ['peso-muerto-rumano', 'rumano-manc', 'puente-una-pierna'],
    ['bulgara', 'zancadas-manc', 'zancada-corporal'],
    ['curl-femoral', 'puente-una-pierna', 'rumano-manc'],
    ['abduccion', 'patada-gluteo-polea', 'patada-gluteo-corporal'],
    ['patada-gluteo-polea', 'abduccion', 'puente-gluteo'],
    ['pantorrilla-pie', 'pantorrilla-manc', 'pantorrilla-corporal'],
    ['plancha', 'dead-bug'],
  ],
  brazos: [
    ['press-hombro-manc', 'press-militar', 'pike-pushup'],
    ['curl-barra', 'curl-manc-alterno', 'curl-mochila'],
    ['press-frances', 'ext-polea', 'lagartijas-diamante'],
    ['elev-laterales', 'elev-laterales-polea'],
    ['curl-martillo', 'curl-polea'],
    ['ext-trasnuca-manc', 'patada-triceps-manc', 'fondos-banco'],
    ['face-pull', 'pajaros'],
    ['elev-piernas', 'crunch-polea', 'plancha'],
  ],
};

const GOAL_RX: Record<Goal, Record<'comp' | 'aisl', { sets: number; reps: string; repsNum: number; rest: number; rir: number }>> = {
  fuerza: { comp: { sets: 4, reps: '4–6', repsNum: 5, rest: 150, rir: 2 }, aisl: { sets: 3, reps: '8–10', repsNum: 9, rest: 90, rir: 2 } },
  hipertrofia: { comp: { sets: 4, reps: '8–10', repsNum: 8, rest: 90, rir: 2 }, aisl: { sets: 3, reps: '10–12', repsNum: 11, rest: 60, rir: 1 } },
  grasa: { comp: { sets: 3, reps: '12–15', repsNum: 12, rest: 45, rir: 2 }, aisl: { sets: 3, reps: '15–20', repsNum: 15, rest: 30, rir: 1 } },
  acondicionamiento: { comp: { sets: 3, reps: '12', repsNum: 12, rest: 60, rir: 3 }, aisl: { sets: 3, reps: '15', repsNum: 15, rest: 45, rir: 2 } },
};

const BW_REPS: Record<Goal, string> = { fuerza: '6–10', hipertrofia: '10–15', grasa: '15–20', acondicionamiento: '12–15' };
const HARD_BW_REPS: Record<Goal, string> = { fuerza: '4–6', hipertrofia: '6–10', grasa: '8–12', acondicionamiento: '6–10' };

// ── Utilidades ─────────────────────────────────────────────────────────────

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const newSeed = () => Math.floor(Math.random() * 1e9);

export function fmtRest(sec: number) {
  if (sec <= 90) return `${sec} s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}:${String(s).padStart(2, '0')}` : `${m} min`;
}

const fmtKg = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));

export function todayISO(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isAvailable(id: string, p: RoutineParams, used: Set<string>) {
  const ex = EXERCISES[id];
  if (!ex || used.has(id)) return false;
  if (!EQUIP_INFO[p.equip].allowed.includes(ex.eq)) return false;
  if (ex.avoid?.some((i) => p.injuries.includes(i))) return false;
  return true;
}

export function slotAlternatives(focus: Focus, slot: number, p: RoutineParams, currentIds: string[]) {
  if (focus === 'recuperacion') return [];
  const opts = SLOTS[focus][slot] ?? [];
  const used = new Set(currentIds);
  return opts.filter((id) => isAvailable(id, p, used));
}

function pickExercise(opts: string[], p: RoutineParams, used: Set<string>, rng: () => number) {
  let avail = opts.filter((id) => isAvailable(id, p, used));
  if (!avail.length) return null;
  if (p.level === 'principiante') {
    avail = [...avail.filter((id) => !EXERCISES[id].adv), ...avail.filter((id) => EXERCISES[id].adv)];
  }
  const pool = avail.slice(0, Math.min(2, avail.length));
  return pool[Math.floor(rng() * pool.length)];
}

export function computeLoad(ex: Exercise, p: Pick<RoutineParams, 'bw' | 'sex' | 'level'>, repsNum: number, rir: number, mult = 1) {
  if (!ex.ratio || !p.bw) return null;
  const lvl = p.level === 'principiante' ? 0 : p.level === 'intermedio' ? 1 : 2;
  const lower = LOWER_MUSCLES.includes(ex.muscle);
  const sexF = p.sex === 'm' ? (lower ? 0.75 : 0.55) : 1;
  const oneRM = p.bw * ex.ratio[lvl] * sexF;
  const raw = (oneRM / (1 + (repsNum + rir) / 30)) * mult;
  const step = ex.eq === 'barra' ? 2.5 : ex.eq === 'mancuerna' ? 2 : 5;
  const min = ex.eq === 'barra' ? 20 : ex.eq === 'mancuerna' ? 2 : 5;
  return Math.max(min, Math.round(raw / step) * step);
}

export function loadLabelFor(ex: Exercise, load: number | null, rir: number, level: Level) {
  if (ex.kind === 'cardio') return 'Ritmo cómodo';
  if (ex.eq === 'corporal') {
    if (ex.hard && level === 'principiante') return 'Asistida / banda';
    return 'Peso corporal';
  }
  if (load == null) return `RIR ${rir}`;
  const perHand = ex.eq === 'mancuerna' && !ex.single;
  return `${fmtKg(load)} kg${perHand ? ' c/u' : ''}`;
}

// ── Recuperación y elección del enfoque ────────────────────────────────────

const AUTO_ORDER: [Exclude<Focus, 'recuperacion' | 'fullbody'>, number][] = [
  ['torso', 3.2],
  ['pierna', 3.1],
  ['empuje', 2.9],
  ['tiron', 2.9],
  ['gluteo', 2.3],
  ['brazos', 1.8],
];

export function chooseFocus(fatigue: FatigueMap): Focus {
  const marked = Object.keys(fatigue).length;
  if (!marked) return 'fullbody';
  let best: Focus = 'recuperacion';
  let bestScore = -Infinity;
  for (const [focus, base] of AUTO_ORDER) {
    const ms = FOCUS_INFO[focus].muscles;
    if (ms.some((m) => fatigue[m] === 'ayer')) continue;
    const antier = ms.filter((m) => fatigue[m] === 'antier').length;
    const score = base - antier * 0.9 - (antier === ms.length ? 2 : 0);
    if (score > bestScore) {
      bestScore = score;
      best = focus;
    }
  }
  return best;
}

function buildReason(focus: Focus, fatigue: FatigueMap = {}) {
  const ayer = (Object.keys(fatigue) as Muscle[]).filter((m) => fatigue[m] === 'ayer');
  const antier = (Object.keys(fatigue) as Muscle[]).filter((m) => fatigue[m] === 'antier');
  const list = (ms: Muscle[]) => ms.map((m) => MUSCLE_LABEL[m].toLowerCase()).join(', ');
  if (!ayer.length && !antier.length) {
    return focus === 'fullbody'
      ? 'Sin entrenamientos recientes registrados: cuerpo completo para estimular todo con volumen equilibrado.'
      : `Enfoque elegido por el coach: ${FOCUS_INFO[focus].label.toLowerCase()}.`;
  }
  if (focus === 'recuperacion') {
    return `Casi todo el cuerpo se entrenó ayer (${list(ayer)}). Hoy toca recuperación activa para llegar al 100% mañana.`;
  }
  const parts: string[] = [];
  if (ayer.length) parts.push(`Ayer: ${list(ayer)} (necesitan 48–72 h).`);
  if (antier.length) parts.push(`Antier: ${list(antier)} (recuperación parcial, volumen reducido).`);
  parts.push(`Hoy: ${FOCUS_INFO[focus].label.toLowerCase()}, músculos listos para trabajar.`);
  return parts.join(' ');
}

// ── Generador de la rutina del día ─────────────────────────────────────────

function itemSeconds(it: RoutineItem) {
  return it.exercise.fixedSeconds ?? it.repsNum * 4 + 20;
}

function makeBlocks(items: RoutineItem[], superset: boolean, start: number) {
  const blocks: RoutineItem[][] = [];
  let i = 0;
  while (i < items.length) {
    if (superset && i >= start && i + 1 < items.length) {
      blocks.push([items[i], items[i + 1]]);
      i += 2;
    } else {
      blocks.push([items[i]]);
      i += 1;
    }
  }
  return blocks;
}

function blocksSeconds(blocks: RoutineItem[][]) {
  return blocks.reduce((t, b) => {
    if (b.length === 1) {
      const it = b[0];
      return t + it.sets * itemSeconds(it) + (it.sets - 1) * it.rest + 70;
    }
    const sets = Math.max(...b.map((i) => i.sets));
    const per = b.reduce((s, i) => s + itemSeconds(i), 0) + 15;
    const rest = Math.max(...b.map((i) => i.rest));
    return t + sets * per + (sets - 1) * rest + 90;
  }, 0);
}

function prescribe(ex: Exercise, slot: number, p: RoutineParams, isFirst: boolean): RoutineItem {
  const comp = ex.kind === 'compuesto';
  const g = GOAL_RX[p.goal][comp ? 'comp' : 'aisl'];
  const phase = p.phase != null ? PHASES[p.phase] : null;
  let { sets, reps, repsNum, rest, rir } = g;
  let note: string | undefined;

  if (comp && isFirst && p.goal !== 'grasa') rest += 30;
  if (p.time <= 45 && !isFirst) sets = Math.min(sets, 3);
  if (p.level === 'principiante') {
    sets = Math.max(2, sets - 1);
    rir += 1;
  }
  if (p.level === 'avanzado' && comp) sets = Math.min(5, sets + 1);
  if (p.fatigue?.[ex.muscle] === 'antier') {
    sets = Math.max(2, sets - 1);
    note = 'Músculo en recuperación: una serie menos.';
  }
  if (phase) {
    rir = Math.max(0, Math.min(4, rir + phase.rir));
    if (phase.sets && comp) sets += phase.sets;
    if (phase.setsMult !== 1) sets = Math.max(2, Math.round(sets * phase.setsMult));
  }

  if (ex.timed) {
    reps = ex.timed;
  } else if (ex.eq === 'corporal') {
    reps = ex.hard ? HARD_BW_REPS[p.goal] : BW_REPS[p.goal];
    repsNum = ex.hard ? 8 : 13;
    if (ex.id === 'dead-bug') reps = '10 por lado';
  }

  if (!note && p.level === 'avanzado' && !comp && p.goal === 'hipertrofia' && ex.eq !== 'corporal' && slot >= 4) {
    note = 'Técnica avanzada: drop set en la última serie (−25% y al fallo).';
  }

  const auto = computeLoad(ex, p, repsNum, rir, phase?.load ?? 1);
  const load = p.loads?.[slot] ?? auto;
  return {
    slot,
    exercise: ex,
    sets,
    reps,
    repsNum,
    rest,
    rir,
    load,
    loadLabel: loadLabelFor(ex, load, rir, p.level),
    note,
    block: '',
  };
}

function recoveryRoutine(p: RoutineParams): Routine {
  const cardioMin = Math.max(10, Math.min(30, p.time - 20));
  const mk = (id: string, sets: number, reps: string, rest: number): RoutineItem => ({
    slot: 0, exercise: EXERCISES[id], sets, reps, repsNum: 12, rest, rir: 3, load: null,
    loadLabel: loadLabelFor(EXERCISES[id], null, 3, p.level), block: '',
  });
  const items = [
    mk('cardio-z2', 1, `${cardioMin} min`, 0),
    mk('movilidad', 1, '8 min', 0),
    mk('plancha', 3, '30–45 s', 45),
    mk('dead-bug', 3, '10 por lado', 45),
    mk('puente-gluteo', 2, '15', 45),
  ].map((it, i) => ({ ...it, slot: i, block: String.fromCharCode(65 + i) }));
  return {
    params: p,
    focus: 'recuperacion',
    title: FOCUS_INFO.recuperacion.label,
    muscles: ['abdomen'],
    items,
    warmup: ['3 min de caminata suave'],
    cooldown: ['Respiración diafragmática 2 min', 'Estiramientos suaves de todo el cuerpo 5 min'],
    minutes: p.time,
    reason: buildReason('recuperacion', p.fatigue),
    progression: 'Mañana regresas con todo: tus músculos estarán recuperados para entrenar fuerte.',
    superset: false,
  };
}

export function generateRoutine(p: RoutineParams): Routine {
  if (p.focus === 'recuperacion') return recoveryRoutine(p);
  const rng = mulberry32(p.seed);
  const used = new Set<string>();
  const cands: RoutineItem[] = [];

  SLOTS[p.focus].forEach((opts, si) => {
    // Siempre se consume el rng para que un cambio no altere los demás huecos.
    const picked = pickExercise(opts, p, used, rng);
    const swap = p.swaps?.[si];
    const id = swap && isAvailable(swap, p, used) ? swap : picked;
    if (!id) return;
    used.add(id);
    cands.push(prescribe(EXERCISES[id], si, p, cands.length === 0));
  });

  const short = p.time <= 30;
  const warmSec = short ? 180 : 300;
  const coolSec = short ? 120 : 180;
  const budget = p.time * 60 - warmSec - coolSec;
  const superset = p.time <= 35 || p.goal === 'grasa' || p.goal === 'acondicionamiento';
  const start = p.goal === 'grasa' ? 0 : 1;

  let chosen: RoutineItem[] = [];
  for (const c of cands) {
    const trial = [...chosen, c];
    if (blocksSeconds(makeBlocks(trial, superset, start)) <= budget) chosen = trial;
  }
  for (const c of cands) {
    if (chosen.length >= 3) break;
    if (!chosen.includes(c)) chosen.push({ ...c, sets: 2 });
  }
  chosen.sort((a, b) => a.slot - b.slot);

  const blocks = makeBlocks(chosen, superset, start);
  const items: RoutineItem[] = [];
  blocks.forEach((b, bi) => {
    const letter = String.fromCharCode(65 + bi);
    b.forEach((it, k) => items.push({ ...it, block: b.length > 1 ? `${letter}${k + 1}` : letter }));
  });

  const workSec = blocksSeconds(blocks);
  const leftover = budget - workSec;
  let finisher: string | undefined;
  let finisherSec = 0;
  if ((p.goal === 'grasa' || p.goal === 'acondicionamiento') && leftover >= 360) {
    finisher = p.equip === 'casa'
      ? 'Finisher HIIT 6 min: 30 s burpees / 30 s descanso × 6'
      : 'Finisher HIIT 8 min: bici o remo 30 s a tope / 30 s suave × 8';
    finisherSec = p.equip === 'casa' ? 360 : 480;
  } else if (leftover >= 420 && p.time >= 60) {
    finisher = 'Cardio ligero 6 min (zona 2) para mejorar la recuperación';
    finisherSec = 360;
  }

  const first = items[0]?.exercise.name.toLowerCase() ?? 'el primer ejercicio';
  const warmup = [
    `${short ? 2 : 4} min de bici, elíptica o caminadora a ritmo suave`,
    p.focus === 'pierna' || p.focus === 'gluteo'
      ? 'Movilidad de cadera y tobillo: 10 sentadillas al aire + 10 puentes'
      : p.focus === 'fullbody'
        ? 'Movilidad general: 10 sentadillas al aire + 10 rotaciones de hombro'
        : 'Movilidad de hombro: 15 rotaciones con banda + 10 face pulls ligeros',
    `2 series de aproximación de ${first} (50% y 75% del peso)`,
  ];
  const muscles = Array.from(new Set(items.flatMap((i) => [i.exercise.muscle])));
  const cooldown = [
    '2–3 min de caminata suave',
    `Estira 30 s: ${muscles.slice(0, 4).map((m) => MUSCLE_LABEL[m].toLowerCase()).join(', ')}`,
  ];

  const progression =
    p.goal === 'fuerza'
      ? 'Progresión: cuando completes todas las series con RIR 2, sube 2.5–5 kg en básicos la siguiente sesión.'
      : 'Doble progresión: primero llega al tope del rango de reps en todas las series; después sube 2.5 kg en barra o 1–2 kg en mancuernas y vuelve al mínimo del rango.';

  return {
    params: p,
    focus: p.focus,
    title: FOCUS_INFO[p.focus].label,
    muscles,
    items,
    warmup,
    finisher,
    cooldown,
    minutes: Math.round((warmSec + coolSec + workSec + finisherSec) / 60),
    reason: buildReason(p.focus, p.fatigue),
    progression,
    superset,
  };
}

// ── Plan semanal y mensual ─────────────────────────────────────────────────

export const SPLITS: Record<number, { name: string; days: Focus[]; labels: string[] }> = {
  2: { name: 'Full Body ×2', days: ['fullbody', 'fullbody'], labels: ['Martes', 'Viernes'] },
  3: { name: 'Full Body ×3', days: ['fullbody', 'fullbody', 'fullbody'], labels: ['Lunes', 'Miércoles', 'Viernes'] },
  4: { name: 'Torso / Pierna', days: ['torso', 'pierna', 'torso', 'gluteo'], labels: ['Lunes', 'Martes', 'Jueves', 'Viernes'] },
  5: { name: 'Híbrido PPL + Torso/Pierna', days: ['empuje', 'tiron', 'pierna', 'torso', 'gluteo'], labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] },
  6: { name: 'Push / Pull / Legs ×2', days: ['empuje', 'tiron', 'pierna', 'empuje', 'tiron', 'pierna'], labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] },
};

export interface PlanDay { label: string; routine: Routine }
export interface PlanWeek { index: number; phase: (typeof PHASES)[number] | null; days: PlanDay[] }

export function generatePlan(
  base: Omit<RoutineParams, 'focus' | 'seed' | 'phase' | 'fatigue'>,
  daysPerWeek: number,
  weeks: 1 | 4,
  seed: number,
): PlanWeek[] {
  const split = SPLITS[daysPerWeek];
  return Array.from({ length: weeks }, (_, w) => ({
    index: w,
    phase: weeks === 4 ? PHASES[w] : null,
    days: split.days.map((focus, d) => ({
      label: split.labels[d],
      routine: generateRoutine({ ...base, focus, seed: seed + d * 101, phase: weeks === 4 ? w : undefined }),
    })),
  }));
}

// ── Textos para WhatsApp ───────────────────────────────────────────────────

export function routineWhatsApp(r: Routine, link: string, gym: string) {
  const p = r.params;
  const d = p.date ? new Date(`${p.date}T12:00:00`) : new Date();
  const fecha = d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'short' });
  const L: string[] = [];
  L.push(`🏋️ *${gym.toUpperCase()} · IRON PLAN*`);
  L.push(p.name ? `Rutina de *${p.name}* — ${fecha}` : `Rutina del día — ${fecha}`);
  L.push(`${FOCUS_INFO[r.focus].emoji} *${r.title}*`);
  L.push(`🎯 ${GOAL_INFO[p.goal].label} · ⏱️ ${r.minutes} min · ${LEVEL_INFO[p.level].label}`);
  if (p.phase != null) L.push(`📅 Semana ${p.phase + 1} · ${PHASES[p.phase].name}`);
  L.push('');
  L.push('🔥 *Calentamiento*');
  r.warmup.forEach((w) => L.push(`• ${w}`));
  L.push('');
  r.items.forEach((it) => {
    L.push(`*${it.block}. ${it.exercise.name}*`);
    const rest = it.rest ? ` · desc. ${fmtRest(it.rest)}` : '';
    const free = it.load == null && it.exercise.ratio;
    const loadTxt = free ? `peso que te deje ${it.rir} reps en reserva` : it.loadLabel;
    const rir = it.exercise.kind === 'cardio' || free ? '' : ` · RIR ${it.rir}`;
    L.push(`   ${it.sets} × ${it.reps} · *${loadTxt}*${rest}${rir}`);
    if (it.note) L.push(`   ⚠️ ${it.note}`);
  });
  if (r.superset) L.push('', '🔁 Bloques con 1 y 2 (ej. B1/B2) van en *superserie*: sin descanso entre ellos.');
  if (r.finisher) L.push('', `⚡ *${r.finisher}*`);
  L.push('', '🧊 *Vuelta a la calma*');
  r.cooldown.forEach((c) => L.push(`• ${c}`));
  L.push('', `📈 ${r.progression}`);
  L.push('', `📲 Ábrela con temporizador y técnica: ${link}`);
  L.push('', '💧 Hidrátate y cuida la técnica. ¡A darle! 💪');
  return L.join('\n');
}

export function planWhatsApp(plan: PlanWeek[], weekIndex: number, splitName: string, gym: string, name?: string) {
  const w = plan[weekIndex];
  const L: string[] = [];
  L.push(`🏋️ *${gym.toUpperCase()} · IRON PLAN*`);
  L.push(name ? `Plan de *${name}*` : 'Tu plan de entrenamiento');
  L.push(`🗓️ ${splitName}${w.phase ? ` · Semana ${weekIndex + 1}: ${w.phase.name}` : ''}`);
  if (w.phase) L.push(`_${w.phase.desc}_`);
  w.days.forEach((d) => {
    L.push('', `${FOCUS_INFO[d.routine.focus].emoji} *${d.label.toUpperCase()} · ${d.routine.title}* (${d.routine.minutes} min)`);
    d.routine.items.forEach((it) => L.push(`• ${it.exercise.name}: ${it.sets}×${it.reps} · ${it.loadLabel}`));
  });
  L.push('', `📈 ${plan[0].days[0].routine.progression}`);
  L.push('', '💪 ¡Constancia es la clave!');
  return L.join('\n');
}

// ── Enlace compartible ─────────────────────────────────────────────────────

export function encodeParams(p: RoutineParams) {
  const bytes = new TextEncoder().encode(JSON.stringify(p));
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeParams(code: string): RoutineParams | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const p = JSON.parse(new TextDecoder().decode(bytes));
    if (!p || !FOCUS_INFO[p.focus as Focus]) return null;
    return p as RoutineParams;
  } catch {
    return null;
  }
}

export function waPhone(raw: string) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return `52${digits}`;
  return digits;
}
