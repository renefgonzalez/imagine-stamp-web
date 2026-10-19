import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Minus, Plus, SkipForward, Timer } from 'lucide-react';

interface Props {
  seconds: number;
  label: string;
  onClose: () => void;
}

function beep() {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    [0, 0.25, 0.5].forEach((t, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = i === 2 ? 1320 : 880;
      g.gain.setValueAtTime(0.25, ctx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.2);
    });
  } catch {
    /* sin audio */
  }
  try {
    navigator.vibrate?.([200, 100, 200]);
  } catch {
    /* sin vibración */
  }
}

export default function RestTimer({ seconds, label, onClose }: Props) {
  const [total, setTotal] = useState(seconds);
  const [left, setLeft] = useState(seconds);
  const done = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (left === 0 && !done.current) {
      done.current = true;
      beep();
      const t = window.setTimeout(onClose, 1400);
      return () => window.clearTimeout(t);
    }
  }, [left, onClose]);

  const adjust = (d: number) => {
    setLeft((l) => Math.max(1, l + d));
    setTotal((t) => Math.max(1, t + d));
  };

  const R = 88;
  const C = 2 * Math.PI * R;
  const pct = left / total;
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full sm:max-w-sm bg-[#121212] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-center"
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mb-4 sm:hidden" />
        <p className="ip-display text-xs tracking-[0.3em] text-red-400 uppercase flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" /> Descanso
        </p>
        <p className="text-gray-400 text-sm mt-1 truncate">Siguiente: {label}</p>

        <div className="relative w-56 h-56 mx-auto my-5">
          <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
            <circle cx="100" cy="100" r={R} stroke="#262626" strokeWidth="12" fill="none" />
            <circle
              cx="100" cy="100" r={R}
              stroke={left === 0 ? '#22C55E' : '#E50914'}
              strokeWidth="12" fill="none" strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke .3s', filter: 'drop-shadow(0 0 10px rgba(229,9,20,.5))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="ip-display text-6xl font-black text-white tabular-nums">{left === 0 ? '¡YA!' : `${mm}:${ss}`}</span>
            {left > 0 && <span className="text-xs text-gray-500 mt-1">de {Math.floor(total / 60)}:{String(total % 60).padStart(2, '0')}</span>}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button onClick={() => adjust(-15)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition" aria-label="Restar 15 segundos">
            <Minus className="w-5 h-5" /><span className="sr-only">15</span>
          </button>
          <button onClick={onClose} className="h-14 px-6 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#B20710] text-white font-bold flex items-center gap-2 active:scale-95 transition shadow-lg shadow-red-950/50">
            <SkipForward className="w-5 h-5" /> Saltar
          </button>
          <button onClick={() => adjust(15)} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-95 transition" aria-label="Sumar 15 segundos">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
