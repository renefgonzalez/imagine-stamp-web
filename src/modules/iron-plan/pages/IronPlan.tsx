import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity, ArrowRight, BatteryCharging, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight,
  CirclePlay, Clock, Copy, Dumbbell, Flame, Gauge, HeartPulse, Info, Layers, Link2, MapPin, MessageCircle,
  Minus, Phone, Plus, Repeat, Send, ShieldCheck, Sparkles, Target, Timer, TrendingUp, Trophy, User, UserPlus,
  Users, X, Zap,
} from 'lucide-react';
import logo from '../assets/logo-strong-gym.webp';
import { clientConfig as C } from '../config';
import BodyMap from '../components/BodyMap';
import RestTimer from '../components/RestTimer';
import { EXERCISE_COUNT, EQUIPMENT_LABEL, Injury, MUSCLE_LABEL, Muscle } from '../data/exercises';
import {
  EQUIP_INFO, Equip, FOCUS_INFO, FatigueMap, Focus, GOAL_INFO, Goal, INJURY_LABEL, LEVEL_INFO, Level, PHASES,
  Routine, RoutineItem, RoutineParams, SPLITS, Sex, chooseFocus, decodeParams, encodeParams, fmtRest,
  generatePlan, generateRoutine, newSeed, planWhatsApp, routineWhatsApp, slotAlternatives, todayISO, waPhone,
} from '../lib/engine';
import {
  DEFAULT_PROFILE, GymClient, Profile, fatigueFromHistory, loadClients, newId, recordSession, saveClients,
} from '../lib/storage';

// ── Estilos globales del módulo ────────────────────────────────────────────
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
.ip-root{font-family:'Barlow',system-ui,-apple-system,'Segoe UI',sans-serif}
.ip-display{font-family:'Barlow Condensed','Arial Narrow',system-ui,sans-serif;letter-spacing:.01em}
@keyframes ipPulse{0%,100%{opacity:.95}50%{opacity:.45}}
.ip-pulse{animation:ipPulse 1.6s ease-in-out infinite}
.ip-grid-bg{background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:32px 32px}
.ip-noscroll::-webkit-scrollbar{display:none}.ip-noscroll{scrollbar-width:none}
`;

const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');
const FOCUS_ORDER: Focus[] = ['fullbody', 'torso', 'pierna', 'empuje', 'tiron', 'gluteo', 'brazos'];
const TIMES = [30, 45, 60, 75, 90];
const ALL_MUSCLES = Object.keys(MUSCLE_LABEL) as Muscle[];

type View = 'home' | 'wizard' | 'loading' | 'routine' | 'plan' | 'done';

// ── Piezas de UI ───────────────────────────────────────────────────────────

function Chip({ active, onClick, children, tone = 'red', className }: {
  active?: boolean; onClick?: () => void; children: React.ReactNode; tone?: 'red' | 'amber' | 'green'; className?: string;
}) {
  const on = {
    red: 'bg-[#E50914] border-[#E50914] text-white shadow-lg shadow-red-950/40',
    amber: 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-950/40',
    green: 'bg-emerald-500 border-emerald-500 text-black',
  }[tone];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'px-3.5 py-2 rounded-xl border text-sm font-semibold transition active:scale-95 whitespace-nowrap',
        active ? on : 'bg-white/[0.04] border-white/10 text-gray-300 hover:bg-white/[0.08] hover:text-white',
        className,
      )}
    >
      {children}
    </button>
  );
}

function OptionCard({ active, onClick, title, desc, icon }: {
  active: boolean; onClick: () => void; title: string; desc?: string; icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'w-full text-left p-4 rounded-2xl border transition active:scale-[0.98] flex items-center gap-3',
        active
          ? 'bg-gradient-to-br from-[#E50914]/25 to-[#E50914]/5 border-[#E50914] shadow-[0_0_0_1px_rgba(229,9,20,.4),0_10px_30px_-10px_rgba(229,9,20,.5)]'
          : 'bg-white/[0.03] border-white/10 hover:border-white/25',
      )}
    >
      {icon && (
        <span className={cx('w-11 h-11 shrink-0 rounded-xl flex items-center justify-center', active ? 'bg-[#E50914] text-white' : 'bg-white/5 text-gray-400')}>
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="ip-display block text-lg font-bold text-white uppercase leading-tight">{title}</span>
        {desc && <span className="block text-xs text-gray-400 mt-0.5">{desc}</span>}
      </span>
      <span className={cx('w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0', active ? 'border-[#E50914] bg-[#E50914]' : 'border-white/20')}>
        {active && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  );
}

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <p className="ip-display text-xs font-bold tracking-[0.3em] text-[#FF2E38] uppercase">{kicker}</p>
      <h2 className="ip-display text-3xl sm:text-4xl font-black text-white uppercase leading-none mt-1">{title}</h2>
      {sub && <p className="text-sm text-gray-400 mt-2 leading-relaxed">{sub}</p>}
    </div>
  );
}

const GOAL_ICON: Record<Goal, React.ReactNode> = {
  fuerza: <Dumbbell className="w-5 h-5" />,
  hipertrofia: <Layers className="w-5 h-5" />,
  grasa: <Flame className="w-5 h-5" />,
  acondicionamiento: <HeartPulse className="w-5 h-5" />,
};

// ── Página ─────────────────────────────────────────────────────────────────

export default function IronPlan() {
  const [search, setSearch] = useSearchParams();
  const [view, setView] = useState<View>('home');
  const [backTo, setBackTo] = useState<View>('home');
  const [mode, setMode] = useState<'coach' | 'client'>('coach');
  const [params, setParams] = useState<RoutineParams | null>(null);
  const [clients, setClients] = useState<GymClient[]>(() => loadClients());
  const [clientId, setClientId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [wizardSeed, setWizardSeed] = useState<{ clientId?: string } | null>(null);
  const planMemo = useRef<PlanMemo>({ cid: 'none', prof: DEFAULT_PROFILE, days: 4, weeks: 4, seed: null, week: 0 });

  useEffect(() => saveClients(clients), [clients]);

  // Rutina recibida por enlace (vista del cliente)
  useEffect(() => {
    const code = search.get('r');
    if (!code) return;
    const p = decodeParams(code);
    if (p) {
      setParams(p);
      setMode('client');
      setView('routine');
    }
  }, [search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const showToast = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const routine = useMemo(() => (params ? generateRoutine(params) : null), [params]);
  const client = clients.find((c) => c.id === clientId) ?? null;

  // Liga sin "#" (puente public/iron-plan/) para que WhatsApp muestre la vista previa de IRON PLAN
  const shareLink = (p: RoutineParams) => `${window.location.origin}${C.routePath}/?r=${encodeParams(p)}`;

  const openWhatsApp = (phone: string, text: string) => {
    const ph = waPhone(phone);
    const url = `https://wa.me/${ph}?text=${encodeURIComponent(text)}`;
    showToast('Abriendo WhatsApp…');
    window.setTimeout(() => {
      window.location.href = url;
    }, 500);
  };

  const copy = async (text: string, msg: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg);
    } catch {
      showToast('No se pudo copiar en este navegador');
    }
  };

  const startRoutine = (p: RoutineParams, cid: string | null, from: View) => {
    setParams(p);
    setClientId(cid);
    setBackTo(from);
    setView('loading');
    window.setTimeout(() => setView('routine'), 1700);
  };

  const goHome = () => {
    if (search.get('r')) setSearch({});
    setMode('coach');
    setView('home');
  };

  return (
    <div className="ip-root min-h-screen bg-[#0A0A0A] text-white selection:bg-[#E50914] selection:text-white">
      <style>{STYLE}</style>

      <Header mode={mode} onHome={goHome} onPlan={() => setView('plan')} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === 'home' && (
              <Home
                clients={clients}
                onExpress={(time, focus) =>
                  startRoutine(
                    { ...DEFAULT_PROFILE, time, focus, seed: newSeed(), date: todayISO() },
                    null,
                    'home',
                  )
                }
                onWizard={(cid) => {
                  setWizardSeed({ clientId: cid });
                  setView('wizard');
                }}
                onPlan={() => setView('plan')}
              />
            )}

            {view === 'wizard' && (
              <Wizard
                clients={clients}
                initialClientId={wizardSeed?.clientId}
                onCancel={() => setView('home')}
                onDone={(p, newClient, cid) => {
                  if (newClient) setClients((l) => [newClient, ...l]);
                  else if (cid) setClients((l) => l.map((c) => (c.id === cid ? { ...c, profile: profileFrom(p) } : c)));
                  startRoutine(p, cid, 'home');
                }}
              />
            )}

            {view === 'loading' && params && <Loading params={params} />}

            {view === 'routine' && routine && params && (
              <RoutineView
                routine={routine}
                mode={mode}
                client={client}
                onBack={() => setView(backTo)}
                onChange={(p) => setParams(p)}
                onRegenerate={() => setParams({ ...params, seed: newSeed(), swaps: {}, loads: {} })}
                onSend={(phone) => {
                  const text = routineWhatsApp(routine, shareLink(params), C.shortName);
                  if (clientId) {
                    setClients((l) =>
                      recordSession(
                        l.map((c) => (c.id === clientId && phone && !c.phone ? { ...c, phone } : c)),
                        clientId,
                        { date: params.date ?? todayISO(), focus: routine.focus, muscles: routine.muscles },
                      ),
                    );
                  }
                  openWhatsApp(phone, text);
                }}
                onCopyText={() => copy(routineWhatsApp(routine, shareLink(params), C.shortName), 'Rutina copiada')}
                onCopyLink={() => copy(shareLink(params), 'Enlace copiado')}
                onFinish={() => setView('done')}
              />
            )}

            {view === 'plan' && (
              <PlanView
                clients={clients}
                memo={planMemo}
                onBack={() => setView('home')}
                onOpenDay={(p, cid) => {
                  setParams(p);
                  setClientId(cid);
                  setBackTo('plan');
                  setView('routine');
                }}
                onSend={(phone, text) => openWhatsApp(phone, text)}
                onCopy={(text) => copy(text, 'Plan copiado')}
              />
            )}

            {view === 'done' && routine && (
              <Done
                routine={routine}
                onBack={() => setView('routine')}
                onNotify={(text) => openWhatsApp(C.phone, text)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onPrivacy={() => setPrivacy(true)} />

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed left-1/2 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-[90] -translate-x-1/2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-bold shadow-2xl flex items-center gap-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Check className="w-4 h-4 text-emerald-600" /> {toast}
          </motion.div>
        )}
        {privacy && <PrivacyModal onClose={() => setPrivacy(false)} />}
      </AnimatePresence>
    </div>
  );
}

