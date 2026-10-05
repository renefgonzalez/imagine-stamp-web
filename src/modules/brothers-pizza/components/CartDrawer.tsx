// ── CartDrawer — Carrito de 2 Pasos + Pantalla de Éxito para Brothers Pizza ───────
// Paso 1: Productos con detalle de rebanadas/extras, cantidad (+/-), subtotal y total.
// Paso 2: Datos de entrega (Pickup / Envío a Domicilio) + Pago (Efectivo con cambio / Bancoppel con 1-tap copy).
// Paso 3: Éxito animado y redirección a WhatsApp tras 500ms vía window.location.href (NUNCA window.open).

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Check,
  Copy, Landmark, Banknote, Bike, Store, ArrowRight, ArrowLeft,
  Sparkles, AlertCircle, ShieldCheck, Pizza
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
    deliveryMethod: 'delivery',
    address: '',
    paymentMethod: 'cash',
    cashAmount: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  // Reiniciar a paso 1 cada vez que se abre
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
      setTimeout(() => setCopied(null), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(key);
      setTimeout(() => setCopied(null), 2500);
    }
  };

  const changeAmount =
    customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount
      ? Math.max(0, Number(customerInfo.cashAmount) - cartTotal)
      : null;

  const handleSendOrder = () => {
    if (!validate()) return;

    // 1. Mostrar pantalla de éxito inmediatamente
    setStep(3);

    // 2. Construir mensaje estructurado para WhatsApp
    const deliveryLabel =
      customerInfo.deliveryMethod === 'delivery'
        ? `🛵 Envío a Domicilio:\n${customerInfo.address}`
        : '🏪 Recoger en Sucursal (Pickup)';

    const paymentLabel =
      customerInfo.paymentMethod === 'cash'
        ? `💵 Efectivo${
            customerInfo.cashAmount
              ? ` (Paga con: $${customerInfo.cashAmount} · Cambio: $${changeAmount})`
              : ' (Pago exacto)'
          }`
        : `💳 Transferencia Bancoppel (Emma Aguilar - CLABE: ${bankInfo.clabe})`;

    const itemsText = cart
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.name}* (x${item.quantity}) - $${item.unitPrice * item.quantity}\n   _${item.detail}_`
      )
      .join('\n\n');

    const message = `🍕 *NUEVO PEDIDO - ${businessName.toUpperCase()}* 🍕
━━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${customerInfo.name}
📱 *WhatsApp:* ${customerInfo.phone}

