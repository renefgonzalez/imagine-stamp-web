import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, Plus, Minus, X, IceCream } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Hielito de Rompope', category: 'Hielitos', price: 15.00, image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'Hielito de Arroz con Leche', category: 'Hielitos', price: 15.00, image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=400' },
  { id: '3', name: 'Hielito de Jamaica', category: 'Hielitos', price: 15.00, image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=400' },
  { id: '4', name: 'Hielito de Chocolate', category: 'Hielitos', price: 15.00, image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=400' },
  { id: '5', name: 'Hielito de Limón', category: 'Hielitos', price: 15.00, image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=400' },
  { id: '6', name: 'Paleta de Limón', category: 'Paletas', price: 25.00, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400' },
  { id: '7', name: 'Paleta de Rompope', category: 'Paletas', price: 25.00, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400' },
  { id: '8', name: 'Paleta de Chocolate', category: 'Paletas', price: 25.00, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400' },
];

export default function PaleteriaMenu() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', 'Hielitos', 'Paletas'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const generateWhatsAppMessage = () => {
    let message = "¡Hola! Quiero hacer el siguiente pedido:\n";
    message += "--------------------------\n";
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}\n`;
    });
    
    message += "--------------------------\n";
    message += `Total a pagar: $${cartTotal.toFixed(2)}`;

    // Para esta demo no se especificó un número, puedes poner el número real aquí
    const phoneNumber = "525500000000"; 
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans text-gray-800 pb-24">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <IceCream className="text-[#00BCD4] w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Paletería y Nevería</h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar helados o paletas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-blue-50/50 border-none outline-none focus:ring-2 focus:ring-[#00BCD4] transition-all"
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* FILTROS */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#00BCD4] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CATÁLOGO */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filteredProducts.map(product => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={product.id}
              className="bg-white rounded-3xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col">
                <p className="text-xs font-semibold text-[#00BCD4] uppercase tracking-wider mb-1">{product.category}</p>
                <h3 className="font-semibold text-gray-800 leading-tight mb-2 flex-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#FF4081] hover:bg-pink-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-transform active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <IceCream className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No encontramos productos para tu búsqueda.</p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 mt-12 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Paletería y Nevería</h2>
          <p className="text-gray-500 mb-4">Lunes a Domingo • 10:00 AM - 9:00 PM</p>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8">
            <span>📍 Av. Ficticia 123, Centro</span>
            <span>📞 55 0000 0000</span>
          </div>
          <p className="text-xs font-medium text-gray-400">Diseñado y desarrollado por Imagine & Stamp</p>
        </div>
      </footer>

      {/* BOTÓN FLOTANTE CARRITO */}
      {cartItemCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#FF4081] text-white p-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-white text-[#FF4081] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FF4081]">
              {cartItemCount}
            </span>
          </div>
        </button>
      )}

      {/* CARRITO UI (DRAWER) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                  <ShoppingCart className="w-6 h-6 text-[#00BCD4]" />
                  Tu Pedido
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <IceCream className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Aún no has agregado nada a tu pedido.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                          <p className="text-[#00BCD4] font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-medium text-sm w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">Total a pagar</span>
                    <span className="text-2xl font-bold text-gray-800">${cartTotal.toFixed(2)}</span>
                  </div>
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#FF4081] hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                  >
                    Hacer Pedido por WhatsApp
                  </a>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
