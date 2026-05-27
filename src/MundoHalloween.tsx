import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import AdminHalloween from './AdminHalloween';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Star, Flame, Leaf, MessageCircle, ArrowLeft, Search, Check, Settings, Image as ImageIcon, EyeOff, Eye, DollarSign, RefreshCw, Save, Lock, Instagram, Facebook, Mail as MailIcon, Share2, SlidersHorizontal, QrCode, Volume2, VolumeX } from 'lucide-react';
import logo from './logo.png';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Costume {
  id: string;
  name: string;
  description: string;
  price: number;
  rentalPrice?: number;
  image: string;
  category: string;
  type: 'Renta' | 'Venta' | 'Renta y Venta';
  sizes: string[];
  badge?: 'NOVEDAD' | 'EN OFERTA' | 'MÁS VENDIDO';
  is_popular?: boolean;
  isPopular?: boolean;
  is_new?: boolean;
  isNew?: boolean;
  is_on_sale?: boolean;
  isOnSale?: boolean;
  soldOut?: boolean;
  rating?: number;
}

interface CartItem extends Costume {
  quantity: number;
  selectedSize?: string;
  selectedType?: 'Renta' | 'Venta';
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '525560917169'; // Número real de pedidos

const CATEGORIES = [
  { id: 'all',                      label: 'Todo',                      emoji: '🎃' },
  { id: 'aliens',                   label: 'Alíens',                    emoji: '👽' },
  { id: 'brujas',                   label: 'Brujas',                    emoji: '🧙‍♀️' },
  { id: 'caretas',                  label: 'Caretas',                   emoji: '🎭' },
  { id: 'creepypasta',              label: 'Creepypasta',               emoji: '👾' },
  { id: 'dr-peste',                 label: 'Dr. Peste',                 emoji: '🦠' },
  { id: 'esqueletos',               label: 'Esqueletos',                emoji: '💀' },
  { id: 'hombres-lobo',             label: 'Hombres Lobo',              emoji: '🐺' },
  { id: 'masacre-en-texas',         label: 'Masacre en Texas',          emoji: '🪚' },
  { id: 'michael-myers',            label: 'Michael Myers',             emoji: '🔪' },
  { id: 'monstruos',                label: 'Monstruos',                 emoji: '👹' },
  { id: 'payasos',                  label: 'Payasos',                   emoji: '🤡' },
  { id: 'personajes-de-peliculas',  label: 'Personajes de Películas',   emoji: '🎬' },
  { id: 'scarecrow',                label: 'Scarecrow',                 emoji: '🌾' },
  { id: 'soldados',                 label: 'Soldados',                  emoji: '🪖' },
  { id: 'vampiros',                 label: 'Vampiros',                  emoji: '🧛' },
  { id: 'zombies',                  label: 'Zombies',                   emoji: '🧟' },
  { id: 'decorativos',              label: 'Decorativos',               emoji: '🕯️' },
  { id: 'disfraces',                label: 'Disfraces',                 emoji: '👗' },
  { id: 'silla-electrica',          label: 'Silla eléctrica',           emoji: '⚡' },
  { id: 'animatronics',             label: 'Animatronics',              emoji: '🤖' },
  { id: 'otros',                    label: 'Otros',                     emoji: '✨' },
];

const INITIAL_MENU_ITEMS: Costume[] = [
  {
    id: 'mock-1',
    name: 'Máscara Scarecrow',
    description: 'Máscara de Espantapájaros de látex de alta calidad. Ideal para Halloween y eventos de terror.',
    price: 450,
    rentalPrice: 200,
    image: './mascara-scarecrow.png.png',
    category: 'scarecrow',
    type: 'Renta y Venta',
    sizes: [],
    badge: 'MÁS VENDIDO',
    rating: 4.9,
  },
  {
    id: 'mock-2',
    name: 'Máscara Billy Punk',
    description: 'Máscara estilo punk de colección, acabado premium en látex con detalles únicos.',
    price: 380,
    rentalPrice: 150,
    image: './mascara-billy-punk.png.png',
    category: 'monstruos',
    type: 'Renta y Venta',
    sizes: [],
    badge: 'NOVEDAD',
    rating: 4.7,
  },
  {
    id: 'mock-3',
    name: 'Máscara Dammy the Clown',
    description: 'La máscara de payaso aterrador más solicitada de la temporada. Látex flexible, cómoda toda la noche.',
    price: 420,
    rentalPrice: 180,
    image: './mascara-dammy.png.png',
    category: 'payasos',
    type: 'Renta y Venta',
    sizes: [],
    badge: 'EN OFERTA',
    rating: 4.8,
  },
  {
    id: 'mock-4',
    name: 'Disfraz Michael Myers',
    description: 'Disfraz completo del icónico asesino de Halloween. Incluye overol y máscara.',
    price: 850,
    rentalPrice: 350,
    image: './disfraz-michael-myers.png',
    category: 'michael-myers',
    type: 'Renta y Venta',
    sizes: [],
    rating: 4.8,
  },
];

// ─── STOCK PHOTO LIBRARY ──────────────────────────────────────────────────────
// Banco de imágenes "de stock" que el dueño puede asignar a cualquier platillo
// desde el panel de admin. Se pueden ir generando con IA y sumar aquí.
const STOCK_IMAGES: { url: string; label: string }[] = [
  { url: './burger-classic.png',       label: 'Burger Clásica' },
  { url: './burger-double-smash.png',  label: 'Double Smash' },
  { url: './burger-bbq-bacon.png',     label: 'BBQ Bacon' },
  { url: './burger-mushroom-swiss.png',label: 'Mushroom Swiss' },
  { url: './fries-loaded.png',         label: 'Loaded Fries' },
  { url: './onion-rings.png',          label: 'Onion Rings' },
  { url: './chicken-fingers.png',      label: 'Chicken Fingers' },
  { url: './milkshake-chocolate.png',  label: 'Malteada Chocolate' },
  { url: './milkshake-strawberry.png', label: 'Malteada Fresa' },
  { url: './brownie-sundae.png',       label: 'Brownie Sundae' },
];

// ─── GOOGLE SHEETS CONNECTION (PREPARADO) ─────────────────────────────────────
// Para conectar este menú a una Hoja de Cálculo de Google:
// 1. Publica tu Sheet como JSON usando opensheet.elk.sh, sheety.co o sheet.best.
// 2. Reemplaza el body de `fetchCostumesFromSupabase` con el fetch real.
// 3. Columnas sugeridas: id | name | description | price | image | category |
//    badge | rating | calories | soldOut
//
// Ejemplo (descomenta cuando tengas el endpoint):
// const SHEET_ENDPOINT = 'https://opensheet.elk.sh/<SHEET_ID>/menu';
async function fetchCostumesFromSupabase(): Promise<Costume[]> {
  const { data, error } = await supabase.from('costumes').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching costumes:', error);
    return [];
  }
  return data as Costume[];
}

