// ═══════════════════════════════════════════════════════════════════════════
// MAGNATREN — Trenes y carritos eléctricos
// Landing page de servicios (SIN carrito). Venta, fabricación y mantenimiento
// de trenes eléctricos infantiles/turísticos y carritos de golf/utilitarios.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrainFront, BatteryCharging, Factory, Wrench, Truck, ShieldCheck,
  BadgeCheck, Award, Zap, Sparkles, PackageCheck, MessageCircle,
  MapPin, Mail, Clock, Menu, X, ArrowRight, ArrowUpRight, Check,
  Star, ChevronDown, ChevronLeft, ChevronRight, Instagram, Facebook,
  CircleDollarSign, Headset, Send, Users, Gauge, Compass, Volume2,
  SlidersHorizontal, CheckCircle2
} from 'lucide-react';
import { clientConfig } from '../config';

const C = clientConfig.colors;
const WHATSAPP = clientConfig.phone;

// ═══════════════════════════════════════════════════════════════════════════
// DATOS
// ═══════════════════════════════════════════════════════════════════════════

// Galería con imágenes reales del cliente (public/magnatren/). Alt = SEO.
const GALLERY: { src: string; alt: string; tag: string }[] = [
  { src: './magnatren/tren-electrico-02.jpg', alt: 'Tren eléctrico turístico Magnatren en exhibición', tag: 'Turístico' },
  { src: './magnatren/tren-electrico-01.jpg', alt: 'Tren eléctrico infantil Magnatren', tag: 'Infantil' },
  { src: './magnatren/tren-electrico-03.jpg', alt: 'Tren eléctrico infantil para parques y plazas', tag: 'Comercial' },
  { src: './magnatren/tren-electrico-04.jpg', alt: 'Tren turístico eléctrico Magnatren', tag: 'Turístico' },
  { src: './magnatren/tren-electrico-05.jpg', alt: 'Tren eléctrico para niños Magnatren', tag: 'Infantil' },
  { src: './magnatren/tren-electrico-06.jpg', alt: 'Carrito eléctrico Magnatren', tag: 'Utilitario' },
  { src: './magnatren/tren-electrico-07.jpg', alt: 'Tren eléctrico infantil colorido', tag: 'Infantil' },
  { src: './magnatren/tren-electrico-08.jpg', alt: 'Tren turístico eléctrico en operación', tag: 'Turístico' },
  { src: './magnatren/tren-electrico-09.jpg', alt: 'Tren eléctrico Magnatren', tag: 'Infantil' },
  { src: './magnatren/tren-electrico-10.jpg', alt: 'Tren eléctrico infantil para eventos', tag: 'Eventos' },
  { src: './magnatren/tren-electrico-11.jpg', alt: 'Tren turístico eléctrico Magnatren', tag: 'Turístico' },
  { src: './magnatren/tren-electrico-12.jpg', alt: 'Carrito utilitario eléctrico', tag: 'Utilitario' },
  { src: './magnatren/tren-electrico-13.jpg', alt: 'Tren eléctrico Magnatren en detalle', tag: 'Fabricación' },
  { src: './magnatren/tren-electrico-14.jpg', alt: 'Flota de trenes eléctricos Magnatren', tag: 'Flota' },
];

// MODELOS & ESPECIFICACIONES TÉCNICAS
const MODELS_SPECS = [
  {
    id: 'infantil',
    name: 'Tren Eléctrico Infantil "Expreso Mágico"',
    tagline: 'Diseñado especialmente para plazas comerciales, parques infantiles y salones de eventos.',
    image: './magnatren/tren-electrico-01.jpg',
    specs: [
      { icon: Users, label: 'Capacidad', val: '14 a 20 pasajeros (niños y adultos acompañantes)' },
      { icon: BatteryCharging, label: 'Autonomía', val: '8 a 10 horas de operación continua por carga' },
      { icon: Gauge, label: 'Velocidad', val: 'Regulable de seguridad: 0 a 8 km/h' },
      { icon: Compass, label: 'Radio de Giro', val: '2.8 metros (ideal para pasillos y giros cerrados)' },
      { icon: Volume2, label: 'Sonido y Luces', val: 'Efecto vapor digital, campana, silbato y LED perimetral' },
      { icon: ShieldCheck, label: 'Seguridad', val: 'Cinturones de seguridad, frenos eléctricos de parada suave' },
    ],
    highlights: ['Locomotora + 3 ó 4 vagones temáticos', 'Carga a toma doméstica 110V / 220V', 'Personalización de colores y logotipo corporativo'],
  },
  {
    id: 'turistico',
    name: 'Tren Turístico "Gran Tour Express"',
    tagline: 'Alta capacidad y elegancia para hoteles, resorts, zoológicos, malecones y centros históricos.',
    image: './magnatren/tren-electrico-02.jpg',
    specs: [
      { icon: Users, label: 'Capacidad', val: '20 a 30 pasajeros adultos / familiares' },
      { icon: BatteryCharging, label: 'Autonomía', val: '10 a 12 horas continuas con baterías de alto rendimiento' },
      { icon: Gauge, label: 'Velocidad', val: 'Ajustable de 5 a 15 km/h' },
      { icon: Compass, label: 'Tracción', val: 'Motor eléctrico de alto torque para pendientes y desniveles' },
      { icon: ShieldCheck, label: 'Frenos', val: 'Sistema de freno hidráulico de disco independiente' },
      { icon: Volume2, label: 'Audio', val: 'Sistema de sonido y voceo para guías turísticos integrado' },
    ],
    highlights: ['Techo panorámico y accesos ergonómicos', 'Estructura en acero de alta resistencia antioxidante', 'Suspensión reforzada para máxima suavidad de marcha'],
  },
  {
    id: 'carritos',
    name: 'Carritos de Golf y Utilitarios Eléctricos',
    tagline: 'Movilidad eficiente y sustentable para hoteles, residenciales, seguridad y logística de carga.',
    image: './magnatren/tren-electrico-06.jpg',
    specs: [
      { icon: Users, label: 'Configuración', val: '2, 4 ó 6 plazas / Caja de carga de hasta 450 kg' },
      { icon: BatteryCharging, label: 'Baterías', val: 'Banco de ciclo profundo 48V de libre mantenimiento' },
      { icon: Gauge, label: 'Velocidad Máx.', val: 'Hasta 25 km/h con limitador programable' },
      { icon: ShieldCheck, label: 'Chasis', val: 'Aluminio / acero galvanizado resistente a la corrosión' },
      { icon: Compass, label: 'Terrenos', val: 'Llantas de alto agarre para pavimento, adoquín o césped' },
      { icon: Zap, label: 'Eficiencia', val: 'Cero emisiones y mínimo costo por kilómetro recorrido' },
    ],
    highlights: ['Opciones con caja de volteo o asientos abatibles', 'Parabrisas de seguridad y luces LED de alta visibilidad', 'Garantía directa de fábrica y refacciones disponibles'],
  },
];

