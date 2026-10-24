import { useState, useMemo, useRef, useEffect } from 'react';
import { Download, Search, Sparkles, ChevronUp, MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, X, Plus } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import CandymarPrintTemplate from './CandymarPrintTemplate';
import {
  CATEGORIES,
  PRODUCTS,
  FishSVG,
  ShrimpSVG,
  OysterSVG,
  LemonSliceSVG,
  RosemarySVG,
  CrabSVG,
} from './CandymarData';
import logo from '../assets/logo.png';

// ─── Estilos y Fuentes Google ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Oswald:wght@500;600;700&family=Montserrat:wght@400;600;700;800;900&family=Caveat:wght@600;700&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-item {
    animation: fadeUp 0.35s ease-out forwards;
  }

  .cat-scroll::-webkit-scrollbar {
    display: none;
  }
  .cat-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Lienzo Acuarela Luminosa (Blanco + manchas suaves celestes y aguamarina) */
  .watercolor-canvas {
    background-color: #ffffff;
    background-image:
      radial-gradient(ellipse at 12% 10%, rgba(186, 230, 253, 0.45) 0%, rgba(224, 242, 254, 0.25) 35%, transparent 65%),
      radial-gradient(ellipse at 88% 12%, rgba(165, 243, 252, 0.45) 0%, rgba(207, 250, 254, 0.2) 30%, transparent 60%),
      radial-gradient(circle at 10% 85%, rgba(165, 243, 252, 0.5) 0%, rgba(207, 250, 254, 0.25) 30%, transparent 60%),
      radial-gradient(circle at 92% 85%, rgba(186, 230, 253, 0.4) 0%, rgba(224, 242, 254, 0.2) 35%, transparent 65%),
      radial-gradient(circle at 50% 50%, rgba(240, 249, 255, 0.6) 0%, transparent 70%);
  }

  /* Pincelada Caligráfica Marina */
  .font-script-menu {
    font-family: 'Dancing Script', 'Caveat', cursive;
  }

  /* Tinta de grabado náutico */
  .ink-dark {
    color: #1e293b;
  }

  /* Hover suave sobre platillos */
  .dish-row {
    transition: all 0.2s ease;
    border-radius: 6px;
    padding: 4px 6px;
    margin: -4px -6px;
  }
  .dish-row:hover {
    background-color: rgba(14, 165, 233, 0.08);
  }
  .dish-row:hover .dish-name {
    color: #0369a1;
  }
  .dish-row:hover .dish-dots {
    border-color: #0284c7;
  }
