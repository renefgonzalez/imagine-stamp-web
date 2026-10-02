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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0E0F0F]/95 backdrop-blur-xl animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[1100px] rounded-3xl overflow-hidden bg-[#1A1C1B] border border-white/15 shadow-2xl transition-all duration-250 transform scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#E8A15A]/20 text-[#E8A15A] border border-[#E8A15A]/30">
              SD · Video Oficial
            </span>
            <span className="text-xs font-serif font-semibold text-white/90 truncate">
              {CLIENT_NAME} — por {GUIDE_NAME}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            aria-label="Cerrar reproductor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reproductor de Video */}
        <div className="relative aspect-video w-full bg-black">
          <SmartVideo
            videoId="presentacion"
            titulo={`Presentación: ${CLIENT_NAME}`}
            resolucionNativa="SD"
            pesoOriginalGB={0.015}
            autoPlay={true}
            muted={false} // Inicia con sonido a petición del usuario
            controls={true}
            className="w-full h-full"
          />
        </div>

        {/* Pie informativo del video */}
        <div className="px-5 py-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs text-[#9AA3A0]">
          <span>Duración: 1:27 min · Grabación documental de fauna y flora</span>
          <span className="font-mono text-[11px] text-white/60">Resolución nativa: 1024×576 SD</span>
        </div>
      </div>
    </div>
  );
};
