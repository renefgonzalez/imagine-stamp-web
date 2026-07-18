import { useState, useMemo, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import CandymarPrintTemplate from './CandymarPrintTemplate';
import { CATEGORIES, PRODUCTS, OctopusSVG, CrabSVG } from './CandymarData';
import logo from '../assets/logo.png';
import fondoHero from '../assets/fondo-hero.jpg';


const OrnamentalDivider = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 300 40" fill="none">
    {/* Línea central */}
    <path d="M0 20 L300 20" stroke="currentColor" strokeWidth="0.8" opacity="0.25" />
    {/* Flourishes */}
    <path d="M50 10 Q55 20 50 30" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M100 10 Q105 20 100 30" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M150 10 Q155 20 150 30" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M200 10 Q205 20 200 30" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
    <path d="M250 10 Q255 20 250 30" stroke="currentColor" strokeWidth="1" opacity="0.2" fill="none" strokeLinecap="round" />
  </svg>
);

const DecorativeBorder = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 400 60" fill="none">
    <g opacity="0.25">
      <path d="M10 30 L30 20 L50 30 L70 20 L90 30 L110 20 L130 30 L150 20 L170 30 L190 20 L210 30 L230 20 L250 30 L270 20 L290 30 L310 20 L330 30 L350 20 L370 30 L390 20"
            stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

const StarIcon = () => (
  <svg className="h-3 w-3 inline" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// ─── CSS ──────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-item {
    opacity: 0;
    animation: fadeUp 0.4s ease-out forwards;
  }

  /* Ocultar barra de scroll para un look más limpio y minimalista */
  .cat-scroll::-webkit-scrollbar {
    display: none;
  }
  .cat-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Efecto Hover garantizado para los platillos */
  .product-card {
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }
  .product-card:hover {
    background-color: #222;
    border-color: #333;
  }
  .product-title, .product-price, .product-line {
    transition: all 0.3s ease;
  }
  .product-card:hover .product-title,
  .product-card:hover .product-price {
    color: #00e5ff !important;
  }
  .product-card:hover .product-line {
    border-color: #00e5ff !important;
  }
