import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingBag, X, MessageCircle, ChevronLeft,
  Plus, Minus, Check, Flame, MapPin, Phone, Clock, Star,
  IceCream, Droplet, Coffee, ArrowUp, Instagram, Facebook, Music, Mail
} from 'lucide-react';
import logoMichoacana from '../assets/logo.png';
import heroImage from '../assets/hero.png';

const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// ─── DATA ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'Paletas de Agua', label: 'Paletas de Agua' },
  { id: 'Paletas de Leche', label: 'Paletas de Leche' },
  { id: 'Helados', label: 'Helados' },
  { id: 'Aguas Frescas', label: 'Aguas Frescas' },
  { id: 'Especialidades', label: 'Especialidades' },
  { id: 'Cafetería', label: 'Cafetería' },
];

const FEATURED_IDS = [3, 8, 12, 16, 18];

type Product = {
  id: number;
  name: string;
  description: string;
  image?: string;
  prices: {
    sencillo?: number;
    doble?: number;
    litro?: number;
    medio?: number;
    chico?: number;
    grande?: number;
    normal?: number;
  };
  category: string;
  isPromo?: boolean;
};

const PRODUCTS: Product[] = [
  // ── Paletas de Agua ──
  { id: 1, name: 'Limón', description: 'Refrescante paleta de limón natural', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400', prices: { normal: 20 }, category: 'Paletas de Agua' },
  { id: 2, name: 'Mango con Chile', description: 'Mango natural con un toque de tajín', image: 'https://images.unsplash.com/photo-1555562473-199f3630fbc0?auto=format&fit=crop&q=80&w=400', prices: { normal: 25 }, category: 'Paletas de Agua', isPromo: true },
  { id: 3, name: 'Fresa', description: 'Paleta de fresa natural con trozos de fruta', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400', prices: { normal: 25 }, category: 'Paletas de Agua' },
  { id: 4, name: 'Grosella', description: 'Clásica paleta de grosella', image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=400', prices: { normal: 20 }, category: 'Paletas de Agua' },
  { id: 5, name: 'Piña', description: 'Piña natural', image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&q=80&w=400', prices: { normal: 20 }, category: 'Paletas de Agua' },

  // ── Paletas de Leche ──
  { id: 6, name: 'Vainilla con Membrillo', description: 'Cremosa paleta de vainilla con ate de membrillo', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=400', prices: { normal: 30 }, category: 'Paletas de Leche' },
  { id: 7, name: 'Nuez', description: 'Paleta de leche con trozos abundantes de nuez', image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&q=80&w=400', prices: { normal: 35 }, category: 'Paletas de Leche' },
  { id: 8, name: 'Oreo', description: 'Paleta de leche con galleta Oreo', image: 'https://images.unsplash.com/photo-1570197781417-0a523771fa76?auto=format&fit=crop&q=80&w=400', prices: { normal: 30 }, category: 'Paletas de Leche' },
  { id: 9, name: 'Chocolate', description: 'Doble chocolate cremoso', image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?auto=format&fit=crop&q=80&w=400', prices: { normal: 30 }, category: 'Paletas de Leche' },
  { id: 10, name: 'Rompope', description: 'Tradicional sabor a rompope', image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&q=80&w=400', prices: { normal: 30 }, category: 'Paletas de Leche' },

  // ── Helados ──
  { id: 11, name: 'Helado de Nuez', description: 'Helado cremoso de nuez', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400', prices: { sencillo: 35, doble: 55, litro: 180 }, category: 'Helados' },
  { id: 12, name: 'Helado de Fresa', description: 'Helado de leche con fresa natural', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=400', prices: { sencillo: 30, doble: 50, litro: 150 }, category: 'Helados' },
  { id: 13, name: 'Helado de Vainilla', description: 'Clásico helado de vainilla', image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=400', prices: { sencillo: 30, doble: 50, litro: 150 }, category: 'Helados' },
  { id: 14, name: 'Helado de Chocolate', description: 'Rico chocolate', image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&q=80&w=400', prices: { sencillo: 35, doble: 55, litro: 180 }, category: 'Helados' },

  // ── Aguas Frescas ──
  { id: 15, name: 'Agua de Horchata', description: 'Tradicional horchata con canela', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', prices: { medio: 25, litro: 45 }, category: 'Aguas Frescas' },
  { id: 16, name: 'Agua de Jamaica', description: 'Jamaica natural muy refrescante', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=400', prices: { medio: 20, litro: 35 }, category: 'Aguas Frescas' },
  { id: 17, name: 'Agua de Limón con Chía', description: 'Limón fresco con chía', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400', prices: { medio: 20, litro: 35 }, category: 'Aguas Frescas' },

  // ── Especialidades ──
  { id: 18, name: 'Mangonada', description: 'Nieve de mango con chamoy, tajín y tarugo', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400', prices: { chico: 45, grande: 65 }, category: 'Especialidades' },
  { id: 19, name: 'Fresas con Crema', description: 'Fresas naturales con crema dulce de la casa', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400', prices: { chico: 50, grande: 80 }, category: 'Especialidades' },
  { id: 20, name: 'Nachos', description: 'Nachos con queso derretido y jalapeños', image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=400', prices: { normal: 45 }, category: 'Especialidades' },
  { id: 21, name: 'Dorilocos', description: 'Doritos con cueritos, jícama, pepino, cacahuates, chamoy y salsas', image: 'https://images.unsplash.com/photo-1555562473-199f3630fbc0?auto=format&fit=crop&q=80&w=400', prices: { normal: 60 }, category: 'Especialidades' },

  // ── Cafetería ──
  { id: 22, name: 'Café Americano', description: 'Café negro recién preparado, intenso y aromático', image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&q=80&w=400', prices: { chico: 35, grande: 50 }, category: 'Cafetería' },
  { id: 23, name: 'Capuchino', description: 'Espresso con leche vaporizada y espuma cremosa', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=400', prices: { chico: 45, grande: 60 }, category: 'Cafetería' },
  { id: 24, name: 'Latte', description: 'Espresso con abundante leche vaporizada, suave y cremoso', image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&q=80&w=400', prices: { chico: 45, grande: 60 }, category: 'Cafetería' },
  { id: 25, name: 'Chocolate Caliente', description: 'Chocolate de leche cremoso, perfecto para acompañar', image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f331?auto=format&fit=crop&q=80&w=400', prices: { chico: 40, grande: 55 }, category: 'Cafetería' },
  { id: 26, name: 'Mocha', description: 'Espresso con chocolate y leche vaporizada', image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&q=80&w=400', prices: { chico: 50, grande: 70 }, category: 'Cafetería' },
  { id: 27, name: 'Té Chai Latte', description: 'Té chai especiado con leche vaporizada y canela', image: 'https://images.unsplash.com/photo-1557006021-b85a5e532e5d?auto=format&fit=crop&q=80&w=400', prices: { chico: 45, grande: 65 }, category: 'Cafetería' },
];

type CartItem = {
  id: string;
  product: Product;
  quantity: number;
  selectedPriceType: 'sencillo' | 'doble' | 'litro' | 'medio' | 'chico' | 'grande' | 'normal';
  priceAtTimeOfAdding: number;
};

// ─── UTILS ──────────────────────────────────────────────────────────────────────
const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

const getPriceLabel = (type: string) => {
  if (type === 'sencillo') return 'Sencillo';
  if (type === 'doble') return 'Doble';
  if (type === 'litro') return '1 Litro';
  if (type === 'medio') return '1/2 Litro';
  if (type === 'chico') return 'Chico';
  if (type === 'grande') return 'Grande';
  return '';
};

// ─── COMPONENT ─────────────────────────────────────────────────────────────────
export default function LaMichoacanaMenu() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', deliveryMethod: '', address: '',
    paymentMethod: '', cashAmount: '', notes: '',
  });

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!addedToast) return;
    const t = setTimeout(() => setAddedToast(null), 2200);
    return () => clearTimeout(t);
  }, [addedToast]);

  const displayedProducts = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [searchQuery, activeCategory]);

  const featuredProducts = useMemo(
    () => PRODUCTS.filter(p => FEATURED_IDS.includes(p.id)),
    []
  );

  const cartTotal = cart.reduce((sum, i) => sum + i.priceAtTimeOfAdding * i.quantity, 0);
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const addToCart = (product: Product, priceType: CartItem['selectedPriceType'], priceValue: number) => {
    const cartItemId = `${product.id}-${priceType}`;
    setCart(prev => {
      const exists = prev.find(item => item.id === cartItemId);
      if (exists) return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id: cartItemId, product, quantity: 1, selectedPriceType: priceType, priceAtTimeOfAdding: priceValue }];
    });
    setAddedToast(`${product.name}`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(i =>
      i.id === cartItemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setCartStep(3);
    setTimeout(() => {
      const phoneNumber = '5215536673170'; // Reemplazar con el número real de WhatsApp
      let message = `*¡Hola! Me gustaría hacer un pedido en La Michoacana:*\n\n`;
      message += `*DATOS DEL CLIENTE:*\n`;
      message += `Nombre: ${customerInfo.name}\nTeléfono: ${customerInfo.phone}\n`;
      message += `Entrega: ${customerInfo.deliveryMethod}\n`;
      if (customerInfo.deliveryMethod === 'Envío a domicilio') message += `Dirección: ${customerInfo.address}\n`;
      message += `Pago: ${customerInfo.paymentMethod}\n`;
      if ((customerInfo.paymentMethod === 'Efectivo en sucursal' || customerInfo.paymentMethod === 'Efectivo (Pago contra entrega)') && customerInfo.cashAmount) {
        message += `Pago con: $${customerInfo.cashAmount}\n`;
      }
      if (customerInfo.notes) message += `Notas: ${customerInfo.notes}\n`;
      message += `\n*MI ORDEN:*\n`;
      cart.forEach(item => {
        const typeLabel = item.selectedPriceType !== 'normal' ? ` (${getPriceLabel(item.selectedPriceType)})` : '';
        message += `${item.quantity}x ${item.product.name}${typeLabel} - $${item.priceAtTimeOfAdding * item.quantity}\n`;
      });
      message += `\n*TOTAL: $${cartTotal}*\n`;
      window.location.href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    }, 600);
  };

  const closeCartAndReset = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', deliveryMethod: '', address: '', paymentMethod: '', cashAmount: '', notes: '' });
    setCartStep(1);
    setIsCartOpen(false);
  };


  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 font-sans selection:bg-pink-500/30">

      {/* ═══════════ HEADER ═══════════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden border border-pink-100">
              <img src={logoMichoacana} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#de0061]">
                LA MICHOACANA
              </h2>
              <p className="text-[10px] text-[#de0061] opacity-70 uppercase tracking-widest font-bold -mt-1">El Sabor de la Tradición</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                searchInputRef.current?.focus();
                searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="md:hidden p-2 text-pink-400 hover:text-pink-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <a
              href="https://wa.me/5215536673170"
              className="hidden sm:flex items-center text-[#25D366] hover:opacity-80 transition-opacity"
              title="WhatsApp"
            >
              <MessageCircle className="w-6 h-6" />
            </a>

            <button
              onClick={() => { setIsCartOpen(true); setCartStep(1); }}
              className="relative bg-[#de0061] hover:bg-[#c00050] text-white font-bold px-4 py-2 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-sm uppercase tracking-wider">Orden</span>
              {cartItemCount > 0 && (
                <motion.span
                  key={cartItemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-pink-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-black shadow-sm"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════ ANNOUNCEMENT BAR ═══════════ */}
      <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-fuchsia-500 text-white font-black text-center py-2 px-4 text-sm tracking-wider uppercase overflow-hidden relative shadow-inner">
        <motion.div
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="whitespace-nowrap inline-block"
        >
          ¡Refrescate con nuestros sabores! &nbsp;&mdash;&nbsp; Pide a domicilio por WhatsApp &nbsp;&mdash;&nbsp; 100% Fruta Natural
        </motion.div>
      </div>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden bg-black py-12 md:py-20 mb-8 border-b-4 border-pink-400">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-70"
          style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        {/* Color Overlay to keep it looking pink/magenta but letting image shine through */}
        <div className="absolute inset-0 z-0 bg-[#de0061]/50 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#de0061]/40 to-[#de0061]/80" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto mb-8 border-4 border-white overflow-hidden">
                <img src={logoMichoacana} alt="La Michoacana" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-4">
                Delicias que te hacen <br className="hidden md:block"/> sonreír
              </h1>
              <p className="text-pink-100 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-8">
                Paletas, helados, aguas frescas y botanas preparadas con los mejores ingredientes tradicionales.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/30 text-white shadow-lg hover:bg-white/30 transition-colors cursor-pointer">
                      <IceCream className="w-6 h-6" />
                      <span className="font-bold">Helados Artesanales</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-3 border border-white/30 text-white shadow-lg hover:bg-white/30 transition-colors cursor-pointer">
                      <Droplet className="w-6 h-6" />
                      <span className="font-bold">Aguas Frescas</span>
                  </div>
              </div>
            </motion.div>
        </div>
      </section>

      {/* ═══════════ SEARCH ═══════════ */}
      <div id="menu-start" className="max-w-3xl mx-auto px-4 mb-8">
        <div className="relative shadow-md rounded-2xl overflow-hidden">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-pink-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-100 text-gray-700 placeholder-pink-300 focus:outline-none focus:border-[#de0061] font-medium transition-all"
            placeholder="Busca tu paleta, helado o antojo favorito..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-pink-400 hover:text-[#de0061]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════ CATEGORY PILLS ═══════════ */}
      {!searchQuery && (
        <nav className="max-w-6xl mx-auto px-4 mb-10 overflow-x-auto scrollbar-none">
          <div className="flex gap-3 pb-2 min-w-max justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap shadow-sm border-2 ${
                  activeCategory === cat.id
                    ? 'bg-[#de0061] border-[#de0061] text-white shadow-pink-200 shadow-lg scale-105'
                    : 'bg-white border-pink-100 text-[#de0061] hover:bg-pink-50 hover:border-[#de0061]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <main className="max-w-6xl mx-auto px-4 pb-24">
        {!searchQuery && (
          <div className="text-center mb-10">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block relative"
            >
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#de0061]">
                {activeCategory}
              </h2>
              <div className="w-1/2 h-1.5 bg-pink-400 rounded-full mx-auto mt-2" />
            </motion.div>
          </div>
        )}

        {searchQuery && (
          <h2 className="text-2xl font-black text-gray-700 mb-8 text-center">
            Resultados para <span className="text-[#de0061]">"{searchQuery}"</span>
            <span className="text-gray-400 text-lg"> ({displayedProducts.length})</span>
          </h2>
        )}

        {/* Featured strip */}
        {!searchQuery && activeCategory === CATEGORIES[0].id && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-5 justify-center md:justify-start">
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              <h3 className="text-xl font-black text-[#de0061] uppercase tracking-wider">Favoritos</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => {
                    setActiveCategory(product.category);
                    setTimeout(() => {
                      document.getElementById(`product-${product.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                  }}
                  className="group bg-white border border-pink-100 hover:border-[#de0061] shadow-sm hover:shadow-lg rounded-2xl p-4 text-center transition-all hover:-translate-y-2 cursor-pointer flex flex-col items-center"
                >
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-pink-100 transition-colors">
                     {product.category.includes('Paleta') ? <IceCream className="text-[#de0061] w-6 h-6"/> : 
                      product.category.includes('Agua') ? <Droplet className="text-[#de0061] w-6 h-6"/> :
                      <Star className="text-[#de0061] w-6 h-6"/>}
                  </div>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-[#de0061] transition-colors leading-tight mb-1">{product.name}</p>
                  <p className="text-[#de0061] font-black text-sm mt-auto">
                    ${product.prices.normal || product.prices.sencillo || product.prices.medio || product.prices.chico}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {displayedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-pink-50">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
              <Search className="w-10 h-10 text-pink-300" />
            </div>
            <p className="text-[#de0061] font-bold text-xl">Uy, no encontramos eso</p>
            <p className="text-gray-500 text-sm mt-2">
              Prueba buscar "limón", "helado", "dorilocos"...
            </p>
            <button onClick={() => setSearchQuery('')} className="mt-6 bg-pink-100 text-[#de0061] px-6 py-2 rounded-full text-sm font-bold hover:bg-pink-200 transition-colors">
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product, idx) => {
              return (
                <motion.div
                  key={product.id}
                  id={`product-${product.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.4 }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-pink-100 transition-all hover:-translate-y-1 flex flex-col"
                >
                    {product.image && (
                      <div className="w-full h-48 bg-gray-100 relative group-hover:scale-105 transition-transform duration-500">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-gray-800 font-black text-xl leading-tight group-hover:text-[#de0061] transition-colors">
                          {product.name}
                        </h3>
                        {product.isPromo && (
                          <span className="bg-yellow-400 text-yellow-900 font-black text-[10px] px-2 py-1 rounded-lg uppercase tracking-wider shrink-0 shadow-sm flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Promo
                          </span>
                        )}
                      </div>
                      {product.description && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
                          {product.description}
                        </p>
                      )}

                    <div className="space-y-3 mt-auto">
                      {Object.entries(product.prices).map(([type, price]) =>
                        price !== undefined ? (
                          <div
                            key={type}
                            className="flex items-center justify-between bg-pink-50 rounded-2xl px-4 py-3"
                          >
                            <div className="flex flex-col">
                              {type !== 'normal' && (
                                <span className="text-pink-400 text-[10px] font-bold uppercase tracking-wider">
                                  {getPriceLabel(type)}
                                </span>
                              )}
                              <span className="text-[#de0061] font-black text-lg">${price}</span>
                            </div>
                            <button
                              onClick={() => addToCart(product, type as CartItem['selectedPriceType'], price)}
                              className="bg-white hover:bg-[#de0061] text-[#de0061] hover:text-white font-bold px-4 py-2 rounded-xl transition-all text-sm flex items-center gap-2 border border-pink-200 hover:border-[#de0061] shadow-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Agregar
                            </button>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-white border-t border-pink-100 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 overflow-hidden border-2 border-pink-100">
              <img src={logoMichoacana} alt="La Michoacana" className="w-full h-full object-contain" />
            </div>
            <h4 className="text-xl font-black text-[#de0061] mb-2">LA MICHOACANA</h4>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              Endulzando tu día con las mejores paletas, helados y aguas frescas. ¡Puro sabor y tradición!
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61588353658054" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#de0061] hover:bg-[#de0061] hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/la.miichoacana5" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#de0061] hover:bg-[#de0061] hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@michoacanaa2" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-[#de0061] hover:bg-[#de0061] hover:text-white transition-colors">
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <h4 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-wider">Contáctanos</h4>
             <ul className="space-y-4">
               <li className="flex items-center gap-3 text-gray-600 text-sm">
                 <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                   <Phone className="w-4 h-4 text-[#de0061]" />
                 </div>
                 <a href="tel:+525536673170" className="hover:text-[#de0061] transition-colors">55 3667 3170</a>
               </li>
               <li className="flex items-center gap-3 text-gray-600 text-sm">
                 <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                   <MessageCircle className="w-4 h-4 text-[#de0061]" />
                 </div>
                  <a href="https://wa.me/5215536673170" target="_blank" rel="noreferrer" className="hover:text-[#de0061] transition-colors">Pedidos por WhatsApp</a>
               </li>
                <li className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[#de0061]" />
                  </div>
                  <a href="mailto:la.miichoacana5@gmail.com" className="hover:text-[#de0061] transition-colors break-all">la.miichoacana5@gmail.com</a>
                </li>
             </ul>
          </div>

          {/* Column 3: Location & Hours */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
             <h4 className="text-lg font-black text-gray-800 mb-4 uppercase tracking-wider">Ubícanos</h4>
             <ul className="space-y-4">
               <li className="flex items-start gap-3 text-gray-600 text-sm">
                 <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
                   <MapPin className="w-4 h-4 text-[#de0061]" />
                 </div>
                  <span className="max-w-[200px]">Calle 4 #90 Colonia El Sol, Nezahualcóyotl, Edo. Méx., 57200</span>
               </li>
               <li className="flex items-start gap-3 text-gray-600 text-sm">
                 <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
                   <Clock className="w-4 h-4 text-[#de0061]" />
                 </div>
                  <span className="max-w-[200px]">Lunes a Domingo<br/>9:00 am - 10:00 pm</span>
               </li>
             </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-pink-50">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} La Michoacana El Sabor de la Tradición. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-[#de0061] mt-2 font-bold uppercase tracking-widest">
            Diseñado por Imagine & Stamp
          </p>
        </div>
      </footer>


      {/* ═══════════ CART OVERLAY ═══════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex justify-end"
            onClick={(e) => { if (e.target === e.currentTarget) closeCartAndReset(); }}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-pink-100 bg-pink-50/50">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => cartStep > 1 ? setCartStep(cartStep - 1) : closeCartAndReset()}
                    className="p-2 text-gray-400 hover:text-[#de0061] transition-colors rounded-full hover:bg-pink-100"
                  >
                    {cartStep === 1 ? <X className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                  </button>
                  <h3 className="font-black text-gray-800 text-lg">
                    {cartStep === 1 && 'Tu Orden'}
                    {cartStep === 2 && 'Datos de Envío'}
                    {cartStep === 3 && '¡Ya casi!'}
                  </h3>
                </div>
                {cartStep === 1 && cart.length > 0 && (
                  <button
                    onClick={() => { setCart([]); closeCartAndReset(); }}
                    className="text-xs text-[#de0061] hover:text-[#c00050] font-bold transition-colors bg-pink-50 px-3 py-1.5 rounded-full"
                  >
                    Vaciar
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: Cart items */}
                {cartStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    {cart.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                        <div className="w-20 h-20 mb-6 rounded-full bg-pink-50 flex items-center justify-center">
                          <ShoppingBag className="w-10 h-10 text-pink-300" />
                        </div>
                        <p className="text-gray-700 font-black text-xl mb-2">Tu carrito está vacío</p>
                        <p className="text-gray-500 text-sm max-w-xs">Agrega unas deliciosas paletas o helados para refrescar tu día.</p>
                        <button
                          onClick={closeCartAndReset}
                          className="mt-8 bg-[#de0061] hover:bg-[#c00050] text-white font-bold px-8 py-3.5 rounded-full transition-all text-sm shadow-md"
                        >
                          Ver Menú
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30">
                          {cart.map(item => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-pink-100 shadow-sm"
                            >
                              <div className="w-12 h-12 shrink-0 rounded-xl bg-pink-50 flex items-center justify-center text-[#de0061]">
                                {item.product.category.includes('Paleta') ? <IceCream size={20}/> : 
                                 item.product.category.includes('Agua') ? <Droplet size={20}/> : <IceCream size={20}/>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-bold text-sm truncate">{item.product.name}</p>
                                <p className="text-gray-500 text-xs mt-0.5">
                                  {item.selectedPriceType !== 'normal' ? getPriceLabel(item.selectedPriceType) : 'Normal'}
                                </p>
                                <p className="text-[#de0061] font-black text-sm mt-1">${item.priceAtTimeOfAdding * item.quantity}</p>
                              </div>
                              <div className="flex items-center gap-2 bg-pink-50 rounded-lg p-1 border border-pink-100">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-[#de0061] transition-all"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-gray-800 font-bold w-6 text-center text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-gray-500 shadow-sm hover:text-[#de0061] transition-all"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-6 border-t border-pink-100 bg-white">
                          <div className="flex items-center justify-between mb-6">
                            <span className="text-gray-600 font-bold text-lg">Total</span>
                            <motion.span
                              key={cartTotal}
                              initial={{ scale: 1.3 }}
                              animate={{ scale: 1 }}
                              className="text-3xl font-black text-[#de0061]"
                            >
                              ${cartTotal}
                            </motion.span>
                          </div>
                          <button
                            onClick={() => setCartStep(2)}
                            className="w-full bg-[#de0061] hover:bg-[#c00050] text-white font-black py-4 rounded-2xl transition-all shadow-md text-sm uppercase tracking-wider"
                          >
                            Continuar
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: Customer info */}
                {cartStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col overflow-hidden"
                  >
                    <form onSubmit={handleConfirmOrder} className="flex-1 flex flex-col">
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        
                        {/* Datos Personales */}
                        <div className="space-y-4">
                           <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-pink-100 pb-2 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-pink-100 text-[#de0061] flex items-center justify-center text-xs">1</div>
                             Datos Personales
                           </h4>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Nombre completo</label>
                            <input
                              required
                              type="text"
                              value={customerInfo.name}
                              onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                              placeholder="Ej. María López"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Teléfono (WhatsApp)</label>
                            <input
                              required
                              type="tel"
                              value={customerInfo.phone}
                              onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                              placeholder="55 3667 3170"
                            />
                          </div>
                        </div>

                        {/* Entrega */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-pink-100 pb-2 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-pink-100 text-[#de0061] flex items-center justify-center text-xs">2</div>
                             Método de Entrega
                          </h4>
                          <div>
                            <select
                              required
                              value={customerInfo.deliveryMethod}
                              onChange={e => setCustomerInfo({ ...customerInfo, deliveryMethod: e.target.value, paymentMethod: '' })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium appearance-none"
                            >
                              <option value="">Selecciona cómo recibirás tu orden...</option>
                              <option value="Recoger en sucursal">Pasar a recoger</option>
                              <option value="Envío a domicilio">Envío a domicilio</option>
                            </select>
                          </div>
                          {customerInfo.deliveryMethod === 'Envío a domicilio' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 mt-2">Dirección completa</label>
                              <textarea
                                required
                                value={customerInfo.address}
                                onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium resize-none"
                                placeholder="Calle, número exterior/interior, colonia, referencias (color de casa, entre calles)..."
                                rows={3}
                              />
                            </motion.div>
                          )}
                        </div>

                        {/* Pago */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-sm font-black text-gray-800 uppercase tracking-wider border-b border-pink-100 pb-2 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-pink-100 text-[#de0061] flex items-center justify-center text-xs">3</div>
                             Forma de Pago
                          </h4>
                          <div>
                            <select
                              required
                              value={customerInfo.paymentMethod}
                              onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium appearance-none"
                            >
                              <option value="">Selecciona método de pago...</option>
                              <option value={customerInfo.deliveryMethod === 'Envío a domicilio' ? 'Efectivo (Pago contra entrega)' : 'Efectivo en sucursal'}>
                                Efectivo
                              </option>
                              <option value="Transferencia / Depósito">Transferencia bancaria</option>
                            </select>
                          </div>

                          {(customerInfo.paymentMethod === 'Efectivo en sucursal' || customerInfo.paymentMethod === 'Efectivo (Pago contra entrega)') && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 mt-2">¿Pagas con exacto o necesitas cambio?</label>
                              <input
                                type="text"
                                value={customerInfo.cashAmount}
                                onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium"
                                placeholder={`Ej. Pago con billete de 500 (Total: $${cartTotal})`}
                              />
                            </motion.div>
                          )}

                          {customerInfo.paymentMethod === 'Transferencia / Depósito' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 bg-pink-50 border border-pink-100 rounded-xl p-4">
                              <p className="text-[#de0061] font-bold text-sm mb-2">Datos para transferencia:</p>
                              <div className="space-y-1.5 text-sm text-gray-700 font-medium">
                                <p><strong className="text-gray-900">Banco:</strong> BBVA</p>
                                <p><strong className="text-gray-900">Titular:</strong> La Michoacana Centro</p>
                                <p className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-pink-100 mt-2">
                                  <span className="font-mono text-[#de0061]">012 345 6789 0123 4567</span>
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>
                        
                        <div className="pt-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Notas adicionales (Opcional)</label>
                            <textarea
                              value={customerInfo.notes}
                              onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#de0061] focus:ring-2 focus:ring-pink-100 transition-all font-medium resize-none"
                              placeholder="Ej. Mandar más servilletas, sin chile, etc."
                              rows={2}
                            />
                        </div>

                      </div>

                      <div className="p-6 border-t border-pink-100 bg-white">
                        <button
                          type="submit"
                          className="w-full bg-[#25D366] hover:bg-[#20b958] text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-green-500/20 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-5 h-5" />
                          Enviar Pedido por WhatsApp
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: Success info */}
                {cartStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <Check className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">¡Casi listo!</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-xs">
                      Serás redirigido a WhatsApp para confirmar y enviar tu pedido a nuestra sucursal.
                    </p>
                    <button
                      onClick={closeCartAndReset}
                      className="text-pink-600 font-bold uppercase tracking-wider text-sm hover:underline"
                    >
                      Volver al menú
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Add Toast */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 bg-[#de0061] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="w-4 h-4" />
            ¡{addedToast} agregado!
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB - WhatsApp General */}
      {!isCartOpen && (
        <motion.a
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          href="https://wa.me/5215536673170"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.a>
      )}

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 z-40 bg-white/90 text-pink-600 p-3 rounded-full shadow-lg border border-pink-100 hover:bg-pink-50 transition-colors backdrop-blur-sm"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
