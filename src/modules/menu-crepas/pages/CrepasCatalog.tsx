import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CREPAS, Crepa } from '../constants';
import { ProductCard } from '../components/ProductCard';

export const CrepasCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'dulce' | 'salada'>('all');

  const filteredCrepas = CREPAS.filter(c => filter === 'all' || c.type === filter);

  const handleAdd = (crepa: Crepa) => {
    // Aquí iría la lógica para agregar directamente al carrito si es necesario
    // Opcionalmente, para la experiencia rica de personalización, dirigimos a la vista de detalles.
    navigate(`/menu-crepas/${crepa.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 font-headline tracking-tight">
          Menú de Crepas
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Disfruta de nuestras deliciosas crepas dulces y saladas. Preparadas al momento con ingredientes frescos y la mejor calidad.
        </p>
      </div>

      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12 flex justify-center">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 inline-flex">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilter('dulce')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'dulce' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Dulces
          </button>
          <button 
            onClick={() => setFilter('salada')}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${filter === 'salada' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Saladas
          </button>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredCrepas.map(crepa => (
              <motion.div
                key={crepa.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => navigate(`/menu-crepas/${crepa.id}`)}
              >
                <ProductCard crepa={crepa} onAdd={handleAdd} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
