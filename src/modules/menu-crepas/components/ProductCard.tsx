import React, { useState } from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { Crepa } from '../constants';

interface ProductCardProps {
  crepa: Crepa;
  qty: number;
  onAdd: (crepa: Crepa) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClick: (crepa: Crepa) => void;
}

export function ProductCard({ crepa, qty, onAdd, onUpdateQty, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onClick(crepa)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-amber-200"
      style={{ display: 'flex', gap: '0', marginBottom: '16px' }}
    >
      {/* Content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 className="text-stone-900 font-bold text-lg leading-tight m-0">
          {crepa.name}
        </h3>
        
        {/* Ingredients Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {crepa.keyIngredients.map((ing, i) => (
            <span key={i} className="bg-stone-100 text-stone-600 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider">
              {ing}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
          <span className="text-stone-900 font-black text-xl">
            ${crepa.price}
            <span className="text-stone-500 text-xs font-medium ml-1">MXN</span>
          </span>

          {qty > 0 ? (
            <div
              onClick={e => e.stopPropagation()}
              className="flex items-center bg-amber-50 rounded-xl overflow-hidden border border-amber-200"
            >
              <button
                onClick={() => onUpdateQty(crepa.id, -1)}
                className="p-2 text-amber-600 font-bold flex items-center hover:bg-amber-100 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-stone-900 font-bold px-2 min-w-[24px] text-center">
                {qty}
              </span>
              <button
                onClick={() => onUpdateQty(crepa.id, 1)}
                className="p-2 text-amber-600 font-bold flex items-center hover:bg-amber-100 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onAdd(crepa); }}
              className="bg-amber-500 hover:bg-amber-600 text-white border-none rounded-xl px-4 py-2 flex items-center gap-2 font-bold text-sm shadow-sm transition-transform active:scale-95"
            >
              <Plus size={16} />
              Agregar
            </button>
          )}
        </div>
      </div>

      {/* Image with Hover Switch */}
      <div style={{ width: '140px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
        <img
          src={isHovered ? crepa.hoverImage : crepa.image}
          alt={crepa.name}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'opacity 0.3s ease, transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        {qty > 0 && (
          <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
            <div className="bg-amber-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
              <Check size={18} color="#fff" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
