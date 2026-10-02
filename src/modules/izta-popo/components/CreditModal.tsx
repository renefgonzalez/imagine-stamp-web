import React from 'react';
import { X, ExternalLink, Award } from 'lucide-react';
import { CREDITOS_MEDIA, CreditoMedia } from '../data/creditos';

interface CreditModalProps {
  fotoId: string;
  onClose: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({ fotoId, onClose }) => {
  const credito = CREDITOS_MEDIA.find((c) => c.archivo.startsWith(fotoId));

  if (!credito) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#1A1C1B] border border-white/15 text-[#F2F1EC] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-[#3F6B4F]/20 text-[#7ec295] border border-[#3F6B4F]/40">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold text-[#F2F1EC]">Atribución de Imagen</h4>
            <p className="text-xs text-[#9AA3A0]">Licencia Libre · Wikimedia Commons</p>
          </div>
        </div>

        <div className="space-y-3 text-xs bg-black/40 p-4 rounded-xl border border-white/5 font-mono">
          <div>
            <span className="text-[#9AA3A0]">Autor:</span>{' '}
            <strong className="text-white">{credito.autor}</strong>
          </div>
          <div>
            <span className="text-[#9AA3A0]">Licencia:</span>{' '}
            <span className="text-[#E8A15A] font-semibold">{credito.licencia}</span>
          </div>
          <div>
            <span className="text-[#9AA3A0]">Resolución capturada:</span>{' '}
            <span className="text-white/90">{credito.resolucion}</span>
          </div>
          {credito.origenLugar && (
            <div>
              <span className="text-[#9AA3A0]">Nota:</span>{' '}
              <span className="text-white/70 italic">{credito.origenLugar}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <a
            href={credito.fuenteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#E8A15A] hover:underline font-mono"
          >
            <span>Ver archivo en Wikimedia Commons</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
