import React from 'react';

interface LogoVolcanesProps {
  className?: string;
  size?: number; // Tamaño del contenedor en píxeles (40px)
  strokeColor?: string;
  fill?: boolean;
}

export const LogoVolcanes: React.FC<LogoVolcanesProps> = ({
  className = '',
  size = 40,
  strokeColor = '#E8A15A',
  fill = false,
}) => {
  return (
    <div
      className={`rounded-full bg-[#181918] border border-[#B88A4A]/60 flex items-center justify-center shrink-0 shadow-md ${className}`}
      style={{ width: size, height: size }}
      title="Conocimiento de la Montaña · Iztaccíhuatl & Popocatépetl"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[74%] h-[74%]"
      >
        {/*
          Trazo único, grueso y limpio (estilo minimalista):
          - Izquierda: Silueta de la Mujer Dormida (Iztaccíhuatl: pies, rodilla, pecho y cabeza)
          - Centro: Depresión del Paso de Cortés
          - Derecha: Silueta cónica del Popocatépetl con cráter
          - Base: Línea recta inferior cerrada
        */}
        <path
          d="M 7.5 34.5 L 12.5 24 L 16 26.5 L 20.5 18.5 L 23.5 22 L 26.5 28 L 34.5 16 L 36.8 16.8 L 40.5 34.5 Z"
          stroke={strokeColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={fill ? `${strokeColor}22` : 'none'}
        />
      </svg>
    </div>
  );
};
