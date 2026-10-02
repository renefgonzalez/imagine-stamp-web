import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import { Lugar } from '../data/lugares';
import { CATEGORIAS } from '../data/categorias';
import { MEDIA_BASE } from '../config';

interface PlaceCardProps {
  lugar: Lugar;
  onClick?: () => void;
  destacado?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ lugar, onClick, destacado = false }) => {
  const cat = CATEGORIAS[lugar.categoria];
  const firstFoto = lugar.fotos[0]?.id || 'hero-volcanes';
  const fotoUrl = `${MEDIA_BASE}/fotos/${firstFoto}-1280.webp`;

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden bg-[#1A1C1B] border transition-all duration-300 flex flex-col cursor-pointer ${
        destacado
          ? 'border-[#E8A15A]/40 shadow-xl shadow-[#E8A15A]/10 scale-[1.01]'
          : 'border-white/10 hover:border-[#E8A15A]/40 hover:-translate-y-1'
      }`}
    >
      {/* Imagen */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0E0F0F]">
        <img
          src={fotoUrl}
          alt={lugar.nombre}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C1B] via-black/20 to-transparent" />

        {/* Badge de Categoría */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold tracking-wider text-white backdrop-blur-md shadow-md flex items-center gap-1.5"
            style={{ backgroundColor: `${cat.colorHex}DD` }}
          >
            <cat.icon className="w-3 h-3" />
            <span>{cat.nombre}</span>
          </span>
          {lugar.sensible && (
            <span className="px-2 py-0.5 rounded-md bg-[#B88A4A] text-black text-[10px] font-mono font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Zona protegida
            </span>
          )}
        </div>

        {/* Altitud en JetBrains Mono */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-[#E8A15A]">
          {lugar.altitud.toLocaleString()} m
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-serif text-base font-semibold text-[#F2F1EC] group-hover:text-[#E8A15A] transition-colors line-clamp-1 mb-1.5">
            {lugar.nombre}
          </h4>
          <p className="text-xs text-[#9AA3A0] leading-relaxed line-clamp-2 mb-3">
            {lugar.resumen}
          </p>
        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#9AA3A0]">
          <span className="flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                lugar.dificultad === 'Fácil'
                  ? 'bg-emerald-400'
                  : lugar.dificultad === 'Media'
                  ? 'bg-amber-400'
                  : 'bg-rose-400'
              }`}
            />
            {lugar.dificultad}
          </span>

          <Link
            to={`/izta-popo/lugar/${lugar.id}`}
            className="text-[#E8A15A] font-medium flex items-center gap-1 hover:underline"
          >
            <span>Ver ficha</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
