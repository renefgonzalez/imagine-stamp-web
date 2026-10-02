import React, { useState } from 'react';
import { Plus, Image, Video, MapPin, Check, Save, Layers, Calendar, Mountain, HeartHandshake } from 'lucide-react';

export const AdminMockup: React.FC = () => {
  const [guardado, setGuardado] = useState(false);

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-[#141615] border border-white/10 shadow-2xl text-[#F2F1EC]">
      {/* Barra de cabecera del Admin */}
      <div className="px-6 py-4 border-b border-white/10 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-mono text-[#9AA3A0]">
            admin.conocimientodelamontana.org / nueva-jornada
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-[10px] font-mono font-bold">
          VISTA PREVIA DE PANEL
        </span>
      </div>

      {/* Contenido del formulario de administración */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#F2F1EC] flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-[#E8A15A]" />
              <span>Registrar Nueva Jornada</span>
            </h4>
            <p className="text-xs text-[#9AA3A0]">
              Completa los datos de tu última jornada de voluntariado o conservación. El mapa y la bitácora se actualizarán automáticamente.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setGuardado(true)}
            className="px-5 py-2.5 rounded-xl bg-[#E8A15A] hover:bg-[#f0b070] text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#E8A15A]/20"
          >
            {guardado ? <Check className="w-4 h-4 text-emerald-900" /> : <Save className="w-4 h-4" />}
            <span>{guardado ? '¡Publicado en el sitio!' : 'Publicar jornada'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Título de la Jornada</label>
            <input
              type="text"
              readOnly
              value="Saneamiento de cañadas y reforestación en La Joya"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Tipo de Actividad</label>
            <input
              type="text"
              readOnly
              value="Limpieza de parajes / Reforestación comunitaria"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Fecha y Ubicación</label>
            <input
              type="text"
              readOnly
              value="24 de Octubre, 2026 — La Joya (3,950 m)"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Logro / Impacto Ambiental</label>
            <input
              type="text"
              readOnly
              value="25 voluntarios · 180 kg retirados · 50 oyameles plantados"
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-[#E8A15A] focus:outline-none"
            />
          </div>
        </div>

        {/* Zona simulada de arrastrar fotos */}
        <div className="p-8 rounded-2xl border-2 border-dashed border-white/15 bg-black/30 text-center space-y-2">
          <Image className="w-8 h-8 text-[#9AA3A0] mx-auto" />
          <p className="text-xs text-white font-medium">
            Arrastra aquí las fotos tomadas en la jornada
          </p>
          <p className="text-[11px] text-[#9AA3A0]">
            El sistema extrae los metadatos GPS EXIF y ubica la actividad en el mapa satelital.
          </p>
        </div>
      </div>
    </div>
  );
};
