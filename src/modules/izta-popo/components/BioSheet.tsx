import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Target, Sparkles, Compass, Maximize2, ExternalLink, ShieldAlert, Leaf } from 'lucide-react';
import { BioMarkerItem } from '../data/bioMarkers';
import { MEDIA_BASE } from '../config';

interface BioSheetProps {
  item: BioMarkerItem | null;
  onClose: () => void;
  onCenter?: (item: BioMarkerItem) => void;
}

export const BioSheet: React.FC<BioSheetProps> = ({ item, onClose, onCenter }) => {
  const [modalFotoOpen, setModalFotoOpen] = useState(false);

  if (!item) return null;

  const foto1280 = `${MEDIA_BASE}/fotos/${item.fotoId}-1280.webp`;
  const foto2560 = `${MEDIA_BASE}/fotos/${item.fotoId}-2560.webp`;

  return (
    <>
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 z-30 animate-fade-in-up">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141615]/95 border border-white/20 shadow-2xl backdrop-blur-2xl text-[#F2F1EC]">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full bg-black/75 text-[#9AA3A0] hover:text-white hover:bg-black transition-colors shadow-md"
            aria-label="Cerrar ficha botánica"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Imagen de cabecera en Alta Resolución */}
          <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-black group">
            <img
              src={foto1280}
              alt={item.nombreComun}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `${MEDIA_BASE}/fotos/bosque-hartwegii-1280.webp`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141615] via-black/30 to-transparent" />

            {/* Botón flotante para ver en Ultra-Calidad 2560 */}
            <button
              onClick={() => setModalFotoOpen(true)}
              className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90 hover:text-white hover:bg-black/90 flex items-center gap-1 transition-colors"
              title="Ver en Ultra-Calidad (2560px WebP)"
            >
              <Maximize2 className="w-3 h-3 text-[#E8A15A]" />
              <span>Ultra-HD</span>
            </button>

            {/* Badges sobre la foto */}
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold text-black backdrop-blur-md flex items-center gap-1.5 shadow-md"
                style={{ backgroundColor: item.colorHex }}
              >
                <span>{item.iconoEmoji}</span>
                <span>{item.tipo === 'flora' ? 'FLORA SILVESTRE' : 'FAUNA NATIVA'}</span>
              </span>

              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-mono font-bold text-[#E8A15A]">
                {item.altitud.toLocaleString()} m
              </span>
            </div>
          </div>

          {/* Contenido de la Ficha */}
          <div className="p-4 sm:p-5 space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#F2F1EC] leading-tight">
                    {item.nombreComun}
                  </h3>
                  <p className="text-xs sm:text-sm italic text-[#E8A15A] font-serif mt-0.5">
                    {item.nombreCientifico}
                  </p>
                </div>
                {onCenter && (
                  <button
                    type="button"
                    onClick={() => onCenter(item)}
                    className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-[#E8A15A] hover:text-black text-[#E8A15A] transition-colors shrink-0"
                    title="Centrar relieve 3D en esta coordenada"
                  >
                    <Target className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Rango de Altitud y Piso */}
              <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#9AA3A0]">
                <Compass className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{item.piso}</span>
                <span>•</span>
                <span>{item.altitudLabel}</span>
              </div>
            </div>

            {/* Aviso de Conservación o Floración */}
            {item.estadoLabel && (
              <div className="p-2 sm:p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center gap-2 text-[11px] text-purple-200">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="font-medium">{item.estadoLabel}</span>
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#C0C8C4] space-y-1">
              <div className="font-mono text-[10px] text-[#E8A15A] uppercase tracking-wider">
                {item.floracionODieta}
              </div>
              <p className="text-xs text-[#9AA3A0] leading-relaxed line-clamp-3">
                "{item.datoCurioso}"
              </p>
            </div>

            {/* Enlace al catálogo botánico */}
            <div className="pt-1 flex items-center justify-between gap-2">
              <Link
                to="/izta-popo/flora"
                className="w-full py-2 px-3 rounded-xl bg-[#34D399]/15 hover:bg-[#34D399]/25 border border-[#34D399]/30 text-[#34D399] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Leaf className="w-3.5 h-3.5" />
                <span>Explorar Perfil Altitudinal</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pantalla Completa Ultra-HD */}
      {modalFotoOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setModalFotoOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setModalFotoOpen(false)}
              className="absolute -top-12 right-0 p-2 text-[#9AA3A0] hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={foto2560}
              alt={item.nombreComun}
              className="max-h-[80vh] w-auto object-contain rounded-2xl border border-white/15 shadow-2xl"
            />
            <div className="mt-3 text-center text-xs font-mono text-[#9AA3A0]">
              <span className="text-white font-bold">{item.nombreComun}</span> ({item.nombreCientifico}) · WebP Ultra-Calidad 94%
            </div>
          </div>
        </div>
      )}
    </>
  );
};
