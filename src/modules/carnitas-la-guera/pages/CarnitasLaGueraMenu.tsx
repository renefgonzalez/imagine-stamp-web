import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Plus, Minus, X, Search, Phone, MapPin,
  Clock, ChefHat, Coffee, Flame, UtensilsCrossed,
  ShoppingBag, User, Wallet, Check, ArrowRight, ChevronLeft,
  Copy, Landmark, Sparkles, Star, Heart, ThumbsUp
} from 'lucide-react';
import { clientConfig } from '../config';
import logoImg from '../assets/logo.png';
import heroImg from '../assets/hero-carnitas.webp';
import { addOrder, KitchenOrder, printKitchenTicket } from '../utils/kitchenOrders';
import { GlobalFooter } from '../../../components/common/GlobalFooter';

const C = clientConfig.colors;

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  badge?: string;
  description?: string;
  image?: string;
  highlight?: boolean;
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
  { id: 'carnitas', name: 'Carnitas', icon: Flame, tag: '¡Doraditas!' },
  { id: 'guisados', name: 'Arma tu Antojo', icon: ChefHat, tag: 'A tu gusto' },
  { id: 'menudo', name: 'Menudo', icon: UtensilsCrossed, tag: 'Fines de semana' },
  { id: 'bebidas', name: 'Bebidas', icon: Coffee, tag: 'Calientitas' },
  { id: 'extras', name: 'Extras', icon: ShoppingBag, tag: 'Para acompañar' },
];

const GUISOS = [
  'Chile con queso', 'Nopales con carne', 'Papas con chorizo',
  'Huevo en salsa', 'Picadillo', 'Carnitas guisadas', 'Chicharrón prensado',
  'Huitlacoche', 'Tinga de pollo', 'Mole verde', 'Chorizo con queso',
  'Cochinita pibil', 'Champiñones', 'Papas a la mexicana',
];

const BASES_GUISADO = [
  { id: 'taco-guiso', name: 'Taco de Guisado', price: 10, icon: '🌮' },
  { id: 'quesadilla-guiso', name: 'Quesadilla de Guisado', price: 25, icon: '🧀' },
  { id: 'gordita-guiso', name: 'Gordita de Guisado', price: 25, icon: '🫓' },
  { id: 'sope-guiso', name: 'Sope de Guisado', price: 35, icon: '🫓' },
  { id: 'tostada-guiso', name: 'Tostada de Guisado', price: 55, icon: '🌮' },
];

const imgCarnitas = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80';
const imgGordita = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80';
const imgMenudo = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80';
const imgDrink = 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80';
const imgCoffee = 'https://images.unsplash.com/photo-1582221665046-2b474cbdd3d7?w=500&q=80';

