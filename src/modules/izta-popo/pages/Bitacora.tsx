import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, HeartHandshake, MapPin, Users, ShieldCheck, ArrowRight, Camera } from 'lucide-react';
import { BITACORA_JORNADAS } from '../data/bitacora';
import { LUGARES } from '../data/lugares';
import { MEDIA_BASE, GUIDE_NAME } from '../config';

export const BitacoraPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Bitácora de Jornadas · Conocimiento de la Montaña';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold uppercase">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Acción Comunitaria & Custodia</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Bitácora de jornadas
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            Registro testimonial de las jornadas de saneamiento, reforestación nativa, observación de fauna y rescate de tradición oral organizadas por {GUIDE_NAME} y voluntarios comprometidos con el Izta-Popo.
          </p>

          <div className="pt-2">
            <Link
              to="/participa"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-xs transition-all shadow-md"
            >
              <span>Súmate a la próxima jornada</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Línea de tiempo vertical */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative border-l-2 border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
          {BITACORA_JORNADAS.map((jor) => (
            <div key={jor.id} className="relative group">
              {/* Punto en la línea de tiempo */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-[#0E0F0F] border-2 border-[#E8A15A] flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform">
                <div className="w-2 h-2 rounded-full bg-[#E8A15A] animate-pulse" />
              </div>

              {/* Tarjeta de la jornada */}
              <div className="rounded-3xl p-6 sm:p-8 bg-[#141615] border border-white/10 hover:border-[#E8A15A]/40 transition-all duration-300 shadow-xl space-y-6">
                {/* Meta superior */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#E8A15A]">
                      <Calendar className="w-4 h-4" />
                      <span className="font-semibold">{jor.fecha}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-xs">
                      {jor.tipoJornada}
                    </span>
                  </div>
                  {jor.esEjemplo && (
                    <span className="text-[11px] font-mono text-[#9AA3A0] px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      Entrada de ejemplo
                    </span>
                  )}
                </div>

                {/* Título y Lugar */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white group-hover:text-[#E8A15A] transition-colors mb-2">
                    {jor.titulo}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#8FC1D4] font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Lugar: {jor.lugar}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#9AA3A0] leading-relaxed">
                  {jor.resumen}
                </p>

                {/* Logro y Participación */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold flex items-center gap-1 mb-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Logro alcanzado</span>
                    </span>
                    <p className="text-xs sm:text-sm text-white/95 font-medium leading-snug">
                      {jor.logro}
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-white/10 sm:pl-4 flex flex-col justify-center">
                    <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Participantes</span>
                    <span className="font-mono text-lg font-bold text-[#E8A15A] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#8FC1D4]" />
                      <span>{jor.voluntariosParticipantes} voluntarios</span>
                    </span>
                  </div>
                </div>

                {/* Fotos de la jornada */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase text-[#9AA3A0] flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#E8A15A]" />
                    <span>Registro fotográfico de la jornada</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {jor.fotos.map((foto, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-white/10 relative group/foto"
                      >
                        <img
                          src={`${MEDIA_BASE}/fotos/${foto.id}-480.webp`}
                          alt={foto.pie}
                          className="w-full h-full object-cover group-hover/foto:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.onerror = null;
                            el.src = `${MEDIA_BASE}/fotos/la-joya-480.webp`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/foto:opacity-100 transition-opacity p-3 flex items-end">
                          <span className="text-[11px] text-white font-medium">{foto.pie}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lugares relacionados */}
                {jor.lugaresIds.length > 0 && (
                  <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono text-[#9AA3A0] uppercase mr-2">Sitios relacionados:</span>
                    {jor.lugaresIds.map((lId) => {
                      const lInfo = LUGARES.find((l) => l.id === lId);
                      if (!lInfo) return null;
                      return (
                        <Link
                          key={lId}
                          to={`/lugar/${lId}`}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#8FC1D4] hover:text-white transition-colors"
                        >
                          {lInfo.nombre}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
