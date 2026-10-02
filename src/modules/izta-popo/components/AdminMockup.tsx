import React, { useState } from 'react';
import { Plus, Image, Video, MapPin, Check, Save, Layers, Calendar, Mountain } from 'lucide-react';

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
            admin.iztapopo-expediciones.com / nueva-expedicion
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
            <h4 className="font-serif text-xl font-bold text-[#F2F1EC]">
              Registrar Nueva Expedición
            </h4>
            <p className="text-xs text-[#9AA3A0]">
              Completa los datos de tu último ascenso. El mapa y la bitácora se actualizarán automáticamente.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setGuardado(true)}
            className="px-5 py-2.5 rounded-xl bg-[#E8A15A] hover:bg-[#f0b070] text-black font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#E8A15A]/20"
          >
            {guardado ? <Check className="w-4 h-4 text-emerald-900" /> : <Save className="w-4 h-4" />}
            <span>{guardado ? '¡Publicado en el sitio!' : 'Publicar recorrido'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Título del Recorrido</label>
            <input
              type="text"
              readOnly
              value="Ascenso a Los Portillos y Aguja del Glaciar"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Fecha de Visita</label>
            <input
              type="text"
              readOnly
              value="02 de Octubre de 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Altitud Máxima (m)</label>
            <input
              type="text"
              readOnly
              value="4,820 m"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#9AA3A0]">Categoría Principal</label>
            <input
              type="text"
              readOnly
              value="Agua y Glaciares · Ecosistemas de Altura"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Zona de fotos subidas */}
        <div className="space-y-2">
          <label className="text-xs font-mono text-[#9AA3A0]">Fotografías 4K / RAW Adjuntas (3)</label>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
              <Image className="w-5 h-5 mx-auto text-[#E8A15A]" />
              <p className="text-[11px] font-mono text-white truncate">aguja-glaciar-01.raw</p>
              <span className="text-[9px] text-emerald-400 font-mono">DZI 48 MP OK</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
              <Image className="w-5 h-5 mx-auto text-[#E8A15A]" />
              <p className="text-[11px] font-mono text-white truncate">panoramica-amanecer.jpg</p>
              <span className="text-[9px] text-emerald-400 font-mono">DZI 24 MP OK</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
              <Video className="w-5 h-5 mx-auto text-[#8FC1D4]" />
              <p className="text-[11px] font-mono text-white truncate">sobrevuelo-4k.mp4</p>
              <span className="text-[9px] text-[#8FC1D4] font-mono">Bunny HLS OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
