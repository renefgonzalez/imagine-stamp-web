import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2, X, Store, Truck, Calendar, Clock, CreditCard, Banknote, Landmark, Instagram, Facebook, MapPin, Phone, Lock } from 'lucide-react';
import { useCatalog } from '../constants';
import logoLazaro from '../assets/logo-lazaro.png';

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
  const { panes: PANES, rellenos: RELLENOS, extras: EXTRAS } = useCatalog();
  const [selectedPan, setSelectedPan] = useState<string | null>(null);
  const [selectedRelleno, setSelectedRelleno] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [cart, setCart] = useState<CustomCake[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [cartPhase, setCartPhase] = useState<1 | 2 | 3>(1);
  
  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'tienda' | 'domicilio' | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'spei' | 'efectivo' | 'tarjeta' | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    const originalOgTitle = ogTitle ? ogTitle.getAttribute('content') : null;
    const originalOgDesc = ogDesc ? ogDesc.getAttribute('content') : null;
    const originalOgImage = ogImage ? ogImage.getAttribute('content') : null;

    document.title = 'Lázaro Pastelería 🍰 | Crea tu propio sabor';
    
    if (ogTitle) ogTitle.setAttribute('content', 'Lázaro Pastelería 🍰 | Crea tu propio sabor');
    if (ogDesc) ogDesc.setAttribute('content', 'Diseña tu pastel personalizado desde nuestro menú digital interactivo y ordénalo directo por WhatsApp.');
    if (ogImage) ogImage.setAttribute('content', logoLazaro);

    return () => {
      document.title = originalTitle;
      if (ogTitle && originalOgTitle) ogTitle.setAttribute('content', originalOgTitle);
      if (ogDesc && originalOgDesc) ogDesc.setAttribute('content', originalOgDesc);
      if (ogImage && originalOgImage) ogImage.setAttribute('content', originalOgImage);
    };
  }, []);

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const isComplete = selectedPan && selectedRelleno;
  
  const isPhase2Valid = 
    customerName.trim() !== '' && 
    deliveryType !== null && 
    (deliveryType === 'tienda' || deliveryAddress.trim() !== '') &&
    deliveryDate !== '' && 
    deliveryTime !== '' &&
    paymentMethod !== null;

  const handleAddToCart = () => {
    if (!isComplete) return;

    const panPrice = PANES.find(p => p.id === selectedPan)?.price || 0;
    const rellenoPrice = RELLENOS.find(r => r.id === selectedRelleno)?.price || 0;
    const extrasPrice = selectedExtras.reduce((acc, eId) => acc + (EXTRAS.find(e => e.id === eId)?.price || 0), 0);
    const totalPrice = BASE_CAKE_PRICE + panPrice + rellenoPrice + extrasPrice;

    const newCake: CustomCake = {
      id: crypto.randomUUID(),
      pan: selectedPan,
      relleno: selectedRelleno,
      extras: selectedExtras,
      quantity: 1,
      price: totalPrice
    };

    setCart(prev => [...prev, newCake]);
    
    setSelectedPan(null);
    setSelectedRelleno(null);
    setSelectedExtras([]);
    
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
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-32 selection:bg-rose-200">
      <title>Lázaro Pastelería | Crea tu Propio Sabor</title>

      {/* HEADER MINIMALISTA CON SOMBRA SUTIL */}
      <header className="px-6 pt-10 pb-6 border-b border-stone-200 border-dashed flex flex-col items-center sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="w-full max-w-2xl flex justify-end items-center mb-6">
          <button
            onClick={() => {
              setCartPhase(1);
              setIsCartOpen(true);
            }}
            className="relative p-2 text-stone-900 hover:opacity-70 transition-opacity"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute 0 right-0 bg-amber-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-sm shadow-amber-500/30">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <div className="text-center max-w-xl mx-auto mt-4">
          <img src={logoLazaro} alt="Lázaro Pastelería" className="h-20 mx-auto mb-4 drop-shadow-sm" />
          <div className="h-px w-16 bg-amber-200 mx-auto mb-4"></div>
          <p className="text-stone-500 font-light text-sm tracking-wide uppercase flex items-center justify-center gap-2">
            Pregunta por el menú <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-widest border border-teal-100">Sin Azúcar</span>
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
            <div className="bg-white text-stone-900 p-5 rounded-3xl shadow-[0_20px_50px_rgb(0,0,0,0.08)] flex flex-col items-center text-center border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-3 text-amber-500">
                <Check size={20} />
              </div>
              <h4 className="font-serif text-lg mb-4 text-stone-800">¡Tu pastel personalizado ha sido agregado!</h4>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowToast(false)}
                  className="flex-1 border border-stone-200 text-stone-600 py-3 text-sm font-medium hover:bg-stone-50 hover:border-stone-300 transition-colors rounded-xl"
                >
                  Seguir Comprando
                </button>
                <button 
                  onClick={() => {
                    setShowToast(false);
                    setCartPhase(1);
                    setIsCartOpen(true);
                  }}
                  className="flex-1 bg-stone-900 text-white py-3 text-sm font-medium hover:bg-stone-800 transition-colors rounded-xl shadow-lg shadow-stone-900/20"
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
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-amber-100 font-serif italic leading-none">01</span>
            <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu pan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PANES.map(pan => {
              const isSelected = selectedPan === pan.id;
              return (
                <button
                  key={pan.id}
                  onClick={() => setSelectedPan(pan.id)}
                  className={`relative p-5 text-left rounded-2xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-amber-300 bg-rose-50/60 shadow-sm' 
                      : 'border-transparent bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className={`font-medium text-sm ${isSelected ? 'text-amber-900' : ''}`}>
                    {pan.name}
                    {pan.price > 0 && <span className="block text-xs text-amber-600/80 mt-0.5">(+${pan.price})</span>}
                  </div>
                  {pan.note && (
                    <div className={`text-[10px] mt-2 leading-tight px-2 py-1 rounded-md inline-block ${isSelected ? 'bg-white/60 text-amber-700' : 'bg-stone-200/50 text-stone-500'}`}>
                      {pan.note}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-white p-1 rounded-full shadow-sm">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Separador Ondulado */}
        <div className="flex justify-center">
          <div className="w-24 h-px border-t border-dashed border-stone-300"></div>
        </div>

        {/* PASO 2: RELLENO */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-rose-100 font-serif italic leading-none">02</span>
            <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu relleno</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {RELLENOS.map(relleno => {
              const isSelected = selectedRelleno === relleno.id;
              return (
                <button
                  key={relleno.id}
                  onClick={() => setSelectedRelleno(relleno.id)}
                  className={`p-4 text-center rounded-2xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-amber-300 bg-amber-50/60 shadow-sm text-amber-900' 
                      : 'border-transparent bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <span className="font-medium text-sm block">
                    {relleno.name}
                    {relleno.price > 0 && <span className="block text-xs text-amber-600/80 mt-0.5">(+${relleno.price})</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Separador Ondulado */}
        <div className="flex justify-center">
          <div className="w-24 h-px border-t border-dashed border-stone-300"></div>
        </div>

        {/* PASO 3: EXTRAS */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-amber-100 font-serif italic leading-none">03</span>
            <div>
              <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu extra</h2>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-1 font-medium bg-stone-50 inline-block px-2 py-0.5 rounded-full border border-stone-100">(Opcional)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {EXTRAS.map(extra => {
              const isSelected = selectedExtras.includes(extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`px-5 py-2.5 text-sm rounded-full transition-all border-2 ${
                    isSelected
                      ? 'border-amber-300 bg-rose-50/60 text-amber-900 font-medium shadow-sm'
                      : 'border-transparent bg-stone-50 text-stone-500 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  {extra.name} {extra.price > 0 && <span className="opacity-70">(+${extra.price})</span>} {isSelected && <Check size={14} className="inline ml-1 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* FOOTER BOUTIQUE */}
      <footer className="bg-white border-t border-stone-200 border-dashed mt-20 pt-16 pb-32 px-6 relative z-10 shadow-[0_-10px_30px_rgb(0,0,0,0.01)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <img src={logoLazaro} alt="Lázaro Pastelería" className="h-16 mb-4 opacity-90 grayscale hover:grayscale-0 transition-all duration-500" />
            <p className="text-stone-500 font-serif italic text-lg mb-2">Crea tu propio sabor</p>
            <p className="text-stone-400 text-xs font-light">Pastelería artesanal de alta gama. Cada creación es única y elaborada con ingredientes premium.</p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-stone-800 font-medium uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <Phone size={14} className="text-amber-500" /> Contacto
            </h4>
            <div className="space-y-3 text-sm text-stone-500 font-light">
              <p>Pedidos por WhatsApp:</p>
              <p className="font-medium text-stone-700">+52 56 5046 9993</p>
              <div className="w-8 h-px bg-stone-200 my-2 mx-auto md:mx-0"></div>
              <p>Lunes a Sábado: 9:00 - 20:00</p>
              <p>Domingo: 10:00 - 15:00</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-stone-800 font-medium uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <MapPin size={14} className="text-amber-500" /> Ubicación
            </h4>
            <div className="space-y-4 text-sm text-stone-500 font-light">
              <p>Av. Reforma 123, Col. Centro<br/>Ciudad de México, CP 06000</p>
              
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-100">
                  <Instagram size={16} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-100">
                  <Facebook size={16} />
                </a>
              </div>
            </div>
          </div>

        </div>
        <div className="max-w-4xl mx-auto mt-16 pt-8 border-t border-stone-100 text-center flex flex-col items-center space-y-3">
          <p className="text-stone-400 text-[10px] uppercase tracking-widest">
            © 2026 LÁZARO PASTELERÍA. TODOS LOS DERECHOS RESERVADOS.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-stone-400 font-light">
            <p>
              Página web realizada por <a href="/#/" className="font-bold text-[#FF6B00] hover:opacity-80 transition-opacity cursor-pointer">IMAGINE & STAMP</a>
            </p>
            <span className="hidden sm:inline text-stone-200">|</span>
            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-amber-500 transition-colors">Aviso de Privacidad y Términos de Servicio</button>
          </div>
          <a href="/#/lazaro-pasteleria/admin" className="pt-2 flex flex-col items-center justify-center text-stone-300 hover:text-amber-500 transition-colors cursor-pointer group">
            <Lock size={12} className="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </footer>


      {/* FIXED ACTION BAR */}
      <AnimatePresence>
        {isComplete && !showToast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-0 right-0 z-20 flex justify-center px-4"
          >
            <button
              onClick={handleAddToCart}
              className="bg-stone-900 text-white px-8 py-4 rounded-full font-medium shadow-[0_20px_40px_rgb(0,0,0,0.15)] flex items-center gap-3 hover:bg-stone-800 transition-all hover:scale-105 active:scale-95"
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
              className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-[#FDFBF7] border-l border-stone-200 z-50 flex flex-col shadow-2xl rounded-l-3xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200 border-dashed flex justify-between items-center bg-white shrink-0 relative z-10 shadow-sm">
                <h3 className="text-xl font-serif text-stone-800">
                  {cartPhase === 1 && 'Resumen del Pedido'}
                  {cartPhase === 2 && 'Datos de Entrega'}
                  {cartPhase === 3 && 'Finalizar Pedido'}
                </h3>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors bg-stone-50 p-2 rounded-full hover:bg-stone-100">
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              {/* FASE 1: Resumen */}
              {cartPhase === 1 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-stone-400 py-10 h-full">
                        <ShoppingBag size={48} strokeWidth={1} className="mb-4 opacity-30 text-stone-300" />
                        <p className="font-light tracking-wide">Tu carrito está vacío.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cart.map(item => (
                          <div key={item.id} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-medium text-stone-800 font-serif text-lg">Pastel Personalizado</h4>
                              <button onClick={() => handleRemove(item.id)} className="text-stone-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="space-y-2 text-sm text-stone-600 mb-6 font-light bg-[#FDFBF7] p-4 rounded-2xl border border-stone-100/50">
                              <p><span className="text-amber-700/60 font-medium mr-2">Pan:</span> {PANES.find(p => p.id === item.pan)?.name}</p>
                              <div className="h-px border-t border-dashed border-stone-200"></div>
                              <p><span className="text-amber-700/60 font-medium mr-2">Relleno:</span> {RELLENOS.find(r => r.id === item.relleno)?.name}</p>
                              <div className="h-px border-t border-dashed border-stone-200"></div>
                              <p>
                                <span className="text-amber-700/60 font-medium mr-2">Extras:</span> 
                                {item.extras.length > 0 ? item.extras.map(e => EXTRAS.find(x => x.id === e)?.name).join(', ') : 'Ninguno'}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center bg-stone-50 rounded-full border border-stone-100 p-1">
                                <button onClick={() => handleUpdateQty(item.id, -1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-stone-500"><Minus size={14} /></button>
                                <span className="w-8 text-center text-sm font-medium text-stone-800">{item.quantity}</span>
                                <button onClick={() => handleUpdateQty(item.id, 1)} className="p-1.5 hover:bg-white rounded-full transition-colors text-stone-500"><Plus size={14} /></button>
                              </div>
                              <div className="font-medium text-stone-900 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-100">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="p-6 bg-white border-t border-stone-200 border-dashed shrink-0 shadow-[0_-10px_30px_rgb(0,0,0,0.02)] relative z-10">
                      <div className="flex justify-between items-center mb-5 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                        <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Total</span>
                        <span className="text-2xl font-serif text-stone-800">${totalAmount.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => setCartPhase(2)}
                        className="w-full bg-stone-900 text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-all rounded-2xl flex justify-center items-center gap-2 shadow-lg shadow-stone-900/10"
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
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Datos del Cliente */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100">
                      <h4 className="text-sm font-serif font-medium text-stone-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">1</span> 
                        Datos del Cliente
                      </h4>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Nombre Completo *</label>
                          <input
                            type="text"
                            value={customerName}
                            onChange={e => setCustomerName(e.target.value)}
                            placeholder="Escribe tu nombre"
                            className="w-full bg-stone-50 border border-transparent px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all rounded-xl"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Fecha *</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar size={14} className="text-stone-400" />
                              </div>
                              <input
                                type="date"
                                value={deliveryDate}
                                onChange={e => setDeliveryDate(e.target.value)}
                                className="w-full bg-stone-50 border border-transparent pl-9 pr-3 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all rounded-xl"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Hora *</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock size={14} className="text-stone-400" />
                              </div>
                              <input
                                type="time"
                                value={deliveryTime}
                                onChange={e => setDeliveryTime(e.target.value)}
                                className="w-full bg-stone-50 border border-transparent pl-9 pr-3 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modo de Envío */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100">
                      <h4 className="text-sm font-serif font-medium text-stone-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xs">2</span> 
                        Modo de Envío
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setDeliveryType('tienda')}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all ${
                            deliveryType === 'tienda' 
                              ? 'border-amber-300 bg-amber-50/60 text-amber-900 shadow-sm' 
                              : 'border-transparent bg-stone-50 text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          <Store size={20} className="mb-2" />
                          <span className="text-xs font-medium text-center leading-tight">Recoger en Tienda</span>
                        </button>
                        <button
                          onClick={() => setDeliveryType('domicilio')}
                          className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl transition-all ${
                            deliveryType === 'domicilio' 
                              ? 'border-amber-300 bg-amber-50/60 text-amber-900 shadow-sm' 
                              : 'border-transparent bg-stone-50 text-stone-500 hover:bg-stone-100'
                          }`}
                        >
                          <Truck size={20} className="mb-2" />
                          <span className="text-xs font-medium text-center leading-tight">Envío a Domicilio</span>
                        </button>
                      </div>

                      {deliveryType === 'domicilio' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-4 mb-2">Dirección Completa *</label>
                          <textarea
                            value={deliveryAddress}
                            onChange={e => setDeliveryAddress(e.target.value)}
                            placeholder="Calle, número, colonia, referencias..."
                            className="w-full bg-stone-50 border border-transparent px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all resize-none h-20 rounded-xl"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Forma de Pago */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100">
                      <h4 className="text-sm font-serif font-medium text-stone-800 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs">3</span> 
                        Forma de Pago
                      </h4>
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => setPaymentMethod('spei')}
                          className={`w-full flex items-center p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'spei' ? 'border-amber-300 bg-rose-50/60 shadow-sm' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                        >
                          <Landmark size={18} className={`mr-3 ${paymentMethod === 'spei' ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'spei' ? 'font-medium text-amber-900' : 'text-stone-600'}`}>Transferencia SPEI</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('efectivo')}
                          className={`w-full flex items-center p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'efectivo' ? 'border-amber-300 bg-rose-50/60 shadow-sm' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                        >
                          <Banknote size={18} className={`mr-3 ${paymentMethod === 'efectivo' ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'efectivo' ? 'font-medium text-amber-900' : 'text-stone-600'}`}>Efectivo contra entrega</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('tarjeta')}
                          className={`w-full flex items-center p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'tarjeta' ? 'border-amber-300 bg-rose-50/60 shadow-sm' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                        >
                          <CreditCard size={18} className={`mr-3 ${paymentMethod === 'tarjeta' ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'tarjeta' ? 'font-medium text-amber-900' : 'text-stone-600'}`}>Tarjeta de Crédito/Débito en Tienda</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t border-stone-200 border-dashed shrink-0 flex gap-3 shadow-[0_-10px_30px_rgb(0,0,0,0.02)] relative z-10">
                    <button
                      onClick={() => setCartPhase(1)}
                      className="px-5 py-4 border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center rounded-2xl"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={() => setCartPhase(3)}
                      disabled={!isPhase2Valid}
                      className="flex-1 bg-stone-900 text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex justify-center items-center gap-2 rounded-2xl shadow-lg shadow-stone-900/10"
                    >
                      Siguiente: Finalizar Pedido <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* FASE 3: Confirmación Final */}
              {cartPhase === 3 && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white relative">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-white"></div>
                    
                    <div className="text-center mb-8 relative z-10 pt-4">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-amber-100">
                        <Check size={28} className="text-amber-500" />
                      </div>
                      <h2 className="text-2xl font-serif text-stone-800 mb-2">Casi listo, {customerName.split(' ')[0]}</h2>
                      <p className="text-sm text-stone-500 font-light">Verifica que tus datos sean correctos.</p>
                    </div>

                    <div className="bg-[#FDFBF7] p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 space-y-5 relative z-10">
                      <div className="text-center pb-2">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Total a Pagar</span>
                        <span className="text-4xl font-serif text-stone-800">${totalAmount.toFixed(2)} <span className="text-sm text-stone-400 font-sans tracking-widest">MXN</span></span>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="w-full max-w-[200px] h-px border-t border-dashed border-stone-200"></div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-sm mt-2">
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">A nombre de</span>
                          <span className="font-medium text-stone-800">{customerName}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Fecha de Entrega</span>
                          <span className="font-medium text-stone-800">{deliveryDate} a las {deliveryTime}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Modo de Envío</span>
                          <span className="font-medium text-stone-800">
                            {deliveryType === 'tienda' ? 'Recoger en Tienda' : `Envío a Domicilio (${deliveryAddress})`}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">Forma de Pago</span>
                          <span className="font-medium text-stone-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                            {paymentMethod === 'spei' && 'Transferencia SPEI'}
                            {paymentMethod === 'efectivo' && 'Efectivo contra entrega'}
                            {paymentMethod === 'tarjeta' && 'Tarjeta de Crédito/Débito en Tienda'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t border-stone-200 border-dashed shrink-0 flex flex-col gap-3 shadow-[0_-10px_30px_rgb(0,0,0,0.02)] relative z-10">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-amber-500 text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-amber-600 transition-all shadow-[0_8px_20px_rgb(245,158,11,0.25)] flex justify-center items-center gap-2 rounded-2xl hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Finalizar Pedido por WhatsApp <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => setCartPhase(2)}
                      className="w-full py-3 text-sm font-medium text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-widest flex justify-center items-center gap-2 rounded-2xl hover:bg-stone-50"
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

      {/* PRIVACY MODAL */}
      <AnimatePresence>
        {showPrivacyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <h3 className="font-serif text-lg text-stone-800">Aviso de Privacidad</h3>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-stone-600 text-sm leading-relaxed font-light space-y-4">
                <p>En <strong className="font-medium text-stone-800">Lázaro Pastelería</strong> nos comprometemos a proteger tus datos personales.</p>
                <p>La información solicitada en este sitio (Nombre, Dirección, Teléfono) tiene como única finalidad procesar tu pedido personalizado, coordinar la entrega de tu producto y enviar los detalles de tu compra a través de WhatsApp.</p>
                <p>No compartimos tus datos con terceros ni los utilizamos para fines publicitarios sin tu consentimiento explícito.</p>
              </div>
              <div className="p-6 border-t border-stone-100 bg-stone-50/50">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-medium tracking-widest text-xs uppercase hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10"
                >
                  Entendido / Cerrar
                </button>
              </div>
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
