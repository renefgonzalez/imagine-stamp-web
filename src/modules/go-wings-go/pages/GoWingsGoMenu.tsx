// ═══════════════════════════════════════════════════════════════════════════
// GO! WINGS GO — Menú Digital Interactivo · Dark Fire Theme
// ═══════════════════════════════════════════════════════════════════════════
// Identidad visual extraída del logo oficial: #FF4816 Fuego, #FFB800 Dorado, #0D0C0B Carbón
// Cumplimiento estricto del Checklist de Auditoría de Imagine & Stamp

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Plus, X, ShoppingBag, Flame, Pizza, Sandwich, Drumstick,
  LayoutGrid, Star, Sparkles, Phone, MapPin, Clock,
  Instagram, Facebook, MessageCircle, ArrowUp, Shield, ExternalLink,
  ChevronRight, SlidersHorizontal, Check, UtensilsCrossed, Beer,
  Copy, Landmark, Bike, Store, Award, Heart
} from 'lucide-react';
import { clientConfig, SALSAS, DIPS, TACO_EXTRAS, bankInfo } from '../config';
import { Product, CartItem, SizeOption, CategoryId } from '../types';
import CustomizeModal from '../components/CustomizeModal';
import CartDrawer from '../components/CartDrawer';
import logoGoWingsGo from '../assets/logo-go-wings-go.webp';

// ═══════════════════ CONSTANTES ═══════════════════
const WHATSAPP = clientConfig.phone;
const BUSINESS = clientConfig.businessName;

// Opciones de tamaños para Alitas
const SIZES_ALITAS: SizeOption[] = [
  { id: 'alitas-6', label: '6 Piezas', price: 109, sublabel: 'Para 1 persona' },
  { id: 'alitas-12', label: '12 Piezas', price: 199, sublabel: 'Ideal compartir (2 salsas)' },
  { id: 'alitas-24', label: '24 Piezas (Bucket)', price: 379, sublabel: 'Para la fiesta (hasta 3 salsas)' },
];

// Opciones de tamaños para Boneless
const SIZES_BONELESS: SizeOption[] = [
  { id: 'boneless-250', label: 'Platillo (250g)', price: 119, sublabel: 'Pechuga 100% crujiente' },
  { id: 'boneless-500', label: 'Familiar (500g)', price: 219, sublabel: 'Doble porción + papas' },
];

