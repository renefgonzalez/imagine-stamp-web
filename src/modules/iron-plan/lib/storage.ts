// ── Clientes e historial del coach (localStorage del dispositivo) ──────────
// Demo sin backend. En producción esto pasa a Supabase para verlo en cualquier equipo.

import { Muscle } from '../data/exercises';
import { Equip, FatigueMap, Focus, Goal, Level, Sex, todayISO } from './engine';
import { Injury } from '../data/exercises';

export interface Profile {
  goal: Goal;
  level: Level;
  sex: Sex;
  bw?: number;
  equip: Equip;
  injuries: Injury[];
  time: number;
}

export interface HistoryEntry { date: string; focus: Focus; muscles: Muscle[] }

export interface GymClient {
  id: string;
  name: string;
  phone: string;
  profile: Profile;
  history: HistoryEntry[];
}

const KEY = 'ironplan:clients:v1';

export const DEFAULT_PROFILE: Profile = {
  goal: 'hipertrofia',
  level: 'intermedio',
  sex: 'h',
  equip: 'gym',
  injuries: [],
  time: 60,
};

const SEED_CLIENTS: GymClient[] = [
  {
    id: 'demo-carlos',
    name: 'Carlos Méndez',
    phone: '',
    profile: { ...DEFAULT_PROFILE, goal: 'hipertrofia', level: 'intermedio', sex: 'h', bw: 82, time: 60 },
    history: [{ date: todayISO(-1), focus: 'pierna', muscles: ['cuadriceps', 'femoral', 'gluteo', 'pantorrilla'] }],
  },
  {
    id: 'demo-ana',
    name: 'Ana López',
    phone: '',
    profile: { ...DEFAULT_PROFILE, goal: 'grasa', level: 'principiante', sex: 'm', bw: 64, time: 45 },
    history: [{ date: todayISO(-2), focus: 'empuje', muscles: ['pecho', 'hombro', 'triceps'] }],
  },
  {
    id: 'demo-luis',
    name: 'Luis "Toro" Ramírez',
    phone: '',
    profile: { ...DEFAULT_PROFILE, goal: 'fuerza', level: 'avanzado', sex: 'h', bw: 95, time: 90, injuries: ['hombro'] },
    history: [
      { date: todayISO(-1), focus: 'empuje', muscles: ['pecho', 'hombro', 'triceps'] },
      { date: todayISO(-2), focus: 'tiron', muscles: ['espalda', 'biceps'] },
    ],
  },
];

export function loadClients(): GymClient[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as GymClient[];
  } catch {
    /* almacenamiento bloqueado */
  }
  return SEED_CLIENTS;
}

export function saveClients(list: GymClient[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* almacenamiento bloqueado */
  }
}

export function fatigueFromHistory(history: HistoryEntry[] = []): FatigueMap {
  const y = todayISO(-1);
  const a = todayISO(-2);
  const f: FatigueMap = {};
  history.filter((h) => h.date === a).forEach((h) => h.muscles.forEach((m) => (f[m] = 'antier')));
  history.filter((h) => h.date === y).forEach((h) => h.muscles.forEach((m) => (f[m] = 'ayer')));
  return f;
}

export function recordSession(list: GymClient[], clientId: string, entry: HistoryEntry): GymClient[] {
  return list.map((c) =>
    c.id !== clientId
      ? c
      : { ...c, history: [entry, ...c.history.filter((h) => h.date !== entry.date)].slice(0, 30) },
  );
}

export const newId = () => `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
