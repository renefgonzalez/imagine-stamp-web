import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2, X, Store, Truck, Calendar, Clock, CreditCard, Banknote, Landmark } from 'lucide-react';
import { PANES, RELLENOS, EXTRAS } from '../constants';

interface CustomCake {
  id: string;
  pan: string;
  relleno: string;
  extras: string[];
  quantity: number;
  price: number;
}

const WHATSAPP_NUMBER = '525650469993';
const BASE_CAKE_PRICE = 550; // Precio base demostrativo

export function PasteleriaBuilder() {
  const [selectedPan, setSelectedPan] = useState<string | null>(null);
  const [selectedRelleno, setSelectedRelleno] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [cart, setCart] = useState<CustomCake[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Cart Phases: 1 = Summary, 2 = Details, 3 = Confirmation
  const [cartPhase, setCartPhase] = useState<1 | 2 | 3>(1);
  
  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'tienda' | 'domicilio' | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'spei' | 'efectivo' | 'tarjeta' | null>(null);

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const isComplete = selectedPan && selectedRelleno;
  
  // Validations
  const isPhase2Valid = 
    customerName.trim() !== '' && 
    deliveryType !== null && 
    (deliveryType === 'tienda' || deliveryAddress.trim() !== '') &&
    deliveryDate !== '' && 
    deliveryTime !== '' &&
    paymentMethod !== null;

  const handleAddToCart = () => {
    if (!isComplete) return;

    const newCake: CustomCake = {
      id: crypto.randomUUID(),
      pan: selectedPan,
      relleno: selectedRelleno,
      extras: selectedExtras,
      quantity: 1,
      price: BASE_CAKE_PRICE
    };

    setCart(prev => [...prev, newCake]);
    
    // Reset selection
    setSelectedPan(null);
    setSelectedRelleno(null);
    setSelectedExtras([]);
    
    // Show Toast
    setShowToast(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart(prev => {
      const newCart = prev.map(c => c.id === id ? { ...c, quantity: c.quantity + delta } : c);
      return newCart.filter(c => c.quantity > 0);
    });
  };

  const handleRemove = (id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  };

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const totalAmount = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const handleCheckout = () => {
    const lines = cart.map(item => {
      const panName = PANES.find(p => p.id === item.pan)?.name;
      const rellenoName = RELLENOS.find(r => r.id === item.relleno)?.name;
      const extrasNames = item.extras.map(eId => EXTRAS.find(e => e.id === eId)?.name).join(', ');
      
      return `🎂 *${item.quantity}x Pastel Personalizado*\n  • Pan: ${panName}\n  • Relleno: ${rellenoName}\n  • Extras: ${extrasNames || 'Ninguno'}`;
    }).join('\n\n');

    const name = customerName.trim();
    const deliveryStr = deliveryType === 'tienda' 
      ? 'Recoger en Tienda' 
      : `Envío a Domicilio (${deliveryAddress.trim()})`;
      
    let paymentStr = '';
    if (paymentMethod === 'spei') paymentStr = 'Transferencia SPEI';
    if (paymentMethod === 'efectivo') paymentStr = 'Efectivo contra entrega';
    if (paymentMethod === 'tarjeta') paymentStr = 'Tarjeta de Crédito/Débito en Tienda';

    const message = 
      `✨ ¡Hola Lázaro Pastelería! Me gustaría confirmar el siguiente pedido:\n\n` +
      `👤 Cliente: *${name}*\n` +
      `📅 Fecha/Hora: *${deliveryDate}* a las *${deliveryTime}*\n` +
      `🚚 Modo de Envío: *${deliveryStr}*\n` +
      `💳 Forma de Pago: *${paymentStr}*\n` +
      `------------------------------------------\n\n` +
      `Detalle del Pedido:\n${lines}\n\n` +
      `💰 *Total de la Nota:* $${totalAmount.toFixed(2)} MXN\n\n` +
      `_Pedido generado desde el constructor interactivo_ 🤍`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    setTimeout(() => {
      setCart([]);
      setCustomerName('');
      setDeliveryType(null);
      setDeliveryAddress('');
      setDeliveryDate('');
      setDeliveryTime('');
      setPaymentMethod(null);
      setIsCartOpen(false);
      setCartPhase(1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900 pb-32">
      <title>Lázaro Pastelería | Crea tu Propio Sabor</title>

      {/* HEADER MINIMALISTA */}
      <header className="px-6 pt-10 pb-6 border-b border-stone-100 flex flex-col items-center sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="w-full max-w-2xl flex justify-between items-center mb-6">
          <a href="/#/" className="text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-light">
            <ArrowLeft size={16} /> Volver
          </a>
          
          <button
            onClick={() => {
              setCartPhase(1);
              setIsCartOpen(true);
            }}
            className="relative p-2 text-stone-900 hover:opacity-70 transition-opacity"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute 0 right-0 bg-stone-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="text-center max-w-xl mx-auto mt-4">
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4 font-serif">
            Crea tu propio sabor
          </h1>
          <div className="h-px w-16 bg-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-500 font-light text-sm tracking-wide uppercase">
            Pregunta por el menú sin azúcar
          </p>
        </div>
      </header>

      {/* TOAST ALERTA DE AGREGADO */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-stone-900 text-white p-5 rounded-none shadow-2xl flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Check size={20} className="text-white" />
              </div>
              <h4 className="font-serif text-lg mb-4">¡Tu pastel personalizado ha sido agregado!</h4>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowToast(false)}
                  className="flex-1 border border-stone-600 text-stone-300 py-3 text-sm font-medium hover:bg-stone-800 transition-colors"
                >
                  Seguir Comprando
                </button>
                <button 
                  onClick={() => {
                    setShowToast(false);
                    setCartPhase(1);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 bg-white text-stone-900 py-3 text-sm font-medium hover:bg-stone-200 transition-colors"
                >
                  Ver Carrito
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONSTRUCTOR INTERACTIVO */}
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-16 relative z-10">
        
        {/* PASO 1: PAN */}
        <section>
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl text-stone-200 font-serif italic leading-none">01</span>
            <h2 className="text-2xl font-light tracking-wide">Elige tu pan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PANES.map(pan => {
              const isSelected = selectedPan === pan.id;
              return (
                <button
                  key={pan.id}
                  onClick={() => setSelectedPan(pan.id)}
                  className={`relative p-4 text-left border rounded-none transition-all duration-300 ${
                    isSelected 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xl' 
                      : 'border-stone-200 bg-transparent text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <div className="font-medium text-sm">{pan.name}</div>
                  {pan.note && (
                    <div className={`text-[10px] mt-1 italic leading-tight ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                      {pan.note}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* PASO 2: RELLENO */}
        <section>
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl text-stone-200 font-serif italic leading-none">02</span>
            <h2 className="text-2xl font-light tracking-wide">Elige tu relleno</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {RELLENOS.map(relleno => {
              const isSelected = selectedRelleno === relleno.id;
              return (
                <button
                  key={relleno.id}
                  onClick={() => setSelectedRelleno(relleno.id)}
                  className={`p-4 text-center border rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'border-stone-900 bg-stone-900 text-white shadow-md' 
                      : 'border-stone-200 bg-transparent text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span className="font-medium text-sm">{relleno.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* PASO 3: EXTRAS */}
        <section>
          <div className="flex items-end gap-4 mb-6">
            <span className="text-4xl text-stone-200 font-serif italic leading-none">03</span>
            <div>
              <h2 className="text-2xl font-light tracking-wide">Elige tu extra</h2>
              <p className="text-stone-400 text-xs uppercase tracking-widest mt-1">(Opcional)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXTRAS.map(extra => {
              const isSelected = selectedExtras.includes(extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-colors border ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50 text-stone-900 font-medium'
                      : 'border-transparent bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {extra.name} {isSelected && <Check size={14} className="inline ml-1" />}
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* FIXED ACTION BAR */}
      <AnimatePresence>
        {isComplete && !showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 right-0 z-20 flex justify-center px-4"
          >
            <button
              onClick={handleAddToCart}
              className="bg-stone-900 text-white px-8 py-4 rounded-full font-medium shadow-2xl flex items-center gap-3 hover:bg-stone-800 transition-colors"
            >
              <Plus size={20} />
              Agregar mi Creación al Pedido
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARRITO SIDEBAR - MULTI-STEP */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white border-l border-stone-200 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-white shrink-0">
                <h3 className="text-xl font-serif">
                  {cartPhase === 1 && 'Resumen del Pedido'}
                  {cartPhase === 2 && 'Datos de Entrega'}
                  {cartPhase === 3 && 'Finalizar Pedido'}
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* FASE 1: Resumen */}
              {cartPhase === 1 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-stone-400 py-10 h-full">
                        <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="font-light tracking-wide">Tu carrito está vacío.</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {cart.map(item => (
                          <div key={item.id} className="border-b border-stone-100 pb-6 last:border-0">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium text-stone-900">Pastel Personalizado</h4>
                              <button onClick={() => handleRemove(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="space-y-1 text-sm text-stone-600 mb-6 font-light">
                              <p><span className="text-stone-400 mr-2">• Pan:</span> {PANES.find(p => p.id === item.pan)?.name}</p>
                              <p><span className="text-stone-400 mr-2">• Relleno:</span> {RELLENOS.find(r => r.id === item.relleno)?.name}</p>
                              <p>
                                <span className="text-stone-400 mr-2">• Extras:</span> 
                                {item.extras.length > 0 ? item.extras.map(e => EXTRAS.find(x => x.id === e)?.name).join(', ') : 'Ninguno'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-stone-200 rounded-none">
                                <button onClick={() => handleUpdateQty(item.id, -1)} className="p-2 hover:bg-stone-50"><Minus size={14} /></button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <button onClick={() => handleUpdateQty(item.id, 1)} className="p-2 hover:bg-stone-50"><Plus size={14} /></button>
                              </div>
                              <div className="font-medium text-stone-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="p-6 bg-stone-50 border-t border-stone-100 shrink-0">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium uppercase tracking-widest text-stone-500">Total</span>
                        <span className="text-xl font-serif text-stone-900">${totalAmount.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setCartPhase(2)}
                        className="w-full bg-stone-900 text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors flex justify-center items-center gap-2"
                      >
                        Siguiente: Datos de Entrega <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* FASE 2: Datos y Pago */}
              {cartPhase === 2 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-stone-50/50">
                    
                    {/* Datos del Cliente */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-serif font-medium text-stone-900 mb-2 border-b border-stone-200 pb-2">1. Datos del Cliente</h4>
                      
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Nombre Completo *</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          placeholder="Escribe tu nombre"
                          className="w-full bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-900 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Fecha *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar size={14} className="text-stone-400" />
                            </div>
                            <input
                              type="date"
                              value={deliveryDate}
                              onChange={e => setDeliveryDate(e.target.value)}
                              className="w-full bg-white border border-stone-200 pl-9 pr-3 py-3 text-sm outline-none focus:border-stone-900 transition-colors"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Hora *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock size={14} className="text-stone-400" />
                            </div>
                            <input
                              type="time"
                              value={deliveryTime}
                              onChange={e => setDeliveryTime(e.target.value)}
                              className="w-full bg-white border border-stone-200 pl-9 pr-3 py-3 text-sm outline-none focus:border-stone-900 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modo de Envío */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-serif font-medium text-stone-900 mb-2 border-b border-stone-200 pb-2">2. Modo de Envío</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDeliveryType('tienda')}
                          className={`flex flex-col items-center justify-center p-4 border transition-all ${
                            deliveryType === 'tienda' 
                              ? 'border-stone-900 bg-stone-900 text-white' 
                              : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                          }`}
                        >
                          <Store size={20} className="mb-2" />
                          <span className="text-xs font-medium text-center leading-tight">Recoger en Tienda</span>
                        </button>
                        <button
                          onClick={() => setDeliveryType('domicilio')}
                          className={`flex flex-col items-center justify-center p-4 border transition-all ${
                            deliveryType === 'domicilio' 
                              ? 'border-stone-900 bg-stone-900 text-white' 
                              : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                          }`}
                        >
                          <Truck size={20} className="mb-2" />
                          <span className="text-xs font-medium text-center leading-tight">Envío a Domicilio</span>
                        </button>
                      </div>

                      {deliveryType === 'domicilio' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <label className="block text-xs uppercase tracking-widest text-stone-500 mt-4 mb-2">Dirección Completa *</label>
                          <textarea
                            value={deliveryAddress}
                            onChange={e => setDeliveryAddress(e.target.value)}
                            placeholder="Calle, número, colonia, referencias..."
                            className="w-full bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-900 transition-colors resize-none h-20"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Forma de Pago */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-serif font-medium text-stone-900 mb-2 border-b border-stone-200 pb-2">3. Forma de Pago</h4>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => setPaymentMethod('spei')}
                          className={`w-full flex items-center p-3 border transition-all ${paymentMethod === 'spei' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                        >
                          <Landmark size={18} className={`mr-3 ${paymentMethod === 'spei' ? 'text-stone-900' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'spei' ? 'font-medium text-stone-900' : 'text-stone-600'}`}>Transferencia SPEI</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`w-full flex items-center p-3 border transition-all ${paymentMethod === 'efectivo' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                        >
                          <Banknote size={18} className={`mr-3 ${paymentMethod === 'efectivo' ? 'text-stone-900' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'efectivo' ? 'font-medium text-stone-900' : 'text-stone-600'}`}>Efectivo contra entrega</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('tarjeta')}
                          className={`w-full flex items-center p-3 border transition-all ${paymentMethod === 'tarjeta' ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}
                        >
                          <CreditCard size={18} className={`mr-3 ${paymentMethod === 'tarjeta' ? 'text-stone-900' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'tarjeta' ? 'font-medium text-stone-900' : 'text-stone-600'}`}>Tarjeta de Crédito/Débito en Tienda</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t border-stone-100 shrink-0 flex gap-3">
                    <button
                      onClick={() => setCartPhase(1)}
                      className="px-4 py-4 border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCartPhase(3)}
                      disabled={!isPhase2Valid}
                      className="flex-1 bg-stone-900 text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                      Siguiente: Finalizar Pedido <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* FASE 3: Confirmación Final */}
              {cartPhase === 3 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-100">
                        <Check size={28} className="text-stone-900" />
                      </div>
                      <h2 className="text-2xl font-serif text-stone-900 mb-2">Casi listo, {customerName.split(' ')[0]}</h2>
                      <p className="text-sm text-stone-500 font-light">Verifica que tus datos sean correctos.</p>
                    </div>

                    <div className="bg-stone-50 p-5 border border-stone-100 space-y-4">
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Total a Pagar</span>
                        <span className="text-2xl font-serif text-stone-900">${totalAmount.toFixed(2)} MXN</span>
                      </div>
                      
                      <div className="h-px bg-stone-200 w-full" />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">A nombre de</span>
                          <span className="font-medium text-stone-900">{customerName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Fecha de Entrega</span>
                          <span className="font-medium text-stone-900">{deliveryDate} a las {deliveryTime}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Modo de Envío</span>
                          <span className="font-medium text-stone-900">
                            {deliveryType === 'tienda' ? 'Recoger en Tienda' : `Envío a Domicilio (${deliveryAddress})`}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Forma de Pago</span>
                          <span className="font-medium text-stone-900">
                            {paymentMethod === 'spei' && 'Transferencia SPEI'}
                            {paymentMethod === 'efectivo' && 'Efectivo contra entrega'}
                            {paymentMethod === 'tarjeta' && 'Tarjeta de Crédito/Débito en Tienda'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t border-stone-100 shrink-0 flex flex-col gap-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-amber-500 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex justify-center items-center gap-2"
                    >
                      Finalizar Pedido por WhatsApp <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => setCartPhase(2)}
                      className="w-full py-3 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors uppercase tracking-widest flex justify-center items-center gap-2"
                    >
                      <ArrowLeft size={16} /> Regresar y corregir
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Just a quick local icon component since ArrowRight isn't imported from lucide
function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
