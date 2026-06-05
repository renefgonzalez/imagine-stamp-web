import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2, X, Store, Truck, Calendar, Clock, CreditCard, Banknote, Landmark, Instagram, Facebook, MapPin, Phone, Lock, Play, LayoutGrid } from 'lucide-react';
import { useCatalog, productosExpress, SizeOption, CartItem } from '../constants';
import { supabase } from '../../../lib/supabase';
import logoLazaro from '../assets/logo-lazaro.png';
const WHATSAPP_NUMBER = '525512479773';
const BASE_CAKE_PRICE = 550; // Precio base demostrativo

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/').split('&')[0];
  if (url.includes('youtu.be/')) return `https://www.youtube.com/embed/${url.split('youtu.be/')[1].split('?')[0]}`;
  if (url.includes('youtube.com/shorts/')) return `https://www.youtube.com/embed/${url.split('shorts/')[1].split('?')[0]}`;
  if (url.includes('tiktok.com/')) {
    const match = url.match(/video\/(\d+)/);
    if (match && match[1]) return `https://www.tiktok.com/embed/v2/${match[1]}`;
  }
  if (url.includes('instagram.com/')) {
    let cleanUrl = url.split('?')[0];
    if (!cleanUrl.endsWith('/')) cleanUrl += '/';
    return `${cleanUrl}embed`;
  }
  return url;
};

