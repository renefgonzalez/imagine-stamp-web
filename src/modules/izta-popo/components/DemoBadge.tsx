import React, { useState } from 'react';
import { Info, Sparkles, X } from 'lucide-react';

export const DemoBadge: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div
        onClick={() => setShowTooltip(!showTooltip)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1C1B]/90 hover:bg-[#1A1C1B] border border-white/10 text-xs font-mono tracking-wider text-[#9AA3A0] shadow-xl backdrop-blur-md cursor-pointer transition-all duration-200 select-none group hover:border-[#E8A15A]/40"
      >
        <span className="w-2 h-2 rounded-full bg-[#E8A15A] animate-pulse" />
        <span className="text-[#F2F1EC] font-semibold">DEMO</span>
        <span className="text-white/30">·</span>
        <span className="group-hover:text-white transition-colors">contenido de ejemplo</span>
        <Info className="w-3.5 h-3.5 text-[#9AA3A0] ml-1 group-hover:text-[#E8A15A]" />
      </div>

      {showTooltip && (
        <div className="absolute bottom-10 left-0 w-72 p-4 rounded-xl bg-[#1A1C1B] border border-white/15 text-xs text-[#9AA3A0] shadow-2xl backdrop-blur-xl animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[#F2F1EC] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A15A]" />
              Prototipo de Presentación
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-[#9AA3A0] hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="leading-relaxed">
            Esta es una muestra interactiva para visualizar cómo lucirá el sitio web oficial: mapa 3D con relieve, visor Deep Zoom para fotos de alta resolución, videos 4K y fichas de biodiversidad.
          </p>
          <div className="mt-2.5 pt-2 border-t border-white/10 text-[10px] text-white/50">
            Diseñado para <strong className="text-white/80">Izta-Popo Expediciones</strong>
          </div>
        </div>
      )}
    </div>
  );
};
