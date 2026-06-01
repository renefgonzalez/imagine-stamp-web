import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { Crepa } from '../constants';

interface ProductCardProps {
  crepa: Crepa;
  onAdd: (crepa: Crepa) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ crepa, onAdd }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden border border-gray-100 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden cursor-pointer">
        <img
          src={crepa.image}
          alt={crepa.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src={crepa.hoverImage}
          alt={`${crepa.name} detail`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 scale-105 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <span className="font-bold text-gray-800 text-sm">${crepa.price}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-800 mb-3">{crepa.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {crepa.keyIngredients.map((ingredient, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md border border-gray-100 font-medium tracking-wide"
            >
              {ingredient}
            </span>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onAdd(crepa); }}
          className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> AGREGAR
        </button>
      </div>
    </motion.div>
  );
};
