import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, RotateCw, MapPin, Maximize2, ChevronLeft, ChevronRight, Images, ShieldCheck, HeartPulse } from 'lucide-react';
import { Fauna, ESTADO_CONSERVACION_INFO } from '../data/fauna';
import { MEDIA_BASE } from '../config';
import { DeepZoomViewer } from './DeepZoomViewer';

interface FaunaCardProps {
  animal: Fauna;
}

export const FaunaCard: React.FC<FaunaCardProps> = ({ animal }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDeepZoom, setShowDeepZoom] = useState(false);
  const [fotoIndex, setFotoIndex] = useState(0);

  const fotosList = animal.fotos && animal.fotos.length > 0 ? animal.fotos : [animal.fotoId];
  const activeFotoId = fotosList[fotoIndex] || animal.fotoId;
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

  const estadoInfo = ESTADO_CONSERVACION_INFO[animal.estadoConservacion] || ESTADO_CONSERVACION_INFO.LC;

  const grupoLabels: Record<string, { label: string; icon: string }> = {
    mamiferos: { label: 'Mamífero', icon: '🦊' },
    aves: { label: 'Ave Rapaz / Montaña', icon: '🦅' },
    reptiles: { label: 'Reptil Alpino', icon: '🦎' },
    insectos: { label: 'Insecto Polinizador', icon: '🦋' },
    invertebrados: { label: 'Invertebrado de Roca', icon: '🐌' },
  };

  const grupoInfo = grupoLabels[animal.grupo] || { label: 'Fauna', icon: '🐾' };

  return (
    <>
      <div
        className="relative h-[440px] w-full perspective-1000 select-none group cursor-pointer"
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
                alt={`${animal.nombreComun} - Foto ${fotoIndex + 1}`}
                loading="lazy"
                onError={(e) => {
                  const el = e.currentTarget;
                  el.onerror = null;
                  el.src = `${MEDIA_BASE}/fotos/teporingo-1280.webp`;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/25" />

              {/* Badges Superiores */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold text-[#E8A15A]">
                    {animal.altitudMin.toLocaleString()} - {animal.altitudMax.toLocaleString()} m
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-[9px] font-mono font-semibold ${estadoInfo.bg} ${estadoInfo.border} ${estadoInfo.text}`}>
                    {animal.estadoConservacion === 'P' ? '⚠️ En Peligro' : animal.estadoLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 pointer-events-auto">
                  {fotosList.length > 1 && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-[#E8A15A]/40 text-[#E8A15A] text-[10px] font-mono font-bold shadow-lg">
                      <Images className="w-3 h-3" />
                      {fotoIndex + 1}/{fotosList.length} fotos
                    </span>
                  )}
                  {animal.esDeepZoom && (
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

              {/* Controles de Navegación de Fotos (si hay más de 1 foto) */}
              {fotosList.length > 1 && (
                <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none z-20">
                  <button
                    type="button"
                    onClick={handlePrevPhoto}
                    className="p-1.5 rounded-full bg-black/65 hover:bg-black text-white hover:text-[#E8A15A] pointer-events-auto backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
                    title="Foto anterior de la misma especie"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPhoto}
                    className="p-1.5 rounded-full bg-black/65 hover:bg-black text-white hover:text-[#E8A15A] pointer-events-auto backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
                    title="Siguiente foto de la misma especie"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Indicador de Puntos (Dots) si hay más de 1 foto */}
              {fotosList.length > 1 && (
                <div className="absolute bottom-28 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-auto z-10">
                  {fotosList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleSelectPhoto(e, idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        fotoIndex === idx
                          ? 'w-5 bg-[#E8A15A]'
                          : 'w-1.5 bg-white/40 hover:bg-white/80'
                      }`}
                      title={`Ver foto ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contenido Inferior */}
              <div className="absolute inset-x-0 bottom-0 p-5 space-y-1 z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs">{grupoInfo.icon}</span>
                  <span className="text-[11px] font-mono text-[#9AA3A0] uppercase tracking-wider">
                    {grupoInfo.label}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E8A15A] transition-colors leading-snug drop-shadow-md">
                  {animal.nombreComun}
                </h3>
                <p className="font-mono text-xs italic text-[#F2F1EC]/70">
                  {animal.nombreCientifico}
                </p>

                <div className="pt-2 flex items-center justify-between text-[11px] text-[#9AA3A0]">
                  <span className="line-clamp-1 max-w-[200px] text-[10px] text-[#8FC1D4]">
                    {animal.dieta.split('·')[0]}
                  </span>
                  <span className="flex items-center gap-1 text-[#E8A15A] font-mono text-[10px] font-semibold group-hover:underline">
                    <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    Ficha biológica
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* REVERSO DE LA TARJETA (FICHA BIOLÓGICA) */}
          {/* ======================================================== */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl overflow-hidden bg-[#141615] border border-[#E8A15A]/30 p-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {/* Header Reverso */}
              <div className="flex items-start justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{grupoInfo.icon}</span>
                    <span className="text-[10px] font-mono uppercase text-[#E8A15A] tracking-wider font-bold">
                      Ficha Biológica · Izta-Popo
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white leading-tight">
                    {animal.nombreComun}
                  </h4>
                  <p className="font-mono text-[11px] italic text-[#8FC1D4]">
                    {animal.nombreCientifico}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#9AA3A0] hover:text-white transition-colors"
                  title="Volver a la fotografía"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tira de Fotos en Miniatura si hay varias */}
              {fotosList.length > 1 && (
                <div className="space-y-1 bg-black/40 p-2 rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono uppercase text-[#9AA3A0] block">
                    Fotografías disponibles ({fotosList.length}):
                  </span>
                  <div className="flex items-center gap-2">
                    {fotosList.map((fId, idx) => (
                      <button
                        key={fId}
                        type="button"
                        onClick={(e) => handleSelectPhoto(e, idx)}
                        className={`relative w-12 h-10 rounded-lg overflow-hidden border transition-all ${
                          fotoIndex === idx
                            ? 'border-[#E8A15A] ring-2 ring-[#E8A15A]/30 scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
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

              {/* Datos Técnicos y Ecológicos */}
              <div className="space-y-2 text-xs">
                {/* Estatus de Conservación */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-[#E8A15A]" />
                    Estatus de Conservación (NOM-059)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold ${estadoInfo.bg} ${estadoInfo.border} ${estadoInfo.text}`}>
                      {animal.estadoLabel}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9AA3A0] leading-snug">
                    {estadoInfo.desc}
                  </p>
                </div>

                {/* Altitud y Dieta */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-mono text-[#9AA3A0] uppercase block">Altitud</span>
                    <p className="font-mono text-xs text-[#8FC1D4] font-semibold mt-0.5">
                      {animal.altitudMin.toLocaleString()} – {animal.altitudMax.toLocaleString()} m
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-[9px] font-mono text-[#9AA3A0] uppercase block">Grupo</span>
                    <p className="font-mono text-xs text-white capitalize mt-0.5">
                      {animal.grupo}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase flex items-center gap-1">
                    <HeartPulse className="w-3 h-3 text-[#E8A15A]" />
                    Alimentación & Nicho
                  </span>
                  <p className="text-[11px] text-[#F2F1EC]/90 leading-tight">
                    {animal.dieta}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-[#E8A15A] uppercase font-bold">
                    Adaptación Biológica al Frío
                  </span>
                  <p className="text-[11px] text-[#F2F1EC]/90 leading-relaxed">
                    {animal.datoCurioso}
                  </p>
                </div>
              </div>
            </div>

            {/* Enlace a Lugares donde se observa */}
            <div className="pt-3 border-t border-white/10 mt-2">
              <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E8A15A]" />
                Registrado en:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {animal.lugares.map((lugId) => (
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
          fotoId={activeFotoId}
          alt={animal.nombreComun}
          megapixeles={animal.megapixeles || 1.2}
          onClose={() => setShowDeepZoom(false)}
        />
      )}
    </>
  );
};
