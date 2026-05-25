import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, ShoppingBag, MessageCircle, ChevronLeft,
  Plus, Minus, Trash2, ShoppingCart, Star, Tag
} from 'lucide-react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type CostumeType = 'Renta' | 'Venta' | 'Renta y Venta';
type CategoryId = 'all' | 'terror' | 'superheroes' | 'infantiles' | 'accesorios';

interface Costume {
  id: string;
  name: string;
  description: string;
  image: string;
  category: CategoryId;
  type: CostumeType;
  sizes: string[];
  price: number;
  rentalPrice?: number;
  featured?: boolean;
}

interface CartItem {
  costumeId: string;
  name: string;
  size: string;
  type: 'Renta' | 'Venta';
  price: number;
  image: string;
}

// ─── CATALOG DATA ─────────────────────────────────────────────────────────────
const COSTUMES: Costume[] = [
  {
    id: 'michael-myers',
    name: 'Michael Myers',
    description: 'El icónico asesino de Halloween. Incluye máscara original, overol oscuro y cuchillo de plástico decorativo. Ideal para eventos y fiestas de terror.',
    image: './disfraz-michael-myers.png',
    category: 'terror',
    type: 'Renta y Venta',
    sizes: ['CH', 'M', 'G', 'XG'],
    price: 450,
    rentalPrice: 180,
    featured: true,
  },
  {
    id: 'bruja',
    name: 'Bruja Clásica',
    description: 'Elegante disfraz de bruja con vestido largo, sombrero cónico y capa de terciopelo. Perfecto para Halloween con toque de magia oscura.',
    image: './disfraz-bruja.png',
    category: 'terror',
    type: 'Renta y Venta',
    sizes: ['CH', 'M', 'G'],
    price: 380,
    rentalPrice: 150,
    featured: true,
  },
  {
    id: 'payaso',
    name: 'Payaso del Terror',
    description: 'El payaso más aterrador de la temporada. Traje colorido con detalles oscuros, peluca y maquillaje incluido. ¡Hará temblar a todos!',
    image: './disfraz-payaso.png',
    category: 'terror',
    type: 'Renta y Venta',
    sizes: ['M', 'G', 'XG'],
    price: 420,
    rentalPrice: 170,
  },
  {
    id: 'zombie',
    name: 'Zombie Apocalíptico',
    description: 'Disfraz de zombie con ropa desgarrada, efectos especiales de látex y maquillaje incluido. Perfecto para el apocalipsis zombie más realista.',
    image: './disfraz-zombie.png',
    category: 'terror',
    type: 'Renta y Venta',
    sizes: ['CH', 'M', 'G'],
    price: 390,
    rentalPrice: 160,
  },
  {
    id: 'spiderman',
    name: 'Spider-Man',
    description: 'El amigable vecino Spider-Man en su traje clásico rojo y azul con detalles de telaraña. Incluye guantes y máscara. ¡Trepa paredes!',
    image: './disfraz-spiderman.png',
    category: 'superheroes',
    type: 'Renta y Venta',
    sizes: ['CH', 'M', 'G', 'Infantil T4', 'Infantil T6', 'Infantil T8'],
    price: 480,
    rentalPrice: 200,
    featured: true,
  },
  {
    id: 'batman',
    name: 'Batman Dark Knight',
    description: 'El caballero de la noche en su armadura completa. Incluye capa, máscara con orejas y cinturón de utilidades decorativo de alta calidad.',
    image: './disfraz-batman.png',
    category: 'superheroes',
    type: 'Renta y Venta',
    sizes: ['M', 'G', 'XG', 'Infantil T4', 'Infantil T6'],
    price: 520,
    rentalPrice: 220,
    featured: true,
  },
  {
    id: 'princesa',
    name: 'Princesa Encantada',
    description: 'Vestido de princesa con volantes de tul en rosa y azul pastel, brillantina y tiara incluida. Para la pequeña princesa de tu vida.',
    image: './disfraz-princesa.png',
    category: 'infantiles',
    type: 'Renta y Venta',
    sizes: ['Infantil T2', 'Infantil T4', 'Infantil T6', 'Infantil T8'],
    price: 320,
    rentalPrice: 130,
    featured: true,
  },
  {
    id: 'unicornio',
    name: 'Unicornio Mágico',
    description: 'Adorable disfraz de unicornio todo en uno con cuerno arcoíris, melena de colores y cola. ¡El más tierno de toda la fiesta!',
    image: './disfraz-unicornio.png',
    category: 'infantiles',
    type: 'Renta y Venta',
    sizes: ['Infantil T2', 'Infantil T4', 'Infantil T6'],
    price: 280,
    rentalPrice: 110,
  },
  {
    id: 'mascaras',
    name: 'Kit de Máscaras Premium',
    description: 'Set de 3 máscaras de alta calidad: calavera veneciana, demonio y criatura del inframundo. Pintadas a mano con detalles dorados.',
    image: './mascara-halloween.png',
    category: 'accesorios',
    type: 'Venta',
    sizes: ['Talla Única'],
    price: 290,
  },
];

