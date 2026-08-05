// ═══════════════════════════════════════════════════════════════════════════
// REY SPAR-TACO — Menú Digital · "Para chuparse los dedos"
// Cumple: carrito 2 pasos + éxito, salsas, transferencia, footer 3 col,
//         buscador, localStorage, privacidad, optimización móvil
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingCart, Flame,
  MapPin, Clock,
  ArrowRight, ArrowUp, ChevronLeft, Shield, ExternalLink,
  Beef, Sandwich, CircleDot, UtensilsCrossed, Copy, Check,
  ChefHat, Coffee, Pizza,
  Instagram, MessageCircle, Beer, Facebook,
} from 'lucide-react';
import { clientConfig } from '../config';

const WHATSAPP = clientConfig.phone;
const BUSINESS = clientConfig.businessName;
const C = clientConfig.colors;

// ═══════════════════ TYPES ═══════════════════

type CategoryId = 'todos' | 'tacos' | 'servido' | 'alambres' | 'gringas' | 'tortas' | 'extras' | 'bebidas' | 'cervezas';

interface LocalProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: CategoryId;
  image?: string;
  badge?: string;
}

interface CartItem extends LocalProduct {
  cartId: string;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'domicilio' | 'recoger';
  address: string;
  paymentMethod: 'efectivo' | 'transferencia';
  cashAmount: string;
  notes: string;
  salsas: string[];
}

// ═══════════════════ CATEGORÍAS (con íconos) ═══════════════════

const CATEGORIES: { id: CategoryId; label: string; icon: any }[] = [
  { id: 'todos', label: 'Todos', icon: UtensilsCrossed },
  { id: 'tacos', label: 'Tacos', icon: Flame },
  { id: 'servido', label: 'Tacos Servido', icon: ChefHat },
  { id: 'alambres', label: 'Alambres', icon: Beef },
  { id: 'gringas', label: 'Gringas', icon: Pizza },
  { id: 'tortas', label: 'Tortas', icon: Sandwich },
  { id: 'extras', label: 'Extras', icon: CircleDot },
  { id: 'bebidas', label: 'Bebidas', icon: Coffee },
  { id: 'cervezas', label: 'Cervezas', icon: Beer },
];

// ═══════════════════ MENÚ ═══════════════════

