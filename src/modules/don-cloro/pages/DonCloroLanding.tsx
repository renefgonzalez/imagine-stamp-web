// DON CLORO - CASA QUÍMICA - Landing Page & Catálogo Interactivo
// React + Tailwind + Motion + Lucide. Mobile-first, CRO-optimizado, Carrito 2 pasos + WhatsApp.
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Sparkles, Shirt, Droplets, Car, Wind, Droplet,
  Truck, Tag, Shield, Phone, MapPin, Mail, Clock,
  Instagram, Facebook, MessageCircle,
  ArrowRight, ChevronDown, ChevronUp, ExternalLink,
  Menu, X as XIcon, Package, Zap, CheckCircle2,
  ShoppingCart, Trash2, Minus, Plus,
  Copy, Check, Search, HelpCircle, Star, Award,
  Sparkle, Layers, ArrowUpRight
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;
const CART_STORAGE_KEY = 'don_cloro_cart_v1';

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Shirt,
  Droplets,
  Car,
  Wind,
  Droplet,
  Layers,
};

const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'catalogo', label: 'Catálogo' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'mayoreo', label: 'Mayoreo' },
  { id: 'faqs', label: 'Preguntas' },
  { id: 'contacto', label: 'Contacto' },
];

const FAQS = [
  {
    q: '¿Hacen entregas a domicilio en Puebla?',
    a: 'Sí, realizamos envíos a domicilio en la ciudad de Puebla y zona metropolitana (San Andrés Cholula, San Pedro Cholula, Cuautlancingo y Amozoc). El costo y tiempo de entrega se confirman directamente por WhatsApp según tu ubicación.',
  },
  {
    q: '¿A partir de qué cantidad aplica precio de mayoreo?',
    a: 'El precio de mayoreo aplica a partir de presentaciones de 5 Litros, porrones de 20 Litros y compras superiores a $1,000 pesos en surtido. Contáctanos por WhatsApp para enviarte la lista especial para negocios.',
  },
  {
    q: '¿Qué formas de pago aceptan?',
    a: 'Aceptamos pago en efectivo contra entrega y transferencias interbancarias directas (SPEI con confirmación instantánea). Al realizar tu pedido te proporcionamos los datos bancarios.',
  },
  {
    q: '¿Los productos vienen concentrados?',
    a: 'Sí, formulamos productos de alta concentración química con grado institucional y comercial, lo que garantiza mayor rendimiento por litro y un ahorro significativo comparado con productos de supermercado.',
  },
  {
    q: '¿Tienen tienda física para recoger mi pedido?',
    a: 'Sí, puedes hacer tu pedido en línea y pasar a recogerlo en nuestro local ubicado en Calle Turquesa #19, Col. La Joya, Puebla.',
  },
];

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  categoryName?: string;
}

