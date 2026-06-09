import React, { useState } from 'react';
import { ShoppingBag, X, ChevronLeft } from 'lucide-react';
import { useCartStore } from './cartStore';

const FloatingCart = () => {
  const { items, removeItem, clearCart } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Steps: 1 = Resumen, 2 = Datos
  const [step, setStep] = useState(1);

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('A domicilio');
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [notes, setNotes] = useState('');

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Validation
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, ingresa tu nombre y teléfono para continuar.');
      return;
    }
    if (deliveryMethod === 'A domicilio' && !address.trim()) {
      alert('Por favor, ingresa tu dirección para el servicio a domicilio.');
      return;
    }

    const phoneNumber = "529381281914";
    let message = "¡Hola! Quiero hacer un pedido a Auténticas Cazuelitas La Patrona:\n\n";
    
    message += `👤 *Cliente:* ${name}\n`;
    message += `📱 *Teléfono:* ${phone}\n`;
    message += `🛵 *Tipo de entrega:* ${deliveryMethod}\n`;
    if (deliveryMethod === 'A domicilio') {
      message += `📍 *Dirección:* ${address}\n`;
    }
    message += `💳 *Método de pago:* ${paymentMethod}\n`;
    if (notes.trim()) {
      message += `📝 *Notas:* ${notes}\n`;
    }

    message += "\n*🛍️ DETALLE DEL PEDIDO:*\n";
    items.forEach(item => {
      message += `- ${item.quantity}x ${item.type} de ${item.guiso} ($${item.price * item.quantity})\n`;
    });
    message += `\n*💰 TOTAL: $${totalPrice}*\n`;
    message += "\n¡Gracias!";

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    // Reset state
    clearCart();
    setIsOpen(false);
    setStep(1);
    setName('');
    setPhone('');
    setAddress('');
    setNotes('');
  };

  const openModal = () => {
    setIsOpen(true);
    setStep(1);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  if (totalItems === 0) return null;

  return (
    <>
      <button 
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-[#D35400] text-[#F9E79F] px-6 py-3 rounded-[2rem] shadow-2xl flex items-center gap-4 z-50 hover:scale-105 transition-transform border border-[#F9E79F]/20"
      >
        <div className="relative">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span className="absolute -top-2 -right-3 bg-[#F9E79F] text-[#D35400] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#D35400]">
            {totalItems}
          </span>
        </div>
        <span className="font-bold text-lg">Total: ${totalPrice}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1A110D] border border-[#D35400] text-[#F9E79F] w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-[#1A110D] z-10 pb-2 border-b border-[#D35400]/20">
              <div className="flex items-center gap-2">
                {step === 2 && (
                  <button onClick={() => setStep(1)} className="text-[#D35400] hover:text-[#F9E79F] transition-colors p-1">
                    <ChevronLeft size={24} />
                  </button>
                )}
                <h3 className="text-xl font-black uppercase tracking-widest text-[#D35400]">
                  {step === 1 ? 'Tu Pedido' : 'Tus Datos'}
                </h3>
              </div>
              <button onClick={closeModal} className="text-[#F9E79F]/50 hover:text-white transition-colors p-1">
                <X size={24} />
              </button>
            </div>

            {/* Paso 1: Resumen del pedido */}
            {step === 1 && (
              <div className="flex flex-col h-full">
                <div className="overflow-y-auto pr-2 space-y-3 mb-6">
                  {items.map(item => (
                    <div key={item.id} className="bg-[#2A1D16] p-3 rounded-xl border border-[#F9E79F]/10 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-sm">{item.quantity}x {item.type} de {item.guiso}</p>
                        <p className="text-[#F9E79F]/60 text-xs">${item.price} c/u</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-black text-[#D35400]">${item.price * item.quantity}</p>
                        <button onClick={() => removeItem(item.id)} className="text-red-500/80 hover:text-red-500 bg-red-500/10 p-1.5 rounded-full transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-[#D35400]/30">
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-medium text-lg uppercase tracking-wider">Total</span>
                    <span className="font-black text-3xl text-white">${totalPrice}</span>
                  </div>
                  
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-[#D35400] text-white p-4 rounded-xl font-black text-base uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#A04000] transition-colors shadow-lg"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Formulario de datos */}
            {step === 2 && (
              <div className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Nombre Completo *</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white placeholder-[#F9E79F]/30 focus:outline-none focus:border-[#D35400] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Teléfono *</label>
                  <input 
                    type="tel" 
                    placeholder="Tu número de WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white placeholder-[#F9E79F]/30 focus:outline-none focus:border-[#D35400] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Envío</label>
                    <select
                      value={deliveryMethod}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#D35400] appearance-none"
                    >
                      <option value="A domicilio">A domicilio</option>
                      <option value="Recoger en local">Recoger</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Pago</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#D35400] appearance-none"
                    >
                      <option value="Efectivo">Efectivo</option>
                      <option value="Transferencia">Transfer</option>
                    </select>
                  </div>
                </div>

                {deliveryMethod === 'A domicilio' && (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Dirección de Entrega *</label>
                    <textarea 
                      placeholder="Calle, Número, Colonia, Referencias..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="2"
                      className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white placeholder-[#F9E79F]/30 focus:outline-none focus:border-[#D35400] resize-none transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#F9E79F]/70 uppercase tracking-wider pl-1">Notas (Opcional)</label>
                  <textarea 
                    placeholder="¿Alguna instrucción especial para tu pedido?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                    className="w-full bg-[#2A1D16] border border-[#F9E79F]/20 rounded-xl p-3.5 text-white placeholder-[#F9E79F]/30 focus:outline-none focus:border-[#D35400] resize-none transition-colors"
                  />
                </div>

                <div className="pt-4 mt-2">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#25D366] text-white p-4 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-colors shadow-lg"
                  >
                    Finalizar por WhatsApp
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