`;

// ─── Componente ────────────────────────────────────────────────────────────────

export default function CandymarMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter(p => {
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }),
    [selectedCategory, searchQuery],
  );

  const groupedProducts = useMemo(() => {
    if (selectedCategory !== 'Todos') return { [selectedCategory]: filteredProducts };
    return filteredProducts.reduce((acc, p) => {
      (acc[p.category] ??= []).push(p);
      return acc;
    }, {} as Record<string, typeof PRODUCTS>);
  }, [filteredProducts, selectedCategory]);

  const handleDownloadPDF = () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert("No se encontró el elemento para imprimir.");
        return;
      }

      element.classList.remove('-left-[9999px]');
      element.classList.add('left-0');

      const opt = {
        margin:       0,
        filename:     'Menu_Candymar.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Manejar la importación en Vite (puede exportarse bajo .default)
      const pdfGenerator = html2pdf.default ? html2pdf.default : html2pdf;

      pdfGenerator().set(opt).from(element).save().then(() => {
        element.classList.remove('left-0');
        element.classList.add('-left-[9999px]');
      }).catch((err: any) => {
        alert("Hubo un error al generar el PDF: " + err);
        element.classList.remove('left-0');
        element.classList.add('-left-[9999px]');
      });
    } catch (e) {
      alert("Error fatal al intentar usar la librería de PDF: " + e);
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 }).format(p);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="font-sans" style={{ backgroundColor: '#1c1c1c', color: '#aaa' }}>
      <style>{STYLES}</style>

      {/* ─── PLANTILLA DE IMPRESIÓN (OCULTA) ─── */}
      <div className="overflow-hidden h-0 w-0 absolute -left-[9999px]">
        <CandymarPrintTemplate ref={printRef} />
      </div>

      {/* ─── HEADER ─── */}
      <header 
        className="text-center pt-10 pb-8 px-4 relative overflow-hidden" 
        style={{ 
          borderBottom: '1px solid #333',
          backgroundImage: `linear-gradient(rgba(28, 28, 28, 0.4), rgba(28, 28, 28, 0.4)), url(${fondoHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >

        <div className="flex justify-center mb-5 relative z-10">
          <div className="h-16 w-16 rounded-full overflow-hidden border-2" style={{ borderColor: '#00e5ff' }}>
            <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="relative z-10 inline-block border-2 px-8 sm:px-14 py-4 sm:py-5" style={{ borderColor: '#00e5ff' }}>
          <h1 className="text-3xl sm:text-4xl italic mb-0.5" style={{ color: '#fff', fontFamily: 'Georgia, serif' }}>
            Candymar
          </h1>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-wide leading-none"
            style={{ color: '#fff', fontFamily: 'Impact, Arial Black, sans-serif', textShadow: '2px 2px 0 rgba(0,0,0,0.8)' }}>
            MENU
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
            <span className="text-gray-500 text-[11px] italic tracking-widest">Premium Quality</span>
            <span className="h-px w-8" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
          </div>
        </div>

      </header>

      {/* ─── CATEGORÍAS ─── */}
      <div className="py-3" style={{ backgroundColor: '#1c1c1c', borderBottom: '1px solid #333' }}>
        <div className="max-w-3xl mx-auto px-4 flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto cat-scroll">
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat.name;
            return (
              <button key={cat.name} onClick={() => setSelectedCategory(cat.name)}
                className="whitespace-nowrap px-5 py-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all duration-300 rounded-full"
                style={{ 
                  color: active ? '#000' : '#888', 
                  backgroundColor: active ? '#00e5ff' : '#222', 
                  border: `1px solid ${active ? '#00e5ff' : '#333'}`,
                  boxShadow: active ? '0 0 10px rgba(0, 229, 255, 0.2)' : 'none'
                }}>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── BUSCADOR ─── */}
      <div className="px-6 sm:px-10 pt-8 max-w-3xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar platillo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111] border border-[#333] text-[#eee] px-4 py-3 pl-11 focus:outline-none focus:border-[#00e5ff] rounded-sm transition-colors"
          />
          <svg className="w-5 h-5 text-[#666] absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      {/* ─── MENÚ ─── */}
      <main className="max-w-3xl mx-auto px-6 sm:px-10 pt-8 pb-24 w-full">
        {Object.keys(groupedProducts).length === 0 ? (
          <p className="text-center py-20 text-gray-500 text-lg">No se encontraron productos</p>
        ) : (
          <div className="flex flex-col gap-14">
            {Object.entries(groupedProducts).map(([category, products], catIndex) => (
              <section key={category}>
                {catIndex > 0 && (
                  <OrnamentalDivider className="w-64 mx-auto mb-10 text-[#00e5ff] opacity-40" />
                )}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-gray-700"></div>
                  <h3 className="font-black uppercase tracking-widest text-base px-6 py-2" style={{ backgroundColor: '#00e5ff', color: '#111' }}>
                    {category}
                  </h3>
                  <div className="w-12 h-[1px] bg-gray-700"></div>
                </div>

                <div className="flex flex-col gap-7">
                  {products.map((product, i) => (
                    <article key={product.id} className="fade-item product-card p-3 sm:p-4 -mx-3 sm:-mx-4 rounded-xl cursor-default" style={{ animationDelay: `${i * 70}ms` }}>
                      <div className="flex items-end gap-3">
                        <h4 className="product-title font-bold text-lg sm:text-xl shrink-0 text-white" style={{ fontFamily: 'Georgia, serif' }}>
                          {product.name}
                        </h4>
                        <span className="product-line flex-1 mb-1.5 opacity-60 border-b-2 border-dotted border-[#777]" />
                        <span className="product-price font-bold text-lg sm:text-xl shrink-0 text-white" style={{ fontFamily: 'Georgia, serif' }}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-start mt-1.5">
                        <p className="text-gray-400 text-sm leading-snug italic">
                          {product.description}
                        </p>
                        {product.featured && (
                          <span className="text-[10px] uppercase font-bold tracking-[0.15em] px-2 py-0.5 ml-3 shrink-0 flex items-center gap-1" style={{ color: '#00e5ff', border: '1px solid rgba(0,229,255,0.4)' }}>
                            <StarIcon /> Especial
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="my-16">
          <OrnamentalDivider className="w-80 mx-auto text-[#00e5ff]" />
        </div>
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 mt-auto" style={{ backgroundColor: '#111', borderTop: '1px solid #333' }}>
         <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-left">
               {/* Columna 1: Candymar */}
               <div>
                  <h3 className="text-[#00e5ff] font-bold text-xl mb-4 font-serif">Candymar</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Los mariscos más frescos de la región, preparados con recetas tradicionales de Colima y Sinaloa. Calidad y sabor que nos distinguen.
                  </p>
               </div>
               
               {/* Columna 2: Contacto */}
               <div>
                  <h3 className="text-[#00e5ff] font-bold text-xl mb-4 font-serif">Contacto</h3>
                  <ul className="space-y-4 text-gray-400 text-sm">
                     <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#00e5ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>Av. Ignacio Sandoval #1401</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#00e5ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        <span>(312) 123-4567</span>
                     </li>
                     <li className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#00e5ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        <span>contacto@candymar.com</span>
                     </li>
                  </ul>
               </div>

               {/* Columna 3: Síguenos */}
               <div>
                  <h3 className="text-[#00e5ff] font-bold text-xl mb-4 font-serif">Síguenos</h3>
                  <div className="flex gap-4">
                     <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition-colors border border-[#00e5ff]/30">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                     </a>
                     <a href="#" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition-colors border border-[#00e5ff]/30">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                     </a>
                  </div>
               </div>
            </div>

            {/* Créditos IMAGINE & STAMP y botón secreto de descarga */}
            <div className="mt-12 pt-6 border-t border-[#333] flex justify-between items-center px-4">
               <button 
                 onClick={handleDownloadPDF}
                 className="p-2 text-[#222] hover:text-[#555] transition-colors"
                 title="Descargar Menú PDF (Uso Interno)"
               >
                 <Download size={14} />
               </button>
               <p className="text-gray-500 text-xs">
                  Diseñado por <span className="text-gray-300 font-bold">IMAGINE & STAMP</span>
               </p>
               <div className="w-8"></div> {/* Spacer for centering the text */}
            </div>
         </div>
      </footer>

      {/* ─── VOLVER ARRIBA ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-0 right-0 z-50 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:bg-cyan-400 ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
        style={{ backgroundColor: '#00e5ff', color: '#000' }}
        aria-label="Volver arriba">
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
