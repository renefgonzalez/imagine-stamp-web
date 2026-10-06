import React, { useEffect, useRef } from 'react';
import { X, Trees, ExternalLink, Sparkles, BookOpen, Compass, Droplets, ShieldCheck, HeartHandshake } from 'lucide-react';
import { CARTA_BIENVENIDA } from '../data/bienvenida';
import { MEDIA_BASE, CLIENT_NAME, GUIDE_NAME } from '../config';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerElementRef?: React.RefObject<HTMLElement | null>;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  triggerElementRef
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
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
      aria-label="Carta de bienvenida del proyecto Conocimiento de la Montaña"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-xl animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl overflow-hidden bg-[#121413] border border-white/15 shadow-2xl flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera fija */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E8A15A]/20 text-[#E8A15A] border border-[#E8A15A]/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Carta de Bienvenida
            </span>
            <span className="hidden sm:inline text-xs font-serif text-white/70">
              {CLIENT_NAME}
            </span>
          </div>

          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Cerrar carta de bienvenida"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll elegante */}
        <div className="overflow-y-auto px-6 sm:px-10 py-8 space-y-8 text-[#F2F1EC] scrollbar-thin scrollbar-thumb-white/20">
          
          {/* Encabezado */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E8A15A] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Mensaje del Fundador</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {CARTA_BIENVENIDA.titulo}
            </h2>
            <p className="text-sm sm:text-base text-[#9AA3A0]">
              {CARTA_BIENVENIDA.subtitulo}
            </p>
          </div>

          {/* Cita reflexiva destacada */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#E8A15A]/15 to-[#3F6B4F]/15 border border-[#E8A15A]/25 relative overflow-hidden">
            <blockquote className="font-serif text-lg sm:text-xl italic text-white leading-relaxed">
              “Si alguna vez has estado en el bosque sabes de la energía tan poderosa que tiene la naturaleza, y como habitantes de nuestro planeta hemos olvidado lo esencial de esta para nuestras vidas.”
            </blockquote>
          </div>

          {/* Párrafos principales */}
          <div className="space-y-4 text-sm sm:text-base text-[#D4D3CD] leading-relaxed font-light">
            <p>{CARTA_BIENVENIDA.parrafos[0]}</p>
            <p className="font-medium text-white/95">{CARTA_BIENVENIDA.parrafos[1]}</p>
            <p>{CARTA_BIENVENIDA.parrafos[2]}</p>
            <p>{CARTA_BIENVENIDA.parrafos[3]}</p>
            <p>{CARTA_BIENVENIDA.parrafos[4]}</p>
            <p className="p-4 rounded-xl bg-white/5 border border-white/10 text-white font-normal">
              {CARTA_BIENVENIDA.parrafos[5]}
            </p>
          </div>

          {/* Sección 4 Tipos de Bosques */}
          <div className="p-6 rounded-2xl bg-[#181B19] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-[#8FC1D4]">
              <Trees className="w-5 h-5" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Los 4 Grandes Tipos de Bosques en el Mundo
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#9AA3A0]">
              {CARTA_BIENVENIDA.tiposBosques.introduccion}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {CARTA_BIENVENIDA.tiposBosques.items.map((tipo, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-center font-serif font-bold text-xs sm:text-sm text-white hover:border-[#E8A15A]/50 transition-colors"
                >
                  <span className="text-[#E8A15A] mr-1.5 font-mono text-xs">{idx + 1}.</span>
                  {tipo}
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <a
                href={CARTA_BIENVENIDA.tiposBosques.fuenteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8FC1D4] hover:text-white transition-colors"
              >
                <span>Fuente: {CARTA_BIENVENIDA.tiposBosques.fuenteNombre}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sección Programas de Reforestación */}
          <div className="p-6 rounded-2xl bg-[#181B19] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-[#E8A15A]">
              <HeartHandshake className="w-5 h-5" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                Campañas e Iniciativas de Reforestación
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#9AA3A0]">
              {CARTA_BIENVENIDA.reforestacion.introduccion}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {CARTA_BIENVENIDA.reforestacion.iniciativas.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#E8A15A]/50 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#E8A15A] uppercase tracking-wide">
                      {item.entidad}
                    </span>
                    <h4 className="font-serif text-base font-bold text-white group-hover:text-[#E8A15A] transition-colors flex items-center justify-between">
                      <span>{item.sigla}</span>
                      <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-[#E8A15A]" />
                    </h4>
                    <p className="text-xs text-[#9AA3A0] leading-snug">
                      {item.nombreCompleto}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Cierre inspirador */}
          <div className="text-center pt-2 pb-4 space-y-4">
            <p className="font-serif text-xl sm:text-2xl font-bold text-white">
              {CARTA_BIENVENIDA.cierre}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-[#E8A15A] hover:bg-[#d68f47] text-[#0E0F0F] font-bold text-xs transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Continuar explorando el sitio</span>
              <Compass className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
