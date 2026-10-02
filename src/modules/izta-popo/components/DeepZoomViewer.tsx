import React, { useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { X, ZoomIn, ZoomOut, RotateCcw, Download, Sparkles, Info } from 'lucide-react';
import { MEDIA_BASE } from '../config';
import { CREDITOS_MEDIA } from '../data/creditos';

interface DeepZoomViewerProps {
  fotoId: string;
  alt: string;
  megapixeles?: number;
  onClose: () => void;
}

export const DeepZoomViewer: React.FC<DeepZoomViewerProps> = ({
  fotoId,
  alt,
  megapixeles = 40,
  onClose,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdInstance = useRef<OpenSeadragon.Viewer | null>(null);
  const [downloadTooltip, setDownloadTooltip] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Buscar información de crédito
  const credito = CREDITOS_MEDIA.find((c) => c.archivo.startsWith(fotoId));

  useEffect(() => {
    if (!viewerRef.current) return;

    const dziUrl = `${MEDIA_BASE}/dzi/${fotoId}.dzi`;
    const fallbackImage = `${MEDIA_BASE}/fotos/${fotoId}-2560.webp`;

    try {
      osdInstance.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.1/images/',
        tileSources: dziUrl,
        showNavigationControl: false,
        animationTime: 0.6,
        blendTime: 0.2,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2.5,
        minZoomImageRatio: 0.8,
        visibilityRatio: 0.9,
        springStiffness: 8.0,
      });

      // Si falla la carga del DZI, fallback a imagen única
      osdInstance.current.addHandler('open-failed', () => {
        setLoadError(true);
        if (osdInstance.current) {
          (osdInstance.current as any).open({
            type: 'image',
            url: fallbackImage,
          });
        }
      });
    } catch (e) {
      setLoadError(true);
    }

    // Navegación con teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') osdInstance.current?.viewport?.zoomBy(1.2);
      if (e.key === '-') osdInstance.current?.viewport?.zoomBy(0.8);
      if (e.key === '0') osdInstance.current?.viewport?.goHome();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (osdInstance.current) {
        osdInstance.current.destroy();
        osdInstance.current = null;
      }
    };
  }, [fotoId]);

  const zoomIn = () => osdInstance.current?.viewport?.zoomBy(1.3);
  const zoomOut = () => osdInstance.current?.viewport?.zoomBy(0.7);
  const resetZoom = () => osdInstance.current?.viewport?.goHome();

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#070808]/98 backdrop-blur-2xl text-[#F2F1EC] select-none animate-fade-in-up">
      {/* Barra superior de control */}
      <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between gap-4 bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm sm:text-base font-semibold truncate max-w-xs sm:max-w-md">
              {alt}
            </h3>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#9AA3A0]">
              <span className="text-[#E8A15A] font-bold">{megapixeles} MP</span>
              <span>·</span>
              <span>Deep Zoom Ultra HD</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          {/* Controles de Zoom */}
          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
            <button
              onClick={zoomIn}
              className="p-1.5 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
              title="Acercar (+)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={zoomOut}
              className="p-1.5 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
              title="Alejar (-)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
              title="Restablecer vista"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Descargar Original (deshabilitado en demo) */}
          <div className="relative">
            <button
              onClick={() => setDownloadTooltip(!downloadTooltip)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#9AA3A0] hover:text-white hover:bg-white/10 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descargar original</span>
            </button>

            {downloadTooltip && (
              <div className="absolute right-0 top-12 w-64 p-3 rounded-xl bg-[#1A1C1B] border border-[#E8A15A]/30 text-[11px] text-[#9AA3A0] shadow-2xl z-20">
                <div className="flex items-center gap-1.5 text-[#E8A15A] font-semibold mb-1">
                  <Info className="w-3.5 h-3.5" />
                  <span>Función de demo</span>
                </div>
                La descarga directa del archivo RAW original de {megapixeles} MP estará disponible en la versión final alojada en Bunny Storage.
              </div>
            )}
          </div>

          {/* Cerrar */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-[#E8A15A] hover:text-black text-white transition-colors"
            title="Cerrar visor (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Contenedor del visor OpenSeadragon */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#0A0B0B]">
        <div ref={viewerRef} className="w-full h-full" />

        {/* Guía de navegación para el usuario */}
        <div className="absolute bottom-16 left-6 pointer-events-none px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white/70 font-mono">
          Desplaza con el cursor o rueda del mouse para explorar hasta el nivel microscópico
        </div>
      </div>

      {/* Línea de créditos inferior obligatoria */}
      <div className="h-10 px-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#9AA3A0] bg-black/60">
        <div className="truncate max-w-xl">
          {credito ? (
            <span>
              Foto: <strong className="text-white">{credito.autor}</strong> · Licencia {credito.licencia}
              {credito.origenLugar ? ` (${credito.origenLugar})` : ''}
            </span>
          ) : (
            <span>Foto de expedición · Izta-Popo Expediciones</span>
          )}
        </div>
        <div className="hidden sm:block text-[11px] text-white/50">
          Usa [+] y [-] para zoom · [0] centrar · [Esc] salir
        </div>
      </div>
    </div>
  );
};
