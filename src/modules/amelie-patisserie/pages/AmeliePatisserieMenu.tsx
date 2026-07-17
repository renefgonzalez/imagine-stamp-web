import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, Check, Instagram, Phone, MapPin, ChevronLeft, ChevronUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const CATEGORIES = ['Todos', 'Pasteles', 'Galletas', 'Muffins', 'Tartas', 'Postres'];

const PRODUCTS = [
  {
    id: 1,
    name: 'Pastel de Durazno',
    description: 'Delicioso pastel tradicional con cobertura de durazno y crema batida.',
    price: 450.00,
    category: 'Pasteles',
    image: '/amelie/cake_1.jpg',
    featured: true,
  },
  {
    id: 2,
    name: 'Pastel Selva Negra',
    description: 'Clásico de chocolate con cerezas frescas y virutas de chocolate belga.',
    price: 520.00,
    category: 'Pasteles',
    image: '/amelie/cake_2.jpg',
    featured: true,
  },
  {
    id: 3,
    name: 'Galletas Decoradas',
    description: 'Galletas suaves de vainilla con glaseado real y chispas de colores.',
    price: 120.00,
    category: 'Galletas',
    image: '/amelie/cake_3.jpg',
  },
  {
    id: 4,
    name: 'Postre de Mora en Molde',
    description: 'Suave crema de mora azul con base de galleta y detalles dorados.',
    price: 180.00,
    category: 'Postres',
    image: '/amelie/cake_4.jpg',
  },
  {
    id: 5,
    name: 'Caja de Muffins (6 pzas)',
    description: 'Surtido de nuestros mejores sabores: chocolate, vainilla y frutos rojos.',
    price: 150.00,
    category: 'Muffins',
    image: '/amelie/cake_5.jpg',
  },
  {
    id: 6,
    name: 'Pastel de Chocolate Belga',
    description: 'Tres capas de chocolate belga con ganache semi-amargo y decoración floral.',
    price: 550.00,
    category: 'Pasteles',
    image: '/amelie/cake_6.jpg',
  },
  {
    id: 7,
    name: 'Tarta de Frutos Rojos',
    description: 'Base crujiente con crema pastelera y mix de frutos rojos frescos.',
    price: 280.00,
    category: 'Tartas',
    image: '/amelie/cake_7.jpg',
  },
  {
    id: 8,
    name: 'Croissants de Mantequilla',
    description: 'Hojaldre francés artesanal, dorado y crujiente. 4 piezas.',
    price: 130.00,
    category: 'Pasteles',
    image: '/amelie/cake_8.jpg',
  },
  {
    id: 9,
    name: 'Macarons Franceses (6 pzas)',
    description: 'Sabores variados: pistache, frambuesa, vainilla y chocolate. Hechos a mano.',
    price: 180.00,
    category: 'Galletas',
    image: '/amelie/cake_9.jpg',
    featured: true,
  },
  {
    id: 10,
    name: 'Éclairs de Chocolate (4 pzas)',
    description: 'Masa choux rellena de crema pastelera, cubierta con chocolate oscuro.',
    price: 160.00,
    category: 'Postres',
    image: '/amelie/cake_10.jpg',
  },
  {
    id: 11,
    name: 'Pastel Red Velvet',
    description: 'Suave bizcocho aterciopelado con queso crema y decoración elegante.',
    price: 490.00,
    category: 'Pasteles',
    image: '/amelie/cake_11.jpg',
    featured: true,
  },
  {
    id: 12,
    name: 'Galletas de Mantequilla',
    description: 'Galletas danesas tradicionales, ideales para acompañar café o té. 8 piezas.',
    price: 95.00,
    category: 'Galletas',
    image: '/amelie/cake_12.jpg',
  },
  {
    id: 13,
    name: 'Muffins de Arándano',
    description: 'Esponjosos muffins horneados al momento con arándanos frescos. 4 piezas.',
    price: 140.00,
    category: 'Muffins',
    image: '/amelie/cake_13.jpg',
  },
  {
    id: 14,
    name: 'Tarta de Limón',
    description: 'Tarta francesa con curd de limón y merengue italiano tostado.',
    price: 260.00,
    category: 'Tartas',
    image: '/amelie/cake_14.jpg',
  },
  {
    id: 15,
    name: 'Cheesecake de Maracuyá',
    description: 'New York cheesecake con coulis de maracuyá, textura cremosa y suave.',
    price: 210.00,
    category: 'Postres',
    image: '/amelie/cake_15.jpg',
  },
];

