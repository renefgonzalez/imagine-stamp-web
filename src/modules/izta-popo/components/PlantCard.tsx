import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, RotateCw, MapPin, Maximize2, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Planta } from '../data/flora';
import { MEDIA_BASE } from '../config';
import { DeepZoomViewer } from './DeepZoomViewer';

interface PlantCardProps {
  planta: Planta;
}

export const PlantCard: React.FC<PlantCardProps> = ({ planta }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeepZoom, setShowDeepZoom] = useState(false);
  const [fotoIndex, setFotoIndex] = useState(0);

  const fotosList = planta.fotos && planta.fotos.length > 0 ? planta.fotos : [planta.fotoId];
  const activeFotoId = fotosList[fotoIndex] || planta.fotoId;
  const fotoUrl = `${MEDIA_BASE}/fotos/${activeFotoId}-1280.webp`;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoIndex((prev) => (prev + 1) % fotosList.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFotoIndex((prev) => (prev - 1 + fotosList.length) % fotosList.length);
  };

  const handleSelectPhoto = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setFotoIndex(index);
  };

  // Badge de reino con color representativo
  const reinoLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
    flora: { label: 'Flora Nativa', bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    funga: { label: 'Funga (Hongos)', bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/40' },
    musgos: { label: 'Musgos & Briófitas', bg: 'bg-lime-500/20', text: 'text-lime-300', border: 'border-lime-500/40' },
    liquenes: { label: 'Líquenes', bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
  };

  const reinoInfo = reinoLabels[planta.reino || 'flora'] || reinoLabels.flora;

  return (
    <>
      <div
        className="relative h-[430px] w-full perspective-1000 select-none group cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ======================================================== */}
          {/* FRENTE DE LA TARJETA */}
          {/* ======================================================== */}
          <div className="absolute inset-0 backface-hidden rounded-3xl overflow-hidden bg-[#1A1C1B] border border-white/10 shadow-xl flex flex-col justify-between">
            {/* Contenedor de Imagen a Sangre Completa */}
            <div className="relative w-full h-full overflow-hidden bg-black">
              <img
                src={fotoUrl}
                alt={`${planta.nombreComun} - Foto ${fotoIndex + 1}`}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.onerror = null;
                  el.src = `${MEDIA_BASE}/fotos/bosque-hartwegii-1280.webp`;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25" />

              {/* Badges Superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-[#E8A15A]">
                    {planta.altitudMin.toLocaleString()} - {planta.altitudMax.toLocaleString()} m
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-semibold ${reinoInfo.bg} ${reinoInfo.border} ${reinoInfo.text}`}>
                    {reinoInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {fotosList.length > 1 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#E8A15A]/40 text-[#E8A15A] text-[10px] font-mono font-bold shadow-lg">
                      <Images className="w-3 h-3" />
                      {fotoIndex + 1}/{fotosList.length} fotos
                    </span>
                  )}
                  {planta.esDeepZoom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeepZoom(true);
                      }}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8A15A] hover:bg-[#f3b578] text-black text-[9px] font-mono font-bold shadow-lg transition-transform hover:scale-105"
                      title="Explorar con Deep Zoom"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      ZOOM
                    </button>
                  )}
                </div>
              </div>

              {/* Controles de Navegación de Fotos (Flechas) */}
              {fotosList.length > 1 && (
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-black/75 hover:bg-[#E8A15A] text-white hover:text-black border border-white/20 hover:border-[#E8A15A] transition-all flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95"
                    title="Foto anterior de la misma especie"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="pointer-events-auto w-8 h-8 rounded-full bg-black/75 hover:bg-[#E8A15A] text-white hover:text-black border border-white/20 hover:border-[#E8A15A] transition-all flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95"
                    title="Siguiente foto de la misma especie"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Indicador de Mini-Puntos Táctiles de Fotos */}
              {fotosList.length > 1 && (
                <div className="absolute bottom-28 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-auto">
                  {fotosList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleSelectPhoto(e, idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === fotoIndex
                          ? 'w-6 bg-[#E8A15A] shadow-md'
                          : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Ver foto ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Título y Datos en la Base del Frente */}
              <div className="absolute inset-x-0 bottom-0 p-5 z-10 bg-gradient-to-t from-black via-black/90 to-transparent">
                <h4 className="font-serif text-xl font-bold text-[#F2F1EC] leading-tight mb-1 group-hover:text-[#E8A15A] transition-colors line-clamp-1">
                  {planta.nombreComun}
                </h4>
                <p className="text-xs text-[#9AA3A0] italic line-clamp-1">
                  {planta.nombreCientifico}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#9AA3A0] pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5 line-clamp-1">
                    <Calendar className="w-3.5 h-3.5 text-[#E8A15A] shrink-0" />
                    <span>{planta.floracion}</span>
                  </span>
                  <span className="text-[#E8A15A] flex items-center gap-1 font-mono text-[10px] shrink-0 ml-2 font-semibold">
                    <RotateCw className="w-3 h-3" />
                    Ver ficha
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* REVERSO DE LA TARJETA (DATOS BOTÁNICOS) */}
          {/* ======================================================== */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 bg-gradient-to-b from-[#1E211F] to-[#141615] border border-[#E8A15A]/30 shadow-2xl flex flex-col justify-between text-[#F2F1EC]">
            <div>
              {/* Encabezado del Reverso */}
              <div className="flex items-start justify-between mb-3 pb-3 border-b border-white/10">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold mb-1 border ${reinoInfo.bg} ${reinoInfo.border} ${reinoInfo.text}`}>
                    {reinoInfo.label}
                  </span>
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
                    className="p-2 rounded-xl bg-[#E8A15A] text-black hover:bg-[#f3b578] transition-colors shrink-0 shadow-md ml-2"
                    title="Explorar con Deep Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tira de Miniaturas de Fotos de esta Especie */}
              {fotosList.length > 1 && (
                <div className="mb-3 p-2 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#9AA3A0] mb-1.5">
                    <span>Fotos registradas de esta especie:</span>
                    <span className="text-[#E8A15A] font-bold">{fotoIndex + 1} de {fotosList.length}</span>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    {fotosList.map((fId, idx) => (
                      <button
                        key={fId}
                        type="button"
                        onClick={(e) => handleSelectPhoto(e, idx)}
                        className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          idx === fotoIndex ? 'border-[#E8A15A] scale-105 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={`${MEDIA_BASE}/fotos/${fId}-480.webp`}
                          alt={`Toma ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ficha Técnica Botánica */}
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase">Rango de Altitud</span>
                  <p className="font-mono text-xs text-[#8FC1D4] font-semibold">
                    {planta.altitudMin.toLocaleString()} m — {planta.altitudMax.toLocaleString()} m s.n.m.
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase">Ciclo de Floración / Esporulación</span>
                  <p className="text-xs text-[#F2F1EC]/90 leading-snug">
                    {planta.floracion}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase">Adaptación / Dato Biológico</span>
                  <p className="text-xs text-[#F2F1EC]/90 leading-relaxed line-clamp-3">
                    {planta.datoCurioso}
                  </p>
                </div>
              </div>
            </div>

            {/* Enlace a Lugares y Volver */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#9AA3A0] uppercase block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#E8A15A]" />
                  Observada en:
                </span>
                <div className="flex flex-wrap gap-1">
                  {planta.lugares.map((lugId) => (
                    <Link
                      key={lugId}
                      to={`/izta-popo/lugar/${lugId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-[#E8A15A] hover:text-black text-[9px] font-mono text-white transition-colors"
                    >
                      #{lugId}
                    </Link>
                  ))}
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#E8A15A] flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                Volver
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Deep Zoom */}
      {showDeepZoom && (
        <DeepZoomViewer
          fotoId={activeFotoId}
          alt={planta.nombreComun}
          megapixeles={planta.megapixeles || 40}
          onClose={() => setShowDeepZoom(false)}
        />
      )}
    </>
  );
};