const PRODUCTS: Product[] = [
  // ── 1. ALITAS & BONELESS ──
  {
    id: 'alitas-crispy-classic',
    name: 'Alitas Crispy Go!',
    description: 'Nuestras famosas alitas empanizadas con rebozado secreto ultra crujiente. Bañadas en tu salsa favorita, acompañadas de apio fresco y dip.',
    price: 109,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=75',
    featured: true,
    badge: 'popular',
    sizes: SIZES_ALITAS,
    needsSauce: true,
  },
  {
    id: 'alitas-al-carbon',
    name: 'Alitas al Carbón Naked',
    description: 'Sin empanizar, asadas al momento a fuego vivo. Jugosas por dentro, piel crujiente por fuera con un marcado ahumado irresistible.',
    price: 109,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1527477378378-433b00f135b5?auto=format&fit=crop&w=800&q=75',
    sizes: SIZES_ALITAS,
    needsSauce: true,
  },
  {
    id: 'boneless-bites',
    name: 'Boneless Pechuga Bites',
    description: 'Cubos tiernos de 100% pechuga de pollo, doblemente empanizados y dorados a la perfección. Bañados generosamente en tu salsa predilecta.',
    price: 119,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=75',
    featured: true,
    badge: 'popular',
    sizes: SIZES_BONELESS,
    needsSauce: true,
  },
  {
    id: 'alitas-fuego-atomico',
    name: 'Alitas Fuego Atómico 5🌶️',
    description: 'Edición extrema para amantes del picante real. Glaseado con Carolina Reaper, habanero tatemado y miel de agave para un ardor explosivo.',
    price: 119,
    category: 'alitas',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=800&q=75',
    badge: 'picante',
    sizes: SIZES_ALITAS,
    needsSauce: true,
  },

  // ── 2. PIZZETAS & FLATBREADS ──
  {
    id: 'pizzeta-buffalo-chicken',
    name: 'Pizzeta Buffalo Chicken & Bacon',
    description: 'Base artesanal crujiente, queso mozzarella gratinado, trozos jugosos de boneless en salsa buffalo, tocino ahumado y drizzle de aderezo ranch.',
    price: 149,
    category: 'pizzetas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=75',
    featured: true,
    badge: 'popular',
  },
  {
    id: 'pizzeta-arrachera-grill',
    name: 'Pizzeta Arrachera Grill',
    description: 'Finas láminas de arrachera marinada al carbón, pimiento morrón asado, cebolla morada caramelizada y queso gouda fundido.',
    price: 159,
    category: 'pizzetas',
    image: 'https://images.unsplash.com/photo-1595708684082-a173bb3a06c5?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'pizzeta-pepperoni-supreme',
    name: 'Pizzeta Pepperoni Supreme',
    description: 'Abundante pepperoni americano crujiente, champiñones frescos salteados y doble porción de queso mozzarella italiano.',
    price: 139,
    category: 'pizzetas',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'pizzeta-hawaiana-fuego',
    name: 'Pizzeta Hawaiana Fuego',
    description: 'Jamón horneado, piña asada a la mantequilla, tocino crujiente y un toque sutil de chile quebrado con mozzarella.',
    price: 139,
    category: 'pizzetas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'pizzeta-al-gusto',
    name: 'Pizzeta Al Gusto Go!',
    description: 'Crea tu propia combinación perfecta con salsa pomodoro artesanal, queso mozzarella y 2 ingredientes premium a tu elección.',
    price: 149,
    category: 'pizzetas',
    image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?auto=format&fit=crop&w=800&q=75',
    ingredientPick: 2,
    badge: 'nuevo',
  },

  // ── 3. TACOS & COSTRAS ──
  {
    id: 'tacos-arrachera-4',
    name: 'Orden de Tacos de Arrachera (4)',
    description: 'Tortillas de maíz recién bajadas del comal con arrachera marinada al carbón, cebollitas asadas, chiles toreados y guacamole casero.',
    price: 139,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=75',
    featured: true,
    extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })),
  },
  {
    id: 'tacos-camaron-carbon',
    name: 'Tacos de Camarón al Carbón (3)',
    description: 'Camarones marinados con especias y ajo, montados sobre cama de queso fundido, pico de gallo cítrico y mayonesa chipotle.',
    price: 129,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1611250188496-e966043a0629?auto=format&fit=crop&w=800&q=75',
    extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })),
  },
  {
    id: 'costra-arrachera-pza',
    name: 'Costra de Arrachera con Queso',
    description: 'Costra crujiente de queso gouda a la plancha rellena de arrachera picada, aguacate en rebanadas y salsa tatemada.',
    price: 45,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=800&q=75',
    badge: 'popular',
    choices: [
      { id: 'arrachera', label: 'Arrachera al Carbón' },
      { id: 'camaron', label: 'Camarón Marinado' }
    ],
  },
  {
    id: 'taco-camaron-endiablado',
    name: 'Taco de Camarón Endiablado',
    description: 'Camarones salteados en salsa de chiles secos con pimiento morrón, cebolla y aguacate en tortilla doble de maíz.',
    price: 38,
    category: 'tacos',
    image: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=75',
    badge: 'picante',
    extras: TACO_EXTRAS.map(e => ({ id: e.id, label: e.label, price: e.price })),
  },

  // ── 4. SNACKS & LOADED FRIES ──
  {
    id: 'papas-loaded-cheddar-bacon',
    name: 'Loaded Fries Go! Supreme',
    description: 'Canasta grande de papas francesas doradas cubiertas con salsa de queso cheddar caliente, lluvia de tocino picado y jalapeños encurtidos.',
    price: 89,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=75',
    featured: true,
    badge: 'popular',
  },
  {
    id: 'papas-gajo-sazonadas',
    name: 'Papas Gajo a las Finas Hierbas',
    description: 'Papas rústicas con cáscara, sazonadas con páprika, ajo y perejil. Acompañadas de aderezo ranch o queso cheddar dip.',
    price: 69,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'dedos-mozzarella',
    name: 'Dedos de Queso Mozzarella (6)',
    description: 'Empanizados con finas hierbas y fritos hasta quedar dorados y con queso súper elástico. Servidos con salsa marinara tibia.',
    price: 85,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4276c7?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'nachos-supreme-go',
    name: 'Nachos Supreme con Carne',
    description: 'Totopos crujientes de maíz, frijolitos refritos, queso cheddar fundido, arrachera al carbón, pico de gallo, crema y jalapeños.',
    price: 119,
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=75',
    badge: 'nuevo',
  },

  // ── 5. BEBIDAS & CERVEZAS ──
  {
    id: 'cerveza-ultra-fria',
    name: 'Cerveza Nacional Fría (Corona / Victoria)',
    description: 'Botella de 355ml servida a punto de nieve con vaso escarchado con sal y limón opcional.',
    price: 45,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1608270546103-9799276d43e5?auto=format&fit=crop&w=800&q=75',
    badge: 'popular',
  },
  {
    id: 'cerveza-artesanal-ipa',
    name: 'Cerveza Artesanal IPA o Blonde',
    description: 'Lata de 355ml de cervecería independiente mexicana. Notas cítricas y amargor equilibrado para acompañar alitas.',
    price: 65,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'refresco-lata-355',
    name: 'Refrescos de Lata 355ml',
    description: 'Coca-Cola clásica, Coca-Cola Sin Azúcar, Sprite, Fanta o Manzanita bien fríos con vaso con hielo.',
    price: 32,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=75',
  },
  {
    id: 'limonada-mineral-fresa',
    name: 'Limonada Mineral con Frutos Rojos',
    description: 'Jugo de limones frescos, agua mineral burbujeante y puré natural de fresas. Ultra refrescante para bajar el picor.',
    price: 42,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=75',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'Ver Todo', icon: LayoutGrid },
  { id: 'alitas', name: 'Alitas & Boneless', icon: Drumstick },
  { id: 'pizzetas', name: 'Pizzetas al Horno', icon: Pizza },
  { id: 'tacos', name: 'Tacos & Costras', icon: Flame },
  { id: 'snacks', name: 'Papas & Snacks', icon: UtensilsCrossed },
  { id: 'bebidas', name: 'Bebidas & Frías', icon: Beer },
];

