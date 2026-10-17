import React, { forwardRef } from 'react';
import { CATEGORIES, PRODUCTS } from './CandymarData';
import logo from '../assets/logo.png';
import fondoHero from '../assets/fondo-hero.jpg';
import pulpoReal from '../assets/pulpo-real.png';
import cangrejoReal from '../assets/cangrejo-real.png';

const CandymarPrintTemplate = forwardRef<HTMLDivElement>((props, ref) => {
  // Omitimos 'Todos' de las categorías para la impresión
  const printableCategories = CATEGORIES.filter(c => c.name !== 'Todos');

  return (
    <div
      ref={ref}
      className="bg-[#111] text-[#ccc] font-sans"
      style={{
        width: '210mm',
        minHeight: '297mm',
        overflow: 'hidden'
      }}
    >
      {/* ─── PÁGINA 1: PORTADA ─── */}
      <div 
        className="relative flex flex-col items-center justify-center"
        style={{ 
          width: '210mm', 
          height: '297mm', 
          backgroundImage: `linear-gradient(rgba(17, 17, 17, 0.6), rgba(17, 17, 17, 0.6)), url(${fondoHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute top-10 right-10 text-[#00e5ff]">
           <img src={pulpoReal} alt="Pulpo" className="w-64 h-64 object-contain opacity-50 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
        </div>
        <div className="absolute bottom-10 left-10 text-[#00e5ff]">
           <img src={cangrejoReal} alt="Cangrejo" className="w-64 h-64 object-contain opacity-50 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]" />
        </div>

        <div className="h-40 w-40 rounded-full overflow-hidden border-4 mb-10" style={{ borderColor: '#00e5ff', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
        </div>
        
        <div className="border-4 px-20 py-10 text-center" style={{ borderColor: '#00e5ff' }}>
          <h1 className="text-6xl italic mb-2" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
            Candymar
          </h1>
          <h2 className="text-8xl font-black uppercase tracking-widest leading-none mb-6"
              style={{ color: '#fff', fontFamily: 'Impact, Arial Black, sans-serif' }}>
            MENU
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-white opacity-30" />
            <span className="text-xl tracking-[0.2em] uppercase" style={{ color: '#d1d5db' }}>Premium Seafood</span>
            <span className="h-px w-16 bg-white opacity-30" />
          </div>
        </div>
        
        <div className="absolute bottom-10 w-full flex justify-center">
          <div className="h-2 w-1/3" style={{ backgroundColor: '#00e5ff' }}></div>
        </div>
      </div>

      {/* ─── PÁGINA 2: MENÚ A DOS COLUMNAS ─── */}
      <div 
        className="relative px-12 py-12 flex flex-col justify-between"
        style={{ width: '210mm', height: '296.5mm', backgroundColor: '#111' }}
      >
        {/* Gráficos de fondo de página 2 */}
        <div className="absolute top-0 right-0 text-[#00e5ff] opacity-10 pointer-events-none">
           <img src={pulpoReal} alt="Pulpo" className="w-80 h-80 object-contain" />
        </div>
        <div className="absolute bottom-0 left-0 text-[#00e5ff] opacity-10 pointer-events-none">
           <img src={cangrejoReal} alt="Cangrejo" className="w-80 h-80 object-contain" />
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-10 relative z-10 content-start flex-1">
          {printableCategories.map((category, catIndex) => {
            const categoryProducts = PRODUCTS.filter(p => p.category === category.name);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.name} className="flex flex-col">
                {/* Listón Cyan (Ribbon) */}
                <div 
                  className="mb-5 px-4 py-1.5 font-black uppercase tracking-widest text-base inline-block w-full text-center"
                  style={{ backgroundColor: '#00e5ff', color: '#111', boxShadow: '0 5px 10px -3px rgba(0,0,0,0.3)' }}
                >
                  {category.name}
                </div>

                {/* Platillos */}
                <div className="flex flex-col gap-4">
                  {categoryProducts.map(product => (
                    <div key={product.id}>
                      <div className="flex items-end gap-2">
                        <h4 className="font-bold text-lg shrink-0" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                          {product.name}
                        </h4>
                        <span className="flex-1 mb-1 border-b border-dotted opacity-40 border-[#ccc]" />
                        <span className="font-bold text-lg shrink-0" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                          ${product.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-start mt-0.5">
                        <p className="text-[#aaa] text-xs italic w-5/6 leading-tight">
                          {product.description}
                        </p>
                        {product.featured && (
                          <span className="text-[9px] uppercase font-bold tracking-[0.1em] px-1 py-0.5 border" style={{ color: '#00e5ff', borderColor: 'rgba(0,229,255,0.4)' }}>
                            Especial
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer para rellenar el espacio vacío */}
        <div className="relative z-10 mt-6 pt-6 border-t border-[#333] flex justify-between items-end">
          <div>
            <h3 className="text-[#00e5ff] font-bold text-lg mb-2 font-serif">Candymar</h3>
            <p className="text-[#aaa] text-xs max-w-xs leading-relaxed">
              Los mariscos más frescos de la región, preparados con recetas tradicionales. Calidad y sabor que nos distinguen.
            </p>
          </div>
          <div className="text-right text-[#aaa] text-xs space-y-1">
            <p className="font-bold text-[#fff]">Contacto y Reservaciones</p>
            <p>Av. Ignacio Sandoval #1401</p>
            <p>(312) 123-4567</p>
            <p>@candymar_oficial</p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CandymarPrintTemplate;
