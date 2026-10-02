import React, { createContext, useContext, useState, useEffect } from 'react';

export type QualityMode = 'ligero' | 'alta' | 'original';

interface WeightDialogInfo {
  isOpen: boolean;
  pesoMB: number;
  tipo: 'video' | 'foto';
  titulo?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

interface QualityContextType {
  mode: QualityMode;
  setMode: (mode: QualityMode) => void;
  autoDetectedSlow: boolean;
  toastMessage: string | null;
  dismissToast: () => void;
  requestOriginalQuality: (pesoMB: number, tipo: 'video' | 'foto', titulo: string, onConfirm: () => void) => void;
  weightDialog: WeightDialogInfo;
}

const STORAGE_KEY = 'izta_popo_quality_mode';

const QualityContext = createContext<QualityContextType | null>(null);

export const QualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<QualityMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ligero' || saved === 'alta' || saved === 'original') {
        return saved;
      }
    } catch (e) {
      // LocalStorage bloqueado o inaccesible
    }

    // Detección automática por conexión lenta o ahorro de datos
    if (typeof navigator !== 'undefined') {
      const conn = (navigator as any).connection;
      if (conn?.saveData === true || conn?.effectiveType === '2g' || conn?.effectiveType === '3g') {
        return 'ligero';
      }
    }

    return 'alta'; // Predeterminado
  });

  const [autoDetectedSlow, setAutoDetectedSlow] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [weightDialog, setWeightDialog] = useState<WeightDialogInfo>({
    isOpen: false,
    pesoMB: 0,
    tipo: 'video',
    onConfirm: () => {},
    onCancel: () => {},
  });

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const conn = (navigator as any).connection;
      if (conn?.saveData === true || conn?.effectiveType === '2g' || conn?.effectiveType === '3g') {
        setAutoDetectedSlow(true);
        setToastMessage('Detectamos una conexión lenta o modo ahorro. Iniciamos en calidad "Ligero" para ahorrar datos.');
      }
    }
  }, []);

  const setMode = (newMode: QualityMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch (e) {
      // ignorar
    }
  };

  const dismissToast = () => setToastMessage(null);

  const requestOriginalQuality = (
    pesoMB: number,
    tipo: 'video' | 'foto',
    titulo: string,
    onConfirm: () => void
  ) => {
    // Si pesa más de 50 MB mostramos diálogo informativo
    if (pesoMB > 50) {
      setWeightDialog({
        isOpen: true,
        pesoMB,
        tipo,
        titulo,
        onConfirm: () => {
          setWeightDialog(prev => ({ ...prev, isOpen: false }));
          onConfirm();
        },
        onCancel: () => {
          setWeightDialog(prev => ({ ...prev, isOpen: false }));
        },
      });
    } else {
      onConfirm();
    }
  };

  return (
    <QualityContext.Provider
      value={{
        mode,
        setMode,
        autoDetectedSlow,
        toastMessage,
        dismissToast,
        requestOriginalQuality,
        weightDialog,
      }}
    >
      {children}
    </QualityContext.Provider>
  );
};

export function useQuality(): QualityContextType {
  const ctx = useContext(QualityContext);
  if (!ctx) {
    throw new Error('useQuality debe usarse dentro de un QualityProvider');
  }
  return ctx;
}
