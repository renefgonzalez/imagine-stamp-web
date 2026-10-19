// ── Strong Gym Iron City — Menú & Catálogo Digital de Alta Gama ──────────────
// Nezahualcóyotl, Estado de México · Gimnasio de Alto Rendimiento & Suplementación
// Carrito de 2 Pasos · WhatsApp Checkout · Bottom-Sheet · Mobile-First

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dumbbell, Flame, Sparkles, Search, ShoppingBag, MapPin,
  Clock, Phone, MessageCircle, ShieldCheck, ChevronRight,
  Heart, X, Check, Star, Info, ArrowUp, Trophy, Zap,
  Facebook, Instagram, ExternalLink, ShieldAlert, Tag, Percent
} from 'lucide-react';

import { Product, GymCategoryId, CartItem } from '../types';
import { clientConfig, CATEGORIES, PRODUCTS, bankInfo } from '../config';
import CustomizeModal from '../components/CustomizeModal';
import CartDrawer from '../components/CartDrawer';

import heroImg from '../assets/hero-strong-gym.webp';
import logoImg from '../assets/logo-strong-gym.webp';

export default function StrongGymMenu() {
  const [selectedCategory, setSelectedCategory] = useState<GymCategoryId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('strong_gym_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Persistencia del carrito
  useEffect(() => {
    try {
      localStorage.setItem('strong_gym_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Detección de scroll para botón Volver Arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Total de items y precio del carrito
  const totalCartItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  // Ofertas del Mes (para la sección especial destacada)
  const monthlyOffers = useMemo(
    () => PRODUCTS.filter((p) => p.isMonthlyOffer || p.category === 'ofertas-mes'),
    []
  );

  // Filtrado de productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (selectedCategory !== 'todos') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.servingInfo && p.servingInfo.toLowerCase().includes(q))
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Manejo del carrito
  const handleAddToCart = (newItem: Omit<CartItem, 'lineId'>) => {
    const lineId = `${newItem.productId}_${newItem.detail.replace(/\s+/g, '_')}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId);
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, { ...newItem, lineId }];
    });

    // Toast de confirmación
    setToastMessage(`Agregaste: ${newItem.name} (${newItem.quantity})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateQty = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-red-600 selection:text-white pb-24 sm:pb-16 font-sans">
      {/* ── HEADER STICKY ── */}
      <header className="sticky top-0 z-40 bg-[#0E0E0E]/90 backdrop-blur-xl border-b border-white/10 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-red-600 shadow-lg shadow-red-950/50 shrink-0">
              <img
                src={logoImg}
                alt="Strong Gym Iron City"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-wider uppercase text-white">
                  Strong Gym
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-1.5 py-0.5 rounded">
                  Iron City
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">
                Gimnasio de Alto Rendimiento · Nezahualcóyotl
              </p>
            </div>
          </div>

          {/* Botón Carrito y Badges */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Abierto Hoy 6:00 AM - 10:00 PM</span>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950/40 active:scale-95 transition-all"
              aria-label="Ver Carrito"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">Carrito</span>
              {totalCartItems > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white text-red-600 font-black text-[11px] leading-none animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO CINEMÁTICO DE ALTO IMPACTO ── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        {/* Imagen de fondo con gradientes */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Interior Strong Gym Iron City"
            className="w-full h-full object-cover opacity-35 scale-105 transform hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-transparent to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-600/15 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
          {/* Logo flotante central */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block relative mb-5"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-red-600 p-1 bg-black/80 shadow-2xl shadow-red-600/40">
              <img
                src={logoImg}
                alt="Logo Strong Gym"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </motion.div>

          {/* Badges de Confianza */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-600/20 text-red-400 border border-red-500/30">
              <Trophy size={14} className="text-red-500" /> EL GIMNASIO MÁS PESADO DE NEZA
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-gray-300 border border-white/10">
              <Star size={13} className="text-amber-400 fill-amber-400" /> {clientConfig.rating.score} (210 Opiniones)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-gray-300 border border-white/10">
              <ShieldCheck size={13} className="text-emerald-400" /> Suplementos 100% Originales
            </span>
          </div>

          {/* Título Principal */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-none"
          >
            {clientConfig.tagline}
          </motion.h1>

          <p className="mt-4 text-xs sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {clientConfig.subtagline}
          </p>

          {/* Tarjeta de Promoción Destacada (Spotlight CRO) */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-red-900/30 to-black/80 border border-red-500/40 shadow-xl shadow-red-950/30 text-left max-w-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-600/30 px-2 py-0.5 rounded border border-red-500/40 inline-block mb-1">
                {clientConfig.promo.badge}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white uppercase">
                {clientConfig.promo.title}
              </h3>
              <p className="text-xs text-gray-300 mt-0.5">
                {clientConfig.promo.subtitle}
              </p>
            </div>

            <button
              onClick={() => {
                const planPromo = PRODUCTS.find((p) => p.id === 'membresia-trimestral-promo');
                if (planPromo) setCustomizingProduct(planPromo);
              }}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-950/40 whitespace-nowrap active:scale-95 transition-all self-end sm:self-auto"
            >
              Apartar Plan $500
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── SECCIÓN DESTACADA: 🔥 OFERTAS ESPECIALES DEL MES ── */}
      {selectedCategory === 'todos' && searchQuery === '' && monthlyOffers.length > 0 && (
        <section className="border-b border-white/10 bg-gradient-to-b from-red-950/20 via-[#0E0E0E] to-[#0A0A0A] py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/50">
                  <Flame size={18} className="text-white animate-pulse" />
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                    Ofertas Especiales del Mes
                  </h3>
                  <p className="text-xs text-red-400 font-semibold">
                    Precios rebajados por tiempo limitado · ¡Ahorra antes de que se agoten!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('ofertas-mes')}
                className="text-xs text-gray-400 hover:text-white font-bold flex items-center gap-1 hidden sm:flex"
              >
                Ver todas las ofertas <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {monthlyOffers.map((product) => (
                <div
                  key={`monthly-${product.id}`}
                  className="rounded-2xl bg-[#141414] border-2 border-red-600/40 hover:border-red-500 p-4 flex flex-col justify-between shadow-xl shadow-red-950/30 group transition-all"
                >
                  <div>
                    {/* Badge de Ahorro y Descuento */}
                    <div className="flex items-center justify-between mb-2">
                      {product.discountBadge ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white shadow-md shadow-red-600/40">
                          {product.discountBadge}
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                          OFERTA
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-gray-400">
                        Solo este mes
                      </span>
                    </div>

                    {/* Imagen del Producto en Oferta */}
                    {product.image && (
                      <div className="w-full h-36 rounded-xl bg-white/[0.02] border border-white/5 p-2 flex items-center justify-center overflow-hidden mb-3 group-hover:border-red-500/30 transition-all">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <h4 className="text-sm font-black text-white group-hover:text-red-400 uppercase leading-snug line-clamp-2">
                      {product.name}
                    </h4>

                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                    <div>
                      {product.originalPrice && (
                        <span className="text-[11px] line-through text-gray-500 font-bold block">
                          ${product.originalPrice} MXN
                        </span>
                      )}
                      <span className="text-base font-black text-red-400">
                        ${product.price} <span className="text-[10px] text-white">MXN</span>
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (product.isCustomizable) {
                          setCustomizingProduct(product);
                        } else {
                          handleAddToCart({
                            productId: product.id,
                            name: product.name,
                            category: product.category,
                            detail: product.servingInfo || 'Oferta Especial del Mes',
                            unitPrice: product.price,
                            originalPrice: product.originalPrice,
                            quantity: 1,
                            image: product.image,
                          });
                        }
                      }}
                      className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white font-black text-[11px] uppercase rounded-xl shadow-md shadow-red-950/40 active:scale-95 transition-all"
                    >
                      Aprovechar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BARRA DE BÚSQUEDA Y CATEGORÍAS (STICKY) ── */}
      <section className="sticky top-16 sm:top-20 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-3">
          {/* Buscador en Vivo */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar proteínas, creatinas, shakes al momento, pases o suplementos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Carrusel de Categorías */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const isOffers = cat.id === 'ofertas-mes';
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as GymCategoryId);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap snap-start transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                      : isOffers
                      ? 'bg-red-950/40 text-red-400 border border-red-500/40 hover:bg-red-600 hover:text-white'
                      : 'bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {isOffers && <Flame size={13} className="text-red-500" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LISTADO GENERAL DE PRODUCTOS CON IMÁGENES ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Encabezado de Sección */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white flex items-center gap-2">
              {selectedCategory === 'ofertas-mes' && <Flame className="text-red-500" />}
              <span>{CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Catálogo'}</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Mostrando {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'} disponibles con precios transparentes
            </p>
          </div>

          {selectedCategory !== 'todos' && (
            <button
              onClick={() => setSelectedCategory('todos')}
              className="text-xs text-red-400 hover:text-red-300 font-bold"
            >
              Ver todo el catálogo →
            </button>
          )}
        </div>

        {/* Grid de Productos con Imágenes */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Dumbbell size={40} className="mx-auto text-gray-600 mb-3" />
            <p className="text-base font-bold text-white">No encontramos productos con esa búsqueda</p>
            <p className="text-xs text-gray-500 mt-1">Prueba con otra palabra o categoría.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative rounded-2xl bg-[#141414] border p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 ${
                    product.category === 'ofertas-mes' || product.originalPrice
                      ? 'border-red-600/40 hover:border-red-500 hover:shadow-xl hover:shadow-red-950/30'
                      : 'border-white/5 hover:border-red-600/40 hover:shadow-xl hover:shadow-red-950/20'
                  }`}
                >
                  {/* Imagen y Badges */}
                  <div>
                    {product.image && (
                      <div className="w-full h-44 rounded-xl bg-white/[0.02] border border-white/5 p-3 flex items-center justify-center overflow-hidden mb-3.5 relative group-hover:border-red-500/30 transition-all">
                        <img
                          src={product.image}
                          alt={product.name}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.discountBadge && (
                          <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600 text-white shadow-md shadow-red-950/50">
                            {product.discountBadge}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Badges de Categoría y Serving */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {product.badgeText ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                          <Flame size={11} className="text-red-500" />
                          {product.badgeText}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-gray-400">
                          {product.category}
                        </span>
                      )}

                      {product.servingInfo && (
                        <span className="text-[10px] text-gray-500 font-semibold truncate">
                          {product.servingInfo}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-black text-white group-hover:text-red-400 uppercase tracking-wide transition-colors leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Precios (Normal y Descuento) y Botón */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      {product.originalPrice ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs line-through text-gray-500 font-bold">
                            ${product.originalPrice}
                          </span>
                          <span className="text-lg font-black text-red-400 tracking-tight">
                            ${product.price} <span className="text-xs font-bold text-white">MXN</span>
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">
                            {product.sizes ? 'Desde' : 'Precio Fijo'}
                          </span>
                          <span className="text-lg font-black text-white tracking-tight">
                            ${product.price} <span className="text-xs font-bold text-red-500">MXN</span>
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (product.isCustomizable) {
                          setCustomizingProduct(product);
                        } else {
                          handleAddToCart({
                            productId: product.id,
                            name: product.name,
                            category: product.category,
                            detail: product.servingInfo || 'Presentación oficial',
                            unitPrice: product.price,
                            originalPrice: product.originalPrice,
                            quantity: 1,
                            image: product.image,
                          });
                        }
                      }}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-950/40 active:scale-95 transition-all"
                    >
                      {product.isCustomizable ? (
                        <>
                          <span>Elegir</span>
                          <ChevronRight size={14} />
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          <span>Agregar</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── FOOTER OFICIAL DE 3 COLUMNAS DEL CLIENTE ── */}
      <footer className="mt-16 border-t border-white/10 bg-[#080808] pt-12 pb-8 text-gray-400 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-white/10">
            {/* Columna 1: Marca y Concepto */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-red-600">
                  <img src={logoImg} alt="Strong Gym" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase text-white tracking-wider">
                    {clientConfig.businessName}
                  </h4>
                  <p className="text-[10px] text-gray-500">Ciudad de Hierro · Neza</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                {clientConfig.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                  🏋️‍♂️ Uso Rudo
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                  🥤 Barra de Shakes
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-300">
                  ⚡ Suplementos
                </span>
              </div>
            </div>

            {/* Columna 2: Ubicación y Horarios */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-white flex items-center gap-1.5">
                <MapPin size={14} className="text-red-500" /> Ubicación & Horarios
              </h4>
              <p className="text-xs text-gray-300">
                {clientConfig.address}
              </p>
              <p className="text-[11px] text-gray-500">
                {clientConfig.reference}
              </p>

              <div className="pt-2 space-y-1 text-xs">
                <p className="text-gray-300">
                  <strong className="text-white">Lun - Vie:</strong> 6:00 AM - 10:00 PM
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Sábados:</strong> 7:00 AM - 4:00 PM
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Domingos:</strong> 8:00 AM - 2:00 PM
                </p>
              </div>

              <div className="pt-1">
                <a
                  href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(
                    '¡Hola Strong Gym! Quiero informes sobre membresías y suplementos disponibles.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle size={14} /> WhatsApp Recepción: {clientConfig.phoneNumberFormatted}
                </a>
              </div>
            </div>

            {/* Columna 3: Redes Sociales Oficiales */}
            <div className="space-y-3">
              <h4 className="font-black text-xs uppercase tracking-wider text-white">
                Redes Sociales & Mapa
              </h4>
              <p className="text-xs text-gray-400">
                Síguenos en nuestras redes oficiales para ver rutinas, avisos de días feriados y promociones activas:
              </p>

              <div className="space-y-2 pt-1">
                <a
                  href={clientConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-gray-300 hover:text-white transition-all"
                >
                  <Facebook size={16} className="text-blue-500" />
                  <span className="font-bold text-xs">Facebook Oficial (ironcitymex)</span>
                </a>

                <a
                  href={clientConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-gray-300 hover:text-white transition-all"
                >
                  <Instagram size={16} className="text-pink-500" />
                  <span className="font-bold text-xs">Instagram: {clientConfig.instagramHandle}</span>
                </a>

                <a
                  href={clientConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-gray-300 hover:text-white transition-all"
                >
                  <MapPin size={16} className="text-red-500" />
                  <span className="font-bold text-xs">Cómo Llegar en Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Barra inferior de créditos y aviso legal */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-gray-500">
            <p>© {new Date().getFullYear()} Strong Gym Iron City. Todos los derechos reservados.</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-gray-300 underline transition-colors"
              >
                Aviso de Privacidad (LFPDPPP)
              </button>
              <span>·</span>
              <p className="text-gray-400 font-semibold">
                Diseñado por <span className="text-white font-bold">IMAGINE & STAMP</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ── BOTÓN FLOTANTE DEL CARRITO EN MÓVIL (BOTTOM SAFE AREA) ── */}
      <AnimatePresence>
        {totalCartItems > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 sm:hidden z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-4 px-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-2xl shadow-red-950/80 flex items-center justify-between border border-red-500/30"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-white text-red-600 font-black text-xs flex items-center justify-center">
                  {totalCartItems}
                </span>
                <span>Ver Mi Pedido</span>
              </div>
              <span className="text-base font-black">${cartTotal} MXN</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BOTÓN VOLVER ARRIBA ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 flex items-center justify-center shadow-lg z-30 transition-all backdrop-blur-md"
            aria-label="Volver arriba"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── TOAST DE CONFIRMACIÓN ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-red-600 text-white text-xs font-black shadow-xl shadow-red-950/60 flex items-center gap-2 border border-red-400"
          >
            <Check size={14} strokeWidth={3} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODALES ── */}
      <CustomizeModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        cartTotal={cartTotal}
        whatsappNumber={clientConfig.phone}
        businessName={clientConfig.businessName}
        onClearCart={handleClearCart}
      />

      {/* ── MODAL DE AVISO DE PRIVACIDAD (LFPDPPP) ── */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl p-6 text-white z-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-base font-black uppercase text-red-500 flex items-center gap-2">
                  <ShieldCheck size={18} /> Aviso de Privacidad
                </h3>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, <strong>Strong Gym Iron City</strong>, con domicilio en Av. Texcoco No. 556, Nezahualcóyotl, Estado de México, hace de su conocimiento que los datos personales recabados (nombre, teléfono WhatsApp y datos para entrega) son utilizados exclusivamente para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-400">
                  <li>Procesar sus pedidos de suplementos, barra de nutrición y apartado de membresías.</li>
                  <li>Confirmar y coordinar la entrega en mostrador o a domicilio vía WhatsApp.</li>
                  <li>Generar comprobantes de pago y validación de transferencias bancarias.</li>
                </ul>
                <p>
                  Sus datos personales están protegidos y no serán transferidos ni compartidos con terceros con fines mercadotécnicos ni comerciales. Para cualquier solicitud de derechos ARCO (Acceso, Rectificación, Cancelación u Oposición), puede contactar a la administración vía WhatsApp al {clientConfig.phoneNumberFormatted} o al correo {clientConfig.email}.
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-white/10 text-right">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase rounded-xl"
                >
                  Entendido y Acepto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
