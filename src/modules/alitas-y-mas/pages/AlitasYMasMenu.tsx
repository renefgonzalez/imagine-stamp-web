// ═══════════════════════════════════════════════════════════════════════════
// ALITAS Y MÁS — Menú Digital · Estilo Urbano/Industrial
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, X, ShoppingBag, Flame, Pizza, Sandwich, Drumstick,
  LayoutGrid, Star, Sparkles, Phone, MapPin, Clock,
  Instagram, Facebook, MessageCircle, ArrowUp, Shield, ExternalLink,
  PartyPopper, ChevronRight, SlidersHorizontal, Check,
} from 'lucide-react';
import { clientConfig, SALSAS, DIPS, TACO_EXTRAS } from '../config';
import { Product, CartItem, SizeOption } from '../types';
import CustomizeModal from '../components/CustomizeModal';
import CartDrawer from '../components/CartDrawer';

// ═══════════════════ CONSTANTES ═══════════════════
const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;

const HERO_IMG = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=75';

const SIZES_ALITAS: SizeOption[] = [
  { id: 'platillo', label: 'Platillo', price: 112 },
  { id: 'botanero', label: 'Botanero', price: 199 },
];
const SIZES_BONELESS: SizeOption[] = [
  { id: 'platillo', label: 'Platillo', price: 99 },
  { id: 'botanero', label: 'Botanero', price: 185 },
];