const SERVICES = [
  {
    id: 'venta', icon: TrainFront,
    title: 'Venta de trenes eléctricos',
    desc: 'Trenes eléctricos infantiles y turísticos listos para operar en parques, plazas, centros comerciales, hoteles y eventos.',
    tags: ['Tren eléctrico infantil', 'Tren turístico', 'Seminuevos'],
  },
  {
    id: 'fabricacion', icon: Factory,
    title: 'Fabricación a medida',
    desc: 'Diseñamos y manufacturamos trenes eléctricos personalizados: tamaño, número de vagones, colores y temática a tu medida.',
    tags: ['Diseño propio', 'A medida', 'Personalizado'],
  },
  {
    id: 'mantenimiento', icon: Wrench,
    title: 'Mantenimiento y reparación',
    desc: 'Servicio técnico especializado: baterías, motores, frenos y carrocería. Alargamos la vida útil de tu equipo.',
    tags: ['Baterías', 'Motores', 'Refacciones'],
  },
  {
    id: 'carritos', icon: BatteryCharging,
    title: 'Carritos de golf y utilitarios',
    desc: 'Carritos eléctricos de golf y vehículos utilitarios eléctricos para traslado de personas y carga en espacios amplios.',
    tags: ['Carrito de golf', 'Utilitario', 'Eléctrico'],
  },
];

const FEATURES = [
  { icon: ShieldCheck, title: 'Seguridad certificada', desc: 'Frenos, cinturones y estructuras reforzadas. Pensados para transportar niños con total tranquilidad.' },
  { icon: Zap, title: 'Motores eléctricos eficientes', desc: 'Cero emisiones, bajo consumo y arranque suave. Baterías de larga duración con carga rápida.' },
  { icon: Award, title: 'Garantía y soporte', desc: 'Garantía en cada unidad y servicio de mantenimiento preventivo y correctivo post-venta.' },
  { icon: Headset, title: 'Acompañamiento total', desc: 'Asesoría para elegir el tren ideal, instalación, capacitación y refacciones originales.' },
  { icon: Truck, title: 'Envíos a todo México', desc: 'Entregamos y, si lo requieres, instalamos tu tren eléctrico en cualquier parte del país.' },
  { icon: CircleDollarSign, title: 'Cotización a tu medida', desc: 'Precios competitivos según modelo, capacidad y personalización. Respuesta rápida por WhatsApp.' },
];

const PROCESS = [
  { icon: MessageCircle, step: '01', title: 'Cotiza', desc: 'Cuéntanos qué necesitas: tren infantil, turístico o carrito. Te enviamos opciones y precios por WhatsApp.' },
  { icon: Factory, step: '02', title: 'Diseñamos y fabricamos', desc: 'Ajustamos modelo, colores, capacidad y temática. Fabricación con materiales de calidad.' },
  { icon: PackageCheck, step: '03', title: 'Entregamos e instalamos', desc: 'Te lo llevamos hasta tu ubicación, lo dejamos listo para operar y te capacitamos.' },
  { icon: Wrench, step: '04', title: 'Soporte continuo', desc: 'Mantenimiento preventivo, refacciones y asistencia técnica cuando lo necesites.' },
];

const TESTIMONIALS = [
  { name: 'Plaza Comercial', role: 'Centro comercial', quote: 'El tren infantil se volvió la atracción favorita de la plaza. Los fines de semana no se da abasto.' },
  { name: 'Hotel Boutique', role: 'Turismo', quote: 'Usamos el tren turístico para recorridos dentro del hotel. Los huéspedes lo aman y el mantenimiento es impecable.' },
  { name: 'Parque de diversiones', role: 'Entretenimiento', quote: 'Fabricaron un tren a nuestra medida y nos dieron soporte desde el primer día. Muy recomendados.' },
];

const FAQ = [
  { q: '¿Qué es un tren eléctrico infantil?', a: 'Es un tren a escala —o trenesito eléctrico— impulsado por baterías recargables, diseñado para transportar niños y familias de forma segura en parques, plazas, centros comerciales, hoteles y eventos. En Magnatren lo fabricamos, vendemos y damos mantenimiento.' },
  { q: '¿Cuánto cuesta un tren eléctrico infantil o turístico?', a: 'El precio depende del modelo, la capacidad, el número de vagones y el nivel de personalización. Contáctanos por WhatsApp y te enviamos una cotización a tu medida sin costo.' },
  { q: '¿Fabricamos trenes eléctricos a medida?', a: 'Sí. Manufacturamos trenes eléctricos personalizados: tamaño, colores, temática, número de vagones y capacidad se adaptan a las necesidades de tu negocio.' },
  { q: '¿Dan mantenimiento a trenes eléctricos y carritos de golf?', a: 'Sí. Ofrecemos mantenimiento preventivo y correctivo: revisión de baterías, motores, frenos y carrocería, además de refacciones originales.' },
  { q: '¿Venden carritos eléctricos de golf y utilitarios?', a: 'Sí. Contamos con carritos eléctricos de golf y vehículos utilitarios eléctricos para traslado de personas y carga en espacios amplios.' },
  { q: '¿Hacen envíos a todo México?', a: 'Sí, entregamos en toda la República Mexicana y, si lo requieres, realizamos la instalación y capacitación en sitio.' },
  { q: '¿Los trenes eléctricos son seguros para los niños?', a: 'Totalmente. Nuestros trenes cuentan con frenos, estructuras reforzadas y velocidades controladas, pensados para operar con niños de forma segura.' },
];

