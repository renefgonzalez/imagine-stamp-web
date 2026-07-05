import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, X, Beef, Heart, Lock, ShieldCheck, Truck, ArrowRight, CheckCircle2, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: 'Corte Premium' | 'Calidad Garantizada';
  description?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Carne Enchilada Especial', category: 'Carne Enchilada', price: 180.00, image: './proveedora-san-luis/producto_1.jpeg', badge: 'Calidad Garantizada', description: 'Nuestra receta tradicional, marinada a la perfección.' },
  { id: '2', name: 'Carne Enchilada de Cerdo', category: 'Carne Enchilada', price: 160.00, image: './proveedora-san-luis/producto_2.jpeg', description: 'Cortes seleccionados de cerdo con nuestro adobo secreto.' },
  { id: '3', name: 'Cecina de Res Premium', category: 'Cecina', price: 220.00, image: './proveedora-san-luis/producto_3.jpeg', badge: 'Corte Premium', description: 'Cecina fina y jugosa, secada artesanalmente.' },
  { id: '4', name: 'Cecina Natural', category: 'Cecina', price: 190.00, image: './proveedora-san-luis/producto_4.jpeg', description: 'Ideal para asar, con el toque exacto de sal.' },
  { id: '5', name: 'Picaña Premium', category: 'Picaña Premium', price: 350.00, image: './proveedora-san-luis/producto_5.jpeg', badge: 'Corte Premium', description: 'El corte rey de los asados. Suave y con excelente marmoleo.' },
  { id: '6', name: 'Aguja Norteña', category: 'Aguja Norteña', price: 280.00, image: './proveedora-san-luis/producto_6.jpeg', badge: 'Corte Premium', description: 'Corte con hueso, extra jugoso y lleno de sabor.' },
  { id: '7', name: 'Requesón Fresco', category: 'Requesón', price: 90.00, image: './proveedora-san-luis/producto_7.jpeg', badge: 'Calidad Garantizada', description: 'Elaborado diariamente con leche 100% de vaca.' },
  { id: '8', name: 'Requesón Preparado', category: 'Requesón', price: 110.00, image: './proveedora-san-luis/producto_8.jpeg', description: 'Toque de especias, perfecto para untar.' },
  { id: '9', name: 'Mix Asado Perfecto', category: 'Paquetes', price: 750.00, image: './proveedora-san-luis/producto_9.jpeg', badge: 'Corte Premium', description: 'Incluye Picaña, Aguja, Chorizo y tortillas.' }
];