export default function DonCloroLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [cartStep, setCartStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'recoger' as 'recoger' | 'domicilio',
    address: '',
    paymentMethod: 'Efectivo' as 'Efectivo' | 'Transferencia',
    cashAmount: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ name?: string; phone?: string; address?: string }>({});
  const [copiedField, setCopiedField] = useState('');

  // Persistir carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  // Manejo de scroll y título
  useEffect(() => {
    document.title = `${clientConfig.businessFullName} - ${clientConfig.slogan}`;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 500);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i]!.getBoundingClientRect().top <= 140) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll al abrir modales
  useEffect(() => {
    if (isCartOpen || isPrivacyOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, isPrivacyOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2200);
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const cc: Record<string, { bg: string; icon: string; border: string; badge: string; soft: string }> = {
    pink: { bg: 'bg-pink-50', icon: 'text-pink-600', border: 'border-pink-200', badge: 'bg-pink-600', soft: 'bg-pink-500/10 text-pink-600' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', border: 'border-cyan-200', badge: 'bg-cyan-600', soft: 'bg-cyan-500/10 text-cyan-600' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200', badge: 'bg-blue-600', soft: 'bg-blue-500/10 text-blue-600' },
    violet: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200', badge: 'bg-purple-600', soft: 'bg-purple-500/10 text-purple-600' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-200', badge: 'bg-rose-600', soft: 'bg-rose-500/10 text-rose-600' },
  };

  const waMsg = 'Hola Don Cloro, vengo de la página web y me gustaría información y cotización de productos.';
  const waMayoreo = 'Hola Don Cloro, me interesan precios de mayoreo para mi negocio/hogar. ¿Me pueden compartir su catálogo de porrones y lista especial?';

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addToCart = (id: string, name: string, price: number, categoryName?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) {
        return prev.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id, name, price, quantity: 1, categoryName }];
    });
    showToast(`+1 ${name} al carrito`);
  };

  const increment = (id: string) =>
    setCart(prev => prev.map(i => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)));

  const decrement = (id: string) =>
    setCart(prev =>
      prev
        .map(i => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter(i => i.quantity > 0)
    );

  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const changeAmount =
    customerInfo.paymentMethod === 'Efectivo' && customerInfo.cashAmount
      ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
      : null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    }).catch(() => {});
  };

  // Filtrado de productos para el catálogo interactivo
  const allProducts = useMemo(() => {
    return clientConfig.categories.flatMap(cat =>
      cat.products.map(p => ({
        ...p,
        id: `${cat.id}:${p.name}`,
        categoryId: cat.id,
        categoryName: cat.name,
        categoryColor: cat.color,
        categoryIcon: cat.icon,
      }))
    );
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const handleSendOrder = () => {
    const e: { name?: string; phone?: string; address?: string } = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'domicilio' && !customerInfo.address.trim()) {
      e.address = 'Ingresa tu dirección de entrega';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const lines = cart
      .map(i => `• ${i.quantity}x *${i.name}* ($${i.price * i.quantity})`)
      .join('\n');

    const deliveryText =
      customerInfo.deliveryMethod === 'recoger'
        ? '📦 Recoger en local (Calle Turquesa #19, Col. La Joya, Puebla)'
        : `🚚 Envío a domicilio: ${customerInfo.address}`;

    const paymentText =
      customerInfo.paymentMethod === 'Efectivo'
        ? changeAmount !== null && changeAmount > 0
          ? `💵 Efectivo (Paga con $${customerInfo.cashAmount} - Cambio: $${changeAmount})`
          : '💵 Efectivo'
        : '💳 Transferencia bancaria (SPEI)';

    const message = `✨ *NUEVO PEDIDO - DON CLORO CASA QUÍMICA*\n\n${lines}\n\n*TOTAL A PAGAR:* $${cartTotal} MXN\n\n👤 *Cliente:* ${customerInfo.name}\n📱 *WhatsApp:* ${customerInfo.phone}\n📍 *Método de entrega:* ${deliveryText}\n💰 *Forma de pago:* ${paymentText}${customerInfo.notes ? `\n📝 *Notas:* ${customerInfo.notes}` : ''}\n\n_Pedido generado desde la página web de Don Cloro._`;

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = url;
      setCart([]);
      setCustomerInfo({
        name: '',
        phone: '',
        deliveryMethod: 'recoger',
        address: '',
        paymentMethod: 'Efectivo',
        cashAmount: '',
        notes: '',
      });
      setErrors({});
      setCartStep(1);
      setIsCartOpen(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-pink-500 selection:text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] px-5 py-3 rounded-full bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold shadow-2xl border border-white/10 flex items-center gap-2"
          >
            <Sparkle size={14} className="text-pink-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-md shadow-slate-900/5 border-b border-slate-100 py-3'
            : 'bg-white/70 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <button onClick={() => scrollTo('inicio')} className="flex items-center gap-1.5 select-none text-left group">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-[#06B6D4] to-[#BE185D] text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <Droplets size={22} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center">
                <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: C.secondary }}>DON</span>
                <span className="text-xl sm:text-2xl font-black tracking-tight ml-1" style={{ color: C.primary }}>CLORO</span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">Casa Química</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/50 backdrop-blur-md">
            {NAV_LINKS.map(l => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeSection === l.id
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                style={activeSection === l.id ? { backgroundColor: C.primary } : {}}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white transition-all text-xs font-black uppercase tracking-wider border border-[#25D366]/20"
            >
              <MessageCircle size={15} /> Cotizar
            </a>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm border border-slate-200/60"
              style={{ backgroundColor: `${C.primary}10`, color: C.primary }}
              aria-label="Abrir Carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full text-[11px] font-black flex items-center justify-center text-white border-2 border-white shadow-md"
                  style={{ backgroundColor: C.primary }}
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl shadow-xl"
            >
              <div className="p-4 space-y-1.5">
                {NAV_LINKS.map(l => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-between"
                  >
                    <span>{l.label}</span>
                    <ArrowRight size={16} className="text-slate-400" />
                  </button>
                ))}
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3.5 rounded-2xl bg-[#25D366] text-white text-sm font-black uppercase tracking-wider shadow-lg shadow-[#25D366]/20"
                  >
                    <MessageCircle size={18} /> Escribir por WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="relative pt-24 md:pt-28 pb-16 md:pb-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-white" />
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-200/40 blur-[100px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-[-10%] w-[500px] h-[500px] rounded-full bg-pink-200/30 blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-pink-200 bg-pink-50/80 text-pink-700 mb-6 shadow-sm"
              >
                <Zap size={14} className="text-pink-600 fill-pink-600" />
                <span>Productos Químicos de Alto Rendimiento</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-slate-950 mb-6"
              >
                El toque perfecto de limpieza para tu{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-[#EC4899]">
                  hogar
                </span>
                ,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#0284C7]">
                  negocio
                </span>{' '}
                y auto.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8"
              >
                Fórmulas químicas concentradas que rinden más y limpian a profundidad. Venta al menudeo y mayoreo en presentaciones de 1L, 5L y 20L con servicio a domicilio en Puebla.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <button
                  onClick={() => scrollTo('catalogo')}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: C.primary,
                    boxShadow: `0 12px 30px ${C.primary}35`,
                  }}
                >
                  <ShoppingCart size={18} /> Ver Catálogo &amp; Precios
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMayoreo)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Package size={18} className="text-cyan-400" /> Cotizar Mayoreo
                </a>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-4 pt-10 mt-10 border-t border-slate-200/80 text-left"
              >
                <div>
                  <div className="flex items-center gap-2 font-black text-lg sm:text-xl text-slate-950">
                    <Truck size={18} className="text-cyan-600" /> A Domicilio
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Envíos rápidos en Puebla</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-black text-lg sm:text-xl text-slate-950">
                    <Tag size={18} className="text-pink-600" /> Directo
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Precios directos de fábrica</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-black text-lg sm:text-xl text-slate-950">
                    <Shield size={18} className="text-amber-500" /> 100% Calidad
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Fórmulas concentradas</p>
                </div>
              </motion.div>
            </div>

            {/* Hero Right Visual Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8 text-white shadow-2xl overflow-hidden border border-slate-800">
                {/* Visual Glows */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                        <Award size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Línea Destacada</p>
                        <p className="text-sm font-black text-white">Alta Concentración</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      Mayoreo / Menudeo
                    </span>
                  </div>

                  {/* Top Popular Products Preview */}
                  <div className="space-y-3">
                    {[
                      { name: 'Cloro Concentrado 5L', cat: 'Hogar & Negocio', price: 110, icon: Sparkles, color: 'text-pink-400', badge: 'Más Vendido' },
                      { name: 'Detergente Líquido 1L', cat: 'Lavandería Pro', price: 52, icon: Shirt, color: 'text-cyan-400', badge: 'Rendidor' },
                      { name: 'Desengrasante Motores 1L', cat: 'Automotriz', price: 70, icon: Car, color: 'text-amber-400', badge: 'Potente' },
                      { name: 'Sarricida Baños 1L', cat: 'Baños & Pisos', price: 35, icon: Droplets, color: 'text-blue-400', badge: 'Acción Rápida' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <item.icon size={18} className={item.color} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.name}</p>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-slate-300">{item.badge}</span>
                            </div>
                            <p className="text-[11px] text-slate-400">{item.cat}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-sm font-black text-pink-400">${item.price}</span>
                          <button
                            onClick={() => addToCart(`feat:${item.name}`, item.name, item.price, item.cat)}
                            className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                            title="Agregar al Carrito"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      onClick={() => scrollTo('catalogo')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
                    >
                      Explorar los 30+ productos en catálogo <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CATÁLOGO INTERACTIVO & BUSCADOR */}
      <section id="catalogo" className="py-20 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <RevealSection className="text-center max-w-3xl mx-auto mb-10">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ backgroundColor: `${C.secondary}15`, color: C.secondary }}
            >
              Catálogo Completo
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Encuentra lo que necesitas para tu <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-[#EC4899]">limpieza</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Selecciona tus productos, agrégalos al pedido y envíalo directamente por WhatsApp para coordinar tu entrega o recogida.
            </p>
          </RevealSection>

          {/* Search Bar & Filter Tabs */}
          <div className="mb-10 space-y-4">
            
            {/* Live Search Input */}
            <div className="max-w-xl mx-auto relative">
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar cloro, detergente, desengrasante, pino..."
                  className="w-full pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-slate-200 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all placeholder:text-slate-400"
                  style={{ fontSize: '16px' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <XIcon size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <Layers size={15} />
                <span>Todos ({allProducts.length})</span>
              </button>

              {clientConfig.categories.map(cat => {
                const isSel = selectedCategory === cat.id;
                const Ico = ICON_MAP[cat.icon] || Sparkles;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                      isSel
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                    style={isSel ? { backgroundColor: C.primary } : {}}
                  >
                    <Ico size={15} className={isSel ? 'text-white' : 'text-slate-500'} />
                    <span>{cat.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSel ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {cat.products.length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
              <Package size={48} className="mx-auto text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-800">No encontramos productos para "{searchQuery}"</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Intenta con otra palabra clave o restablece los filtros.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((p, idx) => {
                const s = cc[p.categoryColor] || cc.pink;
                const inCart = cart.find(i => i.id === p.id);
                return (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                    className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-pink-300 hover:shadow-xl transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${s.soft}`}>
                          {p.categoryName}
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          ${p.price} <span className="text-[10px] font-medium text-slate-400">MXN</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors leading-snug mb-1.5">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {inCart ? (
                        <div className="flex items-center gap-1.5 bg-pink-50 p-1 rounded-xl border border-pink-200">
                          <button
                            onClick={() => decrement(p.id)}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 shadow-sm flex items-center justify-center hover:bg-pink-100 active:scale-95 transition-transform"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-black text-pink-700 w-6 text-center">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => increment(p.id)}
                            className="w-7 h-7 rounded-lg bg-pink-600 text-white shadow-sm flex items-center justify-center hover:bg-pink-700 active:scale-95 transition-transform"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(p.id, p.name, p.price, p.categoryName)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-pink-600 transition-colors active:scale-95"
                        >
                          <Plus size={14} /> Agregar al Pedido
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Don Cloro, me interesa cotizar por mayoreo el producto: *${p.name}*`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-[#25D366] hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all"
                        title="Preguntar por mayoreo de este producto"
                      >
                        <MessageCircle size={15} />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Quick Wholesale Banner at bottom of catalog */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 text-white flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mx-auto sm:mx-0">
                <Package size={24} />
              </div>
              <div>
                <h4 className="text-lg font-black">¿Manejas negocio, lavandería, taller o escuela?</h4>
                <p className="text-xs sm:text-sm text-slate-400">Cotiza tambos de 200L, porrones de 20L y pedidos recurrentes con factura.</p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola Don Cloro, me interesa cotización institucional/empresarial para mi negocio.')}`}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] text-white font-black text-xs uppercase tracking-wider whitespace-nowrap hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#25D366]/30 flex items-center gap-2"
            >
              <MessageCircle size={16} /> Hablar con un Asesor
            </a>
          </div>

        </div>
      </section>

      {/* BENEFICIOS SECTION */}
      <section id="beneficios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ backgroundColor: `${C.primary}15`, color: C.primary }}
            >
              ¿Por qué Don Cloro?
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950">
              Calidad química garantizada al mejor <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#06B6D4] to-[#0284C7]">precio</span>
            </h2>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Truck,
                title: 'Servicio a Domicilio en Puebla',
                desc: 'Recibe tus químicos directo en la puerta de tu negocio o domicilio. Entregas programadas y atención personalizada.',
                color: C.secondary,
                bg: `${C.secondary}10`,
              },
              {
                icon: Tag,
                title: 'Precios Directos de Fábrica',
                desc: 'Ahorra hasta un 30% comprando en garrafas y porrones sin pagar el sobreprecio de marcas comerciales tradicionales.',
                color: C.primary,
                bg: `${C.primary}10`,
              },
              {
                icon: Shield,
                title: 'Máximo Poder & Rendimiento',
                desc: 'Nuestras fórmulas concentradas rinden el doble de lavadas y desinfección, garantizando resultados impecables.',
                color: '#F59E0B',
                bg: '#FEF3C7',
              },
            ].map((b, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center justify-between"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: b.bg }}>
                    <b.icon size={30} style={{ color: b.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 mb-3">{b.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 w-full flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400">
                    <Check size={14} className="text-green-500" /> Garantía de Satisfacción
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* MAYOREO / CTA SECTION */}
      <section id="mayoreo" className="py-20 relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <RevealSection>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-pink-500/20 text-pink-300 border border-pink-500/30 mb-6">
              <Package size={14} /> Soluciones para Mayoristas y Empresas
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
              Abastece tu negocio con <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-200">garrafas y porrones</span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Suministramos restaurantes, hoteles, autolavados, oficinas, escuelas y lavanderías en todo Puebla. Pide tu cotización personalizada hoy mismo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMayoreo)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <MessageCircle size={20} /> Solicitar Catálogo de Mayoreo
              </a>
              <a
                href={`tel:${clientConfig.phoneNumber.replace(/\s/g, '')}`}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-all"
              >
                <Phone size={18} /> Llamar Directamente
              </a>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10">
              {[
                { val: '30+', label: 'Fórmulas Activas' },
                { val: '5L & 20L', label: 'Presentaciones Mayoreo' },
                { val: '24-48h', label: 'Entrega en Puebla' },
                { val: '100%', label: 'Calidad Concentrada' },
              ].map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400">{st.val}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQS) */}
      <section id="faqs" className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-12">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-3"
              style={{ backgroundColor: `${C.secondary}15`, color: C.secondary }}
            >
              Dudas Comunes
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Preguntas Frecuentes
            </h2>
          </RevealSection>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    <span className={`p-1.5 rounded-xl transition-transform ${isOpen ? 'bg-pink-100 text-pink-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER - 3 COLUMNAS REGLA AGENTS.MD */}
      <footer id="contacto" className="bg-white border-t border-slate-200 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12">
            
            {/* Columna 1: Marca y Descripción */}
            <div>
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#06B6D4] to-[#BE185D] text-white">
                  <Droplets size={18} />
                </div>
                <div className="flex items-center">
                  <span className="text-2xl font-black" style={{ color: C.secondary }}>DON</span>
                  <span className="text-2xl font-black ml-1" style={{ color: C.primary }}>CLORO</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {clientConfig.description}
              </p>
              <p className="text-xs font-black italic text-pink-600">
                "{clientConfig.slogan}"
              </p>
            </div>

            {/* Columna 2: Contacto, Horarios y Dirección */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                Contacto &amp; Ubicación
              </h4>
              <div className="space-y-3 text-sm text-slate-600">
                <a
                  href={`tel:${clientConfig.phoneNumber.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 hover:text-pink-600 transition-colors"
                >
                  <span className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                    <Phone size={15} />
                  </span>
                  <span>{clientConfig.phoneNumber}</span>
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-[#25D366] transition-colors"
                >
                  <span className="w-8 h-8 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] shrink-0">
                    <MessageCircle size={15} />
                  </span>
                  <span>WhatsApp: {clientConfig.phoneNumber}</span>
                </a>
                <p className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0">
                    <Mail size={15} />
                  </span>
                  <span>{clientConfig.email}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
                    <MapPin size={15} />
                  </span>
                  <span>{clientConfig.address}</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 mt-0.5">
                    <Clock size={15} />
                  </span>
                  <span>{clientConfig.hours}</span>
                </p>
              </div>
            </div>

            {/* Columna 3: Redes Sociales y Cotización Rápida */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                Canales Digitales
              </h4>
              <div className="flex gap-3 mb-6">
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-11 h-11 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle size={20} />
                </a>
              </div>

              <div className="rounded-2xl p-5 bg-gradient-to-br from-pink-50 to-cyan-50 border border-pink-100">
                <p className="text-xs font-black text-slate-900 mb-1">¿Listo para hacer tu pedido?</p>
                <p className="text-xs text-slate-600 mb-3">
                  Escríbenos por WhatsApp y te confirmamos disponibilidad y entrega de inmediato.
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
                >
                  <MessageCircle size={14} /> Escribir Ahora
                </a>
              </div>
            </div>

          </div>

          {/* Barra Inferior © + Créditos Imagine & Stamp + Aviso Privacidad */}
          <div className="py-8 border-t border-slate-200 bg-slate-950 text-white -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                &copy; {new Date().getFullYear()} {clientConfig.businessFullName}. TODOS LOS DERECHOS RESERVADOS.
              </p>
              
              <p className="text-slate-500 text-[10px]">
                *Precios sujetos a cambio sin previo aviso. Imágenes y fórmulas de referencia comercial.
              </p>

              {/* Crédito Oficial Imagine & Stamp */}
              <a
                href="https://imagineandstamp.site"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 group-hover:text-slate-200 transition-colors">
                  Página web realizada por
                </span>
                <span className="text-xs font-black tracking-tight text-pink-400 group-hover:scale-105 transition-transform">
                  IMAGINE &amp; STAMP
                </span>
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity text-pink-400" />
              </a>

              <div className="w-16 h-px bg-white/10" />

              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
              >
                <Shield size={13} /> Aviso de Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING MOBILE CART PILL */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-24 z-40 max-w-sm ml-auto"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-between gap-3 border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-600 flex items-center justify-center font-black text-xs text-white">
                  {cartCount}
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Ver Mi Pedido</span>
              </div>
              <span className="text-base font-black text-pink-400">${cartTotal} MXN</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON */}
      <motion.a
        href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#25D366] text-white p-4 sm:px-5 sm:py-3.5 rounded-full shadow-2xl shadow-[#25D366]/40 hover:bg-[#20bd5a] transition-all"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        aria-label="WhatsApp Directo"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="font-black text-xs uppercase tracking-wider hidden sm:inline">WhatsApp</span>
      </motion.a>

      {/* SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-2xl bg-white text-slate-700 shadow-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all"
            aria-label="Volver arriba"
          >
            <ArrowRight size={18} className="-rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PRIVACY MODAL */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white"
            >
              <div className="h-1.5 bg-gradient-to-r from-pink-600 to-cyan-500" />
              <div className="p-6 sm:p-8">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <XIcon size={18} />
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black uppercase">Aviso de Privacidad</h3>
                    <p className="text-xs text-slate-400">{clientConfig.businessFullName}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <p>
                    En <strong className="text-white">{clientConfig.businessFullName}</strong> protegemos y respetamos tus datos personales. La información recabada (nombre, teléfono, dirección de entrega) se utiliza exclusivamente para coordinar y enviar tus pedidos solicitados vía WhatsApp.
                  </p>
                  <p>
                    No almacenamos datos sensibles ni números de tarjetas bancarias. Los pagos mediante transferencia se validan directamente a través de comprobantes emitidos por tu banco.
                  </p>
                  <p>
                    Tus datos nunca serán compartidos ni vendidos a terceras partes. Para dudas o solicitud de eliminación de información, contáctanos a <a href={`mailto:${clientConfig.email}`} className="text-cyan-400 hover:underline">{clientConfig.email}</a>.
                  </p>
                </div>

                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="mt-8 w-full py-3.5 rounded-2xl bg-pink-600 text-white font-black text-xs uppercase tracking-wider hover:bg-pink-700 transition-colors"
                >
                  Entendido y Aceptar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CARRITO DRAWER LATERAL (2 PASOS + ÉXITO) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[70]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
            >
              {/* Cart Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  {cartStep === 2 && (
                    <button
                      onClick={() => setCartStep(1)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Volver"
                    >
                      <ArrowRight size={18} className="rotate-180" />
                    </button>
                  )}
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">
                      {cartStep === 1
                        ? `Tu Pedido (${cartCount})`
                        : cartStep === 2
                        ? 'Datos de Entrega'
                        : '¡Pedido Listo!'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      {cartStep === 1 ? 'Paso 1: Productos' : cartStep === 2 ? 'Paso 2: Confirmación' : 'Paso 3: Envío'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Step 1: Cart Items */}
              {cartStep === 1 && (
                <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
                  {cart.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300 mb-4">
                        <ShoppingCart size={32} />
                      </div>
                      <p className="text-base font-bold text-slate-800">Tu carrito está vacío</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                        Agrega productos desde el catálogo interactivo para armar tu pedido.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider"
                      >
                        Explorar Catálogo
                      </button>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="py-3.5 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">${item.price} c/u</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => decrement(item.id)}
                            className="w-7 h-7 rounded-lg bg-white text-slate-700 flex items-center justify-center shadow-sm hover:bg-slate-200 active:scale-95 transition-transform"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="text-xs font-black w-6 text-center text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increment(item.id)}
                            className="w-7 h-7 rounded-lg bg-pink-600 text-white flex items-center justify-center shadow-sm hover:bg-pink-700 active:scale-95 transition-transform"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <p className="font-black text-sm text-slate-900 w-16 text-right">
                          ${item.price * item.quantity}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Step 2: Customer Details & Payment */}
              {cartStep === 2 && (
                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Ej: Juan Pérez"
                      className="w-full mt-1.5 p-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      style={{ fontSize: '16px', borderColor: errors.name ? '#ef4444' : '#e2e8f0' }}
                    />
                    {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* WhatsApp Input */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="222 123 4567"
                      className="w-full mt-1.5 p-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                      style={{ fontSize: '16px', borderColor: errors.phone ? '#ef4444' : '#e2e8f0' }}
                    />
                    {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Delivery Method */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Método de Entrega
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'recoger' })}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                          customerInfo.deliveryMethod === 'recoger'
                            ? 'border-pink-600 bg-pink-50/80 text-pink-700 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <MapPin size={16} />
                        <span>Recoger en Local</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'domicilio' })}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                          customerInfo.deliveryMethod === 'domicilio'
                            ? 'border-cyan-600 bg-cyan-50/80 text-cyan-700 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <Truck size={16} />
                        <span>Envío a Domicilio</span>
                      </button>
                    </div>
                  </div>

                  {/* Address (If delivery) */}
                  {customerInfo.deliveryMethod === 'domicilio' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        Dirección Completa de Entrega *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Calle, número, colonia, código postal"
                        className="w-full mt-1.5 p-3.5 rounded-2xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        style={{ fontSize: '16px', borderColor: errors.address ? '#ef4444' : '#e2e8f0' }}
                      />
                      {errors.address && <p className="text-xs font-bold text-red-500 mt-1">{errors.address}</p>}
                    </motion.div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Forma de Pago
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Efectivo' })}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                          customerInfo.paymentMethod === 'Efectivo'
                            ? 'border-pink-600 bg-pink-50 text-pink-700 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        💵 Efectivo
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Transferencia' })}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${
                          customerInfo.paymentMethod === 'Transferencia'
                            ? 'border-cyan-600 bg-cyan-50 text-cyan-700 shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        💳 Transferencia
                      </button>
                    </div>
                  </div>

                  {/* Cash Change Calculator */}
                  {customerInfo.paymentMethod === 'Efectivo' && (
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                        ¿Con cuánto billete pagas? (Opcional)
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        value={customerInfo.cashAmount}
                        onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                        placeholder={`Ej: $${Math.ceil(cartTotal / 100) * 100}`}
                        className="w-full mt-1.5 p-3.5 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        style={{ fontSize: '16px' }}
                      />
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs font-bold text-green-600 mt-1.5 flex items-center gap-1">
                          <Check size={14} /> Tu cambio a recibir: ${changeAmount} MXN
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bank Info with Copy */}
                  {customerInfo.paymentMethod === 'Transferencia' && (
                    <div className="rounded-2xl p-4 bg-cyan-50/70 border border-cyan-200 space-y-2.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-cyan-800">
                        Datos para Transferencia SPEI
                      </p>
                      {[
                        { label: 'Banco', value: bankInfo.bankName, field: 'bank' },
                        { label: 'Beneficiario', value: bankInfo.accountHolder, field: 'holder' },
                        { label: 'CLABE', value: bankInfo.clabe, field: 'clabe' },
                        { label: 'Tarjeta', value: bankInfo.cardNumber, field: 'card' },
                      ].map(row => (
                        <div key={row.field} className="flex items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold uppercase text-[10px] block">{row.label}</span>
                            <span className="font-bold text-slate-900">{row.value}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.value, row.field)}
                            className="p-2 rounded-xl bg-white border border-cyan-200 hover:bg-cyan-100 transition-colors text-cyan-700"
                            title="Copiar dato"
                          >
                            {copiedField === row.field ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notes / References */}
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Instrucciones o Referencias (Opcional)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Ej: Portón blanco, timbrar dos veces..."
                      rows={2}
                      className="w-full mt-1.5 p-3 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Success Redirection */}
              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4 text-green-600 animate-bounce">
                    <Check size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">¡Redirigiendo a WhatsApp!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-xs">
                    Estamos preparando tu pedido para que Don Cloro lo reciba en su chat oficial de WhatsApp.
                  </p>
                </div>
              )}

              {/* Cart Drawer Footer */}
              {cart.length > 0 && cartStep !== 3 && (
                <div className="p-5 border-t border-slate-100 bg-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Total del Pedido</span>
                    <span className="text-2xl font-black text-pink-600">${cartTotal} <span className="text-xs text-slate-400">MXN</span></span>
                  </div>

                  {cartStep === 1 && (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-pink-600/25"
                      style={{ backgroundColor: C.primary }}
                    >
                      <span>Continuar al Paso 2</span>
                      <ArrowRight size={16} />
                    </button>
                  )}

                  {cartStep === 2 && (
                    <button
                      onClick={handleSendOrder}
                      className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all active:scale-95 shadow-lg shadow-[#25D366]/30"
                    >
                      <MessageCircle size={18} />
                      <span>Enviar Pedido por WhatsApp</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
