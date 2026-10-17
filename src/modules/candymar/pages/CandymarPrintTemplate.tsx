import { forwardRef } from 'react';
import { CATEGORIES, PRODUCTS } from './CandymarData';
import logo from '../assets/logo.png';
import pulpoReal from '../assets/pulpo-real.png';
import cangrejoReal from '../assets/cangrejo-real.png';

// ─── Linocut Wave SVG para impresión ───
const PrintLinocutWaves = ({ className = "h-4 w-full" }: { className?: string }) => (
  <div className={`overflow-hidden flex items-center justify-between text-[#00e5ff] ${className}`}>
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 20" fill="none">
      {Array.from({ length: 50 }).map((_, i) => (
        <path
          key={i}
          d={`M${i * 20 + 2} 18 L${i * 20 + 12} 2`}
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.9"
        />
      ))}
    </svg>
  </div>
);

const CandymarPrintTemplate = forwardRef<HTMLDivElement>((_props, ref) => {
  const printableCategories = CATEGORIES.filter(c => c.name !== 'Todos');

  return (
    <div
      ref={ref}
      className="bg-[#121316] text-zinc-200 font-sans"
      style={{
        width: '210mm',
        minHeight: '594mm', // 2 páginas A4 (297mm x 2)
        overflow: 'hidden',
        color: '#d4d4d8',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playball&family=Oswald:wght@500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap');
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════
          PÁGINA 1: PORTADA (Lado izquierdo de la foto de referencia)
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative flex flex-col justify-between items-center text-center p-8"
        style={{
          width: '210mm',
          height: '297mm',
          backgroundColor: '#121316',
          boxSizing: 'border-box',
          pageBreakAfter: 'always',
        }}
      >
        {/* Borde superior de olas linograbadas */}
        <PrintLinocutWaves className="h-5" />

        {/* Badge Superior "SEA FOOD / Sketch" */}
        <div className="inline-flex flex-col items-center mt-2">
          <div className="bg-[#00e5ff] text-[#0a0c10] px-8 py-2 border border-[#00d0e7] shadow-md">
            <span className="text-xs font-black tracking-[0.25em] uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
              SEA FOOD
            </span>
            <span className="block text-sm italic font-serif -mt-1 text-[#050709]" style={{ fontFamily: "'Playball', 'Georgia', serif" }}>
              Sketch & Sabor
            </span>
          </div>
          <div className="w-24 text-[#00e5ff] opacity-80 mt-1">
            <svg viewBox="0 0 100 8" fill="none" className="w-full h-2">
              <path d="M0 4 Q12.5 0 25 4 T50 4 T75 4 T100 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        </div>

        {/* Marco Central Doble Cian con Títulos */}
        <div className="relative border-2 border-[#00e5ff] px-12 py-8 bg-[#15171d] max-w-md w-full my-auto shadow-2xl">
          {/* Esquinas decorativas */}
          <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

          {/* Logo Candymar */}
          <div className="flex justify-center -mt-16 mb-3">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-[#00e5ff] p-1 bg-[#121316] shadow-xl">
              <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover rounded-full" />
            </div>
          </div>

          <p className="text-3xl italic text-white mb-1" style={{ fontFamily: "'Playball', 'Georgia', serif" }}>
            Candymar
          </p>
          <h1
            className="text-6xl font-black uppercase tracking-wider text-white leading-none mb-3"
            style={{
              fontFamily: "'Impact', 'Oswald', sans-serif",
              textShadow: '3px 3px 0 #000',
            }}
          >
            MENU
          </h1>

          {/* Listón "Premium Quality" */}
          <div className="inline-flex items-center gap-3 px-6 py-1.5 border border-[#00e5ff]/60 bg-[#1a1c24] text-[#00e5ff] text-xs uppercase font-bold tracking-[0.25em]">
            <span>★</span>
            <span>PREMIUM QUALITY SEAFOOD</span>
            <span>★</span>
          </div>
        </div>

        {/* Ilustración de Pulpo estilo Gis Blanco al pie (como en la portada de la foto) */}
        <div className="w-56 h-56 my-2" style={{ filter: 'invert(1) brightness(1.2)' }}>
          <img src={pulpoReal} alt="Octopus sketch" className="w-full h-full object-contain" />
        </div>

        {/* Anotaciones y Borde inferior */}
        <div className="w-full">
          <p className="text-xs text-zinc-400 font-serif italic mb-2 tracking-wider">
            Recetas tradicionales de Colima y Sinaloa · Mariscos 100% Frescos
          </p>
          <PrintLinocutWaves className="h-5 rotate-180" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          PÁGINA 2: MENÚ INTERIOR (Lado derecho de la foto de referencia)
          ═══════════════════════════════════════════════════════════════ */}
      <div
        className="relative flex flex-col justify-between p-8"
        style={{
          width: '210mm',
          height: '297mm',
          backgroundColor: '#121316',
          boxSizing: 'border-box',
        }}
      >
        {/* Pulpo Gigante Cian en la parte superior derecha (igual que en la foto) */}
        <div
          className="absolute -top-6 -right-6 w-80 pointer-events-none select-none z-0 opacity-70"
          style={{
            filter: 'invert(75%) sepia(85%) saturate(1476%) hue-rotate(143deg) brightness(105%) contrast(105%)',
          }}
        >
          <img src={pulpoReal} alt="Octopus sketch" className="w-full h-auto" />
        </div>

        {/* Borde superior de olas */}
        <PrintLinocutWaves className="h-4 relative z-10" />

        {/* Encabezado interior "Candymar Seafood MENU" */}
        <div className="relative z-10 pt-2 pb-4 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <span className="text-xl italic text-white" style={{ fontFamily: "'Playball', 'Georgia', serif" }}>
              Candymar
            </span>
            <span
              className="text-4xl font-black uppercase text-white tracking-wider ml-3"
              style={{ fontFamily: "'Impact', 'Oswald', sans-serif" }}
            >
              SEAFOOD MENU
            </span>
          </div>

          <div className="bg-[#00e5ff] text-[#0a0c10] px-4 py-1.5 text-[11px] font-bold tracking-widest uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
            CANDYMAR SELECCIÓN
          </div>
        </div>

        {/* Cuerpo Principal del Menú: 2 Columnas con lista y "Choice of the Day" */}
        <div className="grid grid-cols-12 gap-6 relative z-10 flex-1 my-3">
          {/* Columna Izquierda: Platillos (8 columnas) */}
          <div className="col-span-8 flex flex-col justify-between">
            {printableCategories.map((category) => {
              const categoryProducts = PRODUCTS.filter(p => p.category === category.name);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category.name} className="mb-2">
                  {/* Listón Cian de Categoría con Doblez */}
                  <div className="relative flex items-center mb-2">
                    <div
                      className="relative inline-flex items-center bg-[#00e5ff] text-[#0a0c10] px-4 py-1 font-bold tracking-wider uppercase text-xs shadow-sm z-10"
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      <span>{category.name}</span>
                      <div
                        className="absolute -right-2 top-0 bottom-0 w-2 bg-[#0092a8]"
                        style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
                      />
                    </div>
                    <div className="flex-1 h-[1px] ml-3 border-b border-dashed border-[#00e5ff]/50" />
                  </div>

                  {/* Lista de platillos */}
                  <div className="space-y-1.5 pl-1">
                    {categoryProducts.map(product => (
                      <div key={product.id}>
                        <div className="flex items-end justify-between">
                          <span className="font-bold text-xs text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {product.name}
                          </span>
                          <span className="flex-1 mx-2 mb-0.5 border-b border-dotted border-zinc-700" />
                          <span className="font-bold text-xs text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 italic font-serif leading-tight">
                          {product.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Columna Derecha: "CHOICE OF THE DAY" con bocetos estilo gis (4 columnas) */}
          <div className="col-span-4 border-l border-dashed border-zinc-700 pl-4 flex flex-col justify-between text-center">
            {/* Tarjeta 1: Choice of the Day - Pulpo */}
            <div className="border border-zinc-800 bg-[#161820]/70 p-3 rounded-sm">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00e5ff] block mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                CHOICE OF THE DAY
              </span>
              <p className="text-white text-xs font-serif font-bold mb-1">Especialidad Marina</p>
              <div className="w-24 h-24 mx-auto my-1" style={{ filter: 'invert(1) brightness(1.2)' }}>
                <img src={pulpoReal} alt="Octopus" className="w-full h-full object-contain" />
              </div>
              <p className="text-[9px] text-zinc-400 italic font-serif">
                Recetas tradicionales marinadas con salsas caseras de la costa.
              </p>
            </div>

            {/* Tarjeta 2: Recomendación - Cangrejo */}
            <div className="border border-zinc-800 bg-[#161820]/70 p-3 rounded-sm">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00e5ff] block mb-1" style={{ fontFamily: "'Oswald', sans-serif" }}>
                RECOMENDACIÓN DEL CHEF
              </span>
              <p className="text-white text-xs font-serif font-bold mb-1">Aguachiles & Tacos</p>
              <div className="w-20 h-20 mx-auto my-1" style={{ filter: 'invert(1) brightness(1.2)' }}>
                <img src={cangrejoReal} alt="Crab" className="w-full h-full object-contain" />
              </div>
              <p className="text-[9px] text-zinc-400 italic font-serif">
                Prueba nuestros tacos gobernador y aguachiles negro y verde.
              </p>
            </div>

            {/* Caja de Contacto y Horarios */}
            <div className="border border-[#00e5ff]/40 bg-[#00e5ff]/10 p-2.5 text-center text-zinc-300">
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#00e5ff] mb-1">
                CONTACTO & PEDIDOS
              </p>
              <p className="text-[10px] text-white font-serif font-bold">Av. Ignacio Sandoval #1401</p>
              <p className="text-[10px] text-zinc-300">(312) 123-4567</p>
              <p className="text-[9px] text-zinc-400 mt-1">Miércoles a Lunes: 11am – 7pm</p>
            </div>
          </div>
        </div>

        {/* Footer y Borde inferior de la página 2 */}
        <div className="relative z-10 pt-2 border-t border-zinc-800 flex justify-between items-center text-[10px] text-zinc-500">
          <span>Candymar · Marisquería Tradicional</span>
          <span>Diseño exclusivo por IMAGINE & STAMP</span>
        </div>
        <PrintLinocutWaves className="h-4 rotate-180 relative z-10 mt-1" />
      </div>
    </div>
  );
});

export default CandymarPrintTemplate;
