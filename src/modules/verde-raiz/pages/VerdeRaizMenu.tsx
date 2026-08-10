// ═══════════════════════════════════════════════════════════════════════════
// VERDE RAÍZ — Salad Bar & Healthy Bowls · Estilo Orgánico Minimalista
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, Minus, X, ShoppingBag, Leaf, Salad, GlassWater,
  LayoutGrid, Sparkles, Phone, MapPin, Clock,
  Instagram, Facebook, MessageCircle, ArrowUp, Shield, ExternalLink,
  Copy, Check, Trash2, ChevronRight, Landmark, Wallet, Store, Bike,
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;
const HERO_IMG = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1920&q=80';

// ── Interfaz ──
interface Product {
  id: string; name: string; description: string; price: number;
  category: string; image: string; badge?: string;
}
interface CartItem {
  lineId: string; name: string; unitPrice: number; quantity: number; image: string;
}

const PRODUCTS: Product[] = [
  { id: 'cesar', name: 'César con Pollo al Grill', description: 'Mix de lechugas, crutones artesanales, queso parmesano, pechuga al grill y aderezo césar.', price: 120, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=70', badge: 'Más Pedida' },
  { id: 'mediterranea', name: 'Mediterránea Fresca', description: 'Espinaca baby, aceitunas kalamata, queso feta, tomate cherry, pepino y vinagreta de orégano.', price: 135, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=70' },
  { id: 'keto', name: 'Keto Salvaje', description: 'Base de coliflor, salmón ahumado, aguacate, huevo cocido, semillas de cáñamo y aderezo de cilantro.', price: 150, category: 'bowls', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=70', badge: 'Keto' },
  { id: 'vegan-quinoa', name: 'Vegan Quinoa Bowl', description: 'Quinoa tricolor, garbanzos especiados, camote asado, kale, aguacate y aderezo tahini.', price: 130, category: 'bowls', image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=70', badge: 'Vegano' },
  { id: 'jugo-verde', name: 'Jugo Verde Detox', description: 'Manzana verde, apio, espinaca, piña y un toque de jengibre. Prensado en frío.', price: 45, category: 'bebidas', image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=70', badge: 'Detox' },
  { id: 'jamaica', name: 'Agua de Jamaica & Stevia', description: 'Refrescante agua de flor de jamaica endulzada naturalmente con stevia.', price: 35, category: 'bebidas', image: 'https://images.unsplash.com/photo-1497534547324-0ebb3f052e88?auto=format&fit=crop&w=800&q=70' },
];

const CATEGORIES = [
  { id: 'all', name: 'Todo', icon: LayoutGrid },
  { id: 'ensaladas', name: 'Ensaladas', icon: Salad },
  { id: 'bowls', name: 'Premium Bowls', icon: Sparkles },
  { id: 'bebidas', name: 'Bebidas', icon: GlassWater },
];

// ═══════════════════ COMPONENTE ═══════════════════
export default function VerdeRaizMenu() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { const s = localStorage.getItem('vr_cart'); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [activeCategory, setActiveCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', deliveryMethod: 'pickup' as 'pickup' | 'delivery',
    address: '', paymentMethod: 'cash' as 'cash' | 'transfer', cashAmount: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);

  useEffect(() => { try { localStorage.setItem('vr_cart', JSON.stringify(cart)); } catch {} }, [cart]);
  useEffect(() => { document.body.style.overflow = isCartOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [isCartOpen]);
  useEffect(() => { const cb = () => setScrolled(window.scrollY > 120); window.addEventListener('scroll', cb, { passive: true }); return () => window.removeEventListener('scroll', cb); }, []);
  useEffect(() => { document.title = 'VERDE RAÍZ | Salad Bar & Healthy Bowls'; }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const handleAdd = (product: Product) => {
    setCart(prev => {
      const lineId = product.id;
      const existing = prev.find(i => i.lineId === lineId);
      if (existing) return prev.map(i => i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { lineId, name: product.name, unitPrice: product.price, quantity: 1, image: product.image }];
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
    const e: Record<string,string> = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) e.address = 'Dirección requerida';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    const itemsText = cart.map((item, i) => `${i+1}. ${item.quantity}\u00D7 ${item.name} \u2014 $${item.unitPrice * item.quantity}`).join('\n');
    const deliveryText = customerInfo.deliveryMethod === 'pickup' ? '\uD83D\uDED2 Recoger en local' : `\uD83D\uDEF5 Env\u00EDo a: ${customerInfo.address}`;
    let paymentText = customerInfo.paymentMethod === 'cash' ? '\uD83D\uDCB5 Efectivo' : '\uD83C\uDFE6 Transferencia';
    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) paymentText += ` (cambio: $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)})`;

    const msg = `\uD83E\uDD57 *PEDIDO \u2014 ${clientConfig.businessName.toUpperCase()}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDCCB *Pedido (${totalItems} items):*\n${itemsText}\n\n\uD83D\uDCB5 *Total: $${cartTotal}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDC64 *Cliente:* ${customerInfo.name}\n\uD83D\uDCF1 *WhatsApp:* ${customerInfo.phone}\n${deliveryText}\n${paymentText}${customerInfo.notes ? `\n\uD83D\uDCDD *Notas:* ${customerInfo.notes}` : ''}`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
      handleClearCart();
      setCustomerInfo({ name:'', phone:'', deliveryMethod:'pickup', address:'', paymentMethod:'cash', cashAmount:'', notes:'' });
      setIsCartOpen(false);
    }, 500);
  };

  const changeAmount = customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal) : null;

  const handleCopy = async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(field); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  const bankFields = [
    { k:'bankName', l:'Banco', v:bankInfo.bankName },
    { k:'holder', l:'Titular', v:bankInfo.accountHolder },
    { k:'clabe', l:'CLABE', v:bankInfo.clabe },
    { k:'card', l:'Tarjeta', v:bankInfo.cardNumber },
  ];

  return (
    <div className="verde-root min-h-screen flex flex-col" style={{ backgroundColor: C.bg, fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        .verde-root button, .verde-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        @keyframes vr-kenburns { 0%{transform:scale(1)} 100%{transform:scale(1.06)} }
        .vr-kenburns { animation: vr-kenburns 18s ease-in-out infinite alternate; }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-emerald-100/50" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})` }}>
              <Leaf size={18} className="text-white" />
            </div>
            <h1 className="text-lg tracking-tight" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, color: C.primary }}>
              VERDE RAÍZ
            </h1>
          </div>
          <button onClick={() => { setCartStep(1); setIsCartOpen(true); }} className="relative p-2.5 rounded-xl hover:bg-emerald-50 transition-colors" style={{ color: C.primary }}>
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
      <section className="relative overflow-hidden" style={{ height: 'clamp(340px, 44vh, 480px)' }}>
        <div className="absolute inset-0 vr-kenburns" style={{ backgroundImage: `url(${HERO_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 max-w-6xl mx-auto">
          <motion.span initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="inline-block self-start px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 mb-3 bg-white/10 backdrop-blur border border-white/10">
            {clientConfig.tagline}
          </motion.span>
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="text-4xl md:text-6xl text-white leading-none" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 900 }}>
            VERDE RAÍZ
          </motion.h1>
          <motion.p initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }} className="text-white/70 text-sm md:text-base mt-2 max-w-md font-light">
            Frescura que nutre. Ensaladas, bowls y bebidas preparadas al momento con ingredientes locales.
          </motion.p>
        </div>
      </section>

      {/* ═══ CATEGORÍAS ═══ */}
      <div className="sticky top-[64px] z-40 backdrop-blur-xl bg-white/90 border-b border-emerald-100/50 py-3">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 active:scale-95"
                style={{
                  backgroundColor: activeCategory === cat.id ? C.secondary : 'white',
                  color: activeCategory === cat.id ? 'white' : C.textSecondary,
                  border: activeCategory === cat.id ? '2px solid transparent' : '2px solid #d1d5db',
                }}>
                <cat.icon size={13} /> {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ PRODUCTOS ═══ */}
      <main className="flex-1 max-w-6xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, idx) => (
              <motion.div key={product.id} layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.96 }} transition={{ duration:0.3, delay:idx*0.06 }}
                className="rounded-2xl overflow-hidden bg-white border border-emerald-100/60 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: '0 4px 24px -6px rgba(5,150,105,0.08), 0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                  <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-white shadow-md"
                      style={{ backgroundColor: product.badge === 'Más Pedida' ? C.accent : product.badge === 'Keto' ? C.primary : product.badge === 'Vegano' ? '#16a34a' : C.secondary }}>
                      {product.badge}
                    </span>
                  )}
                  <button onClick={() => handleAdd(product)} className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center text-white active:scale-90 transition-transform shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})`, boxShadow: `0 6px 20px -4px ${C.secondary}60` }}>
                    <Plus size={18} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base leading-tight" style={{ color: C.primary }}>{product.name}</h3>
                  <p className="text-xs leading-relaxed mt-1.5 line-clamp-2" style={{ color: C.textSecondary }}>{product.description}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-emerald-100/60">
                    <span className="font-extrabold text-lg" style={{ color: C.secondary }}>${product.price}</span>
                    <button onClick={() => handleAdd(product)} className="text-[11px] font-bold uppercase tracking-wider active:scale-95 transition-transform flex items-center gap-1" style={{ color: C.secondary }}>
                      <Plus size={14} /> Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredProducts.length === 0 && (
          <div className="text-center py-20"><p className="text-emerald-300 font-semibold">No hay productos en esta categoría.</p></div>
        )}
      </main>

      {/* ═══ CART DRAWER ═══ */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]" />
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:25, stiffness:300 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col" style={{ paddingBottom:'env(safe-area-inset-bottom, 0px)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-100 shrink-0" style={{ backgroundColor: C.primary }}>
                <div className="flex items-center gap-2.5">
                  <Leaf size={18} className="text-white" />
                  <h2 className="font-bold text-sm tracking-wide text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                    {cartStep===1 ? 'Tu Pedido' : cartStep===2 ? 'Tus Datos' : '¡Listo!'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><X size={16} className="text-white" /></button>
              </div>

              {/* Paso 1: Items */}
              {cartStep === 1 && (<>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-3"><Leaf size={28} className="text-emerald-300" /></div>
                      <p className="font-bold text-sm text-zinc-400">Tu pedido está vacío</p>
                      <p className="text-xs text-zinc-300 mt-1">Explora ensaladas, bowls y bebidas</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.lineId} className="flex gap-3 py-3 border-b border-emerald-50">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-emerald-50"><img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color:C.primary }}>{item.name}</p>
                          <p className="text-xs text-zinc-400">${item.unitPrice} c/u</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <button onClick={() => handleUpdateQty(item.lineId, -1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90"><Minus size={11} className="text-zinc-400" /></button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.lineId, 1)} className="w-6 h-6 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90"><Plus size={11} className="text-zinc-400" /></button>
                            <button onClick={() => handleRemove(item.lineId)} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50"><Trash2 size={12} className="text-zinc-300 hover:text-red-400" /></button>
                          </div>
                        </div>
                        <p className="font-bold text-sm shrink-0" style={{ color:C.primary }}>${item.unitPrice * item.quantity}</p>
                      </div>
                    ))
                  )}
                </div>
                {cart.length > 0 && (
                  <div className="px-5 py-4 border-t border-emerald-100 bg-white shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-zinc-400">{totalItems} items</span>
                      <span className="text-xl font-extrabold" style={{ color:C.secondary }}>${cartTotal}</span>
                    </div>
                    <button onClick={() => setCartStep(2)} className="w-full py-3.5 rounded-2xl text-white font-bold text-sm active:scale-[0.98] transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})`, boxShadow: `0 10px 30px -8px ${C.secondary}60` }}>
                      Continuar → Datos de Entrega
                    </button>
                  </div>
                )}
              </>)}

              {/* Paso 2: Datos */}
              {cartStep === 2 && (<>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5">
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Nombre</label>
                    <input value={customerInfo.name} onChange={e=>{setCustomerInfo({...customerInfo,name:e.target.value});setErrors({...errors,name:''});}} placeholder="Tu nombre" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.name?'border-red-400 bg-red-50':'border-zinc-200'}`} />
                    {errors.name && <p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.name}</p>}
                  </div>
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">WhatsApp</label>
                    <input value={customerInfo.phone} onChange={e=>{setCustomerInfo({...customerInfo,phone:e.target.value});setErrors({...errors,phone:''});}} placeholder="55 1234 5678" type="tel" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.phone?'border-red-400 bg-red-50':'border-zinc-200'}`} />
                    {errors.phone && <p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.phone}</p>}
                  </div>
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Entrega</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[{v:'pickup',l:'Recoger en local',i:Store},{v:'delivery',l:'Domicilio',i:Bike}].map(o=>(
                        <button key={o.v} onClick={()=>setCustomerInfo({...customerInfo,deliveryMethod:o.v as any})} className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          style={{ borderColor:customerInfo.deliveryMethod===o.v?C.secondary:'#e5e7eb', backgroundColor:customerInfo.deliveryMethod===o.v?`${C.secondary}10`:'white', color:customerInfo.deliveryMethod===o.v?C.secondary:C.textSecondary }}>
                          <o.i size={14}/> {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {customerInfo.deliveryMethod==='delivery'&&(
                    <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Dirección</label>
                      <input value={customerInfo.address} onChange={e=>{setCustomerInfo({...customerInfo,address:e.target.value});setErrors({...errors,address:''});}} placeholder="Calle, número, colonia, CP" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] ${errors.address?'border-red-400 bg-red-50':'border-zinc-200'}`} />
                      {errors.address&&<p className="text-[11px] text-red-500 font-semibold mt-0.5">{errors.address}</p>}
                    </div>
                  )}
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[{v:'cash',l:'Efectivo',i:Wallet},{v:'transfer',l:'Transferencia',i:Landmark}].map(o=>(
                        <button key={o.v} onClick={()=>setCustomerInfo({...customerInfo,paymentMethod:o.v as any})} className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          style={{ borderColor:customerInfo.paymentMethod===o.v?C.secondary:'#e5e7eb', backgroundColor:customerInfo.paymentMethod===o.v?`${C.secondary}10`:'white', color:customerInfo.paymentMethod===o.v?C.secondary:C.textSecondary }}>
                          <o.i size={14}/> {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {customerInfo.paymentMethod==='cash'&&(
                    <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">¿Con cuánto pagas?</label>
                      <input type="number" value={customerInfo.cashAmount} onChange={e=>setCustomerInfo({...customerInfo,cashAmount:e.target.value})} placeholder="Ej: 200" className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px]" />
                      {changeAmount!==null&&changeAmount>=0&&<p className="text-xs font-bold mt-1" style={{color:C.secondary}}>Tu cambio: ${changeAmount}</p>}
                    </div>
                  )}
                  {customerInfo.paymentMethod==='transfer'&&(
                    <div className="rounded-2xl border-2 p-4 space-y-3" style={{ borderColor:`${C.accent}40`, backgroundColor:`${C.secondary}05` }}>
                      <div className="flex items-center gap-2"><Landmark size={15} style={{color:C.accent}}/><span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{color:C.accent}}>Datos Bancarios</span></div>
                      {bankFields.map(f=>(
                        <div key={f.k} className="flex items-center justify-between bg-white rounded-xl p-3 border border-emerald-100">
                          <div><p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">{f.l}</p><p className="text-sm font-bold mt-0.5" style={{color:C.primary}}>{f.v}</p></div>
                          <button onClick={()=>handleCopy(f.v.replace(/\s/g,''),f.k)} className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors active:scale-90">{copied===f.k?<Check size={13} className="text-green-500"/>:<Copy size={13} style={{color:C.secondary}}/>}</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div><label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Notas para la cocina</label>
                    <textarea value={customerInfo.notes} onChange={e=>setCustomerInfo({...customerInfo,notes:e.target.value})} placeholder="Sin cebolla, extra aderezo..." rows={2} className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px] resize-none" />
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-emerald-100 bg-white shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <button onClick={() => setCartStep(1)} className="text-xs font-semibold text-zinc-400 hover:text-zinc-600">← Volver al carrito</button>
                    <span className="text-xl font-extrabold" style={{color:C.secondary}}>${cartTotal}</span>
                  </div>
                  <button onClick={handleSend} className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
                    style={{ backgroundColor:'#25D366', boxShadow:'0 10px 30px -8px #25D36660' }}>
                    <MessageCircle size={18} /> Enviar Pedido por WhatsApp
                  </button>
                </div>
              </>)}

              {/* Paso 3: Éxito */}
              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <motion.div initial={{scale:0,rotate:-30}} animate={{scale:1,rotate:0}} transition={{type:'spring',damping:12,stiffness:200}} className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <Check size={44} className="text-emerald-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold" style={{color:C.primary}}>¡Pedido Enviado!</h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-xs">Te estamos redirigiendo a WhatsApp para confirmar tu pedido con {clientConfig.businessName}.</p>
                  <button onClick={() => setIsCartOpen(false)} className="mt-8 px-6 py-2.5 rounded-2xl text-sm font-bold border-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-colors active:scale-95">Volver al menú</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-auto border-t border-emerald-100 bg-white pt-10">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 pb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${C.secondary}, ${C.primary})` }}><Leaf size={16} className="text-white"/></div>
              <h3 className="font-extrabold text-xl tracking-tight" style={{ fontFamily:'"Playfair Display",serif', color:C.primary }}>VERDE RAÍZ</h3>
            </div>
            <p className="text-sm leading-relaxed" style={{ color:C.textSecondary }}>{clientConfig.description}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color:C.textSecondary }}>Contacto</h4>
            <div className="space-y-2.5 text-sm">
              <p className="flex items-center gap-2.5" style={{color:C.textSecondary}}><span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><Phone size={14} style={{color:C.secondary}}/></span> {clientConfig.phoneNumber}</p>
              <p className="flex items-center gap-2.5" style={{color:C.textSecondary}}><span className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0"><MessageCircle size={14} className="text-green-500"/></span> {clientConfig.phone}</p>
              <p className="flex items-start gap-2.5" style={{color:C.textSecondary}}><span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><MapPin size={14} style={{color:C.secondary}}/></span> {clientConfig.address}</p>
              <p className="flex items-start gap-2.5" style={{color:C.textSecondary}}><span className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5"><Clock size={14} style={{color:C.secondary}}/></span> {clientConfig.hours}</p>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{color:C.textSecondary}}>Síguenos</h4>
            <div className="flex gap-3">
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Instagram size={18}/></a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Facebook size={18}/></a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><MessageCircle size={18}/></a>
            </div>
          </div>
        </div>
        <div className="py-8" style={{ backgroundColor: C.primary }}>
          <div className="flex flex-col items-center gap-4 text-center px-5">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">© {new Date().getFullYear()} {clientConfig.businessName.toUpperCase()}. TODOS LOS DERECHOS RESERVADOS.</p>
            <motion.a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" whileHover={{scale:1.03}} className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-400/40 transition-all">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Página web realizada por</span>
              <span className="text-sm font-bold tracking-tight group-hover:scale-105 transition-transform" style={{color:C.secondary}}>IMAGINE & STAMP</span>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" style={{color:C.secondary}}/>
            </motion.a>
            <div className="w-16 h-px bg-white/10"/>
            <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"><Shield size={12}/> Aviso de Privacidad</button>
          </div>
        </div>
      </footer>

      {/* ═══ PRIVACY MODAL ═══ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm"/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} className="relative w-full max-w-lg bg-[#1a1a1a] border-2 rounded-3xl shadow-2xl overflow-hidden" style={{borderColor:C.secondary}}>
              <div className="h-1.5" style={{background:`linear-gradient(to right,${C.secondary},${C.primary})`}}/>
              <div className="p-8">
                <button onClick={()=>setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"><X size={18}/></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{backgroundColor:`${C.secondary}20`}}><Shield size={20} style={{color:C.secondary}}/></div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>En <strong className="text-white">{clientConfig.businessName}</strong> protegemos y respetamos tu privacidad. Tu información personal se usa exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu información con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} className="hover:underline" style={{color:C.secondary}}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={()=>setIsPrivacyOpen(false)} className="mt-8 w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity active:scale-95" style={{background:`linear-gradient(135deg,${C.secondary},${C.primary})`}}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} exit={{opacity:0,y:50}} className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-2" style={{background:`linear-gradient(135deg,${C.primary},${C.secondary})`}}>
            <Check size={16} style={{color:C.accent}}/> ¡Agregado! — {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ FLOATING CART ═══ */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.button initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:100,opacity:0}} transition={{type:'spring',damping:20}} onClick={()=>{setCartStep(1);setIsCartOpen(true);}}
            className="fixed bottom-6 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl text-white font-bold text-sm shadow-2xl active:scale-95 transition-transform"
            style={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, boxShadow:`0 12px 40px -6px ${C.primary}80`, marginBottom:'env(safe-area-inset-bottom,8px)' }}>
            <div className="relative">
              <ShoppingBag size={18}/>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-md" style={{background:`linear-gradient(135deg,${C.secondary},${C.primary})`}}>{totalItems}</span>
            </div>
            Ver Pedido · ${cartTotal}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ SCROLL TO TOP ═══ */}
      <AnimatePresence>
        {scrolled && (
          <motion.button initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0}} onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}
            className="fixed bottom-6 left-4 z-50 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform bg-white border-2 border-emerald-100"
            style={{marginBottom:'env(safe-area-inset-bottom,8px)'}}>
            <ArrowUp size={18} style={{color:C.secondary}}/>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
