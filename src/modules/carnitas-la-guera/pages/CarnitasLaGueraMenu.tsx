import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Plus, Minus, X, Search, Phone, MapPin,
  Clock, ChefHat, Coffee, Flame, UtensilsCrossed,
  ShoppingBag, User, Wallet, Check, ArrowRight, ChevronLeft,
  Copy, Landmark
} from 'lucide-react';
import { clientConfig } from '../config';
import logoImg from '../assets/logo.png';
import heroImg from '../assets/hero-carnitas.webp';

const C = clientConfig.colors;

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
  guiso?: string;
}

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

const CATEGORIES = [
  { id: 'carnitas', name: 'Carnitas', icon: Flame },
  { id: 'guisados', name: 'Arma tu Antojo', icon: ChefHat },
  { id: 'menudo', name: 'Menudo', icon: UtensilsCrossed },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee },
  { id: 'extras', name: 'Extras', icon: ShoppingBag },
];

const GUISOS = [
  'Chile con queso', 'Nopales con carne', 'Papas con chorizo',
  'Huevo', 'Picadillo', 'Carnitas guisadas', 'Chicharrón', 'Queso',
  'Huitlacoche', 'Tinga', 'Mole verde', 'Chorizo',
  'Cochinita', 'Champiñones', 'Papas',
];

const BASES_GUISADO = [
  { id: 'taco-guiso', name: 'Taco de Guisado', price: 10 },
  { id: 'quesadilla-guiso', name: 'Quesadilla de Guisado', price: 25 },
  { id: 'gordita-guiso', name: 'Gordita de Guisado', price: 25 },
  { id: 'sope-guiso', name: 'Sope de Guisado', price: 35 },
  { id: 'tostada-guiso', name: 'Tostada de Guisado', price: 55 },
];

const imgCarnitas = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80';
const imgGordita = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80';
const imgGuisado = 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&q=80';
const imgMenudo = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80';
const imgDrink = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80';
const imgCoffee = 'https://images.unsplash.com/photo-1582221665046-2b474cbdd3d7?w=500&q=80';

const MENU: MenuItem[] = [
  { id: 'taco-carnitas', name: 'Taco de Carnitas', price: 25, category: 'carnitas', badge: 'El Favorito', image: imgCarnitas },
  { id: 'quesa-chica', name: 'Quesadilla Chica de Carnitas', price: 50, category: 'carnitas', image: imgGordita },
  { id: 'quesa-grande', name: 'Quesadilla Grande de Carnitas', price: 80, category: 'carnitas', image: imgGordita },
  { id: 'gorda-chica', name: 'Gorda Chica de Carnitas', price: 50, category: 'carnitas', image: imgCarnitas },
  { id: 'gorda-grande', name: 'Gorda Grande de Carnitas', price: 80, category: 'carnitas', image: imgGordita },
  { id: 'tostada-carnitas', name: 'Tostada de Carnitas', price: 80, category: 'carnitas', image: imgCarnitas },
  { id: 'baguette', name: 'Baguette de Carnitas', price: 80, category: 'carnitas', image: imgGordita },
  { id: 'torta', name: 'Torta de Carnitas', price: 50, category: 'carnitas', image: imgGordita },
  { id: 'sope-carnitas', name: 'Sope de Carnitas', price: 60, category: 'carnitas', image: imgCarnitas },
  { id: 'kilo', name: 'Kilo de Carnitas', price: 280, category: 'carnitas', badge: 'Para llevar', image: imgCarnitas },
  { id: 'medio', name: 'Medio Kilo de Carnitas', price: 145, category: 'carnitas', badge: 'Para llevar', image: imgCarnitas },
  { id: 'pancita-chica', name: 'Pancita Chica', price: 100, category: 'menudo', badge: 'Fin de semana', image: imgMenudo },
  { id: 'pancita-grande', name: 'Pancita Grande', price: 150, category: 'menudo', badge: 'Fin de semana', image: imgMenudo },
  { id: 'cafe-olla', name: 'Café de Olla', price: 30, category: 'bebidas', badge: 'Tradicional', image: imgCoffee },
  { id: 'atole-guayaba', name: 'Atole de Guayaba', price: 35, category: 'bebidas', image: imgDrink },
  { id: 'champurrado', name: 'Champurrado', price: 35, category: 'bebidas', image: imgCoffee },
  { id: 'agua-sabor', name: 'Agua de Sabor', price: 30, category: 'bebidas', image: imgDrink },
  { id: 'jugo-naranja', name: 'Jugo de Naranja', price: 45, category: 'bebidas', image: imgDrink },
  { id: 'chancla', name: 'Chancla (Verde o Roja)', price: 20, category: 'extras', image: imgGordita },
  { id: 'pan', name: 'Pan (Avena con Coco)', price: 20, category: 'extras', image: imgGordita },
  { id: 'docena-tortillas', name: 'Docena de Tortillas', price: 25, category: 'extras', image: imgGordita },
];

