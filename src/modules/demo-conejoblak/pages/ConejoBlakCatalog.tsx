import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, X, Plus, Minus, MessageCircle, Search,
  LayoutGrid, Flame, Phone, Copy, Check, MapPin, ChevronRight,
  Landmark, CreditCard, Banknote, SlidersHorizontal, Heart, Share2,
} from 'lucide-react';
import { CATEGORIES, PRODUCTS, COMPANY_INFO, Product } from '../constants';

interface CartItem extends Product {
  quantity: number;
}

export default function ConejoBlakCatalog() {
  const [activeCategory, setActiveCategory] = useState('todo');
  const [searchQuery, setSearchQuery]       = useState('');
  const [cart, setCart]                     = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen]         = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('conejoblak_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('conejoblak_favorites', JSON.stringify(favorites));
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
    const shareText = `¡Checa este antojo en Conejo Blak!: ${product.name} - $${product.price} MXN`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Conejo Blak",
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
  });

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryCost = form.deliveryMethod === 'Envío a domicilio' ? 50 : 0;
  const finalTotal = cartTotal + deliveryCost;

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const found = prev.find(i => i.id === product.id);
      if (found) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => {
      const found = prev.find(i => i.id === cartId);
      if (found && found.quantity > 1) return prev.map(i => i.id === cartId ? { ...i, quantity: i.quantity - 1 } : i);
      return prev.filter(i => i.id !== cartId);
    });
  };

  const handleCheckout = () => {
    const { name, phone, deliveryMethod, address, paymentMethod, notes } = form;
    let msg = `🔥 *NUEVO PEDIDO — ${COMPANY_INFO.name}* 🔥\n\n`;
    msg += `*DATOS DEL CLIENTE*\n`;
    msg += `👤 Nombre: ${name}\n`;
    msg += `📱 Teléfono: ${phone}\n`;
    msg += `🚚 Entrega: ${deliveryMethod || '—'}\n`;
    if (deliveryMethod === 'Envío a domicilio' && address) msg += `📍 Dirección: ${address}\n`;
    msg += `💳 Pago: ${paymentMethod || '—'}\n`;
    if (notes) msg += `📝 Notas: ${notes}\n`;
    msg += `\n*PEDIDO*\n`;
    cart.forEach(i => { msg += `▪ ${i.quantity}x ${i.name} — $${(i.price * i.quantity).toFixed(2)}\n`; });
    
    if (deliveryCost > 0) msg += `▪ Envío a domicilio — $${deliveryCost.toFixed(2)}\n`;

    msg += `\n💰 *TOTAL FINAL: $${finalTotal.toFixed(2)}*\n\n¡Gracias por tu compra!`;
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');

    // Cerrar modal y limpiar carrito/formulario
    setIsCheckoutOpen(false);
    setCart([]);
    setForm({
      name: '',
      phone: '',
      deliveryMethod: '',
      address: '',
      paymentMethod: '',
      notes: '',
    });
  };

  const visibleProducts = useMemo(() => PRODUCTS.filter(p => {
    const matchCat = 
      activeCategory === 'todo' ? true : 
      activeCategory === 'favoritos' ? favorites.includes(p.id) : 
      p.category === activeCategory;
      
    const q           = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
    
    return matchCat && matchSearch;
  }), [activeCategory, searchQuery, favorites]);

  const NEON_PINK = '#ff007f';
  const NEON_CYAN = '#00e5ff';
  const NEON_GOLD = '#ffd700';

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(to bottom, #0d0b14, #050508)', color: '#ffffff' }}>
      {/* ── BACKGROUND STARS/NOISE ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b shadow-lg"
        style={{ background: 'rgba(13, 11, 20, 0.9)', backdropFilter: 'blur(10px)', borderColor: `${NEON_PINK}33`, boxShadow: `0 0 15px ${NEON_PINK}22` }}
      >
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="shrink-0 text-center md:text-left">
            <h1 className="text-3xl font-black uppercase tracking-widest" style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}` }}>
              {COMPANY_INFO.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto md:flex-1 justify-center md:justify-end max-w-sm mx-auto md:mx-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
              <input
                type="text"
                placeholder="Buscar…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-4 text-sm rounded-full outline-none transition-all"
                style={{ background: 'rgba(0, 229, 255, 0.05)', border: `1px solid ${NEON_CYAN}55`, color: '#FFF', boxShadow: `inset 0 0 5px ${NEON_CYAN}22` }}
              />
            </div>
            
            <button
              onClick={() => setActiveCategory(activeCategory === 'favoritos' ? 'todo' : 'favoritos')}
              className="relative p-2.5 rounded-full transition-colors shrink-0"
              style={{ 
                background: activeCategory === 'favoritos' ? `${NEON_PINK}22` : 'rgba(255, 0, 127, 0.05)', 
                border: `1px solid ${NEON_PINK}55`,
                boxShadow: activeCategory === 'favoritos' ? `0 0 10px ${NEON_PINK}55` : 'none'
              }}
            >
              <Heart size={20} style={{ color: NEON_PINK }} fill={activeCategory === 'favoritos' ? NEON_PINK : 'none'} />
              {favorites.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg"
                  style={{ background: NEON_PINK, color: '#FFF', boxShadow: `0 0 8px ${NEON_PINK}` }}
                >
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full transition-colors shrink-0"
              style={{ background: 'rgba(0, 229, 255, 0.05)', border: `1px solid ${NEON_CYAN}55` }}
            >
              <ShoppingBag size={20} style={{ color: NEON_CYAN }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg"
                  style={{ background: NEON_CYAN, color: '#000', boxShadow: `0 0 8px ${NEON_CYAN}` }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden relative z-10" style={{ borderTop: `1px solid ${NEON_CYAN}22` }}>
          <div className="flex px-4 py-3 gap-3 w-max items-center">
            {[
              { id: 'todo', name: 'Todo', icon: <LayoutGrid size={18} /> },
              ...CATEGORIES
            ].map(cat => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all relative shrink-0"
                  style={{
                    background: active ? `${NEON_CYAN}22` : 'transparent',
                    border: `1px solid ${active ? NEON_CYAN : 'rgba(255,255,255,0.1)'}`,
                    color: active ? NEON_CYAN : '#888',
                    boxShadow: active ? `0 0 10px ${NEON_CYAN}44` : 'none'
                  }}
                >
                  <span style={{ color: active ? NEON_CYAN : '#888' }}>{cat.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>



      {/* ── PRODUCT GRID ───────────────────────────────────────────────────── */}
      <main className="container mx-auto px-4 py-8 pb-28 relative z-10">
        {visibleProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search size={48} className="mx-auto mb-3 opacity-20" />
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 flex flex-col"
                  style={{
                    background: 'rgba(20, 15, 30, 0.6)',
                    backdropFilter: 'blur(5px)',
                    border: `1px solid ${NEON_PINK}44`,
                    boxShadow: `0 0 20px rgba(255, 0, 127, 0.1)`,
                  }}
                  whileHover={{
                    boxShadow: `0 0 25px rgba(255, 0, 127, 0.4)`,
                    borderColor: NEON_PINK,
                    transform: 'translateY(-2px)'
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-black text-lg uppercase tracking-wide leading-tight" style={{ color: '#FFF' }}>
                         {product.name}
                       </h3>
                       <div className="flex gap-2">
                         <button 
                           onClick={(e) => toggleFavorite(product.id, e)}
                           className="transition-transform hover:scale-110"
                         >
                           <Heart size={20} fill={favorites.includes(product.id) ? NEON_PINK : 'none'} color={favorites.includes(product.id) ? NEON_PINK : '#666'} />
                         </button>
                       </div>
                    </div>
                    
                    <p className="font-black text-xl mb-3" style={{ color: NEON_GOLD, textShadow: `0 0 8px ${NEON_GOLD}66` }}>
                      ${product.price.toFixed(2)}
                    </p>

                    <p className="text-xs leading-relaxed text-gray-400 mb-4 flex-1">
                      {product.description}
                    </p>

                    <button
                      onClick={e => addToCart(product, e)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-auto"
                      style={{
                        background: `linear-gradient(45deg, ${NEON_PINK}, ${NEON_CYAN})`,
                        color: '#FFF',
                        boxShadow: `0 4px 15px rgba(255,0,127,0.4)`
                      }}
                    >
                      <Plus size={16} />
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
      <footer className="border-t py-10 relative z-10" style={{ background: 'rgba(5, 5, 8, 0.9)', borderColor: `${NEON_CYAN}33` }}>
        <div className="container mx-auto px-4 max-w-md md:max-w-3xl text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-widest mb-3" style={{ color: NEON_PINK, textShadow: `0 0 10px ${NEON_PINK}` }}>
                {COMPANY_INFO.name}
              </h1>
              <p className="text-sm text-gray-400 mb-4">
                El mejor sabor urbano con estilo cyberpunk.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href={`https://wa.me/${COMPANY_INFO.whatsapp}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: NEON_CYAN }}>
                  <MessageCircle size={18} /> {COMPANY_INFO.whatsapp}
                </a>
                <a href={`tel:${COMPANY_INFO.phone}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors" style={{ color: NEON_CYAN }}>
                  <Phone size={18} /> {COMPANY_INFO.phone}
                </a>
              </div>
            </div>
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
                background: '#110e1a',
                border: `1px solid ${NEON_PINK}88`,
                boxShadow: `0 0 30px ${NEON_PINK}44`
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                   <h2 className="text-2xl font-black uppercase tracking-wide text-white leading-tight" style={{ textShadow: `0 0 10px rgba(255,255,255,0.5)` }}>
                     {selectedProduct.name}
                   </h2>
                   <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 rounded-full transition-colors bg-white/10 hover:bg-white/20"
                   >
                     <X size={18} className="text-white" />
                   </button>
                </div>
                
                <p className="font-black text-2xl mb-4" style={{ color: NEON_GOLD, textShadow: `0 0 10px ${NEON_GOLD}66` }}>
                  ${selectedProduct.price.toFixed(2)}
                </p>

                <p className="text-sm leading-relaxed mb-6 text-gray-300">
                  {selectedProduct.description}
                </p>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  style={{ background: `linear-gradient(45deg, ${NEON_PINK}, ${NEON_CYAN})`, color: '#FFF', boxShadow: `0 4px 20px rgba(0, 229, 255, 0.4)` }}
                >
                  <Plus size={20} />
                  Añadir al carrito
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
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm h-full flex flex-col shadow-2xl"
              style={{ background: '#0a0811', borderLeft: `1px solid ${NEON_CYAN}55`, boxShadow: `-5px 0 30px ${NEON_CYAN}22` }}
            >
              <div className="p-5 flex justify-between items-center border-b" style={{ borderColor: `${NEON_CYAN}33` }}>
                <h2 className="font-bold text-lg flex items-center gap-2 text-white">
                  <ShoppingBag style={{ color: NEON_CYAN }} />
                  Tu Pedido
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3 text-gray-500">
                    <ShoppingBag size={44} className="opacity-20" />
                    <p className="text-sm">Tu carrito está vacío</p>
                  </div>
                ) : cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${NEON_PINK}33` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white uppercase tracking-wide line-clamp-2 leading-snug">{item.name}</p>
                      <p className="text-sm font-black mt-1" style={{ color: NEON_GOLD }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="text-base font-bold text-white w-6 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="p-5 border-t" style={{ borderColor: `${NEON_CYAN}33` }}>
                  <div className="flex justify-between mb-5">
                    <span className="text-gray-300 text-sm">Total</span>
                    <span className="text-xl font-black" style={{ color: NEON_GOLD, textShadow: `0 0 10px ${NEON_GOLD}66` }}>${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                    className="w-full py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(45deg, ${NEON_PINK}, ${NEON_CYAN})`, color: '#FFF', boxShadow: `0 4px 20px ${NEON_PINK}66` }}
                  >
                    <ChevronRight size={20} />
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
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
              style={{ background: '#0a0811', border: `1px solid ${NEON_PINK}55`, boxShadow: `0 0 40px ${NEON_PINK}33` }}
            >
              <div className="p-5 flex justify-between items-center border-b shrink-0" style={{ borderColor: `${NEON_PINK}33` }}>
                <h2 className="font-black text-xl text-white flex items-center gap-2 uppercase tracking-wide">
                  <Flame style={{ color: NEON_PINK }} size={24} />
                  Finalizar Pedido
                </h2>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(0, 229, 255, 0.05)', border: `1px solid ${NEON_CYAN}33` }}>
                  <p className="text-xs font-black uppercase tracking-wider mb-3" style={{ color: NEON_CYAN }}>Resumen</p>
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between text-sm text-gray-300">
                      <span>{i.quantity}x {i.name}</span>
                      <span className="font-bold text-white">${(i.price * i.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t mt-3 pt-3 space-y-2" style={{ borderColor: `${NEON_CYAN}33` }}>
                    {deliveryCost > 0 && (
                      <div className="flex justify-between text-sm text-gray-300">
                        <span>Envío a domicilio</span>
                        <span className="font-bold text-white">+${deliveryCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-lg mt-2">
                      <span className="text-white">Total Final</span>
                      <span style={{ color: NEON_GOLD, textShadow: `0 0 10px ${NEON_GOLD}66` }}>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: NEON_PINK }}>Datos de contacto</p>
                  <input
                    placeholder="Nombre completo"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full py-3.5 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-500 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${NEON_PINK}33` }}
                  />
                  <input
                    placeholder="Teléfono / WhatsApp"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full py-3.5 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-500 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${NEON_PINK}33` }}
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: NEON_PINK }}>Método de entrega</p>
                  <div className="grid grid-cols-2 gap-3">
                    {['Para llevar', 'Envío a domicilio'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setForm(f => ({ ...f, deliveryMethod: opt }))}
                        className="py-3 rounded-xl text-xs font-black uppercase tracking-wide transition-all"
                        style={{
                          background: form.deliveryMethod === opt ? `${NEON_PINK}22` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${form.deliveryMethod === opt ? NEON_PINK : 'rgba(255,0,127,0.2)'}`,
                          color: form.deliveryMethod === opt ? NEON_PINK : '#888',
                          boxShadow: form.deliveryMethod === opt ? `0 0 15px ${NEON_PINK}33` : 'none'
                        }}
                      >
                        {opt === 'Para llevar' ? '🛍️ Para llevar' : '🚚 A domicilio'}
                      </button>
                    ))}
                  </div>
                  {form.deliveryMethod === 'Envío a domicilio' && (
                    <div className="relative mt-2">
                      <MapPin size={16} className="absolute left-4 top-3.5" style={{ color: NEON_PINK }} />
                      <input
                        placeholder="Dirección de entrega"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                        className="w-full py-3.5 pl-11 pr-4 rounded-xl text-sm outline-none text-white placeholder-gray-500 transition-colors"
                        style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${NEON_PINK}33` }}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: NEON_PINK }}>Método de pago</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'Efectivo',       label: 'Efectivo',      icon: <Banknote size={18} /> },
                      { key: 'Transferencia',  label: 'Transferencia', icon: <Landmark size={18} /> },
                      { key: 'Tarjeta',        label: 'Tarjeta',       icon: <CreditCard size={18} /> },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setForm(f => ({ ...f, paymentMethod: opt.key }))}
                        className="py-3 px-2 rounded-xl text-xs font-black uppercase tracking-wide flex flex-col items-center gap-2 transition-all"
                        style={{
                          background: form.paymentMethod === opt.key ? `${NEON_CYAN}22` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${form.paymentMethod === opt.key ? NEON_CYAN : 'rgba(0,229,255,0.2)'}`,
                          color: form.paymentMethod === opt.key ? NEON_CYAN : '#888',
                          boxShadow: form.paymentMethod === opt.key ? `0 0 15px ${NEON_CYAN}33` : 'none'
                        }}
                      >
                        {opt.icon}
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {form.paymentMethod === 'Transferencia' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="p-4 rounded-xl space-y-2 text-sm"
                          style={{
                            background: 'rgba(0, 229, 255, 0.05)',
                            border: `1px dashed ${NEON_CYAN}66`,
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Banco / Destino:</span>
                            <span className="font-bold text-white">Mercado Pago</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">CLABE:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-white" style={{ textShadow: `0 0 5px ${NEON_CYAN}66` }}>
                                722969020213105654
                              </span>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText('722969020213105654');
                                  alert('CLABE copiada al portapapeles');
                                }}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Titular:</span>
                            <span className="font-bold text-white uppercase tracking-wider">Ricardo Aguilar</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2 text-center pt-2 border-t" style={{ borderColor: `${NEON_CYAN}33` }}>
                            * Por favor envía el comprobante por WhatsApp al finalizar tu pedido.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black uppercase tracking-wider" style={{ color: NEON_PINK }}>Notas adicionales</p>
                  <textarea
                    placeholder="Ejem: Sin cebolla, mucho chile..."
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full py-3 px-4 rounded-xl text-sm outline-none text-white placeholder-gray-500 transition-colors min-h-[80px]"
                    style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${NEON_PINK}33` }}
                  />
                </div>
              </div>

              <div className="p-5 border-t shrink-0" style={{ borderColor: `${NEON_PINK}33` }}>
                <button
                  onClick={handleCheckout}
                  disabled={!form.name || !form.phone || !form.deliveryMethod || !form.paymentMethod || (form.deliveryMethod === 'Envío a domicilio' && !form.address)}
                  className="w-full py-4 rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ background: `linear-gradient(45deg, ${NEON_PINK}, ${NEON_CYAN})`, color: '#FFF', boxShadow: `0 4px 25px rgba(255,0,127,0.5)` }}
                >
                  <MessageCircle size={20} />
                  Enviar por WhatsApp
                </button>
                <p className="text-center text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest">
                  Serás redirigido a WhatsApp
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
