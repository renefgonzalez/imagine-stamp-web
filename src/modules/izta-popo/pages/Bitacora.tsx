import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Compass, Mountain, Clock, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { BITACORA_EXPEDICIONES } from '../data/bitacora';
import { LUGARES } from '../data/lugares';
import { MEDIA_BASE, GUIDE_NAME } from '../config';

export const BitacoraPage: React.FC = () => {
  const basePrefix = '/izta-popo';

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>DIARIO DE CAMPO OFICIAL</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Bitácora de expediciones
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            Cada recorrido en el macizo volcánico queda asentado con sus variables meteorológicas, distancias de marcha, desniveles acumulados y registro fotográfico en alta resolución por el guía {GUIDE_NAME}.
          </p>
        </div>
      </section>

      {/* Línea de tiempo vertical */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
          {BITACORA_EXPEDICIONES.map((exp, idx) => (
            <div key={exp.id} className="relative group">
              {/* Punto en la línea de tiempo */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-[#0E0F0F] border-2 border-[#E8A15A] flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-[#E8A15A] animate-pulse" />
              </div>

              {/* Tarjeta de la expedición */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#141615] border border-white/10 hover:border-[#E8A15A]/40 transition-all duration-300 shadow-xl space-y-6">
                {/* Meta superior */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#E8A15A]">
                    <Calendar className="w-4 h-4" />
                    <span className="font-semibold">{exp.fecha}</span>
                  </div>
                  <span className="text-xs text-[#9AA3A0] font-mono">
                    Clima: <strong className="text-white/80">{exp.clima}</strong>
                  </span>
                </div>

                {/* Título y Ruta */}
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-[#E8A15A] transition-colors mb-2">
                    {exp.titulo}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#8FC1D4] font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{exp.ruta}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#9AA3A0] leading-relaxed">
                  {exp.resumen}
                </p>

                {/* Telemetría (Cifras técnicas) */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                  <div>
                    <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Distancia</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-white">
                      {exp.distanciaKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Desnivel</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#8FC1D4]">
                      +{exp.desnivelM} m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Duración</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-[#E8A15A]">
                      {exp.duracionHoras} hrs
                    </span>
                  </div>
                </div>

                {/* Fotos de la expedición */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#9AA3A0] block">
                    Fotografías documentadas (3)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {exp.fotos.map((foto, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-white/10 relative group/foto"
                      >
                        <img
                          src={`${MEDIA_BASE}/fotos/${foto.id}-1280.webp`}
                          alt={foto.pie}
                          className="w-full h-full object-cover group-hover/foto:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 p-2.5 flex items-end">
                          <span className="text-[11px] text-white font-medium line-clamp-1">{foto.pie}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chips de lugares visitados que enlazan al mapa */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-mono text-[#9AA3A0] mr-1">Lugares vinculados:</span>
                  {exp.lugaresIds.map((lugarId) => {
                    const l = LUGARES.find((item) => item.id === lugarId);
                    return (
                      <Link
                        key={lugarId}
                        to={`${basePrefix}/lugar/${lugarId}`}
                        className="px-3 py-1 rounded-xl bg-white/10 hover:bg-[#E8A15A] hover:text-black text-xs font-mono text-white transition-colors flex items-center gap-1.5"
                      >
                        <MapPin className="w-3 h-3 text-[#E8A15A] group-hover:text-black" />
                        <span>{l ? l.nombre : lugarId}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
