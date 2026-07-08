import React, { useState, useMemo } from 'react';
import { Search, ShoppingCart, X, Plus, Minus, Trash2, MapPin, Phone, Clock, Instagram, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from '../assets/logo.png';

// ARRAY HARDCODEADO AQUI
const CATEGORIES = ['Todas', 'Hamburguesas', 'Hot Dogs', 'Complementos', 'Bebidas'];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Sencilla', description: 'Carne, queso amarillo, jamón. Incluye papas.', price: 70.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Hawaiana', description: 'Carne, queso amarillo, jamón y piña. Incluye papas.', price: 80.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Sencilla + Salchichón', description: 'Incluye papas.', price: 85.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80' },
  { id: 4, name: 'Champiñones', description: 'Carne, queso amarillo, jamón, champiñones. Incluye papas.', price: 90.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Especial', description: 'Carne, queso asadero, tocino, salchichón. Incluye papas.', price: 90.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Doble Carne', description: 'Doble carne, queso amarillo, jamón. Incluye papas.', price: 100.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1608767221051-2b9d18f35a2f?auto=format&fit=crop&w=300&q=80' },
  { id: 7, name: 'De la Casa', description: 'Carne, queso asadero, amarillo, piña, champiñones, salchichón. Incluye papas.', price: 130.00, category: 'Hamburguesas', image: 'https://images.unsplash.com/photo-1598182198871-d3f4ab4fd181?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Clásico', description: 'Salchicha de pavo, jitomate, cebolla.', price: 35.00, category: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80' },
  { id: 9, name: 'Especial', description: 'Salchicha, tocino, queso derretido.', price: 50.00, category: 'Hot Dogs', image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=300&q=80' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function LaCasaMenu() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  // estados del carrito
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'Domicilio',
    address: '',
    paymentMethod: 'Efectivo',
  });

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'Todas' || product.category === activeCategory;
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
    let message = `Hola, quiero hacer un pedido en La Casa de la Montaña:\n\n`;
    cart.forEach(item => {
      message += `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Total:* $${totalPrice.toFixed(2)}\n\n`;
    message += `*Datos del Cliente:*\nNombre: ${formData.name}\nEntrega: ${formData.deliveryMethod}\n`;
    if (formData.deliveryMethod === 'Domicilio') message += `Dirección: ${formData.address}\n`;
    message += `Pago: ${formData.paymentMethod}`;

    window.open(`https://wa.me/525555555555?text=${encodeURIComponent(message)}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
    setCartStep(1);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans pb-20">
      
      {/* Encabezado y Buscador */}
      <header className="bg-[#050505] p-6 rounded-b-3xl shadow-2xl mb-6 border-b border-white/5">
        <div className="flex flex-col items-center justify-center mb-4">
          {/* Contenedor del logo */}
          <div className="w-32 h-32 mb-3 flex items-center justify-center">
            <img src={logo} alt="La Casa de la Montaña" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <p className="text-gray-400 text-center text-sm">El mejor sabor hasta la puerta de tu casa</p>
        </div>
        <input 
          type="text" 
          placeholder="Buscar platillo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] text-white rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#FFCE00] transition-colors" 
        />
      </header>

      {/* Categorías / Tabs */}
      <div className="px-4 mb-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#FFCE00] text-[#1a0505]' 
                  : 'bg-[#420f0f] text-gray-300 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Productos (Layout Fijo Horizontal) */}
      <div className="px-4 flex flex-col gap-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="flex flex-row items-center bg-[#2b0909] rounded-2xl p-3 border border-white/5 shadow-lg">
            
            {/* Imagen Cuadrada Fija */}
            <div className="w-16 h-16 shrink-0 bg-black/30 rounded-xl mr-3 flex items-center justify-center text-2xl overflow-hidden">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              ) : (
                '🍔'
              )}
            </div>
            
            {/* Textos */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base truncate">{product.name}</h3>
              <p className="text-gray-400 text-xs truncate mb-1">{product.description}</p>
              <p className="text-[#FFCE00] font-extrabold">${product.price.toFixed(2)}</p>
            </div>
            
            {/* Botón */}
            <button 
              onClick={() => addToCart(product)}
              className="bg-[#FFCE00] text-[#1a0505] font-black px-4 py-2 rounded-xl text-sm shrink-0 ml-2 shadow-md hover:bg-yellow-400"
            >
              + Agregar
            </button>
          </div>
        ))}
        {filteredProducts.length === 0 && <div className="text-center py-12 text-gray-400">No encontramos productos.</div>}
      </div>

      {/* FOOTER DEL CLIENTE */}
      <footer className="bg-[#1a0505] pt-12 pb-6 mt-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            
            {/* Columna 1: Logo y Descripción */}
            <div>
              <img src={logo} alt="La Casa de la Montaña" className="w-32 h-auto mb-4 drop-shadow-sm" />
              <p className="text-gray-400 text-sm">
                El mejor sabor hasta la puerta de tu casa. Ingredientes frescos y calidad premium en cada mordida.
              </p>
            </div>

            {/* Columna 2: Contacto */}
            <div>
              <h3 className="text-[#FFCE00] font-bold mb-4 uppercase text-sm tracking-wider">Contacto</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">📞 WhatsApp: 555-123-4567</li>
                <li className="flex items-center gap-2">📍 Av. Principal #123, Centro</li>
                <li className="flex items-center gap-2">🕒 Mar - Dom: 13:00 - 22:00</li>
              </ul>
            </div>

            {/* Columna 3: Promociones y Redes */}
            <div>
              <h3 className="text-[#FFCE00] font-bold mb-4 uppercase text-sm tracking-wider">Síguenos</h3>
              <div className="bg-[#2b0909] p-4 rounded-xl border border-white/5">
                <p className="text-xs text-gray-300 font-bold mb-1">🎉 PROMOCIONES</p>
                <p className="text-gray-400 text-xs">
                  Síguenos en nuestras redes sociales para promociones exclusivas.
                </p>
              </div>
            </div>
          </div>

          {/* Barra Inferior (Créditos de la Agencia) */}
          <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500 space-y-2">
            <p>© 2026 La Casa de la Montaña. Todos los derechos reservados.</p>
            <p className="text-gray-400 font-bold uppercase tracking-widest mt-2">Diseñado por IMAGINE & STAMP.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="hover:text-[#FFCE00]">Aviso de Privacidad</a>
              <span>|</span>
              <a href="#" className="hover:text-[#FFCE00]">Términos de Servicio</a>
            </div>
            <div className="mt-4 flex justify-center">
              <span className="text-gray-600">🔒</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Botón flotante del carrito */}
      {totalItems > 0 && (
        <button onClick={() => setIsCartOpen(true)} className="fixed bottom-6 right-6 bg-[#FFCE00] text-black p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 z-40 border-4 border-[#2b0909]">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs font-black flex items-center justify-center border-2 border-[#2b0909]">{totalItems}</span>
        </button>
      )}

      {/* Modal de Carrito */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#2b0909] w-full max-w-md h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-[#420f0f] overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#420f0f] bg-[#1a0505]">
                <h2 className="text-xl font-black text-[#FFCE00]">{cartStep === 1 ? 'Tu Pedido' : 'Datos de Envío'}</h2>
                <button onClick={() => { setIsCartOpen(false); setCartStep(1); }} className="p-2 bg-[#420f0f] text-gray-400 rounded-full hover:text-white"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {cartStep === 1 ? (
                  <div className="space-y-4">
                    {cart.length === 0 ? <p className="text-center text-gray-400 py-10">Tu carrito está vacío</p> : cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-[#420f0f] p-3 rounded-xl border border-[#5a1515]">
                        <div className="flex-1">
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <p className="text-[#FFCE00] font-black text-xs">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 rounded-lg bg-[#2b0909] flex items-center justify-center text-white hover:bg-gray-700"><Minus size={14} /></button>
                          <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 rounded-lg bg-[#2b0909] flex items-center justify-center text-white hover:bg-gray-700"><Plus size={14} /></button>
                          <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg bg-red-900/30 text-red-400 flex items-center justify-center hover:bg-red-900/50 ml-2"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-400 mb-1">Nombre Completo *</label><input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#420f0f] border border-[#5a1515] rounded-xl p-3 text-white focus:outline-none focus:border-[#FFCE00]" /></div>
                    <div><label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp *</label><input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#420f0f] border border-[#5a1515] rounded-xl p-3 text-white focus:outline-none focus:border-[#FFCE00]" /></div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Método de Entrega</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'Domicilio'})} className={`py-2 rounded-xl text-sm font-bold border ${formData.deliveryMethod === 'Domicilio' ? 'bg-[#FFCE00] text-black border-[#FFCE00]' : 'bg-[#420f0f] text-gray-300 border-[#5a1515]'}`}>Domicilio</button>
                        <button type="button" onClick={() => setFormData({...formData, deliveryMethod: 'Recoger en local'})} className={`py-2 rounded-xl text-sm font-bold border ${formData.deliveryMethod === 'Recoger en local' ? 'bg-[#FFCE00] text-black border-[#FFCE00]' : 'bg-[#420f0f] text-gray-300 border-[#5a1515]'}`}>Recoger</button>
                      </div>
                    </div>
                    {formData.deliveryMethod === 'Domicilio' && <div><label className="block text-xs font-bold text-gray-400 mb-1">Dirección de Entrega *</label><textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#420f0f] border border-[#5a1515] rounded-xl p-3 text-white focus:outline-none focus:border-[#FFCE00] h-20 resize-none"></textarea></div>}
                    <div><label className="block text-xs font-bold text-gray-400 mb-1">Forma de Pago</label><select value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})} className="w-full bg-[#420f0f] border border-[#5a1515] rounded-xl p-3 text-white focus:outline-none focus:border-[#FFCE00]"><option value="Efectivo">Efectivo</option><option value="Transferencia">Transferencia</option></select></div>
                  </form>
                )}
              </div>

              <div className="p-5 border-t border-[#420f0f] bg-[#1a0505]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400 font-bold">Total a pagar:</span>
                  <span className="text-2xl font-black text-[#FFCE00]">${totalPrice.toFixed(2)}</span>
                </div>
                {cartStep === 1 ? (
                  <button disabled={cart.length === 0} onClick={() => setCartStep(2)} className="w-full bg-[#FFCE00] text-black py-4 rounded-xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-400 transition-colors">Continuar Pedido</button>
                ) : (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCartStep(1)} className="px-6 py-4 rounded-xl font-bold bg-[#420f0f] text-white hover:bg-[#5a1515] transition-colors">Volver</button>
                    <button type="submit" form="checkout-form" className="flex-1 bg-[#25D366] text-white py-4 rounded-xl font-black text-lg hover:bg-green-500 transition-colors flex items-center justify-center gap-2">Enviar por WhatsApp</button>
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
