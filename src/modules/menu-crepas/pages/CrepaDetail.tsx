import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus } from 'lucide-react';
import { Crepa } from '../constants';

interface CrepaDetailProps {
  crepa: Crepa;
  onClose: () => void;
  onAddToCart: (crepa: Crepa, quantity: number, extras: string[]) => void;
}

export function CrepaDetail({ crepa, onClose, onAddToCart }: CrepaDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Extras simulados dependiendo de la categoría
  const extrasList = crepa.category === 'dulces' 
    ? [
        { id: 'extra-nutella', name: 'Extra Nutella', price: 15 },
        { id: 'extra-fresa', name: 'Extra Fresas', price: 10 },
        { id: 'extra-helado', name: 'Extra Bola de Helado', price: 20 }
      ]
    : [
        { id: 'extra-queso', name: 'Extra Queso Fundido', price: 15 },
        { id: 'extra-pechuga', name: 'Extra Pollo', price: 20 },
        { id: 'extra-champinones', name: 'Champiñones', price: 10 }
      ];

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const extrasTotal = extrasList
    .filter(e => selectedExtras.includes(e.id))
    .reduce((sum, e) => sum + e.price, 0);

  const finalTotal = (crepa.price + extrasTotal) * quantity;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50"
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto bg-stone-50 rounded-t-3xl md:rounded-3xl z-50 overflow-hidden shadow-2xl flex flex-col md:flex-row w-full md:max-w-4xl max-h-[90vh] md:max-h-[80vh]"
      >
        {/* Columna Izquierda: Imagen Gigante */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto shrink-0">
          <img
            src={crepa.image}
            alt={crepa.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 to-transparent md:hidden" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-stone-900/40 backdrop-blur-md rounded-full p-2 text-white hover:bg-stone-900/60 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Columna Derecha: Detalles y Personalización */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-stone-50 p-6 md:p-8">
          <div className="hidden md:flex justify-end mb-2">
            <button
              onClick={onClose}
              className="bg-stone-200 rounded-full p-2 text-stone-600 hover:bg-stone-300 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-black text-stone-900 leading-tight mb-2">
              {crepa.name}
            </h2>
            <p className="text-stone-600 leading-relaxed">
              {crepa.description}
            </p>
          </div>

          {/* Extras */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 mb-4">Personaliza tu Crepa</h3>
            <div className="space-y-3">
              {extrasList.map(extra => (
                <label 
                  key={extra.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                    selectedExtras.includes(extra.id) 
                      ? 'border-amber-500 bg-amber-50/50' 
                      : 'border-stone-200 bg-white hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                      selectedExtras.includes(extra.id) ? 'bg-amber-500 border-amber-500' : 'border-stone-300'
                    }`}>
                      {selectedExtras.includes(extra.id) && <X size={14} className="text-white rotate-45" />}
                    </div>
                    <span className="font-semibold text-stone-800">{extra.name}</span>
                  </div>
                  <span className="text-stone-600 font-medium">+${extra.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-stone-600 font-medium">Cantidad</span>
              <div className="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <Minus size={20} />
                </button>
                <span className="font-bold text-stone-900 w-12 text-center text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={() => onAddToCart(crepa, quantity, extrasList.filter(e => selectedExtras.includes(e.id)).map(e => e.name))}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-amber-500/30 transition-transform active:scale-95 flex items-center justify-between px-6"
            >
              <span>Agregar al Pedido</span>
              <span>${finalTotal} MXN</span>
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
