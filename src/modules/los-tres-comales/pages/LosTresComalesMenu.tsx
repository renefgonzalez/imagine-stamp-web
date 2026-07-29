import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Plus, Minus, X, Search, Phone, MapPin,
  MessageCircle, Clock, AlertCircle, CreditCard, ChefHat,
  Coffee, UtensilsCrossed, Flame, Sparkles, ArrowRight, Check,
} from 'lucide-react';
import { clientConfig } from '../config';

// ═══════════════════ TYPES ═══════════════════
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
}
interface CartItem extends MenuItem { quantity: number; }
interface CustomerInfo {
  name: string;
  table: string;
  notes: string;
}

// ═══════════════════ MENU DATA ═══════════════════
const CATEGORIES = [
  { id: 'all', name: 'Todo el Menú', icon: Flame },
  { id: 'platillos', name: 'Platillos del Día', icon: UtensilsCrossed },
  { id: 'antojitos', name: 'Antojitos', icon: ChefHat },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
];

const MENU: MenuItem[] = [
  { id: '1', name: 'Tacos Dorados de Papa', price: 55, category: 'platillos', badge: 'Clásico' },
  { id: '2', name: 'Bistec con Nopales', price: 85, category: 'platillos' },
  { id: '3', name: 'Tortitas de Camarón', price: 90, category: 'platillos', badge: 'Especial' },
  { id: '4', name: 'Carne Asada', price: 95, category: 'platillos', badge: 'Favorito' },
  { id: '5', name: 'Enchiladas Verdes', price: 75, category: 'platillos' },
  { id: '6', name: 'Arrachera', price: 110, category: 'platillos', badge: 'Premium' },
  { id: '7', name: 'Pechuga Asada', price: 90, category: 'platillos' },
  { id: '8', name: 'Milanesa de Pollo o de Res', price: 85, category: 'platillos' },
  { id: '9', name: 'Flautas', price: 65, category: 'platillos' },
  { id: '10', name: 'Ensalada de Pollo', price: 70, category: 'platillos' },
  { id: '11', name: 'Ensalada de Atún', price: 70, category: 'platillos' },
  { id: '12', name: 'Ensalada de Carne', price: 75, category: 'platillos' },
  { id: '13', name: 'Chilaquiles Rojos con Huevo', price: 75, category: 'platillos' },
  { id: '14', name: 'Chilaquiles Verdes con Pollo', price: 80, category: 'platillos' },
  { id: '15', name: 'Chilaquiles con Arrachera', price: 110, category: 'platillos', badge: 'Top' },
  { id: '16', name: 'Chilaquiles con Asada', price: 95, category: 'platillos' },
  { id: '17', name: 'Tacos de Guisado', price: 50, category: 'antojitos' },
  { id: '18', name: 'Gorditas', price: 55, category: 'antojitos', badge: 'Casero' },
  { id: '19', name: 'Huaraches y Sopes', price: 60, category: 'antojitos' },
  { id: '20', name: 'Café de Olla', price: 35, category: 'bebidas', badge: 'Tradicional' },
  { id: '21', name: 'Refrescos', price: 25, category: 'bebidas' },
  { id: '22', name: 'Aguas Frescas', price: 30, category: 'bebidas' },
];

// ═══════════════════ COLORS ═══════════════════
const C = { bg: '#0a0a0a', card: '#141414', cardHover: '#1c1c1c', gold: '#F5C518', red: '#C52828', text: '#ffffff', textDim: '#9e9e9e', border: '#222222' };

