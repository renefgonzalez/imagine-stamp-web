import React from 'react';
import { AlertTriangle, Wifi, X } from 'lucide-react';
import { useQuality } from '../context/QualityContext';

export const WeightWarningModal: React.FC = () => {
  const { weightDialog } = useQuality();

  if (!weightDialog.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#1A1C1B] border border-[#E8A15A]/30 text-[#F2F1EC] shadow-2xl">
        <button
          onClick={weightDialog.onCancel}
          className="absolute top-4 right-4 p-1 rounded-lg text-[#9AA3A0] hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-[#E8A15A]/15 text-[#E8A15A] border border-[#E8A15A]/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#F2F1EC]">Aviso de Consumo de Datos</h3>
            <p className="text-xs text-[#9AA3A0]">Modo Original 4K Ultra HD</p>
          </div>
        </div>

        <div className="p-4 mb-5 rounded-xl bg-black/40 border border-white/5 text-sm space-y-2">
          {weightDialog.titulo && (
            <p className="font-medium text-white/90">
              Archivo: <span className="text-[#E8A15A]">{weightDialog.titulo}</span>
            </p>
          )}
          <p className="text-[#9AA3A0] text-xs leading-relaxed">
            Este medio en su calidad original completa tiene un peso aproximado de{' '}
            <strong className="text-white font-mono">{weightDialog.pesoMB} MB</strong>.
            En dispositivos móviles o conexiones con límite de gigabytes puede generar consumo elevado.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-[#8FC1D4]">
            <Wifi className="w-3.5 h-3.5" />
            <span>Se recomienda conexión Wi-Fi de alta velocidad o fibra óptica.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={weightDialog.onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#9AA3A0] hover:text-white hover:bg-white/5 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={weightDialog.onConfirm}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#E8A15A] text-[#0E0F0F] hover:bg-[#f0b070] transition-colors shadow-lg shadow-[#E8A15A]/20"
          >
            Continuar y Reproducir
          </button>
        </div>
      </div>
    </div>
  );
};