const STATS = [
  { value: '10+', label: 'Años de experiencia' },
  { value: '500+', label: 'Trenes entregados' },
  { value: '300+', label: 'Clientes felices' },
  { value: '100%', label: 'Garantía y soporte' },
];

// ═══════════════════════════════════════════════════════════════════════════
// SEO — inyecta title, meta y JSON-LD (schema.org) al montar la página
// ═══════════════════════════════════════════════════════════════════════════

const SEO_TITLE = 'Tren Eléctrico Infantil y Turístico | Venta y Fabricación | Magnatren';
const SEO_DESCRIPTION =
  'Fabricamos y vendemos trenes eléctricos infantiles y turísticos, carritos de golf y utilitarios. Mantenimiento especializado. Cotiza por WhatsApp. Envíos a todo México.';

function useSEO() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = SEO_TITLE;

    const metaTags: Record<string, string> = {
      description: SEO_DESCRIPTION,
      keywords:
        'tren eléctrico infantil, trenesito eléctrico, tren eléctrico para niños, tren turístico eléctrico, carritos de golf eléctricos, carritos utilitarios eléctricos, fabricación de trenes eléctricos, mantenimiento de trenes eléctricos, venta de trenes eléctricos, Magnatren',
      author: 'Magnatren',
      robots: 'index, follow',
      'geo.region': 'MX',
      'geo.placename': 'México',
      'og:type': 'website',
      'og:site_name': 'Magnatren',
      'og:title': SEO_TITLE,
      'og:description': SEO_DESCRIPTION,
      'og:url': clientConfig.canonicalUrl,
      'og:image': `${clientConfig.canonicalUrl}magnatren/tren-electrico-02.jpg`,
      'og:locale': 'es_MX',
      'twitter:card': 'summary_large_image',
      'twitter:title': SEO_TITLE,
      'twitter:description': SEO_DESCRIPTION,
      'twitter:image': `${clientConfig.canonicalUrl}magnatren/tren-electrico-02.jpg`,
    };

    const created: HTMLElement[] = [];
    const restore: [HTMLElement, string][] = [];

    Object.entries(metaTags).forEach(([key, content]) => {
      const attr = key.startsWith('og:') ? 'property' : 'name';
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
        created.push(el);
      } else {
        restore.push([el, el.getAttribute('content') || '']);
      }
      el.setAttribute('content', content);
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
      created.push(canonical);
    } else {
      restore.push([canonical, canonical.getAttribute('href') || '']);
    }
    canonical.setAttribute('href', clientConfig.canonicalUrl);

    const schema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['LocalBusiness', 'Organization'],
          '@id': `${clientConfig.canonicalUrl}#business`,
          name: 'Magnatren',
          description: clientConfig.description,
          url: clientConfig.canonicalUrl,
          image: `${clientConfig.canonicalUrl}magnatren/tren-electrico-02.jpg`,
          logo: `${clientConfig.canonicalUrl}magnatren/logo.png`,
          telephone: clientConfig.phoneNumber,
          email: clientConfig.email,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'México',
            addressCountry: 'MX',
          },
          areaServed: 'MX',
          priceRange: '$$',
          sameAs: [clientConfig.tiktokUrl, clientConfig.instagramUrl, clientConfig.facebookUrl],
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            telephone: clientConfig.phoneNumber,
            url: `https://wa.me/${WHATSAPP}`,
            availableLanguage: 'Spanish',
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios Magnatren',
            itemListElement: SERVICES.map((s, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'Service',
                name: s.title,
                description: s.desc,
                provider: { '@type': 'Organization', name: 'Magnatren' },
                areaServed: 'MX',
              },
            })),
          },
        },
        {
          '@type': 'WebSite',
          name: 'Magnatren',
          url: clientConfig.canonicalUrl,
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'magnatren-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
    created.push(script);

    return () => {
      document.title = prevTitle;
      restore.forEach(([el, val]) => el.setAttribute(el instanceof HTMLMetaElement ? 'content' : 'href', val));
      created.forEach((el) => el.remove());
      document.head.querySelector('#magnatren-schema')?.remove();
    };
  }, []);
}

// ═══════════════════════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════════════════════

const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const easePremium = [0.32, 0.72, 0, 1] as const;

// ═══════════════════════════════════════════════════════════════════════════
// Sub-componentes
// ═══════════════════════════════════════════════════════════════════════════

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.22em]"
      style={{
        backgroundColor: dark ? `${C.amber}1f` : `${C.amber}14`,
        color: C.amberDeep,
        border: `1px solid ${C.amber}40`,
      }}
    >
      <Sparkles size={12} /> {children}
    </span>
  );
}

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: easePremium }}
    className={className}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════

