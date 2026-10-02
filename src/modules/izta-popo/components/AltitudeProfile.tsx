import React from 'react';
import { PISOS_ECOLOGICOS, PisoEcologicoId } from '../data/flora';
import { Mountain, ArrowUp } from 'lucide-react';

interface AltitudeProfileProps {
  activePiso: PisoEcologicoId | null;
  onSelectPiso: (pisoId: PisoEcologicoId) => void;
  currentAltitude?: number;
}

export const AltitudeProfile: React.FC<AltitudeProfileProps> = ({
  activePiso,
  onSelectPiso,
  currentAltitude = 3800,
}) => {
  // Conversión de altitud (2500m - 5400m) a porcentaje Y (de abajo hacia arriba)
  const altMin = 2500;
  const altMax = 5400;
  const getYPercent = (alt: number) => {
    const clamped = Math.max(altMin, Math.min(altMax, alt));
    return 100 - ((clamped - altMin) / (altMax - altMin)) * 100;
  };

  const markerY = getYPercent(currentAltitude);

  return (
    <div className="w-full bg-[#141615] rounded-3xl p-6 border border-white/10 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#F2F1EC] flex items-center gap-2">
            <Mountain className="w-5 h-5 text-[#E8A15A]" />
            Perfil Altitudinal & Pisos Ecológicos
          </h3>
          <p className="text-xs text-[#9AA3A0]">
            Gradiente biológico desde los bosques templados hasta las nieves de 5,400 m.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-[#E8A15A] font-bold">
          Altitud activa: {currentAltitude.toLocaleString()} m
        </div>
      </div>

      {/* SVG Interactivo de la Montaña */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden rounded-2xl bg-gradient-to-b from-[#0E0F0F] to-[#1A1C1B] border border-white/5">
        <svg
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            {/* Gradientes por piso */}
            <linearGradient id="grad-alpino" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8FC1D4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8FC1D4" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="grad-zacatonal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B88A4A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B88A4A" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="grad-pino" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3F6B4F" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#3F6B4F" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="grad-oyamel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A4D35" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2A4D35" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Silueta de la Montaña (Curva de los Volcanes Izta y Popo) */}
          {/* Piso 4: Alpino (4,300 - 5,400 m) -> Y: 30 a 140 */}
          <path
            d="M 150 400 L 150 140 Q 250 80, 360 40 Q 450 70, 520 140 Q 650 90, 780 30 L 850 140 L 850 400 Z"
            fill="url(#grad-alpino)"
          />

          {/* Piso 3: Zacatonal (3,900 - 4,300 m) -> Y: 140 a 220 */}
          <path
            d="M 100 400 L 100 220 Q 250 160, 520 140 Q 750 170, 900 220 L 900 400 Z"
            fill="url(#grad-zacatonal)"
          />

          {/* Piso 2: Pino de Altura (3,500 - 4,000 m) -> Y: 220 a 300 */}
          <path
            d="M 50 400 L 50 300 Q 300 240, 500 220 Q 700 240, 950 300 L 950 400 Z"
            fill="url(#grad-pino)"
          />

          {/* Piso 1: Oyamel (2,800 - 3,500 m) -> Y: 300 a 400 */}
          <path
            d="M 0 400 L 0 340 Q 350 310, 500 300 Q 650 310, 1000 340 L 1000 400 Z"
            fill="url(#grad-oyamel)"
          />

          {/* Líneas divisorias de cota altimétrica */}
          <line x1="0" y1="120" x2="1000" y2="120" stroke="#8FC1D4" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
          <line x1="0" y1="200" x2="1000" y2="200" stroke="#B88A4A" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
          <line x1="0" y1="290" x2="1000" y2="290" stroke="#3F6B4F" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
        </svg>

        {/* Marcador Scrollytelling de Altitud */}
        <div
          className="absolute inset-x-0 border-t-2 border-[#E8A15A] transition-all duration-300 pointer-events-none flex items-center justify-between px-4"
          style={{ top: `${markerY}%` }}
        >
          <div className="flex items-center gap-1.5 -mt-3.5 px-2.5 py-0.5 rounded-full bg-[#E8A15A] text-black text-[10px] font-mono font-bold shadow-lg">
            <ArrowUp className="w-3 h-3" />
            <span>{currentAltitude} m</span>
          </div>
          <span className="text-[10px] font-mono text-[#E8A15A] -mt-3.5 bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
            Nivel explorado
          </span>
        </div>

        {/* Etiquetas Altimétricas en el SVG */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8FC1D4]">
            <span>5,400 m · Cumbre de nieves</span>
            <span>Desierto Alpino</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#B88A4A]">
            <span>4,300 m · Límite de gramíneas</span>
            <span>Pradera Alpina</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#3F6B4F]">
            <span>4,000 m · Límite arbóreo</span>
            <span>Pino de Altura</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>2,800 m · Bosque templado</span>
            <span>Bosque de Oyamel</span>
          </div>
        </div>
      </div>

      {/* Botones de Selección Rápida de Piso */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {PISOS_ECOLOGICOS.map((piso) => {
          const isSelected = activePiso === piso.id;
          return (
            <button
              key={piso.id}
              onClick={() => onSelectPiso(piso.id)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-white/10 border-white text-white shadow-xl scale-[1.02]'
                  : 'bg-black/30 border-white/5 text-[#9AA3A0] hover:text-[#F2F1EC] hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: piso.colorHex }}
                />
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#E8A15A]">
                  {piso.altitudLabel}
                </span>
              </div>
              <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#F2F1EC] leading-tight">
                {piso.nombre}
              </h4>
            </button>
          );
        })}
      </div>
    </div>
  );
};
