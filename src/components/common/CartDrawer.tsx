import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, ChevronRight, Landmark, Copy, Check, CreditCard, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCartStore } from '../../store/useCartStore';
import { siteConfig } from '../../config/siteConfig';

interface CartDrawerProps {
  phoneNumber?: string;
  bankInfo?: any;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ phoneNumber = '525650469993', bankInfo }) => {
  const { 
    cart, 
    isCartOpen, 
    cartStep, 
    customerInfo, 
    mpLoading,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    closeCart,
    setCartStep,
    setCustomerInfo,
    setMpLoading,
    clearCart,
    setCartToast
  } = useCartStore();

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }).catch(() => {});
  };

  const handleFinalCheckout = async () => {
    const lines = cart.map(item => `    ${item.name} x${item.quantity} = $${item.price * item.quantity} MXN`).join('\n');
    const total = totalPrice();

    const newOrder = {
      id: 'ORD-' + Date.now(),
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_city: customerInfo.city,
      delivery_notes: customerInfo.notes,
      payment_method: customerInfo.paymentMethod,
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total_amount: total,
      status: 'pending',
      internal_notes: []
    };

    // Guardar en Supabase
    supabase.from('orders').insert([newOrder]).then(({ error }) => {
      if (error) console.error("Error guardando pedido:", error);
    });

    const message =
      `Hola! Quiero realizar el siguiente pedido 🛍️\n\n` +
      `*Productos:*\n${lines}\n\n` +
      `*Total: $${total} MXN*\n\n` +
      `*Datos de entrega:*\n` +
      `👤 Nombre: ${customerInfo.name}\n` +
      `📱 WhatsApp: ${customerInfo.phone}\n` +
      `📍 Ciudad: ${customerInfo.city}\n` +
      `💳 Pago: ${customerInfo.paymentMethod}` +
      (customerInfo.notes ? `\n📝 Notas: ${customerInfo.notes}` : '');

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');

    clearCart();
    setCustomerInfo({ name: '', phone: '', city: '', notes: '', paymentMethod: 'Efectivo' });
    setCartStep('cart');
    closeCart();
  };

  const handleMercadoPagoCheckout = async () => {
    if (mpLoading) return;
    setMpLoading(true);

    const orderId = 'ORD-' + Date.now();
    const total = totalPrice();

    const newOrder = {
      id: orderId,
      customer_name: customerInfo.name,
      customer_phone: customerInfo.phone,
      customer_city: customerInfo.city,
      delivery_notes: customerInfo.notes,
      payment_method: 'Tarjeta (Mercado Pago)',
      items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
      total_amount: total,
      status: 'pending',
      internal_notes: []
    };

    try {
      const { error: orderError } = await supabase.from('orders').insert([newOrder]);
      if (orderError) throw new Error('No se pudo crear el pedido. Intenta de nuevo.');

      const { data, error } = await supabase.functions.invoke('create-preference', {
        body: {
          orderId,
          items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
          siteUrl: window.location.origin
        }
      });

      if (error) throw error;

      const redirectUrl = data?.init_point || data?.sandbox_init_point;
      if (!redirectUrl) throw new Error(data?.error ? JSON.stringify(data.error) : 'Mercado Pago no devolvió un enlace de pago.');

      clearCart();
      setCustomerInfo({ name: '', phone: '', city: '', notes: '', paymentMethod: 'Efectivo' });
      setCartStep('cart');
      closeCart();

      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error(err);
      setCartToast({ name: `❌ Error: ${err.message}` });
      setTimeout(() => setCartToast(null), 5000);
      setMpLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-md bg-background z-[70] shadow-2xl flex flex-col overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {cartStep === 'cart' ? (
                <motion.div key="cart" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col h-full p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-primary font-headline flex items-center gap-2">
                      <ShoppingBag size={24} className="text-secondary" />
                      Tu Pedido
                    </h2>
                    <button onClick={closeCart}><X size={24} className="text-primary" /></button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {cart.length === 0 ? (
                      <div className="text-center py-20 text-primary/40 flex flex-col items-center">
                        <ShoppingBag size={64} className="mb-4" />
                        <p className="font-bold text-sm">Tu carrito está vacío</p>
                      </div>
                    ) : (
                      cart.map(item => (
                        <div key={item.id} className="flex items-center gap-2 md:gap-3 bg-white p-3 md:p-4 rounded-2xl shadow-sm">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-primary/50 font-medium mt-0.5">${item.price} c/u</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg leading-none hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                            >−</button>
                            <span className="w-6 text-center font-black text-primary text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-lg leading-none hover:bg-secondary hover:text-white hover:border-secondary transition-all"
                            >+</button>
                          </div>
                          <div className="text-right shrink-0 min-w-[60px]">
                            <p className="font-black text-primary text-sm">${item.price * item.quantity}</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-primary/20 hover:text-error transition-colors"><X size={16} /></button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-primary/5 space-y-3 mt-auto pb-6 md:pb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-primary/50 font-medium text-sm">{totalItems()} {totalItems() === 1 ? 'artículo' : 'artículos'}</span>
                        <span className="text-2xl font-black text-primary">${totalPrice()} <span className="text-sm font-bold text-primary/40">MXN</span></span>
                      </div>
                      <button
                        onClick={() => setCartStep('details')}
                        className="w-full py-4 bg-secondary text-white rounded-2xl font-black text-base shadow-lg shadow-secondary/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                      >
                        Siguiente — Datos de Entrega
                        <ChevronRight size={20} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="details" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="flex flex-col h-full p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setCartStep('cart')} className="w-9 h-9 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-secondary hover:text-white transition-all">
                      <ChevronRight size={18} className="rotate-180" />
                    </button>
                    <h2 className="text-xl font-black text-primary font-headline">Datos de Entrega</h2>
                    <button onClick={closeCart} className="ml-auto"><X size={22} className="text-primary/40" /></button>
                  </div>

                  {/* Resumen compacto */}
                  <div className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-xs py-1">
                        <span className="text-primary/60 truncate pr-2">{item.name} <span className="font-bold">x{item.quantity}</span></span>
                        <span className="font-black text-primary shrink-0">${item.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="border-t border-primary/5 mt-2 pt-2 flex justify-between">
                      <span className="text-xs font-black text-primary/40 uppercase tracking-widest">Total</span>
                      <span className="font-black text-secondary">${totalPrice()} MXN</span>
                    </div>
                  </div>

                  {/* Formulario */}
                  <div className="flex-1 overflow-y-auto space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Nombre Completo *</label>
                      <input
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({ name: e.target.value })}
                        placeholder="Ej: María García López"
                        className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Teléfono WhatsApp *</label>
                      <input
                        value={customerInfo.phone}
                        onChange={e => setCustomerInfo({ phone: e.target.value })}
                        placeholder="10 dígitos"
                        type="tel"
                        className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Ciudad *</label>
                      <input
                        value={customerInfo.city}
                        onChange={e => setCustomerInfo({ city: e.target.value })}
                        placeholder="Ej: Guadalajara, Jalisco"
                        className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Forma de Pago *</label>
                      <select
                        value={customerInfo.paymentMethod}
                        onChange={e => setCustomerInfo({ paymentMethod: e.target.value })}
                        className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all cursor-pointer"
                      >
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="Transferencia">🏦 Transferencia Bancaria</option>
                        {siteConfig.FEATURES.useMercadoPago && (
                          <option value="Tarjeta">💳 Tarjeta (Mercado Pago)</option>
                        )}
                        <option value="Por Confirmar">⏳ Por Confirmar</option>
                      </select>
                    </div>

                    {/* ── Datos bancarios para transferencia ── */}
                    <AnimatePresence>
                      {customerInfo.paymentMethod === 'Transferencia' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white shrink-0">
                                <Landmark size={16} />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest leading-none">Datos para transferencia</p>
                                <p className="text-[9px] font-medium text-primary/40 mt-0.5">Realiza tu pago y envía el comprobante por WhatsApp</p>
                              </div>
                            </div>

                            {(() => {
                              const rows = [
                                { label: 'Banco', value: bankInfo?.bank_name, field: 'bank_name' },
                                { label: 'Titular', value: bankInfo?.account_holder, field: 'account_holder' },
                                { label: 'CLABE', value: bankInfo?.clabe, field: 'clabe' },
                                { label: 'No. de Cuenta', value: bankInfo?.account_number, field: 'account_number' },
                                { label: 'No. de Tarjeta', value: bankInfo?.card_number, field: 'card_number' },
                              ].filter(r => r.value && String(r.value).trim() !== '');

                              if (rows.length === 0) {
                                return (
                                  <p className="text-xs text-primary/40 italic py-2">
                                    Los datos bancarios se mostrarán aquí. Escríbenos por WhatsApp para coordinar tu pago.
                                  </p>
                                );
                              }

                              return (
                                <div className="space-y-2">
                                  {rows.map(row => (
                                    <div key={row.field} className="flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2 border border-primary/5">
                                      <div className="min-w-0">
                                        <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest">{row.label}</p>
                                        <p className="text-sm font-bold text-primary truncate">{row.value}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => copyToClipboard(String(row.value), row.field)}
                                        title="Copiar"
                                        className="shrink-0 w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary/40 hover:bg-secondary hover:text-white transition-all"
                                      >
                                        {copiedField === row.field ? <Check size={14} /> : <Copy size={14} />}
                                      </button>
                                    </div>
                                  ))}
                                  {bankInfo?.instructions && String(bankInfo.instructions).trim() !== '' && (
                                    <p className="text-[10px] text-primary/50 leading-relaxed bg-white rounded-xl px-3 py-2 border border-primary/5 whitespace-pre-line">
                                      {bankInfo.instructions}
                                    </p>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Aviso de pago con tarjeta (Mercado Pago) ── */}
                    <AnimatePresence>
                      {customerInfo.paymentMethod === 'Tarjeta' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-[#009EE3]/5 border border-[#009EE3]/20 rounded-2xl p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#009EE3] flex items-center justify-center text-white shrink-0">
                              <CreditCard size={16} />
                            </div>
                            <p className="text-[11px] font-medium text-primary/60 leading-relaxed">
                              Al confirmar, te llevaremos a la pantalla segura de <strong className="text-[#009EE3]">Mercado Pago</strong> para pagar con tarjeta de crédito o débito. Tu pedido se registra automáticamente.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div>
                      <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1.5 block ml-1">Notas Adicionales <span className="normal-case font-medium">(opcional)</span></label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={e => setCustomerInfo({ notes: e.target.value })}
                        placeholder="Color específico, medida, personalización..."
                        rows={2}
                        className="w-full bg-white border border-primary/10 text-primary p-4 rounded-2xl text-sm focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {customerInfo.paymentMethod === 'Tarjeta' ? (
                    <button
                      onClick={handleMercadoPagoCheckout}
                      disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.city || mpLoading}
                      className="mt-5 w-full py-4 bg-[#009EE3] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#008FCC] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <CreditCard size={22} />
                      {mpLoading ? 'Redirigiendo a Mercado Pago...' : 'Pagar con Tarjeta'}
                    </button>
                  ) : (
                    <button
                      onClick={handleFinalCheckout}
                      disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.city}
                      className="mt-5 w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-base shadow-lg hover:bg-[#1DAD54] transition-all flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <MessageCircle size={22} fill="currentColor" />
                      Finalizar Pedido vía WhatsApp
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
