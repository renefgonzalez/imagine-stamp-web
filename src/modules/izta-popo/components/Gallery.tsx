import React, { useState } from 'react';
import { Sparkles, Info, Maximize2 } from 'lucide-react';
import { LugarFoto } from '../data/lugares';
import { DeepZoomViewer } from './DeepZoomViewer';
import { CreditModal } from './CreditModal';
import { useQuality } from '../context/QualityContext';
import { MEDIA_BASE } from '../config';

interface GalleryProps {
  fotos: LugarFoto[];
}

export const Gallery: React.FC<GalleryProps> = ({ fotos }) => {
  const { mode } = useQuality();
  const [activeDeepZoom, setActiveDeepZoom] = useState<LugarFoto | null>(null);
  const [activeCredit, setActiveCredit] = useState<string | null>(null);

  // Determinar tamaño de imagen según el modo de calidad
  const imgSuffix = mode === 'ligero' ? '-1280.webp' : '-2560.webp';

  return (
    <div className="w-full">
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {fotos.map((foto) => {
          const imgSrc = `${MEDIA_BASE}/fotos/${foto.id}${imgSuffix}`;
          return (
            <div
              key={foto.id}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-[#1A1C1B] border border-white/10 hover:border-[#E8A15A]/40 transition-all duration-300"
            >
              <img
                src={imgSrc}
                alt={foto.alt}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Degradado oscuro para legibilidad del texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badges superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#E8A15A]">
                  {foto.megapixeles} MP
                </span>

                {foto.esDeepZoom && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E8A15A]/90 text-black text-[10px] font-mono font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    DEEP ZOOM
                  </span>
                )}
              </div>

              {/* Botón de Crédito Discreto */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCredit(foto.id);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-[#9AA3A0] hover:text-white hover:bg-black/90 transition-colors z-20"
                title="Ver créditos y licencia de autor"
              >
                <Info className="w-3.5 h-3.5" />
              </button>

              {/* Pie de foto y botón de apertura */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-3 z-10">
                <p className="text-xs text-[#F2F1EC] font-medium leading-snug line-clamp-2">
                  {foto.alt}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveDeepZoom(foto)}
                  className="p-2 rounded-xl bg-[#E8A15A] text-black hover:bg-[#f3b578] transition-colors shrink-0 shadow-lg shadow-[#E8A15A]/20"
                  title="Abrir visor interactivo"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Deep Zoom */}
      {activeDeepZoom && (
        <DeepZoomViewer
          fotoId={activeDeepZoom.id}
          alt={activeDeepZoom.alt}
          megapixeles={activeDeepZoom.megapixeles}
          onClose={() => setActiveDeepZoom(null)}
        />
      )}

      {/* Modal de Crédito */}
      {activeCredit && (
        <CreditModal
          fotoId={activeCredit}
          onClose={() => setActiveCredit(null)}
        />
      )}
    </div>
  );
};