`;

export default function CandymarMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Teléfono WhatsApp oficial de Candymar para pedidos
  const candymarPhone = '5215650469993';

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter(p => {
        const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
        const matchSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      }),
    [selectedCategory, searchQuery],
  );

  const handleDownloadPDF = () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert('No se encontró el elemento para imprimir.');
        return;
      }

      element.classList.remove('-left-[9999px]');
      element.classList.add('left-0');

      const opt = {
        margin: 0,
        filename: 'Menu_Candymar_Seafood.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
      };

      const pdfGenerator = html2pdf.default ? html2pdf.default : html2pdf;

      pdfGenerator()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          element.classList.remove('left-0');
          element.classList.add('-left-[9999px]');
        })
        .catch((err: any) => {
          alert('Hubo un error al generar el PDF: ' + err);
          element.classList.remove('left-0');
          element.classList.add('-left-[9999px]');
        });
    } catch (e) {
      alert('Error fatal al intentar usar la librería de PDF: ' + e);
    }
  };

  const handleOrderWhatsApp = (product: (typeof PRODUCTS)[0]) => {
    const text = encodeURIComponent(
      `¡Hola Candymar! Quisiera ordenar:\n• *${product.name}* ($${product.price} MXN)\nCategoría: ${product.category}\n\n¿Tienen disponible para entrega/pasar a recoger?`,
    );
    window.location.href = `https://wa.me/${candymarPhone}?text=${text}`;
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Productos categorizados para el layout editorial fiel a la lámina
  const fishProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === "Pa' Que Empieces" && p.name.toLowerCase().includes('pescado') || p.name.toLowerCase().includes('ceviche')),
    [],
  );
  const musselProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === 'Tacos' || (p.category === "Pa' Que Empieces" && !fishProducts.some(fp => fp.id === p.id))),
    [fishProducts],
  );
  const shrimpProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === 'Camarones'),
    [],
  );
  const lobsterCrabProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === 'Aguachile' || p.category === 'Bebidas'),
    [],
  );

  return (
    <div className="watercolor-canvas text-slate-800 min-h-screen font-sans selection:bg-cyan-200 selection:text-sky-950">
      <style>{STYLES}</style>

      {/* ─── PLANTILLA DE IMPRESIÓN (OCULTA) ─── */}
      <div className="overflow-hidden h-0 w-0 absolute -left-[9999px]">
        <CandymarPrintTemplate ref={printRef} />
      </div>

      {/* ─── BARRA SUPERIOR DE ACCIONES RÁPIDAS ─── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-2xs py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-sky-300 shadow-xs bg-white">
              <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight leading-none block">
                Candymar
              </span>
              <span className="text-[10px] text-sky-700 uppercase tracking-widest font-semibold block">
                Seafood & Grill
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full transition-all shadow-2xs"
              title="Descargar Menú PDF estilo Acuarela"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>

            <a
              href={`https://wa.me/${candymarPhone}?text=${encodeURIComponent('¡Hola Candymar! Quisiera consultar su menú del día y hacer un pedido.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all shadow-2xs"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── PORTADA EDITORIAL IDÉNTICA A LA MAQUETA DE REFERENCIA ─── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4 overflow-hidden">
        {/* Decoraciones de esquina estilo Grabado + Acuarela */}
        <div className="absolute top-2 left-2 w-16 h-36 opacity-75 pointer-events-none select-none text-slate-700 hidden sm:block">
          <RosemarySVG className="w-full h-full" />
        </div>
        <div className="absolute top-24 left-1 w-14 h-14 opacity-70 pointer-events-none select-none text-slate-600 hidden sm:block">
          <LemonSliceSVG className="w-full h-full" />
        </div>
        <div className="absolute top-4 left-44 w-28 h-20 opacity-75 pointer-events-none select-none text-slate-700 hidden md:block">
          <CrabSVG className="w-full h-full" />
        </div>
        <div className="absolute top-6 left-72 w-12 h-12 opacity-65 pointer-events-none select-none text-slate-600 hidden lg:block">
          <LemonSliceSVG className="w-full h-full" />
        </div>
        <div className="absolute top-2 right-4 w-20 h-28 opacity-80 pointer-events-none select-none text-slate-700 hidden sm:block">
          <OysterSVG className="w-full h-full" />
        </div>
        <div className="absolute top-20 right-2 w-14 h-14 opacity-70 pointer-events-none select-none text-slate-600 hidden sm:block">
          <LemonSliceSVG className="w-full h-full" />
        </div>

        {/* Bloque de Identidad Principal: "Menu SEAFOOD • Always Fresh •" */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pt-2 pb-6 border-b border-sky-100">
          <div className="max-w-md">
            {/* Título "Menu" en Caligrafía Script Azul Océano */}
            <h1
              className="text-6xl sm:text-7xl font-bold font-script-menu text-[#0284c7] leading-none mb-0 drop-shadow-xs"
              style={{ transform: 'rotate(-4deg)', display: 'inline-block' }}
            >
              Menu
            </h1>

            {/* Título "SEAFOOD" en mayúsculas gruesas negras */}
            <div className="mt-1">
              <span
                className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                SEAFOOD
              </span>
            </div>

            {/* Subtítulo "• Always Fresh •" */}
            <div className="flex items-center gap-2 mt-1 text-slate-700 font-script-menu text-xl sm:text-2xl italic">
              <span className="text-[#0284c7] font-bold">•</span>
              <span>Always Fresh & Delicious</span>
              <span className="text-[#0284c7] font-bold">•</span>
            </div>

            {/* Ilustración de Pescado Grabado debajo del título */}
            <div className="w-64 sm:w-80 text-slate-800 mt-2 opacity-90 drop-shadow-xs">
              <FishSVG className="w-full h-auto" />
            </div>
          </div>

          {/* Buscador y Filtros dinámicos */}
          <div className="flex-1 max-w-lg md:pt-4">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-sky-600 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar platillo, taco, ceviche, aguachile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/90 border border-sky-200 focus:border-sky-500 text-slate-800 text-sm px-4 py-2 pl-10 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-200 shadow-2xs placeholder-slate-400 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-700 px-1.5 py-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Selector de Categorías tipo píldoras claras */}
            <div className="flex items-center gap-1.5 overflow-x-auto cat-scroll py-1">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`whitespace-nowrap px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                      active
                        ? 'bg-[#0284c7] text-white shadow-xs'
                        : 'bg-white/80 text-slate-600 border border-sky-100 hover:border-sky-300 hover:text-sky-900'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENIDO DEL MENÚ: LAYOUT EDITORIAL FIEL A LA MAQUETA ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {selectedCategory === 'Todos' && !searchQuery ? (
          /* VISTA COMPLETA ESTILO MAQUETA DE REFERENCIA (4 CUADRANTES) */
          <div className="space-y-10">
            {/* ═══ FILA SUPERIOR: FISH (Izquierda) + MUSSELS (Derecha) ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* CUADRANTE 1: FISH */}
              <section className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl sm:text-5xl font-bold font-script-menu text-[#0284c7] tracking-wide">
                    Fish
                  </h2>
                  <span className="text-[11px] uppercase tracking-widest text-sky-700 font-semibold border-b border-sky-200 pb-0.5">
                    Pescados & Ceviches
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {fishProducts.map(product => (
                    <article
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="dish-row group cursor-pointer"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="dish-name font-bold text-base sm:text-lg text-slate-900 shrink-0 font-serif">
                          {product.name}
                        </h3>
                        <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300 transition-colors" />
                        <span
                          className="dish-price font-bold text-base sm:text-lg text-slate-900 shrink-0"
                          style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs sm:text-sm italic leading-relaxed mt-0.5 font-serif">
                        {product.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              {/* CUADRANTE 2: MUSSELS */}
              <section className="relative">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-4xl sm:text-5xl font-bold font-script-menu text-[#0284c7] tracking-wide">
                    Mussels
                  </h2>
                  <span className="text-[11px] uppercase tracking-widest text-sky-700 font-semibold border-b border-sky-200 pb-0.5">
                    Tacos & Entradas
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {musselProducts.map(product => (
                    <article
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="dish-row group cursor-pointer"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="dish-name font-bold text-base sm:text-lg text-slate-900 shrink-0 font-serif">
                          {product.name}
                        </h3>
                        <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300 transition-colors" />
                        <span
                          className="dish-price font-bold text-base sm:text-lg text-slate-900 shrink-0"
                          style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs sm:text-sm italic leading-relaxed mt-0.5 font-serif">
                        {product.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {/* ═══ FILA INFERIOR: SHRIMPS (Bloque Turquesa) + LOBSTER/CRAB (Marco con Borde Turquesa) ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* CUADRANTE 3 (md:col-span-5): SHRIMPS en bloque turquesa suave */}
              <section className="md:col-span-5 relative bg-gradient-to-br from-cyan-100/90 via-sky-200/80 to-teal-100/70 border border-cyan-300/60 p-6 sm:p-7 shadow-xs rounded-sm overflow-hidden">
                {/* Camarón nadando en la esquina superior derecha */}
                <div className="absolute -top-3 -right-3 w-28 h-28 opacity-65 pointer-events-none select-none text-slate-800">
                  <ShrimpSVG className="w-full h-full" />
                </div>
                {/* Camarón en la esquina inferior izquierda */}
                <div className="absolute -bottom-4 -left-4 w-24 h-24 opacity-55 pointer-events-none select-none text-slate-800">
                  <ShrimpSVG className="w-full h-full transform -scale-x-100 rotate-45" />
                </div>
                {/* Rodaja de limón inferior */}
                <div className="absolute bottom-2 right-4 w-12 h-12 opacity-60 pointer-events-none select-none text-slate-700">
                  <LemonSliceSVG className="w-full h-full" />
                </div>

                <div className="relative z-10">
                  <h2 className="text-4xl sm:text-5xl font-bold font-script-menu text-[#0369a1] mb-5 tracking-wide">
                    Shrimps
                  </h2>

                  <div className="flex flex-col gap-5">
                    {shrimpProducts.map(product => (
                      <article
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className="dish-row group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="dish-name font-bold text-base sm:text-lg text-slate-900 shrink-0 font-serif">
                            {product.name}
                          </h3>
                          <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-sky-400/80 transition-colors" />
                          <span
                            className="dish-price font-bold text-base sm:text-lg text-slate-900 shrink-0"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                          >
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-700 text-xs sm:text-sm italic leading-relaxed mt-0.5 font-serif">
                          {product.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </section>

              {/* CUADRANTE 4 (md:col-span-7): LOBSTER • CRAB en marco con borde cian de 2px */}
              <section className="md:col-span-7 relative border-2 border-[#0ea5e9] bg-white/75 backdrop-blur-xs p-6 sm:p-7 shadow-xs rounded-sm">
                {/* Cangrejo en esquina superior derecha */}
                <div className="absolute -top-6 -right-6 w-28 h-20 opacity-75 pointer-events-none select-none text-slate-800">
                  <CrabSVG className="w-full h-full" />
                </div>
                {/* Ostras en esquina inferior derecha */}
                <div className="absolute -bottom-5 -right-3 w-16 h-24 opacity-75 pointer-events-none select-none text-slate-800">
                  <OysterSVG className="w-full h-full" />
                </div>

                {/* Título en Script que interrumpe o encabeza el recuadro */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-4xl sm:text-5xl font-bold font-script-menu text-[#0284c7] tracking-wide">
                    Lobster • Crab
                  </h2>
                  <span className="text-[11px] uppercase tracking-widest text-sky-700 font-semibold border-b border-sky-200 pb-0.5">
                    Aguachiles & Especialidades
                  </span>
                </div>

                {/* Lista de platillos con líderes punteados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {lobsterCrabProducts.map((product, i) => (
                    <article
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`dish-row group cursor-pointer ${i < 2 ? 'sm:col-span-2' : ''}`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="dish-name font-bold text-base text-slate-900 shrink-0 font-serif">
                          {product.name}
                        </h3>
                        <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300 transition-colors" />
                        <span
                          className="dish-price font-bold text-base text-slate-900 shrink-0"
                          style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs italic leading-relaxed mt-0.5 font-serif">
                        {product.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          /* VISTA FILTRADA POR CATEGORÍA O BÚSQUEDA */
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-sky-100">
              <h2 className="text-3xl sm:text-4xl font-bold font-script-menu text-[#0284c7]">
                {selectedCategory === 'Todos' ? `Resultados para "${searchQuery}"` : selectedCategory}
              </h2>
              <span className="text-xs text-slate-500">
                {filteredProducts.length} platillos encontrados
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-sky-200 rounded-lg max-w-md mx-auto my-8 bg-white/50">
                <p className="text-slate-500 text-base mb-3">No encontramos platillos con "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="text-sky-700 underline text-sm font-semibold hover:text-sky-900"
                >
                  Ver todo el menú
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map(product => (
                  <article
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="dish-row group cursor-pointer bg-white/60 p-4 border border-sky-100 rounded-sm hover:border-sky-300 shadow-2xs"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="dish-name font-bold text-lg text-slate-900 shrink-0 font-serif">
                        {product.name}
                      </h3>
                      <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300 transition-colors" />
                      <span
                        className="dish-price font-bold text-lg text-slate-900 shrink-0"
                        style={{ fontFamily: "'Oswald', sans-serif" }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start mt-1 gap-3">
                      <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed font-serif">
                        {product.description}
                      </p>
                      {product.featured && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                          <Sparkles size={11} className="text-sky-600" />
                          Especial
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── MODAL DETALLE / PEDIDO RÁPIDO WHATSAPP ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-sky-200 shadow-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              {selectedProduct.category}
            </span>

            <h3 className="text-2xl font-bold font-serif text-slate-900 mt-3 mb-1">
              {selectedProduct.name}
            </h3>

            <p className="text-slate-600 text-sm italic font-serif leading-relaxed mb-4">
              {selectedProduct.description}
            </p>

            <div className="flex items-center justify-between py-3 border-t border-b border-sky-100 my-4">
              <span className="text-xs uppercase font-semibold text-slate-500">Precio</span>
              <span
                className="text-2xl font-bold text-slate-900"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                ${selectedProduct.price.toFixed(2)} MXN
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleOrderWhatsApp(selectedProduct)}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle size={15} />
                <span>Pedir por WhatsApp</span>
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER EDITORIAL LUMINOSO CON DETALLES NÁUTICOS ─── */}
      <footer className="bg-slate-50 border-t border-sky-100 pt-12 pb-8 px-4 text-slate-600">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-left">
            {/* Columna 1: Candymar */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border border-sky-300 p-0.5 bg-white overflow-hidden shadow-2xs">
                  <img src={logo} alt="Candymar Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-2xl font-serif leading-none">
                    Candymar
                  </h3>
                  <span className="text-[11px] text-sky-700 uppercase tracking-widest font-semibold">
                    Marisquería de Tradición
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-serif">
                Los mariscos más frescos con recetas tradicionales de Colima y Sinaloa. Ceviches preparados al momento, tacos dorados, camarones y aguachiles con sazón inigualable.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-sky-800 bg-sky-100/70 px-2.5 py-1 rounded-full">
                <span>✦</span>
                <span>100% Fresco de Temporada</span>
              </div>
            </div>

            {/* Columna 2: Contacto & Ubicación */}
            <div>
              <h4
                className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Contacto & Visítanos
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-sky-600 shrink-0 mt-0.5" />
                  <span>Av. Ignacio Sandoval #1401, Colima, Col.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-sky-600 shrink-0" />
                  <span>(312) 123-4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-sky-600 shrink-0" />
                  <span>contacto@candymar.com</span>
                </li>
              </ul>
              <div className="mt-4 text-[11px] text-slate-500 font-serif">
                <strong className="text-slate-700">Horario:</strong> Miércoles a Lunes de 11:00 AM a 7:00 PM
              </div>
            </div>

            {/* Columna 3: Síguenos & Descarga */}
            <div>
              <h4
                className="text-slate-900 font-bold text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Síguenos & Descarga
              </h4>
              <p className="text-xs text-slate-600 mb-3 font-serif">
                Consulta nuestras promociones y platillos del día en redes sociales.
              </p>
              <div className="flex items-center gap-2.5 mb-4">
                <a
                  href="#facebook"
                  onClick={e => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-white border border-sky-200 flex items-center justify-center text-sky-700 hover:bg-sky-600 hover:text-white transition-colors shadow-2xs"
                  aria-label="Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#instagram"
                  onClick={e => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-white border border-sky-200 flex items-center justify-center text-sky-700 hover:bg-sky-600 hover:text-white transition-colors shadow-2xs"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Download size={13} />
                <span>Descargar Menú PDF (Acuarela)</span>
              </button>
            </div>
          </div>

          {/* Créditos de Imagine & Stamp */}
          <div className="pt-6 border-t border-sky-200/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Candymar Seafood. Todos los derechos reservados.</p>
            <p>
              Menú Digital interactivo diseñado por{' '}
              <a
                href="https://imagineandstamp.site"
                target="_blank"
                rel="noreferrer"
                className="text-sky-700 font-bold hover:underline"
              >
                IMAGINE & STAMP
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ─── BOTÓN VOLVER ARRIBA ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 h-10 w-10 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        } bg-[#0284c7] text-white hover:bg-[#0369a1]`}
        aria-label="Volver arriba"
      >
        <ChevronUp size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}
