import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Mountain, RotateCw, MapPin, Maximize2 } from 'lucide-react';
import { Planta } from '../data/flora';
import { MEDIA_BASE } from '../config';
import { DeepZoomViewer } from './DeepZoomViewer';

interface PlantCardProps {
  planta: Planta;
}

export const PlantCard: React.FC<PlantCardProps> = ({ planta }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeepZoom, setShowDeepZoom] = useState(false);

  const fotoUrl = `${MEDIA_BASE}/fotos/${planta.fotoId}-1280.webp`;

  return (
    <>
      <div
        className="relative h-96 w-full perspective-1000 select-none group"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRENTE DE LA TARJETA */}
          <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-[#1A1C1B] border border-white/10 shadow-xl flex flex-col justify-between">
            {/* Imagen a sangre */}
            <div className="relative w-full h-full overflow-hidden bg-black">
              <img
                src={fotoUrl}
                alt={planta.nombreComun}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Badges superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-[#E8A15A]">
                  {planta.altitudMin} - {planta.altitudMax} m
                </span>

                {planta.esDeepZoom && (
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E8A15A] text-black text-[10px] font-mono font-bold shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    DEEP ZOOM
                  </span>
                )}
              </div>

              {/* Título en la base del frente */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] font-mono text-[#E8A15A] tracking-wider uppercase mb-1">
                  Flora Nativa
                </p>
                <h4 className="font-serif text-xl font-bold text-[#F2F1EC] leading-tight mb-1">
                  {planta.nombreComun}
                </h4>
                <p className="text-xs text-[#9AA3A0] italic">
                  {planta.nombreCientifico}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#9AA3A0] pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#E8A15A]" />
                    <span>{planta.floracion}</span>
                  </span>
                  <span className="text-[#E8A15A] flex items-center gap-1 font-mono text-[10px]">
                    <RotateCw className="w-3 h-3" />
                    Gira para ver ficha
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* REVERSO DE LA TARJETA (DATOS BOTÁNICOS) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 bg-gradient-to-b from-[#1E211F] to-[#141615] border border-[#E8A15A]/30 shadow-2xl flex flex-col justify-between text-[#F2F1EC]">
            <div>
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#F2F1EC] leading-tight">
                    {planta.nombreComun}
                  </h4>
                  <p className="text-xs text-[#E8A15A] italic font-medium">
                    {planta.nombreCientifico}
                  </p>
                </div>
                {planta.esDeepZoom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeepZoom(true);
                    }}
                    className="p-2 rounded-xl bg-[#E8A15A] text-black hover:bg-[#f3b578] transition-colors shrink-0 shadow-md"
                    title="Explorar con Deep Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Ficha técnica */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase">Rango de Altitud</span>
                  <p className="font-mono text-xs text-[#8FC1D4] font-semibold">
                    {planta.altitudMin.toLocaleString()} m — {planta.altitudMax.toLocaleString()} m
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase">Dato Curioso / Adaptación</span>
                  <p className="text-xs text-[#F2F1EC]/90 leading-relaxed">
                    {planta.datoCurioso}
                  </p>
                </div>
              </div>
            </div>

            {/* Enlace a Lugares donde se observó */}
            <div className="pt-3 border-t border-white/10">
              <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E8A15A]" />
                Observada en:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {planta.lugares.map((lugId) => (
                  <Link
                    key={lugId}
                    to={`/izta-popo/lugar/${lugId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-[#E8A15A] hover:text-black text-[10px] font-mono text-white transition-colors"
                  >
                    #{lugId}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Deep Zoom */}
      {showDeepZoom && (
        <DeepZoomViewer
          fotoId={planta.fotoId}
          alt={planta.nombreComun}
          megapixeles={planta.megapixeles || 40}
          onClose={() => setShowDeepZoom(false)}
        />
      )}
    </>
  );
};
