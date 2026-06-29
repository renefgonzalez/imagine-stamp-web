import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, Share2, X, Download, Check, Lock, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import CorteLaserFooter from '../components/CorteLaserFooter';
import { supabase } from '../../../lib/supabase';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isDigital: boolean;
  downloadUrl?: string;
  fileFormat?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cruz Decorativa "La Biblia"',
    category: 'Religiosos',
    price: 150.00,
    image: '/img/corte-laser/media__1782603426978.png',
    isDigital: false
  },
  {
    id: '2',
    name: 'Servilletero Ángel Guardián',
    category: 'Religiosos',
    price: 120.00,
    image: '/img/corte-laser/media__1782604663359.png',
    isDigital: false
  },
  {
    id: '3',
    name: 'Cruz Padre Nuestro',
    category: 'Religiosos',
    price: 180.00,
    image: '/img/corte-laser/media__1782604673717.png',
    isDigital: false
  },
  {
    id: '4',
    name: 'Cruz Minimalista "JESUS"',
    category: 'Religiosos',
    price: 130.00,
    image: '/img/corte-laser/media__1782614921245.png',
    isDigital: false
  },
  {
    id: '5',
    name: 'Alcancía Princesa Peach',
    category: 'Cajas',
    price: 250.00,
    image: '/img/corte-laser/media__1782695475458.png',
    isDigital: false
  },
  {
    id: '6',
    name: 'Pack 50 Vectores Religiosos (Descarga)',
    category: 'Vectores Premium',
    price: 350.00,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    isDigital: true,
    fileFormat: 'SVG/DXF'
  }
];

const CATEGORIES = [
  "Todos", "Accesorios de cocina", "Accesorios personales", "Acrílico", "Amor", "Animales",
  "Bisutería", "Cajas", "Cake Topper", "Decoración Natural", "Dia de la madre", "Dia del padre",
  "Eventos", "Exhibidores", "Juguetes", "Mándalas", "Marcos", "Motor", "Muebles y Casas",
  "Navidad", "Otros", "Paisajes", "Portarretratos", "Puzle", "Religiosos", "Sobres", "Vectores Premium"
];

const PriceDisplay = ({ amount }: { amount: number }) => {
  const [whole, decimal] = amount.toFixed(2).split('.');
  return (
    <span className="font-bold text-cyan-400 text-lg drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
      ${whole}<sup className="text-xs">.{decimal}</sup>
    </span>
  );
};

