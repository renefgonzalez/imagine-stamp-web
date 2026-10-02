import React from 'react';
import { Zap, Film, Gem } from 'lucide-react';
import { useQuality, QualityMode } from '../context/QualityContext';

interface QualitySwitchProps {
  compact?: boolean;
}

export const QualitySwitch: React.FC<QualitySwitchProps> = ({ compact = false }) => {
  const { mode, setMode } = useQuality();

  const options: { id: QualityMode; label: string; icon: React.ComponentType<{ className?: string }>; detail: string }[] = [
    {
      id: 'ligero',
      label: 'Ligero',
      icon: Zap,
      detail: '720p / WebP 1280 (Ahorro de datos)',
    },
    {
      id: 'alta',
      label: 'Alta calidad',
      icon: Film,
      detail: '1080p-4K / Deep Zoom activo',
    },
    {
      id: 'original',
      label: 'Original 4K',
      icon: Gem,
      detail: 'Máxima resolución sin recomprimir',
    },
  ];

  return (
    <div
      role="group"
      aria-label="Selector de Modo de vista y calidad"
      className="inline-flex items-center p-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = mode === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            title={opt.detail}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 select-none ${
              isActive
                ? 'bg-[#E8A15A] text-[#0E0F0F] font-semibold shadow-md shadow-[#E8A15A]/20 scale-[1.02]'
                : 'text-[#9AA3A0] hover:text-[#F2F1EC] hover:bg-white/5'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0E0F0F]' : 'text-[#E8A15A]'}`} />
            {!compact && <span>{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
