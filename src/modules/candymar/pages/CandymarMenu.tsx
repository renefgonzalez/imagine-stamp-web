import { useState, useMemo, useRef, useEffect } from 'react';
import { Download, Search, Sparkles, ChevronUp, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import CandymarPrintTemplate from './CandymarPrintTemplate';
import { CATEGORIES, PRODUCTS } from './CandymarData';
import logo from '../assets/logo.png';
import pulpoReal from '../assets/pulpo-real.png';
import cangrejoReal from '../assets/cangrejo-real.png';

// ─── Linocut Waves Border (Borde de olas linograbado cian como en la foto) ───
const LinocutWaveBorder = ({ className = "h-4 w-full" }: { className?: string }) => (
  <div className={`overflow-hidden flex items-center justify-between text-[#00e5ff] select-none ${className}`}>
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 22" fill="none">
      {Array.from({ length: 55 }).map((_, i) => (
        <path
          key={i}
          d={`M${i * 18 + 2} 19 L${i * 18 + 12} 3`}
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.85"
        />
      ))}
    </svg>
  </div>
);

// ─── Listón / Ribbon Plegado Cian (Idéntico a los encabezados de la foto) ───
const CyanRibbonBanner = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="relative flex items-center mb-6 mt-3">
    {/* Cuerpo principal del listón en cian eléctrico */}
    <div
      className="relative inline-flex items-center bg-[#00e5ff] text-[#0a0c10] px-5 sm:px-8 py-2 font-black tracking-widest uppercase shadow-[0_4px_16px_rgba(0,229,255,0.3)] z-10"
      style={{ fontFamily: "'Oswald', sans-serif", fontSize: '15px' }}
    >
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 bg-[#0a0c10] rotate-45 inline-block" />
        {title}
      </span>
      {subtitle && (
        <span className="ml-3 text-[11px] font-semibold normal-case opacity-75 border-l border-[#0a0c10]/30 pl-2">
          {subtitle}
        </span>
      )}

      {/* Doblez 3D del listón en el extremo derecho */}
      <div
        className="absolute -right-3.5 top-0 bottom-0 w-3.5 bg-[#0092a8]"
        style={{
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
        }}
      />
    </div>

    {/* Línea punteada de extensión hacia la derecha */}
    <div className="flex-1 h-[2px] ml-5 border-b-2 border-dashed border-[#00e5ff]/40" />
  </div>
);

// ─── Estilos y Fuentes Google ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playball&family=Oswald:wght@500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Caveat:wght@600;700&family=Cinzel:wght@700;900&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-item {
    opacity: 0;
    animation: fadeUp 0.4s ease-out forwards;
  }

  .cat-scroll::-webkit-scrollbar {
    display: none;
  }
  .cat-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Pizarra con sutil textura de gis / linograbado */
  .chalkboard-bg {
    background-color: #121316;
    background-image: 
      radial-gradient(ellipse at 50% 12%, rgba(28, 32, 42, 0.7) 0%, rgba(18, 19, 22, 0.95) 70%, #0d0e11 100%),
      radial-gradient(circle at 10% 50%, rgba(0, 229, 255, 0.03) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.03) 0%, transparent 40%);
  }

  /* Filtro cian eléctrico para bocetos como el pulpo del encabezado */
  .sketch-cyan {
    filter: invert(75%) sepia(85%) saturate(1476%) hue-rotate(143deg) brightness(105%) contrast(105%) drop-shadow(0 0 10px rgba(0, 229, 255, 0.45));
  }

  /* Filtro gis blanco para bocetos de apoyo */
  .sketch-chalk {
    filter: invert(1) brightness(1.2) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.8));
  }

  /* Hover interactivo para platillos */
  .dish-row {
    transition: all 0.25s ease;
    border-radius: 8px;
    padding: 6px 10px;
    margin: -6px -10px;
  }
  .dish-row:hover {
    background-color: rgba(0, 229, 255, 0.05);
  }
  .dish-row:hover .dish-name,
  .dish-row:hover .dish-price {
    color: #00e5ff !important;
  }
  .dish-row:hover .dish-dots {
    border-color: rgba(0, 229, 255, 0.7) !important;
  }
