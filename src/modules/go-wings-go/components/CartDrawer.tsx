// ── CartDrawer — Carrito lateral de 2 pasos + Pantalla de Éxito ────────────────
// Paso 1: Lista de productos con opciones detalladas, botones +/- y eliminar
// Paso 2: Datos de entrega (Pickup / Domicilio) + Pago (Efectivo c/ cambio / Transferencia c/ 1-tap copy)
// Paso 3: Pantalla de éxito + Redirección a WhatsApp en 500ms vía window.location.href

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Check,
  Copy, Landmark, Banknote, Bike, Store, ArrowRight, ArrowLeft,
  Sparkles, AlertCircle, ShieldCheck
} from 'lucide-react';
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

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  cartTotal,
  whatsappNumber,
  businessName,
  onClearCart,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    deliveryMethod: 'pickup',
    address: '',
    paymentMethod: 'cash',
    cashAmount: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customerInfo.name.trim()) errs.name = 'Por favor escribe tu nombre';
    if (!customerInfo.phone.trim()) {
      errs.phone = 'Escribe tu número de WhatsApp';
    } else if (customerInfo.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Ingresa un WhatsApp válido (mín. 8-10 dígitos)';
    }
    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
      errs.address = 'Escribe calle, número exterior, colonia y referencias';
    }
    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) {
      const amt = Number(customerInfo.cashAmount);
      if (isNaN(amt) || amt < cartTotal) {
        errs.cashAmount = `El monto debe ser igual o mayor a $${cartTotal}`;
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2200);
    } catch {
      // Fallback manual si clipboard API no está disponible
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(key);
      setTimeout(() => setCopied(null), 2200);
    }
  };

  const changeAmount =
    customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount
      ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
      : null;

  const handleSendOrder = () => {
    if (!validate()) return;

    const itemsText = cart
      .map((item, index) => {
        const line = `${index + 1}. *${item.quantity}x* ${item.name}`;
        const detail = item.detail ? `\n   ↳ _${item.detail}_` : '';
        const price = ` → *$${item.unitPrice * item.quantity}*`;
        return `${line}${price}${detail}`;
      })
      .join('\n\n');

    const deliveryText =
      customerInfo.deliveryMethod === 'pickup'
        ? '🏪 *Recoger en sucursal (Pickup)*'
        : `🛵 *Envío a Domicilio:*\n   📍 ${customerInfo.address}`;

    let paymentText = '';
    if (customerInfo.paymentMethod === 'cash') {
      paymentText = '💵 *Pago:* Efectivo al recibir';
      if (customerInfo.cashAmount) {
        paymentText += `\n   • Paga con: $${customerInfo.cashAmount}\n   • Cambio requerido: $${changeAmount}`;
      }
    } else {
      paymentText = '🏦 *Pago:* Transferencia SPEI (Adjunto comprobante)';
    }

    const message = `🍗 *NUEVO PEDIDO — ${businessName}* 🍗\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *Cliente:* ${customerInfo.name}\n` +
      `📱 *WhatsApp:* ${customerInfo.phone}\n` +
      `${deliveryText}\n` +
      `${paymentText}\n` +
      (customerInfo.notes ? `📝 *Instrucciones especiales:* ${customerInfo.notes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📋 *DETALLE DEL PEDIDO (${totalItems} items):*\n\n` +
      `${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔥 *TOTAL A PAGAR: $${cartTotal} MXN*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_Pedido generado desde el Menú Digital Go! Wings Go_`;

    setStep(3);

    // Delay de 500ms y redirección estricta con window.location.href (NUNCA window.open)
    setTimeout(() => {
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      onClearCart();
      setCustomerInfo({
        name: '',
        phone: '',
        deliveryMethod: 'pickup',
        address: '',
        paymentMethod: 'cash',
        cashAmount: '',
        notes: '',
      });
    }, 550);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />

          {/* Drawer Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#121110] border-l border-white/10 z-[85] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* ── HEADER DEL DRAWER ── */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#161514]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4816] to-[#FF8C00] flex items-center justify-center text-white shadow-lg shadow-[#FF4816]/30">
                  <ShoppingBag size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg tracking-tight uppercase flex items-center gap-2">
                    Tu Pedido
                    {totalItems > 0 && (
                      <span className="text-xs bg-[#FF4816] text-white px-2 py-0.5 rounded-full font-bold">
                        {totalItems}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {step === 1 && 'Revisa y ajusta tus platillos'}
                    {step === 2 && 'Datos de entrega y forma de pago'}
                    {step === 3 && '¡Enviando pedido a cocina!'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Cerrar pedido"
              >
                <X size={20} />
              </button>
            </div>

            {/* ── STEP INDICATOR (PASO 1 & 2) ── */}
            {step !== 3 && (
              <div className="px-5 py-3 bg-[#191817] border-b border-white/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      step === 1 ? 'bg-[#FF4816] text-white' : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {step === 1 ? '1' : '✓'}
                  </span>
                  <span className={step === 1 ? 'text-white font-bold' : 'text-zinc-400'}>
                    Platillos ({totalItems})
                  </span>
                </div>
                <div className="h-px w-10 bg-white/10" />
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                      step === 2 ? 'bg-[#FF4816] text-white' : 'bg-white/10 text-zinc-400'
                    }`}
                  >
                    2
                  </span>
                  <span className={step === 2 ? 'text-white font-bold' : 'text-zinc-400'}>
                    Entrega y Pago
                  </span>
                </div>
              </div>
            )}

            {/* ── CONTENIDO PRINCIPAL SCROLLEABLE ── */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* ════════════════ PASO 1: LISTA DE PRODUCTOS ════════════════ */}
              {step === 1 && (
                <>
                  {cart.length === 0 ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-600">
                        <ShoppingBag size={36} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-bold text-lg">Tu carrito está vacío</p>
                        <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                          Agrega unas crujientes alitas, pizzetas al horno o unos tacos para comenzar.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4816] to-[#FF6A00] text-white font-bold text-sm shadow-lg shadow-[#FF4816]/25 hover:brightness-110 transition-all"
                      >
                        Explorar Menú
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <motion.div
                          key={item.lineId}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-3.5 rounded-2xl bg-[#181716] border border-white/5 hover:border-white/10 transition-all flex gap-3 group"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-white font-bold text-sm leading-tight truncate">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => onRemove(item.lineId)}
                                  className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                                  title="Eliminar producto"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                              {item.detail && (
                                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                                  {item.detail}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                              <span className="text-[#FFB800] font-black text-sm">
                                ${item.unitPrice * item.quantity}
                              </span>
                              <div className="flex items-center gap-1 bg-[#201F1E] rounded-lg p-0.5 border border-white/5">
                                <button
                                  onClick={() => onUpdateQty(item.lineId, -1)}
                                  className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center justify-center transition-colors"
                                  aria-label="Disminuir"
                                >
                                  <Minus size={13} />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQty(item.lineId, 1)}
                                  className="w-6 h-6 rounded-md bg-[#FF4816] hover:bg-[#FF5E31] text-white flex items-center justify-center transition-colors"
                                  aria-label="Aumentar"
                                >
                                  <Plus size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {/* Botón vaciar carrito */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={onClearCart}
                          className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 size={13} /> Vaciar carrito
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ════════════════ PASO 2: DATOS DE ENTREGA Y PAGO ════════════════ */}
              {step === 2 && (
                <div className="space-y-5">
                  {/* Datos del Cliente */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Store size={14} className="text-[#FF4816]" /> Tus Datos
                    </h3>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Nombre Completo <span className="text-[#FF4816]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. René González"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className={`w-full bg-[#1A1918] border rounded-xl px-3.5 py-2.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4816] transition-colors ${
                          errors.name ? 'border-red-500 bg-red-500/5' : 'border-white/10'
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        WhatsApp de Contacto <span className="text-[#FF4816]">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 55 1234 5678"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className={`w-full bg-[#1A1918] border rounded-xl px-3.5 py-2.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4816] transition-colors ${
                          errors.phone ? 'border-red-500 bg-red-500/5' : 'border-white/10'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle size={11} /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Método de Entrega */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Bike size={14} className="text-[#FF4816]" /> Tipo de Entrega
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'pickup' })}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          customerInfo.deliveryMethod === 'pickup'
                            ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-lg shadow-[#FF4816]/15'
                            : 'bg-[#181716] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Store size={18} className={customerInfo.deliveryMethod === 'pickup' ? 'text-[#FF4816]' : ''} />
                          {customerInfo.deliveryMethod === 'pickup' && <Check size={14} className="text-[#FF4816]" />}
                        </div>
                        <span className="text-xs font-bold mt-1">Pickup Local</span>
                        <span className="text-[10px] text-zinc-400 leading-tight">Sin costo · Listo en ~20m</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, deliveryMethod: 'delivery' })}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          customerInfo.deliveryMethod === 'delivery'
                            ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-lg shadow-[#FF4816]/15'
                            : 'bg-[#181716] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Bike size={18} className={customerInfo.deliveryMethod === 'delivery' ? 'text-[#FF4816]' : ''} />
                          {customerInfo.deliveryMethod === 'delivery' && <Check size={14} className="text-[#FF4816]" />}
                        </div>
                        <span className="text-xs font-bold mt-1">A Domicilio</span>
                        <span className="text-[10px] text-zinc-400 leading-tight">Empaque térmico</span>
                      </button>
                    </div>

                    {customerInfo.deliveryMethod === 'delivery' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1 pt-1"
                      >
                        <label className="block text-xs font-bold text-zinc-300">
                          Dirección de Entrega <span className="text-[#FF4816]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Calle, número ext/int, colonia, referencias (casa blanca, portón café)..."
                          value={customerInfo.address}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                          className={`w-full bg-[#1A1918] border rounded-xl px-3.5 py-2 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4816] transition-colors resize-none ${
                            errors.address ? 'border-red-500 bg-red-500/5' : 'border-white/10'
                          }`}
                        />
                        {errors.address && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1">
                            <AlertCircle size={11} /> {errors.address}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Forma de Pago */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                      <Banknote size={14} className="text-[#FF4816]" /> Forma de Pago
                    </h3>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cash' })}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          customerInfo.paymentMethod === 'cash'
                            ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-lg shadow-[#FF4816]/15'
                            : 'bg-[#181716] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Banknote size={18} className={customerInfo.paymentMethod === 'cash' ? 'text-[#FF4816]' : ''} />
                          {customerInfo.paymentMethod === 'cash' && <Check size={14} className="text-[#FF4816]" />}
                        </div>
                        <span className="text-xs font-bold mt-1">Efectivo</span>
                        <span className="text-[10px] text-zinc-400">Pagas al recibir</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          customerInfo.paymentMethod === 'transfer'
                            ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-lg shadow-[#FF4816]/15'
                            : 'bg-[#181716] border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Landmark size={18} className={customerInfo.paymentMethod === 'transfer' ? 'text-[#FF4816]' : ''} />
                          {customerInfo.paymentMethod === 'transfer' && <Check size={14} className="text-[#FF4816]" />}
                        </div>
                        <span className="text-xs font-bold mt-1">Transferencia</span>
                        <span className="text-[10px] text-zinc-400">SPEI sin comisión</span>
                      </button>
                    </div>

                    {/* Desglose de Efectivo (con cambio calculado) */}
                    {customerInfo.paymentMethod === 'cash' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 rounded-xl bg-[#1A1918] border border-white/10 space-y-2.5"
                      >
                        <label className="block text-xs font-bold text-zinc-300">
                          ¿Con cuánto vas a pagar? (Opcional para llevar tu cambio)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-zinc-400 font-bold text-sm">$</span>
                          <input
                            type="number"
                            placeholder={`${cartTotal} o más`}
                            value={customerInfo.cashAmount}
                            onChange={(e) => setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })}
                            className="w-full bg-[#121110] border border-white/10 rounded-lg pl-7 pr-3 py-2 text-base text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF4816]"
                          />
                        </div>
                        {changeAmount !== null && (
                          <div className="flex items-center justify-between text-xs pt-1 text-zinc-300">
                            <span>Tu cambio será:</span>
                            <span className="text-emerald-400 font-black text-sm">
                              ${changeAmount} MXN
                            </span>
                          </div>
                        )}
                        {errors.cashAmount && (
                          <p className="text-[11px] text-red-400 flex items-center gap-1">
                            <AlertCircle size={11} /> {errors.cashAmount}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Desglose de Transferencia con 1-tap copy */}
                    {customerInfo.paymentMethod === 'transfer' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3.5 rounded-xl bg-[#1A1918] border border-[#FF4816]/30 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#FFB800]">
                          <Sparkles size={14} /> Datos Bancarios Oficiales
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-zinc-400">Banco:</span>
                            <span className="text-white font-bold">{bankInfo.bankName}</span>
                          </div>
                          <div className="flex justify-between items-center py-1 border-b border-white/5">
                            <span className="text-zinc-400">Titular:</span>
                            <span className="text-white font-medium truncate max-w-[200px] text-right">
                              {bankInfo.accountHolder}
                            </span>
                          </div>

                          {/* CLABE con botón copiar */}
                          <div className="p-2.5 rounded-lg bg-[#121110] border border-white/10 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">
                                CLABE Interbancaria
                              </p>
                              <p className="font-mono text-xs text-white font-bold tracking-wider mt-0.5">
                                {bankInfo.clabe}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopy(bankInfo.clabe.replace(/\s+/g, ''), 'clabe')}
                              className="px-2.5 py-1.5 rounded-md bg-[#FF4816]/20 hover:bg-[#FF4816] text-[#FF4816] hover:text-white font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              {copied === 'clabe' ? (
                                <>
                                  <Check size={12} /> Copiado
                                </>
                              ) : (
                                <>
                                  <Copy size={12} /> Copiar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-[11px] text-zinc-400 leading-tight">
                          💡 Al confirmar, se abrirá WhatsApp donde podrás adjuntar tu comprobante de pago.
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Instrucciones / Notas especiales */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-zinc-300">
                      Notas especiales para cocina (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Salsas bien bañadas, servilletas extra, timbre descompuesto..."
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full bg-[#1A1918] border border-white/10 rounded-xl px-3.5 py-2.5 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF4816]"
                    />
                  </div>
                </div>
              )}

              {/* ════════════════ PASO 3: ÉXITO Y REDIRECCIÓN ════════════════ */}
              {step === 3 && (
                <div className="py-16 text-center space-y-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20"
                  >
                    <Check size={40} className="stroke-[3]" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">
                      ¡Pedido Preparado!
                    </h3>
                    <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      Te estamos redirigiendo a WhatsApp para confirmar tu orden directamente con el restaurante...
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-[#FF4816] font-bold animate-pulse">
                    <MessageCircle size={16} /> Abriendo WhatsApp en unos instantes
                  </div>

                  <div className="pt-4">
                    <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                      <div className="w-full h-full bg-[#FF4816] animate-[shimmer_1s_infinite]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── FOOTER DEL DRAWER CON TOTAL Y BOTONES ── */}
            {step !== 3 && cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161514] space-y-3">
                {/* Resumen Total */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                      Total a pagar
                    </span>
                    <p className="text-2xl font-black text-white leading-none mt-1">
                      ${cartTotal} <span className="text-xs text-zinc-400 font-bold">MXN</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck size={13} /> Pedido seguro WhatsApp
                    </span>
                    <span className="text-[10px] text-zinc-500">Sin comisiones de apps</span>
                  </div>
                </div>

                {/* Acciones por paso */}
                {step === 1 ? (
                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF4816] via-[#FF5E31] to-[#FF8C00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FF4816]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    Continuar con Entrega <ArrowRight size={18} />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold text-xs uppercase transition-colors flex items-center gap-1.5"
                    >
                      <ArrowLeft size={16} /> Volver
                    </button>
                    <button
                      type="button"
                      onClick={handleSendOrder}
                      className="flex-1 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#25D366]/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={19} className="stroke-[2.5]" />
                      Enviar a WhatsApp
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
