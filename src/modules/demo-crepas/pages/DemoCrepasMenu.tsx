// ═══════════════════════════════════════════════════════════════════════════
// LA CRÊPE DORÉE — Crêpes Dulces & Saladas · Estilo Café/Patisserie Francés
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Croissant, UtensilsCrossed, Coffee,
  LayoutGrid, Sparkles, Phone, MapPin, Clock, Flame,
  Instagram, Facebook, MessageCircle, ArrowUp, Shield, ExternalLink,
  Copy, Check, Trash2, Landmark, Wallet, Store, Bike,
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;
const HERO_IMG = 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=1920&q=80';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=70';

// ── Interfaz ──
type CategoryId = 'dulces' | 'saladas' | 'bebidas';

interface Product {
  id: string; name: string; description: string; price: number;
  category: CategoryId; image: string; badge?: string; featured?: boolean;
}
interface CartItem {
  lineId: string; name: string; unitPrice: number; quantity: number; image: string; category: CategoryId;
}

const PRODUCTS: Product[] = [
  // ── DULCES ──
  { id: 'nutella', name: 'Nutella Clásica', description: 'Nutella, fresa fresca, plátano y nuez tostada. La favorita de todos.', price: 85, category: 'dulces', image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=70', badge: 'Más Pedida', featured: true },
  { id: 'frutos-rojos', name: 'Frutos Rojos', description: 'Fresas, zarzamora y arándanos con crema de vainilla y coulis de frutos rojos.', price: 95, category: 'dulces', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=70', featured: true },
  { id: 'dulce-leche', name: 'Dulce de Leche', description: 'Cajeta artesanal, nuez y plátano, espolvoreada con azúcar glass.', price: 80, category: 'dulces', image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=70' },
  { id: 'azucar-limon', name: 'Azúcar & Limón', description: 'La clásica francesa: mantequilla, azúcar y un toque de limón.', price: 55, category: 'dulces', image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=70' },
  { id: 'suzette', name: 'Crêpe Suzette', description: 'Mantequilla, naranja flambeada y toque de Grand Marnier.', price: 110, category: 'dulces', image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=800&q=70', badge: 'Clásica' },
  { id: 'choco-banana', name: 'Choco-Banana', description: 'Chocolate belga, plátano, crema batida y chispas de chocolate.', price: 90, category: 'dulces', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=70' },
  { id: 'pay-manzana', name: 'Pay de Manzana', description: 'Manzana caramelizada, canela, nuez y crema pastelera.', price: 95, category: 'dulces', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=70' },
  { id: 'fresas-crema', name: 'Fresas con Crema', description: 'Fresas frescas, crema chantilly y azúcar glass.', price: 85, category: 'dulces', image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=800&q=70' },

  // ── SALADAS ──
  { id: 'jamon-queso', name: 'Jamón & Queso', description: 'Jamón de pavo, queso manchego y crema. La clásica salada.', price: 90, category: 'saladas', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=70', featured: true },
  { id: 'pollo-champ', name: 'Pollo & Champiñones', description: 'Pollo a la plancha, champiñones salteados, queso y crema.', price: 105, category: 'saladas', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=70', badge: 'Más Pedida' },
  { id: 'hawaiana', name: 'Hawaiana', description: 'Jamón, piña asada y queso gratinado.', price: 95, category: 'saladas', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=70' },
  { id: 'mexicana', name: 'Mexicana', description: 'Chorizo, queso, pico de gallo y aguacate.', price: 100, category: 'saladas', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=70', badge: 'Picante' },
  { id: 'espinaca-queso', name: 'Espinaca & Queso', description: 'Espinaca, queso panela y champiñones. Opción vegetariana.', price: 95, category: 'saladas', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70', badge: 'Veggie' },
  { id: 'philly-steak', name: 'Philly Steak', description: 'Res a las brasas, pimientos, cebolla y queso fundido.', price: 120, category: 'saladas', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=70', badge: 'Nueva' },
  { id: 'caprese', name: 'Caprese', description: 'Tomate, albahaca, mozzarella y reducción balsámica.', price: 98, category: 'saladas', image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=70', badge: 'Veggie' },

  // ── BEBIDAS ──
  { id: 'cafe-olla', name: 'Café de Olla', description: 'Café con canela y piloncillo, servido caliente.', price: 45, category: 'bebidas', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=70' },
  { id: 'chocolate', name: 'Chocolate Caliente', description: 'Chocolate artesanal con leche cremosa.', price: 55, category: 'bebidas', image: 'https://images.unsplash.com/photo-1542990253-a781e04c0082?auto=format&fit=crop&w=800&q=70' },
  { id: 'chai-latte', name: 'Chai Latte', description: 'Té chai especiado con leche cremosa y canela.', price: 58, category: 'bebidas', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=70' },
  { id: 'limonada-fresa', name: 'Limonada de Fresa', description: 'Limonada natural con fresas frescas.', price: 48, category: 'bebidas', image: 'https://images.unsplash.com/photo-1437418747212-8d9709afab22?auto=format&fit=crop&w=800&q=70' },
  { id: 'smoothie', name: 'Smoothie de Frutos Rojos', description: 'Fresa, zarzamora y plátano, sin azúcar añadida.', price: 62, category: 'bebidas', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=70', badge: 'Detox' },
  { id: 'horchata', name: 'Agua de Horchata', description: 'Horchata tradicional, bien fría.', price: 38, category: 'bebidas', image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=800&q=70' },
];

const CATEGORIES: { id: 'all' | CategoryId; name: string; icon: any }[] = [
  { id: 'all', name: 'Todo', icon: LayoutGrid },
  { id: 'dulces', name: 'Dulces', icon: Croissant },
  { id: 'saladas', name: 'Saladas', icon: UtensilsCrossed },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
];

const catAccent = (cat: CategoryId): string => cat === 'dulces' ? C.sweet : cat === 'saladas' ? C.savory : C.secondary;
const badgeColor = (b: string): string => {
  switch (b) {
    case 'Veggie': return C.savory;
    case 'Picante': return '#C0392B';
    case 'Nueva': return C.sweet;
    case 'Detox': return '#0E9F6E';
    default: return C.secondary;
  }
};
const onImgError = (e: any) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK_IMG; };

// ═══════════════════ COMPONENTE ═══════════════════
export default function DemoCrepasMenu() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { const s = localStorage.getItem('crepes_cart'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [activeCategory, setActiveCategory] = useState<'all' | CategoryId>('all');
  const [query, setQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    address: '', paymentMethod: 'cash' as 'cash' | 'transfer', cashAmount: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  useEffect(() => { try { localStorage.setItem('crepes_cart', JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { document.body.style.overflow = isCartOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isCartOpen]);
  useEffect(() => { const cb = () => setScrolled(window.scrollY > 120); window.addEventListener('scroll', cb, { passive: true }); return () => window.removeEventListener('scroll', cb); }, []);
  useEffect(() => { document.title = 'La Crêpe Dorée | Crêpes Dulces & Saladas'; }, []);

  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const filteredProducts = useMemo(() => {
    let r = PRODUCTS;
    if (query.trim()) {
      const q = normalize(query);
      r = r.filter(p => normalize(p.name).includes(q) || normalize(p.description).includes(q) || normalize(p.category).includes(q));
    } else if (activeCategory !== 'all') {
      r = r.filter(p => p.category === activeCategory);
    }
    return r;
  }, [activeCategory, query]);

  const featured = useMemo(() => PRODUCTS.filter(p => p.featured), []);
  const showFeatured = activeCategory === 'all' && !query.trim();

  const handleAdd = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.lineId === product.id);
      if (existing) return prev.map(i => i.lineId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { lineId: product.id, name: product.name, unitPrice: product.price, quantity: 1, image: product.image, category: product.category }];
    });
    setToastMsg(product.name);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleUpdateQty = (lineId: string, d: number) => {
    setCart(prev => prev.map(i => i.lineId === lineId ? { ...i, quantity: Math.max(1, i.quantity + d) } : i).filter(i => i.quantity > 0));
  };
  const handleRemove = (lineId: string) => setCart(prev => prev.filter(i => i.lineId !== lineId));
  const handleClearCart = () => setCart([]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) e.address = 'Dirección requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    const itemsText = cart.map((item, i) => `${i + 1}. ${item.quantity}\u00D7 ${item.name} \u2014 $${item.unitPrice * item.quantity}`).join('\n');
    const deliveryText = customerInfo.deliveryMethod === 'pickup' ? '\uD83D\uDED2 Recoger en local' : `\uD83D\uDEF5 Env\u00EDo a: ${customerInfo.address}`;
    let paymentText = customerInfo.paymentMethod === 'cash' ? '\uD83D\uDCB5 Efectivo' : '\uD83C\uDFE6 Transferencia';
    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) paymentText += ` (cambio: $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)})`;

    const msg = `\uD83E\uDD5E *PEDIDO \u2014 ${clientConfig.businessName.toUpperCase()}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDCCB *Pedido (${totalItems} items):*\n${itemsText}\n\n\uD83D\uDCB5 *Total: $${cartTotal}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDC64 *Cliente:* ${customerInfo.name}\n\uD83D\uDCF1 *WhatsApp:* ${customerInfo.phone}\n${deliveryText}\n${paymentText}${customerInfo.notes ? `\n\uD83D\uDCDD *Notas:* ${customerInfo.notes}` : ''}`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      handleClearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'pickup', address: '', paymentMethod: 'cash', cashAmount: '', notes: '' });
      setIsCartOpen(false);
    }, 500);
  };

  const changeAmount = customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal) : null;

  const handleCopy = async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(field); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  const bankFields = [
    { k: 'bankName', l: 'Banco', v: bankInfo.bankName },
    { k: 'holder', l: 'Titular', v: bankInfo.accountHolder },
    { k: 'clabe', l: 'CLABE', v: bankInfo.clabe },
    { k: 'card', l: 'Tarjeta', v: bankInfo.cardNumber },
  ];

  return (
    <div className="crepes-root min-h-screen flex flex-col" style={{ backgroundColor: C.bg, fontFamily: '"Karla", system-ui, sans-serif', color: C.textPrimary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&family=Karla:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        .crepes-root button, .crepes-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        @keyframes cp-kenburns { 0%{transform:scale(1)} 100%{transform:scale(1.07)} }
        .cp-kenburns { animation: cp-kenburns 20s ease-in-out infinite alternate; }
        @keyframes cp-float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        .cp-float { animation: cp-float 6s ease-in-out infinite; }
        @keyframes cp-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(198,123,61,0.5)} 50%{box-shadow:0 0 0 8px rgba(198,123,61,0)} }
        .cp-pulse { animation: cp-pulse 2s ease-in-out infinite; }
        .cp-display { font-family: "Playfair Display", serif; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 border-b border-amber-100/50" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `conic-gradient(from 210deg, ${C.secondary}, ${C.cream}, ${C.sweet}, ${C.secondary})` }}>
              <Croissant size={18} className="text-white drop-shadow" />
            </div>
            <div className="leading-tight">
              <h1 className="cp-display text-lg tracking-tight font-black" style={{ color: C.primary }}>La Crêpe Dorée</h1>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.secondary }}>Dulces & Saladas</p>
            </div>
          </div>
          <button onClick={() => { setCartStep(1); setIsCartOpen(true); }} className="relative p-2.5 rounded-xl hover:bg-amber-50 transition-colors" style={{ color: C.primary }}>
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1 shadow-md" style={{ backgroundColor: C.secondary }}>
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" style={{ height: 'clamp(360px, 46vh, 500px)' }}>
        <div className="absolute inset-0 cp-kenburns" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(42,27,20,0.88), rgba(42,27,20,0.35) 50%, rgba(42,27,20,0.2))' }} />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-6xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-block self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 mb-3 bg-white/10 backdrop-blur border border-white/15">
            {clientConfig.tagline}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="cp-display text-4xl md:text-6xl text-white leading-none font-black">
            La Crêpe Dorée
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-white/75 text-sm md:text-base mt-2 max-w-md font-light">
            Crêpes artesanales preparadas al momento. Del dulce más goloso al salado más irresistible, con recetas de inspiración francesa.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex gap-2.5 mt-5">
            <button onClick={() => { setActiveCategory('dulces'); setQuery(''); }} className="px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 hover:scale-105 flex items-center gap-1.5" style={{ backgroundColor: C.sweet, boxShadow: `0 10px 30px -8px ${C.sweet}90` }}>
              <Croissant size={14} /> Dulces
            </button>
            <button onClick={() => { setActiveCategory('saladas'); setQuery(''); }} className="px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95 hover:scale-105 flex items-center gap-1.5" style={{ backgroundColor: C.savory, boxShadow: `0 10px 30px -8px ${C.savory}90` }}>
              <UtensilsCrossed size={14} /> Saladas
            </button>
          </motion.div>
        </div>
        {/* Swirl decorativo (crêpe enrollada) */}
        <svg viewBox="0 0 200 200" className="absolute -right-10 -bottom-16 opacity-20 cp-float pointer-events-none hidden md:block" width="220" height="220" fill="none">
          <path d="M100 100m-8 0a8 8 0 1 1 16 0a8 8 0 1 1 -16 0" stroke={C.cream} strokeWidth="3" />
          <path d="M100 100a24 24 0 1 0 0.1 0" stroke={C.cream} strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100a46 46 0 1 0 0.1 0" stroke={C.cream} strokeWidth="3" strokeLinecap="round" />
          <path d="M100 100a68 68 0 1 0 0.1 0" stroke={C.cream} strokeWidth="3" strokeLinecap="round" />
        </svg>
      </section>

      {/* ═══ BÚSQUEDA ═══ */}
      <div className="max-w-6xl mx-auto px-5 -mt-7 relative z-30">
        <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-lg border border-amber-100">
          <Search size={18} style={{ color: C.secondary }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Busca una crêpe, un sabor..." className="bg-transparent border-none focus:outline-none w-full text-sm font-medium text-[16px]" />
          {query && (
            <button onClick={() => setQuery('')} className="p-1.5 rounded-full hover:bg-amber-50 transition-colors"><X size={16} style={{ color: C.textSecondary }} /></button>
          )}
        </div>
      </div>

      {/* ═══ FAVORITOS ═══ */}
      {showFeatured && (
        <section className="max-w-6xl mx-auto px-5 mt-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="cp-pulse w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.sweet})` }}>
              <Flame size={15} />
            </span>
            <h2 className="cp-display text-xl md:text-2xl font-black" style={{ color: C.primary }}>Los Favoritos</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
            {featured.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="shrink-0 w-[240px] rounded-2xl overflow-hidden bg-white border border-amber-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: C.cream }}>
                  <img src={p.image} alt={p.name} loading="lazy" onError={onImgError} className="w-full h-full object-cover" />
                  {p.badge && <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: badgeColor(p.badge) }}>{p.badge}</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm leading-tight" style={{ color: C.primary }}>{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-base" style={{ color: catAccent(p.category) }}>${p.price}</span>
                    <button onClick={() => handleAdd(p)} className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-md" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${catAccent(p.category)})` }}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CATEGORÍAS ═══ */}
      <div className="sticky top-[64px] z-40 backdrop-blur-xl bg-white/90 border-b border-amber-100/50 py-3">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat.id;
              const accent = cat.id === 'all' ? C.primary : catAccent(cat.id as CategoryId);
              return (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setQuery(''); }} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 active:scale-95"
                  style={{
                    backgroundColor: active ? accent : 'white',
                    color: active ? 'white' : C.textSecondary,
                    border: active ? '2px solid transparent' : '2px solid #e7ddd0',
                    boxShadow: active ? `0 8px 24px -8px ${accent}90` : 'none',
                  }}>
                  <cat.icon size={13} /> {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ PRODUCTOS ═══ */}
      <main className="flex-1 max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => {
              const accent = catAccent(product.category);
              return (
                <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="rounded-2xl overflow-hidden bg-white border border-amber-100/60 transition-all duration-300 hover:-translate-y-1"
                  style={{ boxShadow: `0 4px 24px -6px ${accent}14, 0 1px 3px rgba(0,0,0,0.04)` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: C.cream }}>
                    <img src={product.image} alt={product.name} loading="lazy" onError={onImgError} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    {product.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: badgeColor(product.badge) }}>
                        {product.badge}
                      </span>
                    )}
                    <button onClick={() => handleAdd(product)} className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${C.secondary}, ${accent})`, boxShadow: `0 6px 20px -4px ${accent}60` }}>
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base leading-tight" style={{ color: C.primary }}>{product.name}</h3>
                    <p className="text-xs leading-relaxed mt-1.5 line-clamp-2" style={{ color: C.textSecondary }}>{product.description}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100/60">
                      <span className="font-extrabold text-lg" style={{ color: accent }}>${product.price}</span>
                      <button onClick={() => handleAdd(product)} className="text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform flex items-center gap-1" style={{ color: accent }}>
                        <Plus size={14} /> Agregar
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Search size={32} className="mx-auto mb-3" style={{ color: `${C.secondary}40` }} />
            <p className="font-semibold" style={{ color: C.textSecondary }}>No encontramos "{(query || activeCategory)}". Prueba con otra búsqueda.</p>
          </div>
        )}
      </main>

      {/* ═══ CART DRAWER ═══ */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-amber-100 shrink-0" style={{ backgroundColor: C.primary }}>
                <div className="flex items-center gap-2.5">
                  <Croissant size={18} className="text-white" />
                  <h2 className="cp-display font-bold text-sm tracking-wide text-white">
                    {cartStep === 1 ? 'Tu Pedido' : cartStep === 2 ? 'Tus Datos' : '¡Listo!'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X size={16} className="text-white" /></button>
              </div>

              {cartStep === 1 && (<>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: C.cream }}><Croissant size={28} style={{ color: C.secondary }} /></div>
                      <p className="font-bold text-sm" style={{ color: C.textSecondary }}>Tu pedido está vacío</p>
                      <p className="text-xs mt-1" style={{ color: `${C.textSecondary}90` }}>Explora crêpes dulces y saladas</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.lineId} className="flex gap-3 py-3 border-b border-amber-50">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: C.cream }}><img src={item.image} alt="" onError={onImgError} className="w-full h-full object-cover" loading="lazy" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: C.primary }}>{item.name}</p>
                          <p className="text-xs" style={{ color: C.textSecondary }}>${item.unitPrice} c/u</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => handleUpdateQty(item.lineId, -1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90"><Minus size={11} className="text-zinc-400" /></button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.lineId, 1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90"><Plus size={11} className="text-zinc-400" /></button>
                            <button onClick={() => handleRemove(item.lineId)} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} className="text-zinc-300 hover:text-red-400" /></button>
                          </div>
                        </div>
                        <p className="font-bold text-sm shrink-0" style={{ color: C.primary }}>${item.unitPrice * item.quantity}</p>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="px-5 py-4 border-t border-amber-100 bg-white shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold" style={{ color: C.textSecondary }}>{totalItems} items</span>
                      <span className="text-xl font-extrabold" style={{ color: C.secondary }}>${cartTotal}</span>
                    </div>
                    <button onClick={() => setCartStep(2)} className="w-full py-3.5 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.sweet})`, boxShadow: `0 10px 30px -8px ${C.secondary}60` }}>
                      Continuar → Datos de Entrega
                    </button>
                  </div>
                )}
              </>)}

              {cartStep === 2 && (<>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Nombre</label>
                    <input value={customerInfo.name} onChange={e => { setCustomerInfo({ ...customerInfo, name: e.target.value }); setErrors({ ...errors, name: '' }); }} placeholder="Tu nombre" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.name ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`} />
                    {errors.name && <p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.name}</p>}
                  </div>
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>WhatsApp</label>
                    <input value={customerInfo.phone} onChange={e => { setCustomerInfo({ ...customerInfo, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }} placeholder="55 1234 5678" type="tel" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.phone ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`} />
                    {errors.phone && <p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.phone}</p>}
                  </div>
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Entrega</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[{ v: 'pickup', l: 'Recoger en local', i: Store }, { v: 'delivery', l: 'Domicilio', i: Bike }].map(o => (
                        <button key={o.v} onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: o.v as any })} className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          style={{ borderColor: customerInfo.deliveryMethod === o.v ? C.secondary : '#e5e7eb', backgroundColor: customerInfo.deliveryMethod === o.v ? `${C.secondary}10` : 'white', color: customerInfo.deliveryMethod === o.v ? C.secondary : C.textSecondary }}>
                          <o.i size={14} /> {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {customerInfo.deliveryMethod === 'delivery' && (
                    <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Dirección</label>
                      <input value={customerInfo.address} onChange={e => { setCustomerInfo({ ...customerInfo, address: e.target.value }); setErrors({ ...errors, address: '' }); }} placeholder="Calle, número, colonia, CP" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.address ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`} />
                      {errors.address && <p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.address}</p>}
                    </div>
                  )}
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[{ v: 'cash', l: 'Efectivo', i: Wallet }, { v: 'transfer', l: 'Transferencia', i: Landmark }].map(o => (
                        <button key={o.v} onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: o.v as any })} className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          style={{ borderColor: customerInfo.paymentMethod === o.v ? C.secondary : '#e5e7eb', backgroundColor: customerInfo.paymentMethod === o.v ? `${C.secondary}10` : 'white', color: customerInfo.paymentMethod === o.v ? C.secondary : C.textSecondary }}>
                          <o.i size={14} /> {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {customerInfo.paymentMethod === 'cash' && (
                    <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>¿Con cuánto pagas?</label>
                      <input type="number" value={customerInfo.cashAmount} onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })} placeholder="Ej: 200" className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px]" />
                      {changeAmount !== null && changeAmount >= 0 && <p className="text-xs font-bold mt-1" style={{ color: C.secondary }}>Tu cambio: ${changeAmount}</p>}
                    </div>
                  )}
                  {customerInfo.paymentMethod === 'transfer' && (
                    <div className="rounded-2xl border-2 p-4 space-y-3" style={{ borderColor: `${C.secondary}40`, backgroundColor: `${C.secondary}05` }}>
                      <div className="flex items-center gap-2"><Landmark size={15} style={{ color: C.secondary }} /><span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: C.secondary }}>Datos Bancarios</span></div>
                      {bankFields.map(f => (
                        <div key={f.k} className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-100">
                          <div><p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>{f.l}</p><p className="text-sm font-bold mt-0.5" style={{ color: C.primary }}>{f.v}</p></div>
                          <button onClick={() => handleCopy(f.v.replace(/\s/g, ''), f.k)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-50 transition-colors active:scale-90" style={{ backgroundColor: `${C.secondary}10` }}>{copied === f.k ? <Check size={13} className="text-green-500" /> : <Copy size={13} style={{ color: C.secondary }} />}</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Notas para la cocina</label>
                    <textarea value={customerInfo.notes} onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })} placeholder="Sin cebolla, extra nutella..." rows={2} className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px] resize-none" />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-amber-100 bg-white shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <button onClick={() => setCartStep(1)} className="text-xs font-semibold transition-colors" style={{ color: C.textSecondary }}>← Volver al carrito</button>
                    <span className="text-xl font-extrabold" style={{ color: C.secondary }}>${cartTotal}</span>
                  </div>
                  <button onClick={handleSend} className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
                    style={{ backgroundColor: '#25D366', boxShadow: '0 10px 30px -8px #25D36660' }}>
                    <MessageCircle size={18} /> Enviar Pedido por WhatsApp
                  </button>
                </div>
              </>)}

              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }} className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.sweet})` }}>
                    <Check size={44} className="text-white" />
                  </motion.div>
                  <h3 className="cp-display text-2xl font-bold" style={{ color: C.primary }}>¡Pedido Enviado!</h3>
                  <p className="text-sm mt-2 leading-relaxed max-w-xs" style={{ color: C.textSecondary }}>Te estamos redirigiendo a WhatsApp para confirmar tu pedido con {clientConfig.businessName}.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-8 px-6 py-2.5 rounded-2xl text-sm font-bold border-2 transition-colors active:scale-95" style={{ borderColor: C.secondary, color: C.secondary }}>Volver al menú</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-auto border-t border-amber-100 bg-white pt-10">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(from 210deg, ${C.secondary}, ${C.cream}, ${C.sweet}, ${C.secondary})` }}><Croissant size={16} className="text-white" /></div>
              <h3 className="cp-display font-extrabold text-xl tracking-tight" style={{ color: C.primary }}>La Crêpe Dorée</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{clientConfig.description}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Contacto</h4>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5" style={{ color: C.textSecondary }}><span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${C.secondary}12` }}><Phone size={14} style={{ color: C.secondary }} /></span> {clientConfig.phoneNumber}</p>
              <p className="flex items-center gap-2.5" style={{ color: C.textSecondary }}><span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: '#25D36612' }}><MessageCircle size={14} className="text-green-500" /></span> {clientConfig.phone}</p>
              <p className="flex items-start gap-2.5" style={{ color: C.textSecondary }}><span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.secondary}12` }}><MapPin size={14} style={{ color: C.secondary }} /></span> {clientConfig.address}</p>
              <p className="flex items-start gap-2.5" style={{ color: C.textSecondary }}><span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.secondary}12` }}><Clock size={14} style={{ color: C.secondary }} /></span> {clientConfig.hours}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.textSecondary }}>Síguenos</h4>
            <div className="flex gap-3">
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Instagram size={18} /></a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Facebook size={18} /></a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><MessageCircle size={18} /></a>
            </div>
          </div>
        </div>
        <div className="py-8" style={{ backgroundColor: C.primary }}>
          <div className="flex flex-col items-center gap-4 text-center px-5">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.</p>
            <motion.a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" whileHover={{ scale: 1.03 }} className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Página web realizada por</span>
              <span className="text-sm font-bold tracking-tight group-hover:scale-105 transition-transform" style={{ color: C.secondary }}>IMAGINE & STAMP</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: C.secondary }} />
            </motion.a>
            <div className="w-16 h-px bg-white/10" />
            <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"><Shield size={12} /> Aviso de Privacidad</button>
          </div>
        </div>
      </footer>

      {/* ═══ PRIVACY MODAL ═══ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-[#1a1a1a] border-2 rounded-3xl shadow-2xl overflow-hidden" style={{ borderColor: C.secondary }}>
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${C.secondary}, ${C.sweet})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.secondary}20` }}><Shield size={20} style={{ color: C.secondary }} /></div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>En <strong className="text-white">{clientConfig.businessName}</strong> protegemos y respetamos tu privacidad. Tu información personal se usa exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} className="hover:underline" style={{ color: C.secondary }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.sweet})` }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-2" style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
            <Check size={16} style={{ color: C.cream }} /> ¡Agregado! — {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FLOATING CART ═══ */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.button initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 20 }} onClick={() => { setCartStep(1); setIsCartOpen(true); }}
            className="fixed bottom-6 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl active:scale-95 transition-transform"
            style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow: `0 12px 40px -6px ${C.primary}80`, marginBottom: 'env(safe-area-inset-bottom, 8px)' }}>
            <div className="relative">
              <ShoppingBag size={18} />
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})` }}>{totalItems}</span>
            </div>
            Ver Pedido · ${cartTotal}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ SCROLL TO TOP ═══ */}
      <AnimatePresence>
        {scrolled && (
          <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-4 z-50 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform bg-white border-2 border-amber-100"
            style={{ marginBottom: 'env(safe-area-inset-bottom, 8px)' }}>
            <ArrowUp size={18} style={{ color: C.secondary }} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