export default function CarnitasLaGueraMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [activeCat, setActiveCat] = useState('carnitas');
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState<CustomerInfo>({ name: '', phone: '', deliveryMethod: 'recoger', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] });
  const [toast, setToast] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const copyBankInfo = () => {
    const info = `${clientConfig.bankInfo.institucion}\n${clientConfig.bankInfo.account_holder}\n${clientConfig.bankInfo.clabe}`;
    navigator.clipboard.writeText(info).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedGuiso, setSelectedGuiso] = useState<string | null>(null);
  const [guisoQty, setGuisoQty] = useState(1);

  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  const filtered = useMemo(() => {
    if (activeCat === 'guisados') return [];
    let r = MENU.filter(p => p.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      r = r.filter(p => p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q));
    }
    return r;
  }, [activeCat, search]);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const addToCart = (item: MenuItem, extra?: { guiso?: string }) => {
    setCart(prev => {
      const key = extra?.guiso ? `${item.id}__${extra.guiso}` : item.id;
      const exist = prev.find(i => (extra?.guiso ? `${i.id}__${i.guiso}` : i.id) === key);
      if (exist) return prev.map(i => (extra?.guiso ? `${i.id}__${i.guiso}` : i.id) === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, guiso: extra?.guiso }];
    });
    setToast(item.name);
    setTimeout(() => setToast(''), 2000);
  };

  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) setCart(prev => prev.filter((_, i) => i !== idx));
    else setCart(prev => prev.map((item, i) => i === idx ? { ...item, quantity: qty } : item));
  };

  const handleAddGuisado = () => {
    if (!selectedBase || !selectedGuiso) return;
    const base = BASES_GUISADO.find(b => b.id === selectedBase);
    if (!base) return;
    for (let i = 0; i < guisoQty; i++) {
      addToCart({ id: `guisado-${Date.now()}-${i}`, name: `${base.name} de ${selectedGuiso}`, price: base.price, category: 'guisados' }, { guiso: selectedGuiso });
    }
    setSelectedGuiso(null);
    setGuisoQty(1);
  };

  const getBasePrice = () => BASES_GUISADO.find(b => b.id === selectedBase)?.price ?? 0;

  const sendWhatsApp = () => {
    if (!customer.name || !customer.phone || (customer.deliveryMethod === 'domicilio' && !customer.address)) {
      setErrors({ name: !customer.name, phone: !customer.phone, address: customer.deliveryMethod === 'domicilio' && !customer.address });
      return;
    }
    const items = cart.map((p, idx) => {
      const displayName = p.guiso ? `${p.name} (${p.guiso})` : p.name;
      return `${idx + 1}. ${displayName} x${p.quantity} — $${p.price * p.quantity}`;
    }).join('\n');
    let msg = `🛒 *CARNITAS Y GORDITAS LA GÜERA — Pedido*\n\n*Cliente:* ${customer.name}\n*WhatsApp:* ${customer.phone}\n*Entrega:* ${customer.deliveryMethod === 'recoger' ? 'Paso a recoger' : 'Envío a domicilio'}`;
    if (customer.deliveryMethod === 'domicilio') msg += `\n*Dirección:* ${customer.address}`;
    msg += `\n*Pago:* ${customer.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}`;
    if (customer.paymentMethod === 'efectivo' && customer.cashAmount) msg += ` (Paga con $${customer.cashAmount})`;
    if (customer.salsas.length > 0) msg += `\n*Salsas:* ${customer.salsas.join(', ')}`;
    msg += `\n*Notas:* ${customer.notes || 'Ninguna'}\n\n${items}\n\n💰 *Total: $${total} MXN*`;
    setStep('success');
    setTimeout(() => {
      window.location.href = `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`;
      setCart([]);
      setCustomer({ name: '', phone: '', deliveryMethod: 'recoger', address: '', paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: [] });
      setStep('cart');
      setIsOpen(false);
    }, 1500);
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap');`}</style>
    <div className="min-h-screen font-['Fredoka',_system-ui,_sans-serif]" style={{ backgroundColor: C.bg, color: C.textPrimary }}>
      {/* ═══ PAPEL PICADO BG ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, #E85D7544 0%, transparent 50%), radial-gradient(circle at 80% 30%, #0E959444 0%, transparent 50%), radial-gradient(circle at 50% 80%, #C1440E44 0%, transparent 40%), repeating-linear-gradient(0deg, transparent, transparent 3px, #E8A33D08 3px, #E8A33D08 6px)' }} />

      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b shadow-sm" style={{ backgroundColor: '#FFF8F0ee', borderColor: '#E8A33D20' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoImg} alt="La Güera" className="h-10 md:h-12 w-auto object-contain shrink-0" />
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-black tracking-tight truncate" style={{ color: C.primary }}>{clientConfig.businessName}</h1>
              <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: C.textSecondary }}>
                <MapPin size={10} /> Carnitas y Antojitos Mexicanos
              </p>
            </div>
          </div>
          <button onClick={() => { setIsOpen(true); setStep('cart'); }} className="relative p-2.5 rounded-xl transition-all hover:scale-105 shadow-md" style={{ backgroundColor: C.primary, color: '#fff' }}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center border-2" style={{ backgroundColor: C.gold, color: C.bg, borderColor: C.bg }}>{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* ═══ HERO ═══ */}
        <div className="relative w-full rounded-[30px] overflow-hidden my-6 shadow-xl border" style={{ borderColor: `${C.accent}20` }}>
          <img src={heroImg} alt="Carnitas doradas" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 py-16 md:py-20 text-center px-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-5 text-xs font-bold uppercase tracking-[0.15em] bg-white/10 backdrop-blur-md" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>🌮 Cocina Tradicional Mexicana</motion.div>
            <div className="flex justify-center mb-4">
              <img src={logoImg} alt="La Güera Logo" className="h-28 md:h-36 w-auto object-contain drop-shadow-2xl" />
            </div>
            <p className="text-base md:text-lg max-w-md mx-auto leading-relaxed drop-shadow-md text-white/90 font-medium">Carnitas doraditas, guisados caseros y antojitos hechos con el sazón de siempre.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
              <button onClick={() => { setActiveCat('carnitas'); window.scrollTo({ top: 500, behavior: 'smooth' }); }} className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 shadow-lg" style={{ backgroundColor: C.gold, color: C.textPrimary }}>Ver Menú</button>
              <a href={`https://wa.me/${clientConfig.phone}`} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:scale-105 border-2 border-white/30 text-white bg-white/10 backdrop-blur-sm">Pedir por WhatsApp</a>
            </div>
          </motion.div>
        </div>

        {/* ═══ PAPEL PICADO ═══ */}
        <div className="flex justify-center -mt-5 mb-4 relative z-10 overflow-visible">
          <div className="relative flex items-center gap-0">
            {/* Horizontal string */}
            <svg className="absolute top-0 left-0 w-full h-3 z-10" preserveAspectRatio="none" viewBox="0 0 400 6">
              <path d="M0 3 Q50 0 100 3 T200 3 T300 3 T400 3" fill="none" stroke="#8B6914" strokeWidth="1.5" opacity="0.6" />
            </svg>
            {/* Papel picado banners */}
            <div className="flex gap-3 pt-3">
              {[
                { color: C.accent, pattern: 'flores' },
                { color: C.secondary, pattern: 'geometrico' },
                { color: C.gold, pattern: 'flores' },
                { color: C.primary, pattern: 'geometrico' },
                { color: C.accent, pattern: 'flores' },
              ].map((banner, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0], rotate: [0, i % 2 === 0 ? 1 : -1, 0] }}
                  transition={{ duration: 4, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-24 flex-shrink-0"
                >
                  <svg viewBox="0 0 60 90" className="w-full h-full" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
                    {/* String hole */}
                    <circle cx="30" cy="4" r="2" fill="#8B6914" opacity="0.5" />
                    {/* Main banner shape */}
                    <rect x="2" y="6" width="56" height="82" rx="2" fill={banner.color} opacity="0.9" />
                    {/* Scalloped bottom edge */}
                    <path d="M2 86 L2 70 Q10 58 18 70 Q26 58 34 70 Q42 58 50 70 L58 70 L58 88 Z" fill={banner.color} opacity="0.9" />
                    {/* Inner cutout border */}
                    <rect x="6" y="10" width="48" height="64" rx="1" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.25" />
                    {/* Cutout patterns */}
                    {banner.pattern === 'flores' ? (
                      <>
                        <circle cx="22" cy="26" r="5" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
                        <circle cx="22" cy="26" r="1.5" fill="#fff" opacity="0.2" />
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                          <ellipse key={angle} cx={22 + Math.cos(angle * Math.PI / 180) * 5} cy={26 + Math.sin(angle * Math.PI / 180) * 5} rx="1.5" ry="1" fill="#fff" opacity="0.2" transform={`rotate(${angle} 22 26)`} />
                        ))}
                        <circle cx="38" cy="26" r="5" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
                        <circle cx="38" cy="26" r="1.5" fill="#fff" opacity="0.2" />
                        <circle cx="30" cy="48" r="7" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
                        <circle cx="30" cy="48" r="2" fill="#fff" opacity="0.2" />
                        {[0, 60, 120, 180, 240, 300].map(angle => (
                          <circle key={angle} cx={30 + Math.cos(angle * Math.PI / 180) * 7} cy={48 + Math.sin(angle * Math.PI / 180) * 7} r="1.2" fill="#fff" opacity="0.15" />
                        ))}
                        <circle cx="17" cy="67" r="3.5" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.25" />
                        <circle cx="43" cy="67" r="3.5" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.25" />
                      </>
                    ) : (
                      <>
                        {/* Diamond grid pattern */}
                        <rect x="12" y="18" width="36" height="24" rx="2" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.3" />
                        <line x1="30" y1="18" x2="30" y2="42" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
                        <line x1="12" y1="30" x2="48" y2="30" stroke="#fff" strokeWidth="0.5" opacity="0.15" />
                        <rect x="16" y="22" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <rect x="26" y="22" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <rect x="36" y="22" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <rect x="16" y="32" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <rect x="26" y="32" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <rect x="36" y="32" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        {/* Bottom arches */}
                        <path d="M18 52 Q22 46 26 52 Q30 46 34 52 Q38 46 42 52" fill="none" stroke="#fff" strokeWidth="0.7" opacity="0.25" />
                        <circle cx="18" cy="66" r="3" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <circle cx="30" cy="68" r="4" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                        <circle cx="42" cy="66" r="3" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.2" />
                      </>
                    )}
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CATEGORIES ═══ */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6 sticky top-[72px] z-30" style={{ backgroundColor: `${C.bg}ee`, backdropFilter: 'blur(12px)' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => { setActiveCat(cat.id); setSearch(''); }} className="flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 border shadow-sm" style={{ backgroundColor: activeCat === cat.id ? C.primary : '#fff', color: activeCat === cat.id ? '#fff' : C.textSecondary, borderColor: activeCat === cat.id ? C.primary : '#E8A33D20' }}>
              <cat.icon size={14} /> {cat.name}
            </button>
          ))}
        </div>

        {/* ═══ SEARCH ═══ */}
        {activeCat !== 'guisados' && (
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: C.textSecondary }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar platillo..." className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 transition-all shadow-sm border" style={{ backgroundColor: '#fff', color: C.textPrimary, borderColor: '#E8A33D20' }} />
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ═══ CARNITAS SECTION ═══ */}
          {activeCat === 'carnitas' && (
            <motion.div key="carnitas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={28} style={{ color: C.primary }} />
                <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>Carnitas</h2>
              </div>
              <div className="w-12 h-1 rounded-full mb-5 ml-10" style={{ backgroundColor: C.gold }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileHover={{ y: -4 }} className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D15' }}>
                    {item.image && (
                      <div className="w-full h-40 overflow-hidden relative">
                        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        {item.badge && <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md" style={{ backgroundColor: `${C.accent}dd`, color: '#fff' }}>{item.badge}</div>}
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-base leading-tight" style={{ color: C.textPrimary }}>{item.name}</h3>
                      <div className="flex items-end justify-between mt-auto pt-3">
                        <span className="text-xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>${item.price}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md" style={{ backgroundColor: C.secondary, color: '#fff' }}>
                          <Plus size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ GUISADOS BUILDER ═══ */}
          {activeCat === 'guisados' && (
            <motion.div key="guisados" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
              <div className="flex items-center gap-2 mb-1">
                <ChefHat size={28} style={{ color: C.primary }} />
                <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>Arma tu Antojo</h2>
              </div>
              <p className="text-sm mb-2 ml-10" style={{ color: C.textSecondary }}>Elige la base, después tu guiso favorito y ¡listo!</p>
              <div className="w-12 h-1 rounded-full mb-5 ml-10" style={{ backgroundColor: C.accent }} />

              {/* Paso 1: Base */}
              <div className="rounded-2xl border p-5 mb-5 shadow-sm" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: C.primary }}>1</span> Elige la base</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {BASES_GUISADO.map(base => (
                    <button key={base.id} onClick={() => { setSelectedBase(base.id); setSelectedGuiso(null); }} className={`p-3 rounded-xl text-center transition-all border-2 ${selectedBase === base.id ? 'shadow-md scale-105' : 'hover:border-'}`}
                      style={selectedBase === base.id ? { backgroundColor: `${C.primary}10`, borderColor: C.primary, color: C.primary } : { backgroundColor: '#FFF8F0', borderColor: '#E8A33D20', color: C.textPrimary }}
                    >
                      <p className="text-[11px] font-black leading-tight">{base.name.replace(' de Guisado', '')}</p>
                      <p className="text-lg font-extrabold mt-1">${base.price}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 2: Guiso */}
              <div className="rounded-2xl border p-5 mb-5 shadow-sm" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: C.textSecondary }}><span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: C.accent }}>2</span> Elige tu guiso</p>
                <div className="flex flex-wrap gap-2">
                  {GUISOS.map(guiso => (
                    <button key={guiso} onClick={() => setSelectedGuiso(guiso)} className="px-3 py-2 rounded-xl text-xs font-bold transition-all border"
                      style={selectedGuiso === guiso ? { backgroundColor: C.accent, color: '#fff', borderColor: C.accent } : { backgroundColor: '#FFF8F0', color: C.textSecondary, borderColor: '#E8A33D20' }}
                    >{guiso}</button>
                  ))}
                </div>
              </div>

              {/* Paso 3: Cantidad y Agregar */}
              {selectedGuiso && selectedBase && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border p-5 shadow-sm" style={{ backgroundColor: C.cardBg, borderColor: C.accent + '30' }}>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-black text-lg" style={{ color: C.primary }}>
                        {BASES_GUISADO.find(b => b.id === selectedBase)?.name} de <span style={{ color: C.accent }}>{selectedGuiso}</span>
                      </p>
                      <p className="text-sm" style={{ color: C.textSecondary }}>
                        ${getBasePrice()} c/u · Subtotal: <span className="font-black" style={{ color: C.gold }}>${getBasePrice() * guisoQty}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-xl border overflow-hidden h-10" style={{ borderColor: '#E8A33D30' }}>
                        <button onClick={() => setGuisoQty(Math.max(1, guisoQty - 1))} className="px-3 hover:bg-gray-100 font-bold" style={{ color: C.textSecondary }}>-</button>
                        <span className="w-10 text-center font-black" style={{ color: C.textPrimary }}>{guisoQty}</span>
                        <button onClick={() => setGuisoQty(guisoQty + 1)} className="px-3 hover:bg-gray-100 font-bold" style={{ color: C.textSecondary }}>+</button>
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={handleAddGuisado} className="px-5 py-2.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-md flex items-center gap-2" style={{ backgroundColor: C.secondary, color: '#fff' }}>
                        <Plus size={16} /> Agregar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ MENUDO SECTION ═══ */}
          {activeCat === 'menudo' && (
            <motion.div key="menudo" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
              <div className="flex items-center gap-2 mb-1">
                <UtensilsCrossed size={28} style={{ color: C.primary }} />
                <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>Menudo</h2>
              </div>
              <div className="w-12 h-1 rounded-full mb-5 ml-10" style={{ backgroundColor: C.gold }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileHover={{ y: -4 }} className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md flex flex-col" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                    {item.image && (
                      <div className="w-full h-44 overflow-hidden relative">
                        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        {item.badge && <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md" style={{ backgroundColor: `${C.primary}dd`, color: '#fff' }}>{item.badge}</div>}
                      </div>
                    )}
                    <div className="p-5 flex items-end justify-between">
                      <h3 className="font-bold text-lg" style={{ color: C.textPrimary }}>{item.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-black" style={{ color: C.primary }}>${item.price}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} className="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-md" style={{ backgroundColor: C.secondary, color: '#fff' }}>
                          <Plus size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ BEBIDAS SECTION ═══ */}
          {activeCat === 'bebidas' && (
            <motion.div key="bebidas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
              <div className="flex items-center gap-2 mb-1">
                <Coffee size={28} style={{ color: C.primary }} />
                <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>Bebidas</h2>
              </div>
              <div className="w-12 h-1 rounded-full mb-5 ml-10" style={{ backgroundColor: C.secondary }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileHover={{ y: -4 }} className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md flex flex-col" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D15' }}>
                    {item.image && (
                      <div className="w-full h-36 overflow-hidden relative">
                        <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        {item.badge && <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-md" style={{ backgroundColor: `${C.gold}dd`, color: C.textPrimary }}>{item.badge}</div>}
                      </div>
                    )}
                    <div className="p-4 flex items-end justify-between">
                      <h3 className="font-bold text-base" style={{ color: C.textPrimary }}>{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black" style={{ color: C.primary }}>${item.price}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm" style={{ backgroundColor: C.secondary, color: '#fff' }}><Plus size={16} /></motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ═══ EXTRAS SECTION ═══ */}
          {activeCat === 'extras' && (
            <motion.div key="extras" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingBag size={28} style={{ color: C.primary }} />
                <h2 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>Extras</h2>
              </div>
              <div className="w-12 h-1 rounded-full mb-5 ml-10" style={{ backgroundColor: C.gold }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {filtered.map(item => (
                  <motion.div key={item.id} whileHover={{ y: -4 }} className="rounded-2xl border overflow-hidden shadow-sm hover:shadow-md flex flex-col" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D15' }}>
                    <div className="p-5 flex items-center justify-between">
                      <h3 className="font-bold" style={{ color: C.textPrimary }}>{item.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black" style={{ color: C.primary }}>${item.price}</span>
                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => addToCart(item)} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm" style={{ backgroundColor: C.secondary, color: '#fff' }}><Plus size={16} /></motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ EMPTY STATE ═══ */}
        {activeCat !== 'guisados' && filtered.length === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="mx-auto mb-4" style={{ color: `${C.textSecondary}30` }} />
            <p className="font-bold text-lg" style={{ color: C.textSecondary }}>No encontramos ese platillo</p>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t-4 mt-16 pb-12 pt-16 relative rounded-t-[40px]" style={{ borderColor: C.primary, backgroundColor: C.cardBg }}>
          <div className="absolute inset-0 pointer-events-none opacity-30 rounded-t-[40px]" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, ${C.primary} 0%, transparent 70%)` }} />
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm relative z-10">
            <div className="text-center md:text-left">
              <img src={logoImg} alt="La Güera" className="h-20 w-auto object-contain mx-auto md:mx-0 mb-4 drop-shadow-md" />
              <p className="font-medium leading-relaxed" style={{ color: C.textSecondary }}>{clientConfig.description}</p>
            </div>
            <div className="text-center">
              <h4 className="font-black uppercase tracking-wider text-sm mb-5" style={{ color: C.primary }}>Contacto y Ubicación</h4>
              <div className="space-y-4 font-medium" style={{ color: C.textSecondary }}>
                <a href={`https://wa.me/${clientConfig.phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                  <Phone size={16} style={{ color: '#25D366' }} />
                  WhatsApp: {clientConfig.phoneNumber}
                </a>
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={16} style={{ color: C.accent }} />
                  {clientConfig.address}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={16} style={{ color: C.primary }} />
                  {clientConfig.hours}
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h4 className="font-black uppercase tracking-wider text-sm mb-5" style={{ color: C.primary }}>Pagos</h4>
              <div className="space-y-2 font-medium" style={{ color: C.textSecondary }}>
                <p>💵 Efectivo</p>
                <p>🏦 Transferencia</p>
                <p className="text-xs mt-4 uppercase tracking-wider" style={{ color: `${C.textSecondary}80` }}>Favor de revisar su ticket cuando le entreguen la cuenta</p>
              </div>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-4 mt-10 pt-8 border-t text-center relative z-10" style={{ borderColor: '#E8A33D20' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: `${C.textSecondary}80` }}>
              Diseñado por <a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity underline" style={{ color: C.primary }}>IMAGINE & STAMP</a>
            </p>
          </div>
        </footer>
      </div>

      {/* ═══ CART DRAWER ═══ */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl"
              style={{ backgroundColor: C.cardBg, borderLeft: `4px solid ${C.primary}` }}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E8A33D20' }}>
                <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-wide" style={{ color: C.primary }}>
                  {step === 'details' ? 'Finalizar Pedido' : step === 'success' ? '¡Listo!' : 'Tu Pedido'}
                  <ShoppingBag size={24} style={{ color: C.accent }} />
                </h2>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full transition-colors hover:bg-gray-100" style={{ color: C.textSecondary }}><X size={20} strokeWidth={2.5} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: C.bg }}>
                {cart.length === 0 && step !== 'success' ? (
                  <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg border" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                      <ShoppingBag size={40} style={{ color: C.textSecondary }} />
                    </div>
                    <p className="font-bold text-lg mb-4" style={{ color: C.textSecondary }}>Aún no hay platillos aquí</p>
                    <button onClick={() => setIsOpen(false)} className="px-6 py-2 rounded-full font-black uppercase text-sm transition-all" style={{ border: `2px solid ${C.primary}`, color: C.primary }}>Ver menú</button>
                  </div>
                ) : step === 'success' ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 border-2" style={{ backgroundColor: '#22c55e20', borderColor: '#22c55e60' }}><Check className="w-10 h-10 text-green-400" /></div>
                    <h3 className="text-2xl font-black mb-2" style={{ color: C.textPrimary }}>¡Pedido Listo!</h3>
                    <p className="text-sm" style={{ color: C.textSecondary }}>Redirigiendo a WhatsApp...</p>
                  </div>
                ) : step === 'cart' ? (
                  <div className="space-y-4">
                    {cart.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex gap-4 p-3 rounded-2xl border relative group" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                        {item.image && <img src={item.image} alt={item.name} loading="lazy" className="w-20 h-20 rounded-xl object-cover border shrink-0" style={{ borderColor: '#ffffff10' }} />}
                        <div className="flex-1 py-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-black text-sm leading-tight pr-6" style={{ color: C.textPrimary }}>{item.guiso ? `${item.name}` : item.name}</h4>
                            <p className="font-black text-sm mt-1" style={{ color: C.primary }}>${item.price * item.quantity}</p>
                          </div>
                          <div className="flex items-center justify-end mt-2">
                            <div className="flex items-center rounded-lg p-0.5 border" style={{ backgroundColor: C.bg, borderColor: '#E8A33D20' }}>
                              <button onClick={() => updateQty(idx, item.quantity - 1)} className="p-1 transition-colors" style={{ color: C.textSecondary }}><Minus size={14} strokeWidth={3} /></button>
                              <span className="font-black text-sm w-8 text-center" style={{ color: C.textPrimary }}>{item.quantity}</span>
                              <button onClick={() => updateQty(idx, item.quantity + 1)} className="p-1 transition-colors" style={{ color: C.textSecondary }}><Plus size={14} strokeWidth={3} /></button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => updateQty(idx, 0)} className="absolute top-3 right-3 p-1 rounded-full transition-colors hover:bg-gray-100" style={{ color: C.textSecondary }}><X size={16} strokeWidth={3} /></button>
                      </div>
                    ))}

                    {/* Salsas */}
                    <div className="mt-6 p-5 rounded-2xl border shadow-sm" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                      <h3 className="font-black mb-3 text-sm uppercase tracking-wide flex items-center gap-2" style={{ color: C.textPrimary }}><Flame size={16} style={{ color: C.primary }} /> ¿Qué salsas deseas?</h3>
                      <div className="flex flex-wrap gap-2">
                        {clientConfig.salsas.map(salsa => (
                          <button
                            key={salsa}
                            onClick={() => setCustomer(prev => ({ ...prev, salsas: prev.salsas.includes(salsa) ? prev.salsas.filter(s => s !== salsa) : [...prev.salsas, salsa] }))}
                            className="px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                            style={customer.salsas.includes(salsa) ? { backgroundColor: C.primary, color: '#fff', borderColor: C.primary } : { backgroundColor: C.bg, color: C.textSecondary, borderColor: '#E8A33D20' }}
                          >
                            {customer.salsas.includes(salsa) ? '✓ ' + salsa : salsa}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: C.primary }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-sm" style={{ color: C.textPrimary }}><User size={18} style={{ color: C.primary }} /> Tipo de Entrega</h3>
                      <div className="grid grid-cols-2 gap-3 ml-2">
                        <button onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: 'recoger' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.deliveryMethod === 'recoger' ? { backgroundColor: C.primary, color: '#fff', borderColor: C.primary } : { backgroundColor: C.bg, color: C.textSecondary, borderColor: '#E8A33D20' }}>🛍️ Recoger</button>
                        <button onClick={() => setCustomer(prev => ({ ...prev, deliveryMethod: 'domicilio' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.deliveryMethod === 'domicilio' ? { backgroundColor: C.primary, color: '#fff', borderColor: C.primary } : { backgroundColor: C.bg, color: C.textSecondary, borderColor: '#E8A33D20' }}>🛵 Domicilio</button>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: C.accent }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-sm" style={{ color: C.textPrimary }}><User size={18} style={{ color: C.accent }} /> Tus Datos</h3>
                      <div className="space-y-3 ml-2">
                        <input type="text" placeholder="Tu Nombre completo *" value={customer.name} onChange={e => { setCustomer({ ...customer, name: e.target.value }); setErrors(prev => ({ ...prev, name: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.name ? { backgroundColor: '#FFF5F5', borderColor: C.accent, color: C.textPrimary } : { backgroundColor: C.bg, borderColor: '#E8A33D20', color: C.textPrimary }} />
                        <input type="tel" placeholder="Teléfono / WhatsApp *" value={customer.phone} onChange={e => { setCustomer({ ...customer, phone: e.target.value }); setErrors(prev => ({ ...prev, phone: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.phone ? { backgroundColor: '#FFF5F5', borderColor: C.accent, color: C.textPrimary } : { backgroundColor: C.bg, borderColor: '#E8A33D20', color: C.textPrimary }} />
                        {customer.deliveryMethod === 'domicilio' && (
                          <input type="text" placeholder="Dirección completa *" value={customer.address} onChange={e => { setCustomer({ ...customer, address: e.target.value }); setErrors(prev => ({ ...prev, address: false })); }} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={errors.address ? { backgroundColor: '#FFF5F5', borderColor: C.accent, color: C.textPrimary } : { backgroundColor: C.bg, borderColor: '#E8A33D20', color: C.textPrimary }} />
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl border relative overflow-hidden" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                      <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: C.secondary }} />
                      <h3 className="font-black mb-4 flex items-center gap-2 uppercase tracking-wide ml-2 text-sm" style={{ color: C.textPrimary }}><Wallet size={18} style={{ color: C.secondary }} /> Método de Pago</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 ml-2">
                        <button onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'efectivo' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.paymentMethod === 'efectivo' ? { backgroundColor: '#25D366', color: '#fff', borderColor: '#25D366' } : { backgroundColor: C.bg, color: C.textSecondary, borderColor: '#E8A33D20' }}>💵 Efectivo</button>
                        <button onClick={() => setCustomer(prev => ({ ...prev, paymentMethod: 'transferencia' }))} className="py-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all" style={customer.paymentMethod === 'transferencia' ? { backgroundColor: C.primary, color: '#fff', borderColor: C.primary } : { backgroundColor: C.bg, color: C.textSecondary, borderColor: '#E8A33D20' }}>🏦 Transferencia</button>
                      </div>
                      {customer.paymentMethod === 'efectivo' && (
                        <div className="ml-2"><input type="number" placeholder={`¿Con cuánto vas a pagar? (Total: $${total})`} value={customer.cashAmount} onChange={e => setCustomer({ ...customer, cashAmount: e.target.value })} className="w-full px-4 py-3 rounded-xl text-sm font-medium border focus:outline-none transition-colors" style={{ backgroundColor: C.bg, borderColor: '#E8A33D20', color: C.textPrimary }} /></div>
                      )}
                      {customer.paymentMethod === 'transferencia' && (
                        <div className="ml-2 p-4 rounded-xl border" style={{ backgroundColor: '#FFF', borderColor: C.gold + '40' }}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Landmark size={28} strokeWidth={1.5} style={{ color: C.primary }} />
                              <h4 className="font-black text-sm uppercase tracking-wider" style={{ color: C.primary }}>Datos Bancarios</h4>
                            </div>
                            <button onClick={copyBankInfo} className="text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors" style={{ backgroundColor: `${C.gold}10`, color: C.primary, borderColor: C.gold + '30' }}>
                              {copied ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                            </button>
                          </div>
                          <div className="text-sm space-y-1.5 font-medium" style={{ color: C.textSecondary }}>
                            <p><span className="font-bold" style={{ color: C.textPrimary }}>Institución:</span> {clientConfig.bankInfo.institucion}</p>
                            <p><span className="font-bold" style={{ color: C.textPrimary }}>Beneficiario:</span> {clientConfig.bankInfo.account_holder}</p>
                            <p><span className="font-bold" style={{ color: C.textPrimary }}>CLABE:</span> {clientConfig.bankInfo.clabe}</p>
                          </div>
                          <div className="mt-3 pt-3 border-t flex items-start gap-2 text-xs font-bold" style={{ borderColor: C.gold + '20', color: C.primary }}>
                            <span>📸</span>
                            <p>Envía tu comprobante de pago al WhatsApp para confirmar tu pedido.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <textarea placeholder="¿Notas adicionales? (Sin cebolla, extra salsa...)" value={customer.notes} onChange={e => setCustomer({ ...customer, notes: e.target.value })} className="w-full px-5 py-4 rounded-2xl text-sm font-medium border focus:outline-none min-h-[80px] resize-none" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20', color: C.textPrimary }} />
                  </div>
                )}
              </div>

              {cart.length > 0 && step !== 'success' && (
                <div className="p-6 border-t z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]" style={{ backgroundColor: C.cardBg, borderColor: '#E8A33D20' }}>
                  <div className="flex justify-between items-end mb-5">
                    <span className="font-bold uppercase tracking-wider text-xs" style={{ color: C.textSecondary }}>Total ({itemCount} items)</span>
                    <span className="text-3xl font-black leading-none" style={{ fontFamily: "'Playfair Display', Georgia, serif", color: C.primary }}>${total.toFixed(2)}</span>
                  </div>
                  {step === 'cart' ? (
                    <button onClick={() => setStep('details')} className="w-full py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all hover:scale-[1.02] shadow-lg" style={{ backgroundColor: C.primary, color: '#fff' }}>Continuar Pedido</button>
                  ) : (
                    <div className="flex gap-3">
                      <button onClick={() => setStep('cart')} className="px-5 py-4 rounded-xl font-black uppercase text-sm border transition-colors" style={{ borderColor: '#E8A33D20', color: C.textSecondary }}><ChevronLeft size={18} /></button>
                      <button onClick={sendWhatsApp} className="flex-1 py-4 rounded-xl font-black text-base uppercase tracking-wide transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg" style={{ backgroundColor: '#25D366', color: 'white' }}>Pedir por WhatsApp</button>
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
            style={{ backgroundColor: C.cardBg, color: C.primary, borderColor: '#E8A33D20' }}
          >+1 {toast}</motion.div>
        )}
      </AnimatePresence>

      {/* ═══ WHATSAPP FLOTANTE ═══ */}
      <a href={`https://wa.me/${clientConfig.phone}?text=${encodeURIComponent('¡Hola! Quiero hacer un pedido 🛒')}`} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg border-2 transition-all hover:scale-110"
        style={{ backgroundColor: '#25D366', color: 'white', borderColor: C.bg }}
      ><svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg></a>

      {/* Demo disclaimer */}
      <div className="w-full text-center pb-6 pt-2"><p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: `${C.textSecondary}60` }}>* Precios mostrados son de carácter ilustrativo para este demo.</p></div>
    </div>
    </>
  );
}
