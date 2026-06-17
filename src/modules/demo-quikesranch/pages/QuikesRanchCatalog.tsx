import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Plus, Minus, MessageCircle, Search,
  LayoutGrid, Flame, Phone, Copy, Check, MapPin, ChevronRight,
  Landmark, CreditCard, Banknote, SlidersHorizontal, Heart, Share2,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS, COMPANY_INFO, Product } from '../constants';

// ─── Types ───────────────────────────────────────────────────────────────────

interface CartItem extends Product {
  quantity: number;
  lennyOption?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LENNY_OPTION_PRICE = 0; // Cambiar si hay costo adicional

// ─── Component ───────────────────────────────────────────────────────────────

export default function QuikesRanchCatalog() {
  const [activeCategory, setActiveCategory] = useState('todo');
  const [searchQuery, setSearchQuery]       = useState('');
  const [cart, setCart]                     = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen]         = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen]     = useState(false);
  const [activeBadgeFilter, setActiveBadgeFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lennyToggle, setLennyToggle]       = useState(false);
  const [copied, setCopied]                 = useState<string | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quikesranch_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('quikesranch_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleShare = async (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}#/?item=${product.id}`;
    const shareText = `¡Checa este antojo en Quike's Ranch!: ${product.name} - $${product.price} MXN`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Quike's Ranch",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error al compartir', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryMethod: '',
    address: '',
    paymentMethod: '',
    notes: '',
    coupon: '',
  });

  // ─── Cart helpers ─────────────────────────────────────────────────────────

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCost = form.deliveryMethod === 'Envío a domicilio' ? 50 : 0;
  const discountAmount = form.coupon.toUpperCase() === 'PROMO10' ? cartTotal * 0.1 : 0;
  const finalTotal = cartTotal + deliveryCost - discountAmount;

  const addToCart = (product: Product, withLenny = false, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cartId   = withLenny ? `${product.id}_lenny` : product.id;
    const itemName = withLenny ? `${product.name} (Versión Lenny)` : product.name;
    const itemPrice = product.price + (withLenny ? LENNY_OPTION_PRICE : 0);

    setCart(prev => {
      const found = prev.find(i => i.id === cartId);
      if (found) return prev.map(i => i.id === cartId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, id: cartId, name: itemName, price: itemPrice, quantity: 1, lennyOption: withLenny }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => {
      const found = prev.find(i => i.id === cartId);
      if (found && found.quantity > 1) return prev.map(i => i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== cartId);
    });
  };

  // ─── Product modal ────────────────────────────────────────────────────────

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setLennyToggle(false);
  };

  const handleAddFromModal = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, lennyToggle);
    setSelectedProduct(null);
  };

  // ─── Checkout ─────────────────────────────────────────────────────────────

  const handleCheckout = () => {
    const { name, phone, deliveryMethod, address, paymentMethod, notes, coupon } = form;
    let msg = `🔥 *NUEVO PEDIDO — ${COMPANY_INFO.name}* 🔥\n\n`;
    msg += `*DATOS DEL CLIENTE*\n`;
    msg += `👤 Nombre: ${name}\n`;
    msg += `📱 Teléfono: ${phone}\n`;
    msg += `🚚 Entrega: ${deliveryMethod || '—'}\n`;
    if (deliveryMethod === 'Envío a domicilio' && address) msg += `📍 Dirección: ${address}\n`;
    msg += `💳 Pago: ${paymentMethod || '—'}\n`;
    if (coupon) msg += `🎟️ Cupón: ${coupon}\n`;
    if (notes) msg += `📝 Notas: ${notes}\n`;
    msg += `\n*PEDIDO*\n`;
    cart.forEach(i => { msg += `▪ ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toFixed(2)}\n`; });
    
    if (deliveryCost > 0) msg += `▪ Envío a domicilio — $${deliveryCost.toFixed(2)}\n`;
    if (discountAmount > 0) msg += `▪ Descuento (${coupon}) — -$${discountAmount.toFixed(2)}\n`;

    msg += `\n💰 *TOTAL FINAL: $${finalTotal.toFixed(2)}*\n\n¡Gracias, te esperamos! 🤠`;
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // ─── Filter logic ─────────────────────────────────────────────────────────

  const visibleProducts = useMemo(() => PRODUCTS.filter(p => {
    const matchCat = 
      activeCategory === 'todo' ? true : 
      activeCategory === 'favoritos' ? favorites.includes(p.id) : 
      p.category === activeCategory;
      
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    
    let matchBadge = true;
    if (activeBadgeFilter) {
       if (activeBadgeFilter === 'Especial') matchBadge = p.isLennyBurger || p.badge === 'Especial';
       else if (activeBadgeFilter === 'Popular') matchBadge = (p.popular && !p.isLennyBurger) || p.badge === 'Popular';
       else matchBadge = p.badge === activeBadgeFilter;
    }
    
    return matchCat && matchSearch && matchBadge;
  }), [activeCategory, searchQuery, activeBadgeFilter]);

  // ─── Styles ───────────────────────────────────────────────────────────────

  const ORANGE = '#FF4500';
  const GOLD   = '#FFD700';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen font-sans" style={{ background: '#0A0A0A', color: '#EEEEEE' }}>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b shadow-lg"
        style={{ background: '#0A0A0A', borderColor: `${ORANGE}33` }}
      >
        {/* Top bar */}
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="shrink-0 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <img src="/quikesranch/logo.png" alt={COMPANY_INFO.name} className="h-24 sm:h-32 object-contain" />
            </div>
            <p className="text-[9px] sm:text-[10px] tracking-wider sm:tracking-[0.25em] uppercase mt-1 md:mt-0 text-center max-w-[280px] sm:max-w-none mx-auto leading-relaxed" style={{ color: '#666' }}>
              Burgers · Tortas · Dogos · Papas · Boneless
            </p>
          </div>

          {/* Search + Cart */}
          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1 justify-center md:justify-end max-w-sm mx-auto md:mx-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Buscar…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-4 text-sm rounded-full outline-none transition-colors"
                style={{ background: '#1A1A1A', border: `1px solid #2A2A2A`, color: '#EEE' }}
              />
            </div>
            <button
              onClick={() => setActiveCategory(activeCategory === 'favoritos' ? 'todo' : 'favoritos')}
              className="relative p-2.5 rounded-full transition-colors shrink-0"
              style={{ 
                background: activeCategory === 'favoritos' ? `${ORANGE}22` : '#1A1A1A', 
                border: `1px solid ${ORANGE}55` 
              }}
            >
              <Heart size={20} style={{ color: ORANGE }} fill={activeCategory === 'favoritos' ? ORANGE : 'none'} />
              {favorites.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: ORANGE, color: '#000' }}
                >
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full transition-colors shrink-0"
              style={{ background: '#1A1A1A', border: `1px solid ${ORANGE}55` }}
            >
              <ShoppingBag size={20} style={{ color: ORANGE }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: ORANGE, color: '#000' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ background: '#0D0D0D', borderTop: '1px solid #1A1A1A' }}>
          <div className="flex px-4 py-2.5 gap-2 w-max items-center">
            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all relative shrink-0"
              style={{ background: '#1A1A1A', border: `1px solid ${ORANGE}55`, color: ORANGE }}
            >
              <SlidersHorizontal size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Filtros</span>
            </button>
            {/* All */}
            {[
              { id: 'todo', name: 'Todo', icon: <LayoutGrid size={18} /> },
              ...CATEGORIES
            ].map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-all relative shrink-0"
                  style={{
                    background: active ? `${ORANGE}1A` : 'transparent',
                    border: `1px solid ${active ? ORANGE : '#222'}`,
                    color: active ? ORANGE : '#888',
                  }}
                >
                  <span style={{ color: active ? ORANGE : '#888' }}>{cat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── PRODUCT GRID ───────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 pb-28">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Flame size={48} className="mx-auto mb-3 opacity-20" />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
                  style={{
                    background: '#111',
                    border: `1px solid ${product.isLennyBurger ? GOLD + '55' : '#222'}`,
                    boxShadow: product.isLennyBurger ? `0 0 20px ${GOLD}22` : undefined,
                  }}
                  onClick={() => openProduct(product)}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111 0%, transparent 60%)' }} />

                    {/* Action Buttons */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                      <button 
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="p-1.5 rounded-full transition-transform hover:scale-110"
                        style={{ background: 'rgba(0,0,0,0.5)', color: favorites.includes(product.id) ? ORANGE : '#FFF' }}
                      >
                        <Heart size={18} fill={favorites.includes(product.id) ? ORANGE : 'none'} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(product, e)}
                        className="p-1.5 rounded-full text-white transition-transform hover:scale-110"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                      >
                        <Share2 size={18} />
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                      {product.isLennyBurger && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: GOLD, color: '#000' }}>
                          ⭐ Especial
                        </span>
                      )}
                      {product.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#1A1A1A', color: ORANGE, border: `1px solid ${ORANGE}66` }}>
                          {product.badge}
                        </span>
                      )}
                      {product.popular && !product.isLennyBurger && !product.badge && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: ORANGE, color: '#000' }}>
                          🔥 Popular
                        </span>
                      )}
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-extrabold text-base uppercase tracking-wider leading-tight text-white drop-shadow">
                        {product.name}
                      </h3>
                      <p className="font-bold mt-0.5" style={{ color: ORANGE }}>
                        {product.price > 0 ? `$${product.price.toFixed(2)}` : 'Precio próximamente'}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: '#888' }}>
                      {product.description}
                    </p>
                    <button
                      onClick={e => { e.stopPropagation(); openProduct(product); }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: 'transparent',
                        border: '1px solid #333',
                        color: '#CCC',
                      }}
                    >
                      <Plus size={14} />
                      Añadir al carrito
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="border-t py-10" style={{ background: '#0D0D0D', borderColor: `${ORANGE}22` }}>
        <div className="container mx-auto px-4 max-w-md md:max-w-3xl">
          {/* Brand & Desc */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <img src="/quikesranch/logo.png" alt={COMPANY_INFO.name} className="h-24 sm:h-32 object-contain" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#888' }}>
              Tu destino definitivo para los mejores antojos, hamburguesas y tortas en Delicias.
            </p>
          </div>

          {/* Redes */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: ORANGE }}>Síguenos en Redes</h3>
            <a 
              href="#" 
              className="flex items-center gap-3 p-3 rounded-xl transition-colors w-full sm:w-auto inline-flex"
              style={{ background: '#1A1A1A', border: '1px solid #222' }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1877F2' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span className="text-sm font-bold text-white">Quike's Ranch Oficial</span>
            </a>
          </div>

          {/* Contacto */}
          <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: ORANGE }}>Contacto</h3>
            <div className="space-y-3">
              <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} className="flex items-center gap-3 text-sm transition-colors hover:text-white" style={{ color: '#CCC' }}>
                <MessageCircle size={18} style={{ color: '#25D366' }} />
                <span>WhatsApp Pedidos: {COMPANY_INFO.phone}</span>
              </a>
              <a href={`tel:${COMPANY_INFO.phone.replace(/-/g, '')}`} className="flex items-center gap-3 text-sm transition-colors hover:text-white" style={{ color: '#CCC' }}>
                <Phone size={18} style={{ color: '#E1306C' }} />
                <span>{COMPANY_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Ubicacion */}
          <div className="mb-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: ORANGE }}>Ubicación y Horarios</h3>
            <div className="space-y-4">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Avenida+Cerina+1002+El+Mirador+CP+33086+Delicias,+Chihuahua"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm hover:opacity-80 transition-opacity" 
                style={{ color: '#CCC' }}
              >
                <MapPin size={18} className="shrink-0 mt-0.5" style={{ color: '#E1306C' }} />
                <span className="leading-relaxed underline underline-offset-4 decoration-gray-700">
                  Avenida Cerina 1002 El Mirador CP 33086<br/>Delicias, Chihuahua
                </span>
              </a>
              <div className="flex items-start gap-3 text-sm" style={{ color: '#CCC' }}>
                <div className="shrink-0 mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-gray-400 flex items-center justify-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                </div>
                <span>{COMPANY_INFO.schedule}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-px mb-6" style={{ background: `${ORANGE}22` }} />
          <div className="text-center">
            <p className="text-xs" style={{ color: '#444' }}>
              Página web realizada por{' '}
              <span style={{ color: ORANGE }} className="font-bold">IMAGINE & STAMP</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — PRODUCT DETAILS
      ══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: '#161616',
                border: `1px solid ${selectedProduct.isLennyBurger ? GOLD + '55' : ORANGE + '33'}`,
              }}
            >
              {/* Image */}
              <div className="relative h-60">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'; }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #161616 0%, transparent 50%)' }} />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-2 rounded-full transition-colors"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  <X size={18} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-extrabold uppercase tracking-wide text-white leading-tight">
                      {selectedProduct.name}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <button 
                        onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase transition-colors"
                        style={{ color: favorites.includes(selectedProduct.id) ? ORANGE : '#888' }}
                      >
                        <Heart size={14} fill={favorites.includes(selectedProduct.id) ? ORANGE : 'none'} />
                        {favorites.includes(selectedProduct.id) ? 'Guardado' : 'Guardar'}
                      </button>
                      <button 
                        onClick={(e) => handleShare(selectedProduct, e)}
                        className="flex items-center gap-1.5 text-xs font-bold uppercase transition-colors text-gray-400 hover:text-white"
                      >
                        <Share2 size={14} />
                        Compartir
                      </button>
                    </div>
                  </div>
                  <span className="font-bold text-lg ml-3 shrink-0" style={{ color: selectedProduct.isLennyBurger ? GOLD : ORANGE }}>
                    {selectedProduct.price > 0 ? `$${selectedProduct.price.toFixed(2)}` : '—'}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-5" style={{ color: '#AAA' }}>
                  {selectedProduct.description}
                </p>

                {/* Lenny Option */}
                {selectedProduct.hasLennyOption && (
                  <div
                    className="rounded-xl p-4 mb-5 flex items-center justify-between gap-3"
                    style={{ background: '#1E1E1E', border: `1px solid ${lennyToggle ? GOLD + '66' : '#2A2A2A'}` }}
                  >
                    <div>
                      <p className="text-sm font-bold text-white">¿Versión Lenny?</p>
                      <p className="text-xs mt-0.5" style={{ color: '#777' }}>
                        Envuelta en lechuga en lugar de pan
                        {LENNY_OPTION_PRICE === 0 ? ' · Sin costo extra' : ` · +$${LENNY_OPTION_PRICE}`}
                      </p>
                    </div>
                    <button
                      onClick={() => setLennyToggle(v => !v)}
                      className="relative w-12 h-6 rounded-full transition-colors shrink-0"
                      style={{ background: lennyToggle ? GOLD : '#333' }}
                    >
                      <motion.span
                        animate={{ x: lennyToggle ? 24 : 2 }}
                        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow"
                      />
                    </button>
                  </div>
                )}

                <button
                  onClick={handleAddFromModal}
                  className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  style={{ background: ORANGE, color: '#000' }}
                >
                  <Plus size={18} />
                  {lennyToggle ? 'Añadir Versión Lenny' : 'Añadir al carrito'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          PANEL — CART
      ══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex justify-end"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm h-full flex flex-col shadow-2xl"
              style={{ background: '#111', borderLeft: `1px solid ${ORANGE}33` }}
            >
              {/* Header */}
              <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: '#222' }}>
                <h2 className="font-bold text-lg flex items-center gap-2 text-white">
                  <ShoppingBag style={{ color: ORANGE }} />
                  Tu Pedido
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-600">
                    <ShoppingBag size={44} className="opacity-20" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                ) : cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl p-3"
                    style={{ background: '#1A1A1A', border: '1px solid #252525' }}
                  >
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop'; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white uppercase tracking-wide line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-xs font-bold mt-1" style={{ color: ORANGE }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] text-white">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item, item.lennyOption)} className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2A2A2A] text-white">
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t" style={{ borderColor: '#222' }}>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400 text-sm">Total</span>
                    <span className="text-lg font-extrabold" style={{ color: GOLD }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    style={{ background: ORANGE, color: '#000' }}
                  >
                    <ChevronRight size={18} />
                    Proceder al pago
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — CHECKOUT
      ══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(6px)' }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
              style={{ background: '#111', border: `1px solid ${ORANGE}33` }}
            >
              {/* Header */}
              <div className="p-5 flex justify-between items-center border-b shrink-0" style={{ borderColor: '#222' }}>
                <h2 className="font-bold text-lg text-white flex items-center gap-2">
                  <Flame style={{ color: ORANGE }} size={20} />
                  Finalizar Pedido
                </h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">

                {/* Order summary */}
                <div className="rounded-xl p-4 space-y-1.5" style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ORANGE }}>Resumen</p>
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between text-xs text-gray-400">
                      <span>{i.quantity}x {i.name}</span>
                      <span>${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-2 space-y-1" style={{ borderColor: '#2A2A2A' }}>
                    {deliveryCost > 0 && (
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Envío a domicilio</span>
                        <span>+${deliveryCost.toFixed(2)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-[#25D366]">
                        <span>Descuento (PROMO10)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-sm mt-1">
                      <span className="text-white">Total Final</span>
                      <span style={{ color: GOLD }}>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ORANGE }}>Datos de contacto</p>
                  <input
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full py-3 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-600"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  />
                  <input
                    placeholder="Teléfono / WhatsApp"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full py-3 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-600"
                    style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                  />
                </div>

                {/* Delivery */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ORANGE }}>Método de entrega</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['Para llevar', 'Envío a domicilio'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setForm(f => ({ ...f, deliveryMethod: opt }))}
                        className="py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all"
                        style={{
                          background: form.deliveryMethod === opt ? ORANGE : '#1A1A1A',
                          border: `1px solid ${form.deliveryMethod === opt ? ORANGE : '#2A2A2A'}`,
                          color: form.deliveryMethod === opt ? '#000' : '#888',
                        }}
                      >
                        {opt === 'Para llevar' ? '🛍️ Para llevar' : '🚚 A domicilio'}
                      </button>
                    ))}
                  </div>
                  {form.deliveryMethod === 'Envío a domicilio' && (
                    <div className="relative">
                      <MapPin size={14} className="absolute left-3 top-3.5 text-gray-600" />
                      <input
                        placeholder="Dirección de entrega"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        className="w-full py-3 pl-9 pr-4 rounded-xl text-sm outline-none text-white placeholder-gray-600"
                        style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                      />
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ORANGE }}>Método de pago</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { key: 'Efectivo',       label: 'Efectivo',      icon: <Banknote size={16} /> },
                      { key: 'Transferencia',  label: 'Transferencia', icon: <Landmark size={16} /> },
                      { key: 'Tarjeta',        label: 'Tarjeta',       icon: <CreditCard size={16} /> },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setForm(f => ({ ...f, paymentMethod: opt.key }))}
                        className="py-2.5 px-2 rounded-xl text-xs font-bold uppercase tracking-wide flex flex-col items-center gap-1.5 transition-all"
                        style={{
                          background: form.paymentMethod === opt.key ? ORANGE : '#1A1A1A',
                          border: `1px solid ${form.paymentMethod === opt.key ? ORANGE : '#2A2A2A'}`,
                          color: form.paymentMethod === opt.key ? '#000' : '#888',
                        }}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {/* Bank transfer details */}
                  {form.paymentMethod === 'Transferencia' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="rounded-xl p-4 space-y-3 overflow-hidden"
                      style={{ background: '#1A1A1A', border: `1px solid ${GOLD}44` }}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                        🏦 Datos bancarios
                      </p>
                      {[
                        { label: 'Banco',    value: COMPANY_INFO.bankTransfer.bank },
                        { label: 'Titular',  value: COMPANY_INFO.bankTransfer.accountHolder },
                        { label: 'CLABE',    value: COMPANY_INFO.bankTransfer.clabe,         key: 'clabe' },
                        { label: 'Tarjeta',  value: COMPANY_INFO.bankTransfer.accountNumber, key: 'cuenta' },
                      ].filter(row => row.value).map(row => (
                        <div key={row.label} className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>{row.label}</p>
                            <p className="text-sm font-mono text-white truncate">{row.value}</p>
                          </div>
                          {row.key && (
                            <button
                              onClick={() => handleCopy(row.value, row.key!)}
                              className="shrink-0 p-1.5 rounded-lg transition-colors"
                              style={{ background: '#252525' }}
                            >
                              {copied === row.key
                                ? <Check size={14} style={{ color: GOLD }} />
                                : <Copy size={14} style={{ color: '#666' }} />}
                            </button>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Notes & Coupon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ORANGE }}>Cupón de Descuento</p>
                    <input
                      placeholder="Ej. PROMO10"
                      value={form.coupon}
                      onChange={e => setForm(f => ({ ...f, coupon: e.target.value }))}
                      className="w-full py-3 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-600"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                    />
                    {form.coupon.toUpperCase() === 'PROMO10' && (
                      <p className="text-[10px] text-[#25D366] mt-1">¡Cupón del 10% aplicado!</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: ORANGE }}>Notas (opcional)</p>
                    <textarea
                      placeholder="Sin cebolla, extra picante…"
                      value={form.notes}
                      onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                      rows={2}
                      className="w-full py-3 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-600 resize-none"
                      style={{ background: '#1A1A1A', border: '1px solid #2A2A2A' }}
                    />
                  </div>
                </div>

              </div>

              {/* CTA */}
              <div className="p-5 border-t shrink-0" style={{ borderColor: '#222' }}>
                <button
                  onClick={handleCheckout}
                  disabled={!form.name || !form.phone || !form.deliveryMethod || !form.paymentMethod}
                  className="w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                  style={{ background: '#25D366', color: '#000' }}
                >
                  <MessageCircle size={20} className="fill-black" />
                  Finalizar pedido vía WhatsApp
                </button>
                <p className="text-center text-[10px] mt-2" style={{ color: '#444' }}>
                  Se abrirá WhatsApp con tu pedido listo para enviar
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL — FILTERS
      ══════════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex justify-start"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)' }}
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-xs h-full flex flex-col shadow-2xl overflow-y-auto"
              style={{ background: '#0A0A0A', borderRight: `1px solid ${ORANGE}33` }}
            >
              <div className="p-5 flex justify-between items-center border-b sticky top-0 bg-[#0A0A0A] z-10" style={{ borderColor: '#222' }}>
                <h2 className="font-extrabold text-xl text-white">Filtros</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <div className="p-5 space-y-8">
                {/* Badges / Destacados */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#888' }}>Destacados</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Popular', 'Especial', 'Nuevo'].map(badge => {
                      const isActive = activeBadgeFilter === badge;
                      return (
                        <button
                          key={badge}
                          onClick={() => setActiveBadgeFilter(isActive ? null : badge)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                          style={{
                            background: isActive ? `${ORANGE}22` : '#111',
                            border: `1px solid ${isActive ? ORANGE : '#222'}`,
                            color: isActive ? ORANGE : '#CCC'
                          }}
                        >
                          {badge === 'Popular' && '🔥 '}
                          {badge === 'Especial' && '⭐ '}
                          {badge === 'Nuevo' && '✨ '}
                          {badge}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categorías en cuadrícula */}
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#888' }}>Categorías</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: 'todo', name: 'Todo', icon: <LayoutGrid size={18} /> }, ...CATEGORIES].map(cat => {
                      const isActive = activeCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setActiveCategory(cat.id); setIsFilterOpen(false); }}
                          className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all"
                          style={{
                            background: isActive ? `${ORANGE}1A` : '#111',
                            border: `1px solid ${isActive ? ORANGE : '#222'}`,
                            color: isActive ? ORANGE : '#888'
                          }}
                        >
                          <span style={{ color: isActive ? ORANGE : '#888' }}>{cat.icon}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-center line-clamp-1">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