export default function MagnatrenLanding() {
  useSEO();

  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeModelTab, setActiveModelTab] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Estado del Cotizador Express
  const [quoteState, setQuoteState] = useState({
    vehicleType: 'Tren Eléctrico Infantil',
    locationType: 'Plaza / Centro Comercial',
    capacity: 'Locomotora + 3 Vagones (16 pasajeros)',
    name: '',
    phone: '',
    notes: '',
  });

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen || isPrivacyOpen || lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, isPrivacyOpen, lightboxIndex]);

  // Teclado para Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY.length : null));
      if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : null));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const navItems = [
    { id: 'servicios', label: 'Servicios' },
    { id: 'modelos', label: 'Modelos & Specs' },
    { id: 'galeria', label: 'Galería' },
    { id: 'proceso', label: 'Proceso' },
    { id: 'faq', label: 'FAQ' },
    { id: 'cotizador', label: 'Cotizador' },
  ];

  const handleQuoteSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const msg =
      `🚂 *SOLICITUD DE COTIZACIÓN PERSONALIZADA — MAGNATREN*\n\n` +
      `👤 *Cliente:* ${quoteState.name || 'No especificado'}\n` +
      `📱 *Teléfono:* ${quoteState.phone || 'No especificado'}\n` +
      `🚆 *Tipo de Equipo:* ${quoteState.vehicleType}\n` +
      `📍 *Espacio de Operación:* ${quoteState.locationType}\n` +
      `👥 *Configuración:* ${quoteState.capacity}\n` +
      (quoteState.notes ? `📝 *Comentarios/Requerimientos:* ${quoteState.notes}\n\n` : '\n') +
      `_Enviado desde el cotizador web de Magnatren_`;
    window.location.href = waLink(msg);
  }, [quoteState]);

  const cotizaMsg = '¡Hola Magnatren! Quiero cotizar un tren eléctrico infantil / turístico.';

  return (
    <div className="magnatren-root min-h-screen flex flex-col" style={{ backgroundColor: C.cream, color: C.ink, fontFamily: '"Outfit", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        .magnatren-root button, .magnatren-root a { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
        .magnatren-display { font-family: "Bebas Neue", sans-serif; letter-spacing: 0.02em; }
        .magnatren-hide-scrollbar::-webkit-scrollbar { display: none; }
        .magnatren-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .magnatren-grain { background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 4px 4px; }
      `}</style>

      {/* ═══ NAV ═══ */}
      <header className="sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="mt-3.5 flex items-center justify-between rounded-full pl-3 pr-2.5 py-2 md:py-2.5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_-10px_rgba(0,0,0,0.4)]" style={{ backgroundColor: `${C.ink}f5` }}>
            <button onClick={() => scrollTo('inicio')} className="flex items-center gap-3 pl-1 text-left group">
              <img
                src={clientConfig.logoUrl}
                alt="Magnatren Logo"
                className="h-14 sm:h-16 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              />
              <span className="magnatren-display text-2xl sm:text-3xl md:text-3xl tracking-wider text-white leading-none">
                MAGNATREN
              </span>
            </button>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((n) => (
                <button key={n.id} onClick={() => scrollTo(n.id)}
                  className="px-3.5 py-2 rounded-full text-[13px] font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-all">
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={waLink(cotizaMsg)} target="_blank" rel="noreferrer"
                className="hidden sm:flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full text-white font-bold text-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
                style={{ backgroundColor: C.wa }}>
                <MessageCircle size={16} /> Cotizar
                <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center"><ArrowUpRight size={16} /></span>
              </a>
              <button onClick={() => setMenuOpen(true)} className="md:hidden w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all" aria-label="Abrir menú">
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MENÚ MÓVIL ═══ */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[90]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenuOpen(false)}
              className="absolute inset-0 backdrop-blur-xl" style={{ backgroundColor: `${C.ink}ee` }} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.35, ease: easePremium }}
              className="relative h-full flex flex-col p-6 pt-16">
              <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center" aria-label="Cerrar menú"><X size={22} /></button>
              
              <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/10">
                <img src={clientConfig.logoUrl} alt="Magnatren Logo" className="h-14 w-auto object-contain drop-shadow-md" />
                <span className="magnatren-display text-3xl text-white tracking-wider">MAGNATREN</span>
              </div>

              {navItems.map((n, i) => (
                <motion.button key={n.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                  onClick={() => { setMenuOpen(false); scrollTo(n.id); }}
                  className="magnatren-display text-4xl text-white/90 hover:text-white text-left py-3 border-b border-white/10 tracking-wide">
                  {n.label}
                </motion.button>
              ))}
              <a href={waLink(cotizaMsg)} target="_blank" rel="noreferrer"
                className="mt-8 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-white shadow-lg" style={{ backgroundColor: C.wa }}>
                <MessageCircle size={20} /> Cotizar por WhatsApp
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ HERO ═══ */}
      <section id="inicio" className="relative overflow-hidden" style={{ backgroundColor: C.ink }}>
        <div className="absolute inset-0 magnatren-grain pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.amber}26 0%, transparent 65%)` }} />
        <div className="absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.red}1f 0%, transparent 65%)` }} />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-14 pb-16 md:pt-24 md:pb-28 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          {/* Texto */}
          <div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: easePremium }}>
              <Eyebrow dark>Fabricación · Venta · Mantenimiento</Eyebrow>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.08, ease: easePremium }}
              className="magnatren-display text-6xl md:text-8xl leading-[0.9] text-white mt-5">
              Tren eléctrico<br />
              <span style={{ color: C.amber }}>infantil</span> y turístico<br />
              hecho para <span style={{ color: C.red }}>mover sonrisas</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16, ease: easePremium }}
              className="text-white/70 text-base md:text-lg mt-6 max-w-lg leading-relaxed">
              {clientConfig.description}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.24, ease: easePremium }}
              className="flex flex-col sm:flex-row gap-3 mt-8">
              <button onClick={() => scrollTo('cotizador')}
                className="group flex items-center justify-center gap-2 px-6 py-4 rounded-full text-white font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: C.wa, boxShadow: '0 16px 40px -12px #25D36690' }}>
                <MessageCircle size={20} /> Cotiza tu tren
                <span className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center transition-transform group-hover:translate-x-1"><ArrowRight size={16} /></span>
              </button>
              <button onClick={() => scrollTo('modelos')}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold transition-all hover:bg-white/10 border"
                style={{ color: C.amber, borderColor: `${C.amber}55` }}>
                <SlidersHorizontal size={16} /> Ver Modelos & Specs
              </button>
            </motion.div>

            {/* Trust */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-white/50 text-sm">
              {['Garantía en cada unidad', 'Envíos a todo México', 'Soporte post-venta'].map((t) => (
                <span key={t} className="flex items-center gap-1.5"><Check size={15} style={{ color: C.amber }} /> {t}</span>
              ))}
            </motion.div>
          </div>

          {/* Imagen hero */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15, ease: easePremium }}
            className="relative">
            <div className="rounded-[2.25rem] p-2 ring-1" style={{ backgroundColor: `${C.amber}1f`, boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7)' }}>
              <div className="rounded-[1.75rem] overflow-hidden">
                <img src="./magnatren/tren-electrico-02.jpg" alt="Tren eléctrico infantil y turístico Magnatren" className="w-full aspect-[4/3] object-cover" loading="eager" width={1280} height={960} />
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease: easePremium }}
              className="absolute -bottom-5 -left-3 md:-left-6 flex items-center gap-3 rounded-2xl px-4 py-3 backdrop-blur-xl border border-white/10 shadow-xl" style={{ backgroundColor: `${C.ink}d9` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.amber}1f` }}><BadgeCheck size={20} style={{ color: C.amber }} /></div>
              <div className="leading-tight">
                <p className="text-white font-bold text-sm">Calidad garantizada</p>
                <p className="text-white/50 text-xs">Fabricación propia</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="relative z-10 -mt-1" style={{ backgroundColor: C.ink }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 pb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="rounded-2xl p-5 text-center border border-white/10" style={{ backgroundColor: `${C.inkSoft}` }}>
                  <p className="magnatren-display text-4xl md:text-5xl" style={{ color: C.amber }}>{s.value}</p>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICIOS ═══ */}
      <section id="servicios" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="max-w-2xl">
            <Eyebrow>Servicios</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl mt-4 leading-[0.95]">
              Todo lo que tu negocio<br />necesita <span style={{ color: C.red }}>sobre ruedas</span>
            </h2>
            <p className="text-[#5B6572] mt-4 text-lg">Del tren eléctrico infantil para tu plaza, al carrito de golf para tu hotel: fabricamos, vendemos y mantenemos.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
            {SERVICES.map((s, i) => (
              <Reveal key={s.id} delay={i * 0.05}>
                <div className="group h-full rounded-[2rem] p-2 ring-1 ring-black/5 transition-all duration-700 hover:-translate-y-1"
                  style={{ backgroundColor: C.card, boxShadow: '0 20px 50px -30px rgba(0,0,0,0.25)' }}>
                  <div className="rounded-[1.6rem] p-6 h-full border border-black/5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: C.ink, color: C.amber }}>
                          <s.icon size={26} strokeWidth={2} />
                        </div>
                        <ArrowUpRight size={22} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: C.amberDeep }} />
                      </div>
                      <h3 className="magnatren-display text-2xl md:text-3xl mt-5 tracking-wide">{s.title}</h3>
                      <p className="text-[#5B6572] mt-2 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-black/5">
                      {s.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full text-[11px] font-bold" style={{ backgroundColor: `${C.amber}14`, color: C.amberDeep }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MODELOS & ESPECIFICACIONES TÉCNICAS ═══ */}
      <section id="modelos" className="py-20 md:py-28" style={{ backgroundColor: C.ink }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-2xl mx-auto">
            <Eyebrow dark>Modelos & Especificaciones</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl text-white mt-4 leading-[0.95]">
              Ingeniería eléctrica <span style={{ color: C.amber }}>a detalle</span>
            </h2>
            <p className="text-white/60 mt-3 text-base">Conoce la ficha técnica y rendimiento de nuestros trenes y vehículos eléctricos líderes en México.</p>
          </Reveal>

          {/* Selector de Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-10">
            {MODELS_SPECS.map((m, idx) => (
              <button
                key={m.id}
                onClick={() => setActiveModelTab(idx)}
                className={`px-5 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${
                  activeModelTab === idx
                    ? 'bg-amber-400 text-slate-950 shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
                }`}
                style={activeModelTab === idx ? { backgroundColor: C.amber, color: C.ink } : {}}
              >
                {m.name.split('"')[0].trim()}
              </button>
            ))}
          </div>

          {/* Ficha Activa */}
          <div className="mt-10">
            {MODELS_SPECS.map((m, idx) => {
              if (idx !== activeModelTab) return null;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: easePremium }}
                  className="rounded-[2.5rem] p-3 ring-1 ring-white/10"
                  style={{ backgroundColor: C.inkSoft }}
                >
                  <div className="rounded-[2rem] p-6 md:p-10 border border-white/5 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 md:gap-12 items-center">
                    {/* Imagen y Destacados */}
                    <div>
                      <div className="rounded-3xl overflow-hidden shadow-2xl relative group">
                        <img src={m.image} alt={m.name} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-black bg-white/90 backdrop-blur-sm shadow-md">
                            Modelo Certificado
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 space-y-2.5">
                        {m.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-3 text-white/80 text-xs md:text-sm">
                            <CheckCircle2 size={16} style={{ color: C.amber }} className="shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Especificaciones */}
                    <div>
                      <h3 className="magnatren-display text-3xl md:text-4xl text-white tracking-wide">{m.name}</h3>
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{m.tagline}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-6">
                        {m.specs.map((sp, i) => (
                          <div key={i} className="rounded-2xl p-4 border border-white/10 bg-black/20">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: C.amber }}>
                              <sp.icon size={15} />
                              <span>{sp.label}</span>
                            </div>
                            <p className="text-white text-xs md:text-sm font-medium mt-1.5 leading-snug">{sp.val}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            setQuoteState((prev) => ({ ...prev, vehicleType: m.name }));
                            scrollTo('cotizador');
                          }}
                          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-white transition-transform hover:scale-[1.02]"
                          style={{ backgroundColor: C.wa }}
                        >
                          <MessageCircle size={18} /> Cotizar {m.name.split('"')[0]}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ GALERÍA INTERACTIVA (CON LIGHTBOX) ═══ */}
      <section id="galeria" className="py-20 md:py-28" style={{ backgroundColor: C.ink }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Eyebrow dark>Nuestro trabajo</Eyebrow>
              <h2 className="magnatren-display text-5xl md:text-6xl text-white mt-4 leading-[0.95]">
                Trenes que ya<br /><span style={{ color: C.amber }}>están rodando</span>
              </h2>
              <p className="text-white/50 text-sm mt-2">Haz clic en cualquier fotografía para verla en alta definición y solicitar detalles.</p>
            </div>
            <a href={waLink(cotizaMsg)} target="_blank" rel="noreferrer"
              className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-white transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.red }}>
              <MessageCircle size={17} /> Quiero uno así
            </a>
          </Reveal>

          <div className="columns-2 md:columns-3 gap-4 mt-12 [column-fill:_balance]">
            {GALLERY.map((g, i) => (
              <Reveal key={i} delay={(i % 3) * 0.05} className="mb-4 break-inside-avoid">
                <div
                  onClick={() => setLightboxIndex(i)}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer ring-1 ring-white/10"
                >
                  <img src={g.src} alt={g.alt} loading="lazy" className="w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/60 backdrop-blur-sm border border-white/20">
                      {g.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs font-semibold leading-tight">{g.alt}</p>
                    <p className="text-amber-400 text-[10px] font-black uppercase tracking-wider mt-1 flex items-center gap-1">
                      Ver en grande <ArrowRight size={10} />
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MODAL LIGHTBOX ═══ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxIndex(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: easePremium }}
              className="relative max-w-4xl w-full bg-slate-950 rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                    {GALLERY[lightboxIndex].tag}
                  </span>
                  <span className="text-xs text-white/50 font-medium">
                    Foto {lightboxIndex + 1} de {GALLERY.length}
                  </span>
                </div>
                <button
                  onClick={() => setLightboxIndex(null)}
                  className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Imagen Central con Flechas */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[280px] md:min-h-[450px]">
                <img
                  src={GALLERY[lightboxIndex].src}
                  alt={GALLERY[lightboxIndex].alt}
                  className="max-h-[60vh] w-auto max-w-full object-contain select-none"
                />

                {/* Flecha Izquierda */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : null));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 transition-all"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* Flecha Derecha */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % GALLERY.length : null));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center hover:bg-black/90 hover:scale-110 transition-all"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Bottom Bar con Acción de WhatsApp */}
              <div className="p-4 md:p-6 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-white/80 text-sm text-center sm:text-left leading-tight">
                  {GALLERY[lightboxIndex].alt}
                </p>
                <a
                  href={waLink(
                    `🚂 *Consulta sobre foto de galería #${lightboxIndex + 1} — Magnatren*\n\nHola, me interesó el modelo que aparece en la foto "${GALLERY[lightboxIndex].alt}". ¿Me podrían dar información de disponibilidad y cotización?`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs md:text-sm text-white transition-transform hover:scale-105 shrink-0"
                  style={{ backgroundColor: C.wa }}
                >
                  <MessageCircle size={16} /> Cotizar este modelo por WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ POR QUÉ ELEGIRNOS ═══ */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="max-w-2xl">
            <Eyebrow>Por qué Magnatren</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl mt-4 leading-[0.95]">
              La diferencia está<br />en los <span style={{ color: C.red }}>detalles</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="h-full rounded-3xl p-6 border border-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.3)]" style={{ backgroundColor: C.card }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.amber}1a`, color: C.amberDeep }}><f.icon size={22} /></div>
                  <h3 className="font-bold text-lg mt-4">{f.title}</h3>
                  <p className="text-[#5B6572] text-sm mt-1.5 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESO ═══ */}
      <section id="proceso" className="py-20 md:py-28" style={{ backgroundColor: C.ink }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-xl mx-auto">
            <Eyebrow dark>Proceso</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl text-white mt-4 leading-[0.95]">
              De la idea a la<br /><span style={{ color: C.amber }}>pista de rodaje</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-14">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.08}>
                <div className="relative h-full rounded-3xl p-6 border border-white/10" style={{ backgroundColor: C.inkSoft }}>
                  <span className="magnatren-display text-6xl leading-none" style={{ color: `${C.amber}2e` }}>{p.step}</span>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mt-2" style={{ backgroundColor: `${C.amber}1f`, color: C.amber }}><p.icon size={20} /></div>
                  <h3 className="font-bold text-white text-lg mt-4">{p.title}</h3>
                  <p className="text-white/55 text-sm mt-1.5 leading-relaxed">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIOS ═══ */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-xl mx-auto">
            <Eyebrow>Testimonios</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl mt-4 leading-[0.95]">
              Clientes que <span style={{ color: C.red }}>ya ruedan</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <div className="h-full rounded-3xl p-7 border border-black/5 flex flex-col" style={{ backgroundColor: C.card }}>
                  <div className="flex gap-0.5" style={{ color: C.amber }}>
                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={16} fill="currentColor" strokeWidth={0} />)}
                  </div>
                  <p className="text-[#3c4450] mt-4 leading-relaxed flex-1">“{t.quote}”</p>
                  <div className="flex items-center gap-3 mt-5 pt-5 border-t border-black/5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: C.ink }}>{t.name.charAt(0)}</div>
                    <div className="leading-tight">
                      <p className="font-bold text-sm">{t.name}</p>
                      <p className="text-[#5B6572] text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-20 md:py-28" style={{ backgroundColor: C.ink }}>
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <Reveal className="text-center">
            <Eyebrow dark>Preguntas frecuentes</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl text-white mt-4 leading-[0.95]">Resolvemos tus dudas</h2>
          </Reveal>

          <div className="mt-12 space-y-3">
            {FAQ.map((f, i) => {
              const open = openFaq === i;
              return (
                <Reveal key={i} delay={i * 0.03}>
                  <div className="rounded-2xl overflow-hidden border border-white/10" style={{ backgroundColor: C.inkSoft }}>
                    <button onClick={() => setOpenFaq(open ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                      <span className="font-bold text-white">{f.q}</span>
                      <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: open ? C.amber : 'rgba(255,255,255,0.08)', color: open ? C.ink : C.amber }}>
                        <ChevronDown size={18} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: easePremium }}>
                          <p className="px-5 pb-5 text-white/60 leading-relaxed">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ COTIZADOR INTERACTIVO EXPRESS ═══ */}
      <section id="cotizador" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-2xl mx-auto mb-12">
            <Eyebrow>Cotizador Express</Eyebrow>
            <h2 className="magnatren-display text-5xl md:text-6xl mt-4 leading-[0.95]">
              Configura y cotiza <span style={{ color: C.red }}>en segundos</span>
            </h2>
            <p className="text-[#5B6572] mt-3">Selecciona los parámetros de tu proyecto y recibe una propuesta formal por WhatsApp de inmediato.</p>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            {/* Formulario / Pasos interactivos */}
            <Reveal>
              <form onSubmit={handleQuoteSubmit} className="rounded-[2.5rem] p-3 ring-1 ring-black/5" style={{ backgroundColor: C.card, boxShadow: '0 30px 70px -40px rgba(0,0,0,0.35)' }}>
                <div className="rounded-[2rem] border border-black/5 p-6 md:p-8 space-y-6">
                  
                  {/* Paso 1: Tipo de equipo */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#5B6572] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-black">1</span>
                      ¿Qué equipo necesitas?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2.5">
                      {[
                        'Tren Eléctrico Infantil',
                        'Tren Turístico Eléctrico',
                        'Carrito de Golf / Utilitario',
                        'Mantenimiento / Refacciones',
                      ].map((item) => {
                        const selected = quoteState.vehicleType === item;
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => setQuoteState((prev) => ({ ...prev, vehicleType: item }))}
                            className={`p-3.5 rounded-2xl text-left text-xs md:text-sm font-bold border transition-all duration-200 flex items-center justify-between ${
                              selected
                                ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                                : 'bg-stone-50 text-slate-700 border-black/10 hover:border-black/30'
                            }`}
                          >
                            <span>{item}</span>
                            {selected && <Check size={16} style={{ color: C.amber }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Paso 2: Espacio de operación */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#5B6572] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-black">2</span>
                      ¿Dónde operará el equipo?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5">
                      {[
                        'Plaza / Centro Comercial',
                        'Parque / Exterior',
                        'Hotel o Resort',
                        'Eventos y Renta',
                      ].map((loc) => {
                        const selected = quoteState.locationType === loc;
                        return (
                          <button
                            type="button"
                            key={loc}
                            onClick={() => setQuoteState((prev) => ({ ...prev, locationType: loc }))}
                            className={`p-3 rounded-xl text-center text-xs font-bold border transition-all duration-200 ${
                              selected
                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                                : 'bg-stone-50 text-slate-600 border-black/10 hover:border-black/30'
                            }`}
                          >
                            {loc}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Paso 3: Configuración / Capacidad */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-[#5B6572] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[11px] font-black">3</span>
                      Capacidad / Configuración
                    </label>
                    <select
                      value={quoteState.capacity}
                      onChange={(e) => setQuoteState((prev) => ({ ...prev, capacity: e.target.value }))}
                      className="w-full mt-2 px-4 py-3.5 rounded-xl border border-black/10 text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-black/10 font-medium"
                    >
                      <option>Locomotora + 3 Vagones (14 a 18 pasajeros)</option>
                      <option>Locomotora + 4 Vagones (20 a 24 pasajeros)</option>
                      <option>Tren Turístico Gran Capacidad (24 a 30 pasajeros)</option>
                      <option>Carrito Utilitario 2 a 4 plazas</option>
                      <option>Carrito con Caja de Carga (hasta 450 kg)</option>
                      <option>Proyecto / Fabricación Especial a Medida</option>
                    </select>
                  </div>

                  {/* Datos del contacto */}
                  <div className="pt-3 border-t border-black/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5B6572]">Tu Nombre</label>
                      <input
                        value={quoteState.name}
                        onChange={(e) => setQuoteState((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        placeholder="Ej. Ing. Carlos Martínez"
                        className="w-full mt-1.5 px-4 py-3.5 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5B6572]">Teléfono / WhatsApp</label>
                      <input
                        value={quoteState.phone}
                        onChange={(e) => setQuoteState((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                        placeholder="Ej. 55 1234 5678"
                        className="w-full mt-1.5 px-4 py-3.5 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#5B6572]">Notas adicionales (Opcional)</label>
                    <textarea
                      value={quoteState.notes}
                      onChange={(e) => setQuoteState((prev) => ({ ...prev, notes: e.target.value }))}
                      rows={2}
                      placeholder="Ej. Ciudad de entrega, requerimientos de color o tema..."
                      className="w-full mt-1.5 px-4 py-3 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-bold transition-transform hover:scale-[1.01] active:scale-[0.99]"
                    style={{ backgroundColor: C.wa, boxShadow: '0 14px 34px -12px #25D36690' }}
                  >
                    <Send size={18} /> Enviar cotización por WhatsApp
                    <span className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center transition-transform group-hover:translate-x-1"><ArrowRight size={15} /></span>
                  </button>
                  <p className="text-center text-[11px] text-[#5B6572]">Cotización gratuita y sin compromiso. Respondemos en minutos.</p>
                </div>
              </form>
            </Reveal>

            {/* Resumen en Vivo / Beneficios de cotizar */}
            <Reveal delay={0.1} className="space-y-4">
              <div className="rounded-3xl p-6 border border-white/10 text-white" style={{ backgroundColor: C.ink }}>
                <h3 className="magnatren-display text-2xl text-amber-400">Resumen de tu Cotización</h3>
                <div className="mt-4 space-y-3 text-xs md:text-sm">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Equipo:</span>
                    <span className="text-white font-semibold">{quoteState.vehicleType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Lugar de Operación:</span>
                    <span className="text-white font-semibold">{quoteState.locationType}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-white/50 block text-[10px] uppercase font-bold tracking-wider">Configuración:</span>
                    <span className="text-white font-semibold">{quoteState.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-6 border border-black/5 bg-white space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800">Garantías Magnatren</h4>
                <div className="space-y-2.5 text-xs text-[#5B6572]">
                  <p className="flex items-center gap-2"><Check size={14} style={{ color: C.amberDeep }} /> Asesoría técnica en dimensionamiento y retorno de inversión</p>
                  <p className="flex items-center gap-2"><Check size={14} style={{ color: C.amberDeep }} /> Envíos asegurados y puesta a punto en toda la República</p>
                  <p className="flex items-center gap-2"><Check size={14} style={{ color: C.amberDeep }} /> Manuales de operación y capacitación a tu personal</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="mt-auto" style={{ backgroundColor: C.ink }}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <img src={clientConfig.logoUrl} alt="Magnatren Logo" className="h-14 md:h-16 w-auto object-contain drop-shadow-md" />
              <span className="magnatren-display text-2xl md:text-3xl text-white tracking-wider">MAGNATREN</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">{clientConfig.description}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Contacto</h4>
            <a href={`https://wa.me/${WHATSAPP}`} className="flex items-center gap-2.5 text-white/70 text-sm hover:text-white transition-colors"><MessageCircle size={15} style={{ color: C.wa }} /> {clientConfig.phoneNumber}</a>
            <a href={`mailto:${clientConfig.email}`} className="flex items-center gap-2.5 text-white/70 text-sm hover:text-white transition-colors"><Mail size={15} style={{ color: C.amber }} /> {clientConfig.email}</a>
            <p className="flex items-start gap-2.5 text-white/70 text-sm"><MapPin size={15} style={{ color: C.amber }} className="mt-0.5" /> {clientConfig.address}</p>
            <p className="flex items-start gap-2.5 text-white/70 text-sm"><Clock size={15} style={{ color: C.amber }} className="mt-0.5" /> {clientConfig.hours}</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Síguenos</h4>
            <p className="text-white/50 text-sm">Conoce más de nuestro trabajo en redes sociales.</p>
            <div className="flex gap-3">
              <a href={clientConfig.tiktokUrl} target="_blank" rel="noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.05.85.13V9.4a6.33 6.33 0 0 0-.85-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
              </a>
              <a href={clientConfig.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:scale-110 transition-all"><Instagram size={18} /></a>
              <a href={clientConfig.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:scale-110 transition-all"><Facebook size={18} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col items-center gap-4 text-center">
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Magnatren. Todos los derechos reservados.
            </p>
            <motion.a href="https://imagineandstamp.site" target="_blank" rel="noreferrer" whileHover={{ scale: 1.03 }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50 group-hover:text-white/70 transition-colors">Página web realizada por</span>
              <span className="text-sm font-black tracking-tight group-hover:scale-105 transition-transform" style={{ color: C.amber }}>IMAGINE & STAMP</span>
              <ArrowUpRight size={12} style={{ color: C.amber }} />
            </motion.a>
            <button onClick={() => setIsPrivacyOpen(true)} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
              <ShieldCheck size={12} /> Aviso de Privacidad
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ WHATSAPP FLOTANTE ═══ */}
      <a href={waLink(cotizaMsg)} target="_blank" rel="noreferrer" aria-label="WhatsApp"
        className="fixed bottom-6 right-5 z-50 p-4 rounded-full transition-transform hover:scale-110"
        style={{ backgroundColor: C.wa, boxShadow: '0 14px 34px -8px #25D36690', paddingBottom: 'calc(1rem + env(safe-area-inset-bottom) / 2)' }}>
        <MessageCircle size={26} fill="currentColor" />
      </a>

      {/* ═══ MODAL PRIVACIDAD ═══ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPrivacyOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: easePremium }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="h-1.5" style={{ background: `linear-gradient(to right, ${C.amber}, ${C.red})` }} />
              <div className="p-8">
                <button onClick={() => setIsPrivacyOpen(false)} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/50 hover:text-black hover:bg-black/10 transition-all"><X size={18} /></button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${C.amber}1f` }}><ShieldCheck size={20} style={{ color: C.amberDeep }} /></div>
                  <h2 className="magnatren-display text-2xl tracking-wide">Aviso de Privacidad</h2>
                </div>
                <div className="space-y-4 text-sm text-black/70 leading-relaxed">
                  <p>En <strong>Magnatren</strong> protegemos tu privacidad. La información que compartes a través de este sitio se utiliza exclusivamente para atender tus solicitudes de cotización, venta, fabricación o mantenimiento.</p>
                  <p>No almacenamos datos bancarios. Tus datos de contacto solo se usan para comunicarnos contigo y nunca se comparten con terceros sin tu consentimiento.</p>
                  <p>Para ejercer tus derechos ARCO, contáctanos en <a href={`mailto:${clientConfig.email}`} className="font-semibold hover:underline" style={{ color: C.amberDeep }}>{clientConfig.email}</a>.</p>
                </div>
                <button onClick={() => setIsPrivacyOpen(false)} className="mt-8 w-full py-3.5 rounded-xl text-white font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity" style={{ backgroundColor: C.ink }}>Entendido</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