function dayLabel(iso: string) {
  if (iso === todayISO()) return 'Hoy';
  if (iso === todayISO(-1)) return 'Ayer';
  if (iso === todayISO(-2)) return 'Antier';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function profileFrom(p: RoutineParams): Profile {
  return { goal: p.goal, level: p.level, sex: p.sex, bw: p.bw, equip: p.equip, injuries: p.injuries, time: p.time };
}

// ── Header ─────────────────────────────────────────────────────────────────

function Header({ mode, onHome, onPlan }: { mode: 'coach' | 'client'; onHome: () => void; onPlan: () => void }) {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button onClick={onHome} className="flex items-center gap-2.5 min-w-0" aria-label="Inicio">
          <img src={logo} alt={C.businessName} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E50914] shadow-[0_0_14px_rgba(229,9,20,.55)]" />
          <span className="text-left min-w-0">
            <span className="ip-display block text-xl font-black tracking-wide leading-none">
              IRON <span className="text-[#E50914]">PLAN</span>
            </span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 truncate">by {C.businessName}</span>
          </span>
        </button>
        {mode === 'coach' ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" /> {C.coachLabel}
            </span>
            <button onClick={onPlan} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold flex items-center gap-1.5 hover:bg-white/10 transition">
              <CalendarDays className="w-4 h-4" /> <span className="hidden xs:inline sm:inline">Planes</span>
            </button>
          </div>
        ) : (
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
            Tu rutina
          </span>
        )}
      </div>
    </header>
  );
}

// ── Inicio del coach ───────────────────────────────────────────────────────

