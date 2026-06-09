import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2, X, Store, MapPin, Phone, Info, Facebook, Instagram, Mail, QrCode, Clock } from 'lucide-react';
import { JUICE_CATALOG, STORE_INFO, JuiceProduct, ProductType } from '../constants';

import { useJuiceStore, type CartItem } from '../store/useJuiceStore';

export default function JuiceMenu() {
  const [activeCategory, setActiveCategory] = useState<ProductType | 'todos'>('todos');
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useJuiceStore();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartStep, setCartStep] = useState<'cart' | 'details'>('cart');
  
  // Configuration Modal State
  const [selectedProduct, setSelectedProduct] = useState<JuiceProduct | null>(null);
  const [configSize, setConfigSize] = useState<string>('');
  const [configOptions, setConfigOptions] = useState<Record<string, string>>({});
  const [configNotes, setConfigNotes] = useState('');

  // Customer Info State
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    deliveryMethod: 'Envío a domicilio',
    address: '',
    notes: '',
    paymentMethod: 'Efectivo'
  });

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'jugo', label: 'Jugos' },
    { id: 'baguette', label: 'Baguettes' },
    { id: 'sandwich', label: 'Sándwiches' },
    { id: 'platillo', label: 'Platillos' },
    { id: 'ensalada', label: 'Ensaladas' },
    { id: 'bebida', label: 'Bebidas' },
  ];

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'todos') return JUICE_CATALOG;
    return JUICE_CATALOG.filter(p => p.type === activeCategory);
  }, [activeCategory]);

  const openConfigModal = (product: JuiceProduct) => {
    setSelectedProduct(product);
    // Auto-select first size if available
    if (product.prices && product.prices.length > 0) {
      setConfigSize(product.prices[0].size);
    } else {
      setConfigSize('');
    }
    // Auto-select first option choices
    const initialOptions: Record<string, string> = {};
    if (product.options) {
      product.options.forEach(opt => {
        initialOptions[opt.name] = opt.choices[0];
      });
    }
    setConfigOptions(initialOptions);
    setConfigNotes('');
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Calculate final price based on selected size or base price
    let finalPrice = selectedProduct.price;
    if (selectedProduct.prices && configSize) {
      const selectedSizeInfo = selectedProduct.prices.find(p => p.size === configSize);
      if (selectedSizeInfo) finalPrice = selectedSizeInfo.price;
    }

    const newItem: CartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: finalPrice,
      quantity: 1,
      size: configSize,
      options: configOptions,
      notes: configNotes,
      image: selectedProduct.image
    };

    addToCart(newItem);
    setSelectedProduct(null);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSendOrder = () => {
    const lines = cart.map(item => {
      let details = `  • ${item.name} x${item.quantity} = $${item.price * item.quantity}`;
      if (item.size) details += `\n    Tamaño: ${item.size}`;
      if (item.options && Object.keys(item.options).length > 0) {
        Object.entries(item.options).forEach(([k, v]) => {
          details += `\n    ${k}: ${v}`;
        });
      }
      if (item.notes) details += `\n    Notas: ${item.notes}`;
      return details;
    }).join('\n\n');

    const message = `¡Hola! Quiero hacer un pedido en Juice & Go 🥤🍉\n\n` +
      `*Mi Pedido:*\n${lines}\n\n` +
      `*Total: $${totalPrice} MXN*\n\n` +
      `*Mis Datos:*\n` +
      `👤 Nombre: ${customerInfo.name}\n` +
      `📦 Método de Envío: ${customerInfo.deliveryMethod}\n` +
      (customerInfo.deliveryMethod === 'Envío a domicilio' ? `📍 Dirección: ${customerInfo.address}\n` : '') +
      `💳 Pago: ${customerInfo.paymentMethod}` +
      (customerInfo.notes ? `\n📝 Notas extras: ${customerInfo.notes}` : '');

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
    setIsCartOpen(false);
    clearCart();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 to-green-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => window.history.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black tracking-tight">{STORE_INFO.name}</h1>
              <p className="text-xs text-emerald-100 font-medium tracking-wide">{STORE_INFO.slogan}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white text-emerald-700 rounded-full shadow-md hover:scale-105 transition-transform"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>
        </div>
        
        {/* Categories Tabs */}
        <div className="max-w-5xl mx-auto px-2 overflow-x-auto hide-scrollbar pb-1">
          <div className="flex gap-2 p-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  activeCategory === cat.id 
                    ? 'bg-amber-500 text-white shadow-amber-500/30' 
                    : 'bg-white/10 text-emerald-50 hover:bg-white/20'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Store size={48} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-black text-emerald-700 shadow-sm">
                    ${product.price}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">{product.description}</p>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <button 
                      onClick={() => openConfigModal(product)}
                      className="w-full py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2"
                    >
                      <Plus size={16} /> AGREGAR
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Logo & Redes */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-emerald-500">
              <Store size={40} />
              <div>
                <h3 className="text-xl font-black text-white">{STORE_INFO.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest">{STORE_INFO.slogan}</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              Tu destino ideal para disfrutar de la energía más natural. Los mejores jugos, baguettes y ensaladas preparados al momento para tu bienestar.
            </p>
            <div className="pt-4">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3">Síguenos en Redes</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Contacto */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Contacto</h4>
            <div className="space-y-3 text-sm">
              <a href={`https://wa.me/${STORE_INFO.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-emerald-400 transition-colors">
                <div className="text-emerald-500"><Phone size={16} /></div>
                <span>WhatsApp Pedidos: {STORE_INFO.whatsapp}</span>
              </a>
              <div className="flex items-center gap-3">
                <div className="text-amber-500"><Phone size={16} /></div>
                <span>Teléfono: 442 269 3751</span>
              </div>
              <a href="mailto:contacto@juiceandgo.com" className="flex items-center gap-3 hover:text-amber-400 transition-colors">
                <div className="text-amber-500"><Mail size={16} /></div>
                <span>contacto@juiceandgo.com</span>
              </a>
            </div>
            <button className="mt-6 w-full py-3 bg-transparent border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
              <QrCode size={18} /> Compartir Catálogo por QR
            </button>
          </div>

          {/* Col 3: Ubicación y Horarios */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4">Ubicación y Horarios</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="text-pink-500 mt-1"><MapPin size={16} /></div>
                <span className="leading-relaxed">{STORE_INFO.address}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-slate-400 mt-1"><Clock size={16} /></div>
                <span>Lun – Sáb: 7:00 AM – 4:00 PM<br/>Domingo: Cerrado</span>
              </div>
            </div>
          </div>

        </div>

        {/* Derechos y Privacidad */}
        <div className="max-w-5xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {STORE_INFO.name}. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-emerald-400 transition-colors">Aviso de Privacidad</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Términos y Condiciones</a>
          </div>
          <p>Creado por <span className="font-bold text-amber-500">Imagine & Stamp</span></p>
        </div>
      </footer>

      {/* Config Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-lg text-slate-800 truncate pr-4">{selectedProduct.name}</h3>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-slate-200 rounded-full bg-white shadow-sm text-slate-500">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                {/* Tamaños / Precios Múltiples */}
                {selectedProduct.prices && selectedProduct.prices.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      Selecciona el tamaño
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedProduct.prices.map(p => (
                        <label 
                          key={p.size}
                          className={`flex flex-col p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            configSize === p.size 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-slate-100 hover:border-emerald-200'
                          }`}
                        >
                          <input 
                            type="radio" name="size" value={p.size} 
                            checked={configSize === p.size} 
                            onChange={(e) => setConfigSize(e.target.value)} 
                            className="hidden" 
                          />
                          <span className="text-sm font-bold text-slate-700">{p.size}</span>
                          <span className="text-emerald-600 font-black">${p.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Opciones Especiales */}
                {selectedProduct.options && selectedProduct.options.map(opt => (
                  <div key={opt.name}>
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                      {opt.name} {opt.required && <span className="bg-red-100 text-red-600 text-[9px] uppercase px-2 py-0.5 rounded-full">Requerido</span>}
                    </h4>
                    <div className="flex flex-col gap-2">
                      {opt.choices.map(choice => (
                        <label key={choice} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                          <span className="text-sm font-medium text-slate-700">{choice}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${configOptions[opt.name] === choice ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                            {configOptions[opt.name] === choice && <Check size={12} className="text-white" />}
                          </div>
                          <input 
                            type="radio" className="hidden"
                            name={opt.name} value={choice}
                            checked={configOptions[opt.name] === choice}
                            onChange={(e) => setConfigOptions(prev => ({...prev, [opt.name]: e.target.value}))}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Notas */}
                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Notas especiales</h4>
                  <textarea 
                    value={configNotes}
                    onChange={(e) => setConfigNotes(e.target.value)}
                    placeholder="Ej. Sin cebolla, extra aderezo..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-20"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white">
                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex justify-center items-center gap-2"
                >
                  <ShoppingBag size={18} /> AÑADIR A LA ORDEN • $
                  {configSize && selectedProduct.prices 
                    ? selectedProduct.prices.find(p => p.size === configSize)?.price 
                    : selectedProduct.price}
                </button>
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
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-emerald-700 text-white">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <ShoppingBag size={20} /> Mi Orden
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <ShoppingBag size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Tu orden está vacía</h3>
                  <p className="text-sm text-slate-500 mb-6">Agrega deliciosos jugos y baguettes para comenzar.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-colors"
                  >
                    Ver el Menú
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-slate-50">
                    {cartStep === 'cart' ? (
                      <div className="space-y-3">
                        {cart.map(item => (
                          <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3 relative group">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-sm"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm truncate">{item.name}</h4>
                                <div className="text-[10px] text-slate-500 mt-0.5 space-y-0.5">
                                  {item.size && <p>• {item.size}</p>}
                                  {item.options && Object.entries(item.options).map(([k, v]) => (
                                    <p key={k}>• {v}</p>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="font-black text-emerald-600 text-sm">${item.price}</span>
                                <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded text-slate-600 shadow-sm"><Minus size={12} /></button>
                                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded text-slate-600 shadow-sm"><Plus size={12} /></button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          onClick={() => setCartStep('cart')}
                          className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline mb-2"
                        >
                          <ArrowLeft size={14} /> Volver al resumen
                        </button>
                        
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Tu Nombre</label>
                            <input 
                              type="text" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                              placeholder="Ej. Juan Pérez"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Teléfono (WhatsApp)</label>
                            <input 
                              type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                              placeholder="10 dígitos"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Método de Envío *</label>
                            <select 
                              value={customerInfo.deliveryMethod} onChange={e => setCustomerInfo({...customerInfo, deliveryMethod: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Envío a domicilio">🏠 Envío a domicilio</option>
                              <option value="Recoger en tienda">🏪 Recoger en tienda</option>
                              <option value="Por confirmar">⏳ Por confirmar</option>
                            </select>
                          </div>
                          
                          {customerInfo.deliveryMethod === 'Envío a domicilio' && (
                            <div>
                              <label className="text-xs font-bold text-slate-700 mb-1 block">Dirección de Entrega *</label>
                              <input 
                                type="text" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                                placeholder="Calle, Número, Colonia"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                              />
                            </div>
                          )}
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Forma de Pago</label>
                            <select 
                              value={customerInfo.paymentMethod} onChange={e => setCustomerInfo({...customerInfo, paymentMethod: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Efectivo">Efectivo</option>
                              <option value="Transferencia">Transferencia</option>
                              <option value="Tarjeta a la entrega">Tarjeta a la entrega</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 mb-1 block">Notas para la entrega (Opcional)</label>
                            <textarea 
                              value={customerInfo.notes} onChange={e => setCustomerInfo({...customerInfo, notes: e.target.value})}
                              placeholder="Ej. Tocar el timbre, dejar en recepción..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 h-16 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-slate-100 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-500">Total a Pagar</span>
                      <span className="text-2xl font-black text-emerald-700">${totalPrice}</span>
                    </div>
                    
                    {cartStep === 'cart' ? (
                      <button 
                        onClick={() => setCartStep('details')}
                        className="w-full py-3.5 bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-700/30 hover:bg-emerald-800 transition-colors flex justify-center items-center gap-2"
                      >
                        CONTINUAR <ArrowLeft size={18} className="rotate-180" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSendOrder}
                        disabled={!customerInfo.name || (customerInfo.deliveryMethod === 'Envío a domicilio' && !customerInfo.address)}
                        className="w-full py-3.5 bg-amber-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-colors flex justify-center items-center gap-2"
                      >
                        <Check size={18} /> ENVIAR PEDIDO
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