export function PasteleriaBuilder() {
  const { panes: PANES, rellenos: RELLENOS, extras: EXTRAS, decoraciones, tiers: TIERS, SIZES, expressProducts, expressCategories } = useCatalog();
  const [bankData, setBankData] = useState<{banco: string, titular: string, clabe: string} | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedPan, setSelectedPan] = useState<string | null>(null);
  const [selectedRelleno, setSelectedRelleno] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [selectedDecoraciones, setSelectedDecoraciones] = useState<string[]>([]);
  

  const isLargeSize = selectedSize === '20 personas' || selectedSize === '30 personas';
  
  const [activeTab, setActiveTab] = useState<string>('builder');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showCategoriesGrid, setShowCategoriesGrid] = useState(false);

  const [cartPhase, setCartPhase] = useState<1 | 2 | 3>(1);
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'tienda' | 'domicilio' | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'spei' | 'efectivo' | 'tarjeta' | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const [showCouponAlert, setShowCouponAlert] = useState(false);

  useEffect(() => {
    const localCart = localStorage.getItem('lazaro_cart');
    if (localCart) {
      setCart(JSON.parse(localCart));
    }
    const savedBank = localStorage.getItem('lazaro_datos_bancarios');
    if (savedBank) {
      try {
        const parsed = JSON.parse(savedBank);
        if (parsed.banco || parsed.titular || parsed.clabe) {
          setBankData(parsed);
        }
      } catch (e) {}
    }
  }, []);

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

  const toggleDecoracion = (id: string) => {
    setSelectedDecoraciones(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const isComplete = selectedSize && selectedPan && selectedRelleno;
  
  const isPhase2Valid = 
    customerName.trim() !== '' && 
    customerPhone.trim() !== '' &&
    deliveryType !== null && 
    (deliveryType === 'tienda' || deliveryAddress.trim() !== '') &&
    deliveryDate !== '' && 
    deliveryTime !== '' &&
    paymentMethod !== null;

  const getPrice = (categoryId: string, size: SizeOption) => {
    const tier = TIERS.find(t => t.id === categoryId);
    if (!tier) return 0;
    if (typeof tier.prices === 'number') return tier.prices;
    return tier.prices[size] || 0;
  };

  const handleAddToCart = () => {
    if (!isComplete || !selectedSize) return;

    const panCat = PANES.find(p => p.id === selectedPan)?.category;
    const rellenoCat = RELLENOS.find(r => r.id === selectedRelleno)?.category;
    
    const panPrice = panCat ? getPrice(panCat, selectedSize) : 0;
    const rellenoPrice = rellenoCat ? getPrice(rellenoCat, selectedSize) : 0;
    const extrasPrice = selectedExtras.reduce((acc, eId) => {
      const eCat = EXTRAS.find(e => e.id === eId)?.category;
      return acc + (eCat ? getPrice(eCat, selectedSize) : 0);
    }, 0);
    const decoracionesPrice = selectedDecoraciones.reduce((acc, dId) => {
      const dCat = decoraciones.find(d => d.id === dId)?.category;
      return acc + (dCat ? getPrice(dCat, selectedSize) : 0);
    }, 0);
    
    const totalPrice = panPrice + rellenoPrice + extrasPrice + decoracionesPrice;

    const newCake: CartItem = {
      id: crypto.randomUUID(),
      type: 'custom',
      size: selectedSize!,
      pan: selectedPan!,
      relleno: selectedRelleno!,
      extras: selectedExtras,
      decoraciones: selectedDecoraciones,
      quantity: 1,
      price: totalPrice
    };

    setCart(prev => [...prev, newCake]);
    
    setSelectedSize(null);
    setSelectedPan(null);
    setSelectedRelleno(null);
    setSelectedExtras([]);
    setSelectedDecoraciones([]);
    
    setShowToast(true);
  };

  const handleAddToCartExpress = (product: typeof productosExpress[0]) => {
    const newItem: CartItem = {
      id: product.id + '-' + Date.now(),
      type: 'express',
      quantity: 1,
      price: product.precio,
      size: SIZES[0], // dummy value to satisfy type
      productId: product.id,
      name: product.nombre
    };
    
    setCart(prev => {
      const existing = prev.find(item => item.type === 'express' && item.productId === product.id);
      if (existing) {
        return prev.map(item => item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, newItem];
    });
    
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

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'BIENVENIDA10' || code.startsWith('LAZARO-10-')) {
      setAppliedDiscount(0.10);
      setCouponStatus('success');
    } else {
      setAppliedDiscount(0);
      setCouponStatus('error');
    }
  };

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);
  const discountAmount = subtotal * appliedDiscount;
  const totalAmount = subtotal - discountAmount;

  const handleCheckout = async () => {
    const lines = cart.map(item => {
      if (item.type === 'custom') {
        const panName = PANES.find(p => p.id === item.pan)?.name;
        const rellenoName = RELLENOS.find(r => r.id === item.relleno)?.name;
        const extrasNames = item.extras?.map(eId => EXTRAS.find(e => e.id === eId)?.name).join(', ');
        const decNames = item.decoraciones?.map(dId => decoraciones.find(d => d.id === dId)?.name).join(', ');
        
        let customDesc = `🎂 *${item.quantity}x Pastel Personalizado*\n  • Tamaño: ${item.size}\n  • Pan: ${panName}\n  • Relleno: ${rellenoName}`;
        if (extrasNames) customDesc += `\n  • Extras: ${extrasNames}`;
        if (decNames) customDesc += `\n  • Decoración: ${decNames}`;
        return customDesc;
      } else {
        return `🧁 *${item.quantity}x ${item.name}*\n  • (Producto Express)`;
      }
    }).join('\n\n');

    const name = customerName.trim();
    const phone = customerPhone.trim();
    const deliveryStr = deliveryType === 'tienda' 
      ? 'Recoger en Tienda' 
      : `Envío a Domicilio (${deliveryAddress.trim()})`;
      
    let paymentStr = '';
    if (paymentMethod === 'spei') paymentStr = 'Transferencia SPEI';
    if (paymentMethod === 'tarjeta') paymentStr = 'Tarjeta de Crédito/Débito';

    let message = 
      `✨ ¡Hola Lázaro Pastelería! Me gustaría confirmar el siguiente pedido:\n\n` +
      `👤 Cliente: *${name}*\n` +
      `📞 Teléfono: *${phone}*\n` +
      `📅 Fecha de entrega: *${deliveryDate}* a las *${deliveryTime}*\n` +
      `🚚 Modo de Envío: *${deliveryStr}*\n` +
      `💳 Forma de Pago: *${paymentStr}*\n`;
      
    if (specialNotes.trim()) {
      message += `📝 *Notas del cliente:* ${specialNotes.trim()}\n`;
    }

    const subtotalStr = subtotal.toFixed(2);
    const discountStr = discountAmount > 0 ? `\n🏷️ *Descuento aplicado:* -$${discountAmount.toFixed(2)} MXN (${(appliedDiscount * 100).toFixed(0)}%)` : '';
    
    let generatedCode = '';
    if (subtotal > 1200) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randStr = '';
      for(let i=0; i<4; i++) randStr += chars.charAt(Math.floor(Math.random() * chars.length));
      generatedCode = `LAZARO-10-${randStr}`;
      setGeneratedCoupon(generatedCode);
      setShowCouponAlert(true);
    }

    message += 
      `------------------------------------------\n\n` +
      `Detalle del Pedido:\n${lines}\n\n` +
      `💰 *Subtotal:* $${subtotalStr} MXN` +
      discountStr +
      `\n\n💵 *Total a Pagar:* $${totalAmount.toFixed(2)} MXN\n\n` +
      `_Pedido generado desde el constructor interactivo_ 🤍`;

    if (generatedCode) {
      message += `\n\n🎁 *Cupón otorgado al cliente (Próxima compra):* ${generatedCode}`;
    }

    const newOrder = {
      id_pedido: crypto.randomUUID(),
      cliente_nombre: name,
      telefono: phone,
      fecha_entrega: `${deliveryDate} | ${deliveryTime}`,
      metodo_entrega: deliveryType === 'tienda' ? 'tienda' : `domicilio | ${deliveryAddress}`,
      notas_cliente: specialNotes,
      productos: cart,
      metodo_pago: paymentMethod!,
      total: totalAmount,
      estado: 'Pendiente',
      notas_internas: generatedCode ? `Cupón otorgado al cliente: ${generatedCode}` : null
    };

    const { error } = await supabase.from('lazaro_pedidos').insert([newOrder]);
    
    if (error) {
      console.error('Error guardando pedido:', error);
      alert('Hubo un problema al procesar tu pedido. Por favor intenta de nuevo.');
      return;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    setTimeout(() => {
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setDeliveryAddress('');
      setDeliveryDate('');
      setDeliveryTime('');
      setSpecialNotes('');
      setPaymentMethod(null);
      setIsCartOpen(false);
      setCartPhase(1);

      setAppliedDiscount(0);
      setCouponCode('');
      setCouponStatus('idle');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-stone-900 pb-32 selection:bg-rose-200">
      <title>Lázaro Pastelería | Crea tu Propio Sabor</title>

      {/* HEADER MINIMALISTA CON SOMBRA SUTIL */}
      <header className="px-6 pt-4 md:pt-6 pb-4 border-b border-stone-200 border-dashed flex flex-col items-center sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-30 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
        <div className="w-full max-w-2xl relative">
          <div className="absolute top-0 right-0 z-10">
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

          <div className="text-center max-w-xl mx-auto pt-1 md:pt-2">
            <img src={logoLazaro} alt="Lázaro Pastelería" className="h-16 md:h-20 mx-auto mb-3 drop-shadow-sm" />
            <div className="h-px w-16 bg-amber-200 mx-auto mb-3"></div>
            <p className="text-stone-500 font-light text-[11px] md:text-sm tracking-wide uppercase flex items-center justify-center gap-2">
              Pregunta por el menú <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-widest border border-teal-100">Sin Azúcar</span>
            </p>
          </div>
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
        
        {/* CONTROLES DE CATEGORÍAS */}
        <div className="mb-8 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3 w-full">
            <button 
              onClick={() => setShowCategoriesGrid(!showCategoriesGrid)}
              className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full border transition-all ${
                showCategoriesGrid 
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <LayoutGrid size={20} />
            </button>
            
            <div className="flex flex-row overflow-x-auto gap-3 pb-2 pt-2 snap-x snap-mandatory hide-scrollbar flex-1">
              <button
                onClick={() => { setActiveTab('builder'); setShowCategoriesGrid(false); }}
                className={`whitespace-nowrap shrink-0 snap-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'builder'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                Crea tu propio sabor
              </button>
              {expressCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveTab(cat); setShowCategoriesGrid(false); }}
                  className={`whitespace-nowrap shrink-0 snap-center px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    activeTab === cat
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-white text-stone-500 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* GRID DESPLEGABLE */}
          <AnimatePresence>
            {showCategoriesGrid && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <button
                    onClick={() => { setActiveTab('builder'); setShowCategoriesGrid(false); }}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                      activeTab === 'builder'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-2xl mb-2">🍰</span>
                    <span className="text-xs font-medium text-center">Crea tu propio sabor</span>
                  </button>
                  {expressCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setActiveTab(cat); setShowCategoriesGrid(false); }}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                        activeTab === cat
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-2xl mb-2">✨</span>
                      <span className="text-xs font-medium text-center">{cat}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {activeTab === 'builder' ? (
          <div className="space-y-6 md:space-y-10">
            {/* PASO 1: TAMAÑO */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-rose-100 font-serif italic leading-none">01</span>
            <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tus porciones</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            {SIZES.map(size => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedSize(size);
                    // Si se selecciona un tamaño grande y el pan era 3-leches, deseleccionarlo
                    if ((size === '20 personas' || size === '30 personas') && selectedPan === '3-leches') {
                      setSelectedPan(null);
                    }
                  }}
                  className={`flex-1 min-w-[120px] p-5 text-center rounded-2xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-amber-300 bg-amber-50/60 shadow-sm text-amber-900' 
                      : 'border-transparent bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <span className="font-medium text-sm block">
                    <span className="text-lg">{size.replace(' personas', '')}</span>
                    <span className="block text-[10px] uppercase tracking-widest opacity-60 mt-0.5">personas</span>
                  </span>
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

        {/* PASO 2: PAN */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-amber-100 font-serif italic leading-none">02</span>
            <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu pan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PANES.map(pan => {
              const isSelected = selectedPan === pan.id;
              const isDisabled = pan.id === '3-leches' && isLargeSize;
              
              return (
                <button
                  key={pan.id}
                  onClick={() => !isDisabled && setSelectedPan(pan.id)}
                  disabled={isDisabled}
                  className={`relative py-3 px-4 h-full flex flex-col items-center justify-center text-center rounded-2xl transition-all duration-300 border-2 ${
                    isDisabled 
                      ? 'border-transparent bg-stone-50/50 opacity-50 cursor-not-allowed'
                      : isSelected 
                        ? 'border-amber-300 bg-rose-50/60 shadow-sm' 
                        : 'border-transparent bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className={`font-medium text-sm ${isSelected ? 'text-amber-900' : ''} ${isDisabled ? 'text-stone-400' : ''}`}>
                    {pan.name}
                  </div>
                  {isDisabled && (
                    <div className="text-[10px] mt-1 leading-tight px-1 text-stone-400">
                      (No disponible para más de 12 personas)
                    </div>
                  )}
                  {!isDisabled && pan.note && (
                    <div className={`text-[10px] mt-1 leading-tight px-1 ${isSelected ? 'text-amber-700/70' : 'text-stone-400'}`}>
                      {pan.note}
                    </div>
                  )}
                  {isSelected && !isDisabled && (
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

        {/* PASO 3: RELLENO */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-rose-100 font-serif italic leading-none">03</span>
            <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu relleno</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {RELLENOS.map(relleno => {
              const isSelected = selectedRelleno === relleno.id;
              return (
                <button
                  key={relleno.id}
                  onClick={() => setSelectedRelleno(relleno.id)}
                  className={`relative py-3 px-4 flex-grow basis-[calc(50%-0.75rem)] md:basis-[calc(33.333%-0.75rem)] min-w-[140px] flex flex-col items-center justify-center text-center rounded-2xl transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-amber-300 bg-amber-50/60 shadow-sm text-amber-900' 
                      : 'border-transparent bg-stone-50 text-stone-600 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <span className="font-medium text-sm block">
                    {relleno.name}
                  </span>
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

        {/* PASO 4: EXTRAS */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-100 via-amber-100 to-rose-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-amber-100 font-serif italic leading-none">04</span>
            <div>
              <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu extra</h2>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-1 font-medium bg-stone-50 inline-block px-2 py-0.5 rounded-full border border-stone-100">(Opcional)</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...EXTRAS]
              .sort((a, b) => Number(a.name.length > 14) - Number(b.name.length > 14))
              .map(extra => {
              const isSelected = selectedExtras.includes(extra.id);
              const isWide = extra.name.length > 14;
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all border-2 justify-self-center ${isWide ? 'col-span-2' : ''} ${
                    isSelected
                      ? 'border-amber-300 bg-rose-50/60 text-amber-900 shadow-sm'
                      : 'border-transparent bg-stone-50 text-stone-500 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  {extra.name}
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

        {/* PASO 5: DECORACIÓN */}
        <section className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-stone-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 opacity-50"></div>
          <div className="flex items-end gap-4 mb-8">
            <span className="text-5xl text-rose-100 font-serif italic leading-none">05</span>
            <div>
              <h2 className="text-2xl font-light tracking-wide text-stone-800">Elige tu decoración</h2>
              <p className="text-stone-400 text-[10px] uppercase tracking-widest mt-1 font-medium bg-stone-50 inline-block px-2 py-0.5 rounded-full border border-stone-100">(Opcional)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {decoraciones.map(dec => {
              const isSelected = selectedDecoraciones.includes(dec.id);
              return (
                <button
                  key={dec.id}
                  onClick={() => toggleDecoracion(dec.id)}
                  className={`relative w-full text-center px-4 py-3 text-sm font-medium rounded-2xl transition-all border-2 ${
                    isSelected
                      ? 'border-amber-300 bg-rose-50/60 text-amber-900 shadow-sm'
                      : 'border-transparent bg-stone-50 text-stone-500 hover:bg-stone-100 hover:border-stone-200'
                  }`}
                >
                  <div className="font-medium text-sm">
                    {dec.name}
                  </div>
                  {(dec.note || dec.id === 'dec-mdf') && (
                    <div className={`text-[10px] mt-1 leading-tight px-1 ${isSelected ? 'text-amber-700/70' : 'text-stone-400'}`}>
                      {dec.note || '*MDF: madera sintética de material comprimido*'}
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
        </div>
        ) : (
          <section className="bg-[#FDFBF7] p-0 md:p-4 rounded-3xl relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {expressProducts.filter(p => p.categoria?.trim().toLowerCase() === activeTab?.trim().toLowerCase()).map(product => (
                <div key={product.id} className="bg-white border border-stone-100 rounded-3xl overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-col">
                  <div className="relative h-56 bg-stone-100 overflow-hidden shrink-0">
                    <img src={product.imagenes[0]} alt={product.nombre} className="w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:opacity-0" />
                    {product.imagenes[1] && (
                      <img src={product.imagenes[1]} alt={product.nombre} className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100" />
                    )}
                    {product.etiqueta && (
                      <span className="absolute top-4 left-4 z-10 bg-teal-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-md shadow-teal-500/20">
                        {product.etiqueta}
                      </span>
                    )}
                    
                    {product.video_url && (
                      <button 
                        onClick={() => setPlayingVideo(getEmbedUrl(product.video_url!))}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-colors group/video"
                      >
                        <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-500 shadow-xl scale-95 group-hover/video:scale-110 transition-transform">
                          <Play fill="currentColor" size={24} className="ml-1" />
                        </div>
                      </button>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-serif text-lg text-stone-800 leading-tight">{product.nombre}</h3>
                    <p className="text-sm text-stone-500 mt-3 font-light leading-relaxed flex-1 line-clamp-3">{product.descripcion}</p>
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-stone-100 border-dashed">
                      <span className="font-serif text-xl text-stone-800">${product.precio.toFixed(2)}</span>
                      <button
                        onClick={() => handleAddToCartExpress(product)}
                        className="bg-stone-900 text-white px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-widest hover:bg-stone-800 transition-all shadow-md shadow-stone-900/10 active:scale-95"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}


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
              <p className="font-medium text-stone-700">55 1247 9773</p>
              <div className="w-8 h-px bg-stone-200 my-2 mx-auto md:mx-0"></div>
              <p>Lunes a Domingo: 8:00 AM - 9:00 PM</p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-stone-800 font-medium uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
              <MapPin size={14} className="text-amber-500" /> Ubicación
            </h4>
            <div className="space-y-4 text-sm text-stone-500 font-light">
              <p>San José el Alto, Colinas de Menchaca.<br/>Querétaro, Qro.</p>
              
              <div className="flex gap-4 pt-2">
                <a href="https://www.instagram.com/lazaro.pastel?igsh=MTkxY2Rvd294NnN4Mw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-100">
                  <Instagram size={16} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61572341769927#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-100">
                  <Facebook size={16} />
                </a>
                <a href="https://www.tiktok.com/@pastelerialazaro?_r=1&_t=ZS-96sqnO6nIBB" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50 transition-colors border border-stone-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
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


      {/* FIXED ACTION BAR FOR BUILDER */}
      <AnimatePresence>
        {activeTab === 'builder' && isComplete && !showToast && (
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
                              <h4 className="font-medium text-stone-800 font-serif text-lg">
                                {item.type === 'custom' ? 'Pastel Personalizado' : item.name}
                              </h4>
                              <button onClick={() => handleRemove(item.id)} className="text-stone-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            {item.type === 'custom' && (
                              <div className="space-y-2 text-sm text-stone-600 mb-6 font-light bg-[#FDFBF7] p-4 rounded-2xl border border-stone-100/50">
                                <p><span className="text-amber-700/60 font-medium mr-2">Tamaño:</span> {item.size}</p>
                                <div className="h-px border-t border-dashed border-stone-200"></div>
                                <p><span className="text-amber-700/60 font-medium mr-2">Pan:</span> {PANES.find(p => p.id === item.pan)?.name}</p>
                                <div className="h-px border-t border-dashed border-stone-200"></div>
                                <p><span className="text-amber-700/60 font-medium mr-2">Relleno:</span> {RELLENOS.find(r => r.id === item.relleno)?.name}</p>
                                <div className="h-px border-t border-dashed border-stone-200"></div>
                                <p>
                                  <span className="text-amber-700/60 font-medium mr-2">Extras:</span> 
                                  {item.extras?.length ? item.extras.map(e => EXTRAS.find(x => x.id === e)?.name).join(', ') : 'Ninguno'}
                                </p>
                              </div>
                            )}


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
                            placeholder="Ej. Juan Pérez"
                            className="w-full bg-stone-50 border border-transparent px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all rounded-xl"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Teléfono de contacto *</label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={e => setCustomerPhone(e.target.value)}
                            placeholder="Ej. 55 1234 5678"
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

                        <div className="mt-3">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Notas especiales (Opcional)</label>
                          <textarea
                            value={specialNotes}
                            onChange={e => setSpecialNotes(e.target.value)}
                            placeholder="Ej. Es un regalo sorpresa, por favor enviar sin ticket impreso..."
                            className="w-full bg-stone-50 border border-transparent px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all resize-none h-20 rounded-xl"
                          />
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

                    {/* Cupón de Descuento */}
                    <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-stone-100 mt-4 mb-4">
                      <h4 className="text-sm font-serif font-medium text-stone-800 mb-4 flex items-center gap-2">
                        ¿Tienes un cupón de descuento?
                      </h4>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={e => {
                            setCouponCode(e.target.value);
                            setCouponStatus('idle');
                          }}
                          placeholder="Ingresa tu código"
                          className="flex-1 bg-stone-50 border border-transparent px-4 py-3 text-sm outline-none focus:border-amber-300 focus:bg-white transition-all rounded-xl uppercase"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-stone-900 text-white px-5 py-3 rounded-xl font-medium text-sm hover:bg-stone-800 transition-colors"
                        >
                          Aplicar
                        </button>
                      </div>
                      {couponStatus === 'success' && (
                        <p className="text-green-600 text-xs mt-2 font-medium">Cupón aplicado: -10%</p>
                      )}
                      {couponStatus === 'error' && (
                        <p className="text-red-500 text-xs mt-2 font-medium">Cupón inválido</p>
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
                          onClick={() => setPaymentMethod('tarjeta')}
                          className={`w-full flex items-center p-4 border-2 rounded-2xl transition-all ${paymentMethod === 'tarjeta' ? 'border-amber-300 bg-rose-50/60 shadow-sm' : 'border-transparent bg-stone-50 hover:bg-stone-100'}`}
                        >
                          <CreditCard size={18} className={`mr-3 ${paymentMethod === 'tarjeta' ? 'text-amber-700' : 'text-stone-400'}`} />
                          <span className={`text-sm ${paymentMethod === 'tarjeta' ? 'font-medium text-amber-900' : 'text-stone-600'}`}>Tarjeta de Crédito/Débito</span>
                        </button>
                      </div>

                      {paymentMethod === 'spei' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4">
                          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
                            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-3">Datos para Transferencia</h5>
                            {bankData ? (
                              <div className="space-y-2 text-sm text-amber-800/80">
                                <p><strong className="font-medium text-amber-900">Banco:</strong> {bankData.banco}</p>
                                <p><strong className="font-medium text-amber-900">Titular:</strong> {bankData.titular}</p>
                                <p><strong className="font-medium text-amber-900">CLABE/Tarjeta:</strong> {bankData.clabe}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-amber-800/70 italic">
                                Los datos para la transferencia se te proporcionarán al confirmar tu pedido por WhatsApp.
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
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
                        {appliedDiscount > 0 && (
                          <div className="mb-2 text-green-600 text-sm font-medium">
                            Subtotal: ${subtotal.toFixed(2)} | Descuento: -${discountAmount.toFixed(2)}
                          </div>
                        )}
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
                            {paymentMethod === 'tarjeta' && 'Tarjeta de Crédito/Débito'}
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

      {/* MODAL CUPON GENERADO */}
      <AnimatePresence>
        {showCouponAlert && generatedCoupon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowCouponAlert(false);
                  setGeneratedCoupon(null);
                }} 
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 bg-stone-50 p-2 rounded-full"
              >
                <X size={16} />
              </button>
              
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎁</span>
              </div>
              <h3 className="font-serif text-xl text-stone-800 mb-2">¡Gracias por tu compra!</h3>
              <p className="text-stone-600 text-sm mb-6 leading-relaxed">
                Para premiar tu preferencia, obtuviste un cupón del <strong>10%</strong> para tu próximo pedido. Guarda este código:
              </p>
              
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-6">
                <p className="font-mono text-lg font-bold text-amber-700 tracking-widest">{generatedCoupon}</p>
              </div>
              
              <button
                onClick={() => {
                  setShowCouponAlert(false);
                  setGeneratedCoupon(null);
                }}
                className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-stone-800 transition-colors"
              >
                ¡Entendido!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* VIDEO MODAL */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={() => setPlayingVideo(null)}
          >
            <div 
              className="relative w-full max-w-md h-[80vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <iframe 
                src={playingVideo} 
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
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
