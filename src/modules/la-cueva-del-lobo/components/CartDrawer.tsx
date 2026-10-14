// ── CartDrawer — Carrito de 2 Pasos + Éxito y WhatsApp para La Cueva del Lobo ────
// Paso 1: Resumen de productos con desglose de opciones, salsas y escarchados.
// Paso 2: Datos de entrega (Trajinera / Embarcadero / Domicilio) + Pago (Efectivo con cambio / BBVA con 1-tap copy).
// Paso 3: Éxito animado y redirección segura tras 500ms vía window.location.href (NUNCA window.open).

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Check,
  Copy, Landmark, Banknote, Bike, Store, ArrowRight, ArrowLeft,
  Sparkles, AlertCircle, ShieldCheck, Ship, Flame
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
    deliveryMethod: 'mesa-trajinera',
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

    if (customerInfo.deliveryMethod === 'mesa-trajinera' && !customerInfo.address.trim()) {
      errs.address = 'Escribe número de mesa, nombre de trajinera o embarcadero';
    } else if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
      errs.address = 'Escribe calle, número exterior, colonia y referencias';
    }

    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) {
      const amt = Number(customerInfo.cashAmount);
      if (isNaN(amt) || amt < cartTotal) {
        errs.cashAmount = `El monto debe ser igual o mayor a $${cartTotal} MXN`;
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

  const handleSendToWhatsApp = () => {
    if (!validate()) return;
    setStep(3);

    // Formatear mensaje para WhatsApp
    const deliveryMethodLabels: Record<string, string> = {
      'mesa-trajinera': '🛶 En Mesa / Trajinera / Embarcadero',
      pickup: '🛍️ Para Recoger (Pickup)',
      delivery: '🛵 Servicio a Domicilio',
    };

    let msg = `🐺 *NUEVO PEDIDO — ${businessName.toUpperCase()}*\n`;
    msg += `📍 *Xochimilco Alimentos, Cerveza & Aventura*\n\n`;

    msg += `📋 *DETALLE DEL CONSUMO:*\n`;
    cart.forEach((item) => {
      msg += `• *${item.quantity}x ${item.name}* — $${item.unitPrice * item.quantity}\n`;
      if (item.detail) {
        msg += `   ↳ _${item.detail}_\n`;
      }
    });

    msg += `\n💰 *TOTAL A PAGAR:* $${cartTotal} MXN\n\n`;

    msg += `👤 *DATOS DEL CLIENTE:*\n`;
    msg += `• *Nombre:* ${customerInfo.name.trim()}\n`;
    msg += `• *WhatsApp:* ${customerInfo.phone.trim()}\n`;
    msg += `• *Modalidad:* ${deliveryMethodLabels[customerInfo.deliveryMethod]}\n`;

    if (customerInfo.deliveryMethod !== 'pickup') {
      msg += `• *Ubicación / Punto:* ${customerInfo.address.trim()}\n`;
    }

    msg += `• *Método de Pago:* ${
      customerInfo.paymentMethod === 'cash'
        ? customerInfo.cashAmount
          ? `Efectivo (Paga con: $${customerInfo.cashAmount} | Cambio: $${changeAmount})`
          : 'Efectivo al recibir'
        : `Transferencia Bancaria (${bankInfo.bankName})`
    }\n`;

    if (customerInfo.notes.trim()) {
      msg += `• *Notas:* ${customerInfo.notes.trim()}\n`;
    }

    msg += `\n✨ _Pedido generado desde el Menú Digital Oficial_`;

    const encoded = encodeURIComponent(msg);
    const targetUrl = `https://wa.me/${whatsappNumber}?text=${encoded}`;

    // NUNCA window.open (los in-app browsers lo bloquean). Usar window.location.href tras 600ms
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-screen max-w-md bg-[#12110F] border-l border-[#E08722]/30 flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-b from-[#1C1815] to-[#12110F] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E08722] to-[#C2410C] flex items-center justify-center text-black font-black shadow-lg">
                <ShoppingBag className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                  <span>Tu Orden</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#E08722]/20 text-[#E08722] font-bold border border-[#E08722]/40">
                    Paso {step} de 2
                  </span>
                </h2>
                <p className="text-xs text-gray-400">
                  {step === 1 ? `${totalItems} producto(s) en tu cuenta` : 'Datos para entrega y cocina'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          {cart.length > 0 && step !== 3 && (
            <div className="px-5 py-2.5 bg-black/40 border-b border-white/5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  step === 1
                    ? 'bg-[#E08722] text-black shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                1. Productos
              </button>
              <button
                type="button"
                onClick={() => {
                  if (cart.length > 0) setStep(2);
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all text-center ${
                  step === 2
                    ? 'bg-[#E08722] text-black shadow-md'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                2. Entrega & Pago
              </button>
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {/* Si carrito está vacío */}
            {cart.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Tu orden está vacía</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    Explora nuestros antojitos al comal, micheladas de sabores y pulques curados para comenzar tu pedido.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#E08722] text-black hover:brightness-110 active:scale-95 transition-all"
                >
                  Ver la Carta
                </button>
              </div>
            )}

            {/* PASO 1: LISTADO DE PRODUCTOS */}
            {cart.length > 0 && step === 1 && (
              <div className="space-y-3">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.lineId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#E08722]/30 transition-all flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-white leading-tight">
                            {item.name}
                          </h4>
                          {item.detail && (
                            <p className="text-xs text-[#E08722] font-medium mt-1 leading-snug">
                              {item.detail}
                            </p>
                          )}
                          <div className="text-xs text-gray-400 font-semibold mt-1">
                            ${item.unitPrice} MXN c/u
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-white text-base">
                            ${item.unitPrice * item.quantity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => onRemove(item.lineId)}
                          className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>

                        <div className="flex items-center rounded-lg bg-black/40 border border-white/10 p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.lineId, -1)}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.lineId, 1)}
                            className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="w-full text-center text-xs text-gray-500 hover:text-gray-400 transition-colors py-1"
                  >
                    Vaciar todo el pedido
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: DATOS DE ENTREGA Y PAGO */}
            {cart.length > 0 && step === 2 && (
              <div className="space-y-5">
                {/* Modalidad de Entrega */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                    ¿Dónde disfrutas tu pedido?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({ ...prev, deliveryMethod: 'mesa-trajinera' }))
                      }
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                        customerInfo.deliveryMethod === 'mesa-trajinera'
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Ship className="w-5 h-5 text-[#E08722]" />
                      <span className="text-[11px] font-bold leading-tight">Trajinera / Mesa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({ ...prev, deliveryMethod: 'pickup' }))
                      }
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                        customerInfo.deliveryMethod === 'pickup'
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Store className="w-5 h-5 text-[#E08722]" />
                      <span className="text-[11px] font-bold leading-tight">Para Recoger</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({ ...prev, deliveryMethod: 'delivery' }))
                      }
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center gap-1 transition-all ${
                        customerInfo.deliveryMethod === 'delivery'
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Bike className="w-5 h-5 text-[#E08722]" />
                      <span className="text-[11px] font-bold leading-tight">A Domicilio</span>
                    </button>
                  </div>
                </div>

                {/* Nombre y WhatsApp */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      Tu Nombre *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Ej. René González"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-sm"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                      WhatsApp de Contacto *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="Ej. 55 1234 5678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-sm"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Ubicación / Trajinera / Dirección */}
                  {customerInfo.deliveryMethod !== 'pickup' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1">
                        {customerInfo.deliveryMethod === 'mesa-trajinera'
                          ? 'Nombre de la Trajinera, Embarcadero o Número de Mesa *'
                          : 'Dirección de Entrega con Referencias *'}
                      </label>
                      <textarea
                        rows={2}
                        value={customerInfo.address}
                        onChange={(e) =>
                          setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))
                        }
                        placeholder={
                          customerInfo.deliveryMethod === 'mesa-trajinera'
                            ? 'Ej: Trajinera "Xochiquetzal" cerca del arco de Cuemanco o Mesa #4'
                            : 'Calle, número exterior, colonia y referencias de fachada'
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-sm resize-none"
                      />
                      {errors.address && (
                        <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.address}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Forma de Pago */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Forma de Pago
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({ ...prev, paymentMethod: 'cash' }))
                      }
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        customerInfo.paymentMethod === 'cash'
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-[#E08722]" />
                      <span>Efectivo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setCustomerInfo((prev) => ({ ...prev, paymentMethod: 'transfer' }))
                      }
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                        customerInfo.paymentMethod === 'transfer'
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <Landmark className="w-4 h-4 text-[#E08722]" />
                      <span>Transferencia</span>
                    </button>
                  </div>

                  {/* Si es efectivo: selector de cambio */}
                  {customerInfo.paymentMethod === 'cash' && (
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 mt-2">
                      <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">
                        ¿Con cuánto vas a pagar? (Para llevarte tu cambio exacto)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          value={customerInfo.cashAmount}
                          onChange={(e) =>
                            setCustomerInfo((prev) => ({ ...prev, cashAmount: e.target.value }))
                          }
                          placeholder={String(cartTotal)}
                          className="w-full pl-7 pr-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-sm"
                        />
                      </div>
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs text-emerald-400 font-bold">
                          Tu cambio será: ${changeAmount} MXN
                        </p>
                      )}
                      {errors.cashAmount && (
                        <p className="text-[11px] text-red-400">{errors.cashAmount}</p>
                      )}
                    </div>
                  )}

                  {/* Si es transferencia: datos bancarios con 1-tap copy */}
                  {customerInfo.paymentMethod === 'transfer' && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-b from-[#1C1815] to-[#12110F] border border-[#E08722]/30 space-y-2.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-300">
                          Datos Bancarios ({bankInfo.bankName})
                        </span>
                        <ShieldCheck className="w-4 h-4 text-[#E08722]" />
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Titular:</span>
                          <span className="font-semibold text-white">{bankInfo.accountHolder}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">CLABE:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-amber-400 font-bold">
                              {bankInfo.clabe}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(bankInfo.clabe, 'clabe')}
                              className="p-1 rounded bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
                              title="Copiar CLABE"
                            >
                              {copied === 'clabe' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-tight">
                        {bankInfo.instructions}
                      </p>
                    </div>
                  )}
                </div>

                {/* Notas generales */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Notas adicionales para el pedido
                  </label>
                  <input
                    type="text"
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Ej. Servir bebidas primero, salsas bien picosas..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-xs"
                  />
                </div>
              </div>
            )}

            {/* PASO 3: ÉXITO Y REDIRECCIÓN */}
            {step === 3 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E08722] to-[#10B981] flex items-center justify-center text-black shadow-[0_0_30px_rgba(224,135,34,0.4)]"
                >
                  <MessageCircle className="w-10 h-10 stroke-[2.5]" />
                </motion.div>

                <div>
                  <h3 className="text-xl font-black text-white">¡Generando Pedido!</h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-xs leading-relaxed">
                    Estamos abriendo WhatsApp para enviar los detalles de tu orden a cocina y barra.
                  </p>
                </div>

                <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Total a confirmar:</span>
                    <span className="font-bold text-white text-sm">${cartTotal} MXN</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Atención:</span>
                    <span className="text-[#E08722] font-semibold">{clientConfig.phoneNumberFormatted}</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500">
                  Si no abre automáticamente en unos segundos, haz clic en el botón inferior.
                </p>

                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Abrir WhatsApp Directo
                </button>
              </div>
            )}
          </div>

          {/* Footer Fijo con Totales y Botón de Acción */}
          {cart.length > 0 && step !== 3 && (
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161311] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                    Total de la Orden
                  </span>
                  <span className="text-2xl font-black text-white tracking-tight">
                    ${cartTotal} <span className="text-xs text-amber-400 font-bold">MXN</span>
                  </span>
                </div>

                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Volver a productos
                  </button>
                )}
              </div>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-[#E08722] via-[#F59E0B] to-[#E08722] hover:brightness-110 active:scale-[0.98] text-black shadow-[0_0_20px_rgba(224,135,34,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  <span>Continuar a Entrega & Pago</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl font-black text-sm uppercase tracking-wider bg-gradient-to-r from-emerald-500 via-[#10B981] to-emerald-500 hover:brightness-110 active:scale-[0.98] text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                  <span>Enviar Pedido a WhatsApp</span>
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
