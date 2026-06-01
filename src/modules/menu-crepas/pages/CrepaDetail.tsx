import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Plus, Minus, Check } from 'lucide-react';
import { CREPAS } from '../constants';

export const CrepaDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const crepa = CREPAS.find(c => c.id === id);

  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!crepa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Crepa no encontrada</h2>
          <button onClick={() => navigate('/menu-crepas')} className="text-indigo-600 font-bold hover:underline">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const extraOptions = crepa.type === 'dulce' 
    ? ['Extra Fresa', 'Extra Plátano', 'Nuez', 'Lechera', 'Queso Crema', 'Helado de Vainilla']
    : ['Extra Queso', 'Extra Jamón', 'Champiñones', 'Elote', 'Jalapeños', 'Salsa de Tomate'];

  const toggleExtra = (extra: string) => {
    setExtras(prev => prev.includes(extra) ? prev.filter(e => e !== extra) : [...prev, extra]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <button 
          onClick={() => navigate('/menu-crepas')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 font-medium"
        >
          <ArrowLeft size={20} /> Volver al menú
        </button>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Columna Izquierda: Foto Gigante */}
          <div className="w-full md:w-1/2 relative h-[400px] md:h-auto">
            <img 
              src={crepa.image} 
              alt={crepa.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-md">
              <span className="font-bold text-gray-800 capitalize">{crepa.type}</span>
            </div>
          </div>

          {/* Columna Derecha: Personalización */}
          <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{crepa.name}</h1>
            <p className="text-gray-500 mb-6 text-lg leading-relaxed">{crepa.description}</p>

            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
              <span className="text-3xl font-black text-indigo-600">${crepa.price} MXN</span>
              <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-indigo-600"><Minus size={20} /></button>
                <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-indigo-600"><Plus size={20} /></button>
              </div>
            </div>

            {/* Extras */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Agrega Extras (+ $15 c/u)</h3>
              <div className="grid grid-cols-2 gap-3">
                {extraOptions.map(extra => {
                  const isSelected = extras.includes(extra);
                  return (
                    <button
                      key={extra}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                          : 'border-gray-200 hover:border-indigo-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                        {isSelected && <Check size={14} className="text-white" />}
                      </div>
                      <span className="font-medium text-sm flex-1">{extra}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notas */}
            <div className="mb-8 mt-auto">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Instrucciones Especiales</h3>
              <textarea 
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ej. Sin cebolla, extra crujiente, etc."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
              />
            </div>

            {/* Botón Final */}
            <button 
              className="w-full bg-gray-900 hover:bg-black text-white rounded-2xl py-4 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag size={24} /> 
              AGREGAR AL PEDIDO • ${ (crepa.price + (extras.length * 15)) * quantity }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
