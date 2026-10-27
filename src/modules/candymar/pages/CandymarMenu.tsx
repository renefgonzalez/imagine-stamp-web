import { useState, useMemo, useRef, useEffect } from 'react';
import { Download, Search, Sparkles, ChevronUp, MapPin, Phone, Mail, Instagram, Facebook, MessageCircle, X, RefreshCw } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import CandymarPrintTemplate from './CandymarPrintTemplate';
import { CATEGORIES, PRODUCTS } from './CandymarData';
import logo from '../assets/logo.png';
import fondoAcuarela from '../assets/fondo-acuarela.webp';
import pescadoGrabado from '../assets/pescado-grabado.webp';
import camaronGrabado from '../assets/camaron-grabado.webp';
import cangrejoGrabado from '../assets/cangrejo-grabado.webp';
import ostrasGrabado from '../assets/ostras-grabado.webp';
import limonRomeroGrabado from '../assets/limon-romero-grabado.webp';
import { useAutoUpdate } from '../../../hooks/useAutoUpdate';

// ─── Motas y salpicaduras de acuarela en Azul Rey y Powder Blue ─────────────
const WatercolorSplatterDots = ({ className = "" }: { className?: string }) => (
  <svg className={`pointer-events-none select-none ${className}`} viewBox="0 0 800 300" fill="none">
    {/* Racimos de salpicaduras en Azul Rey, Sapphire y Powder Blue */}
    <circle cx="45" cy="80" r="3.5" fill="#7097C2" opacity="0.55" />
    <circle cx="55" cy="95" r="2" fill="#162660" opacity="0.6" />
    <circle cx="70" cy="75" r="5" fill="#A8C5E0" opacity="0.4" />
    <circle cx="85" cy="110" r="2.5" fill="#7097C2" opacity="0.5" />
    <circle cx="95" cy="88" r="4" fill="#2A4374" opacity="0.45" />
    <circle cx="115" cy="120" r="6" fill="#D0E6FD" opacity="0.35" />
    <circle cx="130" cy="98" r="2" fill="#162660" opacity="0.6" />

    <circle cx="210" cy="190" r="4.5" fill="#7097C2" opacity="0.5" />
    <circle cx="225" cy="210" r="2" fill="#162660" opacity="0.55" />
    <circle cx="240" cy="175" r="5.5" fill="#A8C5E0" opacity="0.45" />
    <circle cx="260" cy="225" r="3" fill="#D0E6FD" opacity="0.5" />
    <circle cx="280" cy="195" r="2.5" fill="#2A4374" opacity="0.6" />
    <circle cx="300" cy="235" r="4" fill="#7097C2" opacity="0.4" />

    <circle cx="420" cy="140" r="3.5" fill="#162660" opacity="0.55" />
    <circle cx="435" cy="165" r="5" fill="#A8C5E0" opacity="0.4" />
    <circle cx="450" cy="130" r="2" fill="#2A4374" opacity="0.65" />
    <circle cx="475" cy="180" r="4" fill="#D0E6FD" opacity="0.45" />
    <circle cx="490" cy="150" r="2.5" fill="#7097C2" opacity="0.5" />
    <circle cx="510" cy="170" r="6" fill="#A8C5E0" opacity="0.35" />

    <circle cx="620" cy="70" r="4" fill="#7097C2" opacity="0.5" />
    <circle cx="635" cy="95" r="2.5" fill="#162660" opacity="0.6" />
    <circle cx="650" cy="65" r="5" fill="#A8C5E0" opacity="0.45" />
    <circle cx="670" cy="115" r="3" fill="#D0E6FD" opacity="0.5" />
    <circle cx="690" cy="85" r="6.5" fill="#2A4374" opacity="0.4" />
    <circle cx="710" cy="125" r="2" fill="#162660" opacity="0.6" />
    <circle cx="735" cy="95" r="4.5" fill="#7097C2" opacity="0.45" />

    <circle cx="340" cy="60" r="3" fill="#A8C5E0" opacity="0.5" />
    <circle cx="355" cy="85" r="2" fill="#162660" opacity="0.6" />
    <circle cx="370" cy="50" r="4.5" fill="#D0E6FD" opacity="0.4" />
    <circle cx="560" cy="240" r="4" fill="#2A4374" opacity="0.5" />
    <circle cx="580" cy="260" r="2.5" fill="#162660" opacity="0.65" />
    <circle cx="600" cy="230" r="5.5" fill="#7097C2" opacity="0.4" />
  </svg>
);

