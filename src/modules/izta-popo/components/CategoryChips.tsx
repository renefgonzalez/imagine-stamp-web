import React from 'react';
import { CATEGORIAS_ARRAY, CategoriaId } from '../data/categorias';
import { LUGARES } from '../data/lugares';

interface CategoryChipsProps {
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  className?: string;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
  className = '',
}) => {
  // Conteo de lugares por categoría
  const countByCategory: Record<string, number> = {};
  LUGARES.forEach((l) => {
    countByCategory[l.categoria] = (countByCategory[l.categoria] || 0) + 1;
  });

  return (
    <div className={`flex items-center gap-2 overflow-x-auto hide-scrollbar py-1 ${className}`}>
      {/* Opción Todos */}
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
          selectedCategory === null
            ? 'bg-[#E8A15A] text-black font-semibold shadow-md shadow-[#E8A15A]/20 scale-105'
            : 'bg-[#1A1C1B]/90 text-[#9AA3A0] hover:text-white border border-white/10 hover:bg-[#1A1C1B]'
        }`}
      >
        <span>Todos</span>
        <span
          className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            selectedCategory === null ? 'bg-black/20 text-black' : 'bg-white/10 text-white/70'
          }`}
        >
          {LUGARES.length}
        </span>
      </button>

      {/* Chips individuales */}
      {CATEGORIAS_ARRAY.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const Icon = cat.icon;
        const count = countByCategory[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(isSelected ? null : cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
              isSelected
                ? 'bg-white text-black font-semibold shadow-md scale-105 border-white'
                : 'bg-[#1A1C1B]/90 text-[#9AA3A0] hover:text-white border-white/10 hover:bg-[#1A1C1B]'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: cat.colorHex }}
            />
            <Icon className="w-3.5 h-3.5" />
            <span>{cat.nombre}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-black/10 text-black' : 'bg-white/10 text-white/70'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
