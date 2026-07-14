import { useState, useMemo, useEffect, useCallback } from 'react';
import logo from '../assets/logo.png';

// ─── Datos Hardcodeados ────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Todos', icon: '📋' },
  { name: "Pa' Que Empieces", icon: '🍤' },
  { name: 'Tacos', icon: '🌮' },
  { name: 'Camarones', icon: '🦐' },
  { name: 'Aguachile', icon: '🌶️' },
  { name: 'Bebidas', icon: '🍹' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Orden Ceviche Camarón',
    description: 'Estilo Colima y Sinaloa.',
    price: 195.00,
    category: "Pa' Que Empieces",
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=300&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Taco Gobernador',
    description: 'Con costra de queso.',
    price: 70.00,
    category: 'Tacos',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 3,
    name: 'Camarones Empanizados',
    description: 'Acompañados de arroz y ensalada.',
    price: 200.00,
    category: 'Camarones',
    image: 'https://images.unsplash.com/photo-1625937751876-4cb7df34a2e5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 4,
    name: 'Aguachile Negro, Verde o Rojo',
    description: 'Elige tu salsa favorita.',
    price: 200.00,
    category: 'Aguachile',
    image: 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 5,
    name: 'Agua Fresca del Día',
    description: 'Jarra de 1 Litro.',
    price: 50.00,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80',
  },
];

// ─── Colores de la paleta ──────────────────────────────────────────────────────
//
//   Navy:    #002b5e   (textos principales, footer)
//   Ocean:   #0077b6   (acentos, precios, categoría activa)
//   Coral:   #e07b4c   (detalles cálidos, separadores)
//   Slate:   text-slate-500 (secundarios)
//

const CORAL = '#e07b4c';

// ─── Iconos SVG inline ─────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="h-5 w-5 text-[#0077b6] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5 text-[#0077b6] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="h-5 w-5 text-[#0077b6] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-4 w-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
  </svg>
);

// ─── Patrón de olas SVG para fondo ─────────────────────────────────────────────

const WAVE_PATTERN_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='120' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,40 C150,70 350,0 600,40 C850,80 1050,10 1200,40 L1200,120 L0,120 Z' fill='%230077b6' opacity='0.03'/%3E%3Cpath d='M0,60 C200,30 400,80 600,55 C800,30 1000,75 1200,55 L1200,120 L0,120 Z' fill='%230077b6' opacity='0.02'/%3E%3C/svg%3E`;

// ─── CSS para animación fade-in ────────────────────────────────────────────────

const FADE_IN_STYLE = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.candymar-card {
  opacity: 0;
  animation: fadeInUp 0.4s ease-out forwards;
}
`;

// ─── Componente Principal ──────────────────────────────────────────────────────

export default function CandymarMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(price);
  };

  // ─── Scroll listener para botón "Volver arriba" ───

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const countLabel =
    filteredProducts.length === 1
      ? '1 platillo'
      : `${filteredProducts.length} platillos`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col relative">
      {/* Animaciones CSS */}
      <style>{FADE_IN_STYLE}</style>

      {/* Patrón de olas de fondo (solo decoración sutil) */}
      <div
        className="absolute inset-0 pointer-events-none bg-repeat-x"
        style={{ backgroundImage: `url(${WAVE_PATTERN_SVG})`, backgroundPosition: 'bottom', backgroundSize: '100% auto' }}
      />

      {/* ─── Header ─── */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100">
              <img src={logo} alt="Candymar Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#002b5e] leading-tight">Candymar</h1>
              <p className="text-xs text-slate-500 -mt-0.5">Mariscos Frescos</p>
            </div>
          </div>
        </div>

        {/* ─── Ribbon: horario + ubicación ─── */}
        <div style={{ backgroundColor: CORAL }} className="text-white">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-0.5 text-xs sm:text-sm font-medium">
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon />
              Lun–Dom · 11:00 AM – 9:00 PM
            </span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span>Av. Ignacio Sandoval #1401</span>
          </div>
        </div>
      </header>

      {/* ─── Barra de búsqueda ─── */}
      <div className="bg-white border-b border-slate-100 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar platillo, bebida..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-[#002b5e] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-shadow text-sm"
            />
          </div>
        </div>
      </div>

      {/* ─── Categorías deslizables ─── */}
      <div className="bg-white border-b border-slate-100 sticky top-[100px] z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0077b6] text-white shadow-md shadow-[#0077b6]/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-base leading-none">{cat.icon}</span>
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Parrilla de productos ─── */}
      <main className="flex-1 max-w-6xl mx-auto px-4 pt-6 pb-8 w-full relative z-10">
        {/* Contador de resultados */}
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
          {countLabel}
        </p>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No se encontraron productos</p>
            <p className="text-slate-300 text-sm mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <article
                key={product.id}
                className="candymar-card bg-white rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col relative"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Badge "Favorito" */}
                {product.featured && (
                  <div className="absolute top-3 right-3 z-10 bg-amber-400 text-[#002b5e] text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Favorito de la casa
                  </div>
                )}

                {/* Imagen */}
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#002b5e] leading-tight mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
                    {product.description}
                  </p>
                  {/* Divisor */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-lg font-black text-[#0077b6]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ─── Separador de olas ─── */}
      <div className="relative h-16 sm:h-20 overflow-hidden bg-blue-50 z-10">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C120,65 240,15 360,40 C480,65 600,15 720,40 C840,65 960,15 1080,40 C1200,65 1320,15 1440,40 L1440,80 L0,80 Z"
            fill="#002b5e"
          />
        </svg>
      </div>

      {/* ─── Footer 3 columnas ─── */}
      <footer className="bg-[#002b5e] text-white relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna 1: Logo y descripción */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Candymar</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Los mariscos más frescos de la región, preparados con recetas tradicionales
                de Colima y Sinaloa. Calidad y sabor que nos distinguen.
              </p>
            </div>

            {/* Columna 2: Contacto */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <LocationIcon />
                  <span className="text-blue-200 text-sm">Av. Ignacio Sandoval #1401</span>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneIcon />
                  <span className="text-blue-200 text-sm">(312) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <EmailIcon />
                  <span className="text-blue-200 text-sm">contacto@candymar.com</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Redes sociales */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-white">Síguenos</h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Firma */}
          <div className="mt-10 pt-6 border-t border-white/10 text-center">
            <p className="text-blue-200 text-xs">
              Diseñado por <span className="font-semibold text-white">IMAGINE & STAMP</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Botón "Volver arriba" ─── */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ backgroundColor: CORAL }}
        aria-label="Volver arriba"
      >
        <ChevronUpIcon />
      </button>
    </div>
  );
}