// ─── Burbujas marinas flotantes del Hero en Azul Rey y Powder Blue ──────────
const HeroAquaticBubbles = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
    viewBox="0 0 340 300"
    fill="none"
  >
    {/* Burbujas flotando sobre y a los lados de "Menu" */}
    <circle cx="32" cy="40" r="3" fill="#7097C2" opacity="0.65" />
    <circle cx="48" cy="25" r="4.5" fill="#D0E6FD" opacity="0.6" />
    <circle cx="140" cy="30" r="3.5" fill="#162660" opacity="0.6" />
    <circle cx="160" cy="18" r="5" fill="#7097C2" opacity="0.55" />
    <circle cx="182" cy="45" r="2.5" fill="#2A4374" opacity="0.75" />

    {/* Burbujas ascendentes a la derecha de Menu y SEAFOOD */}
    <circle cx="235" cy="28" r="3.5" fill="#A8C5E0" opacity="0.55" />
    <circle cx="255" cy="46" r="5.5" fill="#D0E6FD" opacity="0.65" />
    <circle cx="275" cy="35" r="2.5" fill="#162660" opacity="0.8" />
    <circle cx="295" cy="60" r="4" fill="#7097C2" opacity="0.55" />
    <circle cx="245" cy="82" r="2" fill="#2A4374" opacity="0.7" />
    <circle cx="270" cy="98" r="4.5" fill="#A8C5E0" opacity="0.55" />
    <circle cx="300" cy="110" r="5" fill="#D0E6FD" opacity="0.5" />

    {/* Burbujas flotando a la izquierda y centro */}
    <circle cx="18" cy="90" r="2" fill="#162660" opacity="0.65" />
    <circle cx="34" cy="108" r="3.5" fill="#7097C2" opacity="0.55" />
    <circle cx="16" cy="150" r="4" fill="#D0E6FD" opacity="0.5" />

    {/* Burbujas flotando alrededor de la cabecera */}
    <circle cx="65" cy="210" r="3" fill="#7097C2" opacity="0.6" />
    <circle cx="82" cy="225" r="2" fill="#162660" opacity="0.7" />
    <circle cx="240" cy="200" r="3.5" fill="#A8C5E0" opacity="0.55" />
    <circle cx="265" cy="220" r="5" fill="#D0E6FD" opacity="0.5" />
  </svg>
);

// ─── Estilos y Fuentes Google ────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&family=Oswald:wght@500;600;700&family=Montserrat:wght@400;600;700;800;900&family=Caveat:wght@600;700&display=swap');

  .font-script {
    font-family: 'Dancing Script', 'Caveat', cursive;
  }

  .font-display {
    font-family: 'Playfair Display', Georgia, serif;
  }

  .font-price {
    font-family: 'Oswald', sans-serif;
  }

  .font-sans-title {
    font-family: 'Montserrat', sans-serif;
  }

  /* Ilustraciones de grabado náutico con canal alfa transparente */
  .etching-art {
    filter: drop-shadow(0 2px 6px rgba(2, 132, 199, 0.08));
    transition: transform 0.3s ease;
  }
  .etching-art:hover {
    transform: scale(1.02);
  }

  .cat-scroll::-webkit-scrollbar {
    display: none;
  }
  .cat-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Hover interactivo sobre platillos con acento náutico */
  .dish-item {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 6px;
    padding: 3px 6px;
    margin: -3px -6px;
  }
  .dish-item:hover {
    background-color: rgba(22, 38, 96, 0.05);
  }
  .dish-item:hover .dish-title {
    color: #162660 !important;
  }
  .dish-item:hover .dish-dots {
    border-color: #162660 !important;
  }
