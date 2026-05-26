import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './lib/supabase';
import AdminHalloween from './AdminHalloween';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Star, Flame, Leaf, MessageCircle, ArrowLeft, Search, Check, Settings, Image as ImageIcon, EyeOff, Eye, DollarSign, RefreshCw, Save, Lock, Instagram, Facebook, Mail as MailIcon, Share2 } from 'lucide-react';
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
}

interface CartItem extends Costume {
  quantity: number;
  selectedSize?: string;
  selectedType?: 'Renta' | 'Venta';
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '525650469993'; // Your WhatsApp number

const CATEGORIES = [
  { id: 'all',         label: 'Todo',        emoji: '🎃' },
  { id: 'terror',      label: 'Terror',      emoji: '🧟‍♂️' },
  { id: 'superheroes', label: 'Superhéroes', emoji: '🦸‍♂️' },
  { id: 'infantiles',  label: 'Infantiles',  emoji: '🧸' },
  { id: 'accesorios',  label: 'Accesorios',  emoji: '🎭' },
];

const INITIAL_MENU_ITEMS: Costume[] = [
  {
    id: 'mock-1',
    name: 'Traje Spider-Man Vengador',
    description: 'Disfraz fotorrealista de alta calidad, perfecto para los fans de Marvel.',
    price: 850,
    rentalPrice: 350,
    image: 'https://images.unsplash.com/photo-1534385984626-444f21d3f9e9?q=80&w=600&auto=format&fit=crop',
    category: 'superheroes',
    type: 'Renta y Venta',
    sizes: ['M', 'L'],
    badge: 'MÁS VENDIDO'
  },
  {
    id: 'mock-2',
    name: 'Máscara Catrina Premium',
    description: 'Elegante y detallada máscara tradicional para Día de Muertos.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1542103565-df01b702ec4d?q=80&w=600&auto=format&fit=crop',
    category: 'accesorios',
    type: 'Venta',
    sizes: ['Unitalla'],
    badge: 'NOVEDAD'
  },
  {
    id: 'mock-3',
    name: 'Disfraz Pirata Bucanero',
    description: 'Atuendo completo de pirata con sombrero, saco y accesorios.',
    price: 1200,
    rentalPrice: 500,
    image: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop',
    category: 'terror',
    type: 'Renta y Venta',
    sizes: ['L', 'XL'],
    badge: 'EN OFERTA'
  },
  {
    id: 'mock-4',
    name: 'Disfraz Vampirito Infantil',
    description: 'Disfraz clásico de vampiro, cómodo para niños.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=600&auto=format&fit=crop',
    category: 'infantiles',
    type: 'Venta',
    sizes: ['4-6', '7-9'],
  }
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Costume | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [orderStep, setOrderStep] = useState<'cart' | 'confirm'>('cart');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [initialItemToOpen, setInitialItemToOpen] = useState<string | null>(null);

  // ── Catálogo dinámico (lista para Google Sheets) ──────────────────────────
  const [menuItems, setCostumes] = useState<Costume[]>(INITIAL_MENU_ITEMS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPickerForId, setAdminPickerForId] = useState<string | null>(null);

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
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          background: 'rgba(255, 100, 0, 0.12)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-40px', left: '-40px',
          width: '180px', height: '180px', borderRadius: '50%',
          background: 'rgba(255, 140, 0, 0.08)',
        }} />

        <div className="relative z-10 px-5 pt-10 pb-8">
          {/* Back link */}
          <a
            href="/#/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft size={16} />
            Volver a Imagine & Stamp
          </a>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <img
                  src="/logo-halloween.png"
                  alt="Mundo de Halloween Logo"
                  className="h-12 w-auto object-contain md:h-16 shrink-0"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(255, 106, 0, 0.3))' }}
                />
                <div>
                  <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.5px' }}>
                    Mundo de Halloween
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginTop: '4px', fontWeight: 600 }}>
                    Tu Pasaporte al Terror y la Diversión
                  </p>
                </div>
              </div>
            </div>

            {/* Cart button in header */}
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

      {/* ── CATEGORY TABS */}
      <div style={{
        background: '#111',
        padding: '0 16px 12px',
        overflowX: 'auto',
        display: 'flex',
        gap: '8px',
        scrollbarWidth: 'none',
        position: 'sticky',
        top: '57px',
        zIndex: 39,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`cat-${cat.id}`}
            onClick={() => { setActiveCategory(cat.id.toString()); setSearchQuery(''); }}
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
              boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(255, 106, 0, 0.35)' : 'none',
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
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


                      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '16px', lineHeight: 1.2, margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                      </div>

                      {/* Price + Add button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
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
                      {/* Badges on image */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1 z-40 items-end">
                        {isPopular && (
                          <div className="bg-[#FF6A00] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow flex items-center gap-1 uppercase">
                            🔥 MÁS VENDIDO
                          </div>
                        )}
                        {isNew && (
                          <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow uppercase">
                            NOVEDAD
                          </div>
                        )}
                        {isOnSale && (
                          <div className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow uppercase">
                            EN OFERTA
                          </div>
                        )}
                      </div>
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

      {/* ── CORPORATE FOOTER */}

      <footer className="bg-[#111] border-t border-white/5 pt-12 pb-32 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="h-[50px] w-auto brightness-0 invert opacity-80" />
              <h2 className="text-2xl font-black text-white font-headline tracking-tighter">Imagine & Stamp</h2>
            </div>
            <p className="text-white/60 text-sm max-w-xs">Personalizamos tus momentos más especiales con diseños creativos y alta calidad.</p>
          </div>
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-white text-lg">Contacto</h3>
            <div className="space-y-4 text-sm text-white/70">
              <a href="https://wa.me/525650469993" target="_blank" rel="noreferrer" className="flex items-center gap-3"><MessageCircle size={18} /> WhatsApp</a>
              <a href="mailto:imagineandstamp@gmail.com" className="flex items-center gap-3"><MailIcon size={18} /> imagineandstamp@gmail.com</a>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-white text-lg">Síguenos</h3>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/personalizadosimagineandstamp" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white"><Instagram size={22} /></a>
              <a href="https://www.facebook.com/share/1CFhhieFeV/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white"><Facebook size={22} /></a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-white/30 text-[10px] uppercase tracking-widest">© 2026 Imagine & Stamp. Todos los derechos reservados.</p>
          <button onClick={() => setIsAdminOpen(true)} className="mt-4 text-white/10 hover:text-white/40 transition-colors flex items-center justify-center mx-auto" aria-label="Admin Access">
            <Lock size={16} />
          </button>
        </div>
      </footer>
    </div>
  );
}
