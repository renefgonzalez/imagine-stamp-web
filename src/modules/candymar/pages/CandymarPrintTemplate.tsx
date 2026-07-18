import React, { forwardRef } from 'react';
import { CATEGORIES, PRODUCTS, OctopusSVG, CrabSVG } from './CandymarData';
import logo from '../assets/logo.png';
import fondoHero from '../assets/fondo-hero.jpg';

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
           <OctopusSVG className="w-64 h-64 opacity-50" />
        </div>
        <div className="absolute bottom-10 left-10 text-[#00e5ff]">
           <CrabSVG className="w-64 h-64 opacity-50" />
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
        className="relative px-12 py-16"
        style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#111' }}
      >
        {/* Gráficos de fondo de página 2 */}
        <div className="absolute top-0 right-0 text-[#00e5ff] opacity-10 pointer-events-none">
           <OctopusSVG className="w-80 h-80" />
        </div>
        <div className="absolute bottom-0 left-0 text-[#00e5ff] opacity-10 pointer-events-none">
           <CrabSVG className="w-80 h-80" />
        </div>

        {/* Grid para compatibilidad con html2canvas */}
        <div className="grid grid-cols-2 gap-16 relative z-10 h-full content-start">
          {printableCategories.map((category, catIndex) => {
            const categoryProducts = PRODUCTS.filter(p => p.category === category.name);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.name} className="mb-10 flex flex-col">
                {/* Listón Cyan (Ribbon) */}
                <div 
                  className="mb-6 px-4 py-2 font-black uppercase tracking-widest text-lg inline-block w-full text-center"
                  style={{ backgroundColor: '#00e5ff', color: '#111', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                >
                  {category.name}
                </div>

                {/* Platillos */}
                <div className="flex flex-col gap-6">
                  {categoryProducts.map(product => (
                    <div key={product.id}>
                      <div className="flex items-end gap-2">
                        <h4 className="font-bold text-xl shrink-0" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                          {product.name}
                        </h4>
                        <span className="flex-1 mb-1 border-b-[1.5px] border-dotted opacity-50 border-[#ccc]" />
                        <span className="font-bold text-xl shrink-0" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
                          ${product.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-start mt-1">
                        <p className="text-[#aaa] text-sm italic w-5/6">
                          {product.description}
                        </p>
                        {product.featured && (
                          <span className="text-[10px] uppercase font-bold tracking-[0.1em] px-1 py-0.5 border" style={{ color: '#00e5ff', borderColor: 'rgba(0,229,255,0.4)' }}>
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
      </div>
    </div>
  );
});

export default CandymarPrintTemplate;