`;

export default function CandymarMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(typeof PRODUCTS)[0] | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Hook de Auto-Update para detectar novedades y cambios en el menú sin fricción de caché
  const { hasUpdate, applyUpdate, checkNow } = useAutoUpdate(60000);

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
        filename: 'Menu_Candymar_Seafood_Acuarela.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.2, useCORS: true },
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

  // Productos seleccionados para la lámina de arte de 4 cuadrantes (idéntica a la maqueta)
  const fishProducts = useMemo(
    () =>
      PRODUCTS.filter(
        p =>
          (p.category === 'Entradas & Ceviches' || p.category === 'Pescados & Filetes') &&
          (p.name.toLowerCase().includes('ceviche') || p.name.toLowerCase().includes('pescado') || p.name.toLowerCase().includes('filete')),
      ).slice(0, 5),
    [],
  );

  const musselProducts = useMemo(
    () =>
      PRODUCTS.filter(
        p =>
          p.category === 'Tacos & Tostadas' &&
          (p.name.toLowerCase().includes('gobernador') ||
            p.name.toLowerCase().includes('candymar') ||
            p.name.toLowerCase().includes('baja') ||
            p.name.toLowerCase().includes('pulpo') ||
            p.name.toLowerCase().includes('callo')),
      ).slice(0, 5),
    [],
  );

  const shrimpProducts = useMemo(
    () => PRODUCTS.filter(p => p.category === 'Camarones').slice(0, 5),
    [],
  );

  const lobsterCrabProducts = useMemo(
    () =>
      PRODUCTS.filter(
        p =>
          p.category === 'Botanas Frías' ||
          p.category === 'Cocteles & Caldos' ||
          p.name.toLowerCase().includes('chacales'),
      ).slice(0, 6),
    [],
  );

  return (
    <div
      className="min-h-screen font-sans text-slate-800 selection:bg-cyan-200 selection:text-sky-950 relative"
      style={{
        backgroundColor: '#f6fbfe',
        backgroundImage: `url(${fondoAcuarela})`,
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100% auto',
      }}
    >
      <style>{STYLES}</style>

      {/* ─── PLANTILLA DE IMPRESIÓN (OCULTA) ─── */}
      <div className="overflow-hidden h-0 w-0 absolute -left-[9999px]">
        <CandymarPrintTemplate ref={printRef} />
      </div>

      {/* ─── BARRA SUPERIOR FLOTANTE CON LOGO Y ACCIONES ─── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-200/70 shadow-2xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-sky-300 shadow-xs bg-white">
              <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 tracking-tight leading-none block">
                Candymar
              </span>
              <span className="text-[10px] text-sky-700 uppercase tracking-widest font-bold block">
                Seafood & Grill
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botón discreto de auto-update / verificación de cambios */}
            <button
              onClick={() => {
                if (hasUpdate) {
                  applyUpdate();
                } else {
                  checkNow();
                }
              }}
              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-100/60 rounded-full transition-colors relative cursor-pointer"
              title={hasUpdate ? "¡Novedades disponibles! Toca para actualizar" : "Verificar novedades en el menú"}
              aria-label="Verificar novedades del menú"
            >
              <RefreshCw size={14} className={hasUpdate ? "animate-spin text-sky-600" : ""} />
              {hasUpdate && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-sky-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-full transition-all shadow-2xs"
              title="Descargar Menú en PDF idéntico a la lámina de acuarela"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>

            <a
              href={`https://wa.me/${candymarPhone}?text=${encodeURIComponent('¡Hola Candymar! Quisiera consultar su menú del día y hacer un pedido.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-all shadow-2xs"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Pedir por WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── CONTENEDOR PRINCIPAL: LÁMINA EDITORIAL DE ACUARELA ORIGINAL ─── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-20">
        <div
          className="relative bg-white/90 rounded-2xl shadow-xl border border-sky-200/80 p-5 sm:p-10 lg:p-14 overflow-hidden"
          style={{
            backgroundImage: `url(${fondoAcuarela})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════
              ILUSTRACIONES EN TINTA DE GRABADO AL AGUAFUERTE EN BORDES Y ESQUINAS
              ═══════════════════════════════════════════════════════════════ */}

          {/* Cangrejo en el borde superior */}
          <div className="absolute -top-3 left-1/3 w-28 sm:w-36 pointer-events-none select-none z-0 opacity-85 hidden md:block">
            <img src={cangrejoGrabado} alt="Crab engraving" className="w-full h-auto etching-art" />
          </div>

          {/* Ostras / Mejillones abiertos en la esquina superior derecha */}
          <div className="absolute -top-6 -right-6 w-36 sm:w-48 pointer-events-none select-none z-0 opacity-85 hidden sm:block">
            <img src={ostrasGrabado} alt="Oysters engraving" className="w-full h-auto etching-art" />
          </div>

          {/* Rodajas de limón y romero en margen izquierdo superior */}
          <div className="absolute -top-4 -left-4 w-20 sm:w-28 pointer-events-none select-none z-0 opacity-80 hidden sm:block">
            <img src={limonRomeroGrabado} alt="Lemon and rosemary" className="w-full h-auto etching-art" />
          </div>

          {/* Salpicaduras de puntitos azules orgánicos en el fondo */}
          <WatercolorSplatterDots className="absolute top-24 left-0 w-full h-44 opacity-85 z-0" />
          <WatercolorSplatterDots className="absolute bottom-6 left-0 w-full h-56 opacity-90 z-0" />

          {/* Barra de búsqueda y categorías integradas con delicadeza en paleta Azul Rey y Crema */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-[#162660]/15">
            <div className="flex items-center gap-2 overflow-x-auto cat-scroll w-full md:w-auto py-1">
              {CATEGORIES.map(cat => {
                const active = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`whitespace-nowrap px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-all duration-200 rounded-full ${
                      active
                        ? 'bg-[#162660] text-white shadow-xs'
                        : 'bg-[#FBF8F3] text-slate-700 border border-[#162660]/20 hover:border-[#162660] hover:text-[#162660] shadow-2xs'
                    }`}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#162660] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar platillo, taco, aguachile..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#FBF8F3]/95 border border-[#162660]/20 focus:border-[#162660] text-slate-800 text-xs px-3 py-2 pl-9 rounded-full focus:outline-none focus:ring-2 focus:ring-[#162660]/20 placeholder-slate-400 transition-all font-sans shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {selectedCategory === 'Todos' && !searchQuery ? (
            /* ═══════════════════════════════════════════════════════════════
               LÁMINA EDITORIAL: LOS 4 CUADRANTES DE LA IMAGEN DE REFERENCIA
               ═══════════════════════════════════════════════════════════════ */
            <div className="relative z-10 space-y-10 sm:space-y-14">
              {/* FILA 1: MENU SEAFOOD + FISH + MUSSELS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                {/* Cuadrante 1: Header Caligráfico + LOGO CANDYMAR CENTRADO + Burbujas Acuáticas */}
                <div className="lg:col-span-4 relative flex flex-col items-center text-center pr-0 lg:pr-2">
                  {/* Burbujas celestes y turquesas idénticas a la captura original */}
                  <HeroAquaticBubbles />

                  <div className="flex justify-center items-center gap-3 w-full relative z-10">
                    <h1
                      className="text-6xl sm:text-7xl font-bold font-script text-[#162660] leading-none select-none"
                      style={{
                        transform: 'rotate(-4deg)',
                        display: 'inline-block',
                        textShadow: '0 2px 10px rgba(22,38,96,0.18)',
                      }}
                    >
                      Menu
                    </h1>
                  </div>

                  <div className="mt-1 w-full relative z-10">
                    <span className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-slate-900 block font-sans-title">
                      SEAFOOD
                    </span>
                  </div>

                  <div className="flex justify-center items-center gap-2 mt-1 text-slate-700 font-script text-xl sm:text-2xl italic select-none w-full relative z-10">
                    <span className="text-[#162660] font-bold">•</span>
                    <span>Always Fresh</span>
                    <span className="text-[#162660] font-bold">•</span>
                  </div>

                  {/* LOGO DE CANDYMAR EN LUGAR DEL PESCADO (CENTRADO) */}
                  <div className="w-48 sm:w-60 mt-4 relative z-10 flex justify-center items-center mx-auto">
                    <img
                      src={logo}
                      alt="Candymar Seafood Logo"
                      className="w-full h-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Cuadrante 2: FISH con Pescadito Grabado que encuadra (lg:col-span-4) */}
                <div className="lg:col-span-4">
                  <div className="flex items-center justify-between mb-4 border-b border-[#162660]/20 pb-1 relative">
                    <div>
                      <h2 className="text-4xl sm:text-5xl font-bold font-script text-[#162660] leading-none">
                        Fish
                      </h2>
                      <span className="text-[10px] uppercase tracking-widest text-[#2A4374] font-bold block mt-0.5">
                        Pescados & Ceviches
                      </span>
                    </div>
                    {/* Pescadito grabado más pequeño encuadrando con sutileza */}
                    <div className="w-20 sm:w-24 shrink-0 pointer-events-none select-none opacity-85 hover:opacity-100 transition-opacity">
                      <img
                        src={pescadoGrabado}
                        alt="Fish engraving"
                        className="w-full h-auto etching-art transform -scale-x-100 -rotate-2"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {fishProducts.map(p => (
                      <article
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="dish-item group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between text-slate-900">
                          <span className="dish-title font-display font-bold text-base sm:text-lg">
                            {p.name}
                          </span>
                          <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                          <span className="font-price font-bold text-base sm:text-lg shrink-0">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs italic font-serif leading-tight mt-0.5">
                          {p.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>

                {/* Cuadrante 3: MUSSELS (lg:col-span-4) */}
                <div className="lg:col-span-4">
                  <div className="flex items-baseline justify-between mb-4 border-b border-[#162660]/20 pb-1">
                    <h2 className="text-4xl sm:text-5xl font-bold font-script text-[#162660]">
                      Mussels
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-[#2A4374] font-bold">
                      Tacos & Entradas
                    </span>
                  </div>

                  <div className="space-y-4">
                    {musselProducts.map(p => (
                      <article
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="dish-item group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between text-slate-900">
                          <span className="dish-title font-display font-bold text-base sm:text-lg">
                            {p.name}
                          </span>
                          <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                          <span className="font-price font-bold text-base sm:text-lg shrink-0">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs italic font-serif leading-tight mt-0.5">
                          {p.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* FILA 2: SHRIMPS (POWDER BLUE ELEGANTE) + LOBSTER • CRAB (MARCO AZUL REY & CREMA) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                {/* Cuadrante 4: SHRIMPS en Powder Blue Náutico Sofisticado (lg:col-span-5) */}
                <section
                  className="lg:col-span-5 relative p-6 sm:p-7 rounded-sm shadow-xs overflow-hidden flex flex-col justify-between border border-[#162660]/20"
                  style={{
                    backgroundColor: '#D0E6FD',
                    backgroundImage: `
                      radial-gradient(circle at 10% 20%, rgba(255,255,255,0.6) 0%, transparent 60%),
                      radial-gradient(circle at 90% 80%, rgba(22,38,96,0.12) 0%, transparent 60%)
                    `,
                  }}
                >
                  {/* Camarón grabado nadando en esquina superior derecha */}
                  <div className="absolute -top-3 -right-2 w-28 sm:w-36 pointer-events-none select-none opacity-85 z-0">
                    <img src={camaronGrabado} alt="Shrimp top" className="w-full h-auto etching-art" />
                  </div>

                  {/* Camarón grabado en esquina inferior izquierda */}
                  <div className="absolute -bottom-3 -left-3 w-24 sm:w-32 pointer-events-none select-none opacity-75 z-0">
                    <img
                      src={camaronGrabado}
                      alt="Shrimp bottom"
                      className="w-full h-auto etching-art transform -scale-x-100 rotate-45"
                    />
                  </div>

                  <div className="relative z-10">
                    <h2 className="text-4xl sm:text-5xl font-bold font-script text-[#162660] mb-5 tracking-wide">
                      Shrimps
                    </h2>

                    <div className="space-y-4">
                      {shrimpProducts.map(p => (
                        <article
                          key={p.id}
                          onClick={() => setSelectedProduct(p)}
                          className="dish-item group cursor-pointer"
                        >
                          <div className="flex items-baseline justify-between text-slate-900">
                            <span className="dish-title font-display font-bold text-base sm:text-lg">
                              {p.name}
                            </span>
                            <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-[#162660]/30" />
                            <span className="font-price font-bold text-base sm:text-lg shrink-0">
                              ${p.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[#162660]/85 text-xs italic font-serif leading-tight mt-0.5">
                            {p.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 pt-3 border-t border-[#162660]/20 text-[11px] text-[#162660] font-semibold flex items-center justify-between">
                    <span>✦ Especialidad de la Casa</span>
                    <span>Receta Sinaloa</span>
                  </div>
                </section>

                {/* Cuadrante 5: LOBSTER • CRAB en Marco Azul Rey con Fondo Crema (lg:col-span-7) */}
                <section className="lg:col-span-7 relative border-2 border-[#162660] bg-[#FBF8F3]/95 backdrop-blur-xs p-6 sm:p-7 rounded-sm shadow-xs flex flex-col justify-between">
                  {/* Cangrejo grabado asomándose en esquina superior derecha */}
                  <div className="absolute -top-7 -right-7 w-28 sm:w-36 pointer-events-none select-none opacity-85 z-0">
                    <img src={cangrejoGrabado} alt="Crab" className="w-full h-auto etching-art" />
                  </div>

                  {/* Ostras grabadas en esquina inferior derecha */}
                  <div className="absolute -bottom-6 -right-5 w-24 sm:w-32 pointer-events-none select-none opacity-85 z-0">
                    <img src={ostrasGrabado} alt="Mussels" className="w-full h-auto etching-art" />
                  </div>

                  {/* Título en Script que encabeza el recuadro */}
                  <div className="relative z-10 flex items-center justify-between mb-5">
                    <h2 className="text-4xl sm:text-5xl font-bold font-script text-[#162660]">
                      Lobster • Crab
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-[#2A4374] font-bold border-b border-[#162660]/20 pb-0.5">
                      Aguachiles & Especialidades
                    </span>
                  </div>

                  {/* 2 Platillos superiores anchos (como en la maqueta original) */}
                  <div className="relative z-10 space-y-4 mb-4 pb-4 border-b border-[#162660]/15">
                    {lobsterCrabProducts.slice(0, 2).map(p => (
                      <article
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="dish-item group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between text-slate-900">
                          <span className="dish-title font-display font-bold text-base sm:text-lg">
                            {p.name}
                          </span>
                          <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                          <span className="font-price font-bold text-base sm:text-lg shrink-0">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-xs italic font-serif leading-tight mt-0.5">
                          {p.description}
                        </p>
                      </article>
                    ))}
                  </div>

                  {/* Dos columnas inferiores divididas */}
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {lobsterCrabProducts.slice(2).map(p => (
                      <article
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className="dish-item group cursor-pointer"
                      >
                        <div className="flex items-baseline justify-between text-slate-900">
                          <span className="dish-title font-display font-bold text-sm sm:text-base">
                            {p.name}
                          </span>
                          <span className="dish-dots flex-1 mx-1.5 border-b-2 border-dotted border-slate-300" />
                          <span className="font-price font-bold text-sm sm:text-base shrink-0">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] italic font-serif leading-tight mt-0.5">
                          {p.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  CATÁLOGO COMPLETO ORGANIZADO POR CATEGORÍAS (111 PLATILLOS REALES)
                  ═══════════════════════════════════════════════════════════════ */}
              <div className="pt-10 border-t border-[#162660]/20">
                <div className="text-center mb-10">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#2A4374] font-bold font-sans-title">
                    Marisquería de Tradición · Colima & Sinaloa
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-bold font-script text-[#162660] mt-1">
                    Menú Completo de la Casa
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm font-serif italic max-w-lg mx-auto mt-1">
                    Toca cualquier platillo para ver el detalle y pedirlo directo por WhatsApp.
                  </p>
                </div>

                <div className="space-y-12">
                  {CATEGORIES.filter(c => c.name !== 'Todos').map(category => {
                    const catProducts = PRODUCTS.filter(p => p.category === category.name);
                    if (catProducts.length === 0) return null;

                    return (
                      <section
                        key={category.name}
                        className="relative p-6 sm:p-8 rounded-xl border border-[#162660]/15 shadow-2xs transition-all bg-[#FBF8F3]/95 backdrop-blur-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-2 border-b border-[#162660]/15">
                          <h4 className="text-3xl sm:text-4xl font-bold font-script text-[#162660]">
                            {category.name}
                          </h4>
                          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                            {catProducts.length} opciones
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                          {catProducts.map(p => (
                            <article
                              key={p.id}
                              onClick={() => setSelectedProduct(p)}
                              className="dish-item group cursor-pointer"
                            >
                              <div className="flex items-baseline justify-between text-slate-900">
                                <span className="dish-title font-display font-bold text-base">
                                  {p.name}
                                </span>
                                <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                                <span className="font-price font-bold text-base shrink-0">
                                  ${p.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-start justify-between gap-2 mt-0.5">
                                <p className="text-slate-600 text-xs italic font-serif leading-tight">
                                  {p.description}
                                </p>
                                {p.featured && (
                                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-[#162660] bg-[#D0E6FD] px-2 py-0.5 rounded-full">
                                    Top
                                  </span>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* VISTA FILTRADA POR CATEGORÍA O BÚSQUEDA */
            <div className="relative z-20">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#162660]/20">
                <h2 className="text-3xl sm:text-4xl font-bold font-script text-[#162660]">
                  {selectedCategory === 'Todos' ? `Resultados para "${searchQuery}"` : selectedCategory}
                </h2>
                <span className="text-xs text-slate-500">
                  {filteredProducts.length} platillos encontrados
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#162660]/20 rounded-lg max-w-md mx-auto my-6 bg-[#FBF8F3]/80">
                  <p className="text-slate-500 text-sm mb-2">No encontramos platillos con "{searchQuery}"</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('Todos');
                    }}
                    className="text-[#162660] underline text-xs font-semibold hover:text-[#2A4374]"
                  >
                    Ver todo el menú
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredProducts.map(p => (
                    <article
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="dish-item group cursor-pointer bg-[#FBF8F3]/95 p-4 border border-[#162660]/15 rounded-sm hover:border-[#162660] shadow-2xs"
                    >
                      <div className="flex items-baseline justify-between text-slate-900">
                        <span className="dish-title font-display font-bold text-base sm:text-lg">
                          {p.name}
                        </span>
                        <span className="dish-dots flex-1 mx-2 border-b-2 border-dotted border-slate-300" />
                        <span className="font-price font-bold text-base sm:text-lg shrink-0">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-start mt-1 gap-2">
                        <p className="text-slate-600 text-xs italic font-serif leading-tight">
                          {p.description}
                        </p>
                        {p.featured && (
                          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#162660] bg-[#D0E6FD] px-2 py-0.5 rounded-full">
                            <Sparkles size={11} className="text-[#162660]" />
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
        </div>
      </div>

      {/* ─── BANNER FLOTANTE DE AUTO-UPDATE (NOVEDADES EN EL MENÚ) ─── */}
      {hasUpdate && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[92%] sm:w-auto bg-[#162660] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center justify-between gap-3 border border-white/30 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span className="text-xs font-semibold leading-tight">
              ¡Novedades disponibles en el menú!
            </span>
          </div>
          <button
            onClick={applyUpdate}
            className="bg-white text-[#162660] hover:bg-[#D0E6FD] text-xs font-bold px-3 py-1 rounded-full transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            Ver cambios
          </button>
        </div>
      )}

      {/* ─── MODAL DETALLE / PEDIDO WHATSAPP ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-[#FBF8F3] rounded-lg border border-[#162660]/20 shadow-xl max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
              aria-label="Cerrar modal"
            >
              <X size={18} />
            </button>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#162660] bg-[#D0E6FD]/70 px-2.5 py-1 rounded-full border border-[#162660]/15">
              {selectedProduct.category}
            </span>

            <h3 className="text-2xl font-bold font-display text-slate-900 mt-3 mb-1">
              {selectedProduct.name}
            </h3>

            <p className="text-slate-600 text-sm italic font-serif leading-relaxed mb-4">
              {selectedProduct.description}
            </p>

            <div className="flex items-center justify-between py-3 border-t border-b border-[#162660]/15 my-4">
              <span className="text-xs uppercase font-semibold text-slate-500">Precio</span>
              <span className="font-price text-2xl font-bold text-slate-900">
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
                className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-md transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOOTER EDITORIAL EN TONOS NÁUTICOS CLAROS ─── */}
      <footer className="bg-[#FBF8F3]/95 border-t border-[#162660]/15 pt-12 pb-8 px-4 text-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 text-left">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full border border-[#162660]/25 p-0.5 bg-white overflow-hidden shadow-2xs">
                  <img src={logo} alt="Candymar Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-[#162660] font-bold text-2xl font-display leading-none">
                    Candymar
                  </h3>
                  <span className="text-[11px] text-[#2A4374] uppercase tracking-widest font-semibold">
                    Marisquería de Tradición
                  </span>
                </div>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed font-serif">
                Los mariscos más frescos con recetas tradicionales de Colima y Sinaloa. Ceviches preparados al momento, tacos dorados, camarones y aguachiles con sazón inigualable.
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-[#162660] bg-[#D0E6FD]/60 px-2.5 py-1 rounded-full border border-[#162660]/15">
                <span>✦</span>
                <span>100% Fresco de Temporada</span>
              </div>
            </div>

            <div>
              <h4 className="text-[#162660] font-bold text-xs uppercase tracking-widest mb-4 font-sans-title">
                Contacto & Visítanos
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-[#162660] shrink-0 mt-0.5" />
                  <span>Av. Ignacio Sandoval #1401, Colima, Col.</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-[#162660] shrink-0" />
                  <span>(312) 123-4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-[#162660] shrink-0" />
                  <span>contacto@candymar.com</span>
                </li>
              </ul>
              <div className="mt-4 text-[11px] text-slate-500 font-serif">
                <strong className="text-slate-700">Horario:</strong> Miércoles a Lunes de 11:00 AM a 7:00 PM
              </div>
            </div>

            <div>
              <h4 className="text-[#162660] font-bold text-xs uppercase tracking-widest mb-4 font-sans-title">
                Síguenos & Descarga
              </h4>
              <p className="text-xs text-slate-600 mb-3 font-serif">
                Consulta nuestras promociones y platillos del día en redes sociales.
              </p>
              <div className="flex items-center gap-2.5 mb-4">
                <a
                  href="#facebook"
                  onClick={e => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-white border border-[#162660]/20 flex items-center justify-center text-[#162660] hover:bg-[#162660] hover:text-white transition-colors shadow-2xs"
                  aria-label="Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#instagram"
                  onClick={e => e.preventDefault()}
                  className="w-8 h-8 rounded-full bg-white border border-[#162660]/20 flex items-center justify-center text-[#162660] hover:bg-[#162660] hover:text-white transition-colors shadow-2xs"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
              </div>
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2 px-3 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-colors flex items-center justify-center gap-2 shadow-xs font-sans-title"
              >
                <Download size={13} />
                <span>Descargar Menú PDF (Acuarela)</span>
              </button>
            </div>
          </div>

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