const PRODUCTS: LocalProduct[] = [
  // ── TACOS ──
  { id: 't1', name: 'Pastor', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80', badge: '⭐ Favorito' },
  { id: 't2', name: 'Suadero', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 't3', name: 'Campechano', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80' },
  { id: 't4', name: 'Longaniza', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80' },
  { id: 't5', name: 'Tripa', price: 13, category: 'tacos', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80' },

  // ── TACOS SERVIDO ──
  { id: 'ts1', name: 'Pastor (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 'ts2', name: 'Campechano (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: 'ts3', name: 'Longaniza (Servido)', price: 90, category: 'servido' },
  { id: 'ts4', name: 'Suadero (Servido)', price: 90, category: 'servido' },
  { id: 'ts5', name: 'Chuleta (Servido)', price: 90, category: 'servido' },
  { id: 'ts6', name: 'Bistec (Servido)', price: 100, category: 'servido' },
  { id: 'ts7', name: 'Costilla (Servido)', price: 100, category: 'servido' },
  { id: 'ts8', name: 'Arrachera (Servido)', price: 110, category: 'servido' },

  // ── ALAMBRES ──
  { id: 'a1', name: 'Pastor', description: 'Cebolla, morrón, tocino, jamón y queso', price: 90, category: 'alambres', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 'a2', name: 'Campechano', description: 'Pastor, cebolla, tocino, jamón, chuleta, queso y morrón', price: 90, category: 'alambres' },
  { id: 'a3', name: 'Mexicano', description: 'Pastor, tocino, jamón, chuleta, queso, cebolla, morrón, jitomate y jalapeño', price: 90, category: 'alambres' },
  { id: 'a4', name: 'Hawaiano', description: 'Pastor, cebolla, morrón, tocino, jamón, chuleta, queso y piña', price: 90, category: 'alambres', badge: '🍍' },
  { id: 'a5', name: 'Sabores', description: 'Pastor, tocino, jamón, chuleta, longaniza, queso, cebolla y morrón', price: 90, category: 'alambres' },
  { id: 'a6', name: 'Vegetariano', description: 'Nopal, cebolla, morrón, champiñón, jitomate, queso, aguacate y elote', price: 90, category: 'alambres', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 'a7', name: 'Bistec', description: 'Cebolla, morrón, tocino, jamón y queso', price: 140, category: 'alambres' },
  { id: 'a8', name: 'Spar-Taco', description: 'Milanesa, bistec, elote, chuleta, cebolla, morrón, tocino, jamón y queso', price: 140, category: 'alambres', badge: '👑' },
  { id: 'a9', name: 'Costilla', description: 'Costilla, cebolla, morrón, tocino, jamón y queso', price: 140, category: 'alambres' },
  { id: 'a10', name: 'Chuleta', description: 'Chuleta, cebolla, morrón, tocino, jamón y queso', price: 140, category: 'alambres' },
  { id: 'a11', name: 'Campesino', description: 'Nopal, cebolla, bistec, longaniza y queso', price: 140, category: 'alambres' },
  { id: 'a12', name: 'Fortachón', description: 'Chuleta, chorizo, tocino, jamón y queso', price: 140, category: 'alambres' },
  { id: 'a13', name: '¿Qué me ves?', description: 'Pastor, bistec, piña y queso', price: 140, category: 'alambres' },
  { id: 'a14', name: 'Arrachera', description: 'Cebolla, morrón, tocino, jamón y queso', price: 150, category: 'alambres' },

  // ── GRINGAS ──
  { id: 'g1', name: 'Sincronizadas', price: 40, category: 'gringas', image: 'https://images.unsplash.com/photo-1581075678853-a55e09f584e0?w=400&q=80' },
  { id: 'g2', name: 'Pastor', price: 60, category: 'gringas' },
  { id: 'g3', name: 'Suadero', price: 60, category: 'gringas' },
  { id: 'g4', name: 'Chuleta', price: 60, category: 'gringas' },
  { id: 'g5', name: 'Bistec', price: 80, category: 'gringas' },
  { id: 'g6', name: 'Costilla', price: 80, category: 'gringas' },
  { id: 'g7', name: 'Arrachera', price: 90, category: 'gringas' },

  // ── TORTAS ──
  { id: 'to1', name: 'Pastor', price: 80, category: 'tortas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80' },
  { id: 'to2', name: 'Campechana', price: 80, category: 'tortas' },
  { id: 'to3', name: 'Hawaiana', price: 80, category: 'tortas' },
  { id: 'to4', name: 'Cubana', price: 80, category: 'tortas' },
  { id: 'to5', name: 'Choriqueso', price: 80, category: 'tortas' },
  { id: 'to6', name: 'Chuleta', price: 80, category: 'tortas' },
  { id: 'to7', name: 'Milanesa', price: 90, category: 'tortas' },
  { id: 'to8', name: 'Suadero', price: 90, category: 'tortas' },
  { id: 'to9', name: 'Bistec', price: 90, category: 'tortas' },
  { id: 'to10', name: 'Costilla', price: 90, category: 'tortas' },
  { id: 'to11', name: 'Arrachera', price: 105, category: 'tortas' },

  // ── EXTRAS ──
  { id: 'e1', name: 'Orden tortilla de maíz', price: 15, category: 'extras' },
  { id: 'e2', name: 'Orden tortilla de harina', price: 15, category: 'extras' },
  { id: 'e3', name: 'Nopales', price: 15, category: 'extras' },
  { id: 'e4', name: 'Aguacate', price: 15, category: 'extras' },
  { id: 'e5', name: 'Salsa', price: 10, category: 'extras' },
  { id: 'e6', name: 'Queso', price: 15, category: 'extras' },
  { id: 'e7', name: 'Cebollitas', price: 15, category: 'extras' },

  // ── BEBIDAS ──
  { id: 'b1', name: 'Agua de sabor (jamaica y horchata)', price: 35, category: 'bebidas', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
  { id: 'b2', name: 'Coca-Cola 600 ml', price: 35, category: 'bebidas' },
  { id: 'b3', name: 'Refresco 500 ml', description: 'Coca, fanta, fresca, sprite, sidral', price: 27, category: 'bebidas' },
  { id: 'b4', name: 'Jugo del Valle 600 ml', description: 'Cítrico y guayaba', price: 27, category: 'bebidas' },
  { id: 'b5', name: 'Jugo del Valle 355 ml', description: 'Mango', price: 27, category: 'bebidas' },
  { id: 'b6', name: 'Agua Natural', price: 20, category: 'bebidas' },

  // ── CERVEZAS ──
  { id: 'c1', name: 'Corona', price: 35, category: 'cervezas', image: 'https://images.unsplash.com/photo-1614316982247-5d2bc5038c82?w=400&q=80' },
  { id: 'c2', name: 'Victoria', price: 35, category: 'cervezas' },
  { id: 'c3', name: 'Corona "0"', price: 35, category: 'cervezas' },
  { id: 'c4', name: 'Modelo Negra', price: 40, category: 'cervezas' },
  { id: 'c5', name: 'Modelo Especial', price: 40, category: 'cervezas' },
  { id: 'c6', name: 'Ultra', price: 40, category: 'cervezas' },
  { id: 'c7', name: 'Corona Mega', price: 90, category: 'cervezas' },
  { id: 'c8', name: 'Victoria Mega', price: 90, category: 'cervezas' },
  { id: 'c9', name: 'Vaso Preparado', price: 15, category: 'cervezas' },
];

// ═══════════════════ COMPONENTE PRINCIPAL ═══════════════════

export default function ReySparTacoMenu() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartToast, setCartToast] = useState<LocalProduct | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '', phone: '', deliveryMethod: 'domicilio',
    address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [],
  });

  // ── document.title ──
  useEffect(() => {
    document.title = 'Rey Spar-Taco | Menú Digital';
    return () => { document.title = 'IMAGINE & STAMP'; };
  }, []);

  // ── Persistencia localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem('reyspar_cart');
    if (saved) { try { setCart(JSON.parse(saved)); } catch {} }
  }, []);

  useEffect(() => {
    localStorage.setItem('reyspar_cart', JSON.stringify(cart));
  }, [cart]);

  // ── Scroll-to-top visibility ──
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Bloquear scroll del fondo ──
  useEffect(() => {
    const anyOpen = isCartOpen || isPrivacyOpen;
    document.body.style.overflow = anyOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen, isPrivacyOpen]);

  // ── Filtrado ──
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      result = result.filter(p =>
        p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q) ||
        p.description?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)
      );
    } else if (activeCategory !== 'todos') {
      result = result.filter(p => p.category === activeCategory);
    }
    return result;
  }, [activeCategory, searchQuery]);

  // ── Cart operations ──
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: LocalProduct) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, cartId: product.id + '-' + Date.now(), quantity: 1 }];
    });
    setCartToast(product);
    setTimeout(() => setCartToast(null), 2000);
  }, []);

  const updateQuantity = useCallback((cartId: string, delta: number) => {
    setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
  }, []);

  const removeFromCart = (cartId: string) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const clearCart = useCallback(() => setCart([]), []);

  const toggleSalsa = (salsaName: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      salsas: prev.salsas.includes(salsaName) ? prev.salsas.filter(s => s !== salsaName) : [...prev.salsas, salsaName],
    }));
  };

  const copyBankInfo = () => {
    const b = clientConfig.bankInfo;
    const info = `Banco: ${b.bank_name}\nTitular: ${b.account_holder}\nCLABE: ${b.clabe}\nCuenta: ${b.account_number}`;
    navigator.clipboard.writeText(info).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const openCart = () => { setStep('cart'); setIsCartOpen(true); };
  const closeCart = () => setIsCartOpen(false);

  const changeAmount = customerInfo.cashAmount && customerInfo.paymentMethod === 'efectivo'
    ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
    : null;

  const canCheckout =
    customerInfo.name.trim() !== '' &&
    customerInfo.phone.trim() !== '' &&
    (customerInfo.deliveryMethod === 'recoger' || customerInfo.address.trim() !== '');

  // ── WhatsApp Checkout ──
  const handleSendWhatsApp = () => {
    const itemsText = cart.map((item, i) =>
      `${i + 1}. *${item.name}* x${item.quantity} — $${item.price * item.quantity}`
    ).join('\n');

    const deliveryText = customerInfo.deliveryMethod === 'recoger'
      ? 'Recoger en local'
      : `Envío a: ${customerInfo.address}`;
    const paymentText = customerInfo.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia';

    let cashInfo = '';
    if (customerInfo.paymentMethod === 'efectivo' && customerInfo.cashAmount) {
      cashInfo = `\n*Paga con:* $${customerInfo.cashAmount} → *Cambio:* $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)}`;
    }

    let salsaInfo = '';
    if (customerInfo.salsas.length > 0) {
      salsaInfo = `\n🌶️ *Salsas:* ${customerInfo.salsas.join(', ')}`;
    }

    const message = `🌮 *PEDIDO REY SPAR-TACO* 🌮\n\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *WhatsApp:* ${customerInfo.phone}\n` +
      `📦 *Entrega:* ${deliveryText}\n` +
      `💰 *Pago:* ${paymentText}${cashInfo}${salsaInfo}\n\n` +
      `📋 *Productos:*\n${itemsText}\n\n` +
      `💵 *Total: $${cartTotal} MXN*` +
      (customerInfo.notes ? `\n\n📝 *Notas:* ${customerInfo.notes}` : '');

    setStep('success');
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
      clearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'domicilio', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] });
      closeCart();
    }, 500);
  };

  // ═══════════════════ RENDER ═══════════════════

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans pb-24">

      {/* ══════════ HEADER STICKY ══════════ */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-black tracking-tight" style={{ color: C.primary }}>
            {BUSINESS.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                document.getElementById('menu-search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => document.getElementById('menu-search')?.focus(), 400);
              }}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-400"
            >
              <Search size={20} />
            </button>
            <button onClick={openCart} className="relative p-2 rounded-full hover:bg-stone-100 transition-colors" style={{ color: C.primary }}>
              <ShoppingCart size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute right-0 top-0 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white bg-orange-500 border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section className="relative w-full h-[35vh] min-h-[260px] overflow-hidden flex flex-col justify-center items-center text-center">
        <img
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1200&q=80"
          alt="Tacos al pastor"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-6 w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-lg mb-2"
            style={{ color: C.secondary }}>
            {BUSINESS}
          </h1>
          <p className="text-white text-base md:text-xl font-medium italic drop-shadow-md mb-5">
            "{clientConfig.tagline}"
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock size={14} className="text-orange-400" />
              {clientConfig.hoursShort}
            </span>
            {clientConfig.address !== 'Ubicación Pendiente' && (
              <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold">
                <MapPin size={14} className="text-orange-400" />
                {clientConfig.address}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ BUSCADOR ══════════ */}
      <div className="max-w-4xl mx-auto px-4 -mt-7 relative z-20">
        <div className="relative shadow-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            id="menu-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tacos, alambres, bebidas..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-orange-500/20 bg-white text-sm font-medium focus:outline-none focus:border-orange-500 transition-all placeholder:text-stone-400 shadow-lg"
            style={{ fontSize: '16px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X size={16} className="text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {/* ══════════ CATEGORÍAS STICKY ══════════ */}
      <nav className="sticky top-16 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-500/10 mt-6">
        <div className="max-w-4xl mx-auto flex overflow-x-auto hide-scrollbar px-2 py-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] ${
                activeCategory === cat.id
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-stone-100 text-stone-500 hover:text-green-700 hover:bg-green-50'
              }`}
              style={activeCategory === cat.id ? { backgroundColor: C.secondary } : {}}
            >
              <cat.icon size={13} />
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════ PRODUCTOS ══════════ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeCategory !== 'todos' && !searchQuery && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2" style={{ color: C.primary }}>
              <span className="w-6 h-1 rounded-full" style={{ backgroundColor: C.secondary }} />
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-orange-500/10 group flex flex-col"
              >
                {/* Imagen superior */}
                {product.image ? (
                  <div className="w-full h-48 bg-stone-100 shrink-0">
                    <img
                      src={product.image} alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 shrink-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.primary}10, ${C.secondary}10)` }}>
                    <UtensilsCrossed size={32} className="text-stone-300" />
                  </div>
                )}

                {/* Contenido inferior */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h4 className="font-bold text-base leading-tight" style={{ color: C.primary }}>
                        {product.name}
                      </h4>
                      {product.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase bg-orange-100 text-orange-600">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-stone-400 leading-snug mt-0.5 line-clamp-2">{product.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <span className="font-black text-lg" style={{ color: C.secondary }}>${product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="min-w-[40px] min-h-[40px] p-2 rounded-lg shadow-sm transition-all active:scale-90 hover:scale-105 text-white"
                      style={{ backgroundColor: C.primary }}
                      aria-label="Agregar"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-stone-400">
            <Search size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-bold">No encontramos productos con esa búsqueda.</p>
          </div>
        )}
      </main>

      {/* ══════════ BOTÓN FLOTANTE CARRITO ══════════ */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={openCart}
            className="fixed z-40 px-5 py-4 rounded-full shadow-xl flex items-center gap-3 text-white font-bold text-sm"
            style={{ backgroundColor: C.primary, bottom: 'max(1.5rem, env(safe-area-inset-bottom))', right: '1.5rem' }}
          >
            <ShoppingCart size={22} />
            <span>{cartCount} · ${cartTotal}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ BOTÓN VOLVER ARRIBA ══════════ */}
      <AnimatePresence>
        {showScrollTop && !isCartOpen && (
          <motion.button
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-40 w-11 h-11 rounded-full flex items-center justify-center bg-white shadow-lg border border-orange-500/40 text-orange-500 hover:border-orange-500 transition-colors"
            style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))', left: '1.5rem' }}
            title="Volver arriba"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ CART DRAWER (3 pasos) ══════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              {/* Header del drawer */}
              <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  {step === 'details' && (
                    <button onClick={() => setStep('cart')} className="p-1 rounded-full hover:bg-stone-100 text-stone-400">
                      <ChevronLeft size={18} />
                    </button>
                  )}
                  <h3 className="font-black text-xl flex items-center gap-2" style={{ color: C.primary }}>
                    {step === 'cart' ? 'Mi Orden' : step === 'details' ? 'Tus Datos' : '¡Listo!'}
                  </h3>
                </div>
                <button onClick={closeCart} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:text-red-500 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Indicador de pasos */}
              {step !== 'success' && (
                <div className="flex gap-2 px-5 pt-3">
                  <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: step === 'cart' || step === 'details' ? C.secondary : '#e7e5e4' }} />
                  <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: step === 'details' ? C.secondary : '#e7e5e4' }} />
                </div>
              )}

              {/* ── PASO 1: CARRITO + SALSAS ── */}
              {step === 'cart' && (
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4">
                      <ShoppingCart size={48} className="opacity-20" />
                      <p className="font-bold">Tu orden está vacía</p>
                      <p className="text-[10px]">Agrega productos del menú</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3">
                        {cart.map(item => (
                          <div key={item.cartId} className="bg-stone-50 p-3 rounded-xl flex gap-3 border border-stone-200">
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-sm leading-tight" style={{ color: C.primary }}>{item.name}</h5>
                              <p className="text-xs text-stone-500 font-bold">${item.price} c/u</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <button onClick={() => updateQuantity(item.cartId, -1)} className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                                  <Minus size={13} className="text-stone-500" />
                                </button>
                                <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center hover:bg-stone-100">
                                  <Plus size={13} className="text-stone-500" />
                                </button>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <span className="font-bold" style={{ color: C.secondary }}>${item.price * item.quantity}</span>
                              <button onClick={() => removeFromCart(item.cartId)} className="text-stone-300 hover:text-red-500">
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ── SELECTOR DE SALSAS ── */}
                      <div className="mt-4 p-4 rounded-2xl bg-orange-50 border border-orange-200">
                        <p className="text-xs font-black uppercase tracking-wider mb-2 text-orange-700">
                          🌶️ Elige tus Salsas Gratis:
                        </p>
                        <div className="space-y-1.5">
                          {clientConfig.salsas.map((salsa) => {
                            const isChecked = customerInfo.salsas.includes(salsa.name);
                            return (
                              <button
                                key={salsa.id}
                                onClick={() => toggleSalsa(salsa.name)}
                                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                                  isChecked
                                    ? 'bg-white border-orange-400 text-orange-700'
                                    : 'border-transparent text-stone-500 hover:bg-white/50'
                                }`}
                              >
                                <span>{salsa.name}</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white">
                                  {salsa.spiciness}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── PASO 2: DATOS ── */}
              {step === 'details' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">Nombre *</label>
                    <input
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">WhatsApp *</label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="55 1234 5678"
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'domicilio' })}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${customerInfo.deliveryMethod === 'domicilio' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}
                      >
                        🛵 Domicilio
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'recoger' })}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${customerInfo.deliveryMethod === 'recoger' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}
                      >
                        📍 Recoger
                      </button>
                    </div>
                  </div>
                  {customerInfo.deliveryMethod === 'domicilio' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">Dirección *</label>
                      <input
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Calle, número, colonia, CP"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                        style={{ fontSize: '16px' }}
                      />
                    </motion.div>
                  )}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'efectivo' })}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${customerInfo.paymentMethod === 'efectivo' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}
                      >
                        💵 Efectivo
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transferencia' })}
                        className={`py-2.5 text-xs font-bold rounded-xl border transition-colors ${customerInfo.paymentMethod === 'transferencia' ? 'bg-orange-100 border-orange-400 text-orange-700' : 'bg-stone-50 border-stone-200 text-stone-500'}`}
                      >
                        🏦 Transferencia
                      </button>
                    </div>
                  </div>
                  {customerInfo.paymentMethod === 'efectivo' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">¿Con cuánto vas a pagar?</label>
                      <input
                        type="number"
                        value={customerInfo.cashAmount}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                        placeholder="Ej: 500"
                        className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
                        style={{ fontSize: '16px' }}
                      />
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs font-bold mt-1" style={{ color: C.primary }}>Tu cambio: ${changeAmount}</p>
                      )}
                    </motion.div>
                  )}
                  {customerInfo.paymentMethod === 'transferencia' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-2xl space-y-2 bg-orange-50 border border-orange-200"
                    >
                      <p className="text-xs font-black uppercase tracking-widest text-orange-700">🏦 Datos de Transferencia</p>
                      <div className="text-xs leading-relaxed space-y-1 text-stone-600">
                        <p><strong>Banco:</strong> {clientConfig.bankInfo.bank_name}</p>
                        <p><strong>Titular:</strong> {clientConfig.bankInfo.account_holder}</p>
                        <p><strong>Cuenta:</strong> {clientConfig.bankInfo.account_number}</p>
                        <p className="font-mono font-bold text-orange-700">CLABE: {clientConfig.bankInfo.clabe}</p>
                      </div>
                      <button
                        onClick={copyBankInfo}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-white border border-orange-300 text-orange-600 hover:bg-orange-100 transition-all"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? '¡Copiado!' : 'Copiar datos'}
                      </button>
                      <p className="text-[9px] font-bold text-orange-600/70">
                        * Envía tu comprobante al mismo WhatsApp del pedido.
                      </p>
                    </motion.div>
                  )}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] block mb-1 text-stone-500">Notas</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Sin cebolla, extra salsa..."
                      rows={2}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
              )}

              {/* ── PASO 3: ÉXITO ── */}
              {step === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-green-100"
                  >
                    <Check size={40} className="text-green-600" strokeWidth={2.5} />
                  </motion.div>
                  <h3 className="text-xl font-black mb-2" style={{ color: C.primary }}>¡Pedido Enviado!</h3>
                  <p className="text-sm text-stone-500">
                    Te redirigimos a WhatsApp para confirmar tu pedido.
                  </p>
                </div>
              )}

              {/* ── FOOTER DEL CARRITO ── */}
              {cart.length > 0 && step !== 'success' && (
                <div className="p-4 bg-white border-t border-stone-200 shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-stone-500 font-bold uppercase text-xs">{cartCount} producto{cartCount !== 1 ? 's' : ''}</span>
                    <span className="text-2xl font-black" style={{ color: C.secondary }}>${cartTotal}</span>
                  </div>
                  {step === 'cart' && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setStep('details')}
                      className="w-full py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 text-white"
                      style={{ backgroundColor: C.primary }}
                    >
                      Continuar <ArrowRight size={18} />
                    </motion.button>
                  )}
                  {step === 'details' && (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSendWhatsApp}
                        disabled={!canCheckout}
                        className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
                      >
                        <MessageCircle size={18} />
                        Enviar pedido por WhatsApp
                      </motion.button>
                      {!canCheckout && (
                        <p className="text-[10px] text-center mt-2 font-medium text-red-500">
                          Completa nombre, WhatsApp{customerInfo.deliveryMethod === 'domicilio' ? ' y dirección' : ''}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ TOAST: agregado ══════════ */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm"
          >
            <div className="rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-3 text-white"
              style={{ backgroundColor: C.primary }}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-75">¡Agregado!</p>
                <p className="text-sm font-bold truncate">{cartToast.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ FOOTER (3 columnas) ══════════ */}
      <footer className="bg-stone-900 text-stone-400 pt-12 border-t-4 border-orange-500 mt-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">

          {/* Col 1: Marca */}
          <div>
            <h3 className="text-white font-black uppercase mb-3 text-lg" style={{ color: C.secondary }}>
              {BUSINESS}
            </h3>
            <p className="text-sm leading-relaxed">{clientConfig.description}</p>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <h4 className="text-white font-black uppercase tracking-wider text-xs mb-3">Contacto</h4>
            <div className="space-y-2.5 text-sm">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-2.5 text-stone-400 hover:text-white transition-colors">
                <span className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-green-500" />
                </span>
                {clientConfig.phoneNumber}
              </a>
              <p className="flex items-start gap-2.5 text-stone-400">
                <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <Clock size={14} />
                </span>
                <span className="leading-relaxed">{clientConfig.hours.split(' | ').join('\n')}</span>
              </p>
            </div>
          </div>

          {/* Col 3: Redes + Horarios */}
          <div>
            <h4 className="text-white font-black uppercase tracking-wider text-xs mb-3">Síguenos</h4>
            <div className="flex gap-3 mb-4">
              {clientConfig.instagramUrl && (
                <motion.a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)' }}>
                  <Instagram size={18} />
                </motion.a>
              )}
              {clientConfig.facebookUrl && (
                <motion.a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#1877F2]">
                  <Facebook size={18} />
                </motion.a>
              )}
              <motion.a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-[#25D366]">
                <MessageCircle size={18} />
              </motion.a>
            </div>
            <p className="text-xs text-stone-500">{clientConfig.hoursShort}</p>
          </div>

        </div>

        {/* Barra inferior */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <p className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} {BUSINESS}. Todos los derechos reservados.
            </p>
            <motion.a
              href="https://imagineandstamp.site" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-orange-500/40 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 group-hover:text-stone-300">Página web realizada por</span>
              <span className="text-sm font-black tracking-tight text-orange-500">IMAGINE & STAMP</span>
              <ExternalLink size={12} className="text-orange-500 opacity-50 group-hover:opacity-100" />
            </motion.a>
            <div className="w-16 h-px bg-white/10" />
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
            >
              <Shield size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ══════════ MODAL AVISO DE PRIVACIDAD ══════════ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white border-2 border-orange-500 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />
              <div className="p-6">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Shield size={20} className="text-orange-500" />
                  </div>
                  <h2 className="text-lg font-black text-stone-800 tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-3 text-sm text-stone-500 leading-relaxed">
                  <p>En <strong className="text-stone-800">{BUSINESS}</strong> protegemos tu privacidad. La información personal que compartes se utiliza exclusivamente para procesar tus pedidos.</p>
                  <p>No almacenamos datos de tarjetas. Tus datos solo se usan para tu pedido. Nunca compartimos tu información con terceros.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos por WhatsApp al <span className="font-bold text-orange-500">{clientConfig.phoneNumber}</span>.</p>
                </div>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="mt-6 w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-white transition-colors"
                  style={{ backgroundColor: C.primary }}
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ ESTILOS GLOBALES ══════════ */}
      <style>{`
        *::-webkit-scrollbar { width: 4px; height: 0px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 4px; }
        * { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.1) transparent; }
        button, a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        input::placeholder, textarea::placeholder { color: #a8a29e !important; }
      `}</style>
    </div>
  );
}
