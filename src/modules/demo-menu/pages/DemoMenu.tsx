import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, X, ChevronRight, Star, Flame, Leaf, MessageCircle, ArrowLeft, Search, Check, Settings, Image as ImageIcon, EyeOff, Eye, DollarSign, RefreshCw, Save, Instagram, Facebook, Phone, Mail, Clock } from 'lucide-react';

import burgerClassicImg from '../assets/burger-classic.png';
import burgerDoubleSmashImg from '../assets/burger-double-smash.png';
import burgerBbqBaconImg from '../assets/burger-bbq-bacon.png';
import burgerMushroomSwissImg from '../assets/burger-mushroom-swiss.png';
import chickenFingersImg from '../assets/chicken-fingers.png';
import brownieSundaeImg from '../assets/brownie-sundae.png';

const TikTokIcon = ({ size = 24, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: 'popular' | 'new' | 'veggie' | 'spicy';
  rating: number;
  calories: number;
  soldOut?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '525650469993'; // Your WhatsApp number

const CATEGORIES = [
  { id: 'all',       label: 'Todo',        emoji: '🍔' },
  { id: 'burgers',   label: 'Burgers',     emoji: '🥩' },
  { id: 'sides',     label: 'Sides',       emoji: '🍟' },
  { id: 'drinks',    label: 'Bebidas',     emoji: '🥤' },
  { id: 'desserts',  label: 'Postres',     emoji: '🍫' },
];

const INITIAL_MENU_ITEMS: MenuItem[] = [
  // BURGERS
  {
    id: 1,
    name: 'Classic Burger',
    description: 'Jugosa carne de res, cheddar derretido, lechuga fresca, tomate y nuestra salsa secreta en pan brioche dorado.',
    price: 149,
    image: burgerClassicImg,
    category: 'burgers',
    badge: 'popular',
    rating: 4.8,
    calories: 620,
  },
  {
    id: 2,
    name: 'Double Smash',
    description: 'Doble carne aplastada al carbón, queso americano x2, cebolla caramelizada y salsa smash sobre pan brioche.',
    price: 199,
    image: burgerDoubleSmashImg,
    category: 'burgers',
    badge: 'popular',
    rating: 4.9,
    calories: 850,
  },
  {
    id: 3,
    name: 'BBQ Bacon Burger',
    description: 'Tocino crujiente extra, aros de cebolla crujientes, salsa BBQ ahumada y cheddar sobre carne de res premium.',
    price: 189,
    image: burgerBbqBaconImg,
    category: 'burgers',
    badge: 'spicy',
    rating: 4.7,
    calories: 780,
  },
  {
    id: 4,
    name: 'Mushroom Swiss',
    description: 'Champiñones salteados con ajo, queso suizo derretido, cebolla caramelizada y aioli de trufa.',
    price: 179,
    image: burgerMushroomSwissImg,
    category: 'burgers',
    badge: 'new',
    rating: 4.6,
    calories: 690,
  },
  // SIDES
  {
    id: 5,
    name: 'Loaded Fries',
    description: 'Papas fritas crujientes bañadas en queso cheddar derretido, tocino, jalapeños y crema ácida.',
    price: 89,
    image: './demo-menu/fries-loaded.png',
    category: 'sides',
    badge: 'popular',
    rating: 4.7,
    calories: 480,
  },
  {
    id: 6,
    name: 'Onion Rings',
    description: 'Aros de cebolla gigantes empanizados en cerveza, con salsa ranch casera para dipping.',
    price: 69,
    image: './demo-menu/onion-rings.png',
    category: 'sides',
    rating: 4.5,
    calories: 340,
  },
  {
    id: 7,
    name: 'Chicken Fingers',
    description: 'Tiras de pollo marinado, crujientes por fuera y jugosas por dentro. Con salsa de miel-mostaza.',
    price: 109,
    image: chickenFingersImg,
    category: 'sides',
    badge: 'new',
    rating: 4.6,
    calories: 410,
  },
  // DRINKS
  {
    id: 8,
    name: 'Malteada Chocolate',
    description: 'Malteada espesa de chocolate oscuro belga con crema batida, drizzle de fudge caliente y cereza.',
    price: 99,
    image: './demo-menu/milkshake-chocolate.png',
    category: 'drinks',
    badge: 'popular',
    rating: 4.9,
    calories: 520,
  },
  {
    id: 9,
    name: 'Malteada Fresa',
    description: 'Malteada cremosa de fresas naturales, helado de vainilla y fresas frescas de temporada.',
    price: 99,
    image: './demo-menu/milkshake-strawberry.png',
    category: 'drinks',
    rating: 4.7,
    calories: 480,
  },
  // DESSERTS
  {
    id: 10,
    name: 'Brownie Sundae',
    description: 'Brownie tibio de chocolate amargo con helado de vainilla artesanal, salsa de caramelo y nueces.',
    price: 119,
    image: brownieSundaeImg,
    category: 'desserts',
    badge: 'popular',
    rating: 4.8,
    calories: 590,
  },
];

// ─── STOCK PHOTO LIBRARY ──────────────────────────────────────────────────────
// Banco de imágenes "de stock" que el dueño puede asignar a cualquier platillo
// desde el panel de admin. Se pueden ir generando con IA y sumar aquí.
const STOCK_IMAGES: { url: string; label: string }[] = [
  { url: burgerClassicImg,       label: 'Burger Clásica' },
  { url: burgerDoubleSmashImg,  label: 'Double Smash' },
  { url: burgerBbqBaconImg,     label: 'BBQ Bacon' },
  { url: burgerMushroomSwissImg,label: 'Mushroom Swiss' },
  { url: './demo-menu/fries-loaded.png',         label: 'Loaded Fries' },
  { url: './demo-menu/onion-rings.png',          label: 'Onion Rings' },
  { url: chickenFingersImg,      label: 'Chicken Fingers' },
  { url: './demo-menu/milkshake-chocolate.png',  label: 'Malteada Chocolate' },
  { url: './demo-menu/milkshake-strawberry.png', label: 'Malteada Fresa' },
  { url: brownieSundaeImg,       label: 'Brownie Sundae' },
];

// ─── GOOGLE SHEETS CONNECTION (PREPARADO) ─────────────────────────────────────
// Para conectar este menú a una Hoja de Cálculo de Google:
// 1. Publica tu Sheet como JSON usando opensheet.elk.sh, sheety.co o sheet.best.
// 2. Reemplaza el body de `fetchMenuFromGoogleSheets` con el fetch real.
// 3. Columnas sugeridas: id | name | description | price | image | category |
//    badge | rating | calories | soldOut
//
// Ejemplo (descomenta cuando tengas el endpoint):
// const SHEET_ENDPOINT = 'https://opensheet.elk.sh/<SHEET_ID>/menu';
async function fetchMenuFromGoogleSheets(): Promise<MenuItem[]> {
  // const res = await fetch(SHEET_ENDPOINT);
  // const rows = await res.json();
  // return rows.map((r: any) => ({
  //   id: Number(r.id),
  //   name: r.name,
  //   description: r.description,
  //   price: Number(r.price),
  //   image: r.image,
  //   category: r.category,
  //   badge: r.badge || undefined,
  //   rating: Number(r.rating),
  //   calories: Number(r.calories),
  //   soldOut: String(r.soldOut).toLowerCase() === 'true',
  // }));
  return INITIAL_MENU_ITEMS;
}

// ─── BADGE CONFIG ─────────────────────────────────────────────────────────────
const BADGE_CONFIG = {
  popular: { label: 'Popular',  icon: Star,   bg: 'bg-amber-500',   text: 'text-white' },
  new:     { label: 'Nuevo',    icon: Flame,  bg: 'bg-emerald-500', text: 'text-white' },
  veggie:  { label: 'Veggie',   icon: Leaf,   bg: 'bg-green-500',   text: 'text-white' },
  spicy:   { label: 'Picante',  icon: Flame,  bg: 'bg-red-500',     text: 'text-white' },
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DemoMenu() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [orderSent, setOrderSent] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [discountCoupon, setDiscountCoupon] = useState('');
  const [orderStep, setOrderStep] = useState<'cart' | 'confirm'>('cart');

  // ── Catálogo dinámico (lista para Google Sheets) ──────────────────────────
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminPickerForId, setAdminPickerForId] = useState<number | null>(null);

  useEffect(() => {
    // Al montar, intenta hidratar el catálogo desde la fuente externa (Sheets).
    // Hoy regresa INITIAL_MENU_ITEMS; cuando configures el endpoint, jala datos reales.
    fetchMenuFromGoogleSheets()
      .then(setMenuItems)
      .catch(err => console.warn('No se pudo cargar el menú remoto:', err));
  }, []);

  // ── Helpers de edición en vivo (modo admin) ────────────────────────────────
  const updateItem = (id: number, patch: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  };

  const resetMenu = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
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
  const subTotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const isDelivery = deliveryMethod === 'Envío a domicilio';
  const deliveryFee = isDelivery ? 50 : 0;
  const totalPrice = subTotal + deliveryFee;

  const addToCart = (item: MenuItem) => {
    if (item.soldOut) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c)
        .filter(c => c.quantity > 0)
    );
  };

  const getItemQty = (id: number) => cart.find(c => c.id === id)?.quantity ?? 0;

  // ── WhatsApp checkout
  const handleCheckout = () => {
    const lines = cart
      .map(i => `  • ${i.name} x${i.quantity} — $${i.price * i.quantity} MXN`)
      .join('\n');

    const name = customerName.trim() || 'Cliente';
    const phone = customerPhone.trim() ? `Tel: ${customerPhone}` : '';
    const dMethod = `Método de Entrega: ${deliveryMethod}`;
    const pMethod = `Forma de Pago: ${paymentMethod}`;
    const notes = additionalNotes.trim() ? `Notas: ${additionalNotes}` : '';
    const coupon = discountCoupon.trim() ? `Cupón: ${discountCoupon}` : '';
    const pickupExtra = isDelivery ? `Costo de envío a domicilio: $50 MXN\n` : '';

    const message =
      `🍔 *Pedido en Burger & Co*\n\n` +
      `*Datos del Cliente:*\n` +
      `Nombre: ${name}\n` +
      (phone ? `${phone}\n` : '') +
      `\n*Detalle del Pedido:*\n${lines}\n\n` +
      `${pickupExtra}` +
      `*Total: $${totalPrice} MXN*\n\n` +
      `*Opciones seleccionadas:*\n` +
      `${dMethod}\n` +
      `${pMethod}\n` +
      (notes ? `\n*Información Extra:*\n${notes}\n` : '') +
      (coupon ? `\n*Cupón:* ${coupon}\n` : '') +
      `\n_Pedido generado desde el menú digital de Imagine & Stamp_ ✨`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    setOrderSent(true);
    setTimeout(() => {
      setCart([]);
      setOrderSent(false);
      setOrderStep('cart');
      setIsCartOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryMethod('');
      setPaymentMethod('');
      setAdditionalNotes('');
      setDiscountCoupon('');
    }, 2500);
  };

  return (
    <div className="min-h-screen" style={{ background: '#0D0D0D', fontFamily: "'Inter', sans-serif" }}>
      {/* ── SEO Meta */}
      <title>Burger & Co | Menú Digital Demo — Imagine & Stamp</title>

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
              <div className="flex items-center gap-3 mb-2">
                <div style={{
                  width: 48, height: 48, borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', flexShrink: 0,
                  boxShadow: '0 4px 20px rgba(255, 106, 0, 0.4)',
                }}>
                  🍔
                </div>
                <div>
                  <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.5px' }}>
                    Burger & Co
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
                    Menú Digital Interactivo
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-3">
                <span style={{ color: '#FF8C00', fontSize: '12px', fontWeight: 700 }}>
                  ⭐ 4.8 (2.4k reseñas)
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  🕐 20–35 min
                </span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>•</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  📍 Demo
                </span>
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

          {/* Demo badge */}
          <div style={{
            marginTop: '16px',
            background: 'rgba(255, 106, 0, 0.15)',
            border: '1px solid rgba(255, 106, 0, 0.3)',
            borderRadius: '10px',
            padding: '8px 12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <span style={{ fontSize: '11px', color: '#FF8C00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ✨ Demo por Imagine & Stamp — Tu menú digital conectado a WhatsApp
            </span>
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
            onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
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
              const badge = item.badge ? BADGE_CONFIG[item.badge] : null;

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
                      {/* Badge */}
                      {badge && (
                        <div style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 8px', borderRadius: '6px',
                          background: item.badge === 'popular' ? 'rgba(245,158,11,0.2)' :
                                      item.badge === 'new' ? 'rgba(16,185,129,0.2)' :
                                      item.badge === 'spicy' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
                          color: item.badge === 'popular' ? '#F59E0B' :
                                 item.badge === 'new' ? '#10B981' :
                                 item.badge === 'spicy' ? '#EF4444' : '#22C55E',
                          fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                          letterSpacing: '0.06em', width: 'fit-content',
                        }}>
                          {item.badge === 'popular' ? '⭐' : item.badge === 'new' ? '✨' : item.badge === 'spicy' ? '🌶' : '🌿'}
                          {' '}{badge.label}
                        </div>
                      )}

                      <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '16px', lineHeight: 1.2, margin: 0 }}>
                        {item.name}
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', lineHeight: 1.5, margin: 0 }}>
                        {item.description}
                      </p>

                      {/* Stats */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span style={{ color: '#F59E0B', fontSize: '11px', fontWeight: 600 }}>
                          ⭐ {item.rating}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>
                          🔥 {item.calories} cal
                        </span>
                      </div>

                      {/* Price + Add button */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ color: '#FF8C00', fontWeight: 900, fontSize: '20px' }}>
                          ${item.price}
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', fontWeight: 500 }}> MXN</span>
                        </span>

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
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#F59E0B', fontWeight: 800, fontSize: '18px' }}>⭐ {selectedItem.rating}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Rating</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#FF8C00', fontWeight: 800, fontSize: '18px' }}>{selectedItem.calories}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Calorías</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ color: '#fff', fontWeight: 800, fontSize: '18px' }}>${selectedItem.price}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>MXN</div>
                  </div>
                </div>

                {/* Action */}
                {getItemQty(selectedItem.id) > 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                  <button
                    onClick={() => { addToCart(selectedItem); setSelectedItem(null); }}
                    style={{
                      width: '100%',
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
                          <div style={{ fontSize: '56px', marginBottom: '12px' }}>🍔</div>
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
                        {isDelivery && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                              Costo de Envío
                            </span>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                              $50
                            </span>
                          </div>
                        )}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#fff', fontWeight: 900, fontSize: '15px' }}>Total</span>
                          <span style={{ color: '#FF8C00', fontWeight: 900, fontSize: '18px' }}>${totalPrice} MXN</span>
                        </div>
                      </div>

                      {/* Datos del cliente */}
                      <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Nombre completo *
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
                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Teléfono *
                          </label>
                          <input
                            id="customer-phone-input"
                            value={customerPhone}
                            onChange={e => setCustomerPhone(e.target.value)}
                            placeholder="Ej: 56 5046 9993"
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px', padding: '14px 16px',
                              color: '#fff', fontSize: '15px', outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Método de Entrega *
                          </label>
                          <select
                            value={deliveryMethod}
                            onChange={e => setDeliveryMethod(e.target.value)}
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px', padding: '14px 16px',
                              color: '#fff', fontSize: '15px', outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option value="" disabled style={{ background: '#111' }}>Seleccione una opción</option>
                            <option value="Por confirmar" style={{ background: '#111' }}>❓ Por confirmar</option>
                            <option value="Envío a domicilio" style={{ background: '#111' }}>🛵 Envío a domicilio</option>
                            <option value="Recoger en tienda" style={{ background: '#111' }}>🏪 Recoger en tienda</option>
                            <option value="Entrega digital" style={{ background: '#111' }}>💻 Entrega digital</option>
                          </select>
                          {isDelivery && (
                            <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(255, 140, 0, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 140, 0, 0.3)' }}>
                              <p style={{ color: '#FF8C00', fontSize: '12px', margin: 0, fontWeight: 600 }}>
                                ℹ️ Costo por envío a domicilio: $50 pesos. (Sumado al total)
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Forma de Pago *
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={e => setPaymentMethod(e.target.value)}
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px', padding: '14px 16px',
                              color: '#fff', fontSize: '15px', outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          >
                            <option value="" disabled style={{ background: '#111' }}>Seleccione una opción</option>
                            <option value="Por confirmar" style={{ background: '#111' }}>❓ Por confirmar</option>
                            <option value="Efectivo" style={{ background: '#111' }}>💵 Efectivo</option>
                            <option value="Tarjeta" style={{ background: '#111' }}>💳 Tarjeta</option>
                            <option value="Transferencia" style={{ background: '#111' }}>🏦 Transferencia</option>
                          </select>
                          {paymentMethod === 'Transferencia' && (
                            <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(34, 197, 94, 0.15)', borderRadius: '8px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                              <p style={{ color: '#22C55E', fontSize: '12px', margin: 0, fontWeight: 600 }}>
                                Datos bancarios: CLABE 012345678901234567 / Cuenta 1234567890 (Banco XYZ)
                              </p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Cupón de descuento
                          </label>
                          <input
                            value={discountCoupon}
                            onChange={e => setDiscountCoupon(e.target.value)}
                            placeholder="Ej: DESC10"
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px', padding: '14px 16px',
                              color: '#fff', fontSize: '15px', outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                            Notas adicionales
                          </label>
                          <textarea
                            value={additionalNotes}
                            onChange={e => setAdditionalNotes(e.target.value)}
                            placeholder="Alguna alergia o instrucción especial..."
                            style={{
                              width: '100%', background: 'rgba(255,255,255,0.07)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '12px', padding: '14px 16px',
                              color: '#fff', fontSize: '15px', outline: 'none',
                              boxSizing: 'border-box',
                              minHeight: '80px', resize: 'vertical'
                            }}
                          />
                        </div>
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
                            disabled={!customerName || !customerPhone || !deliveryMethod || !paymentMethod}
                            style={{
                              background: 'linear-gradient(135deg, #25D366, #128C7E)',
                              border: 'none', borderRadius: '16px',
                              padding: '16px', 
                              cursor: (!customerName || !customerPhone || !deliveryMethod || !paymentMethod) ? 'not-allowed' : 'pointer',
                              opacity: (!customerName || !customerPhone || !deliveryMethod || !paymentMethod) ? 0.5 : 1,
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



      {/* ── ADMIN PANEL (gestión en vivo del catálogo) ───────────────────── */}
      <AnimatePresence>
        {isAdminOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsAdminOpen(false); setAdminPickerForId(null); }}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
                backdropFilter: 'blur(6px)', zIndex: 80,
              }}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: '100%', maxWidth: '460px',
                background: '#0F0F0F', zIndex: 81,
                display: 'flex', flexDirection: 'column',
                boxShadow: '20px 0 60px rgba(0,0,0,0.6)',
                borderRight: '1px solid rgba(255, 140, 0, 0.15)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                background: 'linear-gradient(135deg, #1a0a00 0%, #2d1000 100%)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '12px',
                      background: 'linear-gradient(135deg, #FF6A00, #FF8C00)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(255, 106, 0, 0.4)',
                    }}>
                      <Settings size={20} color="#fff" />
                    </div>
                    <div>
                      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '17px', margin: 0, letterSpacing: '-0.3px' }}>
                        Modo administrador
                      </h2>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '2px 0 0' }}>
                        Edita en vivo — cambios instantáneos
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsAdminOpen(false); setAdminPickerForId(null); }}
                    style={{
                      background: 'rgba(255,255,255,0.08)', border: 'none',
                      borderRadius: '50%', width: '36px', height: '36px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={18} color="rgba(255,255,255,0.7)" />
                  </button>
                </div>

                <div style={{
                  marginTop: '10px',
                  background: 'rgba(255, 106, 0, 0.12)',
                  border: '1px solid rgba(255, 106, 0, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontSize: '11px',
                  color: 'rgba(255, 200, 140, 0.9)',
                  lineHeight: 1.5,
                }}>
                  💡 Demo: el dueño edita precios y disponibilidad desde su celular.
                  Conectado a Google Sheets, esto vive sincronizado en todos los dispositivos.
                </div>
              </div>

              {/* Acciones globales */}
              <div style={{
                padding: '12px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', gap: '8px',
              }}>
                <button
                  onClick={resetMenu}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 700, fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  }}
                >
                  <RefreshCw size={12} />
                  Restaurar demo
                </button>
                <button
                  onClick={() => { setIsAdminOpen(false); }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    color: '#fff',
                    fontWeight: 800, fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <Save size={12} />
                  Ver menú actualizado
                </button>
              </div>

              {/* Lista de productos editables */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px' }}>
                {menuItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: item.soldOut ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
                      border: item.soldOut
                        ? '1px solid rgba(239,68,68,0.25)'
                        : '1px solid rgba(255,255,255,0.07)',
                      borderRadius: '16px',
                      padding: '12px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '54px', height: '54px',
                          borderRadius: '10px', objectFit: 'cover',
                          flexShrink: 0,
                          filter: item.soldOut ? 'grayscale(0.7)' : 'none',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          color: '#fff', fontWeight: 800, fontSize: '13px',
                          margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.name}
                        </p>
                        <p style={{
                          color: 'rgba(255,255,255,0.35)', fontSize: '10px', margin: '2px 0 0',
                          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700,
                        }}>
                          {CATEGORIES.find(c => c.id === item.category)?.label || item.category}
                        </p>
                      </div>
                    </div>

                    {/* Controles de edición */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                      {/* Precio */}
                      <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        display: 'flex', alignItems: 'center', gap: '6px',
                      }}>
                        <DollarSign size={14} color="#FF8C00" />
                        <input
                          id={`admin-price-${item.id}`}
                          type="number"
                          min="0"
                          value={item.price}
                          onChange={e => updateItem(item.id, { price: Number(e.target.value) || 0 })}
                          style={{
                            flex: 1, minWidth: 0,
                            background: 'transparent', border: 'none', outline: 'none',
                            color: '#fff', fontWeight: 800, fontSize: '13px',
                            width: '100%',
                          }}
                        />
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontWeight: 700 }}>MXN</span>
                      </div>

                      {/* Toggle agotado */}
                      <button
                        id={`admin-soldout-${item.id}`}
                        onClick={() => updateItem(item.id, { soldOut: !item.soldOut })}
                        style={{
                          background: item.soldOut ? 'rgba(239,68,68,0.18)' : 'rgba(34,197,94,0.12)',
                          border: item.soldOut ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.3)',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                          color: item.soldOut ? '#EF4444' : '#22C55E',
                          fontWeight: 800, fontSize: '11px',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}
                      >
                        {item.soldOut ? <EyeOff size={13} /> : <Eye size={13} />}
                        {item.soldOut ? 'Agotado' : 'Disponible'}
                      </button>
                    </div>

                    {/* Cambio de imagen */}
                    <button
                      id={`admin-img-${item.id}`}
                      onClick={() => setAdminPickerForId(adminPickerForId === item.id ? null : item.id)}
                      style={{
                        marginTop: '8px',
                        width: '100%',
                        background: adminPickerForId === item.id ? 'rgba(255, 106, 0, 0.18)' : 'rgba(255,255,255,0.05)',
                        border: adminPickerForId === item.id ? '1px solid rgba(255, 106, 0, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '7px 10px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        color: adminPickerForId === item.id ? '#FF8C00' : 'rgba(255,255,255,0.6)',
                        fontWeight: 700, fontSize: '11px',
                      }}
                    >
                      <ImageIcon size={13} />
                      {adminPickerForId === item.id ? 'Cerrar galería' : 'Cambiar imagen (banco stock)'}
                    </button>

                    {/* Picker de stock */}
                    <AnimatePresence>
                      {adminPickerForId === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div style={{
                            marginTop: '8px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '6px',
                          }}>
                            {STOCK_IMAGES.map(stock => {
                              const isActive = item.image === stock.url;
                              return (
                                <button
                                  key={stock.url}
                                  onClick={() => {
                                    updateItem(item.id, { image: stock.url });
                                    setAdminPickerForId(null);
                                  }}
                                  title={stock.label}
                                  style={{
                                    position: 'relative',
                                    padding: 0,
                                    background: 'transparent',
                                    border: isActive ? '2px solid #FF8C00' : '2px solid transparent',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    aspectRatio: '1 / 1',
                                  }}
                                >
                                  <img
                                    src={stock.url}
                                    alt={stock.label}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                  />
                                  {isActive && (
                                    <div style={{
                                      position: 'absolute', top: 2, right: 2,
                                      background: '#FF6A00', borderRadius: '50%',
                                      width: '16px', height: '16px',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                      <Check size={10} color="#fff" strokeWidth={3} />
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-28 md:pb-16 px-6 mt-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Columna Izquierda: Marca */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Imagine & Stamp</h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Personalizamos tus momentos más especiales con diseños creativos y alta calidad.
            </p>
          </div>

          {/* Columna Central: Contacto */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Contacto</h3>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors justify-center md:justify-start">
                  <MessageCircle size={18} />
                  <span>WhatsApp: Envíanos un mensaje</span>
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                <Phone size={18} />
                <span>Teléfono: 56 5046 9993</span>
              </li>
              <li>
                <a href="mailto:imagineandstamp@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors justify-center md:justify-start">
                  <Mail size={18} />
                  <span>imagineandstamp@gmail.com</span>
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3 text-white/50 pt-2">
                <Clock size={18} />
                <span>Horario de atención: Lun - Vie 9:00 am a 6:00 pm</span>
              </li>
            </ul>
          </div>

          {/* Columna Derecha: Síguenos */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Síguenos</h3>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#E1306C] hover:text-white transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#1877F2] hover:text-white transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white hover:text-black transition-all">
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-white/30 text-xs">
          © {new Date().getFullYear()} Imagine & Stamp. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