const MENU: MenuItem[] = [
  { id: 'taco-carnitas', name: 'Taco de Carnitas', price: 25, category: 'carnitas', badge: '⭐ El Más Vendido', description: 'Maciza, cuerito, buche o surtida en tortilla recién hecha.', image: imgCarnitas },
  { id: 'quesa-chica', name: 'Quesadilla Chica de Carnitas', price: 50, category: 'carnitas', description: 'Queso oaxaca fundido con crujientes carnitas.', image: imgGordita },
  { id: 'quesa-grande', name: 'Quesadilla Grande de Carnitas', price: 80, category: 'carnitas', badge: '🔥 Bien Surtida', description: 'Porción generosa ideal para un gran hambre.', image: imgGordita },
  { id: 'gorda-chica', name: 'Gordita Chica de Carnitas', price: 50, category: 'carnitas', description: 'Masa frita al momento rellena de jugosas carnitas.', image: imgCarnitas },
  { id: 'gorda-grande', name: 'Gordita Grande de Carnitas', price: 80, category: 'carnitas', badge: '👑 La Favorita', description: 'Nuestra especialidad de la casa.', image: imgGordita },
  { id: 'tostada-carnitas', name: 'Tostada de Carnitas', price: 80, category: 'carnitas', description: 'Crujiente tostada con frijolitos, carnitas y crema.', image: imgCarnitas },
  { id: 'baguette', name: 'Baguette de Carnitas', price: 80, category: 'carnitas', description: 'Pan crujiente estilo gourmet repleto de carnitas.', image: imgGordita },
  { id: 'torta', name: 'Torta de Carnitas', price: 50, category: 'carnitas', description: 'Bolillo artesanal doradito con aguacate y carnitas.', image: imgGordita },
  { id: 'sope-carnitas', name: 'Sope de Carnitas', price: 60, category: 'carnitas', description: 'Base pellizcada de maíz con lechuga, crema y carnitas.', image: imgCarnitas },
  { id: 'kilo', name: 'Kilo de Carnitas', price: 280, category: 'carnitas', badge: '🔥 Ahorro Familiar (Rinde 4-5 pers.)', description: 'Incluye tortillas recién hechas y salsas al gusto.', image: imgCarnitas, highlight: true },
  { id: 'medio', name: 'Medio Kilo de Carnitas', price: 145, category: 'carnitas', badge: '👨‍👩‍👧 Rinde 2-3 personas', description: 'Ideal para compartir en pareja o pequeña familia.', image: imgCarnitas },
  { id: 'pancita-chica', name: 'Pancita Chica (Menudo)', price: 100, category: 'menudo', badge: '🌶️ Fin de Semana', description: 'Menudo bien sazonado con oregano y cebollita.', image: imgMenudo },
  { id: 'pancita-grande', name: 'Pancita Grande (Menudo)', price: 150, category: 'menudo', badge: '🌶️ Fin de Semana', description: 'Plato reconfortante súper servido.', image: imgMenudo },
  { id: 'cafe-olla', name: 'Café de Olla Tradicional', price: 30, category: 'bebidas', badge: '☕ Recién Hecho', description: 'Con piloncillo y varita de canela natural.', image: imgCoffee },
  { id: 'atole-guayaba', name: 'Atole de Guayaba', price: 35, category: 'bebidas', badge: '✨ Receta Casera', description: 'Cremoso, frutal y bien calientito.', image: imgDrink },
  { id: 'champurrado', name: 'Champurrado de Chocolate', price: 35, category: 'bebidas', badge: '🍫 Delicioso', description: 'Atole espeso de maíz con chocolate abuelita.', image: imgCoffee },
  { id: 'agua-sabor', name: 'Agua Fresca del Día', price: 30, category: 'bebidas', description: 'Horchata, Jamaica o Tamarindo de fruta natural.', image: imgDrink },
  { id: 'jugo-naranja', name: 'Jugo de Naranja Natural', price: 45, category: 'bebidas', description: 'Exprimidito al momento.', image: imgDrink },
  { id: 'chancla', name: 'Chancla (Salsa Verde o Roja)', price: 20, category: 'extras', description: 'Antojito poblano bañado en salsa especiada.', image: imgGordita },
  { id: 'pan', name: 'Pan de Avena con Coco', price: 20, category: 'extras', description: 'El postrecito casero perfecto para tu café.', image: imgGordita },
  { id: 'docena-tortillas', name: 'Docena de Tortillas de Maíz', price: 25, category: 'extras', description: 'Calientitas de la maquina.', image: imgGordita },
];

