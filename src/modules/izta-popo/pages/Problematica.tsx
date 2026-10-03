import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldCheck, ArrowRight, Info, Flame, Trash2, Axe, Sparkles, Mountain, Rabbit, HeartHandshake } from 'lucide-react';
import { PROBLEMAS_AMBIENTALES } from '../data/problemas';

const ICON_MAP: Record<string, React.ReactNode> = {
  'incendios-forestales': <Flame className="w-5 h-5 text-amber-500" />,
  'basura-en-parajes': <Trash2 className="w-5 h-5 text-emerald-400" />,
  'tala-clandestina': <Axe className="w-5 h-5 text-rose-400" />,
  'extraccion-musgo-tierra': <Sparkles className="w-5 h-5 text-yellow-400" />,
  'perdida-de-glaciares': <Mountain className="w-5 h-5 text-cyan-400" />,
  'especies-en-riesgo': <Rabbit className="w-5 h-5 text-emerald-300" />
};

export const ProblematicaPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Problemática y Mitigación · Conocimiento de la Montaña';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Banner de contenido de ejemplo */}
      <div className="bg-[#1A1C1B] border-b border-white/10 text-xs py-2.5 px-4 text-center text-[#9AA3A0]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-[#E8A15A] shrink-0" />
          <span>Contenido de ejemplo: el texto final lo proporcionará Conocimiento de la Montaña.</span>
        </div>
      </div>

      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Concientización & Mitigación Ambiental</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
          Problemática ambiental de la sierra
        </h1>

        <p className="text-base sm:text-lg text-[#9AA3A0] max-w-3xl mx-auto leading-relaxed">
          Los bosques y cumbres del Iztaccíhuatl y el Popocatépetl son la principal fábrica de agua, oxígeno y equilibrio ecológico para millones de habitantes. Sin embargo, enfrentan presiones críticas originadas por la actividad humana. Conocerlas es la base para actuar con responsabilidad.
        </p>
      </section>

      {/* Lista de problemáticas */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {PROBLEMAS_AMBIENTALES.map((item, idx) => (
          <article
            key={item.id}
            id={item.id}
            className="rounded-3xl bg-[#141615] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Imagen */}
              <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-[380px] bg-black">
                <img
                  src={`/izta-popo/media/fotos/${item.fotoId}-1280.webp`}
                  alt={item.titulo}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget;
                    el.onerror = null;
                    el.src = '/izta-popo/media/fotos/bosque-hartwegii-1280.webp';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141615] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#141615]" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs font-mono text-white/90 flex items-center gap-1.5">
                  {ICON_MAP[item.id] || <AlertTriangle className="w-3.5 h-3.5 text-[#E8A15A]" />}
                  <span>Punto 0{idx + 1}</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug">
                    {item.titulo}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-[#E8A15A] mb-4">
                    {item.subtitulo}
                  </p>
                  <p className="text-sm text-[#9AA3A0] leading-relaxed mb-6">
                    {item.descripcion}
                  </p>

                  {/* Acciones de mitigación */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>¿Cómo mitigarlo? Acciones concretas:</span>
                    </div>
                    <ul className="space-y-2 text-xs sm:text-sm text-white/90">
                      {item.comoMitigarlo.map((mit, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <span className="leading-relaxed">{mit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Enlace opcional a ficha de lugar */}
                {item.enlaceLugarId && (
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/izta-popo/lugar/${item.enlaceLugarId}`}
                      className="inline-flex items-center gap-2 text-xs font-mono text-[#8FC1D4] hover:text-white transition-colors"
                    >
                      <span>{item.enlaceTexto || 'Ver en el mapa 3D'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Llamado a la acción final */}
      <section className="mt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1C1F1E] to-[#121413] border border-white/10 shadow-2xl">
          <HeartHandshake className="w-12 h-12 text-[#E8A15A] mx-auto mb-4" />
          <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-4">
            La conservación empieza con la participación de todos
          </h3>
          <p className="text-sm sm:text-base text-[#9AA3A0] max-w-xl mx-auto mb-8 leading-relaxed">
            No basta con admirar las cumbres desde la distancia. Súmate a nuestras jornadas colectivas de saneamiento, reforestación y difusión cultural de la sierra.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/izta-popo/participa"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-sm transition-all duration-200 shadow-lg hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>Súmate como voluntario</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/izta-popo/explorar"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Explorar el mapa 3D</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
