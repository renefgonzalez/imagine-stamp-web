// ═══════════════════════════════════════════════════════════════════════════
// DEMO · Taquería El Trompo — Menú Digital
// Patrón A estándar: copia de _template con datos ficticios.
// Negocio inventado · Pedidos → WhatsApp de René (Imagine & Stamp)
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag,
  Phone, MapPin, Mail, Clock,
  Instagram, Facebook, MessageCircle,
  ExternalLink, Shield,
  LayoutGrid, Flame, Sparkles, Leaf,
} from 'lucide-react';
import { clientConfig } from '../config';
import { useCartStore } from '../../../store/useCartStore';

// Imágenes WebP optimizadas (≤ 120 KB)
import heroCoverImg   from '../assets/hero_cover.webp';
import tacoPastorImg  from '../assets/taco_pastor.webp';
import tacoSuaderoImg from '../assets/taco_suadero.webp';
import tacoBistecImg  from '../assets/taco_bistec.webp';
import gringaImg      from '../assets/gringa.webp';
import costraImg      from '../assets/costra_suadero.webp';
import quesadillaImg  from '../assets/quesadilla_queso.webp';
import costillasImg   from '../assets/orden_costillas.webp';
import horchataImg    from '../assets/agua_horchata.webp';
import jamaicaImg     from '../assets/agua_jamaica.webp';
import tamarindoImg   from '../assets/agua_tamarindo.webp';
import refrescoImg    from '../assets/refresco.webp';

// ─── DATOS ───────────────────────────────────────────────────────────────────

const WHATSAPP = clientConfig.phone;
const BUSINESS = clientConfig.businessName;
const C = clientConfig.colors;

interface LocalProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
}

const CATEGORIES = [
  { id: 'all',      name: 'VER TODO',   icon: LayoutGrid },
  { id: 'tacos',    name: 'Tacos',      icon: Flame      },
  { id: 'extras',   name: 'Extras',     icon: Sparkles   },
  { id: 'bebidas',  name: 'Bebidas',    icon: Leaf       },
];

