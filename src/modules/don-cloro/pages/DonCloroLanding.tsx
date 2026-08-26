// DON CLORO - CASA QUIMICA - Landing Page
// React + Tailwind + Motion + Lucide. Mobile-first, conversion-optimizada.
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  Sparkles, Shirt, Droplets, Car, Wind, Droplet,
  Truck, Tag, Shield, Phone, MapPin, Mail, Clock,
  Instagram, Facebook, MessageCircle,
  ArrowRight, ChevronDown, ExternalLink,
  Menu, X as XIcon, Package, Zap, CheckCircle2,
  ShoppingCart, Trash2, Minus, Plus,
  Copy, Check,
} from 'lucide-react';
import { clientConfig, bankInfo } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;
const ICON_MAP: Record<string, React.ElementType> = { Sparkles, Shirt, Droplets, Car, Wind, Droplet };
const NAV_LINKS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'categorias', label: 'Categorias' },
  { id: 'beneficios', label: 'Beneficios' },
  { id: 'contacto', label: 'Contacto' },
];

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  );
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function DonCloroLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [cartStep, setCartStep] = useState(1);
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

  useEffect(() => {
    document.title = `${clientConfig.businessFullName} - ${clientConfig.slogan}`;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setShowScrollTop(window.scrollY > 600);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id));
      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i]!.getBoundingClientRect().top <= 120) {
          setActiveSection(NAV_LINKS[i].id); break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => { setMobileMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const cc: Record<string, { bg: string; icon: string; border: string; badge: string }> = {
    pink: { bg: 'bg-pink-50', icon: 'text-pink-500', border: 'border-pink-200', badge: 'bg-pink-500' },
    cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-500', border: 'border-cyan-200', badge: 'bg-cyan-500' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500', border: 'border-blue-200', badge: 'bg-blue-500' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-500', border: 'border-violet-200', badge: 'bg-violet-500' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-500', border: 'border-rose-200', badge: 'bg-rose-500' },
  };
  const waMsg = 'Hola, vengo de la pagina web y quiero cotizar productos de limpieza.';
  const waMayoreo = 'Hola, me interesa precios de mayoreo de productos de limpieza. Me pueden enviar la lista de precios?';

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const addToCart = (id: string, name: string, price: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { id, name, price, quantity: 1 }];
    });
  };
  const increment = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decrement = (id: string) => setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id));

  const changeAmount = customerInfo.paymentMethod === 'Efectivo' && customerInfo.cashAmount
    ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
    : null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    }).catch(() => {});
  };

  const handleSendOrder = () => {
    const e: { name?: string; phone?: string; address?: string } = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'domicilio' && !customerInfo.address.trim()) e.address = 'Ingresa tu direccion de entrega';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const lines = cart.map(i => `- ${i.quantity}x ${i.name} ($${i.price * i.quantity})`).join('\n');
    const deliveryText = customerInfo.deliveryMethod === 'recoger'
      ? 'Recoger en local'
      : `Envio a domicilio: ${customerInfo.address}`;
    const paymentText = customerInfo.paymentMethod === 'Efectivo'
      ? (changeAmount !== null ? `Efectivo (paga con $${customerInfo.cashAmount}, cambio $${changeAmount})` : 'Efectivo')
      : 'Transferencia';
    const message = `Hola Don Cloro, me gustaria hacer el siguiente pedido:\n\n${lines}\n\nTotal: $${cartTotal}\n\n*Cliente:* ${customerInfo.name}\n*WhatsApp:* ${customerInfo.phone}\n*Entrega:* ${deliveryText}\n*Pago:* ${paymentText}${customerInfo.notes ? `\n*Notas:* ${customerInfo.notes}` : ''}`;
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

    setCartStep(3);
    setTimeout(() => {
      window.location.href = url;
      setCart([]);
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'recoger', address: '', paymentMethod: 'Efectivo', cashAmount: '', notes: '' });
      setErrors({});
      setCartStep(1);
      setIsCartOpen(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-black/5' : 'bg-white/60 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo('inicio')} className="flex items-center gap-0.5 select-none">
            <span className="text-xl md:text-2xl font-black tracking-tight" style={{ color: C.secondary }}>DON</span>
            <span className="text-xl md:text-2xl font-black tracking-tight" style={{ color: C.primary }}>CLORO</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <button key={l.id} onClick={() => scrollTo(l.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeSection === l.id ? 'text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
                style={activeSection === l.id ? { backgroundColor: C.primary } : {}}>{l.label}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: `${C.primary}10`, color: C.primary }}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center text-white border-2 border-white"
                  style={{ backgroundColor: C.primary }}>{cartCount}</span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center hover:bg-slate-100" style={{ color: C.dark }}>
              {mobileMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-xl">
              <div className="p-4 space-y-1">
                {NAV_LINKS.map(l => <button key={l.id} onClick={() => scrollTo(l.id)} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">{l.label}</button>)}
                <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full mt-3 px-5 py-3 rounded-xl bg-[#25D366] text-white text-sm font-black uppercase tracking-wider"><MessageCircle size={18} /> Cotizar ahora</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative pt-16">
        <div className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/40" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: C.secondary }} />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: C.primary }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-0 w-full">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-sm mb-6"
                  style={{ backgroundColor: `${C.primary}40` }}><Zap size={14} className="text-yellow-300" /> Productos de limpieza de alto rendimiento</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-white mb-6">
                Expertos en limpieza{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${C.secondary}, #67E8F9)` }}>institucional</span>,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, #F9A8D4)` }}>automotriz</span>{' '}
                y para tu <span className="bg-clip-text text-transparent bg-gradient-to-r" style={{ backgroundImage: 'linear-gradient(135deg, #FBBF24, #F59E0B)' }}>hogar</span>.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
                <strong className="text-white/90">{clientConfig.businessFullName}</strong>. Venta de mayoreo y menudeo con envio a domicilio en Puebla y alrededores.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => scrollTo('categorias')}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider shadow-xl"
                  style={{ backgroundColor: C.primary, boxShadow: `0 10px 30px ${C.primary}30` }}>Ver Catalogo Completo <ArrowRight size={18} /></motion.button>
                <motion.a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, me interesa hacer un pedido de productos de limpieza.')}`}
                  target="_blank" rel="noreferrer" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider border-2 backdrop-blur-sm"
                  style={{ borderColor: C.secondary, color: C.secondary, backgroundColor: `${C.secondary}15` }}>Hacer un Pedido <MessageCircle size={18} /></motion.a>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-wrap items-center gap-6 mt-12">
                {[{ icon: Truck, text: 'Envio a domicilio' }, { icon: Tag, text: 'Precios de fabrica' }, { icon: Shield, text: 'Calidad garantizada' }].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/50"><b.icon size={16} className="text-white/40" /><span className="text-xs font-bold uppercase tracking-wider">{b.text}</span></div>
                ))}
              </motion.div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Descubre mas</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}><ChevronDown size={20} className="text-white/40" /></motion.div>
          </motion.div>
        </div>
      </section>
      {/* CATEGORIAS */}
      <section id="categorias" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              style={{ backgroundColor: `${C.secondary}15`, color: C.secondary }}>Nuestro Catalogo</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: C.dark }}>
              Lineas de <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.primary}, ${C.accent})` }}>productos</span>
            </h2>
            <p className="text-base md:text-lg mt-4 max-w-2xl mx-auto" style={{ color: C.textSecondary }}>Soluciones completas de limpieza para cada necesidad. Desde el hogar hasta la industria.</p>
          </RevealSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {clientConfig.categories.map((cat, i) => {
              const s = cc[cat.color] || cc.pink;
              const Ico = ICON_MAP[cat.icon] || Sparkles;
              return (
                <RevealSection key={cat.id} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative rounded-3xl border ${s.border} bg-white p-6 md:p-8 shadow-sm overflow-hidden group cursor-pointer`}>
                    <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full ${s.bg} opacity-60 group-hover:opacity-100 transition-opacity`} />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}><Ico size={28} className={s.icon} /></div>
                      <h3 className="text-lg font-black mb-2" style={{ color: C.dark }}>{cat.name}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white mb-4 ${s.badge}`}>{cat.products.length} productos</span>
                      <ul className="space-y-2">
                        {cat.products.slice(0, 4).map((p, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm" style={{ color: C.textSecondary }}>
                            <CheckCircle2 size={14} className={`${s.icon} shrink-0`} /><span className="line-clamp-1 flex-1 min-w-0">{p.name}</span>
                            <span className="font-black text-xs whitespace-nowrap" style={{ color: C.dark }}>{'$'}{p.price}</span>
                            <button onClick={() => addToCart(`${cat.id}:${p.name}`, p.name, p.price)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 transition-transform hover:scale-110 active:scale-95"
                              style={{ backgroundColor: C.primary }}><Plus size={14} /></button>
                          </li>
                        ))}
                        {cat.products.length > 4 && <li className="text-xs font-bold pl-6" style={{ color: C.textSecondary }}>+{cat.products.length - 4} productos mas...</li>}
                      </ul>
                    </div>
                  </motion.div>
                </RevealSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section id="beneficios" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              style={{ backgroundColor: `${C.primary}15`, color: C.primary }}>Por que elegirnos?</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight" style={{ color: C.dark }}>
              Beneficios que <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.secondary}, #67E8F9)` }}>importan</span>
            </h2>
          </RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Truck, title: 'Entrega a domicilio', desc: 'Recibe tu pedido en la puerta de tu negocio u hogar. Envios a partir de $150 pesos en Puebla y alrededores.', color: C.secondary, bg: `${C.secondary}10` },
              { icon: Tag, title: 'Precios de Fabrica', desc: 'Mayoreo desde 5 litros y 20 litros. Sin intermediarios, directo del distribuidor a tu negocio.', color: C.primary, bg: `${C.primary}10` },
              { icon: Shield, title: 'Calidad Garantizada', desc: 'Formulas concentradas que rinden mas. Todos nuestros productos cumplen con normas oficiales de calidad.', color: '#F59E0B', bg: '#FEF3C7' },
            ].map((b, i) => (
              <RevealSection key={i} delay={i * 0.15}>
                <motion.div whileHover={{ y: -4 }} className="relative rounded-3xl border border-slate-100 bg-white p-8 md:p-10 text-center shadow-sm hover:shadow-xl transition-all">
                  <div className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6" style={{ backgroundColor: b.bg }}><b.icon size={36} style={{ color: b.color }} /></div>
                  <h3 className="text-xl font-black mb-3" style={{ color: C.dark }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.textSecondary }}>{b.desc}</p>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{ backgroundColor: C.dark }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: C.primary }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: C.secondary }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <motion.div initial={{ scale: 0.9 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6"
                style={{ backgroundColor: `${C.primary}30`, color: '#F9A8D4' }}><Package size={14} /> Ofertas de Mayoreo</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
                Necesitas abastecer tu <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${C.secondary}, #67E8F9)` }}>negocio u hogar</span>?
              </h2>
              <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
                Contamos con precios especiales para compras de mas de <strong className="text-white/90">5 litros</strong> y <strong className="text-white/90">20 litros</strong>. Solicita nuestra lista de precios final y <strong className="text-white/90">ahorra hasta un 30%</strong> en tu compra.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMayoreo)}`} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#25D366] text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-[#25D366]/30">
                  <MessageCircle size={22} /> Solicitar Lista de Precios</motion.a>
                <motion.a href={`tel:${clientConfig.phoneNumber.replace(/\s/g, '')}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-black text-sm uppercase tracking-wider hover:bg-white/10 transition-colors">
                  <Phone size={20} /> Llamanos</motion.a>
              </div>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-16 md:py-20" style={{ backgroundImage: `linear-gradient(135deg, ${C.secondary}08, ${C.primary}08)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              {[{ number: '500+', label: 'Clientes Satisfechos' }, { number: '30+', label: 'Productos Disponibles' }, { number: '5L', label: 'Mayoreo Desde' }, { number: '24h', label: 'Entrega en Puebla' }].map((st, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: i % 2 === 0 ? C.primary : C.secondary }}>{st.number}</div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>{st.label}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>
      {/* FOOTER */}
      <footer id="contacto" className="bg-white border-t border-slate-100 pt-16 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 pb-12">
            <div>
              <div className="flex items-center gap-0.5 mb-4">
                <span className="text-2xl font-black" style={{ color: C.secondary }}>DON</span>
                <span className="text-2xl font-black" style={{ color: C.primary }}>CLORO</span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: C.textSecondary }}>{clientConfig.description}</p>
              <p className="text-xs font-bold italic" style={{ color: C.primary }}>"{clientConfig.slogan}"</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: C.textSecondary }}>Contacto</h4>
              <div className="space-y-3 text-sm" style={{ color: C.textSecondary }}>
                <a href={`tel:${clientConfig.phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${C.secondary}10` }}><Phone size={15} style={{ color: C.secondary }} /></span>{clientConfig.phoneNumber}
                </a>
                <p className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0"><MessageCircle size={15} className="text-[#25D366]" /></span>WhatsApp: {clientConfig.phoneNumber}</p>
                <p className="flex items-center gap-3"><span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${C.primary}10` }}><Mail size={15} style={{ color: C.primary }} /></span>{clientConfig.email}</p>
                <p className="flex items-start gap-3"><span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.secondary}10` }}><MapPin size={15} style={{ color: C.secondary }} /></span>{clientConfig.address}</p>
                <p className="flex items-start gap-3"><span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${C.primary}10` }}><Clock size={15} style={{ color: C.primary }} /></span>{clientConfig.hours}</p>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: C.textSecondary }}>Siguenos</h4>
              <div className="flex gap-3 mb-6">
                {clientConfig.instagramUrl !== 'https://instagram.com/' && <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Instagram size={20} /></a>}
                {clientConfig.facebookUrl !== 'https://facebook.com/' && <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><Facebook size={20} /></a>}
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"><MessageCircle size={20} /></a>
              </div>
              <div className="rounded-2xl p-5" style={{ backgroundColor: `${C.primary}08` }}>
                <p className="text-xs font-bold mb-2" style={{ color: C.dark }}>Listo para cotizar?</p>
                <p className="text-xs mb-3" style={{ color: C.textSecondary }}>Escribenos por WhatsApp y te atendemos en minutos.</p>
                <motion.a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, me interesa cotizar productos de limpieza.')}`} target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-black uppercase tracking-wider shadow-md"><MessageCircle size={14} /> Escribir ahora</motion.a>
              </div>
            </div>
          </div>
          <div className="py-8" style={{ backgroundColor: C.dark }}>
            <div className="flex flex-col items-center gap-4 text-center px-4">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} {clientConfig.businessFullName}. TODOS LOS DERECHOS RESERVADOS.</p>
              <p className="text-white/30 text-[10px] font-medium">*Precios sujetos a cambio sin previo aviso. Imagenes referenciales.</p>
              <motion.a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" whileHover={{ scale: 1.03 }}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Pagina web realizada por</span>
                <span className="text-sm font-black tracking-tight text-pink-400 group-hover:scale-105 transition-transform">IMAGINE &amp; STAMP</span>
                <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity text-pink-400" />
              </motion.a>
              <div className="w-16 h-px bg-white/10" />
              <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"><Shield size={12} /> Aviso de Privacidad</button>
            </div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOATING */}
      <motion.a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(waMsg)}`} target="_blank" rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1.5 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] text-white pl-5 pr-6 py-4 rounded-full shadow-2xl shadow-[#25D366]/40"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <MessageCircle size={26} fill="currentColor" /><span className="font-black text-sm hidden sm:block">WhatsApp</span>
      </motion.a>

      {/* SCROLL TO TOP */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-white/20"
            style={{ backgroundColor: C.primary, color: 'white' }}>
            <ArrowRight size={20} className="-rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* PRIVACY MODAL */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg border-2 rounded-3xl shadow-2xl overflow-hidden" style={{ backgroundColor: C.dark, borderColor: C.primary }}>
              <div className="h-1.5" style={{ backgroundImage: `linear-gradient(to right, ${C.primary}, ${C.secondary})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"><XIcon size={18} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.primary}20` }}><Shield size={20} style={{ color: C.primary }} /></div>
                  <h2 className="text-xl font-black text-white tracking-tight uppercase">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>En <strong className="text-white">{clientConfig.businessFullName}</strong> protegemos y respetamos tu privacidad. La informacion personal que compartes se utiliza exclusivamente para procesar tus pedidos y comunicarnos contigo.</p>
                  <p>No almacenamos datos de tarjetas bancarias. Tus datos de contacto solo se usan para confirmar tu pedido. Nunca compartimos tu informacion con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contactanos en <a href={`mailto:${clientConfig.email}`} className="hover:underline" style={{ color: C.secondary }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity" style={{ backgroundColor: C.primary }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-black/5">
                <div className="flex items-center gap-2">
                  {cartStep === 2 && (
                    <button onClick={() => setCartStep(1)} className="p-2 rounded-full hover:bg-black/5" style={{ color: C.dark }}><ArrowRight size={18} className="rotate-180" /></button>
                  )}
                  <h2 className="font-black text-lg uppercase tracking-tight" style={{ color: C.dark }}>
                    {cartStep === 1 ? `Tu Pedido (${cartCount})` : cartStep === 2 ? 'Tus Datos' : '¡Listo!'}
                  </h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-black/5" style={{ color: C.dark }}><XIcon size={20} /></button>
              </div>

              {cartStep === 1 && (
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-16">
                      <ShoppingCart size={48} className="mx-auto text-black/10 mb-4" />
                      <p className="text-sm font-bold text-black/40">Tu carrito esta vacio</p>
                      <p className="text-xs text-black/20 mt-1">Agrega productos desde el catalogo</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3 py-3 border-b border-black/5">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate" style={{ color: C.dark }}>{item.name}</p>
                          <p className="text-xs" style={{ color: C.textSecondary }}>{'$'}{item.price} c/u</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => decrement(item.id)} className="w-8 h-8 rounded-lg border border-black/10 flex items-center justify-center hover:bg-black/5" style={{ color: C.dark }}><Minus size={14} /></button>
                          <span className="text-sm font-black w-6 text-center" style={{ color: C.dark }}>{item.quantity}</span>
                          <button onClick={() => increment(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: C.primary }}><Plus size={14} /></button>
                        </div>
                        <p className="font-black text-sm w-16 text-right" style={{ color: C.dark }}>{'$'}{item.price * item.quantity}</p>
                        <button onClick={() => removeItem(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {cartStep === 2 && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Nombre</label>
                    <input value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      className="w-full mt-2 p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                      style={{ fontSize: '16px', borderColor: errors.name ? '#ef4444' : 'rgba(0,0,0,0.1)' }} />
                    {errors.name && <p className="text-xs font-bold text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">WhatsApp</label>
                    <input value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="55 1234 5678"
                      className="w-full mt-2 p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                      style={{ fontSize: '16px', borderColor: errors.phone ? '#ef4444' : 'rgba(0,0,0,0.1)' }} />
                    {errors.phone && <p className="text-xs font-bold text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'recoger' })}
                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${customerInfo.deliveryMethod === 'recoger' ? 'border-transparent text-white shadow-md' : 'border-black/10 text-black/50 hover:border-black/20'}`}
                        style={customerInfo.deliveryMethod === 'recoger' ? { backgroundColor: C.primary } : {}}>
                        Recoger en local
                      </button>
                      <button onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'domicilio' })}
                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${customerInfo.deliveryMethod === 'domicilio' ? 'border-transparent text-white shadow-md' : 'border-black/10 text-black/50 hover:border-black/20'}`}
                        style={customerInfo.deliveryMethod === 'domicilio' ? { backgroundColor: C.secondary } : {}}>
                        Envio a domicilio
                      </button>
                    </div>
                  </div>
                  {customerInfo.deliveryMethod === 'domicilio' && (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Dirección</label>
                      <input value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Calle, número, colonia"
                        className="w-full mt-2 p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                        style={{ fontSize: '16px', borderColor: errors.address ? '#ef4444' : 'rgba(0,0,0,0.1)' }} />
                      {errors.address && <p className="text-xs font-bold text-red-500 mt-1">{errors.address}</p>}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Efectivo' })}
                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${customerInfo.paymentMethod === 'Efectivo' ? 'border-transparent text-white shadow-md' : 'border-black/10 text-black/50 hover:border-black/20'}`}
                        style={customerInfo.paymentMethod === 'Efectivo' ? { backgroundColor: C.primary } : {}}>
                        Efectivo
                      </button>
                      <button onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Transferencia' })}
                        className={`py-3 px-2 rounded-xl border-2 text-xs font-bold uppercase tracking-wider transition-all ${customerInfo.paymentMethod === 'Transferencia' ? 'border-transparent text-white shadow-md' : 'border-black/10 text-black/50 hover:border-black/20'}`}
                        style={customerInfo.paymentMethod === 'Transferencia' ? { backgroundColor: C.secondary } : {}}>
                        Transferencia
                      </button>
                    </div>
                  </div>
                  {customerInfo.paymentMethod === 'Efectivo' && (
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40">¿Con cuánto pagas?</label>
                      <input type="number" inputMode="numeric" value={customerInfo.cashAmount}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                        placeholder="Ej: 500"
                        className="w-full mt-2 p-3 rounded-xl border border-black/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all"
                        style={{ fontSize: '16px' }} />
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs font-bold text-green-600 mt-1.5">Tu cambio: ${changeAmount}</p>
                      )}
                    </div>
                  )}
                  {customerInfo.paymentMethod === 'Transferencia' && (
                    <div className="rounded-2xl p-4 space-y-2.5" style={{ backgroundColor: `${C.secondary}08`, border: `1px solid ${C.secondary}30` }}>
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.secondary }}>Datos de Transferencia</p>
                      {[
                        { label: 'Banco', value: bankInfo.bankName, field: 'bank' },
                        { label: 'Titular', value: bankInfo.accountHolder, field: 'holder' },
                        { label: 'CLABE', value: bankInfo.clabe, field: 'clabe' },
                        { label: 'Tarjeta', value: bankInfo.cardNumber, field: 'card' },
                      ].map(row => (
                        <div key={row.field} className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-black/40">{row.label}</p>
                            <p className="text-sm font-bold truncate" style={{ color: C.dark }}>{row.value}</p>
                          </div>
                          <button onClick={() => copyToClipboard(row.value, row.field)} className="p-2 rounded-lg hover:bg-black/5 shrink-0" style={{ color: C.primary }}>
                            {copiedField === row.field ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Notas</label>
                    <textarea value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Referencias, comentarios..."
                      className="w-full mt-2 p-3 rounded-xl border border-black/10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-pink-400 transition-all resize-none"
                      style={{ fontSize: '16px' }} rows={2} />
                  </div>
                </div>
              )}

              {cartStep === 3 && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-black" style={{ color: C.dark }}>¡Pedido Enviado!</h3>
                  <p className="text-sm text-black/50 mt-2 leading-relaxed">Te redirigimos a WhatsApp para confirmar tu pedido con Don Cloro.</p>
                </div>
              )}

              {cart.length > 0 && cartStep !== 3 && (
                <div className="p-4 border-t border-black/5 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-black/40">{cartStep === 1 ? 'Total' : 'Total a Pagar'}</span>
                    <span className="text-2xl font-black" style={{ color: C.primary }}>{'$'}{cartTotal}</span>
                  </div>
                  {cartStep === 1 && (
                    <button onClick={() => setCartStep(2)}
                      className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-transform active:scale-95"
                      style={{ backgroundColor: C.primary }}>
                      Continuar - Datos de Entrega <ArrowRight size={18} />
                    </button>
                  )}
                  {cartStep === 2 && (
                    <button onClick={handleSendOrder}
                      className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-[#1EBE5D] transition-colors shadow-lg shadow-[#25D366]/30">
                      <MessageCircle size={18} /> Enviar Pedido por WhatsApp
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
