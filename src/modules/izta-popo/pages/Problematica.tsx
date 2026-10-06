import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Flame, 
  Trash2, 
  Axe, 
  Sparkles, 
  Mountain, 
  Rabbit, 
  HeartHandshake,
  Camera,
  X,
  Maximize2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { PROBLEMAS_AMBIENTALES, EVIDENCIAS_MALAS_PRACTICAS, EvidenciaMalaPractica } from '../data/problemas';

const ICON_MAP: Record<string, React.ReactNode> = {
  'incendios-forestales': <Flame className="w-5 h-5 text-amber-500" />,
  'basura-en-parajes': <Trash2 className="w-5 h-5 text-emerald-400" />,
  'tala-clandestina': <Axe className="w-5 h-5 text-rose-400" />,
  'extraccion-musgo-tierra': <Sparkles className="w-5 h-5 text-yellow-400" />,
  'perdida-de-glaciares': <Mountain className="w-5 h-5 text-cyan-400" />,
  'especies-en-riesgo': <Rabbit className="w-5 h-5 text-emerald-300" />
};

export const ProblematicaPage: React.FC = () => {
  const [categoriaFiltro, setCategoriaFiltro] = useState<'todas' | 'fuego' | 'basura' | 'arbolado'>('todas');
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<EvidenciaMalaPractica | null>(null);

  useEffect(() => {
    document.title = 'Problemática y Mitigación · Conocimiento de la Montaña';
    window.scrollTo(0, 0);
  }, []);

  const evidenciasFiltradas = categoriaFiltro === 'todas'
    ? EVIDENCIAS_MALAS_PRACTICAS
    : EVIDENCIAS_MALAS_PRACTICAS.filter(e => e.categoria === categoriaFiltro);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Banner de contenido testimonial */}
      <div className="bg-[#1A1C1B] border-b border-white/10 text-xs py-2.5 px-4 text-center text-[#9AA3A0]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Camera className="w-4 h-4 text-[#E8A15A] shrink-0" />
          <span>Fototeca testimonial directa: Evidencias y registros tomados en campo por brigadistas y custodios de la sierra.</span>
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

      {/* FOTOTECA TESTIMONIAL: MALAS PRÁCTICAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="rounded-3xl bg-[#141615] border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-xs font-mono font-semibold uppercase mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>Registro Fotográfico en Campo</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Evidencias de malas prácticas en el bosque
              </h2>
              <p className="text-xs sm:text-sm text-[#9AA3A0] mt-1 max-w-2xl">
                Fotografías reales captadas en senderos, parajes y faldas de la sierra. Muestran las acciones humanas que dañan irremediablemente el ecosistema y cómo debemos transformarlas.
              </p>
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCategoriaFiltro('todas')}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  categoriaFiltro === 'todas'
                    ? 'bg-[#E8A15A] text-[#0E0F0F] font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                Todas ({EVIDENCIAS_MALAS_PRACTICAS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoriaFiltro('fuego')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  categoriaFiltro === 'fuego'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Fuego ({EVIDENCIAS_MALAS_PRACTICAS.filter(e => e.categoria === 'fuego').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoriaFiltro('basura')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  categoriaFiltro === 'basura'
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <Trash2 className="w-3 h-3 text-emerald-400" />
                <span>Basura ({EVIDENCIAS_MALAS_PRACTICAS.filter(e => e.categoria === 'basura').length})</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoriaFiltro('arbolado')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  categoriaFiltro === 'arbolado'
                    ? 'bg-rose-500 text-black font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-white/80 border border-white/10'
                }`}
              >
                <Axe className="w-3 h-3 text-rose-400" />
                <span>Daño a Árboles ({EVIDENCIAS_MALAS_PRACTICAS.filter(e => e.categoria === 'arbolado').length})</span>
              </button>
            </div>
          </div>

          {/* Grilla de evidencias fotográficas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidenciasFiltradas.map((item) => (
              <div
                key={item.id}
                onClick={() => setEvidenciaSeleccionada(item)}
                className="group cursor-pointer rounded-2xl bg-[#1A1C1B] border border-white/10 hover:border-[#E8A15A]/60 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <img
                    src={`/izta-popo/media/fotos/${item.fotoId}-480.webp`}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.onerror = null;
                      el.src = '/izta-popo/media/fotos/bosque-hartwegii-480.webp';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Badge de categoría */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md ${
                      item.categoria === 'fuego' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      item.categoria === 'basura' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {item.categoria === 'fuego' ? '🔥 Peligro de Fuego' :
                       item.categoria === 'basura' ? '🚯 Residuos Tóxicos' :
                       '🌲 Daño al Arbolado'}
                    </span>
                  </div>

                  {/* Icono de zoom */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#E8A15A] transition-colors leading-snug">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-[#9AA3A0] mt-1.5 leading-relaxed line-clamp-2">
                      {item.descripcion}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 space-y-1.5">
                    <div className="flex items-start gap-1.5 text-[11px] text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="line-clamp-1"><strong className="text-white/90">Impacto:</strong> {item.impacto}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-[11px] text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span className="line-clamp-1"><strong className="text-white/90">Conducta:</strong> {item.conductaCorrecta}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Detalle de Evidencia */}
      {evidenciaSeleccionada && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setEvidenciaSeleccionada(null)}
        >
          <div 
            className="relative w-full max-w-3xl rounded-3xl bg-[#141615] border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setEvidenciaSeleccionada(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Imagen a alta resolución */}
            <div className="relative aspect-video sm:aspect-[16/10] bg-black">
              <img
                src={`/izta-popo/media/fotos/${evidenciaSeleccionada.fotoId}-1280.webp`}
                alt={evidenciaSeleccionada.titulo}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Detalle */}
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-xs font-mono text-[#E8A15A] uppercase tracking-wider block mb-1">
                  Evidencia fotográfica documentada
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {evidenciaSeleccionada.titulo}
                </h3>
              </div>

              <p className="text-sm text-[#9AA3A0] leading-relaxed">
                {evidenciaSeleccionada.descripcion}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Consecuencia ecológica</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {evidenciaSeleccionada.impacto}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acción recomendada</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">
                    {evidenciaSeleccionada.conductaCorrecta}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de problemáticas principales */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-white/10 pb-4 text-center sm:text-left">
          <h2 className="font-serif text-3xl font-bold text-white">
            Ejes críticos de la problemática ambiental
          </h2>
          <p className="text-sm text-[#9AA3A0] mt-1 font-mono">
            Diagnóstico detallado y soluciones operativas
          </p>
        </div>

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