const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

// Determina si un producto requiere abrir modal de configuración obligatoria
const needsConfig = (p: Product) =>
  (p.sizes && p.sizes.length > 1) ||
  p.needsSauce ||
  (p.choices && p.choices.length > 0) ||
  (p.ingredientPick && p.ingredientPick > 0);

export default function GoWingsGoMenu() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('gowingsgo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMsg, setToastMsg] = useState('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // Persistencia de carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gowingsgo_cart', JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart]);

  // Bloqueo de scroll cuando el drawer o modal están abiertos
  useEffect(() => {
    document.body.style.overflow = isCartOpen || !!customizingProduct || isPrivacyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen, customizingProduct, isPrivacyOpen]);

  // Listener para sticky header y botón scroll-to-top
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
      setShowScrollTop(offset > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Título dinámico
  useEffect(() => {
    document.title = 'GO! WINGS GO | Menú Digital · Alitas, Boneless & Grill';
  }, []);

  // Filtrado de productos en vivo
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;

    if (searchQuery.trim()) {
      const q = searchQuery
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      list = list.filter((p) => {
        const name = p.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const desc = p.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return name.includes(q) || desc.includes(q);
      });
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    return list;
  }, [activeCategory, searchQuery]);

  // Manejo de Carrito
  const handleAddDirect = (product: Product) => {
    if (needsConfig(product)) {
      setCustomizingProduct(product);
      return;
    }

    const lineId = product.id;
    setCart((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });

    setToastMsg(product.name);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleAddCustomized = (
    lineId: string,
    productId: string,
    name: string,
    detail: string,
    unitPrice: number,
    quantity: number,
    image: string
  ) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        { lineId, productId, name, detail, unitPrice, quantity, image },
      ];
    });

    setToastMsg(name);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const handleUpdateQty = (lineId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.lineId === lineId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCart((prev) => prev.filter((i) => i.lineId !== lineId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0D0C0B] text-white font-sans antialiased selection:bg-[#FF4816] selection:text-white pb-24">
      {/* ════════════════════ HEADER STICKY CON GLASSMORPHISM ════════════════════ */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0D0C0B]/92 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo y Branding Oficial */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={scrollToTop}>
            <div className="relative flex items-center">
              <img
                src={logoGoWingsGo}
                alt="GO! WINGS GO"
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_18px_rgba(255,72,22,0.5)] transition-transform hover:scale-105"
              />
              <div className="absolute -inset-1 bg-[#FF4816]/20 rounded-full blur-md -z-10 animate-pulse" />
            </div>

            {/* Tagline descriptivo (sin duplicar el nombre de la marca que ya viene en el logo) */}
            <div className="hidden sm:flex flex-col border-l border-white/15 pl-3 py-0.5">
              <span className="text-xs text-white font-black tracking-wider uppercase leading-none">
                Alitas & Boneless
              </span>
              <span className="text-[10px] text-zinc-400 font-bold tracking-wide mt-1">
                Pizzetas & Sports Grill
              </span>
            </div>
          </div>

          {/* Botones de Cabecera: Estatus & Carrito */}
          <div className="flex items-center gap-2.5">
            {/* Badge de Horario en Vivo */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Abierto Hoy</span>
            </div>

            {/* Botón Carrito Header */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-gradient-to-r from-[#FF4816] to-[#FF6A00] text-white shadow-lg shadow-[#FF4816]/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              aria-label="Abrir Carrito"
            >
              <ShoppingBag size={20} className="stroke-[2.5]" />
              {totalItems > 0 && (
                <span className="font-black text-xs px-1.5 py-0.5 rounded-full bg-white text-[#FF4816] shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════ HERO CON BANNER DINÁMICO & LOGO ════════════════════ */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:pb-12">
        {/* Glow de fondo de fuego */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-[#FF4816]/20 via-[#FFB800]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#161514]">
            {/* Imagen de fondo Hero con overlay */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80"
                alt="Wings and Grill"
                className="w-full h-full object-cover opacity-25 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161514] via-[#161514]/75 to-transparent" />
            </div>

            {/* Contenido Hero */}
            <div className="relative p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
              <div className="text-center md:text-left space-y-3 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4816]/15 border border-[#FF4816]/40 text-[#FF4816] text-xs font-black tracking-wider uppercase">
                  <Flame size={14} className="animate-bounce" />
                  Sabor Fuego & Crujiente
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                  Las mejores alitas <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4816] via-[#FF8C00] to-[#FFB800]">
                    Directo a tu mesa
                  </span>
                </h2>
                <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed">
                  Recetas artesanales, salsas desde BBQ ahumada hasta Fuego Atómico 🌶️, pizzetas a la leña y tacos bien servidos.
                </p>

                {/* Badges de Confianza */}
                <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs text-zinc-300 font-semibold">
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    🍗 100% Pechuga & Alitas Frescas
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    🔥 Salsas Hechas en Casa
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                    ⚡ Pedidos por WhatsApp en 1 tap
                  </span>
                </div>
              </div>

              {/* Logo Emblemático en Grande */}
              <div className="relative flex-shrink-0">
                <div className="w-64 sm:w-72 h-28 sm:h-36 rounded-3xl bg-gradient-to-br from-[#1C1A19]/90 to-[#121110] border border-white/10 p-4 sm:p-5 flex items-center justify-center shadow-2xl shadow-[#FF4816]/25 relative group">
                  <img
                    src={logoGoWingsGo}
                    alt="Logo Oficial Go! Wings Go"
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(255,72,22,0.45)] group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[#FF4816] text-white font-black text-[10px] uppercase tracking-wider shadow-lg">
                    Original Wings House
                  </div>
                </div>
              </div>
            </div>

            {/* Cintillo Promocional Activo */}
            <div className="bg-gradient-to-r from-[#FF4816] via-[#E03A0B] to-[#FF8C00] px-4 py-2.5 text-white flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="bg-black/30 text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {clientConfig.promo.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold">
                  {clientConfig.promo.text}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-white/90">
                {clientConfig.promo.note}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════ BUSCADOR EN VIVO (CRO) ════════════════════ */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por platillo, salsa o ingrediente (ej. alitas, boneless, arrachera, queso)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161514] border border-white/10 focus:border-[#FF4816] rounded-2xl pl-12 pr-10 py-3.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FF4816]/20 transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      {/* ════════════════════ BARRA DE CATEGORÍAS STICKY ════════════════════ */}
      <section className="sticky top-[68px] z-40 bg-[#0D0C0B]/95 backdrop-blur-md py-2.5 mb-8 border-y border-white/5 shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id && !searchQuery;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as CategoryId);
                    setSearchQuery('');
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF4816] to-[#FF6A00] text-white shadow-lg shadow-[#FF4816]/25 scale-[1.02]'
                      : 'bg-[#181716] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-white' : 'text-[#FF4816]'} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════ SECCIÓN DESTACADOS / FAVORITOS ════════════════════ */}
      {!searchQuery && activeCategory === 'all' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FF4816]/15 text-[#FF4816] flex items-center justify-center">
                <Star size={18} className="fill-[#FF4816]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Estrellas de la Casa
                </h3>
                <p className="text-xs text-zinc-400">Los imperdibles más pedidos por nuestros clientes</p>
              </div>
            </div>
            <span className="text-xs text-[#FFB800] font-black uppercase tracking-wider hidden sm:block">
              ★ TOP VENTAS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_PRODUCTS.map((prod) => (
              <motion.div
                key={`feat-${prod.id}`}
                whileHover={{ y: -4 }}
                className="rounded-3xl bg-[#161514] border border-white/10 hover:border-[#FF4816]/40 p-3.5 flex flex-col justify-between transition-all shadow-xl group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-3 aspect-video">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#FF4816] text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Sparkles size={11} /> Favorito
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-sm text-white font-black text-sm">
                    ${prod.price}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-bold text-base group-hover:text-[#FF4816] transition-colors leading-snug">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-zinc-400 font-medium">
                    {needsConfig(prod) ? 'Personalizable' : 'Orden directa'}
                  </span>
                  <button
                    onClick={() => handleAddDirect(prod)}
                    className="px-4 py-2 rounded-xl bg-[#FF4816] hover:bg-[#FF5E31] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#FF4816]/20 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <Plus size={15} /> {needsConfig(prod) ? 'Armar' : 'Agregar'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ════════════════════ GRILLA PRINCIPAL DE PRODUCTOS ════════════════════ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Título de Sección */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span>
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-zinc-400">
              {filteredProducts.length}
            </span>
          </h3>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#161514] rounded-3xl border border-white/5 p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-zinc-500">
              <Search size={30} />
            </div>
            <p className="text-lg font-bold text-white">No encontramos ningún platillo con esa búsqueda</p>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto">
              Intenta con palabras como "alitas", "boneless", "arrachera", "pizzeta" o limpia el buscador.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#FF4816] text-white font-bold text-xs uppercase"
            >
              Ver Menú Completo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((prod, index) => {
              const reqConfig = needsConfig(prod);
              return (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="rounded-3xl bg-[#161514] border border-white/5 hover:border-[#FF4816]/30 overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl hover:shadow-[#FF4816]/10 group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badges superiores */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {prod.badge === 'popular' && (
                        <span className="px-2.5 py-1 rounded-full bg-[#FF4816] text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                          🔥 Popular
                        </span>
                      )}
                      {prod.badge === 'nuevo' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                          ⚡ Nuevo
                        </span>
                      )}
                      {prod.badge === 'picante' && (
                        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                          🌶️ Picante
                        </span>
                      )}
                    </div>

                    {/* Precio Flotante */}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 text-white flex items-baseline gap-1">
                      <span className="text-[10px] text-zinc-400 font-bold">
                        {prod.sizes && prod.sizes.length > 1 ? 'Desde' : ''}
                      </span>
                      <span className="text-base font-black text-[#FFB800]">${prod.price}</span>
                    </div>
                  </div>

                  {/* Cuerpo del platillo */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-white font-bold text-base sm:text-lg group-hover:text-[#FF4816] transition-colors leading-tight">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    {/* Footer de la Card con CTA */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[11px] text-zinc-400 font-medium">
                        {prod.needsSauce && (
                          <span className="text-[#FF4816] font-bold flex items-center gap-1">
                            <Flame size={12} /> Elige tu salsa
                          </span>
                        )}
                        {prod.ingredientPick && (
                          <span className="text-[#FFB800] font-bold">
                            Elige {prod.ingredientPick} ingredientes
                          </span>
                        )}
                        {!prod.needsSauce && !prod.ingredientPick && (
                          <span className="text-zinc-500">Hecho al momento</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddDirect(prod)}
                        className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shadow-md ${
                          reqConfig
                            ? 'bg-[#201F1E] hover:bg-[#FF4816] text-white border border-white/10 hover:border-transparent'
                            : 'bg-gradient-to-r from-[#FF4816] to-[#FF6A00] text-white hover:brightness-110 shadow-[#FF4816]/20'
                        }`}
                      >
                        {reqConfig ? (
                          <>
                            <SlidersHorizontal size={14} /> Personalizar
                          </>
                        ) : (
                          <>
                            <Plus size={15} /> Agregar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* ════════════════════ FOOTER OFICIAL DE 3 COLUMNAS ════════════════════ */}
      <footer className="mt-20 border-t border-white/10 bg-[#121110] text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {/* Columna 1: Marca & Descripción */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <img
                  src={logoGoWingsGo}
                  alt="Logo Go! Wings Go"
                  className="h-10 w-auto object-contain self-start"
                />
                <p className="text-[11px] text-[#FF4816] font-bold tracking-wide mt-1">
                  {clientConfig.tagline}
                </p>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {clientConfig.description}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-zinc-300 font-bold">
                <Award size={16} className="text-[#FFB800]" />
                <span>Alitas y Boneless de Calidad Premium</span>
              </div>
            </div>

            {/* Columna 2: Contacto, Horarios y Ubicación */}
            <div className="space-y-3.5">
              <h4 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <MapPin size={16} className="text-[#FF4816]" /> Sucursal & Horarios
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 leading-relaxed">{clientConfig.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-300 leading-relaxed">{clientConfig.hours}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} className="text-zinc-500 flex-shrink-0" />
                  <a
                    href={`tel:${clientConfig.phoneNumber.replace(/\s+/g, '')}`}
                    className="text-white hover:text-[#FF4816] font-bold transition-colors"
                  >
                    {clientConfig.phoneNumber}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle size={15} className="text-[#25D366] flex-shrink-0" />
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    WhatsApp de Atención al Cliente
                  </a>
                </div>
              </div>
            </div>

            {/* Columna 3: Redes Sociales & Medios de Pago */}
            <div className="space-y-4">
              <h4 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Instagram size={16} className="text-[#FF4816]" /> Síguenos en Redes
              </h4>
              <p className="text-xs text-zinc-400">
                Entérate de nuevas promociones, alitas del mes y dinámicas para ganar órdenes gratis.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={clientConfig.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#FF4816] text-white flex items-center justify-center transition-all shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={clientConfig.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href={clientConfig.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#00F2FE] hover:text-black text-white flex items-center justify-center transition-all shadow-md"
                  aria-label="TikTok"
                >
                  <span className="font-black text-xs">TT</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[11px] text-zinc-500 uppercase font-bold tracking-wider block">
                  Aceptamos en sucursal y entrega:
                </span>
                <span className="text-xs text-zinc-300 font-semibold">
                  💵 Efectivo · 🏦 Transferencia SPEI · 💳 Tarjetas
                </span>
              </div>
            </div>
          </div>

          {/* Barra Inferior Copyright & IMAGINE & STAMP */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <p>© {new Date().getFullYear()} {BUSINESS}. Todos los derechos reservados.</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPrivacyOpen(true)}
                className="hover:text-zinc-300 underline transition-colors"
              >
                Aviso de Privacidad (LFPDPPP)
              </button>
              <span>·</span>
              <a
                href="https://imagineandstamp.site"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-white font-bold transition-colors"
              >
                Diseñado por <span className="text-[#FF4816] font-black">IMAGINE & STAMP</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ════════════════════ BOTÓN FLOTANTE DEL CARRITO ════════════════════ */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#FF4816] via-[#FF5E31] to-[#FF8C00] text-white font-black text-sm uppercase tracking-wider shadow-2xl shadow-[#FF4816]/40 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-between border border-white/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                  {totalItems}
                </div>
                <span>Ver Mi Pedido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black">${cartTotal}</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ BOTÓN VOLVER ARRIBA ════════════════════ */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className={`fixed ${
              totalItems > 0 ? 'bottom-24 sm:bottom-24' : 'bottom-6'
            } right-6 w-11 h-11 rounded-2xl bg-[#1A1918] border border-white/10 hover:border-[#FF4816] text-white flex items-center justify-center shadow-xl hover:bg-[#FF4816] transition-all z-30`}
            aria-label="Volver arriba"
          >
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ════════════════════ TOAST AL AGREGAR PRODUCTO ════════════════════ */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-3 rounded-2xl bg-[#1A1918] border border-emerald-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 max-w-sm pointer-events-none"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0">
              <Check size={13} className="stroke-[3]" />
            </div>
            <span className="truncate">¡Agregado!: {toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ MODAL PERSONALIZAR PLATILLO ════════════════════ */}
      <AnimatePresence>
        {customizingProduct && (
          <CustomizeModal
            product={customizingProduct}
            onClose={() => setCustomizingProduct(null)}
            onAdd={handleAddCustomized}
          />
        )}
      </AnimatePresence>

      {/* ════════════════════ DRAWER CARRITO 2 PASOS ════════════════════ */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        cartTotal={cartTotal}
        whatsappNumber={WHATSAPP}
        businessName={BUSINESS}
        onClearCart={handleClearCart}
      />

      {/* ════════════════════ MODAL AVISO DE PRIVACIDAD (LFPDPPP) ════════════════════ */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-[#141312] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto z-10"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-[#FF4816]" />
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Aviso de Privacidad Simplificado
                  </h3>
                </div>
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="text-xs text-zinc-300 space-y-3 leading-relaxed">
                <p>
                  En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, {BUSINESS}, con domicilio en {clientConfig.address}, es responsable del uso y protección de sus datos personales.
                </p>
                <p>
                  Los datos personales que recabamos (nombre, teléfono y dirección de entrega) son utilizados exclusivamente para:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-zinc-400">
                  <li>Procesar, preparar y entregar su pedido solicitado.</li>
                  <li>Confirmar la recepción de pagos en efectivo o transferencia bancaria.</li>
                  <li>Brindarle atención y soporte directo vía WhatsApp.</li>
                </ul>
                <p>
                  Sus datos NO son compartidos con terceros con fines mercadotécnicos ni almacenados en servidores remotos sin su autorización expresa. Usted puede ejercer sus derechos ARCO contactándonos directamente a través de nuestro correo: <a href={`mailto:${clientConfig.email}`} className="text-[#FF4816] underline">{clientConfig.email}</a>.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsPrivacyOpen(false)}
                  className="px-5 py-2 rounded-xl bg-[#FF4816] text-white font-bold text-xs uppercase"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
