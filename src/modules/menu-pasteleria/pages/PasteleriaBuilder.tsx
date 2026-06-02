import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, Check, Plus, Minus, Trash2, X } from 'lucide-react';
import { PANES, RELLENOS, EXTRAS } from '../constants';

interface CustomCake {
  id: string;
  pan: string;
  relleno: string;
  extras: string[];
  quantity: number;
}

const WHATSAPP_NUMBER = '525650469993';

export function PasteleriaBuilder() {
  const [selectedPan, setSelectedPan] = useState<string | null>(null);
  const [selectedRelleno, setSelectedRelleno] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  const [cart, setCart] = useState<CustomCake[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const isComplete = selectedPan && selectedRelleno;

  const handleAddToCart = () => {
    if (!isComplete) return;

    const newCake: CustomCake = {
      id: crypto.randomUUID(),
      pan: selectedPan,
      relleno: selectedRelleno,
      extras: selectedExtras,
      quantity: 1
    };

    setCart(prev => [...prev, newCake]);
    
    // Reset selection
    setSelectedPan(null);
    setSelectedRelleno(null);
    setSelectedExtras([]);
    setIsCartOpen(true); // Open cart to show success visually
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

  const handleCheckout = () => {
    const lines = cart.map(item => {
      const panName = PANES.find(p => p.id === item.pan)?.name;
      const rellenoName = RELLENOS.find(r => r.id === item.relleno)?.name;
      const extrasNames = item.extras.map(eId => EXTRAS.find(e => e.id === eId)?.name).join(', ');
      
      return `🎂 *${item.quantity}x Pastel Personalizado Lázaro*\n  • Pan: ${panName}\n  • Relleno: ${rellenoName}\n  • Extras: ${extrasNames || 'Ninguno'}`;
    }).join('\n\n');

    const name = customerName.trim() || 'Cliente';

    const message = 
      `✨ *Nuevo Pedido - Lázaro Pastelería*\n\n` +
      `Hola! Soy *${name}* y he diseñado este pedido:\n\n` +
      `${lines}\n\n` +
      `_Pedido generado desde el constructor interactivo_ 🤍`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    
    setTimeout(() => {
      setCart([]);
      setCustomerName('');
      setIsCartOpen(false);
    }, 2000);
  };

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0);

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
            onClick={() => setIsCartOpen(true)}
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

      {/* CONSTRUCTOR INTERACTIVO */}
      <main className="max-w-2xl mx-auto px-6 py-10 space-y-16">
        
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
        {isComplete && (
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

      {/* CARRITO SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full md:w-[450px] bg-white border-l border-stone-200 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h3 className="text-xl font-serif">Tu Pedido</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-stone-400 hover:text-stone-900">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-400">
                    <ShoppingBag size={48} strokeWidth={1} className="mb-4" />
                    <p className="font-light tracking-wide">No has creado ningún pastel aún.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map(item => (
                      <div key={item.id} className="border-b border-stone-100 pb-6 last:border-0">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-stone-900">Pastel Personalizado Lázaro</h4>
                          <button onClick={() => handleRemove(item.id)} className="text-stone-400 hover:text-red-500">
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

                        <div className="flex items-center gap-4">
                          <span className="text-xs uppercase tracking-widest text-stone-400">Cantidad:</span>
                          <div className="flex items-center border border-stone-200 rounded-none">
                            <button onClick={() => handleUpdateQty(item.id, -1)} className="p-2 hover:bg-stone-50"><Minus size={14} /></button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => handleUpdateQty(item.id, 1)} className="p-2 hover:bg-stone-50"><Plus size={14} /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 bg-stone-50 border-t border-stone-100">
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Nombre del cliente"
                  className="w-full bg-white border border-stone-200 px-4 py-3 text-sm outline-none focus:border-stone-900 transition-colors mb-4"
                />
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-stone-900 text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-30 flex justify-center items-center gap-2"
                >
                  Confirmar por WhatsApp <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Just a quick local icon component since ArrowRight isn't imported
function ArrowRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}