// ─── BADGE CONFIG ─────────────────────────────────────────────────────────────
const BADGE_CONFIG = {
  popular: { label: 'Popular',  icon: Star,   bg: 'bg-amber-500',   text: 'text-white' },
  new:     { label: 'Nuevo',    icon: Flame,  bg: 'bg-emerald-500', text: 'text-white' },
  veggie:  { label: 'Veggie',   icon: Leaf,   bg: 'bg-green-500',   text: 'text-white' },
  spicy:   { label: 'Picante',  icon: Flame,  bg: 'bg-red-500',     text: 'text-white' },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function MundoHalloween() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Costume | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderStep, setOrderStep] = useState<'cart' | 'confirm'>('cart');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [initialItemToOpen, setInitialItemToOpen] = useState<string | null>(null);

  // ── Music Player State
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.play().then(() => {
          setIsAudioPlaying(true);
        }).catch(err => console.log('Autoplay blocked:', err));
        setHasInteracted(true);
      }
    };
    
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  // ── Catálogo dinámico (lista para Google Sheets) ──────────────────────────
  const [menuItems, setCostumes] = useState<Costume[]>(INITIAL_MENU_ITEMS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPickerForId, setAdminPickerForId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    if (hashParts.length > 1) {
      const params = new URLSearchParams(hashParts[1]);
      const itemId = params.get('item');
      if (itemId) {
        setInitialItemToOpen(itemId);
      }
    }
  }, []);

  useEffect(() => {
    if (initialItemToOpen && menuItems.length > 0) {
      const item = menuItems.find(i => i.id === initialItemToOpen);
      if (item) {
        setSelectedItem(item);
        setInitialItemToOpen(null);
      }
    }
  }, [initialItemToOpen, menuItems]);

  const handleShare = async (costume: Costume, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/mundo-halloween?item=${costume.id}`;
    const shareText = `¡Mira este disfraz en Mundo de Halloween!: ${costume.name} - $${costume.price} MXN`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mundo de Halloween',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error al compartir', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setToastMessage('¡Enlace copiado al portapapeles! 🎃');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  useEffect(() => {
    // Intenta cargar desde Supabase. Si la tabla está vacía o hay error,
    // SIEMPRE mantiene INITIAL_MENU_ITEMS como fallback para que el demo
    // nunca se vea vacío. Solo reemplaza si recibe datos reales (length > 0).
    fetchCostumesFromSupabase()
      .then(data => {
        if (data && data.length > 0) {
          setCostumes(data);
        }
        // Si data === [] o null, no tocamos el estado → se mantiene INITIAL_MENU_ITEMS
      })
      .catch(err => {
        console.warn('No se pudo cargar el catálogo remoto, usando datos de demo:', err);
        // En caso de error de red/conexión, el estado ya tiene INITIAL_MENU_ITEMS
      });
  }, []);

  // ── Helpers de edición en vivo (modo admin) ────────────────────────────────
  const updateItem = (id: string, patch: Partial<Costume>) => {
    setCostumes(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  const addItem = (costume: Costume) => {
    setCostumes(prev => [costume, ...prev]);
  };

  const deleteItem = (id: string) => {
    setCostumes(prev => prev.filter(i => i.id !== id));
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const resetMenu = () => {
    setCostumes(INITIAL_MENU_ITEMS);
    setCart([]);
  };

  // ── Filtered items
  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    }
    return items;
  }, [activeCategory, searchQuery, menuItems]);

  // ── Cart logic
  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cart.reduce((acc, i) => {
    const t = i.selectedType || i.type || 'Venta';
    const p = t === 'Renta' ? (i.rentalPrice || i.price) : i.price;
    return acc + p * i.quantity;
  }, 0);

  const addToCart = (item: Costume) => {
    if (item.soldOut) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter(c => c.quantity > 0)
    );
  };

  const getItemQty = (id: string) => cart.find(c => c.id === id)?.quantity ?? 0;

  // ── WhatsApp checkout
  const handleCheckout = () => {
    const lines = cart
      .map(i => `  • ${i.name} x${i.quantity} — $${i.price * i.quantity} MXN`)
      .join('\n');

    const name = customerName.trim() || 'Cliente';

    const message =
      `🎃 *Pedido en Mundo de Halloween*\n\n` +
      `Hola! Soy *${name}* y quiero ordenar:\n\n` +
      `${lines}\n\n` +
      `*Total: $${totalPrice} MXN*\n\n` +
      `_Pedido generado desde el menú digital de Imagine & Stamp_ ✨`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    setOrderSent(true);
    setTimeout(() => {
      setCart([]);
      setOrderSent(false);
      setOrderStep('cart');
      setIsCartOpen(false);
      setCustomerName('');
    }, 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0D0D0D', fontFamily: "'Inter', sans-serif" }}>
      <audio ref={audioRef} src="./musica-terror.mp3" loop />
      {/* ── SEO Meta */}
      <title>Mundo de Halloween | Menú Digital Interactivo</title>

      {/* ── HERO HEADER */}
      <header
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a0a00 0%, #2d1000 40%, #1a0600 100%)',
          minHeight: '220px',
        }}
      >
        <div className="relative z-10 px-5 pt-8 pb-8">
          {/* Back link */}
          <a
            href="/#/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors mb-5 text-sm"
          >
            <ArrowLeft size={16} />
            Volver a Imagine &amp; Stamp
          </a>

          {/* ── Brand row: logo left + cart right */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>

            {/* Left: logo square + text block */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
              {/* Logo as square icon */}
              <img
                src="/logo-halloween.png"
                alt="Mundo de Halloween"
                style={{
                  width: '72px', height: '72px',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.04)',
                  flexShrink: 0,
                  filter: 'drop-shadow(0 0 12px rgba(255,106,0,0.4))',
                }}
              />

              {/* Text block */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                <h1 style={{
                  color: '#fff', fontWeight: 900, fontSize: '22px',
                  lineHeight: 1.1, margin: 0, letterSpacing: '-0.3px',
                }}>
                  Mundo de Halloween
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px', margin: 0, fontWeight: 500 }}>
                  Tu pasaporte al terror y la diversión
                </p>

                {/* ── Stars + reviews row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ color: '#F59E0B', fontSize: '13px' }}>⭐</span>
                  <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '13px' }}>4.8</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>(2.4k reseñas)</span>
                </div>
              </div>
            </div>

            {/* Music & Cart buttons container */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={toggleAudio}
                style={{
                  background: isAudioPlaying ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${isAudioPlaying ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
                  borderRadius: '16px',
                  padding: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  color: isAudioPlaying ? '#10B981' : 'rgba(255,255,255,0.6)',
                }}
              >
                {isAudioPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              {/* Cart button */}
              <button
                id="cart-open-btn"
                onClick={() => { setIsCartOpen(true); setOrderStep('cart'); }}
                style={{
                position: 'relative',
                background: totalItems > 0 ? 'linear-gradient(135deg, #FF6A00, #FF8C00)' : 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '16px',
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: totalItems > 0 ? '0 4px 20px rgba(255, 106, 0, 0.4)' : 'none',
              }}
            >
              <ShoppingCart size={20} color={totalItems > 0 ? '#fff' : 'rgba(255,255,255,0.6)'} />
              {totalItems > 0 && (
                <>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>
                    ${totalPrice}
                  </span>
                  <span style={{
                    position: 'absolute', top: '-8px', right: '-8px',
                    background: '#fff', color: '#FF6A00',
                    borderRadius: '50%', width: '22px', height: '22px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 900,
                  }}>
                    {totalItems}
                  </span>
                </>
              )}
            </button>
            </div>
          </div>

          {/* ── Dark Glass Promo Banner */}
          <div style={{
            marginTop: '16px',
            background: 'rgba(255, 106, 0, 0.1)',
            border: '1px solid rgba(255, 106, 0, 0.2)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '14px' }}>🎃</span>
            <p style={{
              color: '#FF8C00', fontWeight: 800, fontSize: '10px',
              textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
            }}>
              DISEÑOS DEMENTES PARA GENTE FUERA DE LO COMÚN
            </p>
          </div>
        </div>
      </header>

      {/* ── SEARCH BAR */}
      <div style={{ background: '#111', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
          padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Search size={16} color="rgba(255,255,255,0.4)" />
          <input
            id="menu-search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar en el menú..."
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: '14px', width: '100%',
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <X size={16} color="rgba(255,255,255,0.4)" />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORY BAR + GRID PANEL */}
      <div style={{ background: '#111', position: 'sticky', top: '57px', zIndex: 39, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>

        {/* Scrollable pill row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>

          {/* Grid toggle button */}
          <button
            id="category-grid-toggle"
            onClick={() => setIsCategoryOpen(o => !o)}
            style={{
              flexShrink: 0,
              width: '38px', height: '34px',
              borderRadius: '50px',
              border: isCategoryOpen ? '1.5px solid #FF6A00' : '1.5px solid rgba(255,255,255,0.15)',
              background: isCategoryOpen ? 'rgba(255,106,0,0.15)' : 'rgba(255,255,255,0.07)',
              color: isCategoryOpen ? '#FF6A00' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            title="Ver todas las categorías"
          >
            <SlidersHorizontal size={15} />
          </button>

          {/* Pill chips */}
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              id={`cat-${cat.id}`}
              onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); setIsCategoryOpen(false); }}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                transition: 'all 0.2s ease',
                background: activeCategory === cat.id
                  ? 'linear-gradient(135deg, #FF6A00, #FF8C00)'
                  : 'rgba(255,255,255,0.07)',
                color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(255,106,0,0.35)' : 'none',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Collapsible grid panel */}
        <AnimatePresence>
          {isCategoryOpen && (
            <motion.div
              key="cat-grid"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                padding: '14px 16px 16px',
                background: '#0d0d0d',
              }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={`grid-${cat.id}`}
                    onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); setIsCategoryOpen(false); }}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '12px',
                      border: activeCategory === cat.id ? '1.5px solid #FF6A00' : '1px solid rgba(255,255,255,0.08)',
                      background: activeCategory === cat.id ? 'rgba(255,106,0,0.15)' : 'rgba(255,255,255,0.04)',
                      color: activeCategory === cat.id ? '#FF8C00' : 'rgba(255,255,255,0.6)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{cat.emoji}</div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── MENU GRID */}
      <main style={{ padding: '20px 16px 120px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Category title */}
        {activeCategory !== 'all' && (
          <h2 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.emoji} {CATEGORIES.find(c => c.id === activeCategory)?.label} — {filteredItems.length} opciones
          </h2>
        )}

        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontWeight: 700 }}>No hay resultados para "{searchQuery}"</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => {
              const qty = getItemQty(item.id);
              const isPopular = item.is_popular || item.isPopular || item.badge === 'MÁS VENDIDO';
              const isNew = item.is_new || item.isNew || item.badge === 'NOVEDAD';
              const isOnSale = item.is_on_sale || item.isOnSale || item.badge === 'EN OFERTA';

              return (
                <motion.div
                  key={item.id}
                  id={`menu-item-${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: item.soldOut
                      ? '1px solid rgba(239, 68, 68, 0.35)'
                      : qty > 0
                        ? '1px solid rgba(255, 106, 0, 0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                    cursor: item.soldOut ? 'not-allowed' : 'pointer',
                    opacity: item.soldOut ? 0.55 : 1,
                  }}
                  onClick={() => { if (!item.soldOut) setSelectedItem(item); }}
                >
                  <div style={{ display: 'flex', gap: '0' }}>
                    {/* Content */}
                    <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>

                      {/* ── Badge arriba del nombre */}
                      {(isPopular || isNew || isOnSale) && (
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '2px' }}>
                          {isPopular && (
                            <span style={{
                              background: 'rgba(255,106,0,0.18)', color: '#FF6A00',
                              border: '1px solid rgba(255,106,0,0.35)',
                              borderRadius: '6px', padding: '2px 8px',
                              fontSize: '9px', fontWeight: 800,
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                              🔥 MÁS VENDIDO
                            </span>
                          )}
                          {isNew && (
                            <span style={{
                              background: 'rgba(59,130,246,0.15)', color: '#60A5FA',
                              border: '1px solid rgba(59,130,246,0.3)',
                              borderRadius: '6px', padding: '2px 8px',
                              fontSize: '9px', fontWeight: 800,
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                              ✨ NOVEDAD
                            </span>
                          )}
                          {isOnSale && (
                            <span style={{
                              background: 'rgba(239,68,68,0.15)', color: '#F87171',
                              border: '1px solid rgba(239,68,68,0.3)',
                              borderRadius: '6px', padding: '2px 8px',
                              fontSize: '9px', fontWeight: 800,
                              textTransform: 'uppercase', letterSpacing: '0.06em',
                            }}>
                              🏷️ EN OFERTA
                            </span>
                          )}
                        </div>
                      )}

                      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '16px', lineHeight: 1.2, margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>

                      {/* ── Rating + Flamita */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span style={{ color: '#F59E0B', fontSize: '13px' }}>⭐</span>
                          <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '12px' }}>
                            {(item.rating ?? 4.8).toFixed(1)}
                          </span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '10px' }}>|</span>
                        <span style={{ fontSize: '13px' }}>🔥</span>
                      </div>

                      {/* Price + Add button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ color: '#FF8C00', fontWeight: 900, fontSize: '20px' }}>
                          ${item.price}
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 500 }}> MXN</span>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={e => handleShare(item, e)}
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.15s ease, background-color 0.2s',
                              flexShrink: 0,
                            }}
                            className="hover:bg-white/15"
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.92)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                          >
                            <Share2 size={16} />
                          </button>
                        {/* Quantity controls or add button */}
                        {item.soldOut ? (
                          <span
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              borderRadius: '12px',
                              padding: '9px 14px',
                              fontWeight: 900, fontSize: '11px',
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                            }}
                          >
                            Agotado
                          </span>
                        ) : qty > 0 ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '0',
                              background: 'rgba(255, 106, 0, 0.15)',
                              borderRadius: '12px', overflow: 'hidden',
                              border: '1px solid rgba(255, 106, 0, 0.3)',
                            }}
                          >
                            <button
                              id={`qty-minus-${item.id}`}
                              onClick={() => updateQty(item.id, -1)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '8px 12px', color: '#FF8C00', fontWeight: 900, fontSize: '16px',
                                display: 'flex', alignItems: 'center',
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span style={{ color: '#fff', fontWeight: 800, fontSize: '15px', minWidth: '20px', textAlign: 'center' }}>
                              {qty}
                            </span>
                            <button
                              id={`qty-plus-${item.id}`}
                              onClick={() => updateQty(item.id, 1)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                padding: '8px 12px', color: '#FF8C00', fontWeight: 900, fontSize: '16px',
                                display: 'flex', alignItems: 'center',
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`add-to-cart-${item.id}`}
                            onClick={e => { e.stopPropagation(); addToCart(item); }}
                            style={{
                              background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                              border: 'none', borderRadius: '12px',
                              padding: '9px 16px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px',
                              color: '#fff', fontWeight: 800, fontSize: '13px',
                              boxShadow: '0 4px 12px rgba(255, 106, 0, 0.35)',
                              transition: 'transform 0.15s ease',
                            }}
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                          >
                            <Plus size={14} />
                            Agregar
                          </button>
                        )}
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div style={{ width: '130px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                          transition: 'transform 0.4s ease',
                          filter: item.soldOut ? 'grayscale(0.8)' : 'none',
                        }}
                        onMouseEnter={e => { if (!item.soldOut) e.currentTarget.style.transform = 'scale(1.08)'; }}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      {item.soldOut && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(0,0,0,0.45)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            background: 'rgba(239, 68, 68, 0.95)',
                            color: '#fff', padding: '4px 10px', borderRadius: '6px',
                            fontWeight: 900, fontSize: '10px',
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            transform: 'rotate(-8deg)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                          }}>
                            Agotado
                          </span>
                        </div>
                      )}
                      {!item.soldOut && qty > 0 && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(255, 106, 0, 0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{
                            background: '#FF6A00', borderRadius: '50%',
                            width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Check size={16} color="#fff" strokeWidth={3} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </main>

      {/* ── FLOATING CART BUTTON (mobile) */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={{
              position: 'fixed', bottom: '24px', left: '16px', right: '16px',
              zIndex: 50, maxWidth: '568px', margin: '0 auto',
            }}
          >
            <button
              id="floating-cart-btn"
              onClick={() => { setIsCartOpen(true); setOrderStep('cart'); }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                border: 'none', borderRadius: '18px', padding: '16px 24px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 8px 32px rgba(255, 106, 0, 0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  background: 'rgba(0,0,0,0.2)', borderRadius: '10px',
                  padding: '4px 8px', color: '#fff', fontWeight: 900, fontSize: '13px',
                }}>
                  {totalItems}
                </div>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '15px' }}>Ver mi pedido</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 900, fontSize: '16px' }}>
                  ${totalPrice} MXN
                </span>
                <ChevronRight size={20} color="rgba(255,255,255,0.8)" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ITEM DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(4px)', zIndex: 60,
              }}
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#1a1a1a', borderRadius: '24px 24px 0 0',
                zIndex: 61, maxHeight: '90vh', overflow: 'auto',
                maxWidth: '600px', margin: '0 auto',
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: '260px', overflow: 'hidden', borderRadius: '24px 24px 0 0' }}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(26,26,26,1) 0%, rgba(26,26,26,0) 50%)',
                }} />
                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <X size={18} color="#fff" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 20px 40px' }}>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '24px', margin: '0 0 8px' }}>
                  {selectedItem.name}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px' }}>
                  {selectedItem.description}
                </p>

                {/* Stats row */}
                <div style={{
                  display: 'flex', gap: '12px',
                  background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 16px',
                  marginBottom: '24px',
                }}>
                  
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>${selectedItem.price}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>MXN</div>
                  </div>
                </div>

                {/* Static Size Info */}
                <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '12px 16px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0, fontWeight: 700 }}>
                    Talla: <span style={{ color: '#FF8C00' }}>Adulto (Unitalla)</span>
                  </p>
                </div>

                {/* Action */}
                {getItemQty(selectedItem.id) > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={() => handleShare(selectedItem)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        width: '52px',
                        height: '52px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s ease, background-color 0.2s',
                        flexShrink: 0,
                      }}
                      className="hover:bg-white/15"
                    >
                      <Share2 size={20} />
                    </button>
                    <div style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0',
                      background: 'rgba(255, 106, 0, 0.12)',
                      border: '1px solid rgba(255, 106, 0, 0.3)',
                      borderRadius: '14px', overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => updateQty(selectedItem.id, -1)}
                        style={{
                          flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                          padding: '14px', color: '#FF8C00', fontWeight: 900, fontSize: '20px',
                        }}
                      >
                        <Minus size={18} />
                      </button>
                      <span style={{ color: '#fff', fontWeight: 900, fontSize: '20px', minWidth: '30px', textAlign: 'center' }}>
                        {getItemQty(selectedItem.id)}
                      </span>
                      <button
                        onClick={() => updateQty(selectedItem.id, 1)}
                        style={{
                          flex: 1, background: 'none', border: 'none', cursor: 'pointer',
                          padding: '14px', color: '#FF8C00', fontWeight: 900, fontSize: '20px',
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectedItem(null)}
                      style={{
                        background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                        border: 'none', borderRadius: '14px',
                        padding: '14px 20px', cursor: 'pointer',
                        color: '#fff', fontWeight: 800, fontSize: '15px',
                        boxShadow: '0 4px 20px rgba(255, 106, 0, 0.4)',
                      }}
                    >
                      ✓ Listo
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleShare(selectedItem)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '50%',
                        width: '52px',
                        height: '52px',
                        color: '#fff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.15s ease, background-color 0.2s',
                        flexShrink: 0,
                      }}
                      className="hover:bg-white/15"
                    >
                      <Share2 size={20} />
                    </button>
                    <button
                      onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                        border: 'none', borderRadius: '14px',
                        padding: '16px', cursor: 'pointer',
                        color: '#fff', fontWeight: 900, fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                        boxShadow: '0 4px 20px rgba(255, 106, 0, 0.4)',
                      }}
                    >
                      <Plus size={20} />
                      Agregar al pedido — ${selectedItem.price} MXN
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)', zIndex: 70,
              }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed', right: 0, top: 0, bottom: 0,
                width: '100%', maxWidth: '420px',
                background: '#111', zIndex: 71,
                display: 'flex', flexDirection: 'column',
                boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
              }}
            >
              {/* Cart Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '22px', margin: 0 }}>
                    {orderStep === 'cart' ? '🛒 Tu Pedido' : '📱 Confirmar'}
                  </h2>
                  {orderStep === 'cart' && cart.length > 0 && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '2px 0 0' }}>
                      {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)', border: 'none',
                    borderRadius: '50%', width: '40px', height: '40px',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <X size={20} color="rgba(255,255,255,0.7)" />
                </button>
              </div>

              {/* Cart Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                <AnimatePresence mode="wait">
                  {/* STEP 1: Cart Items */}
                  {orderStep === 'cart' && (
                    <motion.div key="cart-items" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.3)' }}>
                          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎃</div>
                          <p style={{ fontWeight: 700, fontSize: '15px' }}>Tu pedido está vacío</p>
                          <p style={{ fontSize: '13px', marginTop: '6px' }}>Agrega algo del menú para comenzar</p>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {cart.map(item => (
                            <motion.div
                              key={item.id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px', padding: '12px 14px',
                                display: 'flex', alignItems: 'center', gap: '12px',
                              }}
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {item.name}
                                </p>
                                <p style={{ color: '#FF8C00', fontWeight: 800, fontSize: '14px', margin: '2px 0 0' }}>
                                  ${item.price * item.quantity}
                                </p>
                                {/* Size label */}
                                {item.sizes && item.sizes.length > 0 ? (
                                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '2px 0 0', fontWeight: 600 }}>
                                    Talla: {item.selectedSize || item.sizes[0]}
                                  </p>
                                ) : (
                                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '2px 0 0', fontWeight: 600 }}>
                                    Talla: Adulto (Unitalla)
                                  </p>
                                )}
                              </div>
                              <div style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '4px',
                              }}>
                                <button
                                  onClick={() => updateQty(item.id, -1)}
                                  style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    width: '28px', height: '28px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'rgba(255,255,255,0.6)',
                                  }}
                                >
                                  <Minus size={14} />
                                </button>
                                <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px', minWidth: '18px', textAlign: 'center' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQty(item.id, 1)}
                                  style={{
                                    background: 'rgba(255, 106, 0, 0.2)', border: 'none', cursor: 'pointer',
                                    width: '28px', height: '28px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#FF8C00',
                                  }}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* STEP 2: Confirm + Name */}
                  {orderStep === 'confirm' && (
                    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      {/* Order summary */}
                      <div style={{
                        background: 'rgba(255, 106, 0, 0.08)',
                        border: '1px solid rgba(255, 106, 0, 0.2)',
                        borderRadius: '16px', padding: '16px', marginBottom: '20px',
                      }}>
                        <p style={{ color: '#FF8C00', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                          Resumen del pedido
                        </p>
                        {cart.map(item => (
                          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                              {item.name} x{item.quantity}
                            </span>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                              ${item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#fff', fontWeight: 900, fontSize: '15px' }}>Total</span>
                          <span style={{ color: '#FF8C00', fontWeight: 900, fontSize: '18px' }}>${totalPrice} MXN</span>
                        </div>
                      </div>

                      {/* Name input */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                          Tu nombre (opcional)
                        </label>
                        <input
                          id="customer-name-input"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Ej: Juan García"
                          style={{
                            width: '100%', background: 'rgba(255,255,255,0.07)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '12px', padding: '14px 16px',
                            color: '#fff', fontSize: '15px', outline: 'none',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{
                        background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                        padding: '12px 14px', marginBottom: '8px',
                      }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: 0 }}>
                          📱 Al confirmar, abriremos WhatsApp con tu pedido desglosado listo para enviar.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div style={{
                  padding: '16px 20px 24px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {orderStep === 'cart' && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Total del pedido</span>
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: '20px' }}>
                          ${totalPrice} <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>MXN</span>
                        </span>
                      </div>
                      <button
                        id="proceed-to-confirm-btn"
                        onClick={() => setOrderStep('confirm')}
                        style={{
                          width: '100%',
                          background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                          border: 'none', borderRadius: '16px',
                          padding: '16px', cursor: 'pointer',
                          color: '#fff', fontWeight: 900, fontSize: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                          boxShadow: '0 8px 24px rgba(255, 106, 0, 0.4)',
                        }}
                      >
                        Continuar
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {orderStep === 'confirm' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        id="back-to-cart-btn"
                        onClick={() => setOrderStep('cart')}
                        style={{
                          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '14px', padding: '12px',
                          cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                          fontWeight: 700, fontSize: '14px',
                        }}
                      >
                        ← Volver al carrito
                      </button>

                      <AnimatePresence mode="wait">
                        {orderSent ? (
                          <motion.div
                            key="sent"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{
                              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                              borderRadius: '16px', padding: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                              color: '#fff', fontWeight: 900, fontSize: '16px',
                              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                            }}
                          >
                            <Check size={22} strokeWidth={3} /> ¡Pedido enviado!
                          </motion.div>
                        ) : (
                          <motion.button
                            key="whatsapp-btn"
                            id="whatsapp-order-btn"
                            onClick={handleCheckout}
                            style={{
                              background: 'linear-gradient(135deg, #25D366, #128C7E)',
                              border: 'none', borderRadius: '16px',
                              padding: '16px', cursor: 'pointer',
                              color: '#fff', fontWeight: 900, fontSize: '16px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                              boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                            }}
                          >
                            <MessageCircle size={20} fill="currentColor" />
                            Enviar pedido por WhatsApp
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── ADMIN PANEL (premium, gestión en vivo del catálogo) ───────── */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 80, background: '#0a0a0a', overflowY: 'auto' }}
          >
            <AdminHalloween
              costumes={menuItems}
              onUpdate={updateItem}
              onAdd={addItem}
              onDelete={deleteItem}
              onReset={resetMenu}
              onClose={() => setIsAdminOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              background: '#FF6A00',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '50px',
              fontWeight: 800,
              fontSize: '14px',
              zIndex: 100,
              boxShadow: '0 8px 32px rgba(255, 106, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/525560917169"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full font-bold shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:bg-[#1ebe57] hover:scale-105 transition-all"
      >
        <MessageCircle size={22} fill="currentColor" />
        <span>¡Cotiza aquí!</span>
      </a>

      {/* ── QR MODAL ── */}
      <AnimatePresence>
        {isQRModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setIsQRModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border-2 border-[#FF6A00] rounded-2xl p-8 max-w-sm w-full flex flex-col items-center text-center relative shadow-[0_0_40px_rgba(255,106,0,0.2)]"
            >
              <button
                onClick={() => setIsQRModalOpen(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wider">
                Comparte el Catálogo
              </h2>
              
              <div className="bg-white p-4 rounded-xl mb-6 shadow-xl">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://imagineandstamp.site/%23/mundo-halloween&color=000000&bgcolor=ffffff" 
                  alt="QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>

              <p className="text-white/70 text-sm font-medium leading-relaxed">
                Muestra este código desde tu pantalla para que otros escaneen y guarden nuestro catálogo y contacto al instante. 🎃
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CORPORATE FOOTER */}

      <footer className="bg-[#0a0a0a] border-t border-white/5 pt-12 pb-32 px-6 mt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Branding */}
          <div className="space-y-4">
            <img src="/logo-halloween.png" alt="Mundo de Halloween" className="h-20 w-auto object-contain rounded-2xl" style={{ filter: 'drop-shadow(0 0 10px rgba(255,106,0,0.3))' }} />
            <p className="text-white/50 text-sm leading-relaxed">
              Tu destino definitivo para disfraces, decoración y efectos especiales de Halloween en Ciudad de México.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.facebook.com/share/1E4KXbMWFa/?mibextid=wwXIfr"
                target="_blank" rel="noreferrer"
                className="w-10 h-10 rounded-full bg-[#1877F2]/10 border border-[#1877F2]/20 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2]/20 transition-all"
                title="Facebook Mundo de Halloween"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="font-black text-white text-sm uppercase tracking-widest">Contacto</h3>
            <div className="space-y-3 text-sm text-white/60">
              <a href="https://wa.me/525560917169" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors">
                <MessageCircle size={16} className="text-[#25D366] shrink-0" />
                <span>WhatsApp Pedidos: 55 6091 7169</span>
              </a>
              <a href="tel:5556336232" className="flex items-center gap-3 hover:text-[#FF8C00] transition-colors">
                <span className="text-[#FF8C00] shrink-0 text-base">📞</span>
                <span>55 5633 6232</span>
              </a>
              <a href="mailto:ventas@mundodehalloween.com" className="flex items-center gap-3 hover:text-[#FF8C00] transition-colors pb-2">
                <MailIcon size={16} className="text-[#FF8C00] shrink-0" />
                <span>ventas@mundodehalloween.com</span>
              </a>
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#FF6A00]/10 border border-[#FF6A00]/30 text-[#FF8C00] py-3 rounded-xl font-bold hover:bg-[#FF6A00]/20 transition-all"
              >
                <QrCode size={18} />
                Compartir Catálogo por QR
              </button>
            </div>
          </div>

          {/* Ubicación y Horarios */}
          <div className="space-y-4">
            <h3 className="font-black text-white text-sm uppercase tracking-widest">Ubicación y Horarios</h3>
            <div className="space-y-3 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <span className="text-[#FF8C00] shrink-0 mt-0.5 text-base">📍</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ignacio+Allende+45+Del+Carmen+Coyoac%C3%A1n+04100+Ciudad+de+M%C3%A9xico"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#FF8C00] transition-colors underline-offset-2 hover:underline"
                >
                  Ignacio Allende 45, Del Carmen, Coyoacán, 04100 Ciudad de México, CDMX
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#FF8C00] shrink-0 text-base">🕐</span>
                <span className="font-semibold text-[#FF8C00]">Sáb – Dom: 12:00 PM – 12:00 AM</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-5xl mx-auto mt-10 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
          <p className="text-white/20 text-[10px] uppercase tracking-widest">© 2026 Mundo de Halloween. Todos los derechos reservados.</p>
          <button onClick={() => setIsAdminOpen(true)} className="text-white/10 hover:text-white/40 transition-colors" aria-label="Admin Access">
            <Lock size={14} />
          </button>
        </div>
      </footer>
    </div>
  );
}
