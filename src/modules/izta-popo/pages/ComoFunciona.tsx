import React, { useState } from 'react';
import {
  UploadCloud,
  Film,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
  Zap,
  Server,
  Eye
} from 'lucide-react';
import { ExifDropDemo } from '../components/ExifDropDemo';
import { AdminMockup } from '../components/AdminMockup';
import { DeepZoomViewer } from '../components/DeepZoomViewer';
import { MEDIA_BASE } from '../config';

export const ComoFuncionaPage: React.FC = () => {
  const [showDeepZoomDemo, setShowDeepZoomDemo] = useState(false);

  return (
    <div className="w-full text-[#F2F1EC] bg-[#0E0F0F] pb-28">
      {/* Cabecera */}
      <section className="pt-16 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TECNOLOGÍA & CAPACIDADES DE LA PLATAFORMA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Cómo funcionará tu portal oficial
          </h1>

          <p className="text-sm sm:text-base text-[#9AA3A0] leading-relaxed">
            Este proyecto está concebido específicamente para guías y exploradores que necesitan compartir la majestuosidad de la alta montaña con fotografías de 50 MP, videos 4K fluidos y un mapa 3D interactivo que se expande tras cada recorrido.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* BLOQUE 1: DEMO FUNCIONAL EXIF GPS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8A15A] uppercase tracking-wider">
            <span>01 · Automatización de Rutas</span>
          </div>
          <ExifDropDemo />
        </section>

        {/* BLOQUE 2: VIDEOS 4K ADAPTATIVOS CON BUNNY STREAM */}
        <section className="rounded-3xl p-8 sm:p-12 bg-[#141615] border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-mono text-[#8FC1D4] uppercase tracking-wider block">
              02 · Transmisión sin Cortes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Tus videos en 4K sin perder un ápice de calidad
            </h2>
            <p className="text-sm text-[#9AA3A0] leading-relaxed">
              En plataformas tradicionales como redes sociales o web estándar, los videos 4K son recomprimidos violentamente hasta perder texturas de roca y fumarolas. En tu sitio web implementamos el selector de 3 modos:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <Zap className="w-4 h-4 text-[#E8A15A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">⚡ Modo Ligero (720p):</strong>
                  <span className="text-[#9AA3A0] block">Para visitantes en la montaña con señal celular 3G. Carga inmediata y mínimo consumo de megas.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <Film className="w-4 h-4 text-[#8FC1D4] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">🎬 Modo Alta Calidad (1080p / HLS):</strong>
                  <span className="text-[#9AA3A0] block">Ajuste adaptativo segundo a segundo según la velocidad de conexión del usuario.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-[#E8A15A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">💎 Modo Original 4K (Ultra HD):</strong>
                  <span className="text-[#9AA3A0] block">El archivo maestro sin recompresión para pantallas 4K y conexiones de fibra óptica con aviso de ancho de banda.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-white/10 shadow-2xl">
            <img
              src={`${MEDIA_BASE}/fotos/mirador-popo-1280.webp`}
              alt="Transmisión 4K"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
              <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/15 space-y-2">
                <Server className="w-8 h-8 text-[#8FC1D4] mx-auto" />
                <h4 className="font-mono text-sm font-bold text-white">Preparado para Bunny Stream CDN</h4>
                <p className="text-[11px] text-[#9AA3A0]">
                  Costos ultra bajos por gigabyte y distribución global instantánea.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE 3: DEEP ZOOM EN FOTOS GIGAPÍXEL */}
        <section className="rounded-3xl p-8 sm:p-12 bg-[#141615] border border-white/10 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden aspect-[4/3] bg-black border border-white/10 shadow-2xl group cursor-pointer" onClick={() => setShowDeepZoomDemo(true)}>
            <img
              src={`${MEDIA_BASE}/fotos/bosque-hartwegii-1280.webp`}
              alt="Deep Zoom Demo 40 MP"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <span className="px-3 py-1 rounded-full bg-[#E8A15A] text-black text-xs font-mono font-bold self-start mb-2 shadow-lg">
                FOTOGRAFÍA 40.3 MEGAPÍXELES
              </span>
              <p className="text-sm font-semibold text-white">Pinus hartwegii centenario a 3,750 m</p>
              <span className="text-xs text-[#E8A15A] flex items-center gap-1.5 mt-2 font-mono">
                <Maximize2 className="w-3.5 h-3.5" />
                Haz clic para probar el visor Deep Zoom
              </span>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-5">
            <span className="text-xs font-mono text-[#E8A15A] uppercase tracking-wider block">
              03 · Zoom Profundo Sin Descargar Gigabytes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Fotos con zoom hasta el último detalle de la roca
            </h2>
            <p className="text-sm text-[#9AA3A0] leading-relaxed">
              ¿Cómo mostrar una foto de 50 Megapíxeles tomada con tu cámara profesional sin que la página tarde un minuto en cargar?
            </p>
            <p className="text-xs text-[#9AA3A0] leading-relaxed">
              Utilizamos la tecnología <strong>Deep Zoom (DZI)</strong>: la imagen se fragmenta automáticamente en miles de mosaicos piramidales de 512 píxeles. El visitante solo descarga exactamente los mosaicos que caben en su pantalla mientras hace zoom suavemente, logrando una fluidez de 60 cuadros por segundo.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDeepZoomDemo(true)}
                className="px-6 py-3 rounded-2xl bg-[#E8A15A] hover:bg-[#f3b578] text-black font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-[#E8A15A]/20"
              >
                <Eye className="w-4 h-4" />
                <span>Abrir demostración de Deep Zoom (40 MP)</span>
              </button>
            </div>
          </div>
        </section>

        {/* BLOQUE 4: TU BITÁCORA CRECE CON CADA RECORRIDO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#E8A15A] uppercase tracking-wider">
            <span>04 · Panel de Control Simple</span>
          </div>
          <AdminMockup />
        </section>
      </div>

      {/* Visor Deep Zoom Modal de Demostración */}
      {showDeepZoomDemo && (
        <DeepZoomViewer
          fotoId="bosque-hartwegii"
          alt="Pinus hartwegii centenario · Muestra Deep Zoom 40.3 MP"
          megapixeles={40.3}
          onClose={() => setShowDeepZoomDemo(false)}
        />
      )}
    </div>
  );
};
