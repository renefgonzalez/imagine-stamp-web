import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Trees,
  Mountain,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Droplets,
  Landmark,
  PawPrint,
  Calendar,
  MessageCircle,
  Maximize2
} from 'lucide-react';
import { CATEGORIAS_ARRAY } from '../data/categorias';
import { LUGARES } from '../data/lugares';
import { BITACORA_EXPEDICIONES } from '../data/bitacora';
import { MEDIA_BASE, WHATSAPP_URL, GUIDE_NAME } from '../config';
import { Map3D } from '../components/Map3D';
import { DeepZoomViewer } from '../components/DeepZoomViewer';

export const Home: React.FC = () => {
  const basePrefix = '/izta-popo';
  const ayoloco = LUGARES.find((l) => l.id === 'glaciar-ayoloco') || LUGARES[3];
  const ultimaExpedicion = BITACORA_EXPEDICIONES[0];

  const [activeDeepZoom, setActiveDeepZoom] = useState<{ id: string; alt: string; mp: number } | null>(null);

  // Categorías con foto de fondo correspondiente
  const categoryImages: Record<string, string> = {
    ecosistema: 'oyamel',
    arqueologia: 'sacromonte',
    agua: 'glaciar-ayoloco',
    fauna: 'teporingo',
    curiosidad: 'paso-de-cortes',
  };

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

        {/* Contenido Hero */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#E8A15A]/40 text-xs font-mono text-[#E8A15A] backdrop-blur-md animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#E8A15A] animate-ping" />
            <span>EXPEDICIONES DOCUMENTADAS EN ALTA MONTAÑA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto drop-shadow-2xl">
            Lo que pocos han visto entre dos volcanes
          </h1>

          <p className="text-sm sm:text-lg text-[#F2F1EC]/85 max-w-2xl mx-auto font-sans leading-relaxed font-light drop-shadow">
            Ecosistemas de altura, vestigios arqueológicos prehispánicos y rincones escondidos del Iztaccíhuatl y el Popocatépetl, documentados recorrido a recorrido.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`${basePrefix}/explorar`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-[#0E0F0F] font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#E8A15A]/25 flex items-center justify-center gap-2 group scale-100 hover:scale-105"
            >
              <Compass className="w-5 h-5 text-[#0E0F0F] group-hover:rotate-45 transition-transform" />
              <span>Explorar el mapa 3D</span>
            </Link>

            <Link
              to={`${basePrefix}/flora`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black/50 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all border border-white/20 backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Trees className="w-5 h-5 text-[#3F6B4F]" />
              <span>Ver la flora por altitud</span>
            </Link>
          </div>
        </div>

        {/* Indicador de scroll animado */}
        <div className="absolute bottom-6 inset-x-0 flex flex-col items-center justify-center text-[#9AA3A0] text-xs font-mono pointer-events-none animate-bounce">
          <span>DESPLAZA HACIA ABAJO</span>
          <ChevronDown className="w-4 h-4 mt-1 text-[#E8A15A]" />
        </div>
      </section>

      {/* 2. CIFRAS Y CONTADORES ANIMADOS */}
      <section className="py-12 bg-[#141615] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#E8A15A]">
                14
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Lugares documentados
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#8FC1D4]">
                5,230 m
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Altitud máxima recorrida
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#3F6B4F]">
                4
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Pisos ecológicos vivos
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
              <span className="block font-mono text-3xl sm:text-4xl font-bold text-[#B88A4A]">
                38
              </span>
              <span className="text-xs text-[#9AA3A0] uppercase font-mono tracking-wider mt-1 block">
                Expediciones realizadas
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORÍAS */}
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
            to={`${basePrefix}/explorar`}
            className="text-xs font-mono text-[#E8A15A] hover:underline flex items-center gap-1.5"
          >
            <span>Ver todos los lugares en el mapa</span>
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
                to={`${basePrefix}/explorar?cat=${cat.id}`}
                className={`group relative rounded-3xl overflow-hidden h-72 border border-white/10 hover:border-[#E8A15A]/50 transition-all duration-300 shadow-xl flex flex-col justify-end p-6 ${
                  idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <img
                  src={imgUrl}
                  alt={cat.nombre}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
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

      {/* 4. LUGAR DESTACADO: GLACIAR DE AYOLOCO */}
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

            {/* Texto y relato */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8FC1D4]/15 text-[#8FC1D4] border border-[#8FC1D4]/30 text-xs font-mono">
                <Droplets className="w-3.5 h-3.5" />
                <span>Lugar Destacado</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
                Glaciar de Ayoloco: El suspiro final del hielo
              </h2>

              <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
                Declarado oficialmente extinto en 2018, el lecho del Ayoloco se ha convertido en el santuario de memoria ambiental más emotivo de México. Una placa de bronce en la cota de los 4,900 m recuerda a las futuras generaciones el costo del calentamiento global.
              </p>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <span className="text-xs font-mono text-[#E8A15A] uppercase block">
                  Del relato de Martín Hernández (Guía):
                </span>
                <p className="text-xs italic text-white/80 leading-relaxed">
                  "Caminar sobre las lajas pulidas que hace apenas dos décadas estaban cubiertas de seracs azul zafiro te cambia para siempre. Ayoloco hoy nos enseña que el montañismo es un acto de custodia y respeto sagrado."
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Link
                  to={`${basePrefix}/lugar/glaciar-ayoloco`}
                  className="px-6 py-3.5 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-bold text-xs transition-all shadow-lg shadow-[#E8A15A]/20 flex items-center gap-2"
                >
                  <span>Leer ficha completa</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISTA PREVIA DEL MAPA 3D */}
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
              Explora los 14 puntos estratégicos, las rutas de ascenso y el radio de exclusión volcánica del Popocatépetl con MapLibre GL sin costos de API keys.
            </p>
            <Link
              to={`${basePrefix}/explorar`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-semibold text-xs transition-all shadow-lg"
            >
              <Compass className="w-4 h-4" />
              <span>Abrir mapa completo en pantalla completa</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. ÚLTIMA EXPEDICIÓN */}
      <section className="py-20 bg-[#141615] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8A15A] block mb-1">
                Bitácora de Campo
              </span>
              <h2 className="font-serif text-3xl font-bold text-white">
                Última expedición documentada
              </h2>
            </div>
            <Link
              to={`${basePrefix}/bitacora`}
              className="text-xs font-mono text-[#E8A15A] hover:underline flex items-center gap-1.5"
            >
              <span>Ver todas las expediciones</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="rounded-3xl p-6 sm:p-8 bg-[#1A1C1B] border border-white/10 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#9AA3A0]">
                <span className="flex items-center gap-1.5 text-[#E8A15A]">
                  <Calendar className="w-4 h-4" />
                  <span>{ultimaExpedicion.fecha}</span>
                </span>
                <span>·</span>
                <span className="font-mono">{ultimaExpedicion.clima}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {ultimaExpedicion.titulo}
              </h3>

              <p className="text-xs sm:text-sm text-[#9AA3A0] leading-relaxed">
                {ultimaExpedicion.resumen}
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Distancia</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-white">
                    {ultimaExpedicion.distanciaKm} km
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Desnivel +</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#8FC1D4]">
                    +{ultimaExpedicion.desnivelM} m
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] font-mono text-[#9AA3A0] uppercase block">Duración</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#E8A15A]">
                    {ultimaExpedicion.duracionHoras} hrs
                  </span>
                </div>
              </div>
            </div>

            {/* Galería rápida de la expedición */}
            <div className="grid grid-cols-2 gap-3">
              {ultimaExpedicion.fotos.map((f, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden bg-black border border-white/10 relative group ${
                    i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'
                  }`}
                >
                  <img
                    src={`${MEDIA_BASE}/fotos/${f.id}-1280.webp`}
                    alt={f.pie}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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

      {/* 7. LLAMADO FINAL: RECORRE CONMIGO */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-[#141615] via-[#0E0F0F] to-[#080909]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#E8A15A]/15 border border-[#E8A15A]/30 flex items-center justify-center text-[#E8A15A] mx-auto mb-4">
            <Mountain className="w-8 h-8" />
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            ¿Listo para ascender con un guía profesional?
          </h2>

          <p className="text-sm sm:text-base text-[#9AA3A0] max-w-xl mx-auto leading-relaxed">
            Platiquemos sobre tu nivel técnico, fechas ideales y equipo necesario para vivir una experiencia inolvidable con máxima seguridad.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-sm tracking-wide transition-all shadow-xl shadow-[#25D366]/25 flex items-center justify-center gap-2.5 scale-100 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Contactar por WhatsApp</span>
            </a>

            <Link
              to={`${basePrefix}/recorre-conmigo`}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all border border-white/10"
            >
              <span>Ver tipos de recorrido</span>
            </Link>
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
    </div>
  );
};
