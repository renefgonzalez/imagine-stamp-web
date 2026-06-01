import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Search, X, ChevronRight, ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { CREPAS, Crepa } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { CrepaDetail } from './CrepaDetail';

export interface CartItem extends Crepa {
  cartId: string;
  quantity: number;
  extras: string[];
}

const WHATSAPP_NUMBER = '525650469993'; // Can be customized

const CATEGORIES = [
  { id: 'all', label: 'Todas', emoji: '🥞' },
  { id: 'dulces', label: 'Dulces', emoji: '🍫' },
  { id: 'saladas', label: 'Saladas', emoji: '🧀' },
];

export function CrepasCatalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<Crepa | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  
  // Computed values
  const filteredItems = useMemo(() => {
    let items = CREPAS;
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
  }, [activeCategory, searchQuery]);

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const getBaseQty = (id: string) => {
    return cart.filter(c => c.id === id).reduce((acc, i) => acc + i.quantity, 0);
  };

  const handleAddToCart = (crepa: Crepa, quantity: number, extras: string[]) => {
    const extrasList = crepa.category === 'dulces' 
      ? [ { name: 'Extra Nutella', price: 15 }, { name: 'Extra Fresas', price: 10 }, { name: 'Extra Bola de Helado', price: 20 } ]
      : [ { name: 'Extra Queso Fundido', price: 15 }, { name: 'Extra Pollo', price: 20 }, { name: 'Champiñones', price: 10 } ];
      
    const extrasTotal = extras.reduce((sum, extraName) => {
      const extra = extrasList.find(e => e.name === extraName);
      return sum + (extra?.price || 0);
    }, 0);

    const finalPrice = crepa.price + extrasTotal;
    const cartId = `${crepa.id}-${extras.join('-')}`;

    setCart(prev => {
      const existing = prev.find(c => c.cartId === cartId);
      if (existing) {
        return prev.map(c => c.cartId === cartId ? { ...c, quantity: c.quantity + quantity } : c);
      }
      return [...prev, { ...crepa, cartId, quantity, extras, price: finalPrice }];
    });
    setSelectedItem(null);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => {
      const index = prev.findIndex(c => c.id === id);
      if (index === -1) return prev;
      const newCart = [...prev];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) {
        newCart.splice(index, 1);
      }
      return newCart;
    });
  };

  const handleUpdateCartItem = (cartId: string, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(c => c.cartId === cartId ? { ...c, quantity: c.quantity + delta } : c);
      return newCart.filter(c => c.quantity > 0);
    });
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCart(prev => prev.filter(c => c.cartId !== cartId));
  };

  const handleCheckout = () => {
    const lines = cart
      .map(i => `  • ${i.name} x${i.quantity} — $${i.price * i.quantity} MXN ${i.extras.length > 0 ? `\n    (Extras: ${i.extras.join(', ')})` : ''}`)
      .join('\n');

    const name = customerName.trim() || 'Cliente';

    const message =
      `🥞 *Pedido en Crepas & Co*\n\n` +
      `Hola! Soy *${name}* y quiero ordenar:\n\n` +
      `${lines}\n\n` +
      `*Total: $${totalPrice} MXN*\n\n` +
      `_Pedido generado desde el menú digital de Imagine & Stamp_ ✨`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Reset after checkout
    setTimeout(() => {
      setCart([]);
      setCustomerName('');
      setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans relative">
      <title>Crepería | Menú Digital Premium</title>

      {/* ── HERO HEADER */}
      <header className="relative overflow-hidden bg-stone-900 min-h-[220px]">
        <div className="absolute -top-16 -right-16 w-60 h-60 rounded-full bg-amber-500/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-stone-500/10 blur-2xl" />

        <div className="relative z-10 px-5 pt-10 pb-8">
          <a
            href="/#/"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors mb-6 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Volver a Imagine & Stamp
          </a>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 shrink-0">
                  🥞
                </div>
                <div>
                  <h1 className="text-white text-3xl font-black leading-none tracking-tight">
                    Crepas & Co
                  </h1>
                  <p className="text-stone-400 text-xs mt-1 font-medium">
                    Arte en cada pliegue
                  </p>
                </div>
              </div>
            </div>
            
            {/* Header Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-3 rounded-2xl transition-all ${totalItems > 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30' : 'bg-white/10'}`}
            >
              <ShoppingCart size={20} className={totalItems > 0 ? 'text-white' : 'text-stone-400'} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-black border-2 border-amber-500">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── SEARCH BAR */}
      <div className="bg-stone-50 px-4 py-4 sticky top-0 z-30 border-b border-stone-200">
        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-stone-200">
          <Search size={18} className="text-stone-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar crepas, ingredientes..."
            className="bg-transparent border-none outline-none text-stone-900 text-sm w-full font-medium placeholder-stone-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1">
              <X size={16} className="text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {/* ── CATEGORY TABS */}
      <div className="bg-stone-50 px-4 pb-4 pt-2 overflow-x-auto flex gap-2 sticky top-[73px] z-20 border-b border-stone-200 hide-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
            className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* ── MENU GRID */}
      <main className="px-4 py-6 pb-32 max-w-lg mx-auto">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-bold text-lg">No encontramos crepas con "{searchQuery}"</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.04 }}
              >
                <ProductCard
                  crepa={item}
                  qty={getBaseQty(item.id)}
                  onAdd={() => setSelectedItem(item)}
                  onUpdateQty={handleUpdateQty}
                  onClick={() => setSelectedItem(item)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </main>

      {/* ── FLOATING CART BUTTON */}
      <AnimatePresence>
        {totalItems > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-4 right-4 z-40 max-w-lg mx-auto"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-stone-900 border-none rounded-2xl p-4 cursor-pointer flex items-center justify-between shadow-xl shadow-stone-900/30"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 rounded-xl px-3 py-1 text-white font-black text-sm">
                  {totalItems}
                </div>
                <span className="text-white font-bold text-base">Ver mi pedido</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg">
                  ${totalPrice} MXN
                </span>
                <ChevronRight size={20} className="text-stone-400" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <CrepaDetail 
            crepa={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onAddToCart={handleAddToCart}
          />
        )}
      </AnimatePresence>

      {/* ── CART SIDEBAR / MODAL ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-stone-50 z-50 flex flex-col shadow-2xl"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white">
                <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <ShoppingCart size={24} className="text-amber-500" />
                  Tu Pedido
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center text-stone-400 mt-10">
                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-medium">Tu carrito está vacío.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.cartId} className="flex gap-4">
                      <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden border border-stone-200">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-stone-900 leading-tight pr-2">{item.name}</h3>
                          <button 
                            onClick={() => handleRemoveCartItem(item.cartId)}
                            className="text-stone-400 hover:text-red-500 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-stone-500 text-xs mb-2">
                          {item.extras.length > 0 ? `Extras: ${item.extras.join(', ')}` : 'Sin extras'}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-black text-amber-600">
                            ${item.price * item.quantity}
                          </span>
                          
                          <div className="flex items-center bg-white border border-stone-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleUpdateCartItem(item.cartId, -1)}
                              className="p-1.5 text-stone-600 hover:bg-stone-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-stone-900 w-6 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateCartItem(item.cartId, 1)}
                              className="p-1.5 text-stone-600 hover:bg-stone-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              <div className="p-6 bg-white border-t border-stone-200">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-stone-500">
                    <span>Subtotal</span>
                    <span>${totalPrice} MXN</span>
                  </div>
                  <div className="flex justify-between font-black text-stone-900 text-xl border-t border-stone-100 pt-3">
                    <span>Total</span>
                    <span>${totalPrice} MXN</span>
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="¿Cuál es tu nombre?"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 transition-colors text-stone-900 font-medium"
                  />
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-amber-500/30 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Confirmar Pedido por WhatsApp
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