// ─── CATEGORIES CONFIG ────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all' as CategoryId, label: 'Todos', emoji: '🎃', color: 'from-orange-500 to-orange-700' },
  { id: 'terror' as CategoryId, label: 'Terror', emoji: '💀', color: 'from-red-700 to-red-900' },
  { id: 'superheroes' as CategoryId, label: 'Superhéroes', emoji: '🦸', color: 'from-blue-600 to-purple-700' },
  { id: 'infantiles' as CategoryId, label: 'Infantiles', emoji: '🧸', color: 'from-pink-500 to-purple-500' },
  { id: 'accesorios' as CategoryId, label: 'Accesorios', emoji: '🎭', color: 'from-yellow-500 to-orange-500' },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const normalize = (str: string) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const WHATSAPP_NUMBER = '525650469993';

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MundoHalloween() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCostume, setSelectedCostume] = useState<Costume | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedOperationType, setSelectedOperationType] = useState<'Renta' | 'Venta'>('Renta');
  const [toast, setToast] = useState<string | null>(null);

  // ── Filtering ──
  const filteredCostumes = useMemo(() => {
    let result = COSTUMES;
    if (activeCategory !== 'all') {
      result = result.filter(c => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = normalize(searchQuery.trim());
      result = result.filter(c =>
        normalize(c.name).includes(q) ||
        normalize(c.description).includes(q) ||
        normalize(c.category).includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  // ── Cart logic ──
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const openDetail = (costume: Costume) => {
    setSelectedCostume(costume);
    setSelectedSize(costume.sizes[0] || '');
    // Default: Renta if available, else Venta
    if (costume.type === 'Venta') setSelectedOperationType('Venta');
    else setSelectedOperationType('Renta');
  };

  const addToCart = () => {
    if (!selectedCostume || !selectedSize) return;
    const price =
      selectedOperationType === 'Renta' && selectedCostume.rentalPrice
        ? selectedCostume.rentalPrice
        : selectedCostume.price;

    const item: CartItem = {
      costumeId: `${selectedCostume.id}-${selectedSize}-${selectedOperationType}-${Date.now()}`,
      name: selectedCostume.name,
      size: selectedSize,
      type: selectedOperationType,
      price,
      image: selectedCostume.image,
    };
    setCart(prev => [...prev, item]);
    setSelectedCostume(null);
    showToast(`¡${selectedCostume.name} agregado al carrito! 🎃`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.costumeId !== id));
  };

  const totalPrice = cart.reduce((acc, i) => acc + i.price, 0);

  const sendWhatsApp = () => {
    const lines = cart
      .map(i => `  • ${i.name} | Talla: ${i.size} | ${i.type} = $${i.price} MXN`)
      .join('\n');
    const message =
      `👻 ¡Hola! Me interesa reservar los siguientes disfraces en *Mundo de Halloween*:\n\n` +
      `*🎃 Disfraces Seleccionados:*\n${lines}\n\n` +
      `*💰 Total Estimado: $${totalPrice} MXN*\n\n` +
      `¿Cuál es la disponibilidad? ¡Gracias!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
    showToast('¡Mensaje enviado a WhatsApp! 🎉');
  };

  // ── Type label helper ──
  const getTypeInfo = (costume: Costume) => {
    if (costume.type === 'Venta') return { label: 'VENTA', color: 'bg-orange-500' };
    if (costume.type === 'Renta') return { label: 'RENTA', color: 'bg-purple-600' };
    return { label: 'RENTA / VENTA', color: 'bg-gradient-to-r from-purple-600 to-orange-500' };
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Google Font ──────────────────────────────── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
      />

      {/* ══ HEADER ══════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,106,0,0.15)' }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo + back */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.location.hash = '/')}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,106,0,0.12)', color: '#ff6a00' }}
              title="Volver al inicio"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,106,0,0.6)' }}>
                Demo — Giro de Disfraces
              </p>
              <h1 className="text-sm font-black leading-none" style={{ color: '#fff' }}>
                🎃 Mundo de Halloween
              </h1>
            </div>
          </div>

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all"
            style={{ background: cart.length > 0 ? '#ff6a00' : 'rgba(255,106,0,0.12)', color: cart.length > 0 ? '#fff' : '#ff6a00' }}
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:block">{cart.length > 0 ? `${cart.length} en carrito` : 'Carrito'}</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center" style={{ background: '#7c3aed', color: '#fff' }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="pt-16 relative overflow-hidden">
        <div
          className="relative w-full flex flex-col items-center justify-center py-16 px-4 text-center"
          style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0d0014 100%)' }}
        >
          {/* Decorative glow orbs */}
          <div className="absolute top-8 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#ff6a00' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none" style={{ background: '#7c3aed' }} />

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
            <div className="text-6xl mb-4 select-none">🎃</div>
            <h2 className="text-3xl sm:text-5xl font-black mb-3 leading-none" style={{ color: '#fff' }}>
              Mundo de{' '}
              <span style={{ color: '#ff6a00', WebkitTextStroke: '1px rgba(255,106,0,0.3)' }}>Halloween</span>
            </h2>
            <p className="text-base sm:text-lg max-w-md mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Renta o compra el disfraz perfecto para tu noche de terror
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(124,58,237,0.25)', color: '#a855f7', border: '1px solid rgba(124,58,237,0.3)' }}>
                🔮 Renta desde $110 MXN
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,106,0,0.15)', color: '#ff6a00', border: '1px solid rgba(255,106,0,0.25)' }}>
                🛒 Venta y Renta
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ SEARCH BAR ══════════════════════════════════════════════════════ */}
      <div className="sticky top-16 z-40 px-4 py-3" style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: isSearchFocused ? '1.5px solid #ff6a00' : '1.5px solid rgba(255,255,255,0.08)',
              boxShadow: isSearchFocused ? '0 0 20px rgba(255,106,0,0.15)' : 'none',
            }}
          >
            <Search size={18} style={{ color: isSearchFocused ? '#ff6a00' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Busca disfraces, superhéroes, terror..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#fff', caretColor: '#ff6a00' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="transition-opacity hover:opacity-70">
                <X size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ CATEGORY TABS ═══════════════════════════════════════════════════ */}
      <div className="px-4 py-4 max-w-5xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, #ff6a00, #b84500)'
                    : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 4px 20px rgba(255,106,0,0.35)' : 'none',
                }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-black"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {cat.id === 'all' ? COSTUMES.length : COSTUMES.filter(c => c.category === cat.id).length}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ══ PRODUCT GRID ════════════════════════════════════════════════════ */}
      <main className="px-4 pb-32 max-w-5xl mx-auto">
        {/* Results count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {filteredCostumes.length} disfraces disponibles
          </p>
          {searchQuery && (
            <p className="text-xs" style={{ color: '#ff6a00' }}>
              Resultados para: "{searchQuery}"
            </p>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {filteredCostumes.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 flex flex-col items-center gap-4"
            >
              <div className="text-5xl">😱</div>
              <p className="font-bold text-lg" style={{ color: 'rgba(255,255,255,0.4)' }}>
                No encontramos ese disfraz
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'rgba(255,106,0,0.15)', color: '#ff6a00' }}
              >
                Ver todos los disfraces
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredCostumes.map((costume, idx) => {
                const typeInfo = getTypeInfo(costume);
                return (
                  <motion.div
                    key={costume.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => openDetail(costume)}
                    className="rounded-2xl overflow-hidden cursor-pointer group relative"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.25s',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(255,106,0,0.2)' }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={costume.image}
                        alt={costume.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ filter: 'brightness(0.85)' }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)' }} />

                      {/* Featured badge */}
                      {costume.featured && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
                          style={{ background: 'rgba(255,106,0,0.9)', color: '#fff' }}>
                          <Star size={8} fill="currentColor" />
                          TOP
                        </div>
                      )}

                      {/* Type badge */}
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${typeInfo.color}`}
                        style={{ color: '#fff' }}>
                        <Tag size={8} className="inline mr-0.5 -mt-0.5" />
                        {costume.type === 'Renta y Venta' ? 'R/V' : typeInfo.label}
                      </div>

                      {/* Price on image */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-xs font-black leading-none" style={{ color: '#fff' }}>
                          {costume.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          {costume.rentalPrice && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                              style={{ background: 'rgba(124,58,237,0.7)', color: '#e9d5ff' }}>
                              Renta ${costume.rentalPrice}
                            </span>
                          )}
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                            style={{ background: 'rgba(255,106,0,0.7)', color: '#fff' }}>
                            Venta ${costume.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* ══ FLOATING WHATSAPP BTN ════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-4 z-40">
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('👻 ¡Hola! Me interesa conocer los disfraces disponibles en Mundo de Halloween.')}`}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm shadow-2xl"
          style={{ background: '#25D366', color: '#fff', boxShadow: '0 8px 32px rgba(37,211,102,0.4)' }}
        >
          <span>¡Cotiza aquí!</span>
          <MessageCircle size={22} fill="currentColor" />
        </motion.a>
      </div>

      {/* ══ PRODUCT DETAIL MODAL ════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedCostume && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCostume(null)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-3xl"
              style={{ background: '#0f0f0f', border: '1px solid rgba(255,106,0,0.2)' }}
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              <div className="px-4 pb-8">
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={selectedCostume.image}
                    alt={selectedCostume.name}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.9)' }}
                  />
                  <button
                    onClick={() => setSelectedCostume(null)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    {getTypeInfo(selectedCostume).label && (
                      <span className="px-2 py-1 rounded-lg text-xs font-black"
                        style={{ background: 'rgba(124,58,237,0.85)', color: '#fff' }}>
                        🎃 {selectedCostume.type}
                      </span>
                    )}
                    {selectedCostume.featured && (
                      <span className="px-2 py-1 rounded-lg text-xs font-black flex items-center gap-1"
                        style={{ background: 'rgba(255,106,0,0.9)', color: '#fff' }}>
                        <Star size={10} fill="currentColor" /> Destacado
                      </span>
                    )}
                  </div>
                </div>

                {/* Name & description */}
                <h3 className="text-xl font-black mb-2" style={{ color: '#fff' }}>
                  {selectedCostume.name}
                </h3>
                <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {selectedCostume.description}
                </p>

                {/* Renta / Venta toggle */}
                {selectedCostume.type === 'Renta y Venta' && (
                  <div className="mb-4">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      ¿Renta o Venta?
                    </p>
                    <div className="flex gap-2">
                      {(['Renta', 'Venta'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedOperationType(t)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: selectedOperationType === t
                              ? t === 'Renta' ? '#7c3aed' : '#ff6a00'
                              : 'rgba(255,255,255,0.06)',
                            color: selectedOperationType === t ? '#fff' : 'rgba(255,255,255,0.4)',
                            border: selectedOperationType === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          {t === 'Renta' ? '🔮' : '🛒'} {t}
                          {t === 'Renta' && selectedCostume.rentalPrice && ` — $${selectedCostume.rentalPrice}`}
                          {t === 'Venta' && ` — $${selectedCostume.price}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size selector */}
                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Talla
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCostume.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: selectedSize === size ? '#ff6a00' : 'rgba(255,255,255,0.06)',
                          color: selectedSize === size ? '#fff' : 'rgba(255,255,255,0.5)',
                          border: selectedSize === size ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: selectedSize === size ? '0 4px 16px rgba(255,106,0,0.35)' : 'none',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price display */}
                <div className="flex items-center justify-between mb-5 p-4 rounded-2xl" style={{ background: 'rgba(255,106,0,0.08)', border: '1px solid rgba(255,106,0,0.15)' }}>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Precio {selectedOperationType}
                    </p>
                    <p className="text-2xl font-black" style={{ color: '#ff6a00' }}>
                      ${selectedOperationType === 'Renta' && selectedCostume.rentalPrice ? selectedCostume.rentalPrice : selectedCostume.price}
                      <span className="text-sm font-bold ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>MXN</span>
                    </p>
                  </div>
                  {selectedCostume.rentalPrice && selectedCostume.type !== 'Venta' && (
                    <div className="text-right">
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Renta:</p>
                      <p className="text-sm font-black" style={{ color: '#a855f7' }}>${selectedCostume.rentalPrice}</p>
                      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Venta:</p>
                      <p className="text-sm font-black" style={{ color: '#ff6a00' }}>${selectedCostume.price}</p>
                    </div>
                  )}
                </div>

                {/* Add to cart button */}
                <motion.button
                  onClick={addToCart}
                  whileTap={{ scale: 0.97 }}
                  disabled={!selectedSize}
                  className="w-full py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all"
                  style={{
                    background: selectedSize ? 'linear-gradient(135deg, #ff6a00, #b84500)' : 'rgba(255,255,255,0.06)',
                    color: selectedSize ? '#fff' : 'rgba(255,255,255,0.25)',
                    boxShadow: selectedSize ? '0 8px 32px rgba(255,106,0,0.4)' : 'none',
                    cursor: selectedSize ? 'pointer' : 'not-allowed',
                  }}
                >
                  <ShoppingCart size={20} />
                  Agregar al Carrito
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ CART DRAWER ═════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-[100dvh] w-full max-w-sm z-50 flex flex-col"
              style={{ background: '#0f0f0f', borderLeft: '1px solid rgba(255,106,0,0.15)' }}
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} style={{ color: '#ff6a00' }} />
                  <h2 className="text-lg font-black" style={{ color: '#fff' }}>Tu Carrito</h2>
                  {cart.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: '#ff6a00', color: '#fff' }}>
                      {cart.length}
                    </span>
                  )}
                </div>
                <button onClick={() => setIsCartOpen(false)}>
                  <X size={22} style={{ color: 'rgba(255,255,255,0.4)' }} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="text-5xl">🎃</div>
                    <p className="text-base font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Tu carrito está vacío
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-4 py-2 rounded-xl text-sm font-bold"
                      style={{ background: 'rgba(255,106,0,0.15)', color: '#ff6a00' }}
                    >
                      Explorar disfraces
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.costumeId}
                      className="flex items-center gap-3 p-3 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="w-14 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate" style={{ color: '#fff' }}>{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold"
                            style={{ background: item.type === 'Renta' ? 'rgba(124,58,237,0.4)' : 'rgba(255,106,0,0.3)', color: item.type === 'Renta' ? '#c4b5fd' : '#fdba74' }}>
                            {item.type}
                          </span>
                          <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Talla: {item.size}
                          </span>
                        </div>
                        <p className="text-base font-black mt-1" style={{ color: '#ff6a00' }}>${item.price} MXN</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.costumeId)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all hover:scale-110"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {cart.length} {cart.length === 1 ? 'disfraz' : 'disfraces'}
                    </span>
                    <span className="text-2xl font-black" style={{ color: '#ff6a00' }}>
                      ${totalPrice} <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>MXN</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    * El total es estimado. Confirmamos disponibilidad y precio exacto vía WhatsApp.
                  </p>
                  <motion.button
                    onClick={sendWhatsApp}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3"
                    style={{ background: '#25D366', color: '#fff', boxShadow: '0 8px 24px rgba(37,211,102,0.35)' }}
                  >
                    <MessageCircle size={20} fill="currentColor" />
                    Reservar vía WhatsApp
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══ TOAST ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl"
            style={{ background: '#ff6a00', color: '#fff', maxWidth: '90vw', whiteSpace: 'nowrap' }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t px-6 py-10 text-center" style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#0a0a0a' }}>
        <div className="text-2xl mb-2">🎃</div>
        <h3 className="text-lg font-black mb-1" style={{ color: '#fff' }}>Mundo de Halloween</h3>
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
          La mejor selección de disfraces para Renta y Venta
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all"
          style={{ background: 'rgba(37,211,102,0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.25)' }}
        >
          <MessageCircle size={16} fill="currentColor" />
          Contáctanos en WhatsApp
        </a>
        <p className="text-[10px] mt-6 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Demo creado por Imagine & Stamp — 2026
        </p>
        <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.1)' }}>
          <button onClick={() => (window.location.hash = '/')} className="hover:underline">
            ← Volver a Imagine & Stamp
          </button>
        </p>
      </footer>
    </div>
  );
}
