import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Mountain,
  Calendar,
  Compass,
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  MapPin,
  Trees,
  Maximize2
} from 'lucide-react';
import { LUGARES, Lugar } from '../data/lugares';
import { CATEGORIAS } from '../data/categorias';
import { Gallery } from '../components/Gallery';
import { SmartVideo } from '../components/SmartVideo';
import { Map3D } from '../components/Map3D';
import { PlaceCard } from '../components/PlaceCard';
import { haversineDistance, isWithinPopoRadius } from '../lib/geo';
import { MEDIA_BASE } from '../config';

export const LugarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const basePrefix = '/izta-popo';

  const lugar = LUGARES.find((l) => l.id === id) || LUGARES[0];
  const cat = CATEGORIAS[lugar.categoria];
  const isPopoExclusion = isWithinPopoRadius(lugar.coords);

  // Calcular los 3 lugares más cercanos mediante distancia Haversine
  const lugaresCercanos = LUGARES.filter((l) => l.id !== lugar.id)
    .map((l) => ({
      lugar: l,
      distancia: haversineDistance(lugar.coords, l.coords),
    }))
    .sort((a, b) => a.distancia - b.distancia)
    .slice(0, 3)
    .map((item) => item.lugar);

  const mainFoto = lugar.fotos[0]?.id || 'hero-volcanes';
  const heroFotoUrl = `${MEDIA_BASE}/fotos/${mainFoto}-2560.webp`;

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-24">
      {/* 1. HERO CON LA FOTO O VIDEO PRINCIPAL */}
      <section className="relative w-full h-[60vh] sm:h-[75vh] overflow-hidden bg-black">
        {lugar.video ? (
          <div className="w-full h-full">
            <SmartVideo
              videoId={lugar.video.id}
              titulo={lugar.nombre}
              resolucionNativa={lugar.video.resolucion}
              pesoOriginalGB={lugar.video.pesoOriginalGB}
              autoPlay={true}
              loop={true}
              muted={true}
              className="w-full h-full rounded-none border-none"
            />
          </div>
        ) : (
          <img
            src={heroFotoUrl}
            alt={lugar.nombre}
            className="w-full h-full object-cover scale-105 filter brightness-85"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F0F] via-black/40 to-transparent pointer-events-none" />

        {/* Botón Volver y Categoría */}
        <div className="absolute top-6 left-4 sm:left-8 right-4 flex items-center justify-between z-20">
          <Link
            to={`${basePrefix}/explorar`}
            className="px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-xs font-medium text-white backdrop-blur-md transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al mapa</span>
          </Link>

          <span
            className="px-3 py-1 rounded-xl text-xs font-mono font-semibold text-white backdrop-blur-md shadow-lg flex items-center gap-1.5"
            style={{ backgroundColor: `${cat.colorHex}EE` }}
          >
            <cat.icon className="w-3.5 h-3.5" />
            <span>{cat.nombre}</span>
          </span>
        </div>

        {/* Título en la base del Hero */}
        <div className="absolute bottom-8 inset-x-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 pointer-events-none">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono text-[#E8A15A] uppercase tracking-widest block font-bold">
              {lugar.altitud.toLocaleString()} METROS DE ALTITUD
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-2xl">
              {lugar.nombre}
            </h1>
            <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed drop-shadow">
              {lugar.resumen}
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTENIDO PRINCIPAL: FICHA TÉCNICA + RELATO EDITORIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Avisos de protección o volcánicos */}
        <div className="space-y-4 mb-10">
          {isPopoExclusion && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#C2502E]/15 border border-[#C2502E]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#f89b82]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#C2502E] shrink-0" />
                <div>
                  <h4 className="font-semibold text-white text-sm">Zona de Exclusión Volcánica Activa</h4>
                  <p className="text-[#f89b82]/90 mt-0.5">
                    Este punto se encuentra dentro del radio de 12 km del cráter del Popocatépetl. El ascenso está restringido por actividad volcánica. Consulta el semáforo oficial de CENAPRED antes de planear tu salida.
                  </p>
                </div>
              </div>
              <a
                href="https://www.gob.mx/cenapred"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#C2502E] hover:bg-[#d85c37] text-white font-semibold text-xs whitespace-nowrap transition-colors"
              >
                Consultar CENAPRED →
              </a>
            </div>
          )}

          {lugar.sensible && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#B88A4A]/15 border border-[#B88A4A]/30 flex items-center gap-3 text-xs text-[#f2dcad]">
              <ShieldCheck className="w-6 h-6 text-[#B88A4A] shrink-0" />
              <div>
                <h4 className="font-semibold text-white text-sm">Patrimonio Arqueológico Protegido</h4>
                <p className="text-[#f2dcad]/90 mt-0.5">
                  Por protección del patrimonio arqueológico y para evitar saqueos de vestigios ceremoniales prehispánicos, las coordenadas en el mapa se muestran de forma aproximada.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Columna Izquierda: Ficha Técnica (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-3xl bg-[#141615] border border-white/10 space-y-4 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-white pb-3 border-b border-white/10 flex items-center gap-2">
                <Mountain className="w-5 h-5 text-[#E8A15A]" />
                <span>Ficha Técnica de Expedición</span>
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-[#9AA3A0] block text-[10px] uppercase">Altitud Oficial</span>
                  <span className="text-white text-sm font-bold">{lugar.altitud.toLocaleString()} m</span>
                </div>

                <div>
                  <span className="text-[#9AA3A0] block text-[10px] uppercase">Coordenadas GPS</span>
                  <span className="text-[#8FC1D4] text-xs">
                    {lugar.sensible ? (
                      'Zona aproximada (Protegida)'
                    ) : (
                      `[${lugar.coords[0].toFixed(4)}, ${lugar.coords[1].toFixed(4)}]`
                    )}
                  </span>
                </div>

                <div>
                  <span className="text-[#9AA3A0] block text-[10px] uppercase">Temporada Recomendada</span>
                  <span className="text-white text-xs">{lugar.temporada}</span>
                </div>

                <div>
                  <span className="text-[#9AA3A0] block text-[10px] uppercase">Nivel de Dificultad</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold mt-1 ${
                      lugar.dificultad === 'Fácil'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : lugar.dificultad === 'Media'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {lugar.dificultad}
                  </span>
                </div>

                <div>
                  <span className="text-[#9AA3A0] block text-[10px] uppercase">Última Visita Guiada</span>
                  <span className="text-white text-xs">{lugar.fechaVisita}</span>
                </div>
              </div>
            </div>

            {/* Mini Mapa 3D enfocado en este lugar */}
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-xl h-64 relative">
              <Map3D
                lugaresFiltrados={[lugar]}
                lugarSeleccionado={lugar}
                centroInicial={lugar.coords}
                zoomInicial={13.5}
                modoCompacto={true}
              />
            </div>
          </div>

          {/* Columna Derecha: Relato Editorial del Guía (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <span className="text-xs font-mono text-[#E8A15A] uppercase tracking-wider block mb-2">
                Diario de Ascenso
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
                Crónica de la montaña
              </h2>

              <div className="space-y-6 text-[#F2F1EC]/90 text-sm sm:text-base leading-relaxed max-w-[70ch]">
                {lugar.relato.map((parrafo, i) => (
                  <p key={i} className="first-letter:text-3xl first-letter:font-serif first-letter:text-[#E8A15A] first-letter:mr-1">
                    {parrafo}
                  </p>
                ))}
              </div>
            </div>

            {/* Video si está presente y no es el hero */}
            {lugar.video && (
              <div className="space-y-3 pt-6 border-t border-white/10">
                <h3 className="font-serif text-xl font-bold text-white">
                  Registro de Video 4K
                </h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
                  <SmartVideo
                    videoId={lugar.video.id}
                    titulo={lugar.nombre}
                    resolucionNativa={lugar.video.resolucion}
                    pesoOriginalGB={lugar.video.pesoOriginalGB}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. GALERÍA DE FOTOS EN ALTA RESOLUCIÓN */}
        <div className="mt-20 pt-12 border-t border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#E8A15A] block mb-1">
                Resolución Gigapíxel
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Galería fotográfica de {lugar.nombre}
              </h3>
            </div>
            <p className="text-xs text-[#9AA3A0] max-w-sm">
              Haz clic en cualquier imagen para abrir el visor Deep Zoom y examinar el detalle de roca y vegetación.
            </p>
          </div>

          <Gallery fotos={lugar.fotos} />
        </div>

        {/* 4. LUGARES CERCANOS */}
        <div className="mt-24 pt-12 border-t border-white/10 space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8FC1D4] block mb-1">
              Continuar la travesía
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              Lugares cercanos a {lugar.nombre}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lugaresCercanos.map((cercano) => (
              <PlaceCard key={cercano.id} lugar={cercano} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
