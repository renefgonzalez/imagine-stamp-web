// ── CartDrawer — Carrito lateral de 2 pasos + Éxito ────────────────────────
// Paso 1: items con detalle (opciones), cantidades, eliminar
// Paso 2: datos del cliente + forma de pago (efectivo c/ cambio / transferencia c/ datos copiables)
// Paso 3: pantalla de éxito → redirección a WhatsApp en 500ms

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Check, Copy, Landmark, Banknote, Wallet, Bike, Store } from 'lucide-react';
import { CartItem, CustomerInfo } from '../types';
import { bankInfo, clientConfig } from '../config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (lineId: string, delta: number) => void;
  onRemove: (lineId: string) => void;
  cartTotal: number;
  whatsappNumber: string;
  businessName: string;
  onClearCart: () => void;
}

const C = clientConfig.colors;

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onRemove, cartTotal, whatsappNumber, businessName, onClearCart }: Props) {
  const [step, setStep] = useState(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '', phone: '', deliveryMethod: 'pickup', address: '',
    paymentMethod: 'cash', cashAmount: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { if (isOpen) setStep(1); }, [isOpen]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!customerInfo.name.trim()) e.name = 'Ingresa tu nombre';
    if (!customerInfo.phone.trim()) e.phone = 'Ingresa tu WhatsApp';
    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) e.address = 'Ingresa la dirección';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCopy = async (text: string, field: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(field); setTimeout(() => setCopied(null), 2000); } catch { /* fallback */ }
  };

  const changeAmount = customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount
    ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
    : null;

  const handleSendOrder = () => {
    if (!validate()) return;

    const itemsText = cart.map((item, i) => {
      const line = `${i + 1}. ${item.quantity}\u00D7 ${item.name}`;
      return item.detail ? `${line}\n   (${item.detail}) \u2014 $${item.unitPrice * item.quantity}` : `${line} \u2014 $${item.unitPrice * item.quantity}`;
    }).join('\n');

    const deliveryText = customerInfo.deliveryMethod === 'pickup'
      ? '\uD83D\uDED2 Recoger en local'
      : `\uD83D\uDEF5 Env\u00EDo a domicilio: ${customerInfo.address}`;

    let paymentText = '';
    if (customerInfo.paymentMethod === 'cash') {
      paymentText = '\uD83D\uDCB5 Efectivo';
      if (customerInfo.cashAmount) paymentText += ` (paga con $${customerInfo.cashAmount}, cambio: $${Math.max(0, Number(customerInfo.cashAmount) - cartTotal)})`;
    } else {
      paymentText = '\uD83C\uDFE6 Transferencia (enviar comprobante)';
    }

    const message = `\uD83D\uDED2 *NUEVO PEDIDO \u2014 ${businessName.toUpperCase()}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDCCB *PEDIDO (${totalItems} items):*\n${itemsText}\n\n\uD83D\uDCB5 *TOTAL: $${cartTotal}*\n\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\n\uD83D\uDC64 *Cliente:* ${customerInfo.name}\n\uD83D\uDCF1 *WhatsApp:* ${customerInfo.phone}\n${deliveryText}\n${paymentText}${customerInfo.notes ? `\n\uD83D\uDCDD *Notas:* ${customerInfo.notes}` : ''}`;

    setStep(3);
    setTimeout(() => {
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      onClearCart();
      setCustomerInfo({ name: '', phone: '', deliveryMethod: 'pickup', address: '', paymentMethod: 'cash', cashAmount: '', notes: '' });
    }, 500);
  };

  const bankFields = [
    { key: 'bankName', label: 'Banco', value: bankInfo.bankName },
    { key: 'accountHolder', label: 'Titular', value: bankInfo.accountHolder },
    { key: 'clabe', label: 'CLABE', value: bankInfo.clabe },
    { key: 'cardNumber', label: 'Tarjeta', value: bankInfo.cardNumber },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[80] flex flex-col"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 shrink-0" style={{ backgroundColor: C.primary }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-white" />
                <h2 className="font-black text-sm uppercase tracking-wide text-white">
                  {step === 1 ? 'Tu Pedido' : step === 2 ? 'Tus Datos' : '¡Listo!'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {step < 3 && (
                  <span className="text-[10px] font-black text-white/60 bg-white/10 px-2 py-1 rounded-full">
                    Paso {step}/2
                  </span>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <X size={16} className="text-white" />
                </button>
              </div>
            </div>

            {/* ── Paso 1: Items ── */}
            {step === 1 && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                        <ShoppingBag size={32} className="text-zinc-300" />
                      </div>
                      <p className="font-bold text-sm text-zinc-400">Tu carrito está vacío</p>
                      <p className="text-xs text-zinc-300 mt-1">Explora el menú</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {cart.map(item => (
                        <div key={item.lineId} className="flex gap-3 py-3 border-b border-zinc-50">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-[#111113] leading-tight">{item.name}</p>
                            {item.detail && (
                              <p className="text-[11px] text-zinc-400 mt-0.5 truncate">{item.detail}</p>
                            )}
                            <p className="text-xs text-zinc-400">${item.unitPrice} c/u</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <button
                                onClick={() => onUpdateQty(item.lineId, -1)}
                                className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90 transition-transform"
                              >
                                <Minus size={12} className="text-zinc-500" />
                              </button>
                              <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQty(item.lineId, 1)}
                                className="w-7 h-7 rounded-lg border border-zinc-200 flex items-center justify-center active:scale-90 transition-transform"
                              >
                                <Plus size={12} className="text-zinc-500" />
                              </button>
                              <button
                                onClick={() => onRemove(item.lineId)}
                                className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={14} className="text-zinc-300 hover:text-red-500" />
                              </button>
                            </div>
                          </div>
                          <p className="font-black text-sm text-[#111113] shrink-0">${item.unitPrice * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="px-5 py-4 border-t border-zinc-100 bg-white shrink-0">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-zinc-400">{totalItems} items</span>
                      <span className="text-xl font-black" style={{ color: C.secondary }}>${cartTotal}</span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-wide text-sm active:scale-[0.98] transition-transform shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`,
                        boxShadow: `0 10px 30px -8px ${C.secondary}60`,
                      }}
                    >
                      Continuar → Datos de Entrega
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── Paso 2: Datos del cliente ── */}
            {step === 2 && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Nombre</label>
                    <input
                      value={customerInfo.name} onChange={e => { setCustomerInfo({ ...customerInfo, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                      placeholder="Tu nombre completo" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 font-bold mt-1">{errors.name}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">WhatsApp</label>
                    <input
                      value={customerInfo.phone} onChange={e => { setCustomerInfo({ ...customerInfo, phone: e.target.value }); setErrors({ ...errors, phone: '' }); }}
                      placeholder="55 1234 5678" type="tel" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 font-bold mt-1">{errors.phone}</p>}
                  </div>

                  {/* Método de entrega */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Entrega</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'pickup' })}
                        className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        style={{
                          borderColor: customerInfo.deliveryMethod === 'pickup' ? C.secondary : '#e4e4e7',
                          backgroundColor: customerInfo.deliveryMethod === 'pickup' ? `${C.secondary}10` : 'white',
                          color: customerInfo.deliveryMethod === 'pickup' ? C.secondary : C.textSecondary,
                        }}
                      >
                        <Store size={14} /> Recoger en local
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'delivery' })}
                        className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        style={{
                          borderColor: customerInfo.deliveryMethod === 'delivery' ? C.secondary : '#e4e4e7',
                          backgroundColor: customerInfo.deliveryMethod === 'delivery' ? `${C.secondary}10` : 'white',
                          color: customerInfo.deliveryMethod === 'delivery' ? C.secondary : C.textSecondary,
                        }}
                      >
                        <Bike size={14} /> Domicilio
                      </button>
                    </div>
                  </div>

                  {/* Dirección */}
                  {customerInfo.deliveryMethod === 'delivery' && (
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Dirección</label>
                      <input
                        value={customerInfo.address} onChange={e => { setCustomerInfo({ ...customerInfo, address: e.target.value }); setErrors({ ...errors, address: '' }); }}
                        placeholder="Calle, número, colonia, CP" className={`w-full p-3 rounded-xl border text-sm mt-1 text-[16px] transition-colors ${errors.address ? 'border-red-400 bg-red-50' : 'border-zinc-200'}`}
                      />
                      {errors.address && <p className="text-[11px] text-red-500 font-bold mt-1">{errors.address}</p>}
                    </div>
                  )}

                  {/* Forma de pago */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Forma de Pago</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cash' })}
                        className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        style={{
                          borderColor: customerInfo.paymentMethod === 'cash' ? C.secondary : '#e4e4e7',
                          backgroundColor: customerInfo.paymentMethod === 'cash' ? `${C.secondary}10` : 'white',
                          color: customerInfo.paymentMethod === 'cash' ? C.secondary : C.textSecondary,
                        }}
                      >
                        <Wallet size={14} /> Efectivo
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })}
                        className="py-3 rounded-xl border-2 text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        style={{
                          borderColor: customerInfo.paymentMethod === 'transfer' ? C.secondary : '#e4e4e7',
                          backgroundColor: customerInfo.paymentMethod === 'transfer' ? `${C.secondary}10` : 'white',
                          color: customerInfo.paymentMethod === 'transfer' ? C.secondary : C.textSecondary,
                        }}
                      >
                        <Landmark size={14} /> Transferencia
                      </button>
                    </div>
                  </div>

                  {/* Efectivo: cambio */}
                  {customerInfo.paymentMethod === 'cash' && (
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">¿Con cuánto pagas?</label>
                      <input
                        type="number" value={customerInfo.cashAmount} onChange={e => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                        placeholder="Ej: 500" className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px]"
                      />
                      {changeAmount !== null && changeAmount >= 0 && (
                        <p className="text-xs font-bold mt-1 flex items-center gap-1" style={{ color: C.accent }}>
                          <Check size={12} /> Tu cambio: ${changeAmount}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Transferencia: datos bancarios */}
                  {customerInfo.paymentMethod === 'transfer' && (
                    <div className="rounded-2xl border-2 p-4 space-y-3" style={{ borderColor: `${C.accent}40`, backgroundColor: `${C.accent}08` }}>
                      <div className="flex items-center gap-2">
                        <Landmark size={16} style={{ color: C.accent }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em]" style={{ color: C.accent }}>Datos Bancarios</span>
                      </div>
                      {bankFields.map(f => (
                        <div key={f.key} className="flex items-center justify-between bg-white rounded-xl p-3 border border-zinc-100">
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">{f.label}</p>
                            <p className="text-sm font-bold text-[#111113] mt-0.5">{f.value}</p>
                          </div>
                          <button
                            onClick={() => handleCopy(f.value.replace(/\s/g, ''), f.key)}
                            className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors active:scale-90 shrink-0"
                          >
                            {copied === f.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-zinc-500" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notas */}
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Notas para la cocina</label>
                    <textarea
                      value={customerInfo.notes} onChange={e => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Sin cebolla, extra salsa, alergias..." rows={2} className="w-full p-3 rounded-xl border border-zinc-200 text-sm mt-1 text-[16px] resize-none"
                    />
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-zinc-100 bg-white shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors">
                      ← Volver al carrito
                    </button>
                    <span className="text-xl font-black" style={{ color: C.secondary }}>${cartTotal}</span>
                  </div>
                  <button
                    onClick={handleSendOrder}
                    className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-wide text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg"
                    style={{ backgroundColor: '#25D366', boxShadow: '0 10px 30px -8px #25D36660' }}
                  >
                    <MessageCircle size={18} /> Enviar Pedido por WhatsApp
                  </button>
                </div>
              </>
            )}

            {/* ── Paso 3: Éxito ── */}
            {step === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6"
                >
                  <Check size={44} className="text-green-600" />
                </motion.div>
                <h3 className="text-2xl font-black text-[#111113]">¡Pedido Enviado!</h3>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-xs">
                  Te estamos redirigiendo a WhatsApp para confirmar tu pedido con {businessName}.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-wide border-2 border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors active:scale-95"
                >
                  Hacer otro pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
