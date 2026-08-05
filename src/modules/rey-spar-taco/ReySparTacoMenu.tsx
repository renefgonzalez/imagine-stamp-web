import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Plus, Minus, Trash2, MapPin, 
  MessageCircle, Clock, Info, ChevronRight, X, ChevronDown, CheckCircle2, ChevronUp
} from 'lucide-react';

const BUSINESS = "REY SPAR-TACO";
const WHATSAPP = "525650469993"; // Placeholder
const LOCATION = "Ubicación Pendiente";

type Category = 'tacos' | 'servido' | 'alambres' | 'gringas' | 'tortas' | 'extras' | 'bebidas' | 'cervezas';

interface LocalProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: Category;
  image?: string;
}

interface CartItem extends LocalProduct {
  cartId: string;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  address: string;
  notes: string;
}

const PRODUCTS: LocalProduct[] = [
  // ── CATEGORIA 1: TACOS ──
  { id: 't1', name: 'Pastor', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: 't2', name: 'Suadero', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 't3', name: 'Campechano', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80' },
  { id: 't4', name: 'Longaniza', price: 10, category: 'tacos', image: 'https://images.unsplash.com/photo-1624300602073-8a3014c2c544?w=400&q=80' },
  { id: 't5', name: 'Tripa', price: 13, category: 'tacos', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80' },

  // ── CATEGORIA 2: TACOS SERVIDO ──
  { id: 'ts1', name: 'Pastor (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 'ts2', name: 'Campechano (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: 'ts3', name: 'Longaniza (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80' },
  { id: 'ts4', name: 'Suadero (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?w=400&q=80' },
  { id: 'ts5', name: 'Chuleta (Servido)', price: 90, category: 'servido', image: 'https://images.unsplash.com/photo-1624300602073-8a3014c2c544?w=400&q=80' },
  { id: 'ts6', name: 'Bistec (Servido)', price: 100, category: 'servido', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80' },
  { id: 'ts7', name: 'Costilla (Servido)', price: 100, category: 'servido', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
  { id: 'ts8', name: 'Arrachera (Servido)', price: 110, category: 'servido', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80' },

  // ── CATEGORIA 3: ALAMBRES ──
  { id: 'a1', name: 'Pastor', description: 'cebolla, morron, tocino, jamon y queso', price: 90, category: 'alambres', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80' },
  { id: 'a2', name: 'Campechano', description: 'pastor, cebolla, tocino, jamon, chuleta, queso y morron', price: 90, category: 'alambres' },
  { id: 'a3', name: 'Mexicano', description: 'pastor, tocino, jamon, chuleta, queso, cebolla, morron, jitomate y jalapeño', price: 90, category: 'alambres' },
  { id: 'a4', name: 'Hawaiano', description: 'pastor, cebolla, morron, tocino, jamon, chuleta, queso y piña', price: 90, category: 'alambres' },
  { id: 'a5', name: 'Sabores', description: 'pastor, tocino, jamon, chuleta, longaniza, queso, cebolla y morron', price: 90, category: 'alambres' },
  { id: 'a6', name: 'Vegetariano', description: 'nopal, cebolla, morron, champiñon, jitomate, queso, aguacate, y elote', price: 90, category: 'alambres', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
  { id: 'a7', name: 'Bistec', description: 'cebolla, morron, tocino, jamon y queso', price: 140, category: 'alambres' },
  { id: 'a8', name: 'Spar-Taco', description: 'milanesa, bistec, elote, chuleta, cebolla, morron, tocino, jamon y queso', price: 140, category: 'alambres' },
  { id: 'a9', name: 'Costilla', description: 'costilla, cebolla, morron, tocino, jamon y queso', price: 140, category: 'alambres' },
  { id: 'a10', name: 'Chuleta', description: 'costilla, cebolla, morron, tocino, jamon y queso', price: 140, category: 'alambres' },
  { id: 'a11', name: 'Campesino', description: 'nopal, cebolla, bistec, longaniza, y queso', price: 140, category: 'alambres' },
  { id: 'a12', name: 'Fortachon', description: 'chuleta, chorizo, tocino, jamon, y queso', price: 140, category: 'alambres' },
  { id: 'a13', name: '¿Que me ves?', description: 'pastor, bistec, piña y queso', price: 140, category: 'alambres' },
  { id: 'a14', name: 'Arrachera', description: 'cebolla, morron, tocino, jamon y queso', price: 150, category: 'alambres' },

  // ── CATEGORIA 4: GRINGAS ──
  { id: 'g1', name: 'Sincronizadas', price: 40, category: 'gringas', image: 'https://images.unsplash.com/photo-1581075678853-a55e09f584e0?w=400&q=80' },
  { id: 'g2', name: 'Pastor', price: 60, category: 'gringas' },
  { id: 'g3', name: 'Suadero', price: 60, category: 'gringas' },
  { id: 'g4', name: 'Chuleta', price: 60, category: 'gringas' },
  { id: 'g5', name: 'Bistec', price: 80, category: 'gringas' },
  { id: 'g6', name: 'Costilla', price: 80, category: 'gringas' },
  { id: 'g7', name: 'Arrachera', price: 90, category: 'gringas' },

  // ── CATEGORIA 5: TORTAS ──
  { id: 'to1', name: 'Pastor', price: 80, category: 'tortas', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=80' },
  { id: 'to2', name: 'Campechana', price: 80, category: 'tortas' },
  { id: 'to3', name: 'Hawaiana', price: 80, category: 'tortas' },
  { id: 'to4', name: 'Cubana', price: 80, category: 'tortas' },
  { id: 'to5', name: 'Choriqueso', price: 80, category: 'tortas' },
  { id: 'to6', name: 'Chuleta', price: 80, category: 'tortas' },
  { id: 'to7', name: 'Milanesa', price: 90, category: 'tortas' },
  { id: 'to8', name: 'Suadero', price: 90, category: 'tortas' },
  { id: 'to9', name: 'Bistec', price: 90, category: 'tortas' },
  { id: 'to10', name: 'Costilla', price: 90, category: 'tortas' },
  { id: 'to11', name: 'Arrachera', price: 105, category: 'tortas' },

  // ── CATEGORIA 6: EXTRAS ──
  { id: 'e1', name: 'Orden tortilla de maiz', price: 15, category: 'extras' },
  { id: 'e2', name: 'Orden tortilla de harina', price: 15, category: 'extras' },
  { id: 'e3', name: 'Nopales', price: 15, category: 'extras' },
  { id: 'e4', name: 'Aguacate', price: 15, category: 'extras' },
  { id: 'e5', name: 'Salsa', price: 10, category: 'extras' },
  { id: 'e6', name: 'Queso', price: 15, category: 'extras' },
  { id: 'e7', name: 'Cebollitas', price: 15, category: 'extras' },

  // ── CATEGORIA 7: BEBIDAS ──
  { id: 'b1', name: 'Agua de sabor (jamaica y horchata)', price: 35, category: 'bebidas', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80' },
  { id: 'b2', name: 'Coca-Cola 600 mil.', price: 35, category: 'bebidas' },
  { id: 'b3', name: 'Refresco 500 mil.', description: 'Coca, fanta, fresca, sprite, sidral', price: 27, category: 'bebidas' },
  { id: 'b4', name: 'Jugo del valle 600 mil', description: 'citrico y guayaba', price: 27, category: 'bebidas' },
  { id: 'b5', name: 'Jugo del valle 355 mil', description: 'Mango', price: 27, category: 'bebidas' },
  { id: 'b6', name: 'Agua Natural', price: 20, category: 'bebidas' },

  // ── CATEGORIA 8: CERVEZAS ──
  { id: 'c1', name: 'Corona', price: 35, category: 'cervezas', image: 'https://images.unsplash.com/photo-1614316982247-5d2bc5038c82?w=400&q=80' },
  { id: 'c2', name: 'Victoria', price: 35, category: 'cervezas' },
  { id: 'c3', name: 'Corona "o"', price: 35, category: 'cervezas' },
  { id: 'c4', name: 'Modelo Negra', price: 40, category: 'cervezas' },
  { id: 'c5', name: 'Modelo Especial', price: 40, category: 'cervezas' },
  { id: 'c6', name: 'Ultra', price: 40, category: 'cervezas' },
  { id: 'c7', name: 'Corona Mega', price: 90, category: 'cervezas' },
  { id: 'c8', name: 'Victoria Mega', price: 90, category: 'cervezas' },
  { id: 'c9', name: 'Vaso Preparado', price: 15, category: 'cervezas' },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'tacos', label: 'Tacos' },
  { id: 'servido', label: 'Tacos Servido' },
  { id: 'alambres', label: 'Alambres' },
  { id: 'gringas', label: 'Gringas' },
  { id: 'tortas', label: 'Tortas' },
  { id: 'extras', label: 'Extras' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'cervezas', label: 'Cervezas' },
];

export default function ReySparTacoMenu() {
  const [activeCategory, setActiveCategory] = useState<Category>('tacos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1); // 1 = Review, 2 = Customer Info
  const [cartToast, setCartToast] = useState<LocalProduct | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    document.title = "Rey Spar-Taco | Menú";
    return () => { document.title = 'IMAGINE & STAMP'; };
  }, []);

  // ── Cart operations ──
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: LocalProduct) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId: Date.now().toString(), quantity: 1 }];
    });
    setCartToast(product);
    setTimeout(() => setCartToast(null), 2500);
  }, []);

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerInfo.name || !customerInfo.address) {
      alert("Por favor completa tu nombre y dirección");
      return;
    }

    const itemsText = cart.map((item, i) =>
      `${i + 1}. *${item.name}* x${item.quantity} — $${item.price * item.quantity}`
    ).join('\n');

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const message = `🌮 *PEDIDO REY SPAR-TACO* 🌮\n\n*Cliente:* ${customerInfo.name}\n*Dirección:* ${customerInfo.address}\n\n*Mi Pedido:*\n${itemsText}\n\n*Total a pagar: $${total} MXN*\n\n*Notas:* ${customerInfo.notes || 'Ninguna'}`;

    window.location.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
  };

  // ── Render Helpers ──
  const renderProducts = (category: Category) => {
    const items = PRODUCTS.filter(p => p.category === category);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
        {items.map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md border border-orange-500/10 overflow-hidden flex flex-row transition-transform hover:-translate-y-1">
            {product.image && (
              <div className="w-1/3 min-w-[120px] max-w-[140px] shrink-0 bg-orange-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 flex flex-col justify-between flex-1">
              <div>
                <h4 className="text-green-700 font-bold text-lg leading-tight mb-1">{product.name}</h4>
                {product.description && (
                  <p className="text-xs text-stone-500 leading-snug mb-2">{product.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="font-black text-orange-500 text-lg">${product.price}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-green-700 hover:bg-green-800 text-white p-2 rounded-lg shadow-md transition-colors"
                  aria-label="Agregar"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-24">
      {/* ══════════ HERO SECTION ══════════ */}
      <section className="relative w-full h-[30vh] min-h-[250px] overflow-hidden flex flex-col justify-center items-center text-center">
        <img 
          src="https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=1200&q=80" 
          alt="Tacos al pastor" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-6 w-full max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black text-orange-500 uppercase tracking-tighter drop-shadow-lg mb-2">
            REY SPAR-TACO
          </h1>
          <p className="text-white text-lg md:text-xl font-medium italic drop-shadow-md mb-6">
            "Para chuparse los dedos"
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="flex items-center gap-1.5 bg-green-700/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold">
              <Clock size={14} /> 14:00 - 23:00 hrs
            </span>
            <span className="flex items-center gap-1.5 bg-green-700/80 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold">
              <MapPin size={14} /> {LOCATION}
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ NAVEGACIÓN CATEGORÍAS ══════════ */}
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-orange-500/20">
        <div className="max-w-4xl mx-auto flex overflow-x-auto hide-scrollbar px-2 py-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'bg-stone-100 text-stone-500 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══════════ CONTENIDO MENÚ ══════════ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-black text-green-700 uppercase mb-6 flex items-center gap-2">
              <span className="w-6 h-1 bg-orange-500 rounded-full" />
              {CATEGORIES.find(c => c.id === activeCategory)?.label}
            </h2>
            {renderProducts(activeCategory)}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ══════════ BOTÓN FLOTANTE CARRITO ══════════ */}
      <AnimatePresence>
        {cartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="font-bold">Ver Mi Orden (${cartTotal})</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ══════════ DRAWER / MODAL DEL CARRITO ══════════ */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-stone-50 h-full shadow-2xl flex flex-col"
            >
              <div className="p-4 bg-white border-b border-orange-500/10 flex items-center justify-between shrink-0">
                <h3 className="font-black text-green-700 text-xl flex items-center gap-2">
                  <ShoppingCart size={24} className="text-orange-500" /> Mi Orden
                </h3>
                <button onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }} className="p-2 bg-stone-100 rounded-full text-stone-500 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4">
                    <ShoppingCart size={64} className="opacity-20" />
                    <p className="font-bold text-lg">Tu orden está vacía</p>
                  </div>
                ) : checkoutStep === 1 ? (
                  // PASO 1: REVISAR PRODUCTOS
                  <div className="flex flex-col gap-4">
                    {cart.map(item => (
                      <div key={item.cartId} className="bg-white p-3 rounded-xl shadow-sm border border-orange-500/10 flex gap-3">
                        <div className="flex-1">
                          <h5 className="font-bold text-sm text-green-700 leading-tight">{item.name}</h5>
                          <p className="text-xs text-stone-500 font-bold mt-1">${item.price}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => removeFromCart(item.cartId)} className="text-stone-300 hover:text-red-500 mb-2">
                            <Trash2 size={16} />
                          </button>
                          <div className="flex items-center gap-3 bg-stone-50 rounded-lg p-1 border border-stone-200">
                            <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 text-stone-500 hover:text-orange-500"><Minus size={14} /></button>
                            <span className="font-bold text-sm min-w-[20px] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 text-stone-500 hover:text-green-700"><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // PASO 2: DATOS DEL CLIENTE
                  <form id="checkoutForm" onSubmit={handleSendWhatsApp} className="flex flex-col gap-4">
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl mb-2">
                      <p className="text-orange-800 text-xs font-bold uppercase tracking-wider mb-1">Casi listo</p>
                      <p className="text-orange-600/80 text-sm">Déjanos tus datos para procesar tu orden.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Nombre Completo *</label>
                      <input required type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all" placeholder="Ej. Juan Pérez" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Dirección de Entrega *</label>
                      <textarea required value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} rows={2} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all resize-none" placeholder="Calle, Número, Colonia, Referencias..." />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Notas (Opcional)</label>
                      <textarea value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})} rows={2} className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-700 focus:ring-1 focus:ring-green-700 transition-all resize-none" placeholder="Sin cebolla, pagar con billete de 500, etc." />
                    </div>
                  </form>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 bg-white border-t border-orange-500/10 shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-stone-500 font-bold uppercase text-sm">Total</span>
                    <span className="text-2xl font-black text-orange-500">${cartTotal}</span>
                  </div>
                  
                  {checkoutStep === 1 ? (
                    <button 
                      onClick={() => setCheckoutStep(2)}
                      className="w-full py-4 bg-green-700 hover:bg-green-800 text-white rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      Continuar a tus datos <ChevronRight size={20} />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        type="button" onClick={() => setCheckoutStep(1)}
                        className="py-4 px-4 bg-stone-100 text-stone-600 rounded-xl font-bold hover:bg-stone-200 transition-colors"
                      >
                        Atrás
                      </button>
                      <button 
                        form="checkoutForm" type="submit"
                        className="flex-1 py-4 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={20} /> Enviar por WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════ TOAST: agregado al carrito ══════════ */}
      <AnimatePresence>
        {cartToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-sm"
          >
            <div className="bg-green-700 text-white rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-green-200">Agregado con éxito</p>
                <p className="text-sm font-bold truncate">{cartToast.name}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════ FOOTER (3 columnas) ══════════ */}
      <footer className="bg-stone-900 text-stone-400 py-12 mt-12 border-t-4 border-orange-500">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Ubicación */}
          <div>
            <h4 className="text-white font-black uppercase mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" /> Ubicación
            </h4>
            <p className="text-sm leading-relaxed">
              [DIRECCION_PLACEHOLDER]<br />
              Colonia Centro, CDMX.<br />
              CP 00000
            </p>
          </div>

          {/* Col 2: Contacto */}
          <div>
            <h4 className="text-white font-black uppercase mb-4 flex items-center gap-2">
              <MessageCircle size={18} className="text-green-500" /> Contacto
            </h4>
            <p className="text-sm leading-relaxed mb-4">
              ¿Tienes dudas o un pedido especial? Escríbenos por WhatsApp.
            </p>
            <a 
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/10 text-[#25D366] px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#25D366]/20 transition-colors"
            >
              +52 00 0000 0000
            </a>
          </div>

          {/* Col 3: Políticas y Horarios */}
          <div>
            <h4 className="text-white font-black uppercase mb-4 flex items-center gap-2">
              <Info size={18} className="text-orange-500" /> Horarios
            </h4>
            <ul className="text-sm space-y-2 mb-4">
              <li className="flex justify-between"><span>Lunes - Jueves</span> <span>14:00 - 23:00</span></li>
              <li className="flex justify-between"><span>Viernes - Sábado</span> <span>14:00 - 01:00</span></li>
              <li className="flex justify-between text-orange-500 font-bold"><span>Domingo</span> <span>Cerrado</span></li>
            </ul>
            <p className="text-xs text-stone-500 border-t border-stone-800 pt-4">
              © {new Date().getFullYear()} Rey Spar-Taco. Diseñado por IMAGINE & STAMP.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