export default function ProveedoraMenu() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastName, setToastName] = useState('');

  // Customer Form
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    city: '',
    paymentMethod: 'Efectivo / Contra Entrega',
    deliveryMethod: 'Servicio a Domicilio',
    notes: ''
  });

  useEffect(() => {
    const savedFavs = localStorage.getItem('proveedora_favorites');
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    let newFavs;
    if (favorites.includes(id)) {
      newFavs = favorites.filter(fav => fav !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    localStorage.setItem('proveedora_favorites', JSON.stringify(newFavs));
  };

  const categories = ['Todos', 'Carne Enchilada', 'Cecina', 'Picaña Premium', 'Aguja Norteña', 'Requesón', 'Paquetes', 'Favoritos'];

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      let matchesCategory = false;
      if (activeCategory === 'Todos') matchesCategory = true;
      else if (activeCategory === 'Favoritos') matchesCategory = favorites.includes(product.id);
      else matchesCategory = product.category === activeCategory;
      
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery, favorites]);

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
    
    setToastName(product.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
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
    let message = "🥩 *NUEVO PEDIDO - PROVEEDORA SAN LUIS* 🥩\n\n";
    message += "--------------------------\n";
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `🔸 ${item.quantity}x ${item.name} - $${itemTotal.toFixed(2)}\n`;
    });
    
    message += "--------------------------\n";
    message += `💰 *Total a pagar: $${cartTotal.toFixed(2)}*\n\n`;
    
    message += `📋 *Datos del Cliente:*\n`;
    message += `👤 Nombre: ${customerInfo.name}\n`;
    message += `📱 WhatsApp: ${customerInfo.phone}\n`;
    message += `📍 Dirección/Ciudad: ${customerInfo.city}\n`;
    message += `🚚 Entrega: ${customerInfo.deliveryMethod}\n`;
    message += `💳 Forma de pago: ${customerInfo.paymentMethod}\n`;
    if (customerInfo.notes) {
      message += `📝 Notas: ${customerInfo.notes}\n`;
    }

    const phoneNumber = "525632155742"; 
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800 pb-24 relative selection:bg-[#B07D4B] selection:text-white">
      {/* HEADER */}
      <header className="bg-[#262626] text-white shadow-md sticky top-0 z-40 border-b border-[#333]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
              <Beef className="text-[#B07D4B] w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-serif text-white">PROVEEDORA SAN LUIS</h1>
              <p className="text-[10px] text-[#B07D4B] uppercase tracking-widest font-bold mt-1">Calidad y Tradición</p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar cortes, cecina, etc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 text-white border-none outline-none focus:bg-white/20 transition-all font-medium placeholder:text-stone-400 text-sm"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Delivery Notice */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B07D4B] mb-8">
          <Truck size={16} />
          <span>¡Servicio a domicilio disponible!</span>
        </div>
        
        {/* HERO BANNER */}
        <div className="w-full rounded-3xl bg-[#F5F5F0] text-stone-900 p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="relative z-10 md:w-2/3">
            <span className="inline-block px-4 py-1.5 bg-white text-[#B07D4B] border border-[#B07D4B]/20 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Cortes Finos</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight text-[#262626]">El sabor de la tradición<br/>en tu mesa.</h2>
            <p className="text-stone-500 mb-2 text-sm md:text-base max-w-md leading-relaxed">Seleccionamos las mejores carnes para ofrecerte calidad inigualable. Ideal para tus asados y comidas familiares.</p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-1/2 opacity-5 pointer-events-none">
            <Beef className="w-full h-full p-12 text-[#262626]" />
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide hide-scrollbar mb-10 px-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-2 ${
                activeCategory === cat
                  ? 'bg-[#262626] text-white shadow-md'
                  : 'bg-white text-stone-500 hover:bg-[#F5F5F0] hover:text-[#262626] border border-stone-200'
              }`}
            >
              {cat === 'Favoritos' && <Heart className={`w-3.5 h-3.5 ${activeCategory === cat ? 'fill-current text-[#B07D4B]' : 'text-[#B07D4B]'}`} />}
              {cat}
            </button>
          ))}
        </div>

        {/* CATÁLOGO (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
          {filteredProducts.map(product => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={product.id}
              className="bg-[#F5F5F0] rounded-3xl transition-all flex flex-col relative overflow-hidden group border border-transparent hover:border-stone-200"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.badge && (
                  <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white rounded-full shadow-sm flex items-center gap-1.5 ${
                    product.badge === 'Corte Premium' ? 'bg-[#262626]' : 'bg-[#B07D4B]'
                  }`}>
                    {product.badge === 'Corte Premium' ? <ShieldCheck size={12} className="text-[#B07D4B]" /> : <CheckCircle2 size={12} />}
                    {product.badge}
                  </span>
                )}
              </div>

              <button 
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-4 right-4 z-10 bg-white/90 p-2.5 rounded-full shadow-sm hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 transition-colors ${favorites.includes(product.id) ? 'fill-[#B07D4B] text-[#B07D4B]' : 'text-stone-400'}`} />
              </button>
              
              <div className="aspect-square overflow-hidden bg-stone-100 relative rounded-t-3xl">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => {
                    // Fallback to a placeholder if image is missing
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=600';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-[10px] font-black text-[#B07D4B] uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="font-serif font-bold text-[#262626] text-xl leading-tight mb-3 flex-1">{product.name}</h3>
                {product.description && (
                  <p className="text-xs text-stone-500 line-clamp-2 mb-6 leading-relaxed">{product.description}</p>
                )}
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-medium text-lg text-[#262626]">${product.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#262626] hover:bg-[#1a1a1a] text-[#B07D4B] w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 group-hover:bg-[#B07D4B] group-hover:text-white"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm mt-8">
            <Beef className="w-16 h-16 mx-auto mb-4 text-stone-200" />
            <p className="text-stone-500 font-medium">No encontramos cortes para tu búsqueda.</p>
          </div>
        )}
      </main>

      {/* REGLA OBLIGATORIA DEL FOOTER */}
      <footer className="bg-[#262626] border-t border-[#333] mt-24 py-16 text-stone-400">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
            
            {/* Columna 1: Sobre nosotros */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3 mb-4">
                <Beef className="text-[#B07D4B] w-6 h-6" />
                <h2 className="text-lg font-black text-white font-serif tracking-widest">PROVEEDORA SAN LUIS</h2>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                La mejor calidad en carnes para tu mesa. Servicio a domicilio rápido y seguro, directo a tu puerta.
              </p>
            </div>

            {/* Columna 2: Contacto y Horarios */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-bold tracking-widest uppercase mb-4 text-sm">Contacto</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-[#B07D4B] font-bold">📍</span>
                  <span>[Tu dirección física aquí]</span>
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-[#B07D4B] font-bold">📱</span>
                  <span>563 215 5742</span>
                </li>
                <li className="flex items-center gap-3 justify-center md:justify-start">
                  <span className="text-[#B07D4B] font-bold">🕒</span>
                  <span>Lun - Dom: 9:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Redes y Legal */}
            <div className="flex flex-col items-center md:items-start">
              <h3 className="text-white font-bold tracking-widest uppercase mb-4 text-sm">Síguenos</h3>
              <div className="flex items-center gap-4 mb-6">
                <a href="#" className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#B07D4B] hover:bg-[#B07D4B] hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#B07D4B] hover:bg-[#B07D4B] hover:text-white transition-all shadow-sm">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#333] flex items-center justify-center text-[#B07D4B] hover:bg-[#B07D4B] hover:text-white transition-all shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
              
              <div className="text-[11px] space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <a href="#" className="hover:text-white transition-colors underline decoration-stone-700">Aviso de Privacidad</a>
                  <span>|</span>
                  <a href="#" className="hover:text-white transition-colors underline decoration-stone-700">Términos de Servicio</a>
                </div>
                <div className="pt-2">
                  <p>© {new Date().getFullYear()} Todos los derechos reservados.</p>
                  <p className="mt-1">Diseñado por <strong className="text-white">IMAGINE & STAMP</strong></p>
                </div>
              </div>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-[#333] flex justify-center">
            {/* Botón oculto al panel admin */}
            <a href="/#/admin" className="text-[#333] hover:text-[#555] transition-colors" title="Acceso Admin">
              <Lock className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* TOAST CONFIRMACIÓN */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[280px] max-w-sm border border-stone-700"
          >
            <div className="w-8 h-8 rounded-full bg-[#1EBE5D] flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Agregado al pedido</p>
              <p className="text-sm font-bold truncate">{toastName}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÓN FLOTANTE CARRITO */}
      {cartItemCount > 0 && (
        <button
          onClick={() => { setCartStep(1); setIsCartOpen(true); }}
          className="fixed bottom-8 right-8 z-40 bg-[#262626] text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-[#B07D4B]" />
            <span className="absolute -top-2 -right-3 bg-[#B07D4B] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartItemCount}
            </span>
          </div>
          <span className="font-bold text-sm tracking-wide hidden md:block">Ver Pedido</span>
        </button>
      )}

      {/* CARRITO UI DE 2 PASOS (DRAWER) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/60 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <h2 className="text-xl font-bold flex items-center gap-3 text-stone-800 font-serif">
                  <div className="w-8 h-8 rounded-full bg-[#B07D4B] text-white flex items-center justify-center">
                    {cartStep === 1 ? <ShoppingCart className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                  </div>
                  {cartStep === 1 ? 'Tu Pedido' : 'Datos de Entrega'}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-stone-400 hover:bg-stone-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 bg-white">
                {cartStep === 1 ? (
                  // PASO 1: LISTA DE PRODUCTOS
                  cart.length === 0 ? (
                    <div className="text-center text-stone-400 mt-32">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="font-medium">Tu pedido está vacío.</p>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="mt-6 px-6 py-2 bg-stone-100 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-200"
                      >
                        Ir al catálogo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                         <div key={item.id} className="flex items-center gap-4 bg-stone-50 border border-stone-100 p-3 rounded-2xl">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-stone-800 text-sm truncate">{item.name}</h4>
                            <p className="text-[#B07D4B] font-black">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-stone-100">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  // PASO 2: DATOS DE ENTREGA
                  <div className="space-y-5">
                    
                    <div className="bg-[#FFF9F5] p-4 rounded-2xl border border-[#FFE4C4] mb-2">
                      <p className="text-xs text-[#B07D4B] font-medium leading-relaxed">
                        Completa tus datos para enviarte tu pedido. El pago lo podrás realizar al recibir tus cortes o por transferencia.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">WhatsApp *</label>
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium"
                        placeholder="10 dígitos"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Tipo de Entrega *</label>
                        <select 
                          value={customerInfo.deliveryMethod}
                          onChange={e => setCustomerInfo({...customerInfo, deliveryMethod: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium appearance-none"
                        >
                          <option value="Servicio a Domicilio">Servicio a Domicilio</option>
                          <option value="Recoger en Tienda">Recoger en Tienda</option>
                        </select>
                      </div>
                    </div>

                    {customerInfo.deliveryMethod === 'Servicio a Domicilio' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 mt-1">Dirección Completa *</label>
                        <input 
                          type="text" 
                          value={customerInfo.city}
                          onChange={e => setCustomerInfo({...customerInfo, city: e.target.value})}
                          className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium"
                          placeholder="Calle, Número, Colonia, Ciudad"
                        />
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Forma de Pago *</label>
                      <select 
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium appearance-none"
                      >
                        <option value="Efectivo / Contra Entrega">Efectivo (Pago Contra Entrega)</option>
                        <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">Notas especiales (opcional)</label>
                      <textarea 
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})}
                        className="w-full px-4 py-3.5 rounded-xl border border-stone-200 focus:ring-4 focus:ring-[#B07D4B]/20 focus:border-[#B07D4B] outline-none bg-stone-50 font-medium resize-none"
                        placeholder="Ej. Traer cambio de $500, tocar fuerte..."
                        rows={3}
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-white">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-stone-500 font-bold uppercase tracking-wider text-xs">Total a pagar</span>
                    <span className="text-3xl font-black text-[#B07D4B]">${cartTotal.toFixed(2)}</span>
                  </div>
                  
                  {cartStep === 1 ? (
                    <button
                      onClick={() => setCartStep(2)}
                      className="w-full bg-[#B07D4B] hover:bg-[#8C6339] text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                    >
                      Continuar a Entrega
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setCartStep(1)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 border border-stone-200"
                      >
                        Volver
                      </button>
                      <button
                        onClick={() => {
                          if (!customerInfo.name || !customerInfo.phone) {
                            alert("Por favor llena tu nombre y WhatsApp para poder enviarte el pedido.");
                            return;
                          }
                          if (customerInfo.deliveryMethod === 'Servicio a Domicilio' && !customerInfo.city) {
                            alert("Por favor ingresa tu dirección para el servicio a domicilio.");
                            return;
                          }
                          window.open(generateWhatsAppMessage(), '_blank');
                        }}
                        className="flex-1 bg-[#1EBE5D] hover:bg-[#199E4D] text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        Confirmar por WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