const PRODUCTS: Product[] = [
  // ── TACOS ──
  { id: 'arrachera', name: 'Arrachera (4)', description: 'Acompañada de frijoles refritos y papitas.', price: 129, category: 'tacos', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=70', featured: true, extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  { id: 'boruca-roast-beef', name: 'Boruca Roast Beef (4)', description: 'Roast Beef, aguacate, lechuga, tomate y crema.', price: 109, category: 'tacos', image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=70', extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  { id: 'tacos-boruquenos', name: 'Tacos Boruqueños', description: 'Camarón, pico de gallo, aguacate, pepino, zanahoria, chipotle.', price: 99, category: 'tacos', image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=800&q=70', extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  { id: 'camaron-endiablado', name: 'Camarón Endiablado (Pieza)', description: 'Camarón sazonado con salsa especial.', price: 32, category: 'tacos', image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=70', badge: 'picante', extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  { id: 'camaron-rebosado', name: 'Camarón Rebosado (Pieza)', description: 'Con lechuga, tomate y chipotle.', price: 32, category: 'tacos', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=70', extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  { id: 'mar-y-tierra', name: 'Mar y Tierra (Pieza)', description: 'Montados en cama de frijoles.', price: 32, category: 'tacos', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=800&q=70', extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })) },
  // ── PIZZETAS ──
  { id: 'americana', name: 'Americana', description: 'Pepperoni y champiñones.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=70' },
  { id: 'alambre', name: 'Alambre', description: 'Arrachera, pimiento, cebolla y tocino.', price: 149, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&w=800&q=70', featured: true },
  { id: 'hawaiana', name: 'Hawaiana', description: 'Jamón, piña y extra queso.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=70' },
  { id: 'marinera', name: 'Marinera', description: 'Pesto picante, camarón/salmón, espinacas, queso parmesano y mozzarella.', price: 149, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=70' },
  { id: 'mexicana', name: 'Mexicana', description: 'Chorizo, carne molida, cebolla y jalapeño.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=70' },
  { id: 'vegetariana', name: 'Vegetariana', description: 'Pimiento morrón, cebolla, tomate, champiñones, albahaca.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=800&q=70' },
  { id: 'roast-beef-pizzeta', name: 'Roast Beef', description: 'Roast beef, pepperoni y cebolla.', price: 149, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=70' },
  { id: 'boruca-pizzeta', name: 'Boruca', description: 'Jamón, pimiento y tocino.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1571066811602-716837d681de?auto=format&fit=crop&w=800&q=70' },
  { id: 'mexico-americana', name: 'México Americana', description: 'Media mexicana, media americana y dedos mozzarella.', price: 149, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?auto=format&fit=crop&w=800&q=70', badge: 'nuevo' },
  { id: 'al-gusto', name: 'Al Gusto', description: '2 ingredientes a elegir.', price: 129, category: 'pizzetas', image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=800&q=70', ingredientPick: 2 },
  // ── QUESADILLAS ──
  { id: 'gobernador', name: 'Gobernador', description: 'Camarón guisado con cebolla y pimiento morrón.', price: 32, category: 'quesadillas', image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=70' },
  { id: 'chilena', name: 'Chilena', description: 'Chile chilaca rellena de queso con camarón o arrachera.', price: 35, category: 'quesadillas', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=70', choices: [{ id: 'camaron', label: 'Camarón' }, { id: 'arrachera', label: 'Arrachera' }] },
  { id: 'camaron-azteca', name: 'Camarón Azteca', description: 'Jalapeño, tocino y machaca de camarón.', price: 32, category: 'quesadillas', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=70', badge: 'picante' },
  { id: 'quezada', name: 'Quezada', description: 'Queso gouda a la plancha, relleno de camarón o arrachera.', price: 35, category: 'quesadillas', image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=70', choices: [{ id: 'camaron', label: 'Camarón' }, { id: 'arrachera', label: 'Arrachera' }] },
  // ── ALITAS Y BONELESS ──
  { id: 'alitas-emplumadas', name: 'Alitas Emplumadas', description: 'Ligeramente empanizadas. Van con apio y dip.', price: 112, category: 'alitas', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=70', featured: true, badge: 'popular', sizes: SIZES_ALITAS, needsSauce: true },
  { id: 'alitas-encueradas', name: 'Alitas Encueradas', description: 'Sin empanizar, fritas al momento. Van con apio y dip.', price: 112, category: 'alitas', image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=70', sizes: SIZES_ALITAS, needsSauce: true },
  { id: 'boneless', name: 'Boneless', description: 'Crujientes por fuera, jugosos por dentro. Van con apio y dip.', price: 99, category: 'alitas', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=70', badge: 'popular', sizes: SIZES_BONELESS, needsSauce: true },
];

const CATEGORIES = [
  { id: 'all', name: 'Todo', icon: LayoutGrid },
  { id: 'alitas', name: 'Alitas y Boneless', icon: Drumstick },
  { id: 'tacos', name: 'Tacos', icon: Flame },
  { id: 'pizzetas', name: 'Pizzetas', icon: Pizza },
  { id: 'quesadillas', name: 'Quesadillas', icon: Sandwich },
];

const FEATURED = PRODUCTS.filter(p => p.featured);

// ═══════════════════ HELPER ═══════════════════
// Requiere modal: opciones obligatorias (talla+salsa, choice, ingredientes)
const needsConfig = (p: Product) =>
  (p.sizes && p.sizes.length > 1) ||
  p.needsSauce ||
  (p.choices && p.choices.length > 0) ||
  (p.ingredientPick && p.ingredientPick > 0);

// Solo extras opcionales (tacos): se puede agregar directo y personalizar aparte
const hasOptionalExtras = (p: Product) =>
  !needsConfig(p) && p.extras && p.extras.length > 0;

const CartIconSvg = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
    <path d="M7 6h15l-2 10H9L7 6z" /><path d="M3 3h2l2 5" />
    <circle cx="10" cy="20" r="2" /><circle cx="18" cy="20" r="2" />
  </svg>
);

// ═══════════════════ COMPONENTE ═══════════════════
export default function AlitasYMasMenu() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('alitasymas_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleItems, setVisibleItems] = useState(10);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);

  // Persistencia localStorage
  useEffect(() => { try { localStorage.setItem('alitasymas_cart', JSON.stringify(cart)); } catch { /* */ } }, [cart]);

  // Scroll lock cuando drawer/modal abiertos
  useEffect(() => {
    document.body.style.overflow = isCartOpen || !!customizingProduct ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, customizingProduct]);

  // Scroll detection (sticky header glass + scroll-top btn)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // document.title
  useEffect(() => { document.title = 'ALITAS Y MÁS | Alitas, Pizzetas, Tacos y Más'; }, []);

  // Pagination reset
  useEffect(() => { setVisibleItems(10); }, [activeCategory, searchQuery]);

  // ── Productos filtrados ──
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.filter(p =>
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
        p.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
      );
    } else if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory);
    }
    return result;
  }, [activeCategory, searchQuery]);

  // ── Handlers ──
  const handleAddSimple = useCallback((product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCart(prev => {
      const lineId = `${product.id}||`;
      const existing = prev.find(i => i.lineId === lineId);
      if (existing) {
        return prev.map(i => i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { lineId, productId: product.id, name: product.name, detail: undefined, unitPrice: product.price, quantity: 1, image: product.image }];
    });
    setToastMsg(product.name);
    setTimeout(() => setToastMsg(''), 2500);
  }, []);

  const handleAddCustom = useCallback((lineId: string, productId: string, name: string, detail: string, unitPrice: number, quantity: number, image: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.lineId === lineId);
      if (existing) {
        return prev.map(i => i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { lineId, productId, name, detail, unitPrice, quantity, image }];
    });
    setToastMsg(name);
    setTimeout(() => setToastMsg(''), 2500);
    setCustomizingProduct(null);
  }, []);

  const handleUpdateQty = useCallback((lineId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.lineId !== lineId) return i;
      const newQty = i.quantity + delta;
      return newQty <= 0 ? i : { ...i, quantity: newQty };
    }).filter(i => i.quantity > 0));
  }, []);

  const handleRemove = useCallback((lineId: string) => {
    setCart(prev => prev.filter(i => i.lineId !== lineId));
  }, []);

  const handleClearCart = useCallback(() => setCart([]), []);

  // ── JSX ──
  return (
    <div className="alitas-root min-h-screen flex flex-col" style={{ backgroundColor: C.bg, fontFamily: '"Barlow", system-ui, sans-serif' }}>
      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;500;600;700;800;900&display=swap');
        .alitas-root button, .alitas-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        @keyframes aym-kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.08); } }
        .aym-kenburns { animation: aym-kenburns 20s ease-in-out infinite alternate; }
        @keyframes aym-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .aym-marquee { animation: aym-marquee 22s linear infinite; }
        @keyframes aym-pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 ${C.accent}40; } 50% { box-shadow: 0 0 0 8px ${C.accent}00; } }
        .aym-pulse-glow { animation: aym-pulse-glow 2s ease-in-out infinite; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-zinc-200/50" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
              <Flame size={20} className="text-white" />
            </div>
            <h1 className="text-lg tracking-tight" style={{ fontFamily: '"Anton", sans-serif', color: C.primary }}>
              ALITAS <span style={{ color: C.secondary }}>Y</span> MÁS
            </h1>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl hover:bg-zinc-100 transition-colors"
            style={{ color: C.primary }}
          >
            <CartIconSvg />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white px-1" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(360px, 46vh, 520px)' }}>
        <div className="absolute inset-0 aym-kenburns" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.15) 100%)` }} />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-10 max-w-7xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-block self-start px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-white/90 mb-3"
            style={{ background: `linear-gradient(135deg, ${C.accent}, #d97706)`, color: C.primary }}
          >
            Cocina Urbana · Alitas · Pizzetas · Tacos
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl text-white leading-none tracking-tighter"
            style={{ fontFamily: '"Anton", sans-serif' }}
          >
            ALITAS <span style={{ color: C.accent }}>Y</span> MÁS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-white/70 text-sm md:text-base mt-2 max-w-lg"
          >
            Salsas de la casa, pizzetas artesanales y tacos con actitud. Del local a tu mesa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex gap-3 mt-5"
          >
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.7, behavior: 'smooth' })}
              className="px-6 py-3 rounded-2xl text-white font-black text-sm uppercase tracking-wide active:scale-95 transition-transform shadow-xl flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`, boxShadow: `0 10px 30px -8px ${C.secondary}80` }}
            >
              Ver el Menú <ChevronRight size={16} />
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank" rel="noreferrer"
              className="px-6 py-3 rounded-2xl border border-white/20 text-white font-black text-sm uppercase tracking-wide active:scale-95 transition-transform flex items-center gap-2 bg-white/5 backdrop-blur-sm hover:bg-white/10"
            >
              <MessageCircle size={16} className="text-green-400" /> Pedir por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROMO TICKER ═══ */}
      <div className="overflow-hidden py-2.5" style={{ background: `linear-gradient(90deg, ${C.accent}, #d97706)` }}>
        <div className="aym-marquee flex gap-10 whitespace-nowrap" style={{ width: 'max-content' }}>
          {[0, 1].map(dup => (
            <span key={dup} className="flex items-center gap-10 text-sm font-black uppercase tracking-wider" style={{ color: C.primary }}>
              <span className="flex items-center gap-2">
                <PartyPopper size={18} /> {clientConfig.promo.text}
                <span className="text-[10px] opacity-70 normal-case tracking-normal font-semibold">({clientConfig.promo.note})</span>
              </span>
              <span className="flex items-center gap-2">
                <PartyPopper size={18} /> {clientConfig.promo.text}
                <span className="text-[10px] opacity-70 normal-case tracking-normal font-semibold">({clientConfig.promo.note})</span>
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ SEARCH + CATEGORIAS STICKY ═══ */}
      <div className="sticky top-[64px] z-40 backdrop-blur-xl bg-white/85 border-b border-zinc-200/50 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Busca alitas, tacos, pizzetas..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50 text-sm font-semibold placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-300/50 focus:bg-white transition-all text-[16px]"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 active:scale-95"
                style={{
                  backgroundColor: activeCategory === cat.id ? C.secondary : 'transparent',
                  color: activeCategory === cat.id ? 'white' : C.textSecondary,
                  border: activeCategory === cat.id ? '2px solid transparent' : '2px solid #e4e4e7',
                }}
              >
                <cat.icon size={13} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ DESTACADOS (Dark Section) ═══ */}
      {activeCategory === 'all' && !searchQuery && (
        <section className="py-8 md:py-12" style={{ backgroundColor: C.primary }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.accent}, #d97706)` }}>
                <Star size={14} className="text-zinc-900" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight text-white" style={{ fontFamily: '"Anton", sans-serif' }}>Los Favoritos</h2>
                <p className="text-xs text-zinc-400 font-semibold">Lo más pedido de la casa</p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {FEATURED.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.08 }}
                  className="shrink-0 w-56 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase aym-pulse-glow" style={{
                        backgroundColor: product.badge === 'popular' ? '#059669' : product.badge === 'nuevo' ? C.accent : C.secondary,
                        color: product.badge === 'popular' ? 'white' : 'black',
                      }}>
                        {product.badge === 'popular' ? 'Más Pedido' : product.badge === 'nuevo' ? 'Nuevo' : 'Picante'}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-sm text-white leading-tight">{product.name}</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-lg" style={{ color: C.accent }}>${product.price}</span>
                      {needsConfig(product) ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); setCustomizingProduct(product); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-white text-[10px] font-black uppercase active:scale-95 transition-transform"
                          style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}
                        >
                          <SlidersHorizontal size={12} /> Opciones
                        </button>
                      ) : hasOptionalExtras(product) ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleAddSimple(product, e)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
                            style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setCustomizingProduct(product); }}
                            className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/20 active:scale-90 transition-all"
                            title="Personalizar"
                          >
                            <SlidersHorizontal size={11} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => handleAddSimple(product, e)}
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform"
                          style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GRILLA DE PRODUCTOS ═══ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6">
        {/* Encabezado de categoría activa */}
        {!searchQuery && activeCategory !== 'all' && (
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
              {(() => { const cat = CATEGORIES.find(c => c.id === activeCategory); const Icon = cat?.icon ?? LayoutGrid; return <Icon size={18} className="text-white" />; })()}
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight" style={{ fontFamily: '"Anton", sans-serif', color: C.primary }}>
                {CATEGORIES.find(c => c.id === activeCategory)?.name ?? ''}
              </h2>
              <p className="text-xs text-zinc-400 font-semibold">{filteredProducts.length} productos</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, visibleItems).map((product, idx) => (
              <motion.div
                key={product.id} layout
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
                className="group rounded-2xl overflow-hidden bg-white border border-zinc-200 shadow-sm hover:shadow-xl transition-shadow duration-300"
                style={{ boxShadow: '0 2px 20px -6px rgba(0,0,0,0.08)' }}
              >
                {/* Imagen */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
                  <img
                    src={product.image} alt={product.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide" style={{
                      backgroundColor: product.badge === 'popular' ? '#059669' : product.badge === 'nuevo' ? C.accent : C.secondary,
                      color: product.badge === 'popular' ? 'white' : C.primary,
                    }}>
                      {product.badge === 'popular' ? 'Más Pedido' : product.badge === 'nuevo' ? 'Nuevo' : <span className="flex items-center gap-0.5"><Flame size={9} /> Picante</span>}
                    </span>
                  )}
                  {/* Badge sutil si es personalizable */}
                  {(needsConfig(product) || hasOptionalExtras(product)) && (
                    <span className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold flex items-center gap-1">
                      <SlidersHorizontal size={10} /> {needsConfig(product) ? 'Elige opciones' : 'Personalizar'}
                    </span>
                  )}
                </div>
                {/* Info */}
                <div className="p-4 flex flex-col gap-1.5">
                  <h3 className="font-extrabold text-sm leading-tight" style={{ color: C.primary }}>{product.name}</h3>
                  <p className="text-xs leading-tight line-clamp-2" style={{ color: C.textSecondary }}>{product.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-black text-lg" style={{ color: C.secondary }}>${product.price}</span>
                    {needsConfig(product) ? (
                      <button
                        onClick={() => setCustomizingProduct(product)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[11px] font-black uppercase active:scale-95 transition-transform shadow-md"
                        style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`, boxShadow: `0 6px 16px -4px ${C.secondary}50` }}
                      >
                        <SlidersHorizontal size={13} />
                        <span className="hidden sm:inline">Opciones</span>
                      </button>
                    ) : hasOptionalExtras(product) ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleAddSimple(product, e)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-md"
                          style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`, boxShadow: `0 6px 16px -4px ${C.secondary}50` }}
                        >
                          <Plus size={18} />
                        </button>
                        <button
                          onClick={() => setCustomizingProduct(product)}
                          className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-[#DC2626] hover:border-[#DC2626] hover:bg-red-50 active:scale-90 transition-all"
                          title="Personalizar con extras"
                        >
                          <SlidersHorizontal size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleAddSimple(product, e)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-md"
                        style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`, boxShadow: `0 6px 16px -4px ${C.secondary}50` }}
                      >
                        <Plus size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Ver más */}
        {visibleItems < filteredProducts.length && (
          <div className="flex justify-center py-10">
            <button
              onClick={() => setVisibleItems(v => v + 10)}
              className="px-8 py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wide active:scale-95 transition-transform shadow-lg"
              style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`, boxShadow: `0 10px 30px -8px ${C.secondary}60` }}
            >
              Ver más ({filteredProducts.length - visibleItems} restantes)
            </button>
          </div>
        )}

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Search size={36} className="text-zinc-300" />
            </div>
            <p className="text-lg font-black text-zinc-300">No encontramos nada</p>
            <p className="text-sm text-zinc-300 mt-1">Intenta con otra búsqueda o categoría</p>
          </div>
        )}
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-auto border-t border-zinc-200 bg-white pt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {/* Col 1: Marca */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
                <Flame size={16} className="text-white" />
              </div>
              <h3 className="font-black text-lg uppercase tracking-tight" style={{ fontFamily: '"Anton", sans-serif', color: C.primary }}>
                ALITAS Y MÁS
              </h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{clientConfig.description}</p>
          </div>

          {/* Col 2: Contacto y horarios */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Contacto</h4>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5" style={{ color: C.textSecondary }}>
                <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0"><Phone size={14} className="text-zinc-600" /></span>
                {clientConfig.phoneNumber}
              </p>
              <p className="flex items-center gap-2.5" style={{ color: C.textSecondary }}>
                <span className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0"><MessageCircle size={14} className="text-green-500" /></span>
                {clientConfig.phone}
              </p>
              <p className="flex items-start gap-2.5" style={{ color: C.textSecondary }}>
                <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5"><MapPin size={14} className="text-zinc-600" /></span>
                {clientConfig.address}
              </p>
              <p className="flex items-start gap-2.5" style={{ color: C.textSecondary }}>
                <span className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5"><Clock size={14} className="text-zinc-600" /></span>
                {clientConfig.hours}
              </p>
            </div>
          </div>

          {/* Col 3: Redes sociales */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Síguenos</h4>
            <div className="flex gap-3">
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <Instagram size={18} />
              </a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <Facebook size={18} />
              </a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-8" style={{ backgroundColor: C.primary }}>
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.
            </p>
            <motion.a
              href="https://imagineandstamp.site" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-orange-400/40 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Página web realizada por</span>
              <span className="text-sm font-black tracking-tight group-hover:scale-105 transition-transform" style={{ color: C.secondary }}>
                IMAGINE & STAMP
              </span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: C.secondary }} />
            </motion.a>
            <div className="w-16 h-px bg-white/10" />
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              <Shield size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ MODAL AVISO DE PRIVACIDAD ═══ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#1a1a1a] border-2 rounded-3xl shadow-2xl overflow-hidden" style={{ borderColor: C.secondary }}>
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${C.secondary}, ${C.accent})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all">
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}20` }}>
                    <Shield size={20} style={{ color: C.secondary }} />
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>En <strong className="text-white">{clientConfig.businessName}</strong> protegemos y respetamos tu privacidad. La información personal que compartes se utiliza exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} className="hover:underline" style={{ color: C.secondary }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ CART DRAWER ═══ */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        cartTotal={cartTotal}
        whatsappNumber={WHATSAPP}
        businessName={clientConfig.businessName}
        onClearCart={handleClearCart}
      />

      {/* ═══ CUSTOMIZE MODAL ═══ */}
      <AnimatePresence>
        {customizingProduct && (
          <CustomizeModal
            key={customizingProduct.id}
            product={customizingProduct}
            onClose={() => setCustomizingProduct(null)}
            onAdd={handleAddCustom}
          />
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${C.primary}, #27272a)` }}
          >
            <Check size={16} className="text-green-400" /> ¡Agregado! — {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FLOATING: CART BUTTON ═══ */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.button
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 20 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wide shadow-2xl active:scale-95 transition-transform"
            style={{
              background: `linear-gradient(135deg, ${C.primary}, #27272a)`,
              boxShadow: `0 12px 40px -6px rgba(0,0,0,0.4)`,
              marginBottom: 'env(safe-area-inset-bottom, 8px)',
            }}
          >
            <div className="relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shadow-md" style={{ background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)` }}>
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <span className="hidden sm:inline">Ver Pedido · ${cartTotal}</span>
            <span className="sm:hidden">${cartTotal}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ SCROLL TO TOP ═══ */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-4 z-50 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            style={{
              backgroundColor: 'white',
              border: '2px solid #e4e4e7',
              marginBottom: 'env(safe-area-inset-bottom, 8px)',
            }}
          >
            <ArrowUp size={18} className="text-zinc-600" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