`;

export default function CandymarMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(
    () => PRODUCTS.filter(p => {
      const matchCat = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
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
        filename:     'Menu_Candymar_Seafood.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

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

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="chalkboard-bg text-zinc-300 min-h-screen font-sans selection:bg-[#00e5ff] selection:text-black">
      <style>{STYLES}</style>

      {/* ─── PLANTILLA DE IMPRESIÓN (OCULTA) ─── */}
      <div className="overflow-hidden h-0 w-0 absolute -left-[9999px]">
        <CandymarPrintTemplate ref={printRef} />
      </div>

      {/* ─── BORDE DE OLAS SUPERIOR LINOGRABADO ─── */}
      <LinocutWaveBorder className="h-5 opacity-90" />

      {/* ─── ENCABEZADO PRINCIPAL (Estilo Portada & Menú de la imagen) ─── */}
      <header className="relative pt-6 pb-10 px-4 overflow-hidden border-b border-zinc-800">
        {/* Pulpo Gigante Cian en la esquina superior (como en la página de menú de la foto) */}
        <div className="absolute -top-10 -right-12 md:right-10 w-72 md:w-96 pointer-events-none select-none z-0 opacity-40 md:opacity-65 sketch-cyan">
          <img src={pulpoReal} alt="Octopus sketch" className="w-full h-auto" />
        </div>

        {/* Pulpo de apoyo tenue en la esquina izquierda inferior */}
        <div className="absolute -bottom-16 -left-12 w-64 pointer-events-none select-none z-0 opacity-20 sketch-chalk hidden sm:block">
          <img src={cangrejoReal} alt="Crab sketch" className="w-full h-auto" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Badge Superior "SEA FOOD / Sketch" */}
          <div className="inline-flex flex-col items-center mb-6">
            <div className="inline-flex flex-col items-center bg-[#00e5ff] text-[#0a0c10] px-7 py-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] border border-[#00d0e7]">
              <span className="text-xs font-black tracking-[0.25em] uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                SEA FOOD
              </span>
              <span className="text-sm italic font-serif -mt-1 text-[#050709]" style={{ fontFamily: "'Playball', 'Caveat', cursive" }}>
                Sketch & Sabor
              </span>
            </div>
            {/* Olas decorativas miniatura bajo el badge */}
            <div className="w-28 text-[#00e5ff] opacity-70 mt-1">
              <svg viewBox="0 0 100 8" fill="none" className="w-full h-2">
                <path d="M0 4 Q12.5 0 25 4 T50 4 T75 4 T100 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </div>

          {/* Marco Doble Cian de la Portada */}
          <div className="relative border-2 border-[#00e5ff] px-6 sm:px-14 py-7 sm:py-9 bg-[#14161c]/90 backdrop-blur-md max-w-xl mx-auto shadow-[0_0_40px_rgba(0,229,255,0.18)]">
            {/* Esquinas decorativas dobles */}
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 border-t-2 border-l-2 border-[#00e5ff]" />
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 border-t-2 border-r-2 border-[#00e5ff]" />
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 border-b-2 border-l-2 border-[#00e5ff]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 border-b-2 border-r-2 border-[#00e5ff]" />

            {/* Logo de Candymar */}
            <div className="flex justify-center -mt-16 sm:-mt-20 mb-3">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border-2 border-[#00e5ff] p-1 bg-[#121316] shadow-[0_0_25px_rgba(0,229,255,0.45)]">
                <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover rounded-full" />
              </div>
            </div>

            {/* Título "Candymar" en tipografía Script */}
            <h1 className="text-3xl sm:text-4xl italic text-white mb-0.5 tracking-wide" style={{ fontFamily: "'Playball', 'Georgia', serif" }}>
              Candymar
            </h1>

            {/* Título "MENU" en bloque 3D vintage con sombra */}
            <h2
              className="text-5xl sm:text-7xl font-black uppercase tracking-wider text-white leading-none mb-3"
              style={{
                fontFamily: "'Impact', 'Oswald', sans-serif",
                textShadow: '3px 4px 0 #000, 0 0 25px rgba(0,229,255,0.3)',
              }}
            >
              MENU
            </h2>

            {/* Listón / Banner Vintage "Premium Quality" */}
            <div className="inline-flex items-center gap-3 px-5 py-1 border border-[#00e5ff]/50 bg-[#181a21] text-[#00e5ff] text-[11px] sm:text-xs uppercase font-bold tracking-[0.25em] shadow-inner">
              <span className="text-[#00e5ff]">★</span>
              <span>PREMIUM QUALITY SEAFOOD</span>
              <span className="text-[#00e5ff]">★</span>
            </div>

            {/* Anotaciones estilo tiza a mano como en la foto */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 font-serif italic px-2">
              <span className="flex items-center gap-1 text-[#00e5ff]">
                <span>~</span> Receta Colima & Sinaloa
              </span>
              <span className="text-[#00e5ff]">✦</span>
              <span className="flex items-center gap-1 text-zinc-400">
                100% Fresco de Temporada <span>~</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ─── BARRA STICKY DE CATEGORÍAS (Estilo Pizarra con Listones) ─── */}
      <nav className="sticky top-0 z-40 bg-[#121316]/95 backdrop-blur-md border-b border-zinc-800 shadow-xl py-3 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto cat-scroll py-1 flex-1">
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap px-4 sm:px-5 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider transition-all duration-200 rounded-sm relative ${
                    active
                      ? 'bg-[#00e5ff] text-[#0b0d10] shadow-[0_0_15px_rgba(0,229,255,0.4)] border border-[#00d0e7]'
                      : 'bg-[#181a20] text-zinc-400 border border-zinc-700/60 hover:border-[#00e5ff]/50 hover:text-white'
                  }`}
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  {cat.name}
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#00e5ff] rotate-45" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Botón rápido PDF */}
          <button
            onClick={handleDownloadPDF}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00e5ff] border border-[#00e5ff]/40 bg-[#161820] hover:bg-[#00e5ff] hover:text-black transition-all rounded-sm shrink-0"
            title="Descargar Menú PDF estilo Pizarra"
          >
            <Download size={14} />
            <span>Descargar PDF</span>
          </button>
        </div>
      </nav>

      {/* ─── BUSCADOR ESTILO PIZARRA CON DETALLES CIAN ─── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-7">
        <div className="relative max-w-lg mx-auto">
          <Search className="w-5 h-5 text-[#00e5ff] absolute left-4 top-3.5 opacity-80" />
          <input
            type="text"
            placeholder="Buscar ceviche, taco, camarones, aguachile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161820] border-2 border-zinc-700 focus:border-[#00e5ff] text-white text-sm px-4 py-3 pl-11 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#00e5ff]/20 placeholder-zinc-500 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-zinc-400 hover:text-white px-2 py-1 bg-zinc-800 rounded"
            >
              Borrar
            </button>
          )}
        </div>
      </div>

      {/* ─── CONTENIDO PRINCIPAL: LAYOUT SPLIT CON "CHOICE OF THE DAY" ─── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-24">
        {Object.keys(groupedProducts).length === 0 ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-lg max-w-md mx-auto my-10">
            <p className="text-zinc-500 text-lg mb-2">No encontramos platillos con "{searchQuery}"</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="text-[#00e5ff] underline text-sm hover:text-white"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Columna Izquierda / Principal: Categorías y Platillos */}
            <div className="lg:col-span-8 flex flex-col gap-12">
              {Object.entries(groupedProducts).map(([category, products]) => (
                <section key={category} className="relative">
                  {/* Listón Cian de Categoría (Idéntico a la imagen) */}
                  <CyanRibbonBanner title={category} />

                  {/* Lista de Platillos con línea punteada */}
                  <div className="flex flex-col gap-6 pl-1 sm:pl-2">
                    {products.map((product, i) => (
                      <article
                        key={product.id}
                        className="fade-item dish-row group cursor-default"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        {/* Fila: Nombre .......... Precio */}
                        <div className="flex items-end justify-between gap-2">
                          <h3
                            className="dish-name font-bold text-lg sm:text-xl text-white shrink-0 tracking-wide"
                            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                          >
                            {product.name}
                          </h3>

                          {/* Línea punteada de tiza que conecta nombre y precio */}
                          <span className="dish-dots flex-1 mx-2 mb-1.5 border-b-2 border-dotted border-zinc-700" />

                          <span
                            className="dish-price font-bold text-lg sm:text-xl text-white shrink-0 tracking-tight"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                          >
                            ${product.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Descripción y Badge Especial */}
                        <div className="flex justify-between items-start mt-1 gap-4">
                          <p className="text-zinc-400 text-xs sm:text-sm italic leading-relaxed font-serif">
                            {product.description}
                          </p>
                          {product.featured && (
                            <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-2 py-0.5 rounded-sm">
                              <Sparkles size={11} className="text-[#00e5ff]" />
                              Especial
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Columna Derecha: "CHOICE OF THE DAY" con bocetos estilo gis (Exacto a la foto) */}
            <aside className="lg:col-span-4 hidden lg:flex flex-col gap-8 border-l border-dashed border-zinc-700/80 pl-8">
              {/* Tarjeta 1: Choice of the Day - Pulpo */}
              <div className="border border-zinc-800 bg-[#161820]/60 p-5 rounded-sm text-center relative overflow-hidden">
                <div className="inline-block border-b border-[#00e5ff] pb-1 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00e5ff]" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    CHOICE OF THE DAY
                  </span>
                </div>
                <h4 className="text-white text-xl font-bold font-serif mb-2">
                  Especialidad de la Casa
                </h4>
                <div className="w-48 h-48 mx-auto my-2 sketch-chalk opacity-90">
                  <img src={pulpoReal} alt="Octopus sketch" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-zinc-400 italic font-serif leading-relaxed">
                  "Mariscos preparados al momento con ingredientes frescos, salsas artesanales y el toque tradicional de la costa."
                </p>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-[#00e5ff] uppercase tracking-wider font-bold">
                  ✦ Garantía de Calidad
                </div>
              </div>

              {/* Tarjeta 2: Choice of the Day - Cangrejo */}
              <div className="border border-zinc-800 bg-[#161820]/60 p-5 rounded-sm text-center relative overflow-hidden">
                <div className="inline-block border-b border-[#00e5ff] pb-1 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#00e5ff]" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    RECOMENDACIÓN DEL CHEF
                  </span>
                </div>
                <h4 className="text-white text-xl font-bold font-serif mb-2">
                  Sabor Tradicional
                </h4>
                <div className="w-44 h-44 mx-auto my-2 sketch-chalk opacity-90">
                  <img src={cangrejoReal} alt="Crab sketch" className="w-full h-full object-contain" />
                </div>
                <p className="text-xs text-zinc-400 italic font-serif leading-relaxed">
                  "Prueba nuestros aguachiles negros y verdes marinados en limón persa con chile serrano y guajillo."
                </p>
                <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-[#00e5ff] uppercase tracking-wider font-bold">
                  ✦ Estilo Colima & Sinaloa
                </div>
              </div>

              {/* Horario y Servicio */}
              <div className="border border-[#00e5ff]/30 bg-[#00e5ff]/5 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-[#00e5ff] mb-1">
                  HORARIO DE SERVICIO
                </p>
                <p className="text-white text-sm font-serif">Miércoles a Lunes</p>
                <p className="text-zinc-400 text-xs mt-0.5">11:00 AM – 7:00 PM</p>
                <p className="text-[11px] text-[#00e5ff] mt-3 font-semibold">
                  Servicio para comer aquí & para llevar
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* ─── BORDE DE OLAS INFERIOR LINOGRABADO ─── */}
      <LinocutWaveBorder className="h-5 opacity-90 rotate-180" />

      {/* ─── FOOTER ESTILO PIZARRA CON DETALLES CIAN ─── */}
      <footer className="bg-[#0e0f12] border-t border-zinc-800 pt-12 pb-8 px-4 text-zinc-400">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-left">
            {/* Columna 1: Candymar */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full border border-[#00e5ff] p-0.5 bg-black overflow-hidden">
                  <img src={logo} alt="Candymar Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="text-[#00e5ff] font-bold text-2xl font-serif" style={{ fontFamily: "'Playball', 'Georgia', serif" }}>
                  Candymar
                </h3>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed font-serif">
                Los mariscos más frescos preparados con recetas tradicionales de Colima y Sinaloa. Ceviches, tacos dorados, camarones y aguachiles con sazón inigualable.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-[#00e5ff] border border-[#00e5ff]/30 bg-[#00e5ff]/5 px-3 py-1">
                <span>✦</span>
                <span>Calidad & Frescura Garantizada</span>
              </div>
            </div>

            {/* Columna 2: Contacto & Ubicación */}
            <div>
              <h4 className="text-[#00e5ff] font-bold text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Contacto & Visítanos
              </h4>
              <ul className="space-y-3 text-xs text-zinc-300">
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#00e5ff] shrink-0 mt-0.5" />
                  <span>Av. Ignacio Sandoval #1401, Colima</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} className="text-[#00e5ff] shrink-0" />
                  <span>(312) 123-4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={16} className="text-[#00e5ff] shrink-0" />
                  <span>contacto@candymar.com</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Síguenos & PDF */}
            <div>
              <h4 className="text-[#00e5ff] font-bold text-sm uppercase tracking-widest mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Síguenos & Descarga
              </h4>
              <p className="text-xs text-zinc-400 mb-4">
                Consulta nuestras novedades y platillos del día en nuestras redes sociales oficiales.
              </p>
              <div className="flex items-center gap-3 mb-5">
                <a
                  href="#facebook"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
                <a
                  href="#instagram"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 rounded-full bg-zinc-900 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] hover:bg-[#00e5ff] hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 px-4 bg-[#00e5ff] text-black font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-[#00cbe3] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                <Download size={14} />
                <span>Descargar Menú PDF (Pizarra)</span>
              </button>
            </div>
          </div>

          {/* Créditos de Imagine & Stamp */}
          <div className="pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} Candymar. Todos los derechos reservados.</p>
            <p>
              Menú Digital interactivo diseñado por{' '}
              <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="text-[#00e5ff] font-bold hover:underline">
                IMAGINE & STAMP
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ─── BOTÓN VOLVER ARRIBA ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(0,229,255,0.4)] ${
          showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        }`}
        style={{ backgroundColor: '#00e5ff', color: '#000' }}
        aria-label="Volver arriba"
      >
        <ChevronUp size={24} strokeWidth={2.5} />
      </button>
    </div>
  );
}