export default function CarnitasLaGueraMenu() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [activeCat, setActiveCat] = useState('carnitas');
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', phone: '', deliveryMethod: 'recoger', address: '',
    paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: ['Salsa Verde Martajada']
  });
  const [toastItem, setToastItem] = useState<{ name: string; price: number } | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [lastOrder, setLastOrder] = useState<KitchenOrder | null>(null);

  const [selectedBase, setSelectedBase] = useState<string | null>('taco-guiso');
  const [selectedGuiso, setSelectedGuiso] = useState<string | null>(null);
  const [guisoQty, setGuisoQty] = useState(1);

  const copyBankInfo = () => {
    const info = `${clientConfig.bankInfo.institucion}\n${clientConfig.bankInfo.account_holder}\n${clientConfig.bankInfo.clabe}`;
    navigator.clipboard.writeText(info).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
  const hasDrinksInCart = cart.some(i => i.category === 'bebidas');

  const addToCart = (item: MenuItem, extra?: { guiso?: string }) => {
    setCart(prev => {
      const key = extra?.guiso ? `${item.id}__${extra.guiso}` : item.id;
      const exist = prev.find(i => (extra?.guiso ? `${i.id}__${i.guiso}` : i.id) === key);
      if (exist) return prev.map(i => (extra?.guiso ? `${i.id}__${i.guiso}` : i.id) === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, guiso: extra?.guiso }];
    });

    setToastItem({ name: extra?.guiso ? `${item.name} (${extra.guiso})` : item.name, price: item.price });
    setTimeout(() => setToastItem(null), 2500);
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
      addToCart({
        id: `guisado-${Date.now()}-${i}`,
        name: `${base.name} de ${selectedGuiso}`,
        price: base.price,
        category: 'guisados',
        description: 'Recién preparado a la plancha'
      }, { guiso: selectedGuiso });
    }
    setSelectedGuiso(null);
    setGuisoQty(1);
  };

  const toggleSalsa = (salsaName: string) => {
    setCustomer(prev => {
      const exists = prev.salsas.includes(salsaName);
      return {
        ...prev,
        salsas: exists ? prev.salsas.filter(s => s !== salsaName) : [...prev.salsas, salsaName]
      };
    });
  };

  const printTicket = () => {
    if (lastOrder) {
      printKitchenTicket(lastOrder);
      return;
    }

    const order: KitchenOrder = {
      id: `CG-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      items: cart.map(i => ({ ...i })),
      customer: { ...customer },
      total,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    printKitchenTicket(order);
  };

  const sendWhatsApp = () => {
    if (!customer.name || !customer.phone || (customer.deliveryMethod === 'domicilio' && !customer.address)) {
      setErrors({
        name: !customer.name,
        phone: !customer.phone,
        address: customer.deliveryMethod === 'domicilio' && !customer.address
      });
      return;
    }

    const items = cart.map((p, idx) => {
      const displayName = p.guiso ? `${p.name} (${p.guiso})` : p.name;
      return `${idx + 1}. ${displayName} x${p.quantity} — $${p.price * p.quantity}`;
    }).join('\n');

    let msg = `🛒 *CARNITAS Y GORDITAS LA GÜERA — Nuevo Pedido*\n\n`;
    msg += `👤 *Cliente:* ${customer.name}\n`;
    msg += `📞 *WhatsApp:* ${customer.phone}\n`;
    msg += `📍 *Entrega:* ${customer.deliveryMethod === 'recoger' ? 'Paso a recoger al local' : 'Envío a domicilio'}\n`;
    if (customer.deliveryMethod === 'domicilio') msg += `🏠 *Dirección:* ${customer.address}\n`;
    msg += `💳 *Pago:* ${customer.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}`;
    if (customer.paymentMethod === 'efectivo' && customer.cashAmount) msg += ` (Paga con $${customer.cashAmount})`;
    if (customer.salsas.length > 0) msg += `\n🌶️ *Salsas solicitadas:* ${customer.salsas.join(', ')}`;
    msg += `\n📝 *Notas:* ${customer.notes || 'Sin especificaciones'}\n\n`;
    msg += `📋 *Detalle del Pedido:*\n${items}\n\n`;
    msg += `💰 *TOTAL A PAGAR: $${total} MXN*`;

    const order = addOrder({
      items: cart.map(i => ({ ...i })),
      customer: { ...customer },
      total,
      whatsappUrl: `https://wa.me/${clientConfig.phone}?text=${encodeURIComponent(msg)}`,
    });
    setLastOrder(order);

    setStep('success');
    setTimeout(() => {
      window.location.href = order.whatsappUrl!;
      setCart([]);
      setCustomer({
        name: '', phone: '', deliveryMethod: 'recoger', address: '',
        paymentMethod: 'efectivo', cashAmount: '', notes: '', salsas: ['Salsa Verde Martajada']
      });
      setStep('cart');
      setIsOpen(false);
    }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,800;1,700&display=swap');
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="min-h-screen font-['Plus_Jakarta_Sans',_system-ui,_sans-serif] selection:bg-[#C1440E] selection:text-white" style={{ backgroundColor: C.bg, color: C.textPrimary }}>
        
        {/* ═══ PAPEL PICADO BG PATTERN ═══ */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 20% 10%, #E85D7555 0%, transparent 50%), radial-gradient(circle at 80% 30%, #0E959455 0%, transparent 50%), radial-gradient(circle at 50% 80%, #C1440E55 0%, transparent 40%)' }} />

        {/* ═══ STICKY GLASS HEADER ═══ */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b shadow-sm transition-all" style={{ backgroundColor: '#FFFBF7ee', borderColor: '#E8A33D30' }}>
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <img src={logoImg} alt="La Güera" className="h-10 md:h-12 w-auto object-contain shrink-0 drop-shadow-sm" />
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C1440E] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C1440E]"></span>
                </span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base md:text-lg font-extrabold tracking-tight truncate" style={{ color: C.primary }}>
                  {clientConfig.businessName}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: C.textSecondary }}>
                  <MapPin size={10} className="text-[#C1440E]" /> Carnitas & Antojitos Caseros
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="/#/carnitas-la-guera/cocina"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-wider border transition-all"
                style={{ borderColor: '#E8A33D50', color: C.textSecondary, backgroundColor: '#fff' }}
              >
                <ChefHat size={16} style={{ color: C.primary }} /> Cocina
              </a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsOpen(true); setStep('cart'); }}
                className="relative px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#C1440E]/20 transition-all border border-white/20"
                style={{ backgroundColor: C.primary, color: '#fff' }}
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline">Mi Pedido</span>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-inner" style={{ backgroundColor: C.gold, color: '#000' }}>
                    {itemCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </header>

        {/* ═══ MAIN CONTENT CONTAINER ═══ */}
        <div className="relative z-10 max-w-5xl mx-auto px-4">

          {/* ═══ HERO BANNER PREMIUM ═══ */}
          <div className="relative w-full rounded-[32px] overflow-hidden my-6 shadow-2xl border" style={{ borderColor: `${C.gold}30` }}>
            <img src={heroImg} alt="Carnitas doradas" className="absolute inset-0 w-full h-full object-cover transform scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative z-10 py-12 md:py-16 text-center px-4 max-w-2xl mx-auto">
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 text-xs font-bold uppercase tracking-[0.18em] bg-white/10 backdrop-blur-md text-amber-200 border-amber-300/30 shadow-lg"
              >
                <Sparkles size={14} className="text-[#E8A33D]" /> Sazón 100% Tradicional
              </motion.div>

              <div className="flex justify-center mb-3">
                <img src={logoImg} alt="La Güera Logo" className="h-28 md:h-36 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
              </div>

              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2 font-['Playfair_Display'] italic drop-shadow-md">
                "Carnitas bien doraditas y gorditas hechas con amor"
              </h2>

              <p className="text-xs md:text-sm max-w-md mx-auto leading-relaxed drop-shadow-md text-zinc-200 font-medium mb-6">
                Preparadas diariamente con ingredientes frescos. ¡Pedí para recoger o directo a tu domicilio!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveCat('carnitas'); window.scrollTo({ top: 480, behavior: 'smooth' }); }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: C.gold, color: '#2B1B12' }}
                >
                  Ver El Menú <ArrowRight size={16} />
                </motion.button>

                <a
                  href={`https://wa.me/${clientConfig.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all border border-white/30 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 text-center"
                >
                  💬 Pedir por WhatsApp
                </a>
              </div>
            </motion.div>
          </div>

          {/* ═══ PAPEL PICADO INTERACTIVO BANNER ═══ */}
          <div className="flex justify-center -mt-4 mb-6 relative z-10">
            <div className="flex gap-2.5 overflow-hidden py-1">
              {[
                { color: C.accent, name: '🌶️' },
                { color: C.secondary, name: '🌮' },
                { color: C.gold, name: '🫓' },
                { color: C.primary, name: '🥑' },
                { color: C.accent, name: '🥤' },
              ].map((banner, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -3, 0], rotate: [0, i % 2 === 0 ? 1.5 : -1.5, 0] }}
                  transition={{ duration: 3.5, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-16 rounded-b-xl flex flex-col items-center justify-center text-white text-sm shadow-md border-t-2 border-white/40"
                  style={{ backgroundColor: banner.color }}
                >
                  <span className="text-base drop-shadow">{banner.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ═══ CATEGORÍAS TIPO CHIP STICKY ═══ */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 mb-6 sticky top-[68px] z-30 pt-1" style={{ backgroundColor: `${C.bg}ee`, backdropFilter: 'blur(12px)' }}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCat === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setActiveCat(cat.id); setSearch(''); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition-all shrink-0 border shadow-sm"
                  style={{
                    backgroundColor: isActive ? C.primary : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : C.textSecondary,
                    borderColor: isActive ? C.primary : '#E8A33D25',
                    boxShadow: isActive ? '0 4px 14px rgba(193,68,14,0.3)' : 'none'
                  }}
                >
                  <Icon size={16} className={isActive ? 'text-amber-200' : 'text-[#C1440E]'} />
                  <span>{cat.name}</span>
                  {isActive && <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-white/20 text-white font-bold ml-1">{cat.tag}</span>}
                </motion.button>
              );
            })}
          </div>

          {/* ═══ BUSCADOR ═══ */}
          {activeCat !== 'guisados' && (
            <div className="relative mb-6">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-900/40" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar taco, pancita, bebida o agua fresca..."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C1440E]/40 transition-all shadow-sm border bg-white"
                style={{ color: C.textPrimary, borderColor: '#E8A33D30' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600">
                  Limpiar
                </button>
              )}
            </div>
          )}

          {/* ═══ SECCIONES DEL MENÚ ═══ */}
          <AnimatePresence mode="wait">
            {activeCat === 'carnitas' && (
              <motion.div key="carnitas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-extrabold font-['Playfair_Display'] italic" style={{ color: C.primary }}>
                      Carnitas Tradicionales
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: C.textSecondary }}>Doradas lentamente en su manteca casera</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(item => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -6 }}
                      className={`rounded-3xl border overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col bg-white relative ${item.highlight ? 'ring-2 ring-[#E8A33D]' : ''}`}
                      style={{ borderColor: '#E8A33D20' }}
                    >
                      {item.badge && (
                        <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-md text-white bg-[#C1440E]/90 border border-white/20">
                          {item.badge}
                        </div>
                      )}

                      {item.image && (
                        <div className="w-full h-44 overflow-hidden relative group">
                          <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        </div>
                      )}

                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-extrabold text-base leading-tight mb-1" style={{ color: C.textPrimary }}>{item.name}</h4>
                        {item.description && <p className="text-xs mb-4 line-clamp-2" style={{ color: C.textSecondary }}>{item.description}</p>}
                        
                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-amber-900/5">
                          <div>
                            <span className="text-xs font-bold block text-zinc-400 uppercase tracking-wider">Precio</span>
                            <span className="text-xl font-extrabold tracking-tight" style={{ color: C.primary }}>${item.price} <span className="text-[10px] font-medium text-zinc-500">MXN</span></span>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToCart(item)}
                            className="px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md text-white transition-all"
                            style={{ backgroundColor: C.secondary }}
                          >
                            <Plus size={16} /> Agregar
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ CONSTRUCTOR DE GUISADOS "ARMA TU ANTOJO" ═══ */}
            {activeCat === 'guisados' && (
              <motion.div key="guisados" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
                <div className="mb-6">
                  <h3 className="text-2xl font-extrabold font-['Playfair_Display'] italic" style={{ color: C.primary }}>
                    Arma tu Antojo a tu Gusto 👨‍🍳
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: C.textSecondary }}>Selecciona tu base favorita y combínala con el guisado recién preparado que más se te antoje.</p>
                </div>

                {/* PASO 1: BASE */}
                <div className="bg-white rounded-3xl p-6 border shadow-sm mb-6" style={{ borderColor: '#E8A33D25' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-full text-white font-extrabold text-xs flex items-center justify-center shadow-md" style={{ backgroundColor: C.primary }}>1</span>
                    <h4 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: C.textPrimary }}>Elige la Base</h4>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {BASES_GUISADO.map(base => {
                      const isSelected = selectedBase === base.id;
                      return (
                        <motion.button
                          key={base.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedBase(base.id)}
                          className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between ${isSelected ? 'shadow-md ring-2 ring-[#C1440E]/20' : ''}`}
                          style={{
                            backgroundColor: isSelected ? '#FFF8F0' : '#FFFFFF',
                            borderColor: isSelected ? C.primary : '#E8A33D20',
                            color: isSelected ? C.primary : C.textPrimary
                          }}
                        >
                          <span className="text-2xl mb-1">{base.icon}</span>
                          <span className="text-xs font-extrabold leading-tight mb-1">{base.name.replace(' de Guisado', '')}</span>
                          <span className="text-sm font-extrabold" style={{ color: C.gold }}>${base.price}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 2: GUISO */}
                <div className="bg-white rounded-3xl p-6 border shadow-sm mb-6" style={{ borderColor: '#E8A33D25' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-7 h-7 rounded-full text-white font-extrabold text-xs flex items-center justify-center shadow-md" style={{ backgroundColor: C.accent }}>2</span>
                    <h4 className="font-extrabold text-sm uppercase tracking-wider" style={{ color: C.textPrimary }}>Elige tu Guisado Favorito</h4>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {GUISOS.map(guiso => {
                      const isSelected = selectedGuiso === guiso;
                      return (
                        <motion.button
                          key={guiso}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedGuiso(guiso)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5"
                          style={{
                            backgroundColor: isSelected ? C.accent : '#FFFBF7',
                            color: isSelected ? '#FFFFFF' : C.textSecondary,
                            borderColor: isSelected ? C.accent : '#E8A33D20',
                            boxShadow: isSelected ? '0 4px 12px rgba(232,93,117,0.3)' : 'none'
                          }}
                        >
                          {isSelected && <Check size={14} />}
                          <span>{guiso}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 3: CONFIRMAR AGREGAR */}
                {selectedGuiso && selectedBase && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-[#C1440E] to-[#E85D75] text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-amber-200">¡Listo para agregar!</span>
                      <h4 className="text-xl font-extrabold mt-1">
                        {BASES_GUISADO.find(b => b.id === selectedBase)?.name} de <span className="underline decoration-amber-300">{selectedGuiso}</span>
                      </h4>
                      <p className="text-xs text-amber-100 mt-0.5">
                        ${BASES_GUISADO.find(b => b.id === selectedBase)?.price} MXN c/u
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/20">
                        <button onClick={() => setGuisoQty(Math.max(1, guisoQty - 1))} className="w-8 h-8 font-extrabold text-white text-lg rounded-lg hover:bg-white/20 flex items-center justify-center">-</button>
                        <span className="w-8 text-center font-extrabold text-sm">{guisoQty}</span>
                        <button onClick={() => setGuisoQty(guisoQty + 1)} className="w-8 h-8 font-extrabold text-white text-lg rounded-lg hover:bg-white/20 flex items-center justify-center">+</button>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddGuisado}
                        className="px-6 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider bg-white text-[#C1440E] shadow-lg flex items-center gap-2"
                      >
                        <Plus size={16} /> Agregar al Pedido
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ═══ MENUDO ═══ */}
            {activeCat === 'menudo' && (
              <motion.div key="menudo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
                <div className="mb-4">
                  <h3 className="text-2xl font-extrabold font-['Playfair_Display'] italic" style={{ color: C.primary }}>
                    Menudo Calientito 🍲
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: C.textSecondary }}>El clásico levanta-muertos de los fines de semana</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map(item => (
                    <div key={item.id} className="rounded-3xl border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col bg-white" style={{ borderColor: '#E8A33D20' }}>
                      {item.image && (
                        <div className="w-full h-48 overflow-hidden relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.badge && <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#C1440E] text-white shadow-md">{item.badge}</div>}
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-extrabold text-lg" style={{ color: C.textPrimary }}>{item.name}</h4>
                          <p className="text-xs mt-1" style={{ color: C.textSecondary }}>{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-amber-900/5">
                          <span className="text-2xl font-extrabold" style={{ color: C.primary }}>${item.price} <span className="text-xs font-normal">MXN</span></span>
                          <button onClick={() => addToCart(item)} className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-1" style={{ backgroundColor: C.secondary }}>
                            <Plus size={16} /> Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ BEBIDAS ═══ */}
            {activeCat === 'bebidas' && (
              <motion.div key="bebidas" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
                <div className="mb-4">
                  <h3 className="text-2xl font-extrabold font-['Playfair_Display'] italic" style={{ color: C.primary }}>
                    Bebidas Tradicionales ☕
                  </h3>
                  <p className="text-xs font-semibold" style={{ color: C.textSecondary }}>El complemento perfecto para tus carnitas y gorditas</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map(item => (
                    <div key={item.id} className="rounded-3xl border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col bg-white" style={{ borderColor: '#E8A33D20' }}>
                      {item.image && (
                        <div className="w-full h-36 overflow-hidden relative">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          {item.badge && <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E8A33D] text-black shadow-sm">{item.badge}</div>}
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h4 className="font-bold text-sm" style={{ color: C.textPrimary }}>{item.name}</h4>
                          <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-amber-900/5">
                          <span className="text-lg font-extrabold" style={{ color: C.primary }}>${item.price}</span>
                          <button onClick={() => addToCart(item)} className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1" style={{ backgroundColor: C.secondary }}>
                            <Plus size={14} /> Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ═══ EXTRAS ═══ */}
            {activeCat === 'extras' && (
              <motion.div key="extras" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pb-24">
                <div className="mb-4">
                  <h3 className="text-2xl font-extrabold font-['Playfair_Display'] italic" style={{ color: C.primary }}>
                    Extras & Complementos 🛍️
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {filtered.map(item => (
                    <div key={item.id} className="rounded-2xl border p-4 bg-white flex items-center justify-between shadow-sm" style={{ borderColor: '#E8A33D20' }}>
                      <div>
                        <h4 className="font-bold text-sm">{item.name}</h4>
                        <span className="text-sm font-extrabold" style={{ color: C.primary }}>${item.price}</span>
                      </div>
                      <button onClick={() => addToCart(item)} className="p-2 rounded-xl text-white shadow-sm" style={{ backgroundColor: C.secondary }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ═══ FLOATING BAR FOR MOBILE/DESKTOP ═══ */}
        {itemCount > 0 && !isOpen && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-6 left-4 right-4 max-w-md mx-auto z-40">
            <button
              onClick={() => { setIsOpen(true); setStep('cart'); }}
              className="w-full py-4 px-6 rounded-2xl font-extrabold text-sm uppercase tracking-wider text-white shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-md"
              style={{ backgroundColor: C.primary }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShoppingCart size={18} />
                </div>
                <span>Ver Mi Pedido ({itemCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-amber-200">${total} MXN</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </motion.div>
        )}

        {/* ═══ TOAST NOTIFICATION ═══ */}
        <AnimatePresence>
          {toastItem && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-24 right-4 z-50 bg-[#2B1B12] text-white px-4 py-3 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check size={16} />
              </div>
              <div className="pr-2">
                <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Agregado al carrito</p>
                <p className="text-xs font-bold truncate max-w-[180px]">{toastItem.name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ MODAL CART DRAWER ═══ */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-md bg-[#FFFBF7] h-full shadow-2xl flex flex-col z-10"
              >
                {/* DRAWER HEADER */}
                <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#E8A33D20', backgroundColor: '#FFFFFF' }}>
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={20} style={{ color: C.primary }} />
                    <h3 className="font-extrabold text-base" style={{ color: C.textPrimary }}>
                      {step === 'cart' && 'Tu Pedido'}
                      {step === 'details' && 'Datos de Entrega'}
                      {step === 'success' && '¡Pedido Enviado!'}
                    </h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
                    <X size={20} />
                  </button>
                </div>

                {/* DRAWER BODY */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {step === 'cart' && (
                    <>
                      {cart.length === 0 ? (
                        <div className="text-center py-16">
                          <span className="text-5xl block mb-3">🌮</span>
                          <p className="font-bold text-sm" style={{ color: C.textPrimary }}>Tu carrito está vacío</p>
                          <p className="text-xs text-zinc-400 mt-1">Agrega unos ricos tacos o tortas para empezar.</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3">
                            {cart.map((item, idx) => (
                              <div key={idx} className="bg-white rounded-2xl p-4 border shadow-sm flex items-center justify-between" style={{ borderColor: '#E8A33D20' }}>
                                <div className="min-w-0 pr-2">
                                  <h5 className="font-bold text-xs truncate">{item.name}</h5>
                                  <span className="text-xs font-extrabold" style={{ color: C.primary }}>${item.price * item.quantity} MXN</span>
                                </div>
                                <div className="flex items-center gap-2 border rounded-xl p-1 bg-zinc-50" style={{ borderColor: '#E8A33D30' }}>
                                  <button onClick={() => updateQty(idx, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">-</button>
                                  <span className="w-4 text-center font-extrabold text-xs">{item.quantity}</span>
                                  <button onClick={() => updateQty(idx, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center font-bold text-xs">+</button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* CROSS SELLING NUDGE */}
                          {!hasDrinksInCart && (
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between">
                              <div className="pr-2">
                                <p className="text-xs font-bold text-amber-900">☕ ¿Un Café de Olla o Atole?</p>
                                <p className="text-[10px] text-amber-700">Combina tus carnitas con una bebida calentita.</p>
                              </div>
                              <button onClick={() => { setIsOpen(false); setActiveCat('bebidas'); }} className="px-3 py-1.5 rounded-xl bg-[#E8A33D] text-black font-extrabold text-[10px] uppercase">
                                Ver Bebidas
                              </button>
                            </div>
                          )}

                          {/* SELECTOR DE SALSAS */}
                          <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: '#E8A33D20' }}>
                            <p className="text-xs font-extrabold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: C.textPrimary }}>
                              🌶️ Elige tus Salsas Gratuiteas:
                            </p>
                            <div className="space-y-2">
                              {clientConfig.salsas.map(salsa => {
                                const isChecked = customer.salsas.includes(salsa.name);
                                return (
                                  <button
                                    key={salsa.id}
                                    onClick={() => toggleSalsa(salsa.name)}
                                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${isChecked ? 'bg-amber-50 border-[#C1440E]' : 'bg-white border-zinc-200'}`}
                                  >
                                    <span>{salsa.name}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100">{salsa.spiciness}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {step === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold mb-1">Nombre Completo *</label>
                        <input
                          value={customer.name}
                          onChange={e => setCustomer({ ...customer, name: e.target.value })}
                          placeholder="Tu nombre"
                          className={`w-full p-3 rounded-xl border text-xs font-semibold ${errors.name ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">Teléfono WhatsApp *</label>
                        <input
                          value={customer.phone}
                          onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                          placeholder="10 dígitos"
                          className={`w-full p-3 rounded-xl border text-xs font-semibold ${errors.phone ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1">Método de Entrega</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setCustomer({ ...customer, deliveryMethod: 'recoger' })}
                            className={`p-3 rounded-xl border text-xs font-bold ${customer.deliveryMethod === 'recoger' ? 'bg-[#C1440E] text-white border-[#C1440E]' : 'bg-white border-zinc-200'}`}
                          >
                            Paso a Recoger
                          </button>
                          <button
                            onClick={() => setCustomer({ ...customer, deliveryMethod: 'domicilio' })}
                            className={`p-3 rounded-xl border text-xs font-bold ${customer.deliveryMethod === 'domicilio' ? 'bg-[#C1440E] text-white border-[#C1440E]' : 'bg-white border-zinc-200'}`}
                          >
                            Envío Domicilio
                          </button>
                        </div>
                      </div>

                      {customer.deliveryMethod === 'domicilio' && (
                        <div>
                          <label className="block text-xs font-bold mb-1">Dirección Completa *</label>
                          <input
                            value={customer.address}
                            onChange={e => setCustomer({ ...customer, address: e.target.value })}
                            placeholder="Calle, número, colonia"
                            className={`w-full p-3 rounded-xl border text-xs font-semibold ${errors.address ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold mb-1">Forma de Pago</label>
                        <select
                          value={customer.paymentMethod}
                          onChange={e => setCustomer({ ...customer, paymentMethod: e.target.value as any })}
                          className="w-full p-3 rounded-xl border text-xs font-semibold bg-white border-zinc-200"
                        >
                          <option value="efectivo">Efectivo</option>
                          <option value="transferencia">Transferencia Bancaria</option>
                        </select>
                      </div>

                      {customer.paymentMethod === 'efectivo' && (
                        <div>
                          <label className="block text-xs font-bold mb-1">¿Con cuánto vas a pagar? (Para cambio)</label>
                          <input
                            value={customer.cashAmount}
                            onChange={e => setCustomer({ ...customer, cashAmount: e.target.value })}
                            placeholder="Ej. $500"
                            className="w-full p-3 rounded-xl border text-xs font-semibold border-zinc-200"
                          />
                        </div>
                      )}

                      {customer.paymentMethod === 'transferencia' && (
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 space-y-2">
                          <p className="text-xs font-bold text-amber-900">Datos Bancarios:</p>
                          <p className="text-xs font-semibold">{clientConfig.bankInfo.institucion}</p>
                          <p className="text-xs">CLABE: <span className="font-mono font-bold">{clientConfig.bankInfo.clabe}</span></p>
                          <button onClick={copyBankInfo} className="px-3 py-1 rounded-lg bg-amber-200 text-amber-900 text-[10px] font-bold">
                            {copied ? '¡Copiado!' : 'Copiar CLABE'}
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold mb-1">Notas especiales</label>
                        <textarea
                          value={customer.notes}
                          onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                          placeholder="Ej. Con harta carne, sin cebolla..."
                          className="w-full p-3 rounded-xl border text-xs font-semibold border-zinc-200"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}

                  {step === 'success' && (
                    <div className="text-center py-12">
                      <span className="text-6xl block mb-4 animate-bounce">🎉</span>
                      <h4 className="font-extrabold text-lg text-emerald-600">¡Pedido Preparado!</h4>
                      <p className="text-xs text-zinc-500 mt-2 mb-6">Redirigiendo a WhatsApp para confirmar tu pedido...</p>
                      <button
                        onClick={printTicket}
                        className="mx-auto py-3 px-6 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                        style={{ borderColor: C.primary, color: C.primary }}
                      >
                        🖨️ Imprimir Ticket para Cocina
                      </button>
                    </div>
                  )}
                </div>

                {/* DRAWER FOOTER */}
                {step !== 'success' && cart.length > 0 && (
                  <div className="p-5 border-t bg-white space-y-3" style={{ borderColor: '#E8A33D20' }}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-zinc-500">Total:</span>
                      <span className="text-xl font-extrabold" style={{ color: C.primary }}>${total} MXN</span>
                    </div>

                    {step === 'cart' ? (
                      <button
                        onClick={() => setStep('details')}
                        className="w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-2"
                        style={{ backgroundColor: C.primary }}
                      >
                        Continuar a Datos de Entrega <ArrowRight size={16} />
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={sendWhatsApp}
                          className="w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-wider text-white shadow-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2"
                        >
                          Enviar Pedido por WhatsApp
                        </button>
                        <button onClick={() => setStep('cart')} className="w-full py-3 rounded-2xl border font-bold text-xs">
                          Atrás
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      <GlobalFooter
        companyName="Carnitas y Gorditas La Güera"
        description="Carnitas y gorditas hechas como en casa, con el sazón tradicional. Tacos, tortas, guisados y antojitos mexicanos."
        whatsappNumber="524271203631"
        phoneNumber="427 120 3631"
        email=""
        instagramUrl=""
        facebookUrl=""
        address="Consulta ubicación por WhatsApp"
        hours="Consulta horarios por WhatsApp"
      />
    </>
  );
}
