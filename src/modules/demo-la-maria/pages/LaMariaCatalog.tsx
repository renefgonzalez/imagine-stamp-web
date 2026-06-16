import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, MessageCircle, ChevronRight, Check, Search } from 'lucide-react';
import { CATEGORIES, PRODUCTS, COMPANY_INFO, Product } from '../constants';

// Mismos tipos que usamos en los otros módulos
interface CartItem extends Product {
  quantity: number;
}

export default function LaMariaCatalog() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);

  // Formulario de checkout avanzado
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    shippingMethod: 'Selecciona una opción',
    address: '',
    paymentMethod: 'Selecciona una opción',
    notes: '',
    coupon: ''
  });

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Costo extra de Recoger en Tienda
  const shippingCost = customerInfo.shippingMethod === 'Recoger en tienda' ? 50 : 0;
  const finalTotal = cartTotalPrice + shippingCost;

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const handleCheckout = () => {
    let orderDetails = `*NUEVO PEDIDO - ${COMPANY_INFO.name}* 🥂\n\n`;
    orderDetails += `*DATOS DEL CLIENTE:*\n`;
    orderDetails += `👤 Nombre: ${customerInfo.name}\n`;
    orderDetails += `📱 WhatsApp: ${customerInfo.phone}\n`;
    orderDetails += `🚚 Entrega: ${customerInfo.shippingMethod}\n`;
    if (customerInfo.shippingMethod === 'Envío a domicilio') {
      orderDetails += `📍 Dirección: ${customerInfo.address}\n`;
    }
    orderDetails += `💳 Pago: ${customerInfo.paymentMethod}\n`;
    if (customerInfo.coupon) orderDetails += `🎟️ Cupón: ${customerInfo.coupon}\n`;
    if (customerInfo.notes) orderDetails += `📝 Notas: ${customerInfo.notes}\n`;
    
    orderDetails += `\n*PEDIDO:*\n`;
    cart.forEach(item => {
      orderDetails += `▪ ${item.quantity}x ${item.name} - $${item.price * item.quantity}\n`;
    });
    
    orderDetails += `\n*TOTALES:*\n`;
    orderDetails += `Subtotal: $${cartTotalPrice.toFixed(2)}\n`;
    if (shippingCost > 0) orderDetails += `Costo extra (${customerInfo.shippingMethod}): +$${shippingCost.toFixed(2)}\n`;
    orderDetails += `*Total a pagar: $${finalTotal.toFixed(2)}*\n\n`;
    
    orderDetails += `¡Gracias por tu preferencia!`;
    
    const encodedText = encodeURIComponent(orderDetails);
    window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodedText}`, '_blank');
  };

  const [searchQuery, setSearchQuery] = useState('');

  const activeProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory = p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div 
      className="min-h-screen font-sans text-gray-200"
      style={{
        backgroundColor: '#181818',
        backgroundImage: `url("https://www.transparenttextures.com/patterns/concrete-wall.png")`
      }}
    >
      
      {/* HEADER ELEGANTE */}
      <header className="sticky top-0 z-40 bg-[#181818]/95 backdrop-blur-md border-b border-[#C5A059]/20 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex-shrink-0 text-center sm:text-left">
            <h1 className="text-2xl font-serif text-[#C5A059] font-bold tracking-widest uppercase">La María</h1>
            <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Rooftop & Restaurant</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Buscar platillos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111] border border-[#222] focus:border-[#C5A059] rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-colors"
              />
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#111] rounded-full border border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-colors shrink-0"
            >
              <ShoppingBag size={20} />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartTotalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* NAVEGACIÓN CATEGORÍAS */}
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden bg-[#0F0F0F] border-t border-[#1A1A1A]">
          <div className="flex px-4 py-3 gap-6 w-max">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center gap-1.5 transition-all px-2 ${
                  activeCategory === category.id 
                    ? 'text-[#C5A059] opacity-100' 
                    : 'text-gray-500 opacity-60 hover:opacity-100'
                }`}
              >
                <span className={`text-xl transition-transform ${activeCategory === category.id ? 'scale-110 drop-shadow-md' : ''}`}>{category.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                  {category.name}
                </span>
                {activeCategory === category.id && (
                  <motion.div 
                    layoutId="activeCategoryLaMaria"
                    className="h-0.5 bg-[#C5A059] w-full mt-1 rounded-full shadow-[0_0_8px_rgba(197,160,89,0.5)]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CATÁLOGO MAIN */}
      <main className="container mx-auto px-4 py-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {activeProducts.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#111] rounded-2xl overflow-hidden border border-[#222] hover:border-[#C5A059]/40 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-[#C5A059]/10"
                onClick={() => setSelectedProductDetails(product)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {product.popular && (
                    <div className="absolute top-3 right-3 bg-[#C5A059] text-black text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md">
                      Popular
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-sans font-bold text-lg text-white mb-1 drop-shadow-md tracking-wider uppercase leading-snug">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-[#C5A059] font-medium text-lg drop-shadow-md">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-widest font-sans">{CATEGORIES.find(c => c.id === product.category)?.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#111]">
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-4 font-serif font-light italic">
                    {product.description}
                  </p>
                  
                  <button 
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-full py-2.5 bg-transparent border border-[#333] group-hover:border-[#C5A059] text-gray-300 group-hover:text-[#C5A059] rounded-lg transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Plus size={14} />
                    Añadir al Carrito
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#111111] border-t border-[#C5A059]/20 pt-16 pb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A059]/5 via-transparent to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-[#C5A059] font-serif text-3xl font-bold uppercase tracking-[0.3em] mb-4">{COMPANY_INFO.name}</h2>
          <p className="text-gray-400 text-sm mb-2 font-light tracking-wide">{COMPANY_INFO.address}</p>
          <p className="text-gray-400 text-sm mb-8 font-light tracking-wide">{COMPANY_INFO.schedule}</p>
          
          <div className="flex justify-center gap-8 mb-10">
            <a href={COMPANY_INFO.social.facebook} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#C5A059] hover:scale-110 transition-all">
              <span className="text-sm font-medium uppercase tracking-widest">Facebook</span>
            </a>
            <a href={COMPANY_INFO.social.instagram} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#C5A059] hover:scale-110 transition-all">
              <span className="text-sm font-medium uppercase tracking-widest">Instagram</span>
            </a>
            <a href={COMPANY_INFO.social.tiktok} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#C5A059] hover:scale-110 transition-all">
              <span className="text-sm font-medium uppercase tracking-widest">TikTok</span>
            </a>
          </div>
          <div className="w-24 h-px bg-[#C5A059]/30 mx-auto mb-8" />
          <p className="text-gray-600 text-xs font-light tracking-wider">© {new Date().getFullYear()} {COMPANY_INFO.name}. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </footer>

      {/* MODAL DETALLES DEL PRODUCTO */}
      <AnimatePresence>
        {selectedProductDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProductDetails(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A1A1A] rounded-2xl overflow-hidden max-w-md w-full border border-[#C5A059]/30 shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProductDetails(null)}
                className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="h-64 relative">
                <img 
                  src={selectedProductDetails.image} 
                  alt={selectedProductDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-sans font-bold text-white leading-tight uppercase tracking-wide">{selectedProductDetails.name}</h2>
                  <span className="text-xl font-bold text-[#C5A059] ml-4">${selectedProductDetails.price.toFixed(2)}</span>
                </div>
                
                <div className="max-h-32 overflow-y-auto pr-2 mb-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#1A1A1A] [&::-webkit-scrollbar-thumb]:bg-[#C5A059]/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <p className="text-gray-300 leading-relaxed text-sm font-serif font-light italic">
                    {selectedProductDetails.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    handleAddToCart(selectedProductDetails);
                    setSelectedProductDetails(null);
                  }}
                  className="w-full py-4 bg-[#C5A059] text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Agregar al Carrito
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARRITO PANEL LATERAL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#121212] h-full shadow-2xl flex flex-col border-l border-[#333]"
            >
              <div className="p-5 border-b border-[#333] flex justify-between items-center bg-[#1A1A1A]">
                <h2 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="text-[#C5A059]" />
                  Tu Pedido
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4">
                    <ShoppingBag size={48} className="opacity-20" />
                    <p>Tu carrito está vacío</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-[#1A1A1A] p-3 rounded-xl border border-[#333]">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm line-clamp-1 uppercase tracking-wide font-sans">{item.name}</h4>
                            <p className="text-[#C5A059] font-medium text-sm">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#333] text-white hover:bg-[#444]"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="font-bold text-white w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleAddToCart(item)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#333] text-white hover:bg-[#444]"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-5 bg-[#1A1A1A] border-t border-[#333]">
                  <div className="flex justify-between text-white text-lg font-bold mb-4">
                    <span>Subtotal</span>
                    <span className="text-[#C5A059]">${cartTotalPrice.toFixed(2)}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full py-4 bg-[#C5A059] text-black rounded-xl font-bold uppercase tracking-wider hover:bg-[#C5A059] transition-colors flex items-center justify-center gap-2"
                  >
                    Proceder al Checkout
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL PROFESIONAL AVANZADO */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl bg-[#1A1A1A] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[#C5A059]/30 max-h-[90vh]"
            >
              <div className="p-4 bg-[#222] border-b border-[#333] flex justify-between items-center">
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <ShoppingBag size={24} className="text-[#C5A059]" />
                  Checkout
                </h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-[#C5A059]">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#1A1A1A] [&::-webkit-scrollbar-thumb]:bg-[#333]">
                {/* Resumen del Pedido */}
                <div>
                  <h4 className="text-[#C5A059] font-bold mb-3 uppercase text-xs tracking-widest border-b border-[#333] pb-2">Resumen de tu Orden</h4>
                  <div className="space-y-2 mt-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-gray-300 text-sm">
                        <span className="font-sans uppercase text-xs">{item.name} <span className="text-gray-500 text-xs ml-1">x{item.quantity}</span></span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Datos del Cliente */}
                <div>
                  <h4 className="text-[#C5A059] font-bold mb-3 uppercase text-xs tracking-widest border-b border-[#333] pb-2">Datos de Contacto</h4>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Nombre Completo *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Teléfono WhatsApp *</label>
                      <input 
                        type="tel" 
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white"
                        placeholder="Para confirmar tu pedido"
                      />
                    </div>
                  </div>
                </div>

                {/* Entrega y Pago */}
                <div>
                  <h4 className="text-[#C5A059] font-bold mb-3 uppercase text-xs tracking-widest border-b border-[#333] pb-2">Entrega y Pago</h4>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Método de Entrega *</label>
                      <select 
                        value={customerInfo.shippingMethod}
                        onChange={e => setCustomerInfo(p => ({ ...p, shippingMethod: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white appearance-none"
                      >
                        <option value="Selecciona una opción" disabled>Selecciona una opción</option>
                        <option value="Envío a domicilio">🛵 Envío a domicilio</option>
                        <option value="Recoger en tienda">🏢 Recoger en tienda (+$50)</option>
                        <option value="Entrega digital">📱 Entrega digital</option>
                        <option value="Por confirmar">⏳ Por confirmar</option>
                      </select>
                    </div>

                    {customerInfo.shippingMethod === 'Envío a domicilio' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase mt-2">Dirección de Envío *</label>
                        <textarea 
                          value={customerInfo.address}
                          onChange={e => setCustomerInfo(p => ({ ...p, address: e.target.value }))}
                          className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white resize-none"
                          rows={2}
                          placeholder="Calle, número, colonia, referencias..."
                        />
                      </motion.div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Forma de Pago *</label>
                      <select 
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo(p => ({ ...p, paymentMethod: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white appearance-none"
                      >
                        <option value="Selecciona una opción" disabled>Selecciona una opción</option>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Tarjeta">💳 Tarjeta (Terminal)</option>
                        <option value="Transferencia">🏦 Transferencia / Depósito</option>
                        <option value="Por confirmar">⏳ Por Confirmar</option>
                      </select>
                    </div>

                    {customerInfo.paymentMethod === 'Transferencia' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} 
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#222] border border-[#333] rounded-lg p-4 mt-2"
                      >
                        <p className="text-[#C5A059] text-xs font-bold mb-2 uppercase">Datos para Transferencia</p>
                        <p className="text-sm text-gray-300">Banco: <span className="text-white">Santander</span></p>
                        <p className="text-sm text-gray-300">Titular: <span className="text-white">La María Rooftop SA de CV</span></p>
                        <p className="text-sm text-gray-300">CLABE: <span className="text-white font-mono">014320012345678901</span></p>
                        <p className="text-xs text-[#C5A059] mt-3 flex items-start gap-1">
                          <Check size={14} className="mt-0.5" />
                          Comparte tu comprobante por WhatsApp al finalizar
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Extras */}
                <div>
                  <h4 className="text-[#C5A059] font-bold mb-3 uppercase text-xs tracking-widest border-b border-[#333] pb-2">Extras</h4>
                  <div className="space-y-4 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Cupón de Descuento</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customerInfo.coupon}
                          onChange={e => setCustomerInfo(p => ({ ...p, coupon: e.target.value.toUpperCase() }))}
                          className="flex-1 px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white uppercase"
                          placeholder="CÓDIGO"
                        />
                        <button className="bg-[#222] border border-[#333] px-4 rounded-lg text-[#C5A059] hover:bg-[#333] font-bold text-sm">
                          Aplicar
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1 uppercase">Notas Adicionales</label>
                      <textarea 
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo(p => ({ ...p, notes: e.target.value }))}
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333] rounded-lg focus:outline-none focus:border-[#C5A059] text-white resize-none"
                        rows={2}
                        placeholder="Término de la carne, alergias, sin cebolla..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón y Totales */}
              <div className="p-6 bg-[#222] border-t border-[#333]">
                <button 
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full text-center text-gray-400 text-xs font-bold hover:text-[#C5A059] transition-colors mb-6 uppercase flex items-center justify-center gap-1 tracking-widest"
                >
                  ← Volver al Carrito
                </button>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-400 font-medium text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotalPrice.toFixed(2)}</span>
                  </div>
                  {shippingCost > 0 && (
                    <div className="flex justify-between text-[#C5A059] text-sm font-medium border-b border-[#333] pb-3">
                      <span>Costo por recoger</span>
                      <span>+${shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white text-lg font-bold pt-2">
                    <span className="uppercase tracking-widest">Total</span>
                    <span className="text-[#C5A059] text-xl">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={
                    !customerInfo.name || 
                    !customerInfo.phone || 
                    customerInfo.shippingMethod === 'Selecciona una opción' || 
                    (customerInfo.shippingMethod === 'Envío a domicilio' && !customerInfo.address) ||
                    customerInfo.paymentMethod === 'Selecciona una opción'
                  }
                  className="w-full py-4 bg-[#1EBE5D] text-white rounded-xl font-bold text-lg hover:bg-[#179B4A] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(30,190,93,0.3)] tracking-wide"
                >
                  <MessageCircle size={22} className="fill-white" />
                  Finalizar Pedido vía WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
