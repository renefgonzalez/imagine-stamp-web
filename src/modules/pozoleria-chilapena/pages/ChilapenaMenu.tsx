import React, { useState, useMemo } from 'react';
import { ShoppingBag, Plus, Minus, Phone, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Using high quality Unsplash placeholders for Mexican food
const MENU_DATA = [
  {
    category: 'Pozole',
    description: 'Verde: Auténtica receta guerrerense a base de semilla de pipián.\nRojo: Guisado con Chile guajillo, inigualable sabor.\nBlanco: Elaborado de la forma tradicional artesanal 100%.',
    items: [
      { id: 'poz-1', name: 'Pozole Mini', price: 85, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200' },
      { id: 'poz-2', name: 'Pozole Chico', price: 110, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200' },
      { id: 'poz-3', name: 'Pozole Grande', price: 160, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200' },
      { id: 'poz-4', name: 'Para llevar (Litro)', price: 150, img: 'https://images.unsplash.com/photo-1596624021204-7476831d2ba3?q=80&w=200' },
      { id: 'poz-5', name: 'Para llevar (Medio Litro)', price: 80, img: 'https://images.unsplash.com/photo-1596624021204-7476831d2ba3?q=80&w=200' },
    ]
  },
  {
    category: 'Extras',
    description: 'Complementa tu platillo.',
    items: [
      { id: 'ext-1', name: 'Tostadas', price: 40, img: 'https://images.unsplash.com/photo-1615486171448-4fd93b6831d1?q=80&w=200' },
      { id: 'ext-2', name: 'Aguacate', price: 45, img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=200' },
      { id: 'ext-3', name: 'Crema', price: 30 },
      { id: 'ext-4', name: 'Queso', price: 35, img: 'https://images.unsplash.com/photo-1631452296720-334da839db99?q=80&w=200' },
      { id: 'ext-5', name: 'Carne (Pollo o Puerco)', price: 35 },
      { id: 'ext-6', name: 'Chicharrón (Duro)', price: 40 },
      { id: 'ext-7', name: 'Consomé', price: 40 },
    ]
  },
  {
    category: 'Antojitos',
    description: '',
    items: [
      { id: 'ant-1', name: 'Pieza de Tostada', desc: 'Pollo, puerco, tinga, cueritos o pata', price: 90, img: 'https://images.unsplash.com/photo-1615486171448-4fd93b6831d1?q=80&w=200' },
      { id: 'ant-2', name: 'Chalupas (5 piezas)', desc: 'Pollo, puerco o tinga', price: 105, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=200' },
      { id: 'ant-3', name: 'Enchiladas Rojas (4 piezas)', desc: 'Pollo, queso o papa', price: 125, img: 'https://images.unsplash.com/photo-1584347209700-1c3906a20bc2?q=80&w=200' },
      { id: 'ant-4', name: 'Enchiladas Verdes (4 piezas)', desc: 'Pollo, queso o papa', price: 130, img: 'https://images.unsplash.com/photo-1584347209700-1c3906a20bc2?q=80&w=200' },
      { id: 'ant-5', name: 'Enchiladas Con Consomé', desc: 'Rojas, pollo, queso o papa', price: 155, img: 'https://images.unsplash.com/photo-1584347209700-1c3906a20bc2?q=80&w=200' },
      { id: 'ant-6', name: 'Enchiladas Suizas (4 piezas)', desc: 'Pollo, queso o papa', price: 170, img: 'https://images.unsplash.com/photo-1584347209700-1c3906a20bc2?q=80&w=200' },
      { id: 'ant-7', name: 'Enmoladas (4 piezas)', desc: 'Pollo, queso o papa', price: 160 },
      { id: 'ant-8', name: 'Flautas (5 piezas)', desc: 'Pollo, papa o requesón', price: 95, img: 'https://images.unsplash.com/photo-1615486171448-4fd93b6831d1?q=80&w=200' },
      { id: 'ant-9', name: 'Flautas con consomé (5 piezas)', desc: 'Pollo, papa o requesón', price: 130 },
      { id: 'ant-10', name: 'Sopes (3 piezas)', desc: 'Pollo, puerco, tinga y papa', price: 120, img: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?q=80&w=200' },
    ]
  },
  {
    category: 'Mixtos',
    description: 'Combinaciones perfectas.',
    items: [
      { id: 'mix-1', name: 'Mixto 1', desc: '2 Chalupas, 2 Flautas, 1 Tostada', price: 165, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=200' },
      { id: 'mix-2', name: 'Mixto 2', desc: '2 Enchiladas, 2 Flautas, 1 Tostada', price: 165 },
      { id: 'mix-3', name: 'Mixto 3', desc: '2 Enchiladas, 2 Flautas, 2 Chalupas, 1 Tostada', price: 195 },
      { id: 'mix-4', name: 'Mixto 4', desc: '2 Enchiladas Rojas, 2 Verdes y 2 Enmoladas', price: 210 },
    ]
  },
  {
    category: 'Bebidas',
    description: '',
    items: [
      { id: 'beb-1', name: 'Refrescos', price: 45, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200' },
      { id: 'beb-2', name: 'Yoli', price: 75, img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200' },
      { id: 'beb-3', name: 'Café o té', price: 35, img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=200' },
      { id: 'beb-4', name: 'Agua Fresca (Vaso)', price: 45, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200' },
      { id: 'beb-5', name: 'Agua Fresca (Litro)', price: 90, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200' },
      { id: 'beb-6', name: 'Agua Fresca (Jarra 2 Litros)', price: 140, img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=200' },
    ]
  },
  {
    category: 'Postres',
    description: '',
    items: [
      { id: 'pos-1', name: 'Flan Napolitano', price: 75, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=200' },
      { id: 'pos-2', name: 'Elote y Vainilla', price: 55, img: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=200' },
      { id: 'pos-3', name: 'Arroz con leche', price: 55, img: 'https://images.unsplash.com/photo-1633519895085-f855e97669b7?q=80&w=200' },
    ]
  }
];

export default function ChilapenaMenu() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    
    let mensaje = `🍲 *NUEVO PEDIDO - LA CHILAPEÑA*\n\n`;
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
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-widest" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>La Chilapeña</h1>
          <p className="text-[#f4c430] text-xs font-bold uppercase tracking-[0.2em]">Pozolería Tradicional</p>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map(item => (
                  <div key={item.id} className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex gap-4 transition-colors">
                    {/* Item Image */}
                    <div className="w-20 h-20 bg-white/10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {item.img ? (
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-white/30" size={32} />
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{item.name}</h3>
                        {item.desc && <p className="text-white/60 text-xs mt-1">{item.desc}</p>}
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <span className="text-[#f4c430] font-black text-lg">${item.price.toFixed(2)}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="bg-white/10 hover:bg-[#f4c430] hover:text-black text-white p-2 rounded-full transition-colors shadow-sm"
                        >
                          <Plus size={18} />
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