function Home({ clients, onExpress, onWizard, onPlan }: {
  clients: GymClient[];
  onExpress: (time: number, focus: Focus) => void;
  onWizard: (clientId?: string) => void;
  onPlan: () => void;
}) {
  const [time, setTime] = useState(45);
  const [focus, setFocus] = useState<Focus>('fullbody');

  return (
    <div className="pt-6 sm:pt-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111] ip-grid-bg p-6 sm:p-10">
        <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-[#E50914]/30 blur-[90px]" />
        <div className="absolute -bottom-28 -left-16 w-64 h-64 rounded-full bg-[#E50914]/10 blur-[80px]" />
        <div className="relative">
          <img src={logo} alt={C.businessName} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4 ring-[#E50914] shadow-[0_0_40px_rgba(229,9,20,.6)] mb-5" />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF2E38] bg-[#E50914]/10 border border-[#E50914]/30 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Programación inteligente
          </span>
          <h1 className="ip-display text-[44px] sm:text-6xl font-black uppercase leading-[0.9] mt-4">
            Rutinas de nivel <span className="text-[#E50914]">pro</span>,<br />listas en 20 segundos
          </h1>
          <p className="text-gray-300 mt-4 max-w-lg leading-relaxed">
            Recuperación muscular, tiempo disponible, objetivo y cargas calculadas. Envía la rutina por WhatsApp con temporizador incluido.
          </p>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 max-w-md">
            {[
              { n: `${EXERCISE_COUNT}+`, l: 'Ejercicios' },
              { n: '48–72 h', l: 'Recuperación' },
              { n: '4 sem', l: 'Progresión' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-black/40 border border-white/10 px-3 py-3 text-center">
                <p className="ip-display text-2xl font-black text-white leading-none">{s.n}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modo express */}
      <section className="mt-5 relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#E50914] via-[#B20710] to-[#5c0308] p-6 sm:p-8 shadow-[0_30px_60px_-20px_rgba(229,9,20,.55)]">
        <Zap className="absolute -right-6 -top-6 w-40 h-40 text-white/10" strokeWidth={1.2} />
        <div className="relative">
          <p className="ip-display text-xs font-bold tracking-[0.3em] uppercase text-white/80">Modo express · 1 toque</p>
          <h2 className="ip-display text-3xl sm:text-4xl font-black uppercase leading-none mt-1">"Solo quiero mi rutina de hoy"</h2>
          <p className="text-white/80 text-sm mt-2">Para el cliente que llega y entrena. Sin preguntas: elige el tiempo y listo.</p>

          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-5 mb-2">¿Cuánto tiempo tiene?</p>
          <div className="flex gap-2 overflow-x-auto ip-noscroll -mx-1 px-1">
            {TIMES.map((t) => (
              <button
                key={t}
                onClick={() => setTime(t)}
                className={cx(
                  'shrink-0 px-4 py-2.5 rounded-xl font-bold text-sm transition active:scale-95',
                  time === t ? 'bg-white text-[#B20710] shadow-lg' : 'bg-black/25 text-white border border-white/20',
                )}
              >
                {t} min
              </button>
            ))}
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-white/70 mt-4 mb-2">Enfoque (opcional)</p>
          <div className="flex gap-2 overflow-x-auto ip-noscroll -mx-1 px-1">
            {FOCUS_ORDER.map((f) => (
              <button
                key={f}
                onClick={() => setFocus(f)}
                className={cx(
                  'shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95',
                  focus === f ? 'bg-black text-white ring-1 ring-white/60' : 'bg-black/20 text-white/85',
                )}
              >
                {FOCUS_INFO[f].short}
              </button>
            ))}
          </div>

          <button
            onClick={() => onExpress(time, focus)}
            className="mt-6 w-full h-14 rounded-2xl bg-white text-black ip-display text-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-xl"
          >
            <Zap className="w-5 h-5 text-[#E50914]" fill="#E50914" /> Generar rutina express
          </button>
        </div>
      </section>

      {/* Otras opciones */}
      <div className="grid sm:grid-cols-2 gap-4 mt-5">
        <button
          onClick={() => onWizard()}
          className="group text-left rounded-[24px] bg-[#121212] border border-white/10 p-6 hover:border-[#E50914]/60 transition"
        >
          <span className="w-12 h-12 rounded-2xl bg-[#E50914]/15 text-[#FF2E38] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </span>
          <h3 className="ip-display text-2xl font-black uppercase mt-4">Rutina personalizada</h3>
          <p className="text-sm text-gray-400 mt-1.5">5 preguntas: qué entrenó ayer, tiempo, objetivo, nivel y lesiones. Cargas en kg calculadas.</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#FF2E38] mt-4 group-hover:gap-2 transition-all">
            Empezar <ArrowRight className="w-4 h-4" />
          </span>
        </button>
        <button
          onClick={onPlan}
          className="group text-left rounded-[24px] bg-[#121212] border border-white/10 p-6 hover:border-[#E50914]/60 transition"
        >
          <span className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </span>
          <h3 className="ip-display text-2xl font-black uppercase mt-4">Plan semanal o mensual</h3>
          <p className="text-sm text-gray-400 mt-1.5">De 2 a 6 días por semana. Mesociclo de 4 semanas con progresión de cargas y descarga.</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-400 mt-4 group-hover:gap-2 transition-all">
            Planificar <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* Clientes */}
      <section className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <SectionTitle kicker="Tus clientes" title="Rutina de hoy" sub="Iron Plan recuerda qué entrenó cada uno y propone lo que toca." />
        </div>
        <div className="space-y-2.5">
          {clients.map((c) => {
            const f = fatigueFromHistory(c.history);
            const next = chooseFocus(f);
            const last = c.history[0];
            return (
              <button
                key={c.id}
                onClick={() => onWizard(c.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition text-left"
              >
                <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2a2a2a] to-[#161616] border border-white/10 flex items-center justify-center ip-display text-lg font-black text-white shrink-0">
                  {c.name.trim().charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-white truncate">{c.name}</span>
                  <span className="block text-xs text-gray-500 truncate">
                    {last ? `${dayLabel(last.date)}: ${FOCUS_INFO[last.focus].short}` : 'Sin historial'}
                    {' · '}{GOAL_INFO[c.profile.goal].label}
                  </span>
                </span>
                <span className="text-right shrink-0">
                  <span className="block text-[10px] uppercase tracking-wider text-gray-500">Hoy toca</span>
                  <span className="ip-display block text-base font-black text-emerald-400 uppercase">{FOCUS_INFO[next].short}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" />
              </button>
            );
          })}
          <button
            onClick={() => onWizard('new')}
            className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-dashed border-white/15 text-gray-400 hover:text-white hover:border-white/30 transition text-sm font-semibold"
          >
            <UserPlus className="w-4 h-4" /> Nuevo cliente
          </button>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="mt-12">
        <SectionTitle kicker="Ciencia aplicada" title="Cómo programa Iron Plan" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { i: <BatteryCharging className="w-5 h-5" />, t: 'Recuperación muscular', d: 'Si ayer fue pierna, hoy no repite: cada músculo descansa de 48 a 72 h.' },
            { i: <Clock className="w-5 h-5" />, t: 'Se ajusta a su tiempo', d: 'Calcula series, descansos y superseries para terminar a tiempo.' },
            { i: <Gauge className="w-5 h-5" />, t: 'Cargas en kg', d: 'Estima su 1RM por peso corporal y nivel; prescribe por RIR (reps en reserva).' },
            { i: <TrendingUp className="w-5 h-5" />, t: 'Progresión real', d: 'Doble progresión y mesociclos: adaptación, acumulación, intensificación y descarga.' },
          ].map((f) => (
            <div key={f.t} className="flex gap-3 p-4 rounded-2xl bg-[#121212] border border-white/[0.07]">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-[#E50914]/12 text-[#FF2E38] flex items-center justify-center">{f.i}</span>
              <span>
                <span className="block font-bold text-white">{f.t}</span>
                <span className="block text-sm text-gray-400 mt-0.5">{f.d}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Asistente de 5 preguntas ───────────────────────────────────────────────

const STEPS = ['Cliente', 'Recuperación', 'Tiempo', 'Objetivo', 'Perfil', 'Equipo'];

function Wizard({ clients, initialClientId, onCancel, onDone }: {
  clients: GymClient[];
  initialClientId?: string;
  onCancel: () => void;
  onDone: (p: RoutineParams, newClient: GymClient | null, clientId: string | null) => void;
}) {
  const initial = clients.find((c) => c.id === initialClientId);
  const [step, setStep] = useState(initial ? 1 : 0);
  const [sel, setSel] = useState<string>(initial ? initial.id : initialClientId === 'new' ? 'new' : 'none');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [fatigue, setFatigue] = useState<FatigueMap>(() => (initial ? fatigueFromHistory(initial.history) : {}));
  const [brush, setBrush] = useState<'ayer' | 'antier'>('ayer');
  const [focusOv, setFocusOv] = useState<'auto' | Focus>('auto');
  const [prof, setProf] = useState<Profile>(() => initial?.profile ?? DEFAULT_PROFILE);

  const pickClient = (id: string) => {
    setSel(id);
    const c = clients.find((x) => x.id === id);
    if (c) {
      setProf(c.profile);
      setFatigue(fatigueFromHistory(c.history));
    } else {
      setProf(DEFAULT_PROFILE);
      setFatigue({});
    }
  };

  const toggle = (m: Muscle) =>
    setFatigue((f) => {
      const n = { ...f };
      if (n[m] === brush) delete n[m];
      else n[m] = brush;
      return n;
    });

  const autoFocus = chooseFocus(fatigue);
  const focus = focusOv === 'auto' ? autoFocus : focusOv;
  const target = FOCUS_INFO[focus].muscles.filter((m) => !fatigue[m]);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setProf((p) => ({ ...p, [k]: v }));

  const canNext = step !== 0 || sel !== 'new' || newName.trim().length > 1;

  const finish = () => {
    let created: GymClient | null = null;
    let cid: string | null = sel !== 'none' && sel !== 'new' ? sel : null;
    let name = clients.find((c) => c.id === cid)?.name;
    if (sel === 'new') {
      created = { id: newId(), name: newName.trim(), phone: newPhone.trim(), profile: prof, history: [] };
      cid = created.id;
      name = created.name;
    }
    onDone(
      { ...prof, focus, seed: newSeed(), name, fatigue, date: todayISO(), swaps: {}, loads: {} },
      created,
      cid,
    );
  };

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={step === 0 || (initial && step === 1) ? onCancel : () => setStep(step - 1)} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition">
          <ChevronLeft className="w-4 h-4" /> {step === 0 ? 'Inicio' : 'Atrás'}
        </button>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paso {step + 1} de {STEPS.length}</span>
      </div>
      <div className="flex gap-1.5 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={cx('h-1.5 rounded-full transition-all duration-500', i <= step ? 'bg-[#E50914]' : 'bg-white/10')} />
            <p className={cx('hidden sm:block text-[10px] uppercase tracking-wider mt-1.5', i === step ? 'text-white font-bold' : 'text-gray-600')}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <div>
              <SectionTitle kicker="Pregunta 0" title="¿Para quién es la rutina?" sub="Con un cliente registrado, Iron Plan recuerda lo que entrenó." />
              <div className="space-y-2.5">
                {clients.map((c) => (
                  <OptionCard key={c.id} active={sel === c.id} onClick={() => pickClient(c.id)} title={c.name} desc={`${GOAL_INFO[c.profile.goal].label} · ${LEVEL_INFO[c.profile.level].label}`} icon={<User className="w-5 h-5" />} />
                ))}
                <OptionCard active={sel === 'new'} onClick={() => pickClient('new')} title="Nuevo cliente" desc="Registrar nombre y WhatsApp" icon={<UserPlus className="w-5 h-5" />} />
                <OptionCard active={sel === 'none'} onClick={() => pickClient('none')} title="Sin registrar" desc="Rutina rápida, sin guardar historial" icon={<Users className="w-5 h-5" />} />
              </div>
              {sel === 'new' && (
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</span>
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Juan Pérez" className="mt-1.5 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] outline-none text-white" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp (opcional)</span>
                    <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} inputMode="tel" placeholder="55 1234 5678" className="mt-1.5 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] outline-none text-white" />
                  </label>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <SectionTitle kicker="Pregunta 1" title="¿Qué entrenó los últimos días?" sub="Toca los músculos. Rojo = ayer, ámbar = antier. Verde = lo que toca hoy." />
              <div className="flex gap-2 mb-4">
                <Chip active={brush === 'ayer'} onClick={() => setBrush('ayer')}>● Ayer</Chip>
                <Chip active={brush === 'antier'} tone="amber" onClick={() => setBrush('antier')}>● Antier</Chip>
                <Chip onClick={() => setFatigue({})} className="ml-auto">Nada · descansado</Chip>
              </div>
              <div className="rounded-3xl bg-[#101010] border border-white/[0.07] p-4 sm:p-6">
                <BodyMap fatigue={fatigue} target={target} onToggle={toggle} />
                <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                  {ALL_MUSCLES.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggle(m)}
                      className={cx(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold border transition',
                        fatigue[m] === 'ayer' ? 'bg-[#E50914] border-[#E50914] text-white'
                          : fatigue[m] === 'antier' ? 'bg-amber-500 border-amber-500 text-black'
                            : target.includes(m) ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                              : 'bg-white/[0.03] border-white/10 text-gray-400',
                      )}
                    >
                      {MUSCLE_LABEL[m]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl p-4 bg-gradient-to-r from-emerald-500/15 to-transparent border border-emerald-500/25 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-bold">{focusOv === 'auto' ? 'Recomendación automática' : 'Elegido por el coach'}</p>
                  <p className="ip-display text-2xl font-black uppercase text-white leading-tight">Hoy toca: {FOCUS_INFO[focus].label}</p>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-5 mb-2">¿Prefieres elegirlo tú?</p>
              <div className="flex gap-2 overflow-x-auto ip-noscroll pb-1">
                <Chip active={focusOv === 'auto'} tone="green" onClick={() => setFocusOv('auto')}>Automático</Chip>
                {FOCUS_ORDER.map((f) => (
                  <Chip key={f} active={focusOv === f} onClick={() => setFocusOv(f)}>{FOCUS_INFO[f].short}</Chip>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <SectionTitle kicker="Pregunta 2" title="¿De cuánto tiempo dispone?" sub="Incluye calentamiento y vuelta a la calma." />
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {TIMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => set('time', t)}
                    className={cx(
                      'aspect-square rounded-2xl border flex flex-col items-center justify-center transition active:scale-95',
                      prof.time === t ? 'bg-[#E50914] border-[#E50914] shadow-lg shadow-red-950/50' : 'bg-white/[0.03] border-white/10 hover:border-white/25',
                    )}
                  >
                    <span className="ip-display text-4xl font-black leading-none">{t}</span>
                    <span className="text-[11px] uppercase tracking-wider mt-1 opacity-80">min</span>
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4 flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-gray-500" />
                {prof.time <= 35 ? 'Con poco tiempo usamos superseries para no perder estímulo.' : 'Iron Plan acomoda los ejercicios para terminar justo a tiempo.'}
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <SectionTitle kicker="Pregunta 3" title="¿Cuál es su objetivo?" />
              <div className="space-y-2.5">
                {(Object.keys(GOAL_INFO) as Goal[]).map((g) => (
                  <OptionCard key={g} active={prof.goal === g} onClick={() => set('goal', g)} title={GOAL_INFO[g].label} desc={GOAL_INFO[g].desc} icon={GOAL_ICON[g]} />
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <SectionTitle kicker="Pregunta 4" title="Nivel y datos para las cargas" sub="Con su peso corporal calculamos los kilos sugeridos de cada ejercicio." />
              <div className="space-y-2.5">
                {(Object.keys(LEVEL_INFO) as Level[]).map((l) => (
                  <OptionCard key={l} active={prof.level === l} onClick={() => set('level', l)} title={LEVEL_INFO[l].label} desc={LEVEL_INFO[l].desc} icon={<Activity className="w-5 h-5" />} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Sexo</p>
                  <div className="flex gap-2">
                    {(['h', 'm'] as Sex[]).map((s) => (
                      <Chip key={s} active={prof.sex === s} onClick={() => set('sex', s)} className="flex-1">{s === 'h' ? 'Hombre' : 'Mujer'}</Chip>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Peso corporal (kg)</span>
                  <input
                    type="number" inputMode="decimal" min={35} max={200}
                    value={prof.bw ?? ''}
                    onChange={(e) => set('bw', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Opcional"
                    className="mt-1.5 w-full h-11 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] outline-none text-white"
                  />
                </label>
              </div>
              {!prof.bw && <p className="text-xs text-gray-500 mt-2">Sin peso, la rutina indica el esfuerzo por RIR (reps en reserva) en lugar de kilos.</p>}
            </div>
          )}

          {step === 5 && (
            <div>
              <SectionTitle kicker="Pregunta 5" title="Equipo y lesiones" />
              <div className="space-y-2.5">
                {(Object.keys(EQUIP_INFO) as Equip[]).map((e) => (
                  <OptionCard key={e} active={prof.equip === e} onClick={() => set('equip', e)} title={EQUIP_INFO[e].label}
                    desc={EQUIP_INFO[e].allowed.filter((a) => a !== 'cardio').map((a) => EQUIPMENT_LABEL[a]).join(' · ')}
                    icon={<Dumbbell className="w-5 h-5" />} />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">Molestias o lesiones (evitamos esos ejercicios)</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(INJURY_LABEL) as Injury[]).map((i) => (
                  <Chip
                    key={i}
                    tone="amber"
                    active={prof.injuries.includes(i)}
                    onClick={() => set('injuries', prof.injuries.includes(i) ? prof.injuries.filter((x) => x !== i) : [...prof.injuries, i])}
                  >
                    {INJURY_LABEL[i]}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 mt-8 -mx-4 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
        <button
          disabled={!canNext}
          onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : finish())}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B20710] disabled:opacity-40 ip-display text-xl font-black uppercase tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-[0_15px_40px_-12px_rgba(229,9,20,.7)]"
        >
          {step < STEPS.length - 1 ? <>Siguiente <ChevronRight className="w-5 h-5" /></> : <><Sparkles className="w-5 h-5" /> Generar rutina</>}
        </button>
      </div>
    </div>
  );
}

// ── Pantalla de carga ──────────────────────────────────────────────────────

function Loading({ params }: { params: RoutineParams }) {
  const steps = [
    'Analizando recuperación muscular',
    `Ajustando a ${params.time} minutos`,
    params.bw ? 'Calculando cargas por %1RM' : 'Definiendo esfuerzo por RIR',
    'Ordenando ejercicios y descansos',
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setN((x) => Math.min(steps.length, x + 1)), 380);
    return () => window.clearInterval(id);
  }, [steps.length]);
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <motion.div
        className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#E50914] to-[#5c0308] flex items-center justify-center shadow-[0_0_60px_rgba(229,9,20,.5)]"
        animate={{ rotate: [0, -12, 12, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 1.1, repeat: Infinity }}
      >
        <Dumbbell className="w-12 h-12 text-white" />
      </motion.div>
      <p className="ip-display text-3xl font-black uppercase mt-6">Programando tu rutina</p>
      <div className="mt-5 space-y-2 text-left">
        {steps.map((s, i) => (
          <motion.p key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: i < n ? 1 : 0.25, x: 0 }} className="flex items-center gap-2 text-sm text-gray-300">
            <span className={cx('w-5 h-5 rounded-full flex items-center justify-center', i < n ? 'bg-emerald-500' : 'bg-white/10')}>
              {i < n && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
            </span>
            {s}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

// ── Rutina ─────────────────────────────────────────────────────────────────

function RoutineView({ routine, mode, client, onBack, onChange, onRegenerate, onSend, onCopyText, onCopyLink, onFinish }: {
  routine: Routine;
  mode: 'coach' | 'client';
  client: GymClient | null;
  onBack: () => void;
  onChange: (p: RoutineParams) => void;
  onRegenerate: () => void;
  onSend: (phone: string) => void;
  onCopyText: () => void;
  onCopyLink: () => void;
  onFinish: () => void;
}) {
  const p = routine.params;
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [rest, setRest] = useState<{ sec: number; label: string } | null>(null);
  const [sheet, setSheet] = useState(false);
  const [phone, setPhone] = useState(client?.phone ?? '');
  const [openTip, setOpenTip] = useState<string | null>(null);

  const totalSets = routine.items.reduce((s, i) => s + i.sets, 0);
  const doneSets = Object.values(done).filter(Boolean).length;
  const pct = totalSets ? Math.round((doneSets / totalSets) * 100) : 0;
  const fecha = new Date(`${p.date ?? todayISO()}T12:00:00`).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });

  const toggleSet = (it: RoutineItem, k: number, idx: number) => {
    const key = `${it.block}-${k}`;
    const now = !done[key];
    setDone((d) => ({ ...d, [key]: now }));
    if (!now || !it.rest) return;
    const isPairFirst = it.block.endsWith('1') && routine.items[idx + 1]?.block.startsWith(it.block[0]);
    if (isPairFirst) return; // en superserie se pasa directo al siguiente ejercicio
    const next = k + 1 < it.sets ? it.exercise.name : routine.items[idx + 1]?.exercise.name ?? 'Vuelta a la calma';
    const nextLabel = it.block.length > 1 && k + 1 < it.sets ? routine.items.find((x) => x.block === `${it.block[0]}1`)?.exercise.name ?? next : next;
    setRest({ sec: it.rest, label: nextLabel });
  };

  const adjustLoad = (it: RoutineItem, dir: 1 | -1) => {
    const step = it.exercise.eq === 'barra' ? 2.5 : it.exercise.eq === 'mancuerna' ? 2 : 5;
    const curr = it.load ?? 0;
    const v = Math.max(0, curr + dir * step);
    onChange({ ...p, loads: { ...(p.loads ?? {}), [it.slot]: v } });
  };

  const swap = (it: RoutineItem) => {
    const others = routine.items.filter((x) => x.slot !== it.slot).map((x) => x.exercise.id);
    const alts = slotAlternatives(routine.focus, it.slot, p, others);
    if (alts.length < 2) return;
    const next = alts[(alts.indexOf(it.exercise.id) + 1) % alts.length];
    const loads = { ...(p.loads ?? {}) };
    delete loads[it.slot];
    onChange({ ...p, swaps: { ...(p.swaps ?? {}), [it.slot]: next }, loads });
  };

  return (
    <div className="pt-5">
      {mode === 'coach' && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-4">
          <ChevronLeft className="w-4 h-4" /> Volver
        </button>
      )}

      {/* Encabezado */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111] ip-grid-bg p-5 sm:p-7">
        <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-[#E50914]/25 blur-[80px]" />
        <div className="relative">
          <p className="text-xs text-gray-400 capitalize">{fecha}{p.name ? ` · ${p.name}` : ''}</p>
          {p.phase != null && (
            <span className="inline-block mt-2 text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-md">
              Semana {p.phase + 1} · {PHASES[p.phase].name}
            </span>
          )}
          <h1 className="ip-display text-4xl sm:text-5xl font-black uppercase leading-[0.92] mt-2">{routine.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { i: <Clock className="w-3.5 h-3.5" />, t: `${routine.minutes} min` },
              { i: GOAL_ICON[p.goal], t: GOAL_INFO[p.goal].label },
              { i: <Activity className="w-3.5 h-3.5" />, t: LEVEL_INFO[p.level].label },
              { i: <Layers className="w-3.5 h-3.5" />, t: `${routine.items.length} ejercicios · ${totalSets} series` },
            ].map((b) => (
              <span key={b.t} className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-200 bg-white/[0.06] border border-white/10 px-2.5 py-1.5 rounded-lg [&_svg]:w-3.5 [&_svg]:h-3.5">
                {b.i} {b.t}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center mt-5">
            <p className="text-sm text-gray-300 leading-relaxed flex gap-2">
              <BatteryCharging className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {routine.reason}
            </p>
            <div className="w-40 mx-auto sm:mx-0">
              <BodyMap fatigue={{}} target={routine.muscles} compact />
            </div>
          </div>
        </div>
      </section>

      {/* Progreso */}
      <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-30 -mx-4 px-4 py-3 bg-[#0A0A0A]/90 backdrop-blur-lg">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-gray-400 uppercase tracking-wider">Progreso</span>
          <span className="text-white tabular-nums">{doneSets}/{totalSets} series · {pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#E50914] to-[#FF2E38]" animate={{ width: `${pct}%` }} transition={{ type: 'spring', damping: 20 }} />
        </div>
      </div>

      {/* Calentamiento */}
      <InfoBlock icon={<Flame className="w-5 h-5" />} title="Calentamiento" tone="amber" lines={routine.warmup} />

      {/* Ejercicios */}
      <div className="space-y-3 mt-3">
        {routine.items.map((it, idx) => {
          const paired = it.block.length > 1;
          const key = it.exercise.id;
          return (
            <motion.article
              key={`${it.slot}-${key}`}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className={cx('relative rounded-3xl bg-[#121212] border p-4 sm:p-5', paired ? 'border-[#E50914]/25' : 'border-white/[0.08]')}
            >
              {paired && it.block.endsWith('1') && (
                <span className="absolute -top-2.5 left-5 text-[10px] font-black uppercase tracking-widest bg-[#E50914] text-white px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Repeat className="w-3 h-3" /> Superserie
                </span>
              )}
              <div className="flex items-start gap-3">
                <span className={cx('ip-display w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl font-black', paired ? 'bg-[#E50914] text-white' : 'bg-white text-black')}>
                  {it.block}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="ip-display text-xl font-bold uppercase leading-tight text-white">{it.exercise.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {MUSCLE_LABEL[it.exercise.muscle]}
                    {it.exercise.secondary?.length ? ` · ${it.exercise.secondary.map((m) => MUSCLE_LABEL[m]).join(', ')}` : ''}
                    {' · '}{EQUIPMENT_LABEL[it.exercise.eq]}
                  </p>
                </div>
                {mode === 'coach' && routine.focus !== 'recuperacion' && (
                  <button onClick={() => swap(it)} className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition" aria-label="Cambiar ejercicio" title="Cambiar ejercicio">
                    <Repeat className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4">
                <Stat label="Series" value={String(it.sets)} />
                <Stat label="Reps" value={it.reps} />
                <Stat label="Descanso" value={it.rest ? fmtRest(it.rest) : '—'} />
                <Stat label="RIR" value={it.exercise.kind === 'cardio' ? '—' : String(it.rir)} />
              </div>

              <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#E50914]/15 to-transparent border border-[#E50914]/20 px-3 py-2.5">
                <Gauge className="w-4 h-4 text-[#FF2E38] shrink-0" />
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Carga</span>
                <span className="ip-display text-xl font-black text-white ml-auto sm:ml-2">{it.loadLabel}</span>
                {mode === 'coach' && it.load != null && (
                  <span className="flex items-center gap-1.5 ml-auto">
                    <button onClick={() => adjustLoad(it, -1)} className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center" aria-label="Bajar carga"><Minus className="w-4 h-4" /></button>
                    <button onClick={() => adjustLoad(it, 1)} className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center" aria-label="Subir carga"><Plus className="w-4 h-4" /></button>
                  </span>
                )}
              </div>

              {it.load == null && it.exercise.ratio && (
                <p className="text-xs text-gray-400 mt-2 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> Elige un peso con el que termines cada serie dejando {it.rir} reps en reserva.</p>
              )}
              {it.note && <p className="text-xs text-amber-300 mt-2.5 flex gap-1.5"><Info className="w-3.5 h-3.5 shrink-0 mt-0.5" /> {it.note}</p>}

              {/* Series */}
              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: it.sets }, (_, k) => {
                  const on = done[`${it.block}-${k}`];
                  return (
                    <button
                      key={k}
                      onClick={() => toggleSet(it, k, idx)}
                      className={cx(
                        'h-11 min-w-[3.25rem] px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-1 transition active:scale-95',
                        on ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-white/[0.03] border-white/15 text-gray-300 hover:border-white/30',
                      )}
                    >
                      {on ? <Check className="w-4 h-4" strokeWidth={3} /> : null} S{k + 1}
                    </button>
                  );
                })}
                {it.rest > 0 && (
                  <button onClick={() => setRest({ sec: it.rest, label: it.exercise.name })} className="h-11 px-3 rounded-xl border border-white/10 text-gray-400 text-sm font-semibold flex items-center gap-1.5 hover:text-white transition">
                    <Timer className="w-4 h-4" /> {fmtRest(it.rest)}
                  </button>
                )}
              </div>

              <button onClick={() => setOpenTip(openTip === key ? null : key)} className="mt-3 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 transition">
                <ChevronDown className={cx('w-4 h-4 transition', openTip === key && 'rotate-180')} /> Técnica
              </button>
              <AnimatePresence>
                {openTip === key && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">{it.exercise.tip}</p>
                    <a
                      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${it.exercise.name} técnica correcta`)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#FF2E38]"
                    >
                      <CirclePlay className="w-4 h-4" /> Ver video de técnica
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>

      {routine.finisher && <InfoBlock icon={<Zap className="w-5 h-5" />} title="Finisher" tone="red" lines={[routine.finisher]} />}
      <InfoBlock icon={<HeartPulse className="w-5 h-5" />} title="Vuelta a la calma" tone="blue" lines={routine.cooldown} />
      <InfoBlock icon={<TrendingUp className="w-5 h-5" />} title="Progresión de cargas" tone="green" lines={[routine.progression]} />

      {mode === 'client' && (
        <button onClick={onFinish} className="mt-6 w-full h-14 rounded-2xl bg-emerald-500 text-black ip-display text-xl font-black uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition">
          <Trophy className="w-5 h-5" /> Terminé mi entrenamiento
        </button>
      )}

      {/* Barra inferior del coach */}
      {mode === 'coach' && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-3xl mx-auto px-4 py-3 flex gap-2">
            <button onClick={onRegenerate} className="h-12 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-sm font-semibold" aria-label="Otra variante">
              <Repeat className="w-4 h-4" /> <span className="hidden sm:inline">Otra variante</span>
            </button>
            <button onClick={() => setSheet(true)} className="flex-1 h-12 rounded-xl bg-[#25D366] text-black font-black flex items-center justify-center gap-2 active:scale-[0.98] transition shadow-[0_10px_30px_-10px_rgba(37,211,102,.6)]">
              <MessageCircle className="w-5 h-5" /> Enviar por WhatsApp
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {rest && <RestTimer key="rest" seconds={rest.sec} label={rest.label} onClose={() => setRest(null)} />}
        {sheet && (
          <Sheet key="sheet" onClose={() => setSheet(false)} title="Enviar rutina">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp del cliente</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" placeholder="55 1234 5678 (vacío = elegir contacto)" className="mt-1.5 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 focus:border-[#25D366] outline-none text-white" />
            </label>
            <div className="mt-4 rounded-2xl bg-[#0b141a] border border-white/10 p-3 max-h-56 overflow-y-auto">
              <div className="bg-[#005c4b] rounded-xl rounded-tr-sm p-3 text-[13px] leading-relaxed text-white/95 whitespace-pre-wrap">
                {routineWhatsApp(routine, 'https://imagineandstamp.site/iron-plan/?r=…', C.shortName)}
              </div>
            </div>
            <button onClick={() => onSend(phone)} className="mt-4 w-full h-14 rounded-2xl bg-[#25D366] text-black font-black text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition">
              <Send className="w-5 h-5" /> Enviar ahora
            </button>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={onCopyText} className="h-11 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold flex items-center justify-center gap-1.5"><Copy className="w-4 h-4" /> Copiar texto</button>
              <button onClick={onCopyLink} className="h-11 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold flex items-center justify-center gap-1.5"><Link2 className="w-4 h-4" /> Copiar enlace</button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/40 border border-white/[0.06] px-2 py-2 text-center min-w-0">
      <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-bold">{label}</p>
      <p className="ip-display text-lg sm:text-xl font-black text-white leading-tight truncate">{value}</p>
    </div>
  );
}

function InfoBlock({ icon, title, lines, tone }: { icon: React.ReactNode; title: string; lines: string[]; tone: 'amber' | 'red' | 'blue' | 'green' }) {
  const t = {
    amber: 'from-amber-500/12 border-amber-500/20 text-amber-400',
    red: 'from-[#E50914]/15 border-[#E50914]/25 text-[#FF2E38]',
    blue: 'from-sky-500/12 border-sky-500/20 text-sky-400',
    green: 'from-emerald-500/12 border-emerald-500/20 text-emerald-400',
  }[tone];
  return (
    <div className={cx('mt-3 rounded-3xl bg-gradient-to-r to-transparent border p-4 sm:p-5', t)}>
      <p className="ip-display text-lg font-black uppercase flex items-center gap-2">{icon} {title}</p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((l) => (
          <li key={l} className="text-sm text-gray-300 flex gap-2"><span className="mt-2 w-1 h-1 rounded-full bg-current shrink-0" />{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-[#121212] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
        initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="ip-display text-2xl font-black uppercase">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center" aria-label="Cerrar"><X className="w-4 h-4" /></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ── Plan semanal / mensual ─────────────────────────────────────────────────

export interface PlanMemo {
  cid: string; prof: Profile; days: number; weeks: 1 | 4; seed: number | null; week: number;
}

function PlanView({ clients, memo, onBack, onOpenDay, onSend, onCopy }: {
  clients: GymClient[];
  memo: React.MutableRefObject<PlanMemo>;
  onBack: () => void;
  onOpenDay: (p: RoutineParams, clientId: string | null) => void;
  onSend: (phone: string, text: string) => void;
  onCopy: (text: string) => void;
}) {
  const m = memo.current;
  const [cid, setCid] = useState<string>(m.cid);
  const [prof, setProf] = useState<Profile>(m.prof);
  const [days, setDays] = useState(m.days);
  const [weeks, setWeeks] = useState<1 | 4>(m.weeks);
  const [seed, setSeed] = useState<number | null>(m.seed);
  const [week, setWeek] = useState(m.week);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const client = clients.find((c) => c.id === cid) ?? null;

  // Conserva el plan al abrir un día y regresar
  useEffect(() => {
    memo.current = { cid, prof, days, weeks, seed, week };
  }, [memo, cid, prof, days, weeks, seed, week]);

  const plan = useMemo(
    () => (seed == null ? null : generatePlan({ ...prof, name: client?.name, date: todayISO() }, days, weeks, seed)),
    [seed, prof, days, weeks, client],
  );
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setProf((p) => ({ ...p, [k]: v }));
  const mainLift = plan?.[0].days[0].routine.items[0];

  return (
    <div className="pt-5">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition mb-4">
        <ChevronLeft className="w-4 h-4" /> Inicio
      </button>
      <SectionTitle kicker="Periodización" title="Plan semanal y mensual" sub="Mismo ejercicio base cada semana para medir la progresión; la carga y el volumen cambian según la fase." />

      <div className="rounded-3xl bg-[#121212] border border-white/[0.08] p-4 sm:p-5 space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Cliente</p>
          <div className="flex gap-2 overflow-x-auto ip-noscroll pb-1">
            <Chip active={cid === 'none'} onClick={() => { setCid('none'); setProf(DEFAULT_PROFILE); }}>Sin registrar</Chip>
            {clients.map((c) => (
              <Chip key={c.id} active={cid === c.id} onClick={() => { setCid(c.id); setProf(c.profile); }}>{c.name}</Chip>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Días por semana</p>
            <div className="flex gap-2">
              {[2, 3, 4, 5, 6].map((d) => (
                <button key={d} onClick={() => setDays(d)} className={cx('flex-1 h-12 rounded-xl border ip-display text-2xl font-black transition', days === d ? 'bg-[#E50914] border-[#E50914]' : 'bg-white/[0.03] border-white/10 text-gray-400')}>{d}</button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1.5">División: <span className="text-gray-300 font-semibold">{SPLITS[days].name}</span></p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Duración</p>
            <div className="flex gap-2">
              <Chip active={weeks === 1} onClick={() => setWeeks(1)} className="flex-1">1 semana</Chip>
              <Chip active={weeks === 4} onClick={() => setWeeks(4)} className="flex-1">Mes (4 semanas)</Chip>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Objetivo</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(GOAL_INFO) as Goal[]).map((g) => <Chip key={g} active={prof.goal === g} onClick={() => set('goal', g)}>{GOAL_INFO[g].label}</Chip>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Nivel</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(LEVEL_INFO) as Level[]).map((l) => <Chip key={l} active={prof.level === l} onClick={() => set('level', l)}>{LEVEL_INFO[l].label}</Chip>)}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Min por sesión</p>
            <div className="flex gap-1.5">
              {[45, 60, 75, 90].map((t) => <Chip key={t} active={prof.time === t} onClick={() => set('time', t)} className="flex-1 px-2">{t}</Chip>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Sexo</p>
            <div className="flex gap-1.5">
              {(['h', 'm'] as Sex[]).map((s) => <Chip key={s} active={prof.sex === s} onClick={() => set('sex', s)} className="flex-1 px-2">{s === 'h' ? 'H' : 'M'}</Chip>)}
            </div>
          </div>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Peso (kg)</span>
            <input type="number" inputMode="decimal" value={prof.bw ?? ''} onChange={(e) => set('bw', e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional" className="mt-2 w-full h-10 px-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E50914] outline-none text-white" />
          </label>
        </div>
        <button onClick={() => { setSeed(newSeed()); setWeek(0); setOpenDay(0); }} className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B20710] ip-display text-xl font-black uppercase flex items-center justify-center gap-2 active:scale-[0.98] transition">
          <Sparkles className="w-5 h-5" /> {plan ? 'Regenerar plan' : 'Generar plan'}
        </button>
      </div>

      {plan && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          {weeks === 4 && (
            <div className="rounded-3xl bg-[#121212] border border-white/[0.08] p-4 sm:p-5">
              <p className="ip-display text-lg font-black uppercase flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#FF2E38]" /> Mesociclo de 4 semanas</p>
              <div className="grid grid-cols-4 gap-2 mt-4 items-end h-40">
                {PHASES.map((ph, i) => (
                  <button key={ph.name} onClick={() => { setWeek(i); setOpenDay(0); }} className="flex flex-col items-center justify-end h-full gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 tabular-nums">{ph.intensity}%</span>
                    <motion.span
                      className={cx('w-full rounded-t-xl', week === i ? 'bg-gradient-to-t from-[#B20710] to-[#FF2E38]' : i === 3 ? 'bg-sky-500/30' : 'bg-white/10')}
                      initial={{ height: 0 }}
                      animate={{ height: `${(ph.intensity / 90) * 100}%` }}
                      transition={{ delay: i * 0.08, type: 'spring', damping: 18 }}
                    />
                    <span className={cx('text-[10px] sm:text-xs font-bold uppercase', week === i ? 'text-white' : 'text-gray-500')}>S{i + 1}</span>
                  </button>
                ))}
              </div>
              {mainLift && (
                <div className="mt-4 rounded-2xl bg-black/40 border border-white/[0.06] p-3 overflow-x-auto">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-2">Progresión · {mainLift.exercise.name}</p>
                  <div className="grid grid-cols-4 gap-2 min-w-[300px]">
                    {plan.map((w) => {
                      const it = w.days[0].routine.items[0];
                      return (
                        <div key={w.index} className={cx('rounded-xl p-2 text-center', week === w.index ? 'bg-[#E50914]/15 border border-[#E50914]/30' : 'bg-white/[0.03]')}>
                          <p className="text-[10px] text-gray-500 font-bold">S{w.index + 1}</p>
                          <p className="ip-display text-base font-black text-white leading-tight">{it.loadLabel}</p>
                          <p className="text-[10px] text-gray-400">{it.sets}×{it.reps} · RIR {it.rir}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto ip-noscroll mt-5 pb-1">
            {plan.map((w) => (
              <Chip key={w.index} active={week === w.index} onClick={() => { setWeek(w.index); setOpenDay(0); }}>
                {weeks === 4 ? `Semana ${w.index + 1} · ${w.phase?.name}` : 'Esta semana'}
              </Chip>
            ))}
          </div>
          {plan[week].phase && <p className="text-sm text-gray-400 mt-2">{plan[week].phase!.desc}</p>}

          <div className="space-y-2.5 mt-4">
            {plan[week].days.map((d, i) => {
              const open = openDay === i;
              return (
                <div key={d.label + i} className="rounded-3xl bg-[#121212] border border-white/[0.08] overflow-hidden">
                  <button onClick={() => setOpenDay(open ? null : i)} className="w-full flex items-center gap-3 p-4 text-left">
                    <span className="ip-display w-14 shrink-0 text-center">
                      <span className="block text-[10px] uppercase tracking-widest text-gray-500">Día {i + 1}</span>
                      <span className="block text-lg font-black text-white uppercase leading-none">{d.label.slice(0, 3)}</span>
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="ip-display block text-xl font-black uppercase text-white truncate">{d.routine.title}</span>
                      <span className="block text-xs text-gray-500">{d.routine.items.length} ejercicios · {d.routine.minutes} min</span>
                    </span>
                    <ChevronDown className={cx('w-5 h-5 text-gray-500 transition', open && 'rotate-180')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4">
                          <div className="divide-y divide-white/[0.06] rounded-2xl bg-black/30 border border-white/[0.06]">
                            {d.routine.items.map((it) => (
                              <div key={it.block} className="flex items-center gap-3 px-3 py-2.5">
                                <span className="ip-display w-8 text-center font-black text-[#FF2E38]">{it.block}</span>
                                <span className="flex-1 min-w-0">
                                  <span className="block text-sm font-semibold text-white truncate">{it.exercise.name}</span>
                                  <span className="block text-xs text-gray-500">{it.sets}×{it.reps} · desc. {fmtRest(it.rest)} · RIR {it.rir}</span>
                                </span>
                                <span className="ip-display text-base font-black text-white shrink-0">{it.loadLabel}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => onOpenDay(d.routine.params, client?.id ?? null)} className="mt-3 w-full h-11 rounded-xl bg-white/5 border border-white/10 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition">
                            <Timer className="w-4 h-4" /> Abrir con temporizador y enviar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-5">
            <button
              onClick={() => onSend(client?.phone ?? '', planWhatsApp(plan, week, SPLITS[days].name, C.shortName, client?.name))}
              className="h-14 rounded-2xl bg-[#25D366] text-black font-black flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <MessageCircle className="w-5 h-5" /> Enviar {weeks === 4 ? `semana ${week + 1}` : 'semana'} por WhatsApp
            </button>
            <button onClick={() => onCopy(planWhatsApp(plan, week, SPLITS[days].name, C.shortName, client?.name))} className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center" aria-label="Copiar plan">
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Fin del entrenamiento (cliente) ────────────────────────────────────────

function Done({ routine, onBack, onNotify }: { routine: Routine; onBack: () => void; onNotify: (text: string) => void }) {
  const sets = routine.items.reduce((s, i) => s + i.sets, 0);
  const volume = routine.items.reduce((s, i) => s + (i.load ?? 0) * i.repsNum * i.sets * (i.exercise.eq === 'mancuerna' && !i.exercise.single ? 2 : 1), 0);
  const name = routine.params.name;
  const text = `💪 *¡Rutina terminada!*${name ? `\nSoy ${name}.` : ''}\nCompleté: *${routine.title}*\n• ${routine.items.length} ejercicios · ${sets} series\n${volume ? `• Volumen total: ${Math.round(volume).toLocaleString('es-MX')} kg\n` : ''}• ${routine.minutes} min\n\n¿Qué me toca mañana, coach?`;
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center pt-8">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_80px_rgba(245,158,11,.45)]"
      >
        <Trophy className="w-14 h-14 text-black" />
      </motion.div>
      <h1 className="ip-display text-5xl font-black uppercase mt-6">¡Bestial!</h1>
      <p className="text-gray-400 mt-2">Rutina completada. Así se forja la ciudad de hierro.</p>
      <div className="grid grid-cols-3 gap-2.5 mt-6 w-full max-w-sm">
        <Stat label="Ejercicios" value={String(routine.items.length)} />
        <Stat label="Series" value={String(sets)} />
        <Stat label="Volumen" value={volume ? `${Math.round(volume / 100) / 10} t` : '—'} />
      </div>
      <button onClick={() => onNotify(text)} className="mt-7 w-full max-w-sm h-14 rounded-2xl bg-[#25D366] text-black font-black flex items-center justify-center gap-2 active:scale-[0.98] transition">
        <MessageCircle className="w-5 h-5" /> Avisar a mi coach
      </button>
      <button onClick={onBack} className="mt-3 text-sm text-gray-400 hover:text-white">Volver a la rutina</button>
    </div>
  );
}

// ── Footer y aviso de privacidad ───────────────────────────────────────────

function Footer({ onPrivacy }: { onPrivacy: () => void }) {
  return (
    <footer className="border-t border-white/[0.06] bg-[#070707]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#E50914]" />
            <p className="ip-display text-lg font-black uppercase leading-none">{C.businessName}</p>
          </div>
          <p className="text-gray-500 mt-3 leading-relaxed flex gap-2"><MapPin className="w-4 h-4 shrink-0 mt-0.5" /> {C.address}</p>
          <a href={C.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-[#FF2E38] font-semibold">Cómo llegar →</a>
        </div>
        <div>
          <p className="ip-display text-sm font-black uppercase tracking-widest text-gray-400">Horario</p>
          <ul className="mt-3 space-y-1.5 text-gray-500">
            {C.hours.map((h) => <li key={h} className="flex gap-2"><Clock className="w-4 h-4 shrink-0 mt-0.5" /> {h}</li>)}
          </ul>
        </div>
        <div>
          <p className="ip-display text-sm font-black uppercase tracking-widest text-gray-400">Contacto</p>
          <ul className="mt-3 space-y-1.5 text-gray-500">
            <li className="flex gap-2"><Phone className="w-4 h-4 shrink-0 mt-0.5" /> {C.phoneNumberFormatted}</li>
            <li><a href={C.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram {C.instagramHandle}</a></li>
            <li><a href={C.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook Strong Gym</a></li>
            <li><button onClick={onPrivacy} className="hover:text-white underline underline-offset-2">Aviso de privacidad</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06] py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-center text-xs text-gray-600 px-4">
        <p>Las rutinas son orientativas. Consulta a tu coach o médico si tienes alguna condición de salud.</p>
        <p className="mt-2">
          Diseñado por{' '}
          <a href="https://imagineandstamp.site" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400 hover:text-white">IMAGINE &amp; STAMP</a>
        </p>
      </div>
    </footer>
  );
}

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <Sheet title="Aviso de privacidad" onClose={onClose}>
      <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
        <p>{C.businessName}, con domicilio en {C.address}, es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).</p>
        <p>Usamos tu nombre, WhatsApp, peso corporal, nivel e historial de entrenamiento únicamente para programar tus rutinas y darte seguimiento. No compartimos tus datos con terceros.</p>
        <p>Puedes ejercer tus derechos ARCO (acceso, rectificación, cancelación y oposición) escribiendo a {C.email} o al WhatsApp {C.phoneNumberFormatted}.</p>
      </div>
    </Sheet>
  );
}
