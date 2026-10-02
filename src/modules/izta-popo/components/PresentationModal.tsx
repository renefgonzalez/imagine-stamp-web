import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { SmartVideo } from './SmartVideo';
import { GUIDE_NAME, CLIENT_NAME } from '../config';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElementRef?: React.RefObject<HTMLElement | null>;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  isOpen,
  onClose,
  triggerElementRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Escuchar tecla ESC y click fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Bloquear scroll del fondo
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    // Foco en el botón de cerrar al abrir
    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      // Devolver foco al elemento disparador
      if (triggerElementRef?.current) {
        triggerElementRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerElementRef]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Video de presentación de Conocimiento de la Montaña"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141615] border border-white/15 shadow-2xl transition-all duration-200 flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-white/10 bg-black/60 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-mono font-bold uppercase bg-[#E8A15A]/20 text-[#E8A15A] border border-[#E8A15A]/30 shrink-0">
              SD · VIDEO
            </span>
            <span className="text-[11px] sm:text-xs font-serif font-semibold text-white/90 truncate">
              {CLIENT_NAME} · {GUIDE_NAME}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            aria-label="Cerrar reproductor"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Reproductor de Video (ajuste perfecto sin entrecortar en móviles) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <SmartVideo
            videoId="presentacion"
            titulo={`Presentación: ${CLIENT_NAME}`}
            resolucionNativa="SD"
            pesoOriginalGB={0.015}
            autoPlay={true}
            muted={false} // Inicia con sonido a petición del usuario
            controls={true}
            objectFit="contain"
            className="w-full h-full rounded-none border-none shadow-none"
          />
        </div>

        {/* Pie informativo del video adaptativo a móvil */}
        <div className="px-3 sm:px-5 py-2 sm:py-2.5 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] sm:text-xs text-[#9AA3A0]">
          <span>Duración: 1:27 min · Grabación documental de fauna y flora</span>
          <span className="font-mono text-[10px] text-white/60">Resolución nativa: 1024×576 SD</span>
        </div>
      </div>
    </div>
  );
};
