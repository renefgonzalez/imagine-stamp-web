import React, { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Minus, Phone, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Using high quality Unsplash placeholders for Mexican food
const MENU_DATA = [
  {
    category: 'Tradicionales',
    description: 'Gorditas de maíz o harina. $55 MXN c/u.',
    items: [
      { id: 'trad-1', name: 'Regia', desc: 'Rellena de carne Arrachera, frijoles refritos, guacamole o pico de gallo', price: 55 },
      { id: 'trad-2', name: 'Banquetera', desc: 'Rellena de Bistec, Cecina, Longaniza o Campechana, papas a la francesa, rajas y cebolla', price: 55 },
      { id: 'trad-3', name: 'Michoacana', desc: 'Rellena de carnitas de puerco Maciza, cuerito o buche, cebolla y cilantro', price: 55 },
      { id: 'trad-4', name: 'Mestiza', desc: 'Rellena de Mixiote de res, frijoles refritos, nopales, cebolla encurtida o salsa', price: 55 },
      { id: 'trad-5', name: 'Tapatía', desc: 'Rellena de Birria de res, quesillo, cebolla, cilantro y salsa', price: 55 },
    ]
  },
  {
    category: 'Taqueras',
    description: 'Gordita de maíz rellena de tu carne favorita. $50 MXN c/u.',
    items: [
      { id: 'taq-1', name: 'Cabeza (surtida)', desc: 'Gordita de maíz rellena de cabeza', price: 50 },
      { id: 'taq-2', name: 'Suadero', desc: 'Gordita de maíz rellena de suadero', price: 50 },
      { id: 'taq-3', name: 'Tripa', desc: 'Gordita de maíz rellena de tripa', price: 50 },
      { id: 'taq-4', name: 'Chorizo', desc: 'Gordita de maíz rellena de chorizo', price: 50 },
      { id: 'taq-5', name: 'Campechana', desc: 'Gordita de maíz rellena de campechana', price: 50 },
    ]
  },
  {
    category: 'Al Comal',
    description: 'Gordita de maíz calientita. $45 MXN c/u.',
    items: [
      { id: 'com-1', name: 'Bistec', desc: 'Gordita de maíz rellena de bistec', price: 45 },
      { id: 'com-2', name: 'Costilla', desc: 'Gordita de maíz rellena de costilla', price: 45 },
      { id: 'com-3', name: 'Chuleta', desc: 'Gordita de maíz rellena de chuleta', price: 45 },
      { id: 'com-4', name: 'Entrecot', desc: 'Gordita de maíz rellena de entrecot', price: 45 },
    ]
  },
  {
    category: 'Torteras',
    description: 'Gordita de maíz o harina con quesillo. Sencillas $45, Combinadas $55.',
    items: [
      { id: 'tor-1', name: 'Pierna', desc: 'Con quesillo', price: 45 },
      { id: 'tor-2', name: 'Jamón', desc: 'Con quesillo', price: 45 },
      { id: 'tor-3', name: 'Milanesa', desc: 'Con quesillo', price: 45 },
      { id: 'tor-4', name: 'Huevo', desc: 'Con quesillo', price: 45 },
      { id: 'tor-5', name: 'Combinada (Elegir 2)', desc: 'Con quesillo', price: 55 },
    ]
  },
  {
    category: 'Infantil',
    description: 'Para los más peques de la casa.',
    items: [
      { id: 'inf-1', name: 'Abuelita', desc: 'Gordita de maíz mezclada con piloncillo, anís y canela', price: 10 },
      { id: 'inf-2', name: 'Hawaiana', desc: 'Gordita de harina rellena de jamón, piña y quesillo', price: 15 },
      { id: 'inf-3', name: 'Napolitana', desc: 'Gordita de harina rellena de milanesa, queso y piña', price: 20 },
      { id: 'inf-4', name: 'Gordiburger', desc: 'Gordita de maíz rellena de hamburguesa, tocino, queso, papas a la francesa', price: 60 },
    ]
  },
  {
    category: 'Contemporánea',
    description: 'Gordita de maíz o harina. $40 MXN c/u (Chicharrón clásico $30).',
    items: [
      { id: 'con-1', name: 'Chicharrón rojo', desc: '', price: 40 },
      { id: 'con-2', name: 'Tinga de res', desc: '', price: 40 },
      { id: 'con-3', name: 'Tinga de pollo', desc: '', price: 40 },
      { id: 'con-4', name: 'Flor de calabaza', desc: '', price: 40 },
      { id: 'con-5', name: 'Queso con rajas', desc: '', price: 40 },
      { id: 'con-6', name: 'Chicharrón clásico', desc: '', price: 30 },
    ]
  },
  {
    category: 'Especiales',
    description: 'Nuestra especialidad.',
    items: [
      { id: 'esp-1', name: 'Caldo de Pata', desc: 'Pata con chamorro de res enchilada, garbanzo, arroz, tortillas y salsa', price: 120 },
    ]
  },
  {
    category: 'Bebidas y Extras',
    description: '',
    items: [
      { id: 'beb-1', name: 'Agua', desc: '', price: 25 },
      { id: 'beb-2', name: 'Tepache', desc: '', price: 30 },
      { id: 'beb-3', name: 'Refresco', desc: '', price: 28 },
      { id: 'beb-4', name: 'Cerveza', desc: '', price: 50 },
      { id: 'ext-1', name: 'Ingredientes extra', desc: '', price: 15 },
    ]
  }
];

export default function MenuGorditas() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBases, setSelectedBases] = useState<Record<string, 'Maíz' | 'Harina'>>({});
  const [cartStep, setCartStep] = useState<'cart' | 'details'>('cart');
  
  // Form details
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [metodoEntrega, setMetodoEntrega] = useState<'recoger' | 'domicilio'>('domicilio');
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [notas, setNotas] = useState('');
  const [formaPago, setFormaPago] = useState('Efectivo');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Cart operations
  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(p => p.id !== id));
    if (cart.length === 1) setCartStep('cart');
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = Math.max(1, p.qty + delta);
        return { ...p, qty: newQty };
      }
      return p;
    }));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.qty), 0), [cart]);
  const cartItemsCount = useMemo(() => cart.reduce((acc, item) => acc + item.qty, 0), [cart]);

  const handleSiguiente = () => {
    if (cart.length === 0) return;
    setCartStep('details');
  };

  const enviarWhatsApp = () => {
    if (cart.length === 0) return;
    
    // Validation
    let ok = true;
    const newErrs: Record<string, boolean> = {};
    if (!nombre.trim()) { newErrs.nombre = true; ok = false; }
    if (!telefono.trim()) { newErrs.telefono = true; ok = false; }
    
    if (metodoEntrega === 'domicilio') {
      if (!calle.trim()) { newErrs.calle = true; ok = false; }
      if (!colonia.trim()) { newErrs.colonia = true; ok = false; }
    }
    
    setErrors(newErrs);
    
    if (!ok) {
      alert("Por favor completa los datos marcados en rojo.");
      return;
    }
    
    let lineas = "";
    cart.forEach(item => {
      lineas += `• ${item.qty}x ${item.name} - $${item.price * item.qty}\n`;
    });
    
    let mensaje = `🍲 *NUEVO PEDIDO - GORDITAS Y CALDO DE PATA*\n\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `📱 *Teléfono:* ${telefono}\n`;
    
    if (metodoEntrega === "domicilio") {
      mensaje += `🛵 *Tipo:* Entrega a domicilio\n`;
      mensaje += `📍 *Dirección:* ${calle.trim()}, Col. ${colonia.trim()}\n`;
    } else {
      mensaje += `🏪 *Tipo:* Recoger en el local\n`;
    }

    mensaje += `\n🧾 *Pedido:*\n${lineas}`;
    mensaje += `\n💰 *Total a pagar:* $${cartTotal}\n`;
    mensaje += `💳 *Pago:* ${formaPago}\n`;
    
    if (notas.trim()) mensaje += `\n🗒️ *Notas:* ${notas.trim()}\n`;

    mensaje += `\n¿Me podrían confirmar mi pedido, por favor?`;
    
    const phone = '5214779784805';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: 'linear-gradient(to bottom, #0f4c81, #1b365d)' }}>
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0f4c81]/90 backdrop-blur-md border-b border-white/10 shadow-lg px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-widest" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Gorditas y Caldo de Pata</h1>
          <p className="text-[#f4c430] text-xs font-bold uppercase tracking-[0.2em]">Antojitos Mexicanos</p>
        </div>
        
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors border border-white/20"
        >
          <ShoppingBag className="text-white" size={24} />
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cartItemsCount}
            </span>
          )}
        </button>
      </header>

      {/* MENÚ CONTENT */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 pb-32">
        <div className="space-y-12">
          {MENU_DATA.map((section, idx) => (
            <section key={idx} className="bg-black/20 rounded-3xl p-6 md:p-8 border border-white/5 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-black mb-2 text-center" style={{ color: '#f4c430', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                {section.category}
              </h2>
              {section.description && (
                <p className="text-white/80 text-center mb-8 whitespace-pre-line text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
                  {section.description}
                </p>
              )}
              
              <div className="flex flex-col gap-3">
                {section.items.map(item => (
                  <div key={item.id} className="bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition-all p-4 flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <h3 className="font-bold text-white text-lg">{item.name}</h3>
                      {item.desc && <p className="text-sm text-white/60 leading-snug mt-1">{item.desc}</p>}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-4 shrink-0 mt-3 md:mt-0">
                      {!['Especiales', 'Bebidas y Extras'].includes(section.category) && (
                        <div className="flex bg-black/40 rounded-full p-1 border border-white/20">
                          <button 
                            onClick={() => setSelectedBases({...selectedBases, [item.id]: 'Maíz'})}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${(!selectedBases[item.id] || selectedBases[item.id] === 'Maíz') ? 'bg-[#ffff99] text-black shadow-[0_0_8px_#ffff99]' : 'text-white/60 hover:text-white'}`}
                          >
                            Maíz
                          </button>
                          <button 
                            onClick={() => setSelectedBases({...selectedBases, [item.id]: 'Harina'})}
                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${(selectedBases[item.id] === 'Harina') ? 'bg-[#ffff99] text-black shadow-[0_0_8px_#ffff99]' : 'text-white/60 hover:text-white'}`}
                          >
                            Harina
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <span className="text-[#f4c430] font-black text-lg">${item.price}</span>
                        <button 
                          onClick={() => addToCart(item, section.category)}
                          className="w-10 h-10 rounded-full bg-[#f4c430] flex items-center justify-center hover:bg-[#e0b220] text-black transition-colors shadow-lg"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* FLOATING WHATSAPP BUTTON (for direct contact if cart is empty, or checkout if full) */}
      <button 
        onClick={cart.length > 0 ? () => setIsCartOpen(true) : () => window.open('https://wa.me/5214779784805', '_blank')}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-40 transition-transform hover:scale-110 flex items-center justify-center gap-2"
        style={{ boxShadow: '0 10px 25px rgba(34,197,94,0.5)' }}
      >
        <Phone size={24} fill="currentColor" />
        {cart.length > 0 && <span className="font-bold pr-2">Pedir (${cartTotal})</span>}
      </button>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:w-[420px] bg-[#1b365d] shadow-2xl z-50 flex flex-col border-l border-white/10"
            >
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0f4c81]">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  {cartStep === 'details' ? (
                    <button onClick={() => setCartStep('cart')} className="hover:bg-white/10 p-1 rounded-full text-white"><ArrowLeft size={20}/></button>
                  ) : (
                    <ShoppingBag className="text-[#f4c430]" /> 
                  )}
                  {cartStep === 'cart' ? 'Tu Pedido' : 'Datos de Entrega'}
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-white/60 hover:text-white bg-white/5 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {cartStep === 'cart' ? (
                  /* STEP 1: CART ITEMS */
                  cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40">
                      <ShoppingBag size={48} className="mb-4 opacity-20" />
                      <p>No has agregado nada a tu pedido aún.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-xl overflow-hidden">
                          {item.img ? <img src={item.img} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="text-white/30 m-auto mt-4" size={24}/>}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold leading-tight">{item.name}</h4>
                          <p className="text-[#f4c430] font-black">${item.price * item.qty}</p>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-xs mt-2 underline">Eliminar</button>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                          <div className="flex items-center gap-3 bg-white/10 rounded-full px-2 py-1">
                            <button onClick={() => updateQty(item.id, -1)} className="text-white hover:text-[#f4c430]"><Minus size={14}/></button>
                            <span className="text-white font-bold text-sm w-4 text-center">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} className="text-white hover:text-[#f4c430]"><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  /* STEP 2: CHECKOUT DETAILS */
                  <div className="space-y-4 text-white">
                    <div className="flex bg-white/10 rounded-lg p-1">
                      <button 
                        className={`flex-1 py-2 text-sm font-bold rounded-md ${metodoEntrega === 'recoger' ? 'bg-[#f4c430] text-black shadow' : 'text-white/60'}`}
                        onClick={() => setMetodoEntrega('recoger')}
                      >
                        🏪 Paso a recoger
                      </button>
                      <button 
                        className={`flex-1 py-2 text-sm font-bold rounded-md ${metodoEntrega === 'domicilio' ? 'bg-[#f4c430] text-black shadow' : 'text-white/60'}`}
                        onClick={() => setMetodoEntrega('domicilio')}
                      >
                        🛵 Envío a domicilio
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/80">Tu nombre*</label>
                      <input 
                        type="text" 
                        value={nombre} onChange={e => setNombre(e.target.value)}
                        className={`w-full bg-white/5 border ${errors.nombre ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430]`} 
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/80">WhatsApp / Celular*</label>
                      <input 
                        type="tel" 
                        value={telefono} onChange={e => setTelefono(e.target.value)}
                        className={`w-full bg-white/5 border ${errors.telefono ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430]`} 
                        placeholder="10 dígitos"
                      />
                    </div>

                    {metodoEntrega === 'domicilio' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">Calle y número*</label>
                          <input 
                            type="text" 
                            value={calle} onChange={e => setCalle(e.target.value)}
                            className={`w-full bg-white/5 border ${errors.calle ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430]`} 
                            placeholder="Ej. Zaragoza 123"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-white/80">Colonia*</label>
                          <input 
                            type="text" 
                            value={colonia} onChange={e => setColonia(e.target.value)}
                            className={`w-full bg-white/5 border ${errors.colonia ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430]`} 
                            placeholder="Ej. Centro"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/80">Forma de Pago*</label>
                      <select 
                        value={formaPago} onChange={e => setFormaPago(e.target.value)}
                        className="w-full bg-[#0f4c81] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430]"
                      >
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Transferencia">🏦 Transferencia (te pasamos los datos por WA)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/80">Comentarios (Opcional)</label>
                      <textarea 
                        value={notas} onChange={e => setNotas(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#f4c430] min-h-[80px]" 
                        placeholder="Ej. Sin verdura, sin cebolla..."
                      />
                    </div>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-[#0f4c81] border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/80 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-3xl font-black text-[#f4c430]">${cartTotal}</span>
                  </div>
                  
                  {cartStep === 'cart' ? (
                    <button 
                      onClick={handleSiguiente}
                      className="w-full bg-[#f4c430] hover:bg-[#e0b220] text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 transition-colors text-lg"
                    >
                      Siguiente - Datos de Entrega
                    </button>
                  ) : (
                    <button 
                      onClick={enviarWhatsApp}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 shadow-[0_5px_15px_rgba(34,197,94,0.3)] transition-colors text-lg"
                    >
                      <Phone size={24} fill="currentColor" />
                      Enviar pedido por WhatsApp
                    </button>
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
