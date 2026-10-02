import React from 'react';

interface LogoVolcanesProps {
  className?: string;
  size?: number; // Tamaño del badge (por defecto 44px)
  strokeColor?: string;
  fill?: boolean;
}

export const LogoVolcanes: React.FC<LogoVolcanesProps> = ({
  className = '',
  size = 44,
  strokeColor = '#E8A15A',
  fill = false,
}) => {
  return (
    <div
      className={`rounded-full bg-[#161716] border border-[#B88A4A]/60 flex items-center justify-center shrink-0 shadow-md ${className}`}
      style={{ width: size, height: size }}
      title="Conocimiento de la Montaña · Iztaccíhuatl & Popocatépetl"
    >
      <svg
        viewBox="0 0 52 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        {/*
          Silueta alargada y panorámica inspirada en la Sierra Nevada al atardecer:
          - Izquierda: Iztaccíhuatl alargado (la Mujer Dormida con pies, rodillas, pecho amplio y cabeza)
          - Centro: Amplio collado del Paso de Cortés
          - Derecha: Cono majestuoso del Popocatépetl con su cráter
          - Trazo único, grueso y limpio (sin líneas internas confusas)
        */}
        <path
          d="M 3.5 28.5 
             L 7 27.5 
             L 9.5 25 
             L 12 23 
             L 14 24 
             L 17 20 
             L 20.5 20.5 
             L 23 23 
             L 25.5 22.5 
             L 28 26 
             L 32 26.5 
             L 34.5 25.5 
             L 42 16 
             L 43.5 16.3 
             L 48.5 28.5 
             Z"
          stroke={strokeColor}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={fill ? `${strokeColor}20` : 'none'}
        />
      </svg>
    </div>
  );
};