// ═══════════════════ COMPONENT ═══════════════════
export default function LosTresComalesMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', table: '', notes: '' });
  const [toast, setToast] = useState('');

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
    const items = cart.map((p, idx) => `${idx + 1}. ${p.name} x${p.quantity} — $${p.price * p.quantity}`).join('\n');
    const msg = `🔥 *LOS TRES COMALES — Pedido*\n\n*Cliente:* ${customer.name}\n*Mesa/Ubicación:* ${customer.table}\n*Notas:* ${customer.notes || 'Ninguna'}\n\n${items}\n\n💰 *Total: $${total} MXN*`;
    setStep(3);
    setTimeout(() => { window.location.href = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`; setCart([]); setCustomer({ name: '', table: '', notes: '' }); setStep(1); setIsOpen(false); }, 600);
  };

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: C.bg, color: C.text }}>
      {/* ═══ AMBIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #F5C51855 0%, transparent 50%), radial-gradient(circle at 70% 80%, #C5282844 0%, transparent 50%), repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff05 2px, #ffffff05 4px)' }} />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: '#0a0a0aee', borderColor: C.border }}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${C.gold}, #D4A017)` }}>
              <ChefHat size={20} style={{ color: C.bg }} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-black tracking-tight truncate" style={{ color: C.gold }}>{clientConfig.businessName}</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider flex items-center gap-1" style={{ color: C.textDim }}>
                <Clock size={10} /> {clientConfig.hours}
              </p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(true); setStep(1); }} className="relative p-2.5 rounded-xl transition-all hover:scale-105" style={{ backgroundColor: C.red }}>
            <ShoppingCart size={20} style={{ color: C.text }} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border-2" style={{ backgroundColor: C.gold, color: C.bg, borderColor: C.bg }}>{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* ═══ HERO ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-10 md:py-14 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-[0.15em]" style={{ borderColor: `${C.gold}30`, color: C.gold }}>
            <Sparkles size={12} /> Cocina Tradicional Mexicana
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-3" style={{ color: C.gold }}>Los Tres Comales</h1>
          <p className="text-sm md:text-base max-w-md mx-auto leading-relaxed" style={{ color: C.textDim }}>Sabores de hogar servidos con tradición. Platillos del día, antojitos y bebidas preparadas al momento.</p>
          <div className="flex items-center justify-center gap-3 mt-5 text-xs" style={{ color: C.textDim }}>
            <span className="flex items-center gap-1"><Clock size={12} /> {clientConfig.hours}</span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.gold }} />
            <span className="flex items-center gap-1"><MapPin size={12} /> Querétaro</span>
          </div>
        </motion.div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-24">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="group rounded-2xl p-4 border transition-all duration-300 flex flex-col gap-2 hover:scale-[1.01]"
                style={{ backgroundColor: C.card, borderColor: C.border }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm leading-tight" style={{ color: C.text }}>{item.name}</h3>
                      {item.badge && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${C.gold}20`, color: C.gold, whiteSpace: 'nowrap' }}>{item.badge}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-lg font-black tracking-tight" style={{ color: C.gold }}>${item.price}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-all"
                    style={{ backgroundColor: C.red, color: C.text }}
                  >
                    <Plus size={16} />
                  </motion.button>
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
        <footer className="border-t pb-12 pt-10" style={{ borderColor: C.border }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: C.gold }}>Dirección</h4>
              <div className="flex items-start gap-2" style={{ color: C.textDim }}>
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: C.gold }} />
                <span className="leading-relaxed">{clientConfig.address}</span>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: C.gold }}>Contacto</h4>
              <div className="space-y-2" style={{ color: C.textDim }}>
                <p className="flex items-center gap-2"><Phone size={12} style={{ color: C.gold }} /> Quejas: {clientConfig.complaintPhone1}</p>
                <p className="flex items-center gap-2"><Phone size={12} style={{ color: C.gold }} /> Quejas: {clientConfig.complaintPhone2}</p>
                <p className="flex items-center gap-2"><MessageCircle size={12} style={{ color: C.gold }} /> Pedidos: {clientConfig.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: C.gold }}>Pagos y Políticas</h4>
              <div className="space-y-2" style={{ color: C.textDim }}>
                <p className="flex items-center gap-2 text-xs"><CreditCard size={12} style={{ color: C.gold }} /> Transferencias: {clientConfig.transferClabe}</p>
                <p className="flex items-start gap-2 text-xs leading-relaxed"><AlertCircle size={12} className="shrink-0 mt-0.5" style={{ color: C.red }} /> {clientConfig.policy}</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: C.border }}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: `${C.textDim}60` }}>
              © {new Date().getFullYear()} {clientConfig.businessName} ·{' '}
              <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="hover:underline" style={{ color: C.gold }}>Página web realizada por IMAGINE & STAMP</a>
            </p>
          </div>
        </footer>
      </div>

      {/* ═══ CART DRAWER ═══ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-50" style={{ backgroundColor: '#000000cc', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] rounded-t-3xl overflow-hidden flex flex-col"
              style={{ backgroundColor: C.card, borderTop: `1px solid ${C.border}` }}
            >
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
                <div>
                  <h2 className="text-lg font-black" style={{ color: C.gold }}>
                    {step === 1 ? 'Tu Pedido' : step === 2 ? 'Tus Datos' : '¡Listo!'}
                  </h2>
                  {step === 1 && <p className="text-xs" style={{ color: C.textDim }}>{itemCount} items · ${total}</p>}
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/5 transition-colors"><X size={20} style={{ color: C.textDim }} /></button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain">
                {step === 1 && (
                  <div className="p-5">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart size={48} className="mx-auto mb-4 opacity-10" />
                        <p className="text-sm font-medium" style={{ color: C.textDim }}>Agrega platillos al carrito</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map(item => (
                          <motion.div key={item.id} layout className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#0a0a0a', border: `1px solid ${C.border}` }}>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm">{item.name}</p>
                              <p className="text-xs" style={{ color: C.textDim }}>${item.price} c/u</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full flex items-center justify-center border" style={{ borderColor: C.border }}><Minus size={12} style={{ color: C.textDim }} /></button>
                              <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                              <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.red }}><Plus size={12} style={{ color: C.text }} /></button>
                            </div>
                            <p className="font-black text-sm w-16 text-right" style={{ color: C.gold }}>${item.price * item.quantity}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 block" style={{ color: C.textDim }}>Nombre</label>
                      <input value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="¿A nombre de quién?" className="w-full p-3 rounded-xl text-sm font-medium border focus:outline-none focus:ring-1" style={{ backgroundColor: '#0a0a0a', color: C.text, borderColor: C.border }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 block" style={{ color: C.textDim }}>Mesa / Dirección</label>
                      <input value={customer.table} onChange={e => setCustomer({ ...customer, table: e.target.value })} placeholder="Ej: Mesa 5 o Calle 123" className="w-full p-3 rounded-xl text-sm font-medium border focus:outline-none focus:ring-1" style={{ backgroundColor: '#0a0a0a', color: C.text, borderColor: C.border }} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 block" style={{ color: C.textDim }}>Notas adicionales</label>
                      <textarea value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} placeholder="Sin cebolla, extra salsa..." rows={2} className="w-full p-3 rounded-xl text-sm font-medium border focus:outline-none focus:ring-1 resize-none" style={{ backgroundColor: '#0a0a0a', color: C.text, borderColor: C.border }} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#22c55e20' }}>
                      <Check size={32} className="text-green-400" />
                    </motion.div>
                    <h3 className="text-lg font-black" style={{ color: C.gold }}>¡Pedido enviado!</h3>
                    <p className="text-sm mt-1" style={{ color: C.textDim }}>Redirigiendo a WhatsApp...</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && step !== 3 && (
                <div className="p-5 border-t space-y-3" style={{ borderColor: C.border }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold" style={{ color: C.textDim }}>{itemCount} items</span>
                    <span className="text-2xl font-black tracking-tight" style={{ color: C.gold }}>${total}</span>
                  </div>
                  {step === 1 && (
                    <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2" style={{ backgroundColor: C.gold, color: C.bg }}>
                      Continuar <ArrowRight size={18} />
                    </button>
                  )}
                  {step === 2 && (
                    <button onClick={sendWhatsApp} disabled={!customer.name} className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30" style={{ backgroundColor: '#25D366', color: 'white' }}>
                      <MessageCircle size={18} /> Enviar Pedido por WhatsApp
                    </button>
                  )}
                  {step === 2 && (
                    <button onClick={() => setStep(1)} className="w-full text-xs font-bold uppercase tracking-wider py-2" style={{ color: C.textDim }}>← Volver al carrito</button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ TOAST ═══ */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-2xl shadow-2xl border text-sm font-bold"
            style={{ backgroundColor: C.card, color: C.gold, borderColor: `${C.gold}30` }}
          >
            +1 {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
