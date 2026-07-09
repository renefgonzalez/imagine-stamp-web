import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, Trash2, Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = ['Todos', 'Ropa', 'Calzado', 'Belleza', 'Hogar', 'Accesorios'];

const PRODUCTS = [
  { id: 1, name: 'Playera Básica Algodón', description: 'Cómoda y fresca para el día a día.', price: 150.00, category: 'Ropa', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Tenis Deportivos Runner', description: 'Ligeros y con máxima amortiguación.', price: 650.00, category: 'Calzado', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Termo Acero Inoxidable 1L', description: 'Mantiene tu bebida fría por 24h o caliente por 12h.', price: 299.00, category: 'Hogar', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Set de Cosméticos Premium', description: 'Paleta de sombras, labial y rubor.', price: 450.00, category: 'Belleza', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Sombrilla Compacta', description: 'Resistente al viento, ideal para llevar en el bolso.', price: 120.00, category: 'Accesorios', image: 'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Kit Shampoo y Acondicionador', description: 'Cuidado profundo con extractos naturales.', price: 180.00, category: 'Belleza', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=300&q=80' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function MarketplusMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'Domicilio',
    address: '',
    paymentMethod: 'Efectivo',
    cashAmount: '',
  });

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    let message = `Hola, quiero hacer un pedido en Marketplus:\n\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total:* $${totalPrice.toFixed(2)}\n\n`;
    message += `*Datos del Cliente:*\nNombre: ${formData.name}\nEntrega: ${formData.deliveryMethod}\n`;
    if (formData.deliveryMethod === 'Domicilio') message += `Dirección: ${formData.address}\n`;
    message += `Pago: ${formData.paymentMethod}`;
    if (formData.paymentMethod === 'Efectivo' && formData.cashAmount) {
      message += ` (Pago con: $${formData.cashAmount})`;
    }

    window.open(`https://wa.me/525555555555?text=${encodeURIComponent(message)}`, '_blank');
    setCart([]);
    setFormData({
      name: '',
      phone: '',
      deliveryMethod: 'Domicilio',
      address: '',
      paymentMethod: 'Efectivo',
      cashAmount: '',
    });
    setIsCartOpen(false);
    setCartStep(1);
  };

  return (
    <div className="min-h-screen bg-[#0a1128] text-white font-sans pb-20">
      
      <header className="bg-[#101b3b] p-6 rounded-b-3xl shadow-2xl mb-6 border-b border-white/5">
        <div className="flex flex-col items-center justify-center mb-4">
          <h1 className="text-3xl font-black text-[#00ffff] mb-2 tracking-wider">MARKETPLUS</h1>
          <p className="text-gray-400 text-center text-sm">Tu estilo, nuestra pasión.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar productos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0a1128] text-white rounded-xl pl-12 pr-4 py-3 border border-white/10 focus:outline-none focus:border-[#00ffff] transition-colors" 
          />
        </div>
      </header>

      <div className="px-4 mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex gap-3 w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-[#00ffff] text-[#0a1128] shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                  : 'bg-[#101b3b] text-gray-300 border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="flex flex-row sm:flex-col bg-[#101b3b] rounded-2xl p-3 sm:p-4 border border-white/5 shadow-lg overflow-hidden group">
            <div className="w-24 h-24 sm:w-full sm:h-48 shrink-0 rounded-xl overflow-hidden mr-3 sm:mr-0 sm:mb-4 bg-[#0a1128]">
              {product.image && (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  loading="lazy" 
                />
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="text-white font-bold text-base mb-1 truncate sm:whitespace-normal">{product.name}</h3>
              <p className="text-gray-400 text-xs mb-2 line-clamp-2 sm:mb-4">{product.description}</p>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-[#00ffff] font-black text-lg">${product.price.toFixed(2)}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-[#ff0055] text-white font-bold px-4 py-2 rounded-xl text-sm shadow-[0_0_10px_rgba(255,0,85,0.4)] hover:bg-[#ff1a66] hover:scale-105 transition-all"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && <div className="col-span-full text-center py-12 text-gray-400">No encontramos productos.</div>}
      </div>

      <footer className="bg-[#101b3b] pt-12 pb-6 mt-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#00ffff] mb-4">MARKETPLUS</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                La mejor selección de artículos para ti. Calidad garantizada, envíos seguros y estilo inigualable.
              </p>
            </div>

            <div>
              <h3 className="text-[#ff0055] font-bold mb-4 uppercase text-sm tracking-wider">Contacto</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-center gap-2">📞 WhatsApp: 555 123 4567</li>
                <li className="flex items-center gap-2">📍 Envíos a todo el país</li>
                <li className="flex items-center gap-2">🕒 Lunes a Sábado</li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#ff0055] font-bold mb-4 uppercase text-sm tracking-wider">Síguenos</h3>
              <div className="flex gap-4 mb-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#0a1128] flex items-center justify-center text-gray-400 hover:text-[#00ffff] border border-white/5 transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#0a1128] flex items-center justify-center text-gray-400 hover:text-[#ff0055] border border-white/5 transition-all">
                  <Instagram size={20} />
                </a>
              </div>
              <div className="bg-[#0a1128] p-4 rounded-xl border border-white/5">
                <p className="text-xs text-[#00ffff] font-bold mb-1">🎉 PROMOCIONES</p>
                <p className="text-gray-400 text-xs">
                  Síguenos en nuestras redes sociales para cupones exclusivos.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 text-center text-xs text-gray-500 space-y-2">
            <p>© 2026 Marketplus. Todos los derechos reservados.</p>
            <p className="text-gray-400 font-bold uppercase tracking-widest mt-2">Diseñado por IMAGINE & STAMP.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="hover:text-[#00ffff]">Aviso de Privacidad</a>
              <span>|</span>
              <a href="#" className="hover:text-[#00ffff]">Términos de Servicio</a>
            </div>
            <div className="mt-4 flex justify-center">
              <span className="text-gray-600">🔒</span>
            </div>
          </div>
        </div>
      </footer>

      {totalItems > 0 && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 bg-[#ff0055] text-white p-4 rounded-full shadow-[0_0_20px_rgba(255,0,85,0.5)] flex items-center justify-center hover:scale-105 transition-all z-40">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-[#00ffff] text-[#0a1128] w-6 h-6 rounded-full text-xs font-black flex items-center justify-center border-2 border-[#0a1128]">{totalItems}</span>
        </button>
      )}

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#101b3b] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#0a1128]">
                <h2 className="text-xl font-black text-[#00ffff]">{cartStep === 1 ? 'Tu Pedido' : 'Datos de Envío'}</h2>
                <button onClick={() => { setIsCartOpen(false); setCartStep(1); }} className="p-2 bg-[#101b3b] text-gray-400 rounded-full hover:text-white border border-white/5"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
                {cartStep === 1 ? (
                  <div className="space-y-4">
                    {cart.length === 0 ? <p className="text-center text-gray-400 py-10">Tu carrito está vacío</p> : cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-[#0a1128] p-3 rounded-xl border border-white/5">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <p className="text-[#00ffff] font-black text-xs">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-[#101b3b] flex items-center justify-center text-white hover:bg-gray-700"><Minus size={14} /></button>
                          <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-[#101b3b] flex items-center justify-center text-white hover:bg-gray-700"><Plus size={14} /></button>
                          <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg bg-[#ff0055]/20 text-[#ff0055] flex items-center justify-center hover:bg-[#ff0055]/40 ml-2"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-400 mb-1">Nombre Completo *</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a1128] border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ffff]" /></div>
                    <div><label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp *</label><input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0a1128] border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ffff]" /></div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Método de Entrega</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'Domicilio'})} className={`py-2 rounded-xl text-sm font-bold border transition-colors ${formData.deliveryMethod === 'Domicilio' ? 'bg-[#00ffff] text-[#0a1128] border-[#00ffff]' : 'bg-[#0a1128] text-gray-300 border-white/5 hover:border-white/20'}`}>Domicilio</button>
                        <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'Recoger en local'})} className={`py-2 rounded-xl text-sm font-bold border transition-colors ${formData.deliveryMethod === 'Recoger en local' ? 'bg-[#00ffff] text-[#0a1128] border-[#00ffff]' : 'bg-[#0a1128] text-gray-300 border-white/5 hover:border-white/20'}`}>Recoger</button>
                      </div>
                    </div>
                    {formData.deliveryMethod === 'Domicilio' && <div><label className="block text-xs font-bold text-gray-400 mb-1">Dirección de Entrega *</label><textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0a1128] border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ffff] h-20 resize-none"></textarea></div>}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Forma de Pago</label>
                      <select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-[#0a1128] border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ffff]">
                        <option value="Efectivo">Efectivo</option>
                        <option value="Transferencia">Transferencia</option>
                      </select>
                    </div>
                    {formData.paymentMethod === 'Efectivo' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">¿Con cuánto vas a pagar? (Para el cambio)</label>
                        <input type="number" placeholder="Ej. 500" value={formData.cashAmount} onChange={e => setFormData({...formData, cashAmount: e.target.value})} className="w-full bg-[#0a1128] border border-white/5 rounded-xl p-3 text-white focus:outline-none focus:border-[#00ffff]" />
                      </div>
                    )}
                    {formData.paymentMethod === 'Transferencia' && (
                      <div className="bg-[#0a1128] border border-white/5 p-4 rounded-xl mt-2">
                        <p className="text-[#00ffff] font-bold text-sm mb-2">Datos para Transferencia</p>
                        <p className="text-gray-300 text-xs mb-1"><span className="text-gray-500">Banco:</span> BBVA</p>
                        <p className="text-gray-300 text-xs mb-1"><span className="text-gray-500">Cuenta:</span> 0123456789</p>
                        <p className="text-gray-300 text-xs mb-1"><span className="text-gray-500">CLABE:</span> 012345678901234567</p>
                        <p className="text-gray-300 text-xs"><span className="text-gray-500">Titular:</span> Marketplus SA de CV</p>
                      </div>
                    )}
                  </form>
                )}
              </div>

              <div className="p-5 border-t border-white/5 bg-[#0a1128]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-bold">Total a pagar:</span>
                  <span className="text-2xl font-black text-[#00ffff]">${totalPrice.toFixed(2)}</span>
                </div>
                {cartStep === 1 ? (
                  <button disabled={cart.length === 0} onClick={() => setCartStep(2)} className="w-full bg-[#ff0055] text-white py-4 rounded-xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ff1a66] transition-colors shadow-[0_0_15px_rgba(255,0,85,0.3)]">
                    Continuar Pedido
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCartStep(1)} className="px-6 py-4 rounded-xl font-bold bg-[#101b3b] text-white hover:bg-gray-800 transition-colors border border-white/5">
                      Volver
                    </button>
                    <button type="submit" form="checkout-form" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-black text-lg hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                      Enviar Pedido
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