export default function CorteLaserCatalog() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  const filteredProducts = INITIAL_PRODUCTS.filter(product => {
    const matchesCat = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasDigitalItems = cart.some(item => item.isDigital);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const orderId = `CL-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const digitalItems = cart.filter(item => item.isDigital);
      if (digitalItems.length > 0) {
        // Insertar en Supabase para que el Admin pueda generar los links
        const { error } = await supabase.from('digital_orders').insert(
          digitalItems.map(item => ({
            product_id: item.id,
            internal_notes: `Pedido ${orderId} - ${item.name}`,
            status: 'pending',
            max_downloads: 1
          }))
        );

        if (error) {
          console.error("Error guardando orden digital:", error);
          alert("Hubo un error al procesar los archivos digitales. Por favor intenta de nuevo.");
          setIsProcessing(false);
          return;
        }
      }

      // Generar mensaje de WhatsApp
      let message = `*NUEVO PEDIDO CORTE LÁSER (${orderId})* %0A%0A`;
      cart.forEach(item => {
        message += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)}) ${item.isDigital ? '*(DIGITAL)*' : ''}%0A`;
      });
      message += `%0A*Total: $${cartTotal.toFixed(2)}*%0A%0A`;
      
      if (hasDigitalItems) {
        message += `_Nota: Este pedido incluye archivos digitales. Por favor confírmame los datos de transferencia para realizar el pago y recibir mis enlaces de descarga._`;
      } else {
        message += `_Por favor confírmame los datos para el pago/envío._`;
      }

      const whatsappUrl = `https://wa.me/525650469993?text=${message}`;
      
      setCheckoutStep('success');
      
      // Abrir WhatsApp en nueva pestaña
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 500);

    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdminAccess = () => {
    setShowAdminLogin(true);
    setAdminPassword('');
    setLoginError(false);
  };

  const handleLoginSubmit = () => {
    if (adminPassword === '1212' || adminPassword === 'laser') {
      window.location.hash = '/corte-laser-admin';
    } else {
      setLoginError(true);
    }
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300);
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200">
      <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-cyan-500 flex items-center justify-center font-bold text-gray-900 text-lg shadow-[0_0_15px_rgba(6,182,212,0.6)]">
              CL
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Corte Láser
            </h1>
          </div>
          
          <div className="flex-1 max-w-xl hidden md:flex items-center relative">
            <Search className="absolute left-3 text-cyan-500/70 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Buscar productos o vectores..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white border border-transparent rounded-full focus:bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all outline-none placeholder-gray-500"
            />
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-300 hover:text-cyan-400 transition-colors drop-shadow-[0_0_5px_rgba(6,182,212,0.2)]"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 bg-cyan-500 text-gray-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)]">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-cyan-500/70 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800 text-white text-sm border border-transparent rounded-full focus:bg-gray-800 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none placeholder-gray-500"
            />
          </div>
        </div>

        <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-16 z-30">
          <div 
            className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto items-center laser-scrollbar pb-2"
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            <button
              onClick={() => setShowCategoriesModal(true)}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center border border-gray-700 hover:text-cyan-400 hover:border-cyan-500 transition-colors"
              title="Filtrar categorías"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1 flex-shrink-0"></div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeCategory === cat 
                  ? 'bg-gray-800 text-cyan-400 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-gray-800 text-gray-400 border-transparent hover:border-cyan-500/50 hover:text-cyan-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No se encontraron productos para tu búsqueda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={product.id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-transparent flex flex-col group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-900">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  />
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button className="w-8 h-8 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:border-cyan-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {product.isDigital ? (
                    <div className="absolute top-3 left-3 bg-cyan-500/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-gray-900 shadow-[0_0_15px_rgba(6,182,212,0.6)] tracking-wide border border-cyan-400">
                      DIGITAL {product.fileFormat && `(${product.fileFormat})`}
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-gray-700/90 backdrop-blur-md border border-gray-600 px-3 py-1 rounded-md text-xs font-semibold text-gray-300 tracking-wide">
                      FÍSICO
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 relative overflow-hidden">
                  <span className="text-xs font-medium text-cyan-500/70 mb-1 tracking-wider uppercase">{product.category}</span>
                  <h3 className="font-semibold text-white leading-tight mb-3 flex-1">{product.name}</h3>
                  
                  <div className="flex items-end justify-between mt-auto mb-5">
                    <PriceDisplay amount={product.price} />
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 rounded-lg bg-transparent border border-cyan-500 text-cyan-400 font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 hover:text-gray-900 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 uppercase tracking-wider text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Agregar al Carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CorteLaserFooter onAdminAccess={handleAdminAccess} />

      {/* Categorías Modal */}
      <AnimatePresence>
        {showCategoriesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCategoriesModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-800/50">
                <h2 className="text-xl font-bold text-white tracking-wide">Todas las Categorías</h2>
                <button
                  onClick={() => setShowCategoriesModal(false)}
                  className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setShowCategoriesModal(false);
                      }}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group ${
                        activeCategory === cat
                          ? 'bg-gray-800 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800'
                      }`}
                    >
                      <span className={`text-sm font-medium text-center transition-colors ${
                        activeCategory === cat ? 'text-cyan-400' : 'text-gray-300 group-hover:text-cyan-400'
                      }`}>
                        {cat}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">Tu Carrito</h2>
                <button onClick={closeCart} className="p-2 text-gray-400 hover:text-cyan-400 bg-gray-800 rounded-full transition-colors border border-gray-700 hover:border-cyan-500/50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {checkoutStep === 'cart' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-3">
                        <ShoppingBag className="w-12 h-12 opacity-20" />
                        <p>Tu carrito está vacío</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex gap-4 bg-gray-800 p-3 rounded-2xl border border-gray-700">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl opacity-90" />
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-sm font-semibold text-gray-200 leading-tight mb-1">{item.name}</h4>
                            <div className="flex justify-between items-end mt-auto">
                              <span className="text-xs text-gray-500">Cant: {item.quantity}</span>
                              <PriceDisplay amount={item.price * item.quantity} />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-6 bg-gray-900 border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                      {hasDigitalItems && (
                        <div className="mb-4 p-3 bg-cyan-900/20 text-cyan-400 text-xs rounded-lg border border-cyan-500/30 flex items-start gap-2 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                          <span className="shrink-0 mt-0.5">ℹ️</span>
                          <p>Tu carrito contiene archivos digitales. <strong>El enlace de descarga se enviará por correo o WhatsApp al confirmar el pago.</strong></p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-300 font-semibold">Total</span>
                        <PriceDisplay amount={cartTotal} />
                      </div>
                      
                      <button 
                        onClick={handleCheckout}
                        className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold text-lg transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider"
                      >
                        Confirmar Pago
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center mb-4 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu compra!</h3>
                  <p className="text-gray-400 mb-6 text-sm">
                    {hasDigitalItems 
                      ? 'Tu pago ha sido confirmado. Puedes descargar tus archivos digitales a continuación.'
                      : 'Hemos registrado tu orden. Nos pondremos en contacto para los detalles de envío.'}
                  </p>

                  {hasDigitalItems && (
                    <div className="w-full text-left bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 space-y-3 shadow-inner">
                      <h4 className="font-semibold text-cyan-400 text-sm mb-3 uppercase tracking-wider">Archivos Digitales Solicitados:</h4>
                      <p className="text-xs text-gray-400 mb-2">Una vez confirmado el pago, te enviaremos los enlaces seguros por WhatsApp.</p>
                      {cart.filter(item => item.isDigital).map(item => (
                        <div key={`download-${item.id}`} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-sm">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-cyan-900/40 rounded-md border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
                              <Download className="w-5 h-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-semibold text-gray-200 truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">Formato: {item.fileFormat || 'Digital'}</p>
                            </div>
                          </div>
                          <span className="shrink-0 bg-gray-700/50 text-gray-400 px-3 py-1.5 rounded-md text-sm font-bold border border-gray-600">
                            Pendiente
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      setCart([]);
                      closeCart();
                    }}
                    className="w-full py-3 mt-auto rounded-xl bg-transparent border border-cyan-500 hover:bg-cyan-500 text-cyan-400 hover:text-gray-900 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] uppercase tracking-wider text-sm"
                  >
                    Volver al Catálogo
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 p-8 rounded-2xl shadow-[0_0_40px_rgba(6,182,212,0.15)] w-full max-w-sm border border-gray-800 relative"
            >
              <button 
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 left-4 text-gray-400 hover:text-cyan-400 flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                &larr; Volver
              </button>

              <div className="flex flex-col items-center mt-8">
                <div className="w-20 h-20 rounded-full border border-cyan-500/50 bg-cyan-900/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Lock className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Panel Admin</h2>
                <p className="text-cyan-400/80 mb-8 text-sm flex items-center gap-2">
                  <span>⚡</span> Corte Láser
                </p>

                <input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder="••••"
                  className="w-full bg-gray-800 text-cyan-400 text-center text-3xl tracking-[0.5em] p-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 mb-2 border border-gray-700 placeholder-gray-600 shadow-inner"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoginSubmit();
                  }}
                  autoFocus
                />
                
                <div className="h-6 w-full text-center">
                  {loginError && (
                    <span className="text-red-400 text-sm font-medium">Contraseña incorrecta</span>
                  )}
                </div>

                <button
                  onClick={handleLoginSubmit}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-4 rounded-xl mt-2 transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                >
                  INGRESAR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CorteLaserFooter onAdminAccess={handleAdminAccess} />
    </div>
  );
}