// ─── CSS para animación fade-in ──────────────────────────────────────────────────

const FADE_IN_STYLE = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.amelie-card {
  opacity: 0;
  animation: fadeInUp 0.45s ease-out forwards;
}
`;

interface CartItem {
  product: typeof PRODUCTS[0];
  quantity: number;
}

export default function AmeliePatisserieMenu() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2 | 3>(1);
  const [clientData, setClientData] = useState({ name: '', phone: '', date: '', deliveryMethod: '', paymentMethod: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [cartToast, setCartToast] = useState<{ name: string } | null>(null);
  const WHATSAPP_NUMBER = '525951151341';

  // ─── Scroll listener ──────────────────────────────────────────────────────────

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToMenu = () => {
    setShowIntro(false);
    window.scrollTo(0, 0);
  };

  const closeCartAndReset = () => {
    setIsCartOpen(false);
    setCart([]);
    setClientData({ name: '', phone: '', date: '', deliveryMethod: '', paymentMethod: '' });
    setCartStep(1);
  };

  // ─── Filtrado ─────────────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const countLabel = filteredProducts.length === 1
    ? '1 delicia encontrada'
    : `${filteredProducts.length} delicias encontradas`;

  // ─── Formato de precio MX ─────────────────────────────────────────────────────

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(price);

  // ─── Carrito ──────────────────────────────────────────────────────────────────

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartToast({ name: product.name });
    setTimeout(() => setCartToast(null), 2500);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const lines = cart
      .map(i => `  \u2022 ${i.product.name} x${i.quantity} \u2014 ${formatPrice(i.product.price * i.quantity)}`)
      .join('\n');

    const message =
      `\uD83C\uDF70 *Nuevo Pedido - Amélie Patisserie*\n\n` +
      `*Cliente:* ${clientData.name}\n` +
      `*Teléfono:* ${clientData.phone}\n` +
      `*Fecha de entrega:* ${clientData.date}\n\n` +
      `*Detalle del pedido:*\n${lines}\n\n` +
      `*Total:* ${formatPrice(cartTotal)}\n\n` +
      `*Método de Entrega:* ${clientData.deliveryMethod}\n` +
      `*Forma de Pago:* ${clientData.paymentMethod}\n\n` +
      `_Pedido generado desde el menú web_ \u2728`;

    // 1. Mostrar pantalla de éxito
    setCartStep(3);

    // 2. Abrir WhatsApp tras un breve delay para permitir el renderizado
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#fff6f5] font-sans flex flex-col">
      <style>{FADE_IN_STYLE}</style>

      {/* ═══════════════════════════════════════════════════════════════════════════
          INTRO / LANDING — Pantalla completa, desaparece al hacer clic en "Ver Menú"
          ════════════════════════════════════════════════════════════════════════ */}
      {showIntro && (
        <section className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
          {/* Fondo con imagen de pastelería difuminada */}
          <div className="absolute inset-0 z-0 bg-[#fff6f5]">
            <img
              src="/amelie/cake_1.jpg"
              alt=""
              className="w-full h-full object-cover opacity-40 blur-[2px] scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fff6f5]/70 via-[#fff6f5]/50 to-[#fff6f5]/80" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <img
              src={logo}
              alt="Amélie Patisserie Logo"
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl"
            />
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative z-10 text-5xl md:text-7xl font-[cursive] text-[#5b4a4d] text-center leading-tight mb-4 drop-shadow-md"
          >
            Amélie
            <br />
            <span className="text-[#e28399]">Patisserie</span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="relative z-10 text-[#76c6b3] text-sm md:text-base font-bold tracking-[0.25em] uppercase mb-3 drop-shadow-sm"
          >
            Patisserie Artisanale
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative z-10 text-[#5b4a4d] text-sm md:text-base max-w-md text-center leading-relaxed mb-10 px-4 drop-shadow-sm"
          >
            Creaciones artesanales que endulzan tus momentos más especiales. Cada pieza está hecha con amor y los mejores ingredientes.
          </motion.p>

          {/* Botón */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            onClick={scrollToMenu}
            className="relative z-10 group px-10 py-4 bg-[#e28399] text-white font-bold text-lg rounded-full flex items-center gap-3 hover:bg-[#d17389] hover:scale-105 transition-all duration-300 shadow-xl shadow-[#e28399]/30 hover:shadow-2xl hover:shadow-[#e28399]/40 active:scale-95"
          >
            <span className="tracking-wide">Ver Menú</span>
            <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
          </motion.button>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          CATÁLOGO — Visible solo después de cerrar la intro
          ════════════════════════════════════════════════════════════════════════ */}
      {!showIntro && (
        <>
          {/* ─── Header sticky ──────────────────────────────────────────────────── */}
          <header className="bg-white sticky top-0 z-40 shadow-sm px-4 py-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
              <div>
                <h2 className="text-xl sm:text-2xl font-[cursive] text-[#5b4a4d] tracking-wide">Amélie Patisserie</h2>
                <p className="text-[10px] sm:text-xs text-[#76c6b3] font-bold tracking-[0.2em] uppercase mt-0.5 ml-1">Calidad y Cariño</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#fff6f5] p-3 rounded-full text-[#e28399] hover:bg-[#e28399]/10 transition-all active:scale-95"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-[#009ea9] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </header>

          {/* ─── Main ────────────────────────────────────────────────────────────── */}
          <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
            {/* Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#e28399]/50" />
              </div>
              <input
                type="text"
                placeholder="¿Antojo de algo? Busca entre nuestras creaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 bg-white text-[#5b4a4d] shadow-sm placeholder:text-[#5b4a4d]/30 text-sm transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto gap-3 pb-2 mb-6 no-scrollbar snap-x">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-center shrink-0 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#e28399] text-white shadow-lg shadow-[#e28399]/30'
                      : 'bg-white text-[#5b4a4d]/60 border border-pink-100 hover:bg-pink-50 hover:text-[#5b4a4d]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Result count */}
            <p className="text-xs font-semibold text-[#5b4a4d]/40 uppercase tracking-wider mb-5">
              {countLabel}
            </p>

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map((product, index) => (
                <article
                  key={product.id}
                  className="amelie-card bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col group border border-pink-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {/* Badge "Favorito" */}
                  {product.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-[#e28399] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Star size={12} fill="white" />
                      Favorito
                    </div>
                  )}

                  {/* Imagen */}
                  <div className="aspect-[4/3] overflow-hidden bg-pink-50 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-semibold text-[#009ea9] shadow-sm">
                      {product.category}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5b4a4d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Contenido */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-[#5b4a4d] text-base sm:text-lg mb-1.5 leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-[#5b4a4d]/50 text-xs sm:text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-xl text-[#009ea9]">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-[#e28399] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#d17389] hover:scale-110 transition-all shadow-md shadow-[#e28399]/25 active:scale-95"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <p className="text-[#5b4a4d]/30 text-lg mb-2">No encontramos lo que buscas</p>
                  <p className="text-[#5b4a4d]/20 text-sm">Intenta con otra categoría o búsqueda</p>
                </div>
              )}
            </div>
          </main>

          {/* ─── Footer ──────────────────────────────────────────────────────────── */}
          <footer className="bg-white text-[#5b4a4d] py-12 px-6 mt-12 rounded-t-[2.5rem] border-t border-pink-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start justify-center">
                <img src={logo} alt="Logo" className="h-14 w-14 object-contain mb-3" />
                <h2 className="text-2xl font-[cursive] text-[#5b4a4d] mb-1">Amélie Patisserie</h2>
                <p className="text-[#76c6b3] text-xs font-bold tracking-[0.2em] uppercase mb-4">Calidad y Cariño</p>
                <div className="text-sm text-[#5b4a4d]/60 mb-2 font-medium">Por pedido</div>
                <div className="text-sm text-[#5b4a4d]/60 mb-1">20 días de anticipación</div>
                <div className="text-sm text-[#5b4a4d]/60">50% de anticipo</div>
              </div>

              <div className="flex flex-col items-center md:items-start gap-4 text-sm text-gray-600">
                <h3 className="font-bold text-[#5b4a4d] uppercase tracking-wider text-xs mb-1">Ubicación y Contacto</h3>
                <a href="tel:+525951151341" className="flex items-center gap-3 hover:text-[#8e3371] transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-[#8e3371]/20 flex items-center justify-center text-[#8e3371]"><Phone size={16} /></span>
                  595 115 13 41
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=calle+12+de+Octubre+35+col.+Las+Américas+Texcoco" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-left hover:text-[#d27e9f] transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-[#d27e9f]/20 flex items-center justify-center text-[#d27e9f]"><MapPin size={16} /></span>
                  <span>calle 12 de Octubre #35 col. Las Américas,<br/>Texcoco Edo. De México</span>
                </a>
                <a href="mailto:amelie.patisserie.alvarez@gmail.com" className="flex items-center gap-3 text-left break-all hover:text-[#f3c44c] transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-[#f3c44c]/20 flex items-center justify-center text-[#f3c44c] font-bold">@</span>
                  <span>amelie.patisserie.alvarez@gmail.com</span>
                </a>
              </div>

              <div className="flex flex-col items-center md:items-start gap-4 text-sm text-[#5b4a4d]/60">
                <h3 className="font-bold text-[#5b4a4d] uppercase tracking-wider text-xs mb-1">Redes Sociales</h3>
                <a href="https://www.facebook.com/share/1FqG4YbDsG/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-blue-500/20 flex items-center justify-center text-blue-600 font-bold">f</span>
                  Amélie Patisserie
                </a>
                <a href="https://www.instagram.com/amelie_patisserie.alvarez?igsh=aXgxYnc1YmlqZzU1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-pink-600 transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-pink-500/20 flex items-center justify-center text-pink-600"><Instagram size={16} /></span>
                  amelie_patisserie.alvarez
                </a>
                <a href="https://www.tiktok.com/@amelie.patisserie_a28?_r=1&_t=ZS-98496FVNLUa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-black transition-colors">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-white border border-gray-500/20 flex items-center justify-center text-black font-bold">♪</span>
                  amelie.patisserie_a28
                </a>
              </div>
            </div>
            <div className="max-w-5xl mx-auto border-t border-pink-100 mt-8 pt-6 text-center text-xs text-[#5b4a4d]/30">
              Diseñado por IMAGINE & STAMP
            </div>
          </footer>

          {/* ─── Botón Volver Arriba ─────────────────────────────────────────────── */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-[#e28399] text-white shadow-xl flex items-center justify-center hover:bg-[#d17389] transition-colors"
                aria-label="Volver arriba"
              >
                <ChevronUp size={22} />
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════════
          TOAST — Producto agregado
          ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm"
          >
            <div className="bg-[#5b4a4d] text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#e28399] flex items-center justify-center shrink-0">
                <Plus size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">¡Agregado al carrito!</p>
                <p className="text-sm font-bold truncate">{cartToast.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════════
          CART MODAL — Siempre disponible, incluso durante la intro
          ════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-[#5b4a4d]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {cartStep === 2 && (
                    <button onClick={() => setCartStep(1)} className="p-2 text-[#5b4a4d]/50 hover:text-[#5b4a4d] bg-gray-50 rounded-full transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  <h2 className="text-xl font-bold text-[#5b4a4d]">
                    {cartStep === 1 ? 'Tu Pedido' : cartStep === 2 ? 'Tus Datos' : '\u00A1Pedido Confirmado!'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-[#5b4a4d]/40 hover:text-[#5b4a4d]/70 bg-gray-50 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {cartStep === 1 && (
                <>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-[#5b4a4d]/20 gap-4">
                        <ShoppingCart size={48} />
                        <p className="text-sm text-[#5b4a4d]/30">Tu carrito está vacío</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl flex gap-2 leading-relaxed">
                          <span className="shrink-0 mt-0.5">{'\u26A0\uFE0F'}</span>
                          <span><strong>Nota:</strong> Todos los pedidos requieren 20 días de anticipación y 50% de anticipo para confirmar.</span>
                        </div>
                        {cart.map(item => (
                          <div key={item.product.id} className="flex gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                            <div className="flex-1 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-[#5b4a4d] text-sm leading-tight">{item.product.name}</h4>
                                <p className="text-[#009ea9] font-bold text-sm mt-1">{formatPrice(item.product.price)}</p>
                              </div>
                              <div className="flex items-center gap-3 bg-gray-50 self-start rounded-lg border border-gray-200">
                                <button onClick={() => updateQuantity(item.product.id, -1)} className="w-8 h-8 flex items-center justify-center text-[#5b4a4d]/50 hover:bg-gray-200 rounded-l-lg transition-colors"><Minus size={14} /></button>
                                <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, 1)} className="w-8 h-8 flex items-center justify-center text-[#5b4a4d]/50 hover:bg-gray-200 rounded-r-lg transition-colors"><Plus size={14} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                      <div className="flex justify-between items-center mb-4 text-lg">
                        <span className="text-[#5b4a4d]/60">Total</span>
                        <span className="font-bold text-[#5b4a4d]">{formatPrice(cartTotal)}</span>
                      </div>
                      <button
                        onClick={() => setCartStep(2)}
                        className="w-full bg-[#009ea9] hover:bg-[#008d96] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#009ea9]/30 active:scale-[0.98]"
                      >
                        Continuar
                      </button>
                    </div>
                  )}
                </>
              )}

              {cartStep === 2 && (
                <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col h-full">
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-bold text-[#5b4a4d] mb-1">Nombre Completo *</label>
                      <input
                        required type="text"
                        value={clientData.name} onChange={e => setClientData({ ...clientData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 focus:border-[#e28399]/30 bg-gray-50 text-[#5b4a4d] placeholder:text-[#5b4a4d]/25 transition-all"
                        placeholder="Ej. María López"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#5b4a4d] mb-1">Teléfono (WhatsApp) *</label>
                      <input
                        required type="tel"
                        value={clientData.phone} onChange={e => setClientData({ ...clientData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 focus:border-[#e28399]/30 bg-gray-50 text-[#5b4a4d] placeholder:text-[#5b4a4d]/25 transition-all"
                        placeholder="10 dígitos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#5b4a4d] mb-1">Fecha de Entrega Deseada *</label>
                      <input
                        required type="date"
                        value={clientData.date} onChange={e => setClientData({ ...clientData, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 focus:border-[#e28399]/30 bg-gray-50 text-[#5b4a4d] transition-all"
                      />
                      <p className="text-xs text-[#e28399] mt-2 font-medium flex items-center gap-1">
                        <span>{'\u26A0\uFE0F'}</span> Recuerda: 20 días de anticipación mínima.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#5b4a4d] mb-1">Método de Entrega *</label>
                      <select
                        required
                        value={clientData.deliveryMethod} onChange={e => setClientData({ ...clientData, deliveryMethod: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 focus:border-[#e28399]/30 bg-gray-50 text-[#5b4a4d] transition-all"
                      >
                        <option value="">Selecciona un método</option>
                        <option value="Recoger en sucursal">Recoger en sucursal</option>
                        <option value="Envío a domicilio">Envío a domicilio (Costo extra)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[#5b4a4d] mb-1">Forma de Pago del Anticipo *</label>
                      <select
                        required
                        value={clientData.paymentMethod} onChange={e => setClientData({ ...clientData, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e28399]/30 focus:border-[#e28399]/30 bg-gray-50 text-[#5b4a4d] transition-all"
                      >
                        <option value="">Selecciona cómo pagarás el anticipo</option>
                        <option value="Transferencia / Depósito">Transferencia / Depósito</option>
                        <option value="Efectivo en sucursal">Efectivo en sucursal</option>
                      </select>
                    </div>

                    {clientData.paymentMethod === 'Transferencia / Depósito' && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 bg-[#fff6f5] p-5 rounded-xl border border-pink-100"
                      >
                        <h4 className="text-[#5b4a4d] font-bold text-sm mb-3">Datos para Transferencia (Anticipo 50%)</h4>
                        <div className="space-y-2 text-sm text-[#5b4a4d]/70">
                          <p><strong className="text-[#5b4a4d]">Banco:</strong> (Por definir)</p>
                          <p><strong className="text-[#5b4a4d]">Titular:</strong> Amélie Patisserie</p>
                          <p><strong className="text-[#5b4a4d]">Cuenta / Tarjeta:</strong> 0000 0000 0000 0000</p>
                          <p><strong className="text-[#5b4a4d]">CLABE:</strong> 000 000 0000000000 0</p>
                        </div>
                        <p className="text-xs text-[#e28399] mt-4 flex gap-2 leading-relaxed">
                          <span>{'\u2139\uFE0F'}</span> Al confirmar tu pedido por WhatsApp, te pediremos el comprobante para validar tu anticipo.
                        </p>
                      </motion.div>
                    )}
                  </div>
                  <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
                    <button
                      type="submit"
                      className="w-full bg-[#e28399] hover:bg-[#d17389] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#e28399]/30 active:scale-[0.98]"
                    >
                      Confirmar Pedido ({formatPrice(cartTotal)})
                    </button>
                  </div>
                </form>
              )}

              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                  {/* Partículas — Framer Motion no maneja bien Math.random() en animate,
                      usamos valores explícitos que sí se mueven visiblemente */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Sparkle 1 */}
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '15%', top: '75%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['75%','35%','25%','10%'], left: ['15%','10%','8%','5%'], scale: [0,1.3,1,0] }}
                      transition={{ duration: 3.5, delay: 0.2, ease: 'easeOut' }}
                    >{'✨'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '30%', top: '80%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['80%','45%','30%','10%'], left: ['30%','35%','32%','40%'], scale: [0,1.2,1,0] }}
                      transition={{ duration: 3.2, delay: 0.5, ease: 'easeOut' }}
                    >{'🍰'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '55%', top: '85%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['85%','50%','35%','15%'], left: ['55%','50%','48%','45%'], scale: [0,1.4,1,0] }}
                      transition={{ duration: 3.8, delay: 0.1, ease: 'easeOut' }}
                    >{'🎉'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '70%', top: '78%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['78%','40%','20%','5%'], left: ['70%','75%','72%','80%'], scale: [0,1.1,0.9,0] }}
                      transition={{ duration: 3.0, delay: 0.8, ease: 'easeOut' }}
                    >{'❤️'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '85%', top: '72%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['72%','38%','22%','8%'], left: ['85%','90%','88%','92%'], scale: [0,1.3,1,0] }}
                      transition={{ duration: 3.6, delay: 0.4, ease: 'easeOut' }}
                    >{'✨'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '8%', top: '70%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['70%','30%','15%','0%'], left: ['8%','5%','3%','10%'], scale: [0,1.2,1,0] }}
                      transition={{ duration: 3.3, delay: 0.7, ease: 'easeOut' }}
                    >{'🥐'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '45%', top: '82%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['82%','48%','30%','12%'], left: ['45%','42%','38%','35%'], scale: [0,1.3,1,0] }}
                      transition={{ duration: 3.1, delay: 0.3, ease: 'easeOut' }}
                    >{'🎂'}</motion.div>
                    <motion.div className="absolute text-xl"
                      initial={{ opacity: 0, left: '62%', top: '76%', scale: 0 }}
                      animate={{ opacity: [0,1,1,0], top: ['76%','42%','28%','8%'], left: ['62%','68%','65%','72%'], scale: [0,1.4,1.1,0] }}
                      transition={{ duration: 3.7, delay: 0.6, ease: 'easeOut' }}
                    >{'💫'}</motion.div>
                  </div>

                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="relative z-10 w-20 h-20 bg-[#009ea9] text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#009ea9]/30"
                  >
                    <Check size={40} />
                  </motion.div>
                  <h3 className="relative z-10 text-2xl font-bold text-[#5b4a4d] mb-3">¡Gracias, {clientData.name || 'por tu pedido'}!</h3>
                  <p className="relative z-10 text-[#5b4a4d]/50 mb-4 leading-relaxed max-w-xs text-sm">
                    Tu solicitud ha sido enviada. En las próximas <strong className="text-[#5b4a4d]">24 horas</strong> nos pondremos en contacto contigo por WhatsApp para coordinar el anticipo del 50% y confirmar tu pedido.
                  </p>
                  <div className="relative z-10 bg-[#fff6f5] border border-pink-100 rounded-xl p-4 mb-6 max-w-xs w-full">
                    <p className="text-xs text-[#5b4a4d]/50 leading-relaxed">
                      <span className="text-[#e28399] font-bold">✨</span> Cada creación es única y la preparamos especialmente para ti. Gracias por confiar en Amélie.
                    </p>
                  </div>
                  <button
                    onClick={closeCartAndReset}
                    className="relative z-10 w-full max-w-xs bg-[#e28399] text-white font-bold py-4 rounded-2xl hover:bg-[#d17389] transition-all shadow-lg shadow-[#e28399]/30 active:scale-[0.98]"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
