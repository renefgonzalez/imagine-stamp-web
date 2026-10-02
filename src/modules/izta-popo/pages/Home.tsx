import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Trees,
  Mountain,
  ChevronDown,
  ArrowRight,
  Droplets,
  HeartHandshake,
  Users,
  Play,
  Maximize2,
  Calendar,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CATEGORIAS_ARRAY } from '../data/categorias';
import { LUGARES } from '../data/lugares';
import { BITACORA_JORNADAS } from '../data/bitacora';
import { MEDIA_BASE, WHATSAPP_NUMBER, VOLUNTEER_WHATSAPP_MESSAGE, GUIDE_NAME } from '../config';
import { Map3D } from '../components/Map3D';
import { DeepZoomViewer } from '../components/DeepZoomViewer';
import { PresentationModal } from '../components/PresentationModal';

export const Home: React.FC = () => {
  const ayoloco = LUGARES.find((l) => l.id === 'glaciar-ayoloco') || LUGARES[3];
  const ultimaJornada = BITACORA_JORNADAS[0];

  const [activeDeepZoom, setActiveDeepZoom] = useState<{ id: string; alt: string; mp: number } | null>(null);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const presentationTriggerRef = useRef<HTMLButtonElement>(null);

  // Categorías con foto de fondo correspondiente
  const categoryImages: Record<string, string> = {
    ecosistema: 'oyamel',
    arqueologia: 'sacromonte',
    agua: 'glaciar-ayoloco',
    fauna: 'teporingo',
    curiosidad: 'paso-de-cortes',
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(VOLUNTEER_WHATSAPP_MESSAGE)}`;

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] overflow-x-hidden">
      {/* 1. HERO A PANTALLA COMPLETA */}
      <section className="relative w-full h-[92vh] sm:h-screen flex items-center justify-center overflow-hidden">
        {/* Video o imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={`${MEDIA_BASE}/fotos/hero-volcanes-2560.webp`}
            className="w-full h-full object-cover scale-105 filter brightness-75 contrast-110"
          >
            <source src={`${MEDIA_BASE}/video/hero-ligero.mp4`} type="video/mp4" />
            <source src={`${MEDIA_BASE}/video/video-volcanes-avion-alta.mp4`} type="video/mp4" />
          </video>

          {/* Grano de película y degradados de contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F0F] via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>

        {/* Contenido Hero (Sin etiqueta superior, titular y subtítulo según sección E2) */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto drop-shadow-2xl">
            Las montañas que nos dieron todo hoy nos necesitan
          </h1>

          <p className="text-base sm:text-xl text-[#F2F1EC]/90 max-w-2xl mx-auto font-sans leading-relaxed font-light drop-shadow">
            Ecosistemas, vestigios y la riqueza natural del Iztaccíhuatl y el Popocatépetl. Conocerlos es el primer paso para protegerlos.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explorar"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-[#0E0F0F] font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#E8A15A]/25 flex items-center justify-center gap-2 group scale-100 hover:scale-105"
            >
              <Compass className="w-5 h-5 text-[#0E0F0F] group-hover:rotate-45 transition-transform" />
              <span>Explorar el mapa 3D</span>
            </Link>

            <Link
              to="/participa"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black/60 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 group"
            >
              <HeartHandshake className="w-5 h-5 text-[#E8A15A] group-hover:scale-110 transition-transform" />
              <span>Súmate como voluntario</span>
            </Link>
          </div>
        </div>

        {/* Indicador de scroll animado */}
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center text-[#9AA3A0] text-xs font-mono pointer-events-none animate-bounce">
          <span>DESPLAZA HACIA ABAJO</span>
          <ChevronDown className="w-4 h-4 mt-1 text-[#E8A15A]" />
        </div>
      </section>

      {/* 2. SECCIÓN DE MISIÓN Y MANIFIESTO + VIDEO TEASER (Instrucción 1 & 2) */}
      <section className="py-20 bg-[#121413] border-b border-white/[0.08] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Texto de misión */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nuestra Misión</span>
              </div>

              <blockquote className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                “Las montañas fueron sagradas. Queremos que vuelvan a serlo para todos.”
              </blockquote>

              <p className="text-base text-[#9AA3A0] leading-relaxed">
                En el México prehispánico, las montañas eran veneradas como deidades del agua y de la tierra. Hoy, sus bosques, glaciares y fauna enfrentan una explotación y un descuido que amenazan la vida misma. Conocimiento de la Montaña difunde esta riqueza natural y cultural para forjar una conciencia colectiva de protección activa.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/conocimiento"
                  className="px-6 py-3.5 rounded-full bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Leer el manifiesto completo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/conocimiento?lang=en"
                  className="px-4 py-3 rounded-full text-xs font-mono text-[#8FC1D4] hover:text-white transition-colors border border-white/10 hover:border-white/20"
                >
                  <span>Read in English →</span>
                </Link>
              </div>
            </div>

            {/* Teaser del video de presentación del cliente con botón Play */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={`${MEDIA_BASE}/video/presentacion-poster.webp`}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                >
                  <source src={`${MEDIA_BASE}/video/presentacion-teaser.mp4`} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Botón flotante de reproducción */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <button
                    ref={presentationTriggerRef}
                    type="button"
                    onClick={() => setIsPresentationOpen(true)}
                    className="w-16 h-16 rounded-full bg-[#E8A15A] text-[#0E0F0F] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group-hover:ring-4 group-hover:ring-[#E8A15A]/40 mb-3"
                    aria-label="Ver video de presentación de Conocimiento de la Montaña"
                  >
                    <Play className="w-7 h-7 fill-[#0E0F0F] ml-1" />
                  </button>
                  <span className="font-serif text-lg font-bold text-white drop-shadow">
                    Ver video de presentación
                  </span>
                  <span className="text-xs font-mono text-[#E8A15A] mt-1">
                    Conocimiento de la Montaña · Con audio
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CIFRAS DE CONSERVACIÓN (Reemplazo de métricas turísticas según E5) */}
      <section className="py-12 bg-[#141615] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA3A0]">
              Indicadores de Conservación y Custodia
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-[#E8A15A]">
              Cifras de ejemplo
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-emerald-400">
                18
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Jornadas de limpieza
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#E8A15A]">
                1,250+
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Árboles plantados
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#8FC1D4]">
                14
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Lugares documentados
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-yellow-300">
                42
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Especies registradas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TEMÁTICAS / CATEGORÍAS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8A15A] block mb-2">
              Explora por temáticas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Cinco miradas hacia los colosos
            </h2>
          </div>
          <Link
            to="/explorar"
            className="text-xs font-mono text-[#E8A15A] hover:underline flex items-center gap-1.5"
          >
            <span>Ver todos los lugares en el mapa 3D</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIAS_ARRAY.map((cat, idx) => {
            const Icon = cat.icon;
            const imgKey = categoryImages[cat.id] || 'hero-volcanes';
            const imgUrl = `${MEDIA_BASE}/fotos/${imgKey}-1280.webp`;

            return (
              <Link
                key={cat.id}
                to={`/explorar?cat=${cat.id}`}
                className={`group relative rounded-3xl overflow-hidden h-72 border border-white/10 hover:border-[#E8A15A]/50 transition-all duration-300 shadow-xl flex flex-col justify-end p-6 ${
                  idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {cat.id === 'fauna' ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={`${MEDIA_BASE}/fotos/teporingo-1280.webp`}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  >
                    <source src={`${MEDIA_BASE}/video/presentacion-teaser.mp4`} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={imgUrl}
                    alt={cat.nombre}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-2 shadow-lg"
                    style={{ backgroundColor: `${cat.colorHex}DD` }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#E8A15A] transition-colors">
                    {cat.nombre}
                  </h3>
                  <p className="text-xs text-[#9AA3A0] line-clamp-2 leading-relaxed">
                    {cat.descripcion}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. LUGAR DESTACADO: GLACIAR DE AYOLOCO (Memoria de conservación) */}
      <section className="py-20 bg-[#141615] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Imagen con botón Deep Zoom */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-black border border-white/10 shadow-2xl group">
              <img
                src={`${MEDIA_BASE}/fotos/glaciar-ayoloco-2560.webp`}
                alt="Glaciar de Ayoloco en el Iztaccíhuatl"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-[#8FC1D4]/20 border border-[#8FC1D4]/40 text-xs font-mono font-bold text-[#8FC1D4] backdrop-blur-md">
                  MEMORIA CLIMÁTICA · 4,900 M
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setActiveDeepZoom({
                    id: 'glaciar-ayoloco',
                    alt: 'Glaciar de Ayoloco y morrena de altura',
                    mp: 5.9,
                  })
                }
                className="absolute bottom-4 right-4 p-3 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-semibold text-xs transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Explorar en alta resolución</span>
              </button>
            </div>

            {/* Texto y relato de custodia */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FC1D4]/15 text-[#8FC1D4] border border-[#8FC1D4]/30 text-xs font-mono">
                <Droplets className="w-3.5 h-3.5" />
                <span>Memoria Ambiental</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Glaciar de Ayoloco: El testimonio del deshielo
              </h2>

              <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
                Declarado oficialmente extinto en 2018, el lecho del Ayoloco se ha convertido en el santuario de memoria ambiental más emotivo de México. Una placa de bronce en la cota de los 4,900 m recuerda a las futuras generaciones la urgencia de proteger los ecosistemas que aún sobreviven.
              </p>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-mono text-[#E8A15A] uppercase block">
                  De las palabras de {GUIDE_NAME}:
                </span>
                <p className="text-xs italic text-white/80 leading-relaxed font-serif">
                  "Caminar sobre las lajas pulidas que hace apenas dos décadas estaban cubiertas de seracs azul zafiro te cambia para siempre. Ayoloco hoy nos enseña que la montaña no es para explotarla ni conquistarla: es un patrimonio sagrado que debemos custodiar entre todos."
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/lugar/glaciar-ayoloco"
                  className="px-6 py-3.5 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-bold text-xs transition-all shadow-lg flex items-center gap-2"
                >
                  <span>Ver ficha en el mapa 3D</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/problematica#perdida-de-glaciares"
                  className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono text-xs border border-white/10 transition-colors"
                >
                  <span>Ver problemática de glaciares</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VISTA PREVIA DEL MAPA 3D */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#141615] shadow-2xl relative">
          <div className="h-96 sm:h-[480px] w-full">
            <Map3D modoCompacto={true} />
          </div>

          {/* Overlay informativo sobre el mapa */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-6 rounded-2xl bg-[#0E0F0F]/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#E8A15A] block">
              Cartografía Satelital 3D
            </span>
            <h3 className="font-serif text-2xl font-bold text-white leading-tight">
              Sobrevuela las cumbres con relieve real
            </h3>
            <p className="text-xs text-[#9AA3A0] leading-relaxed">
              Explora los 14 puntos estratégicos, las áreas de conservación y el radio de exclusión volcánica del Popocatépetl.
            </p>
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-semibold text-xs transition-all shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Abrir mapa completo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ÚLTIMA JORNADA DE LA BITÁCORA (Reemplazo de última expedición según E5) */}
      <section className="py-20 bg-[#141615] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8A15A] block mb-1">
                Bitácora de Campo & Voluntariado
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">
                Última jornada documentada
              </h2>
            </div>
            <Link
              to="/bitacora"
              className="text-xs font-mono text-[#E8A15A] hover:underline flex items-center gap-1.5"
            >
              <span>Ver bitácora de jornadas completa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-3xl p-6 sm:p-8 bg-[#1A1C1B] border border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#9AA3A0]">
                <span className="flex items-center gap-1.5 text-[#E8A15A]">
                  <Calendar className="w-4 h-4" />
                  <span>{ultimaJornada.fecha}</span>
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[11px]">
                  {ultimaJornada.tipoJornada}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {ultimaJornada.titulo}
              </h3>

              <p className="text-xs sm:text-sm text-[#9AA3A0] leading-relaxed">
                {ultimaJornada.resumen}
              </p>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Logro de la jornada:</span>
                </span>
                <p className="text-xs text-white/90 font-medium">
                  {ultimaJornada.logro}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#9AA3A0]">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#8FC1D4]" />
                  <span>{ultimaJornada.voluntariosParticipantes} voluntarios activos</span>
                </span>
                <span>•</span>
                <span>Lugar: {ultimaJornada.lugar}</span>
              </div>
            </div>

            {/* Galería rápida de la jornada */}
            <div className="grid grid-cols-2 gap-3">
              {ultimaJornada.fotos.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-black border border-white/10 relative group ${
                    i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={`${MEDIA_BASE}/fotos/${f.id}-800.webp`}
                    alt={f.pie}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `${MEDIA_BASE}/fotos/bosque-pino-800.webp`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                    <span className="text-[10px] text-white font-medium truncate">{f.pie}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. LLAMADO FINAL: SÚMATE COMO VOLUNTARIO (Sin venta de tours) */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#141615] via-[#0E0F0F] to-[#080909]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#E8A15A]/15 border border-[#E8A15A]/30 flex items-center justify-center text-[#E8A15A] mx-auto mb-4">
            <Mountain className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Las montañas nos necesitan hoy
          </h2>

          <p className="text-sm sm:text-base text-[#9AA3A0] max-w-xl mx-auto leading-relaxed">
            No cobramos recorridos ni vendemos expediciones turísticas. Organizamos faenas de limpieza, reforestación y difusión comunitaria. Tu participación marca la diferencia.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/participa"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#E8A15A]/25 flex items-center justify-center gap-2 group scale-100 hover:scale-105"
            >
              <HeartHandshake className="w-5 h-5 text-[#0E0F0F] group-hover:scale-110 transition-transform" />
              <span>Súmate como voluntario</span>
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 scale-100 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Quiero participar por WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* Modal Deep Zoom si está abierto */}
      {activeDeepZoom && (
        <DeepZoomViewer
          fotoId={activeDeepZoom.id}
          alt={activeDeepZoom.alt}
          megapixeles={activeDeepZoom.mp}
          onClose={() => setActiveDeepZoom(null)}
        />
      )}

      {/* Modal de Presentación del Cliente */}
      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        triggerElementRef={presentationTriggerRef}
      />
    </div>
  );
};
