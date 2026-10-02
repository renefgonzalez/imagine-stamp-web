import { Trees, Landmark, Droplets, PawPrint, Compass } from 'lucide-react';
import React from 'react';

export type CategoriaId = 'ecosistema' | 'arqueologia' | 'agua' | 'fauna' | 'curiosidad';

export interface CategoriaConfig {
  id: CategoriaId;
  nombre: string;
  descripcion: string;
  colorHex: string;
  colorNombre: string;
  badgeClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CATEGORIAS: Record<CategoriaId, CategoriaConfig> = {
  ecosistema: {
    id: 'ecosistema',
    nombre: 'Ecosistemas',
    descripcion: 'Pisos biológicos únicos, desde el bosque templado hasta la roca alpina.',
    colorHex: '#3F6B4F', // Pino
    colorNombre: 'pino',
    badgeClass: 'bg-[#3F6B4F]/20 text-[#7ec295] border-[#3F6B4F]/40',
    icon: Trees,
  },
  arqueologia: {
    id: 'arqueologia',
    nombre: 'Arqueología',
    descripcion: 'Santuarios de altura, adoratorios a Tláloc y vestigios prehispánicos.',
    colorHex: '#B88A4A', // Ocre
    colorNombre: 'ocre',
    badgeClass: 'bg-[#B88A4A]/20 text-[#ecd09b] border-[#B88A4A]/40',
    icon: Landmark,
  },
  agua: {
    id: 'agua',
    nombre: 'Agua y Glaciares',
    descripcion: 'Cuencas vivas, manantiales de deshielo y la memoria del hielo extinto.',
    colorHex: '#8FC1D4', // Glaciar
    colorNombre: 'glaciar',
    badgeClass: 'bg-[#8FC1D4]/20 text-[#8FC1D4] border-[#8FC1D4]/40',
    icon: Droplets,
  },
  fauna: {
    id: 'fauna',
    nombre: 'Fauna',
    descripcion: 'Especies endémicas como el teporingo y aves rapaces de grandes alturas.',
    colorHex: '#E8A15A', // Amanecer
    colorNombre: 'amanecer',
    badgeClass: 'bg-[#E8A15A]/20 text-[#E8A15A] border-[#E8A15A]/40',
    icon: PawPrint,
  },
  curiosidad: {
    id: 'curiosidad',
    nombre: 'Curiosidades e Historia',
    descripcion: 'Pasos legendarios, relatos geológicos y cumbres icónicas.',
    colorHex: '#D47D3B', // Terracota / Amanecer intenso
    colorNombre: 'amanecer',
    badgeClass: 'bg-[#D47D3B]/20 text-[#f5a770] border-[#D47D3B]/40',
    icon: Compass,
  },
};

export const CATEGORIAS_ARRAY = Object.values(CATEGORIAS);
