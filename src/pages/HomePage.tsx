import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, MessageCircle, ArrowRight, Smartphone, Globe, Video, 
  CreditCard, CheckCircle2, ChevronRight, Star, ExternalLink, ShieldCheck, 
  Zap, Clock, Heart, Search, Plus, X, Layers, Printer, Award, HelpCircle,
  Menu, UtensilsCrossed, Scissors, Stethoscope, Dumbbell, Flame, Building2,
  Server, Mail
} from 'lucide-react';
import logo from '../logo.png';
import { CartButton } from '../components/common/CartButton';
import { GlobalFooter } from '../components/common/GlobalFooter';
import { trackMetaEvent } from '../utils/metaPixel';
import { Product } from '../data/products';

interface HomePageProps {
  products: Product[];
  categories: any[];
  favorites: (string | number)[];
  toggleFavorite: (id: string | number) => void;
  addToCart: (product: Product) => void;
}

export default function HomePage({
  products,
  categories,
  favorites,
  toggleFavorite,
  addToCart
}: HomePageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPhysicalCatalog, setShowPhysicalCatalog] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedPhysicalCat, setSelectedPhysicalCat] = useState('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Filtrado del catálogo físico cuando el usuario lo expande
  const filteredPhysicalProducts = useMemo(() => {
    let list = products;
    if (selectedPhysicalCat !== 'all') {
      list = list.filter(p => p.category?.toLowerCase() === selectedPhysicalCat.toLowerCase());
    }
    if (catalogSearch.trim() !== '') {
      const q = catalogSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      list = list.filter(p => {
        const name = p.name?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        const desc = p.description?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
        return name.includes(q) || desc.includes(q);
      });
    }
    return list;
  }, [products, selectedPhysicalCat, catalogSearch]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  React.useEffect(() => {
    const raw = window.location.hash || window.location.pathname;
    const cleanId = raw.replace(/^#\/?/, '').replace(/\/$/, '').toLowerCase();
    if (cleanId && ['menus', 'webs', 'tarjetas', 'invitaciones', 'taller', 'faq', 'preguntas'].includes(cleanId)) {
      const targetId = cleanId === 'preguntas' ? 'faq' : cleanId;
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 400);
    }
  }, []);

  const whatsappLink = (msg: string) => 
    `https://wa.me/525650469993?text=${encodeURIComponent(msg)}`;

  const faqs = [
    {
      q: '¿Tengo que pagar mensualidades o rentas de por vida?',
      a: 'No. En Imagine & Stamp creemos en la propiedad real: pagas un solo costo de configuración por tu menú digital o página web y es tuyo para siempre, sin comisiones obligatorias por pedido ni rentas forzosas.'
    },
    {
      q: '¿Cómo me llegan los pedidos de mis clientes?',
      a: 'Directo al WhatsApp de tu negocio. El cliente agrega platillos a su carrito, selecciona salsas o ingredientes, elige método de pago (efectivo con cambio o transferencia SPEI) y el pedido te llega formateado de manera clara y profesional para cocina.'
    },
    {
      q: '¿Cuánto tiempo tardan en entregarme mi proyecto?',
      a: 'Los menús digitales y tarjetas interactivas se entregan generalmente de 24 a 48 horas una vez recibido tu menú o carta. Las páginas web completas toman entre 3 y 7 días hábiles según la cantidad de secciones.'
    },
    {
      q: '¿Qué necesito para empezar?',
      a: 'Solo una foto o PDF de tu menú o catálogo actual, el logotipo de tu negocio y el número de WhatsApp donde deseas recibir tus pedidos. Del diseño, programación y código QR nos encargamos nosotros.'
    },
    {
      q: '¿También hacen los códigos QR impresos y stickers físicos?',
      a: '¡Sí! A diferencia de agencias que solo programan, tenemos taller propio de impresión, vinil de uso rudo y sublimación. Te entregamos tus stickers laminados para mesa resistentes al agua y displays para barra.'
    },
    {
      q: '¿La página web incluye hospedaje (hosting), dominio y correos corporativos?',
      a: '¡Sí! Nos encargamos de todo el ecosistema técnico: tu dominio (.com), tu hospedaje en servidores de alta velocidad, certificado de seguridad SSL y tus cuentas de correo corporativo profesionales (ej. contacto@tunegocio.com) para que tu negocio proyecte total formalidad desde el día uno.'
    },
    {
      q: '¿Puedo mudar una página web que ya tengo con otro proveedor?',
      a: '¡Claro que sí! Si tu sitio actual se cae seguido, es lento o te cobran mensualidades abusivas, realizamos la migración completa a nuestros servidores de alto rendimiento, te configuramos tus correos y te damos soporte técnico directo por WhatsApp.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#1A1C1C] font-body selection:bg-secondary/20 selection:text-primary">
      {/* ═══════════════════════════════════════════════════════════════
          HEADER FLOTANTE CON GLASSMORPHISM (Awwwards Grade)
      ═══════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-primary/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo y Nombre */}
          <a href="#/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white p-1.5 shadow-sm border border-primary/10 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Imagine & Stamp" className="h-full w-auto object-contain" />
            </div>
            <div>
              <span className="font-headline font-black text-lg sm:text-xl text-primary tracking-tight block leading-none">
                Imagine &amp; Stamp
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary block mt-0.5">
                Estudio Digital &amp; Taller
              </span>
            </div>
          </a>

          {/* Navegación Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-primary/5 p-1.5 rounded-full border border-primary/5">
            <button 
              onClick={() => scrollToSection('menus')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Menús QR
            </button>
            <button 
              onClick={() => scrollToSection('webs')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Páginas Web
            </button>
            <button 
              onClick={() => scrollToSection('tarjetas')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Tarjetas Digitales
            </button>
            <button 
              onClick={() => scrollToSection('invitaciones')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Video 3D &amp; Invitaciones
            </button>
            <button 
              onClick={() => scrollToSection('taller')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Taller Físico
            </button>
            <button 
              onClick={() => scrollToSection('faq')} 
              className="px-4 py-2 rounded-full text-xs font-bold text-primary/70 hover:text-primary hover:bg-white transition-all"
            >
              Preguntas
            </button>
          </nav>

          {/* Acciones Derecha */}
          <div className="flex items-center gap-3">
            {/* Botón WhatsApp Directo */}
            <a
              href={whatsappLink('Hola René, vengo de la página de inicio de Imagine & Stamp y me gustaría cotizar un proyecto')}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackMetaEvent('Contact')}
              className="hidden sm:inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <MessageCircle size={16} fill="currentColor" />
              <span>Cotizar por WhatsApp</span>
            </a>

            <CartButton />

            {/* Menú Hamburguesa Móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-2xl bg-primary/5 hover:bg-primary/10 flex items-center justify-center text-primary transition-colors"
              aria-label="Menú de navegación"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Drawer Móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-primary/5 bg-white/95 backdrop-blur-2xl px-6 py-6 space-y-3"
            >
              <button 
                onClick={() => scrollToSection('menus')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>🍔 Menús Digitales QR</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>
              <button 
                onClick={() => scrollToSection('webs')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>🌐 Páginas Web &amp; Landings</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>
              <button 
                onClick={() => scrollToSection('tarjetas')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>📇 Tarjetas Digitales Interactivas</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>
              <button 
                onClick={() => scrollToSection('invitaciones')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>🎬 Video 3D &amp; Invitaciones Infantiles</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>
              <button 
                onClick={() => scrollToSection('taller')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>🖨️ Taller Físico &amp; Sublimación</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="w-full text-left py-3 px-4 rounded-xl text-sm font-bold text-primary hover:bg-primary/5 flex items-center justify-between"
              >
                <span>❓ Preguntas Frecuentes</span>
                <ChevronRight size={16} className="text-primary/30" />
              </button>

              <div className="pt-4 border-t border-primary/5">
                <a
                  href={whatsappLink('Hola René, quiero cotizar un proyecto con Imagine & Stamp')}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle size={18} fill="currentColor" />
                  Escribir a WhatsApp Directo
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-24 sm:pt-28">
        {/* ═══════════════════════════════════════════════════════════════
            HERO PRINCIPAL (Cinematic, Modern, Value-Driven)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="relative px-4 sm:px-6 py-12 sm:py-20 max-w-7xl mx-auto overflow-hidden">
          {/* Subtle Ambient Glow Orbs */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-secondary/15 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="text-center max-w-4xl mx-auto">
            {/* Pill Eyebrow */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-white/90 border border-primary/10 px-4 py-1.5 rounded-full shadow-sm mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/80">
                Agencia Digital &amp; Estudio Creativo · CDMX
              </span>
            </motion.div>

            {/* Titular Principal */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-headline font-black text-primary tracking-tight leading-[1.08] mb-6"
            >
              Páginas Web, Menús Digitales y Video con IA{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-orange-500 to-amber-500">
                que multiplican tus ventas.
              </span>
            </motion.h1>

            {/* Subtítulo */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-primary/70 max-w-2xl mx-auto leading-relaxed mb-10"
            >
              Convertimos negocios locales en experiencias digitales que reciben pedidos y clientes directos por WhatsApp.{' '}
              <strong className="text-primary font-semibold">Un solo pago, sin mensualidades forzosas y con soporte de persona a persona.</strong>
            </motion.p>

            {/* Botones de Acción (Double-Bezel Architecture) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
            >
              <button
                onClick={() => scrollToSection('menus')}
                className="w-full sm:w-auto p-1.5 rounded-full bg-primary/5 border border-primary/10 hover:border-secondary/50 transition-all group"
              >
                <div className="px-7 py-3.5 bg-primary text-white font-headline font-black text-xs uppercase tracking-wider rounded-full shadow-lg group-hover:bg-[#002244] transition-all flex items-center justify-center gap-3">
                  <span>Ver Demos en Vivo</span>
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight size={13} />
                  </div>
                </div>
              </button>

              <a
                href={whatsappLink('Hola René, me interesa cotizar una solución digital para mi negocio')}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackMetaEvent('Contact')}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white border border-primary/15 text-primary font-headline font-black text-xs uppercase tracking-wider hover:bg-primary/5 transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="text-[#25D366]" fill="currentColor" />
                <span>Hablar por WhatsApp</span>
              </a>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              BARRA DE CONFIANZA & MÉTRICAS (Social Proof)
          ═══════════════════════════════════════════════════════════════ */}
          <div className="mt-16 sm:mt-24 pt-8 border-t border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4 rounded-2xl bg-white/60 border border-primary/5">
                <p className="font-headline font-black text-2xl sm:text-3xl text-primary mb-1">+15 Demos</p>
                <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider">En Producción Real</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-primary/5">
                <p className="font-headline font-black text-2xl sm:text-3xl text-secondary mb-1">0% Comisiones</p>
                <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Tus Ventas Son Tuyas</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-primary/5">
                <p className="font-headline font-black text-2xl sm:text-3xl text-primary mb-1">WhatsApp</p>
                <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Pedidos Directos</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/60 border border-primary/5">
                <p className="font-headline font-black text-2xl sm:text-3xl text-emerald-600 mb-1">1 Solo Pago</p>
                <p className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Sin Rentas Mensuales</p>
              </div>
            </div>

            {/* Ticker de Negocios Reales */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold text-primary/70">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary/40 mr-2">Soluciones activas para:</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🌮 Takero's CDMX</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🐟 Candymar Mariscos</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🐺 La Cueva del Lobo</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🏋️ Strong Gym Iron City</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🍕 Brothers Pizza</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">⚡ Vicma Laser</span>
              <span className="px-3 py-1 rounded-full bg-white border border-primary/10 shadow-2xs">🥩 Aaah! Carbón</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 1: MENÚS DIGITALES INTERACTIVOS (PRODUCTO ESTRELLA)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="menus" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-orange-700 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                <UtensilsCrossed size={14} />
                <span>Producto Más Vendido · $1,650 MXN</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-headline font-black text-primary tracking-tight leading-tight">
                Menús Digitales QR con Pedidos a WhatsApp
              </h2>
              <p className="text-primary/70 text-base sm:text-lg mt-3">
                Diseñados para taquerías, pizzerías, marisquerías y restaurantes. Tu comensal escanea, personaliza sus salsas o ingredientes y te manda el pedido listo a cocina.
              </p>
            </div>

            <div className="shrink-0">
              <a
                href={whatsappLink('Hola René, quiero contratar un Menú Digital QR con carrito a WhatsApp por $1,650 MXN')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-orange-600 text-white font-headline font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-lg hover:scale-105 transition-all"
              >
                <span>Cotizar Menú ($1,650 MXN)</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* 3 Pilares del Menú */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-secondary flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="font-headline font-bold text-lg text-primary mb-2">0% Comisiones por Pedido</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                Olvídate de regalar el 30% a aplicaciones como Uber Eats o DiDi Food. Cada pedido va directo a tu WhatsApp y el dinero entra integro a tu caja.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-headline font-bold text-lg text-primary mb-2">Actualización en 1 Minuto</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                ¿Subió el precio de un platillo o se te agotó un ingrediente? Lo modificas en minutos sin tener que volver a gastar en reimpresión de papel.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <CreditCard size={24} />
              </div>
              <h3 className="font-headline font-bold text-lg text-primary mb-2">Cambio en Efectivo y SPEI</h3>
              <p className="text-sm text-primary/70 leading-relaxed">
                El cliente calcula cuánto cambio necesita su repartidor o copia tu cuenta CLABE con 1 solo toque para transferirte al instante.
              </p>
            </div>
          </div>

          {/* Grid de Demos Reales en Vivo */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-primary/10 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/5">
              <div>
                <h3 className="font-headline font-black text-xl text-primary">Prueba los Demos en Vivo desde tu Celular</h3>
                <p className="text-xs text-primary/60">Haz clic en cualquiera para experimentar cómo lo ven los clientes reales:</p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full">
                Interactive CRO Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Demo 1: Candymar */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-cyan-400 hover:shadow-xl transition-all flex flex-col justify-between bg-slate-900 text-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-400/20 text-cyan-300">
                      Marisquería &amp; Bar
                    </span>
                    <span className="text-xs text-cyan-400 font-bold">Dark Cyan Theme</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-white mb-1">Candymar Mariscos</h4>
                  <p className="text-xs text-slate-300 mb-4">
                    Estilo marisquería fresca con linograbado, doblez 3D, generador de carta PDF y carrito interactivo.
                  </p>
                </div>
                <a
                  href="#/candymar"
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Abrir Demo Candymar</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Demo 2: La Cueva del Lobo */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-amber-500 hover:shadow-xl transition-all flex flex-col justify-between bg-[#12100E] text-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                      Antojitos &amp; Pulquería
                    </span>
                    <span className="text-xs text-amber-400 font-bold">Xochimilco</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-white mb-1">La Cueva del Lobo</h4>
                  <p className="text-xs text-stone-300 mb-4">
                    Hero cinemático, curados de pulque, micheladas y antojitos mexicanos con selector de salsa.
                  </p>
                </div>
                <a
                  href="#/la-cueva-del-lobo"
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Abrir Demo La Cueva del Lobo</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Demo 3: Brothers Pizza */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-rose-500 hover:shadow-xl transition-all flex flex-col justify-between bg-[#141011] text-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300">
                      Pizzería Artesanal
                    </span>
                    <span className="text-xs text-rose-400 font-bold">Horno de Piedra</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-white mb-1">Brothers Pizza</h4>
                  <p className="text-xs text-zinc-300 mb-4">
                    Selector de 8 o 18 rebanadas, orilla con queso fundido y personalización de ingredientes.
                  </p>
                </div>
                <a
                  href="#/brothers-pizza"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Abrir Demo Brothers Pizza</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Demo 4: Strong Gym Iron City */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-red-600 hover:shadow-xl transition-all flex flex-col justify-between bg-black text-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-600/20 text-red-400">
                      Gym &amp; Suplementos
                    </span>
                    <span className="text-xs text-red-500 font-bold">Catálogo Pro</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-white mb-1">Strong Gym Iron City</h4>
                  <p className="text-xs text-zinc-400 mb-4">
                    Catálogo de membresías, proteínas, pre-entrenos y barra de shakes al momento.
                  </p>
                </div>
                <a
                  href="#/strong-gym"
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Abrir Demo Strong Gym</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Demo 5: Aaah! Carbón */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-amber-600 hover:shadow-xl transition-all flex flex-col justify-between bg-[#141210] text-white">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-600/20 text-amber-400">
                      Parrilla &amp; Cortes
                    </span>
                    <span className="text-xs text-amber-500 font-bold">120+ Platillos</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-white mb-1">AAAH! Carbón</h4>
                  <p className="text-xs text-stone-300 mb-4">
                    Hamburguesas de sirloin, cortes sonorenses y botanas con selector de término de carne.
                  </p>
                </div>
                <a
                  href="#/aaah-carbon"
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Abrir Demo Aaah! Carbón</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Demo 6: Takero's CDMX */}
              <div className="group rounded-2xl border border-primary/10 p-5 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between bg-white text-primary">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Taquería &amp; Combos
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">En Producción</span>
                  </div>
                  <h4 className="font-headline font-black text-lg text-primary mb-1">Takero's CDMX</h4>
                  <p className="text-xs text-primary/70 mb-4">
                    Tacos, alambres, gorditas personalizadas y cálculo automático de costo de empaque.
                  </p>
                </div>
                <a
                  href="https://takeros-cdmx.imagineandstamp.site"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-headline font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Ver Sitio Takero's</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 2: PÁGINAS WEB & LANDINGS COMERCIALES DE ALTO IMPACTO
        ═══════════════════════════════════════════════════════════════ */}
        <section id="webs" className="py-16 sm:py-24 bg-white border-y border-primary/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                  <Globe size={14} />
                  <span>Desarrollo Web &amp; SEO Local</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-headline font-black text-primary tracking-tight leading-tight mb-6">
                  Páginas web modernas, rápidas y listas para Google
                </h2>
                <p className="text-primary/70 text-base sm:text-lg mb-8 leading-relaxed">
                  Creamos sitios web a la medida diseñados para generar llamadas y mensajes de compra. Sin plantillas genéricas lentas ni páginas pesadas que tardan 10 segundos en abrir.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">Carga Ultrarrápida (&lt; 1 segundo)</h4>
                      <p className="text-xs text-primary/60">Tecnología moderna en React y Vite para que tus clientes no abandonen antes de ver tu producto.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">Hospedaje Web de Alta Velocidad y Dominio Incluido</h4>
                      <p className="text-xs text-primary/60">Servidor seguro con certificado SSL y dominio propio. Cero trámites técnicos por tu cuenta; nosotros lo dejamos listo.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">Correos Corporativos con Tu Marca</h4>
                      <p className="text-xs text-primary/60">Cuentas profesionales como <strong>contacto@tunegocio.com</strong> o <strong>ventas@tunegocio.com</strong> para proyectar máxima formalidad y confianza.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">100% Optimizadas para Móvil (iPhone y Android)</h4>
                      <p className="text-xs text-primary/60">El 90% de tus visitas entra desde un smartphone. Tu página se verá impecable con botones de 1 toque.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">SEO Local y Google Maps Ready</h4>
                      <p className="text-xs text-primary/60">Estructura Schema Markup y palabras clave pensadas para que los clientes de tu zona te encuentren.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Server size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-primary">¿Ya tienes web vieja? Migración &amp; Mantenimiento</h4>
                      <p className="text-xs text-primary/60">Mudamos tu página actual a nuestros servidores estables, te ahorramos costos y te damos soporte directo por WhatsApp.</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <a
                    href={whatsappLink('Hola René, me interesa cotizar una Página Web o Landing Page profesional')}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-7 py-4 rounded-full bg-primary hover:bg-[#002244] text-white font-headline font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Cotizar Mi Página Web</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>

              {/* Showcase Visual: Vicma Laser & Izta-Popo */}
              <div className="space-y-6">
                {/* Caso Vicma Laser */}
                <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 size={18} className="text-orange-500" />
                      <span className="text-xs font-black uppercase tracking-wider text-orange-400">Landing Industrial B2B</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">React + Motion</span>
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-2">Vicma Laser</h3>
                  <p className="text-sm text-slate-300 mb-6">
                    Landing page de corte láser de fibra óptica y celosías metálicas arquitectónicas con cotizador de planos vía WhatsApp.
                  </p>
                  <a
                    href="#/vicma-laser"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Explorar Landing Vicma Laser</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                {/* Caso Izta-Popo */}
                <div className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-900 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Portal Ecoturístico &amp; 3D</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-300">Cartografía Satelital</span>
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-2">Parque Nacional Izta-Popo</h3>
                  <p className="text-sm text-emerald-100/80 mb-6">
                    Plataforma de concientización ambiental, voluntariado, fotografías de alta definición y cartografía 3D.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-bold">
                    <span>Proyecto de Alto Rendimiento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 3: VIDEO-INVITACIONES Y VIDEOS 3D CON IA (Viral B2C)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="invitaciones" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
              <Video size={14} />
              <span>Video &amp; Animación 3D con Inteligencia Artificial</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-headline font-black text-primary tracking-tight leading-tight">
              Invitaciones y Videos que Sorprenden a Todos
            </h2>
            <p className="text-primary/70 text-base sm:text-lg mt-3">
              Haz que el cumpleaños o evento de tu pequeño sea inolvidable. Formato vertical 9:16 perfecto para enviar por WhatsApp y publicar en estados o redes.
            </p>
          </div>

          {/* 4 Niveles de Invitaciones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Nivel 1: Interactiva */}
            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 block mb-2">Opción Rápida</span>
                <h3 className="font-headline font-black text-xl text-primary mb-1">Interactiva</h3>
                <p className="font-headline font-black text-3xl text-secondary mb-4">$99 <span className="text-xs font-medium text-primary/40">MXN</span></p>
                <ul className="space-y-2.5 text-xs text-primary/70 mb-6">
                  <li className="flex items-center gap-2">✓ Botón directo a WhatsApp</li>
                  <li className="flex items-center gap-2">✓ Botón ubicación en Google Maps</li>
                  <li className="flex items-center gap-2">✓ Formato interactivo celular</li>
                  <li className="flex items-center gap-2">✓ Entrega en 24 horas</li>
                </ul>
              </div>
              <a
                href={whatsappLink('Hola René, quiero pedir la Invitación Interactiva de $99 MXN')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Pedir por $99 MXN
              </a>
            </div>

            {/* Nivel 2: Video Animado */}
            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 block mb-2">Más Popular</span>
                <h3 className="font-headline font-black text-xl text-primary mb-1">Video Animado</h3>
                <p className="font-headline font-black text-3xl text-primary mb-4">$399 <span className="text-xs font-medium text-primary/40">MXN</span></p>
                <ul className="space-y-2.5 text-xs text-primary/70 mb-6">
                  <li className="flex items-center gap-2">✓ Video vertical HD (1080x1920)</li>
                  <li className="flex items-center gap-2">✓ Foto del festejado integrada</li>
                  <li className="flex items-center gap-2">✓ Música y efectos festivos</li>
                  <li className="flex items-center gap-2">✓ Pase directo y datos claros</li>
                </ul>
              </div>
              <a
                href={whatsappLink('Hola René, quiero pedir el Video Animado de $399 MXN')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Pedir por $399 MXN
              </a>
            </div>

            {/* Nivel 3: Historia Cinemática */}
            <div className="p-6 rounded-3xl bg-white border border-primary/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-primary/40 block mb-2">Efecto WOW</span>
                <h3 className="font-headline font-black text-xl text-primary mb-1">Historia Cinemática</h3>
                <p className="font-headline font-black text-3xl text-primary mb-4">$499 <span className="text-xs font-medium text-primary/40">MXN</span></p>
                <ul className="space-y-2.5 text-xs text-primary/70 mb-6">
                  <li className="flex items-center gap-2">✓ Estructura mágica en 3 actos</li>
                  <li className="flex items-center gap-2">✓ Animaciones temáticas avanzadas</li>
                  <li className="flex items-center gap-2">✓ Resplandor neón y textos dinámicos</li>
                  <li className="flex items-center gap-2">✓ Locución profesional mexicana</li>
                </ul>
              </div>
              <a
                href={whatsappLink('Hola René, quiero pedir la Historia Cinemática de $499 MXN')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Pedir por $499 MXN
              </a>
            </div>

            {/* Nivel 4: Protagonista 3D + Canción */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-primary to-[#001833] text-white border border-primary shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-secondary text-white px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                Exclusivo
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-white/60 block mb-2">Estilo Pixar 3D</span>
                <h3 className="font-headline font-black text-xl text-white mb-1">Protagonista 3D</h3>
                <p className="font-headline font-black text-3xl text-secondary mb-4">$699 <span className="text-xs font-medium text-white/60">MXN</span></p>
                <ul className="space-y-2.5 text-xs text-white/80 mb-6">
                  <li className="flex items-center gap-2">★ Su rostro en personaje 3D Pixar</li>
                  <li className="flex items-center gap-2">★ Canción original con su nombre</li>
                  <li className="flex items-center gap-2">★ Lip-Sync (el personaje habla)</li>
                  <li className="flex items-center gap-2">★ Recuerdo inolvidable para siempre</li>
                </ul>
              </div>
              <a
                href={whatsappLink('Hola René, me interesa la Invitación Protagonista 3D con Canción Original por $699 MXN')}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-secondary hover:bg-orange-600 text-white font-headline font-black text-xs uppercase tracking-wider text-center shadow-lg transition-colors"
              >
                Pedir 3D por $699 MXN
              </a>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#/videoinvitaciones"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-primary/15 text-primary font-headline font-black text-xs uppercase tracking-wider hover:bg-primary/5 transition-all shadow-sm"
            >
              <span>Ver Catálogo Completo y Muestras de Video</span>
              <ArrowRight size={14} className="text-secondary" />
            </a>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 4: TARJETAS DIGITALES INTERACTIVAS (Smart vCards)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="tarjetas" className="py-16 sm:py-24 bg-white border-y border-primary/5 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-700 text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                  <Smartphone size={14} />
                  <span>Smart Link in Bio &amp; Agendador</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-headline font-black text-primary tracking-tight leading-tight">
                  Tarjetas Digitales para Barberías, Veterinarias y Profesionistas
                </h2>
                <p className="text-primary/70 text-base sm:text-lg mt-3">
                  Reemplaza el papel por una tarjeta inteligente interactiva. Permite a tus clientes agendar cita por WhatsApp, ver tus precios, encontrar tu ubicación y guardar tu contacto en 1 toque.
                </p>
              </div>

              <div className="shrink-0">
                <a
                  href={whatsappLink('Hola René, me interesa crear una Tarjeta Digital Interactiva para mi negocio')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-[#002244] text-white font-headline font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-lg transition-all"
                >
                  <span>Crear Mi Tarjeta Digital</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Tarjeta Barbería Gentleman's Cut */}
              <div className="p-8 rounded-3xl bg-[#0F0E0D] text-white border border-stone-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                      Barbería &amp; Estética
                    </span>
                    <Scissors size={20} className="text-amber-500" />
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-2">Gentleman's Cut Barbería</h3>
                  <p className="text-sm text-stone-300 mb-6">
                    Agendador de citas con selector de servicio (corte clásico, barba con navaja, tinte, facial), elección de barbero y confirmación automática por WhatsApp.
                  </p>
                </div>
                <a
                  href="#/tarjeta-barberia"
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-headline font-black text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                  <span>Probar Demo Tarjeta Barbería</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Tarjeta Veterinaria Vita Vet */}
              <div className="p-8 rounded-3xl bg-[#082220] text-white border border-teal-800 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-teal-400/20 text-teal-300">
                      Clínica Veterinaria &amp; Urgencias
                    </span>
                    <Stethoscope size={20} className="text-teal-400" />
                  </div>
                  <h3 className="font-headline font-black text-2xl mb-2">Vita Vet Clínica</h3>
                  <p className="text-sm text-teal-100/80 mb-6">
                    Selector de mascota (perro o gato), botón pulsante de Urgencias 24/7 directo a llamada y lista de 8 servicios clínicos detallados.
                  </p>
                </div>
                <a
                  href="#/tarjeta-veterinaria"
                  className="w-full py-3.5 rounded-2xl bg-teal-400 hover:bg-teal-300 text-teal-950 font-headline font-black text-xs uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-2"
                >
                  <span>Probar Demo Tarjeta Veterinaria</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 5: TALLER FÍSICO & MATERIALES (SOLUCIÓN 360°)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="taller" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
          <div className="bg-gradient-to-br from-primary via-[#002244] to-[#001833] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mb-10 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-secondary text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                <Printer size={14} />
                <span>Del Mundo Digital al Físico · Taller Propio</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-headline font-black text-white tracking-tight leading-tight mb-4">
                Taller de Impresión, Sublimación y Vinil de Uso Rudo
              </h2>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                No somos una agencia que solo te envía un link y se desentiende. En Imagine &amp; Stamp contamos con maquinaria propia de sublimación, DTF textil, vinil laminado y corte para fabricar los materiales que tu negocio necesita para operar.
              </p>
            </div>

            {/* 4 Soluciones Físicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl mb-2 block">🏷️</span>
                <h4 className="font-bold text-white text-base mb-1">Stickers QR para Mesas</h4>
                <p className="text-xs text-white/70">Vinil laminado resistente a derrames de agua, grasa, alcohol y limpieza continua.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl mb-2 block">💳</span>
                <h4 className="font-bold text-white text-base mb-1">Displays de Acrílico</h4>
                <p className="text-xs text-white/70">Porta-menús y códigos QR para barra, mostrador y recepción listos para exhibir.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl mb-2 block">👕</span>
                <h4 className="font-bold text-white text-base mb-1">DTF Textil &amp; Uniformes</h4>
                <p className="text-xs text-white/70">Playeras, mandiles y gorras de alta duración para el personal de tu restaurante o negocio.</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl mb-2 block">🎒</span>
                <h4 className="font-bold text-white text-base mb-1">Etiquetas Escolares</h4>
                <p className="text-xs text-white/70">Stickers y etiquetas termoadhesivas resistentes a lavadora y microondas.</p>
              </div>
            </div>

            {/* Botón para desplegar catálogo físico o cotizar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowPhysicalCatalog(!showPhysicalCatalog)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-secondary hover:bg-orange-600 text-white font-headline font-black text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Layers size={16} />
                <span>{showPhysicalCatalog ? 'Ocultar Catálogo de Artículos' : 'Explorar Catálogo de Artículos y Regalos Físicos'}</span>
              </button>

              <a
                href={whatsappLink('Hola René, me interesa cotizar material impreso, stickers QR o DTF con Imagine & Stamp')}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-headline font-black text-xs uppercase tracking-wider transition-all text-center"
              >
                Cotizar Materiales por WhatsApp
              </a>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              CATÁLOGO FÍSICO INTERACTIVO (Desplegable sin estorbar)
          ═══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {showPhysicalCatalog && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-primary/10 shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="font-headline font-black text-2xl text-primary">Catálogo de Artículos y Personalización</h3>
                    <p className="text-xs text-primary/60">Selecciona productos físicos para agregar a tu pedido con envío o entrega:</p>
                  </div>

                  {/* Buscador interno */}
                  <div className="relative w-full md:w-72">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder="Buscar playeras, tazas, stickers..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-primary/5 text-xs font-medium border border-primary/10 focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>

                {/* Categorías filtro */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedPhysicalCat(cat.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                        selectedPhysicalCat === cat.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-primary/5 text-primary/70 hover:bg-primary/10'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Masonry / Grid de Productos */}
                {filteredPhysicalProducts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredPhysicalProducts.slice(0, 12).map((prod) => (
                      <div key={prod.id} className="bg-[#F9F7F2] rounded-2xl p-3 border border-primary/10 flex flex-col justify-between group">
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-white">
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            loading="lazy" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                          <button
                            onClick={() => toggleFavorite(prod.id)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-accent-magenta shadow-sm"
                          >
                            <Heart size={16} fill={favorites.includes(prod.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-xs text-primary truncate mb-1">{prod.name}</h4>
                          <p className="text-[10px] text-primary/60 line-clamp-1 mb-3">{prod.description}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="font-headline font-black text-sm text-primary">${prod.price} MXN</span>
                            <button
                              onClick={() => addToCart(prod)}
                              className="p-2 rounded-lg bg-secondary hover:bg-orange-600 text-white transition-colors"
                              title="Agregar al carrito"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-primary/40 text-sm">
                    No se encontraron artículos con ese criterio.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 6: PREGUNTAS FRECUENTES (FAQ)
        ═══════════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-16 sm:py-24 bg-white border-y border-primary/5 scroll-mt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-4">
                <HelpCircle size={14} />
                <span>Preguntas Frecuentes</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-headline font-black text-primary tracking-tight leading-tight">
                Resolvemos todas tus dudas
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div 
                    key={index}
                    className="border border-primary/10 rounded-2xl overflow-hidden transition-all bg-[#F9F7F2]"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-headline font-bold text-sm sm:text-base text-primary hover:text-secondary transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight 
                        size={18} 
                        className={`text-primary/40 shrink-0 transition-transform ${isOpen ? 'rotate-90 text-secondary' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-5 text-sm text-primary/70 leading-relaxed border-t border-primary/5 bg-white pt-4"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enlaces a las páginas de servicio estáticas (public/<slug>/, generadas con scripts/generar-paginas-seo.mjs) */}
        <nav aria-label="Servicios" className="pt-16 sm:pt-24 px-4 sm:px-6 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-headline font-black text-primary tracking-tight text-center mb-6">
            Conoce cada servicio a detalle
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              ['Páginas web', '/paginas-web/'],
              ['Menús digitales QR', '/menu-digital/'],
              ['Invitaciones digitales', '/invitaciones-digitales/'],
              ['Tarjetas digitales', '/tarjetas-digitales/'],
              ['Hosting y dominio', '/hosting-y-dominio/'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="px-4 py-4 rounded-2xl bg-white border border-primary/10 text-center font-headline font-bold text-sm text-primary hover:border-secondary hover:text-secondary transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ═══════════════════════════════════════════════════════════════
            BLOQUE 7: LLAMADO A LA ACCIÓN FINAL (CRO)
        ═══════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-primary text-white shadow-2xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto relative z-10">
              <span className="text-secondary font-black text-xs uppercase tracking-[0.2em] block mb-3">
                ¿Listo para modernizar tu negocio?
              </span>
              <h2 className="text-3xl sm:text-5xl font-headline font-black tracking-tight leading-tight mb-6">
                Hablemos por WhatsApp y arranquemos tu proyecto hoy
              </h2>
              <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
                Sin intermediarios, sin cotizaciones complicadas. Cuéntanos qué necesita tu negocio y te asesoramos directamente para entregarte la mejor solución.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={whatsappLink('Hola René, me gustaría platicar contigo sobre un proyecto para mi negocio')}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackMetaEvent('Contact')}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-headline font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} fill="currentColor" />
                  <span>Escribir a WhatsApp (56 5046 9993)</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer con datos de marca oficiales */}
      <GlobalFooter 
        description="Convertimos negocios locales en experiencias digitales que venden por WhatsApp: menús, tarjetas, páginas web y videos con IA, por un solo pago y sin comisiones."
      />
    </div>
  );
}