const PRODUCTS: LocalProduct[] = [
  // ── TACOS ──────────────────────────────────────────────────────────────
  {
    id: 't1',
    name: 'Taco al Pastor',
    description: 'Carne de cerdo marinada en achiote y chiles, dorada en trompo. Con piña, cebolla y cilantro.',
    price: 30,
    category: 'tacos',
    image: tacoPastorImg,
    badge: 'Más Pedido',
  },
  {
    id: 't2',
    name: 'Taco de Suadero',
    description: 'Carne de res suave y jugosa, dorada en comal. Con cebolla, cilantro y salsa de tu elección.',
    price: 30,
    category: 'tacos',
    image: tacoSuaderoImg,
    badge: 'Clásico',
  },
  {
    id: 't3',
    name: 'Taco de Bistec',
    description: 'Bistec de res a la plancha, tierno y sabroso. Va con frijoles y guacamole al gusto.',
    price: 35,
    category: 'tacos',
    image: tacoBistecImg,
  },
  {
    id: 't4',
    name: 'Taco Mixto',
    description: 'La mitad pastor, la mitad suadero. Para los que no se deciden — ¡los mejores de los dos mundos!',
    price: 32,
    category: 'tacos',
    image: tacoPastorImg,
  },
  // ── EXTRAS ─────────────────────────────────────────────────────────────
  {
    id: 'e1',
    name: 'Gringa',
    description: 'Tortilla de harina con queso Oaxaca fundido y pastor. El clásico que siempre enamora.',
    price: 70,
    category: 'extras',
    image: gringaImg,
    badge: 'Favorita',
  },
  {
    id: 'e2',
    name: 'Costra de Suadero',
    description: 'Queso asado hasta quedar crujiente, doblado sobre suadero jugoso. Una delicia única.',
    price: 80,
    category: 'extras',
    image: costraImg,
    badge: 'Especial',
  },
  {
    id: 'e3',
    name: 'Quesadilla de Queso',
    description: 'Quesadilla grande en comal con queso Oaxaca derretido y chile jalapeño toreado. Sin maíz abusan — con maíz también.',
    price: 60,
    category: 'extras',
    image: quesadillaImg,
  },
  {
    id: 'e4',
    name: 'Orden de Costillas',
    description: 'Tres costillas de cerdo doradas en comal, bañadas en salsa roja. Acompañadas de frijoles de olla.',
    price: 120,
    category: 'extras',
    image: costillasImg,
  },
  // ── BEBIDAS ────────────────────────────────────────────────────────────
  {
    id: 'b1',
    name: 'Agua de Horchata',
    description: 'Agua fresca de arroz con leche, canela y vainilla. El acompañante perfecto para los tacos.',
    price: 28,
    category: 'bebidas',
    image: horchataImg,
    badge: 'Popular',
  },
  {
    id: 'b2',
    name: 'Agua de Jamaica',
    description: 'Infusión de flor de jamaica fría, ligeramente dulce y refrescante.',
    price: 25,
    category: 'bebidas',
    image: jamaicaImg,
  },
  {
    id: 'b3',
    name: 'Agua de Tamarindo',
    description: 'Agua de tamarindo ácida con toque de chile y azúcar. Para los que gustan de lo intenso.',
    price: 25,
    category: 'bebidas',
    image: tamarindoImg,
  },
  {
    id: 'b4',
    name: 'Refresco',
    description: 'Coca-Cola, Sprite o Manzanita Sol. Bien fría, de litro o en lata según existencia.',
    price: 30,
    category: 'bebidas',
    image: refrescoImg,
  },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

export default function DemoTaqueriaMenu() {
  const { addToCart, cart, cartTotal, clearCart, isOpen, openCart, closeCart } = useCartStore();
  const [searchQuery, setSearchQuery]   = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleItems, setVisibleItems] = useState(12);
  const [cartStep, setCartStep]         = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '',
    deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    address: '', paymentMethod: 'cash' as 'cash' | 'transfer',
    notes: '', cashAmount: '',
  });
  const [toastMsg, setToastMsg]         = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => { setVisibleItems(12); }, [activeCategory, searchQuery]);

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

  const handleAddToCart = (product: LocalProduct) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setToastMsg(product.name);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleSendWhatsApp = () => {
    const itemsText = cart.map((item, i) =>
      `${i + 1}. ${item.name} x${item.quantity} — $${item.price * item.quantity}`
    ).join('\n');
    const deliveryText = customerInfo.deliveryMethod === 'pickup'
      ? 'Recoger en local'
      : `Envío a: ${customerInfo.address}`;
    const paymentText = customerInfo.paymentMethod === 'cash' ? 'Efectivo' : 'Transferencia';
    const message =
      `🌮 *PEDIDO — ${BUSINESS}*\n\n` +
      `*Cliente:* ${customerInfo.name || 'Sin nombre'}\n` +
      `*Teléfono:* ${customerInfo.phone || 'No indicado'}\n` +
      `*Entrega:* ${deliveryText}\n` +
      `*Pago:* ${paymentText}\n\n` +
      `${itemsText}\n\n` +
      `*TOTAL: $${cartTotal} MXN*` +
      (customerInfo.notes ? `\n\nNotas: ${customerInfo.notes}` : '') +
      `\n\n_Pedido desde el menú digital demo · Imagine & Stamp_`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
      clearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'pickup', address: '', paymentMethod: 'cash', notes: '', cashAmount: '' });
      setCartStep(1);
      closeCart();
    }, 500);
  };

  const changeAmount = customerInfo.cashAmount && customerInfo.paymentMethod === 'cash'
    ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
    : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.bg, fontFamily: 'Inter, sans-serif' }}>

      {/* ── BANNER DEMO ── */}
      <div style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.accent})`, color: '#fff', padding: '10px 16px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
        ✨ Esto es un demo — ¿Quieres un menú así para tu negocio?{' '}
        <a
          href={`https://wa.me/${WHATSAPP}?text=Hola,%20vi%20el%20demo%20y%20quiero%20cotizar%20un%20men%C3%BA%20digital.`}
          style={{ textDecoration: 'underline', color: '#fff', marginLeft: 6 }}
        >
          Cotiza aquí
        </a>
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-black/5">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl font-black" style={{ backgroundColor: C.secondary }}>
              🌮
            </div>
            <h1 className="text-lg font-black tracking-tight" style={{ color: C.primary }}>{BUSINESS}</h1>
          </div>
          <button onClick={openCart} className="relative p-2 rounded-full hover:bg-black/5 transition-colors" style={{ color: C.primary }}>
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white" style={{ backgroundColor: C.secondary }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative h-48 overflow-hidden" style={{ backgroundColor: C.primary }}>
        <img
          src={heroCoverImg}
          alt="Taquería El Trompo"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-end p-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: C.secondary }}>
              Menú Digital Demo
            </span>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mt-2">
              Taquería El Trompo
            </h2>
            <p className="text-white/60 text-sm mt-1">🌮 Pastor · Suadero · Bistec · Gringas · Costras</p>
          </div>
        </div>
      </section>

      {/* ── BUSCADOR ── */}
      <div className="max-w-2xl mx-auto w-full px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={18} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar en el menú..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-black/10 bg-white text-sm font-medium focus:outline-none focus:ring-2 transition-all"
            style={{ '--tw-ring-color': C.secondary } as React.CSSProperties}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black/60">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORÍAS ── */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0"
              style={{
                backgroundColor: activeCategory === cat.id ? C.secondary : 'white',
                color: activeCategory === cat.id ? 'white' : C.textSecondary,
                border: activeCategory === cat.id ? 'none' : `1px solid #e5e7eb`,
              }}
            >
              <cat.icon size={13} /> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCTOS ── */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-32">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {filteredProducts.slice(0, visibleItems).map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                style={{ backgroundColor: C.cardBg }}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
                  {product.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white" style={{ backgroundColor: C.accent }}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <h3 className="font-bold text-sm leading-tight" style={{ color: C.primary }}>{product.name}</h3>
                  <p className="text-[11px] leading-tight line-clamp-2" style={{ color: C.textSecondary }}>{product.description}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="font-black text-base" style={{ color: C.secondary }}>${product.price} <span className="text-[10px] font-medium text-black/30">MXN</span></span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
                      style={{ backgroundColor: C.secondary }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {visibleItems < filteredProducts.length && (
          <div className="flex justify-center py-8">
            <button
              onClick={() => setVisibleItems(v => v + 12)}
              className="px-8 py-3 rounded-2xl text-white font-bold text-sm transition-all active:scale-95"
              style={{ backgroundColor: C.secondary }}
            >
              Ver más ({filteredProducts.length - visibleItems} productos)
            </button>
          </div>
        )}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Search size={40} className="mx-auto mb-3" style={{ color: C.textSecondary, opacity: 0.3 }} />
            <p className="text-sm font-bold" style={{ color: C.textSecondary, opacity: 0.5 }}>Sin resultados para "{searchQuery}"</p>
          </div>
        )}
      </main>

      {/* ── CARRITO FLOTANTE ── */}
      <AnimatePresence>
        {cart.length > 0 && !isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-50 max-w-2xl mx-auto"
          >
            <button
              onClick={openCart}
              className="w-full py-4 px-5 rounded-2xl text-white font-black text-sm flex items-center justify-between shadow-2xl"
              style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.accent})` }}
            >
              <span className="flex items-center gap-2">
                <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                Ver mi pedido
              </span>
              <span>${cartTotal} MXN →</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER (2 pasos) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
            >
              {/* Header del carrito */}
              <div className="flex items-center justify-between p-4 border-b border-black/5">
                <h2 className="font-black text-lg uppercase tracking-tight" style={{ color: C.primary }}>
                  {cartStep === 1 ? '🛒 Tu Pedido' : cartStep === 2 ? '📋 Tus Datos' : '✅ ¡Listo!'}
                </h2>
                <button onClick={closeCart} className="p-2 rounded-full hover:bg-black/5"><X size={20} /></button>
              </div>

              {/* Paso 1: productos */}
              {cartStep === 1 && (
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingBag size={48} className="mx-auto mb-4 text-black/10" />
                      <p className="text-sm font-medium text-black/30">El carrito está vacío</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-3 py-3 border-b border-black/5">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          <p className="text-xs text-black/40">${item.price} c/u</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => useCartStore.getState().updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center"
                            ><Minus size={12} /></button>
                            <span className="text-sm font-bold">{item.quantity}</span>
                            <button
                              onClick={() => useCartStore.getState().updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center"
                            ><Plus size={12} /></button>
                          </div>
                        </div>
                        <p className="font-black text-sm" style={{ color: C.secondary }}>${item.price * item.quantity}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Paso 2: datos del cliente */}
              {cartStep === 2 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Nombre</label>
                    <input value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })} placeholder="Tu nombre completo" className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">WhatsApp</label>
                    <input value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })} placeholder="55 1234 5678" className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1 focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Método de Entrega</label>
                    <select value={customerInfo.deliveryMethod} onChange={e => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value as 'pickup' | 'delivery' })} className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1">
                      <option value="pickup">Recoger en local</option>
                      <option value="delivery">Envío a domicilio</option>
                    </select>
                  </div>
                  {customerInfo.deliveryMethod === 'delivery' && (
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Dirección</label>
                      <input value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })} placeholder="Calle, número, colonia" className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1 focus:outline-none" />
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Forma de Pago</label>
                    <select value={customerInfo.paymentMethod} onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value as 'cash' | 'transfer' })} className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1">
                      <option value="cash">Efectivo</option>
                      <option value="transfer">Transferencia</option>
                    </select>
                  </div>
                  {customerInfo.paymentMethod === 'cash' && (
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-black/40">¿Con cuánto pagas?</label>
                      <input type="number" value={customerInfo.cashAmount} onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })} placeholder="Ej: 200" className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1 focus:outline-none" />
                      {changeAmount !== null && changeAmount > 0 && <p className="text-xs font-bold text-green-600 mt-1">Tu cambio: ${changeAmount} MXN</p>}
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-black/40">Notas</label>
                    <textarea value={customerInfo.notes} onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })} placeholder="Sin cebolla, extra salsa verde..." className="w-full p-3 rounded-xl border border-black/10 text-sm mt-1 focus:outline-none" rows={2} />
                  </div>
                </div>
              )}

              {/* Paso 3: confirmación */}
              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-black" style={{ color: C.primary }}>¡Pedido enviado!</h3>
                  <p className="text-sm text-black/50 mt-1 leading-relaxed">Abriendo WhatsApp para confirmar con {BUSINESS}…</p>
                </div>
              )}

              {/* Footer del carrito */}
              {cart.length > 0 && cartStep < 3 && (
                <div className="p-4 border-t border-black/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-black/40">{cart.reduce((s, i) => s + i.quantity, 0)} artículos</span>
                    <span className="text-xl font-black" style={{ color: C.secondary }}>${cartTotal} MXN</span>
                  </div>
                  {cartStep === 1 && (
                    <button onClick={() => setCartStep(2)} className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm" style={{ backgroundColor: C.secondary }}>
                      Continuar → Datos de Entrega
                    </button>
                  )}
                  {cartStep === 2 && (
                    <button onClick={handleSendWhatsApp} className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2" style={{ backgroundColor: '#25D366' }}>
                      <MessageCircle size={18} /> Enviar Pedido por WhatsApp
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── TOAST ── */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] px-6 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm whitespace-nowrap"
            style={{ backgroundColor: C.primary }}
          >
            🌮 Agregado — {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER (3 columnas) ── */}
      <footer className="mt-12 border-t border-black/5 bg-white pt-12 pb-0">
        <div className="max-w-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          {/* Col 1: Negocio */}
          <div>
            <h3 className="font-black text-base uppercase tracking-tight mb-2" style={{ color: C.primary }}>{BUSINESS}</h3>
            <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{clientConfig.description}</p>
          </div>
          {/* Col 2: Contacto */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Contacto</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-7 h-7 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0"><MessageCircle size={13} className="text-[#25D366]" /></span>{clientConfig.phoneNumber}</p>
              <p className="flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0"><Mail size={13} /></span>{clientConfig.email}</p>
              <p className="flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0"><MapPin size={13} /></span>{clientConfig.address}</p>
              <p className="flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center shrink-0"><Clock size={13} /></span>{clientConfig.hours}</p>
            </div>
          </div>
          {/* Col 3: Redes */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Síguenos</h4>
            <div className="flex gap-3">
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow hover:scale-110 transition-transform"><Instagram size={18} /></a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow hover:scale-110 transition-transform"><Facebook size={18} /></a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow hover:scale-110 transition-transform"><MessageCircle size={18} /></a>
            </div>
          </div>
        </div>

        {/* Crédito Imagine & Stamp */}
        <div className="py-6" style={{ backgroundColor: C.primary }}>
          <div className="flex flex-col items-center gap-3 text-center px-4">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Taquería El Trompo — Negocio ficticio de demostración.
            </p>
            <motion.a
              href="https://imagineandstamp.site" target="_blank" rel="noreferrer"
              whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Diseñado por</span>
              <span className="text-sm font-black tracking-tight" style={{ color: C.accent }}>IMAGINE &amp; STAMP</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: C.accent }} />
            </motion.a>
            <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              <Shield size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ── AVISO DE PRIVACIDAD ── */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a1a1a] border-2 rounded-3xl shadow-2xl overflow-hidden"
              style={{ borderColor: C.secondary }}
            >
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${C.secondary}, ${C.accent})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}30` }}><Shield size={20} style={{ color: C.secondary }} /></div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-3 text-sm text-white/70 leading-relaxed">
                  <p>En <strong className="text-white">{BUSINESS}</strong> protegemos y respetamos tu privacidad. La información personal que compartes se utiliza exclusivamente para procesar tus pedidos.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} style={{ color: C.secondary }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity" style={{ backgroundColor: C.secondary }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
