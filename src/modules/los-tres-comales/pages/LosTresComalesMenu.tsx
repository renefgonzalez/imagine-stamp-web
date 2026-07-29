import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Plus, Minus, X, Search, Phone, MapPin,
  MessageCircle, Clock, AlertCircle, CreditCard, ChefHat,
  Coffee, UtensilsCrossed, Flame, Sparkles, ArrowRight, Check,
  ShoppingBag, User, Wallet, Landmark
} from 'lucide-react';
import { clientConfig } from '../config';
import logoImg from '../assets/logo.png';

// ═══════════════════ TYPES ═══════════════════
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
  image?: string;
}
interface CartItem extends MenuItem { quantity: number; }
interface CustomerInfo {
  name: string;
  phone: string;
  deliveryMethod: 'recoger' | 'domicilio';
  address: string;
  paymentMethod: 'efectivo' | 'transferencia';
  cashAmount: string;
  notes: string;
  salsas: string[];
}

// ═══════════════════ MENU DATA ═══════════════════
const CATEGORIES = [
  { id: 'all', name: 'Todo el Menú', icon: Flame },
  { id: 'platillos', name: 'Platillos del Día', icon: UtensilsCrossed },
  { id: 'antojitos', name: 'Antojitos', icon: ChefHat },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
];

const imgTaco = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80';
const imgCarne = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80';
const imgAntojito = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80';
const imgCoffee = 'https://images.unsplash.com/photo-1582221665046-2b474cbdd3d7?w=500&q=80';
const imgDrink = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80';

const MENU: MenuItem[] = [
  { id: '1', name: 'Tacos Dorados de Papa', price: 55, category: 'platillos', badge: 'Menú del Día', image: imgTaco },
  { id: '2', name: 'Bistec con Nopales', price: 85, category: 'platillos', image: imgCarne },
  { id: '3', name: 'Tortitas de Camarón', price: 90, category: 'platillos', image: imgAntojito },
  { id: '4', name: 'Carne Asada', price: 95, category: 'platillos', image: imgCarne },
  { id: '5', name: 'Enchiladas Verdes', price: 75, category: 'platillos', image: imgAntojito },
  { id: '6', name: 'Arrachera', price: 110, category: 'platillos', image: imgCarne },
  { id: '7', name: 'Pechuga Asada', price: 90, category: 'platillos', image: imgCarne },
  { id: '8', name: 'Milanesa de Pollo o de Res', price: 85, category: 'platillos', image: imgCarne },
  { id: '9', name: 'Flautas', price: 65, category: 'platillos', image: imgTaco },
  { id: '10', name: 'Ensalada de Pollo', price: 70, category: 'platillos', image: imgAntojito },
  { id: '11', name: 'Ensalada de Atún', price: 70, category: 'platillos', image: imgAntojito },
  { id: '12', name: 'Ensalada de Carne', price: 75, category: 'platillos', image: imgCarne },
  { id: '13', name: 'Chilaquiles Rojos con Huevo', price: 75, category: 'platillos', image: imgAntojito },
  { id: '14', name: 'Chilaquiles Verdes con Pollo', price: 80, category: 'platillos', image: imgAntojito },
  { id: '15', name: 'Chilaquiles con Arrachera', price: 110, category: 'platillos', image: imgCarne },
  { id: '16', name: 'Chilaquiles con Asada', price: 95, category: 'platillos', image: imgCarne },
  { id: '17', name: 'Tacos de Guisado', price: 50, category: 'antojitos', image: imgTaco },
  { id: '18', name: 'Gorditas', price: 55, category: 'antojitos', image: imgTaco },
  { id: '19', name: 'Huaraches y Sopes', price: 60, category: 'antojitos', image: imgAntojito },
  { id: '20', name: 'Café de Olla', price: 35, category: 'bebidas', badge: 'Tradicional', image: imgCoffee },
  { id: '21', name: 'Refrescos', price: 25, category: 'bebidas', image: imgDrink },
  { id: '22', name: 'Aguas Frescas', price: 30, category: 'bebidas', image: imgDrink },
];

// ═══════════════════ COLORS ═══════════════════
const C = { bg: '#0a0a0a', card: '#141414', cardHover: '#1c1c1c', gold: '#D4A017', red: '#B7410E', text: '#ffffff', textDim: '#9e9e9e', border: '#222222' };

