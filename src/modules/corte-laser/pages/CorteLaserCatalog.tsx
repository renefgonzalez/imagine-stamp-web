import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Heart, Share2, X, Download, Check, Lock, SlidersHorizontal, Landmark, Copy, MapPin } from 'lucide-react';
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
  { id: '1', name: 'Diseño Corte Láser 1', category: 'General', price: 100.00, image: '/img/corte-laser/prod_1.jpeg', isDigital: false },
  { id: '2', name: 'Diseño Corte Láser 2', category: 'General', price: 100.00, image: '/img/corte-laser/prod_2.jpeg', isDigital: false },
  { id: '3', name: 'Diseño Corte Láser 3', category: 'General', price: 100.00, image: '/img/corte-laser/prod_3.jpeg', isDigital: false },
  { id: '4', name: 'Diseño Corte Láser 4', category: 'General', price: 100.00, image: '/img/corte-laser/prod_4.jpeg', isDigital: false },
  { id: '5', name: 'Diseño Corte Láser 5', category: 'General', price: 100.00, image: '/img/corte-laser/prod_5.jpeg', isDigital: false },
  { id: '6', name: 'Diseño Corte Láser 6', category: 'General', price: 100.00, image: '/img/corte-laser/prod_6.jpeg', isDigital: false },
  { id: '7', name: 'Diseño Corte Láser 7', category: 'General', price: 100.00, image: '/img/corte-laser/prod_7.jpeg', isDigital: false },
  { id: '8', name: 'Diseño Corte Láser 8', category: 'General', price: 100.00, image: '/img/corte-laser/prod_8.jpeg', isDigital: false },
  { id: '9', name: 'Diseño Corte Láser 9', category: 'General', price: 100.00, image: '/img/corte-laser/prod_9.jpeg', isDigital: false },
  { id: '10', name: 'Pack 50 Vectores Religiosos', category: 'Digital', price: 299.00, image: 'https://images.unsplash.com/photo-1618641986557-1de223cb2f4f?auto=format&fit=crop&q=80&w=600', isDigital: true, downloadUrl: 'https://drive.google.com/drive/folders/ejemplo', fileFormat: 'DXF, CDR, SVG' },
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
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', shippingMethod: '', notes: '', paymentMethod: '', discountCode: '', address: '', locationLink: '' });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchBankInfo = async () => {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'bank').single();
      if (!error && data) {
        setBankInfo(data);
      }
    };
    fetchBankInfo();
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const filteredProducts = INITIAL_PRODUCTS.filter(product => {
    const matchesCat = activeCategory === "Todos" || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://maps.google.com/?q=${latitude},${longitude}`;
        setCustomerInfo(prev => ({ ...prev, locationLink: link }));
        setGettingLocation(false);
      },
      (error) => {
        console.error(error);
        alert('No se pudo obtener la ubicación. Por favor asegúrate de haber dado permisos.');
        setGettingLocation(false);
      }
    );
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const hasDigitalItems = cart.some(item => item.isDigital);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = () => {
    setCheckoutStep('checkout');
  };

  const handleFinalCheckout = async () => {
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
      const shippingCost = customerInfo.shippingMethod === 'Envío a domicilio' ? 150 : 0;
      const finalTotal = cartTotal + shippingCost;

      if (shippingCost > 0) {
        message += `%0A*Subtotal: $${cartTotal.toFixed(2)}*%0A`;
        message += `*Costo de Envío: $${shippingCost.toFixed(2)}*%0A`;
      }
      message += `%0A*Total: $${finalTotal.toFixed(2)}*%0A%0A`;
      
      message += `*Datos de entrega:*%0A`;
      message += `👤 Nombre: ${customerInfo.name}%0A`;
      message += `📱 WhatsApp: ${customerInfo.phone}%0A`;
      message += `🚚 Envío: ${customerInfo.shippingMethod}%0A`;
      if (customerInfo.shippingMethod === 'Envío a domicilio') {
        if (customerInfo.address) message += `📍 Dirección: ${customerInfo.address}%0A`;
        if (customerInfo.locationLink) message += `📍 Ubicación: ${customerInfo.locationLink}%0A`;
      }
      message += `💳 Pago: ${customerInfo.paymentMethod}`;
      if (customerInfo.notes) {
        message += `%0A📝 Notas: ${customerInfo.notes}`;
      }
      if (customerInfo.discountCode) {
        message += `%0A🎟️ Cupón: ${customerInfo.discountCode}`;
      }
      message += `%0A%0A`;
      
      if (hasDigitalItems) {
        message += `_Nota: Este pedido incluye archivos digitales. Por favor confírmame los datos de transferencia para realizar el pago y recibir mis enlaces de descarga._`;
      } else {
        message += `_Por favor confírmame los datos para el pago/envío._`;
      }

      const whatsappUrl = `https://wa.me/525650469993?text=${message}`;
      
      setCheckoutStep('success');
      setCustomerInfo({ name: '', phone: '', shippingMethod: '', notes: '', paymentMethod: '', discountCode: '', address: '', locationLink: '' });
      setCart([]);
      
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
                        <div key={item.id} className="flex gap-4 bg-gray-800 p-3 rounded-2xl border border-gray-700 items-center">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl opacity-90" />
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-sm font-semibold text-gray-200 leading-tight mb-1">{item.name}</h4>
                            <div className="flex justify-between items-end mt-auto">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white font-black hover:bg-cyan-500 hover:text-gray-900 transition-colors"
                                >−</button>
                                <span className="w-4 text-center text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-white font-black hover:bg-cyan-500 hover:text-gray-900 transition-colors"
                                >+</button>
                              </div>
                              <PriceDisplay amount={item.price * item.quantity} />
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-red-400 transition-colors p-2">
                            <X size={18} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-6 bg-gray-900 border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                      {hasDigitalItems && (
                        <div className="mb-4 p-3 bg-cyan-900/20 text-cyan-400 text-xs rounded-lg border border-cyan-500/30 flex items-start gap-2 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                          <span className="shrink-0 mt-0.5">ℹ️</span>
                          <p>Tu carrito contiene archivos digitales. <strong>El enlace de descarga se enviará por WhatsApp al confirmar el pago.</strong></p>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-300 font-semibold">Total</span>
                        <PriceDisplay amount={cartTotal} />
                      </div>
                      
                      <button 
                        onClick={handleCheckout}
                        className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold text-lg transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)] uppercase tracking-wider flex items-center justify-center gap-2"
                      >
                        Siguiente — Datos de Entrega
                      </button>
                    </div>
                  )}
                </>
              ) : checkoutStep === 'checkout' ? (
                <div className="flex-1 flex flex-col h-full bg-gray-900 text-gray-300 overflow-y-auto">
                  <div className="p-4 border-b border-gray-800 flex items-center gap-2">
                    <button onClick={() => setCheckoutStep('cart')} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 text-gray-400 transition-colors">
                      <X size={16} className="rotate-45 transform" /> 
                    </button>
                    <h3 className="font-bold text-lg text-white">Datos de Entrega</h3>
                  </div>
                  
                    {/* Resumen compacto de Sahumerio */}
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6 mx-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-xs py-1">
                          <span className="text-gray-400 truncate pr-2">{item.name} <span className="font-bold text-gray-300">x{item.quantity}</span></span>
                          <span className="font-bold text-white shrink-0">${item.price * item.quantity} MXN</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtotal</span>
                        <span className="font-bold text-white">${cartTotal} MXN</span>
                      </div>
                    </div>

                  <div className="px-4 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Nombre Completo *</label>
                      <input
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-full text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Teléfono WhatsApp *</label>
                      <input
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="Ej. 5512345678"
                        type="tel"
                        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-full text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Método de Envío *</label>
                      <select
                        value={customerInfo.shippingMethod}
                        onChange={e => setCustomerInfo({ ...customerInfo, shippingMethod: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-full text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="Envío a domicilio">🏠 Envío a domicilio</option>
                        <option value="Recoger en tienda">🏪 Recoger en tienda</option>
                        <option value="Entrega digital">💻 Entrega digital</option>
                        <option value="Por confirmar">⏳ Por confirmar</option>
                      </select>
                    </div>
                    
                    {customerInfo.shippingMethod === 'Envío a domicilio' && (
                      <div>
                        <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Dirección de Envío *</label>
                        <textarea
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))}
                          className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-2xl text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all resize-none"
                          rows={2}
                          placeholder="Calle, Número, Colonia, C.P., Ciudad"
                        />
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={gettingLocation}
                          className="mt-2 ml-1 flex items-center gap-2 text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
                        >
                          <MapPin size={14} />
                          {gettingLocation ? 'Obteniendo ubicación...' : customerInfo.locationLink ? 'Ubicación compartida ✓' : 'Compartir mi ubicación actual'}
                        </button>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Forma de Pago *</label>
                      <select
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-full text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="" disabled>Selecciona una opción</option>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Transferencia">🏦 Transferencia</option>
                        <option value="Tarjeta">💳 Tarjeta</option>
                        <option value="Por confirmar">⏳ Por Confirmar</option>
                      </select>
                    </div>
                    
                    {/* Datos bancarios para transferencia */}
                    <AnimatePresence>
                      {customerInfo.paymentMethod === 'Transferencia' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-cyan-900/10 border border-cyan-900/30 rounded-2xl p-4 mt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white shrink-0">
                                <Landmark size={16} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none">Datos para transferencia</p>
                                <p className="text-[9px] font-medium text-gray-400 mt-0.5">Realiza tu pago y envía el comprobante por WhatsApp</p>
                              </div>
                            </div>
                            
                            {(() => {
                              const rows = [
                                { label: 'Banco', value: bankInfo?.bank_name, field: 'bank_name' },
                                { label: 'Titular', value: bankInfo?.account_holder, field: 'account_holder' },
                                { label: 'CLABE', value: bankInfo?.clabe, field: 'clabe' },
                                { label: 'No. de Cuenta', value: bankInfo?.account_number, field: 'account_number' },
                                { label: 'No. de Tarjeta', value: bankInfo?.card_number, field: 'card_number' },
                              ].filter(r => r.value && String(r.value).trim() !== '');

                              if (rows.length === 0) {
                                return (
                                  <p className="text-xs text-gray-500 italic py-2">
                                    Los datos bancarios se mostrarán aquí. Escríbenos por WhatsApp para coordinar tu pago.
                                  </p>
                                );
                              }

                              return (
                                <div className="space-y-2">
                                  {rows.map(row => (
                                    <div key={row.field} className="flex items-center justify-between gap-2 bg-gray-900 rounded-xl px-3 py-2 border border-gray-800">
                                      <div className="min-w-0">
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{row.label}</p>
                                        <p className="text-sm font-bold text-gray-200 truncate">{row.value}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => copyToClipboard(String(row.value), row.field)}
                                        title="Copiar"
                                        className="shrink-0 w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-cyan-600 hover:text-white transition-all"
                                      >
                                        {copiedField === row.field ? <Check size={14} /> : <Copy size={14} />}
                                      </button>
                                    </div>
                                  ))}
                                  {bankInfo?.instructions && String(bankInfo.instructions).trim() !== '' && (
                                    <p className="text-[10px] text-gray-400 leading-relaxed bg-gray-900 rounded-xl px-3 py-2 border border-gray-800 whitespace-pre-line mt-2">
                                      {bankInfo.instructions}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div>
                      <label className="text-xs font-bold text-gray-400 block mb-1.5 ml-1">Notas Adicionales (Opcional)</label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        placeholder="Ej. Dejar con el guardia, es para regalo..."
                        className="w-full bg-gray-900 border border-gray-800 text-white p-3 rounded-2xl text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all min-h-[80px]"
                      />
                    </div>
                    
                    <div className="border-t border-gray-800 pt-4 mt-2">
                      <label className="text-xs font-bold text-gray-400 block mb-2 ml-1">Cupón de Descuento</label>
                      <div className="flex gap-2">
                        <input
                          value={customerInfo.discountCode}
                          onChange={e => setCustomerInfo({ ...customerInfo, discountCode: e.target.value })}
                          placeholder="EJ. MAGIA20"
                          className="flex-1 bg-gray-900 border border-gray-800 text-white p-3 rounded-full text-sm focus:border-cyan-500 outline-none transition-all"
                        />
                        <button className="px-5 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-sm transition-colors">
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 mt-auto border-t border-gray-800 bg-gray-900 flex flex-col gap-3">
                    <button onClick={() => setCheckoutStep('cart')} className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest text-center py-2">
                      ← Volver al carrito
                    </button>
                    
                    <div className="flex justify-between items-center px-1 mb-2">
                      <span className="text-sm font-bold text-white">Total a pagar</span>
                      <span className="text-xl font-black text-white">${cartTotal + (customerInfo.shippingMethod === 'Envío a domicilio' ? 150 : 0)} <span className="text-sm font-normal text-gray-500">MXN</span></span>
                    </div>
                    
                    <button 
                      onClick={handleFinalCheckout}
                      disabled={isProcessing || !customerInfo.name || !customerInfo.phone || !customerInfo.shippingMethod || (customerInfo.shippingMethod === 'Envío a domicilio' && !customerInfo.address) || !customerInfo.paymentMethod}
                      className="w-full py-4 rounded-full bg-[#1e7e43] hover:bg-[#196b38] text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:shadow-none uppercase tracking-wide flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Share2 size={12} className="text-white fill-white" />
                      </div>
                      {isProcessing ? 'Procesando...' : 'Finalizar Pedido vía WhatsApp'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
                  <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center mb-4 shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu compra!</h3>
                  <p className="text-gray-400 mb-6 text-sm">
                    {hasDigitalItems 
                      ? 'Tu pedido ha sido enviado. Por WhatsApp te pasaremos el enlace de descarga una vez validado el pago.'
                      : 'Hemos registrado tu orden. Nos pondremos en contacto por WhatsApp.'}
                  </p>

                  {hasDigitalItems && (
                    <div className="w-full text-left bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 space-y-3 shadow-inner">
                      <h4 className="font-semibold text-cyan-400 text-sm mb-3 uppercase tracking-wider">Archivos Digitales Solicitados:</h4>
                      <p className="text-xs text-gray-400 mb-2">Una vez confirmado el pago, te enviaremos los enlaces seguros por WhatsApp.</p>
                      <div className="bg-gray-900 p-3 rounded-lg border border-gray-700 shadow-sm flex items-center gap-3 text-cyan-400">
                        <Check className="w-5 h-5 shrink-0" />
                        <span className="text-sm text-gray-300">¡Pedido Digital Registrado Correctamente!</span>
                      </div>
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
    </div>
  );
}

