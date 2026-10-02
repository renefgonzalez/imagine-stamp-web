import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Mountain, Calendar, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Lugar } from '../data/lugares';
import { CATEGORIAS } from '../data/categorias';
import { MEDIA_BASE } from '../config';
import { isWithinPopoRadius } from '../lib/geo';

interface PlaceSheetProps {
  lugar: Lugar | null;
  onClose: () => void;
}

export const PlaceSheet: React.FC<PlaceSheetProps> = ({ lugar, onClose }) => {
  if (!lugar) return null;

  const cat = CATEGORIAS[lugar.categoria];
  const firstFoto = lugar.fotos[0]?.id || 'hero-volcanes';
  const fotoUrl = `${MEDIA_BASE}/fotos/${firstFoto}-1280.webp`;
  const isPopoExclusion = isWithinPopoRadius(lugar.coords);

  return (
    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-96 z-30 animate-fade-in-up">
      <div className="relative rounded-2xl overflow-hidden bg-[#1A1C1B]/95 border border-white/15 shadow-2xl backdrop-blur-xl text-[#F2F1EC]">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/60 text-[#9AA3A0] hover:text-white hover:bg-black/90 transition-colors"
          aria-label="Cerrar vista previa"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Imagen de cabecera */}
        <div className="relative h-40 w-full overflow-hidden bg-black">
          <img
            src={fotoUrl}
            alt={lugar.nombre}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1B] via-black/30 to-transparent" />

          {/* Badges sobre la foto */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold text-white backdrop-blur-md flex items-center gap-1.5"
              style={{ backgroundColor: `${cat.colorHex}EE` }}
            >
              <cat.icon className="w-3 h-3" />
              <span>{cat.nombre}</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-[#E8A15A]">
              {lugar.altitud.toLocaleString()} m
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#F2F1EC] leading-tight">
              {lugar.nombre}
            </h3>
            <p className="text-xs text-[#9AA3A0] mt-1 line-clamp-2 leading-relaxed">
              {lugar.resumen}
            </p>
          </div>

          {/* Avisos especiales */}
          {isPopoExclusion && (
            <div className="p-2 rounded-xl bg-[#C2502E]/15 border border-[#C2502E]/30 flex items-center gap-2 text-[11px] text-[#f89b82]">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#C2502E]" />
              <span>Radio de exclusión volcánica (12 km). Consulta CENAPRED.</span>
            </div>
          )}

          {lugar.sensible && (
            <div className="p-2 rounded-xl bg-[#B88A4A]/15 border border-[#B88A4A]/30 flex items-center gap-2 text-[11px] text-[#f2dcad]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#B88A4A]" />
              <span>Zona arqueológica protegida. Ubicación aproximada.</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-[#9AA3A0] pt-1 border-t border-white/5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#E8A15A]" />
              <span className="truncate max-w-[170px]">{lugar.temporada}</span>
            </span>

            <span className="font-mono text-[11px]">
              Dificultad: <strong className="text-white">{lugar.dificultad}</strong>
            </span>
          </div>

          {/* Botón Ver Ficha Completa */}
          <Link
            to={`/izta-popo/lugar/${lugar.id}`}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#E8A15A] hover:bg-[#f3b578] text-[#0E0F0F] font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E8A15A]/20"
          >
            <span>Ver ficha completa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