// ═══════════════════ COMPONENT ═══════════════════
export default function LosTresComalesMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('platillos');
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '', deliveryMethod: 'recoger', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] });
  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  const filtered = useMemo(() => {
    let r = MENU;
    if (search.trim()) { const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); r = r.filter(p => p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q)); }
    else if (activeCat !== 'all') r = r.filter(p => p.category === activeCat);
    return r;
  }, [search, activeCat]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (item: MenuItem) => { setCart(prev => { const exist = prev.find(i => i.id === item.id); if (exist) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i); return [...prev, { ...item, quantity: 1 }]; }); setToast(item.name); setTimeout(() => setToast(''), 2000); };

  const updateQty = (id: string, qty: number) => { if (qty < 1) setCart(prev => prev.filter(i => i.id !== id)); else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i)); };

  const sendWhatsApp = () => {
    if (!customer.name || !customer.phone || (customer.deliveryMethod === 'domicilio' && !customer.address)) {
      setErrors({ name: !customer.name, phone: !customer.phone, address: customer.deliveryMethod === 'domicilio' && !customer.address });
      return;
    }
    const items = cart.map((p, idx) => `${idx + 1}. ${p.name} x${p.quantity} — $${p.price * p.quantity}`).join('\n');
    let msg = `🔥 *LOS TRES COMALES — Pedido*\n\n*Cliente:* ${customer.name}\n*WhatsApp:* ${customer.phone}\n*Entrega:* ${customer.deliveryMethod === 'recoger' ? 'Paso a recoger' : 'Envío a domicilio'}`;
    if (customer.deliveryMethod === 'domicilio') msg += `\n*Dirección:* ${customer.address}`;
    msg += `\n*Pago:* ${customer.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}`;
    if (customer.paymentMethod === 'efectivo' && customer.cashAmount) msg += ` (Paga con $${customer.cashAmount})`;
    if (customer.salsas.length > 0) msg += `\n*Salsas:* ${customer.salsas.join(', ')}`;
    msg += `\n*Notas:* ${customer.notes || 'Ninguna'}\n\n${items}\n\n💰 *Total: $${total} MXN*`;
    setStep('success');
    setTimeout(() => { window.location.href = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`; setCart([]); setCustomer({ name: '', phone: '', deliveryMethod: 'recoger', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] }); setStep('cart'); setIsOpen(false); }, 1500);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-zinc-900 to-black" style={{ color: C.text }}>
      {/* ═══ AMBIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #F5C51855 0%, transparent 50%), radial-gradient(circle at 70% 80%, #C5282844 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff05 2px, #ffffff05 4px)' }} />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: '#0a0a0aee', borderColor: C.border }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <img src={logoImg} alt="Logo" className="h-24 md:h-28 w-auto object-contain shrink-0 drop-shadow-md" />
            <div className="min-w-0">
              <h1 className="text-base md:text-xl font-black tracking-tight truncate" style={{ color: C.gold }}>{clientConfig.businessName}</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider flex items-center gap-1" style={{ color: C.textDim }}>
                <Clock size={10} /> {clientConfig.hours}
              </p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(true); setStep('cart'); }} className="relative p-2.5 rounded-xl transition-all hover:scale-105" style={{ backgroundColor: C.red }}>
            <ShoppingCart size={20} style={{ color: C.text }} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border-2" style={{ backgroundColor: C.gold, color: C.bg, borderColor: C.bg }}>{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* ═══ HERO ═══ */}
        <div className="relative w-full rounded-[30px] overflow-hidden my-6 shadow-2xl shadow-black/50 border" style={{ borderColor: C.border }}>
          <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80" alt="Cocina mexicana tradicional" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 py-16 md:py-24 text-center px-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-[0.15em] bg-black/40 backdrop-blur-md" style={{ borderColor: `${C.gold}30`, color: C.gold }}>
              <Sparkles size={12} /> Cocina Tradicional Mexicana
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-3 drop-shadow-xl" style={{ color: C.gold }}>Los Tres Comales</h1>
            <p className="text-sm md:text-base max-w-md mx-auto leading-relaxed drop-shadow-md text-white/90">Sabores de hogar servidos con tradición. Platillos del día, antojitos y bebidas preparadas al momento.</p>
            <div className="flex items-center justify-center gap-3 mt-5 text-xs text-white/80 font-medium">
              <span className="flex items-center gap-1"><Clock size={12} /> {clientConfig.hours}</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.gold }} />
              <span className="flex items-center gap-1"><MapPin size={12} /> Querétaro</span>
            </div>
          </motion.div>
        </div>

        {/* ═══ SEARCH ═══ */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.textDim }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar platillo..." className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 transition-all" style={{ backgroundColor: C.card, color: C.text, border: `1px solid ${C.border}`, outline: 'none' }} />
        </div>

        {/* ═══ CATEGORIES ═══ */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setActiveCat(cat.id)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 border" style={{ backgroundColor: activeCat === cat.id ? C.gold : 'transparent', color: activeCat === cat.id ? C.bg : C.textDim, borderColor: activeCat === cat.id ? C.gold : C.border }}>
              <cat.icon size={14} /> {cat.name}
            </button>
          ))}
        </div>

        {/* ═══ MENU GRID ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group rounded-2xl border transition-all duration-300 flex flex-col hover:scale-[1.02] hover:shadow-lg hover:shadow-black/50 overflow-hidden"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                  {item.image && (
                    <div className="w-full h-40 overflow-hidden relative">
                      <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {item.badge && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md" style={{ backgroundColor: `${C.gold}90`, color: '#000' }}>
                        {item.badge}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight" style={{ color: C.text }}>{item.name}</h3>
                      {!item.image && item.badge && (
                        <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${C.gold}20`, color: C.gold }}>{item.badge}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-2">
                    <span className="text-xl font-black tracking-tight" style={{ color: C.gold }}>${item.price}</span>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-red-600 shadow-md shadow-red-900/20"
                      style={{ backgroundColor: C.red, color: C.text }}
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <Search size={40} className="mx-auto mb-3 opacity-10" />
              <p className="text-sm font-medium" style={{ color: C.textDim }}>No encontramos ese platillo</p>
            </div>
          )}
        </div>

        {/* ═══ FOOTER ═══ */}
        <footer className="bg-[#0a0a0a] border-t-4 mt-16 pb-12 pt-16 relative" style={{ borderColor: C.gold }}>
          <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #F5C518 0%, transparent 70%)' }} />
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm relative z-10">
            {/* Col 1 */}
            <div className="text-center md:text-left">
              <img src={logoImg} alt="Los Tres Comales Logo" className="h-32 md:h-40 w-auto object-contain mb-6 mx-auto md:mx-0 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]" />
              <p className="font-medium leading-relaxed" style={{ color: C.textDim }}>
                Sabores de hogar servidos con tradición. Platillos del día, antojitos y bebidas preparadas al momento con ingredientes frescos.
              </p>
            </div>
            
            {/* Col 2 */}
            <div className="text-center">
              <h4 className="font-black uppercase tracking-wider text-sm mb-5" style={{ color: C.gold }}>Contacto y Ubicación</h4>
              <div className="space-y-4 font-medium" style={{ color: C.textDim }}>
                <p className="flex items-center justify-center gap-2">
                  <MapPin size={16} style={{ color: C.gold, flexShrink: 0 }} />
                  <a href="https://maps.app.goo.gl/bSuw4zRaLAUdcnM27" target="_blank" rel="noreferrer" className="hover:text-white transition-colors text-left line-clamp-2">
                    {clientConfig.address}
                  </a>
                </p>
                <div className="flex flex-col items-center justify-center gap-1">
                  <p className="flex items-center justify-center gap-2">
                    <MessageCircle size={16} style={{ color: C.gold }} />
                    <a href={`https://wa.me/${clientConfig.phone}`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                      Pedidos WhatsApp
                    </a>
                  </p>
                  <p className="text-xs mt-2 text-zinc-500 flex flex-col gap-1">
                    <span>Quejas: {clientConfig.complaintPhone1}</span>
                    <span>Quejas: {clientConfig.complaintPhone2}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Col 3 */}
            <div className="text-center md:text-right">
              <h4 className="font-black uppercase tracking-wider text-sm mb-5" style={{ color: C.gold }}>Horarios</h4>
              <div className="space-y-2 font-medium" style={{ color: C.textDim }}>
                <p className="flex items-center justify-center md:justify-end gap-2 text-white">
                  <Clock size={16} style={{ color: C.gold }} />
                  Lunes a Sábado
                </p>
                <p className="text-base font-bold pl-7 md:pl-0 md:pr-7" style={{ color: C.gold }}>{clientConfig.hours}</p>
                <p className="text-xs uppercase tracking-wider font-bold mt-2" style={{ color: C.red }}>Domingo Cerrado</p>
              </div>
            </div>
          </div>
          
          {/* Promoción Ticket Gratis */}
          <div className="max-w-3xl mx-auto mt-12 mb-4 p-4 border rounded-2xl relative overflow-hidden bg-[#0a0a0a] text-center" style={{ borderColor: C.gold }}>
            <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: C.gold }} />
            <p className="font-black uppercase tracking-widest text-sm md:text-base text-white flex items-center justify-center gap-2">
              <AlertCircle size={20} style={{ color: C.gold }} />
              {clientConfig.policy}
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto px-4 mt-8 pt-8 border-t text-center relative z-10" style={{ borderColor: C.border }}>
            <p className="text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2" style={{ color: `${C.textDim}80` }}>
              <span>Página web realizada por</span>
              <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: C.gold }}>IMAGINE & STAMP</a>
            </p>
            <p className="text-[10px] mt-4" style={{ color: `${C.textDim}40` }}>Todos los derechos reservados a Los Tres Comales.</p>
          </div>
        </footer>
      </div>

      {/* ═══ CART DRAWER ═══ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl"
              style={{ backgroundColor: C.card, borderLeft: `4px solid ${C.gold}` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: C.border }}>
                <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-wide" style={{ color: C.gold }}>
                  {step === 'details' ? 'Finalizar Pedido' : step === 'success' ? '¡Listo!' : 'Tu Orden'}
                  <ShoppingBag size={24} style={{ color: C.red }} />
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full transition-colors hover:bg-white/10" style={{ backgroundColor: '#ffffff05', color: C.textDim }}>
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#0a0a0a' }}>
                {cart.length === 0 && step !== 'success' ? (
                  <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg border" style={{ backgroundColor: C.card, borderColor: C.border }}>
                      <ShoppingBag size={40} style={{ color: C.textDim }} />
                    </div>
                    <p className="font-bold text-lg mb-4" style={{ color: C.textDim }}>Aún no hay platillos aquí</p>
                    <button onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-full font-black uppercase text-sm transition-colors hover:bg-white/5" style={{ border: `2px solid ${C.gold}`, color: C.gold }}>Ver menú</button>
                  </div>
                ) : step === 'success' ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2" style={{ backgroundColor: '#22c55e20', borderColor: '#22c55e60' }}>
                      <Check className="w-10 h-10 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-white">¡Pedido Listo!</h3>
                    <p className="text-sm mb-2" style={{ color: C.textDim }}>Redirigiendo a WhatsApp...</p>
                    <p className="text-xs" style={{ color: `${C.textDim}80` }}>Envía el mensaje para confirmar tu pedido.</p>
                  </div>
                ) : step === 'cart' ? (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-3 rounded-2xl border relative group" style={{ backgroundColor: C.card, borderColor: C.border }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} loading="lazy" className="w-20 h-20 rounded-xl object-cover border shrink-0" style={{ borderColor: '#ffffff10' }} />
                        )}
                        <div className="flex-1 py-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-black text-sm leading-tight pr-6 text-white">{item.name}</h4>
                            <p className="font-black text-sm mt-1" style={{ color: C.gold }}>${item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-end mt-2">
                            <div className="flex items-center rounded-lg p-0.5 border" style={{ backgroundColor: '#0a0a0a', borderColor: C.border }}>
                              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 hover:text-white transition-colors" style={{ color: C.textDim }}><Minus size={14} strokeWidth={3} /></button>
                              <span className="font-black text-sm w-8 text-center text-white">{item.quantity}</span>
                              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 hover:text-white transition-colors" style={{ color: C.textDim }}><Plus size={14} strokeWidth={3} /></button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => updateQty(item.id, 0)} className="absolute top-3 right-3 p-1 rounded-full transition-colors hover:bg-white/10 hover:text-red-500" style={{ backgroundColor: '#ffffff05', color: C.textDim }}><X size={16} strokeWidth={3} /></button>
                      </div>
                    ))}
                    
                    {/* Salsas Selection */}
                    <div className="mt-6 p-4 rounded-2xl border shadow-sm" style={{ backgroundColor: C.card, borderColor: C.border }}>
                      <h3 className="font-black mb-3 text-sm uppercase tracking-wide flex items-center gap-2 text-white"><Flame size={16} style={{ color: C.red }} /> ¿Qué salsas deseas?</h3>
                      <div className="flex flex-wrap gap-2">
                        {['Verde', 'Roja', 'Habanero', 'Sin Salsa'].map(salsa => (
                          <button
                            key={salsa}
                            onClick={() => {
                              if (salsa === 'Sin Salsa') {
                                setCustomer(prev => ({ ...prev, salsas: ['Sin Salsa'] }));
                              } else {
                                setCustomer(prev => {
                                  const filtered = prev.salsas.filter(s => s !== 'Sin Salsa');
                                  return {
                                    ...prev,
                                    salsas: filtered.includes(salsa) ? filtered.filter(s => s !== salsa) : [...filtered, salsa]
                                  };
                                });
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-bold border transition-all"
                            style={customer.salsas.includes(salsa) ? { backgroundColor: C.red, color: C.text, borderColor: C.red } : { backgroundColor: '#0a0a0a', color: C.textDim, borderColor: C.border }}
                          >
                            {customer.salsas.includes(salsa) ? '✓ ' + salsa : salsa}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Delivery Method */}
                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: C.gold }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-white text-sm"><User size={18} style={{ color: C.gold }}/> Tipo de Entrega</h3>
                      <div className="grid grid-cols-2 gap-3 ml-2">
                        <button onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: 'domicilio' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.deliveryMethod === 'domicilio' ? { backgroundColor: C.gold, color: C.bg, borderColor: C.gold } : { backgroundColor: '#0a0a0a', color: C.textDim, borderColor: C.border }}>🛵 Domicilio</button>
                        <button onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: 'recoger' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.deliveryMethod === 'recoger' ? { backgroundColor: C.gold, color: C.bg, borderColor: C.gold } : { backgroundColor: '#0a0a0a', color: C.textDim, borderColor: C.border }}>🛍️ Recoger</button>
                      </div>
                    </div>

                    {/* Customer Data */}
                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: C.red }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-white text-sm"><User size={18} style={{ color: C.red }}/> Tus Datos</h3>
                      <div className="space-y-3 ml-2">
                        <input type="text" placeholder="Tu Nombre completo *" value={customer.name} onChange={e => { setCustomer({ ...customer, name: e.target.value }); setErrors(prev => ({ ...prev, name: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.name ? { backgroundColor: '#551111', borderColor: C.red, color: 'white' } : { backgroundColor: '#0a0a0a', borderColor: C.border, color: 'white' }} />
                        <input type="tel" placeholder="Teléfono / WhatsApp *" value={customer.phone} onChange={e => { setCustomer({ ...customer, phone: e.target.value }); setErrors(prev => ({ ...prev, phone: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.phone ? { backgroundColor: '#551111', borderColor: C.red, color: 'white' } : { backgroundColor: '#0a0a0a', borderColor: C.border, color: 'white' }} />
                        {customer.deliveryMethod === 'domicilio' && (
                          <input type="text" placeholder="Dirección completa *" value={customer.address} onChange={e => { setCustomer({ ...customer, address: e.target.value }); setErrors(prev => ({ ...prev, address: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.address ? { backgroundColor: '#551111', borderColor: C.red, color: 'white' } : { backgroundColor: '#0a0a0a', borderColor: C.border, color: 'white' }} />
                        )}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.card, borderColor: C.border }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: '#25D366' }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-white text-sm"><Wallet size={18} style={{ color: '#25D366' }}/> Método de Pago</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 ml-2">
                        <button onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'efectivo' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.paymentMethod === 'efectivo' ? { backgroundColor: '#25D366', color: C.bg, borderColor: '#25D366' } : { backgroundColor: '#0a0a0a', color: C.textDim, borderColor: C.border }}>💵 Efectivo</button>
                        <button onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'transferencia' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.paymentMethod === 'transferencia' ? { backgroundColor: '#25D366', color: C.bg, borderColor: '#25D366' } : { backgroundColor: '#0a0a0a', color: C.textDim, borderColor: C.border }}>🏦 Transfer.</button>
                      </div>
                      
                      {customer.paymentMethod === 'efectivo' && (
                        <div className="ml-2">
                          <input type="number" placeholder={`¿Con cuánto vas a pagar? (Total: $${total})`} value={customer.cashAmount} onChange={e => setCustomer({ ...customer, cashAmount: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={{ backgroundColor: '#0a0a0a', borderColor: C.border, color: 'white' }} />
                        </div>
                      )}

                      {customer.paymentMethod === 'transferencia' && (
                        <div className="p-4 rounded-xl border ml-2 mt-2" style={{ backgroundColor: '#0a0a0a', borderColor: C.border }}>
                          <div className="flex items-center gap-4 pb-4 border-b border-dashed" style={{ borderColor: '#333' }}>
                            <Landmark size={36} strokeWidth={1.5} className="text-white shrink-0" />
                            <div>
                              <p className="font-black text-[11px] uppercase tracking-wider" style={{ color: C.gold }}>NÚMERO DE TRANSFERENCIA</p>
                              <p className="font-black text-lg md:text-xl tracking-widest text-white">{clientConfig.transferClabe}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex items-start gap-3 text-xs" style={{ color: C.textDim }}>
                            <span className="text-base">📸</span>
                            <p><strong>Recuerda:</strong> Envía tu comprobante de pago junto con el mensaje de WhatsApp para que cocinemos tu pedido.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <textarea placeholder="¿Notas adicionales? (Sin cebolla, extra salsa...)" value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} className="w-full px-5 py-4 rounded-2xl text-sm font-medium border focus:outline-none min-h-[100px] resize-none" style={{ backgroundColor: C.card, borderColor: C.border, color: 'white' }} />
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              {cart.length > 0 && step !== 'success' && (
                <div className="p-6 border-t z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]" style={{ backgroundColor: C.card, borderColor: C.border }}>
                  <div className="flex justify-between items-end mb-5">
                    <span className="font-bold uppercase tracking-wider text-xs" style={{ color: C.textDim }}>Total ({itemCount} items)</span>
                    <span className="text-3xl font-black leading-none" style={{ color: C.gold }}>${total.toFixed(2)}</span>
                  </div>
                  
                  {step === 'cart' ? (
                    <button onClick={() => setStep('details')} className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all hover:scale-[1.02]" style={{ backgroundColor: C.gold, color: C.bg }}>
                      Continuar Pedido
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setStep('cart')} className="px-5 py-4 rounded-xl font-black uppercase text-sm border transition-colors hover:bg-white/5" style={{ borderColor: C.border, color: C.textDim }}>Atrás</button>
                      <button onClick={sendWhatsApp} className="flex-1 py-4 rounded-xl font-black text-base uppercase tracking-wide transition-all flex items-center justify-center gap-2 hover:scale-[1.02]" style={{ backgroundColor: '#25D366', color: 'white' }}>
                        <MessageCircle size={20} /> Pedir
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-xl border-2 flex items-center gap-3 whitespace-nowrap"
            style={{ backgroundColor: C.card, color: C.gold, borderColor: C.border }}
          >
            +1 {toast}
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── WHATSAPP FLOTANTE ── */}
      <a
        href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('¡Hola! Me gustaría hacer una consulta.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[4px_4px_0px_rgba(0,0,0,0.5)] border-2 transition-all hover:scale-110"
        style={{ backgroundColor: '#25D366', color: 'white', borderColor: C.bg }}
      >
        <MessageCircle size={28} fill="currentColor" />
      </a>
      
      {/* Footer Final */}
      <div className="w-full text-center pb-8 pt-4">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">* Precios mostrados son de carácter ilustrativo para este demo.</p>
      </div>
    </div>
  );
}