📦 *Detalle del Pedido:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━
💰 *Total a Pagar:* $${cartTotal} MXN
🚚 *Entrega:* ${deliveryLabel}
💳 *Método de Pago:* ${paymentLabel}
${customerInfo.notes ? `📝 *Notas:* ${customerInfo.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━━
¡Listo para hornear con mucho queso! 🔥`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // 3. CRÍTICO: Delay de 500ms y usar window.location.href (NUNCA window.open)
    setTimeout(() => {
      window.location.href = waUrl;
      // 4. Limpieza del carrito para evitar duplicados
      setTimeout(() => {
        onClearCart();
        onClose();
      }, 800);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop con desenfoque */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#121110] border-l border-[#F59E0B]/20 text-white flex flex-col h-full shadow-2xl shadow-black z-10"
        >
          {/* Header del Carrito */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-b from-[#1C1A18] to-[#121110] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E11D48] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#E11D48]/30">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="font-black text-white text-base tracking-wide flex items-center gap-2">
                  <span>Tu Pedido</span>
                  {totalItems > 0 && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#E11D48] text-white">
                      {totalItems}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-[#F59E0B] font-semibold">
                  {step === 1 && 'Revisa tus pizzas y extras'}
                  {step === 2 && 'Datos de entrega y pago'}
                  {step === 3 && '¡Enviando pedido a cocina!'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Indicador de Pasos (1 y 2) */}
          {step < 3 && (
            <div className="px-5 py-2.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 font-bold transition-colors ${
                  step === 1 ? 'text-[#F59E0B]' : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 1 ? 'bg-[#F59E0B] text-black font-black' : 'bg-white/10 text-white'
                }`}>1</span>
                <span>Productos</span>
              </button>
              <div className="h-0.5 w-12 bg-white/10 mx-2" />
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 font-bold transition-colors disabled:opacity-30 ${
                  step === 2 ? 'text-[#F59E0B]' : 'text-white/40'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 2 ? 'bg-[#F59E0B] text-black font-black' : 'bg-white/10 text-white'
                }`}>2</span>
                <span>Entrega y Pago</span>
              </button>
            </div>
          )}

          {/* ══════════════════ CUERPO DEL DRAWER ══════════════════ */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* ── PASO 1: Lista de Productos ── */}
            {step === 1 && (
              <div>
                {cart.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-4">
                      <Pizza size={36} />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">Tu carrito está vacío</h4>
                    <p className="text-xs text-white/50 max-w-xs mb-6">
                      Explora nuestras especialidades caseras con mucho queso y añade tus favoritas.
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#E11D48]/20 hover:opacity-90 transition-opacity"
                    >
                      Ver Menú
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <motion.div
                        layout
                        key={item.lineId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2.5 relative group hover:border-[#F59E0B]/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                              {item.name}
                            </h4>
                            <p className="text-xs text-white/60 mt-0.5 leading-relaxed">
                              {item.detail}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemove(item.lineId)}
                            className="text-white/40 hover:text-red-400 p-1.5 transition-colors rounded-lg hover:bg-white/5"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.lineId, -1)}
                              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              aria-label="Disminuir"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.lineId, 1)}
                              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              aria-label="Aumentar"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm font-black text-[#F59E0B]">
                            ${item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── PASO 2: Datos de Entrega y Pago ── */}
            {step === 2 && (
              <div className="space-y-5 text-xs">
                {/* 1. Datos Personales */}
                <div className="space-y-3">
                  <h4 className="font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                    <Sparkles size={14} /> Tus Datos de Contacto
                  </h4>
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Juan Carlos Pérez"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, name: e.target.value })
                      }
                      style={{ fontSize: '16px' }}
                      className={`w-full px-3.5 py-2.5 bg-white/5 border rounded-2xl text-white placeholder-white/30 focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500' : 'border-white/15 focus:border-[#F59E0B]'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      WhatsApp para confirmar pedido *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 442 123 4567"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({ ...customerInfo, phone: e.target.value })
                      }
                      style={{ fontSize: '16px' }}
                      className={`w-full px-3.5 py-2.5 bg-white/5 border rounded-2xl text-white placeholder-white/30 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-white/15 focus:border-[#F59E0B]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* 2. Método de Entrega */}
                <div className="space-y-3">
                  <h4 className="font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                    <Bike size={14} /> Método de Entrega
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo({ ...customerInfo, deliveryMethod: 'delivery' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                        customerInfo.deliveryMethod === 'delivery'
                          ? 'bg-[#E11D48]/25 border-[#E11D48] text-white shadow-md shadow-[#E11D48]/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Bike size={18} className={customerInfo.deliveryMethod === 'delivery' ? 'text-[#E11D48]' : ''} />
                        {customerInfo.deliveryMethod === 'delivery' && (
                          <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                        )}
                      </div>
                      <span className="font-bold text-xs mt-1">Envío a Domicilio</span>
                      <span className="text-[10px] text-white/50">Llega calientita a tu puerta</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo({ ...customerInfo, deliveryMethod: 'pickup' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                        customerInfo.deliveryMethod === 'pickup'
                          ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-white shadow-md shadow-[#F59E0B]/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Store size={18} className={customerInfo.deliveryMethod === 'pickup' ? 'text-[#F59E0B]' : ''} />
                        {customerInfo.deliveryMethod === 'pickup' && (
                          <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                        )}
                      </div>
                      <span className="font-bold text-xs mt-1">Recoger en Sucursal</span>
                      <span className="text-[10px] text-white/50">Pickup sin costo</span>
                    </button>
                  </div>

                  {customerInfo.deliveryMethod === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="pt-1"
                    >
                      <label className="block text-white/70 font-semibold mb-1">
                        Dirección Completa con Referencias *
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Calle, número exterior/interior, colonia y referencias de tu casa..."
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, address: e.target.value })
                        }
                        style={{ fontSize: '16px' }}
                        className={`w-full px-3.5 py-2.5 bg-white/5 border rounded-2xl text-white placeholder-white/30 focus:outline-none transition-colors resize-none ${
                          errors.address ? 'border-red-500' : 'border-white/15 focus:border-[#F59E0B]'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-red-400 text-[11px] mt-1">{errors.address}</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* 3. Forma de Pago */}
                <div className="space-y-3">
                  <h4 className="font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                    <Banknote size={14} /> Forma de Pago
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo({ ...customerInfo, paymentMethod: 'cash' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                        customerInfo.paymentMethod === 'cash'
                          ? 'bg-[#10B981]/20 border-[#10B981] text-white shadow-md shadow-[#10B981]/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Banknote size={18} className={customerInfo.paymentMethod === 'cash' ? 'text-[#10B981]' : ''} />
                        {customerInfo.paymentMethod === 'cash' && (
                          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                        )}
                      </div>
                      <span className="font-bold text-xs mt-1">Efectivo</span>
                      <span className="text-[10px] text-white/50">Al recibir tu pedido</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo({ ...customerInfo, paymentMethod: 'transfer' })
                      }
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1 ${
                        customerInfo.paymentMethod === 'transfer'
                          ? 'bg-[#3B82F6]/25 border-[#3B82F6] text-white shadow-md shadow-[#3B82F6]/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Landmark size={18} className={customerInfo.paymentMethod === 'transfer' ? 'text-[#3B82F6]' : ''} />
                        {customerInfo.paymentMethod === 'transfer' && (
                          <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                        )}
                      </div>
                      <span className="font-bold text-xs mt-1">Transferencia</span>
                      <span className="text-[10px] text-white/50">Bancoppel / SPEI</span>
                    </button>
                  </div>

                  {/* Detalle si es Efectivo: cálculo de cambio */}
                  {customerInfo.paymentMethod === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2"
                    >
                      <label className="block text-white/80 font-semibold">
                        ¿Con cuánto vas a pagar? (Opcional para llevar cambio exacto)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
                        <input
                          type="number"
                          placeholder={`${cartTotal} o más`}
                          value={customerInfo.cashAmount}
                          onChange={(e) =>
                            setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })
                          }
                          style={{ fontSize: '16px' }}
                          className="w-full pl-8 pr-3.5 py-2 bg-black/40 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#10B981]"
                        />
                      </div>
                      {errors.cashAmount && (
                        <p className="text-red-400 text-[11px]">{errors.cashAmount}</p>
                      )}
                      {changeAmount !== null && changeAmount > 0 && (
                        <div className="p-2 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl text-[#34D399] font-bold flex items-center justify-between">
                          <span>Tu cambio a recibir:</span>
                          <span className="text-sm font-black">${changeAmount}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Detalle si es Transferencia: Datos bancarios reales con 1-tap copy */}
                  {customerInfo.paymentMethod === 'transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-gradient-to-br from-[#1E293B]/80 to-[#0F172A]/90 border border-blue-500/30 rounded-2xl space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <div className="flex items-center gap-2">
                          <Landmark size={16} className="text-blue-400" />
                          <span className="font-black text-white">{bankInfo.bankName}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-md font-bold">
                          SPEI
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] text-white/50 block">Titular de la cuenta:</span>
                          <span className="font-bold text-white text-xs">{bankInfo.accountHolder}</span>
                        </div>

                        {/* CLABE con 1-tap copy */}
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-white/50 block">CLABE Interbancaria:</span>
                            <span className="font-mono font-bold text-white text-xs tracking-wider">
                              {bankInfo.clabe}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankInfo.clabe, 'clabe')}
                            className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            {copied === 'clabe' ? (
                              <>
                                <Check size={12} /> ¡Copiado!
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copiar
                              </>
                            )}
                          </button>
                        </div>

                        {/* No. de Cuenta con 1-tap copy */}
                        <div className="bg-black/50 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-white/50 block">No. de Cuenta Bancoppel:</span>
                            <span className="font-mono font-bold text-white text-xs">
                              {bankInfo.accountNumber}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankInfo.accountNumber, 'cuenta')}
                            className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            {copied === 'cuenta' ? (
                              <>
                                <Check size={12} /> ¡Copiado!
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copiar
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-blue-200/70 italic leading-relaxed pt-1">
                        * Recuerda enviar la captura del comprobante al WhatsApp al terminar tu pedido.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* 4. Notas de Entrega */}
                <div>
                  <label className="block text-white/70 font-semibold mb-1">
                    Notas adicionales para entrega (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tocar timbre blanco, dejar con el vigilante..."
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, notes: e.target.value })
                    }
                    style={{ fontSize: '16px' }}
                    className="w-full px-3.5 py-2.5 bg-white/5 border border-white/15 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>
            )}

            {/* ── PASO 3: Pantalla de Éxito ── */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 px-2 text-center flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-[#10B981] flex items-center justify-center text-white mb-6 shadow-xl shadow-emerald-500/30 animate-pulse">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">¡Pedido Preparado!</h3>
                <p className="text-sm text-white/70 mb-4 max-w-xs">
                  Redirigiéndote a <strong className="text-emerald-400">WhatsApp</strong> para enviar los detalles a cocina...
                </p>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center gap-2 mb-6">
                  <ShieldCheck size={16} /> Tu pedido de ${cartTotal} MXN está listo.
                </div>
                <p className="text-[11px] text-white/40">
                  Si no abre automáticamente en unos segundos, pulsa el botón inferior.
                </p>
              </motion.div>
            )}
          </div>

          {/* ══════════════════ FOOTER DEL DRAWER ══════════════════ */}
          {cart.length > 0 && step < 3 && (
            <div className="p-4 border-t border-white/10 bg-[#161412] space-y-3">
              {/* Desglose de totales */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Total a pagar:</span>
                <span className="text-xl font-black text-[#F59E0B]">${cartTotal} MXN</span>
              </div>

              {/* Botones según el Paso */}
              {step === 1 && (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#E11D48]/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
                >
                  <span>Continuar con la Entrega</span>
                  <ArrowRight size={16} />
                </button>
              )}

              {step === 2 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="p-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl transition-colors shrink-0"
                    aria-label="Volver"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOrder}
                    className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0E7065] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#25D366]/30 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
                  >
                    <MessageCircle size={18} />
                    <span>Enviar Pedido a WhatsApp</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
