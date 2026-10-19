// ── CartDrawer: Carrito de 2 Pasos + Éxito y WhatsApp para Strong Gym Iron City ─
// Paso 1: Resumen de productos con desglose de opciones, presentación y extras
// Paso 2: Datos de entrega (Recepción en Gym / Pickup / Domicilio) + Pago (Efectivo con cambio / BBVA CLABE 1-tap / Tarjeta)
// Paso 3: Éxito y redirección segura tras 500ms vía window.location.href (NUNCA window.open)

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Check,
  Copy, Landmark, Banknote, Bike, Store, ArrowRight, ArrowLeft,
  Sparkles, AlertCircle, ShieldCheck, Dumbbell, CreditCard
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
    deliveryMethod: 'recepcion',
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
    if (!customerInfo.name.trim()) errs.name = 'Por favor escribe tu nombre completo';
    if (!customerInfo.phone.trim()) {
      errs.phone = 'Escribe tu número de WhatsApp';
    } else if (customerInfo.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Ingresa un WhatsApp válido (mín. 8-10 dígitos)';
    }

    if (customerInfo.deliveryMethod === 'delivery' && !customerInfo.address.trim()) {
      errs.address = 'Escribe calle, número exterior, colonia y referencias para el envío';
    }

    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) {
      const amt = Number(customerInfo.cashAmount);
      if (isNaN(amt) || amt < cartTotal) {
        errs.cashAmount = `El monto debe ser igual o mayor al total ($${cartTotal} MXN)`;
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

    const deliveryLabels: Record<string, string> = {
      recepcion: '🏋️‍♂️ Entrenando en Gym / Barra de Recepción',
      pickup: '🛍️ Apartado para Recoger en Mostrador',
      delivery: '🛵 Envío a Domicilio (Neza / CDMX)',
    };

    const paymentLabels: Record<string, string> = {
      cash: '💵 Efectivo al recibir',
      transfer: '🏦 Transferencia SPEI (BBVA)',
      terminal: '💳 Tarjeta de Débito/Crédito en Recepción',
    };

    let msg = `🏋️‍♂️ *NUEVO PEDIDO — ${businessName.toUpperCase()}*\n`;
    msg += `📍 *Strong Gym Iron City · Nezahualcóyotl*\n\n`;

    msg += `📋 *DETALLE DEL PEDIDO:*\n`;
    cart.forEach((item, index) => {
      msg += `\n*${index + 1}. ${item.name}* (x${item.quantity})\n`;
      msg += `   • Detalle: ${item.detail}\n`;
      msg += `   • Subtotal: $${item.unitPrice * item.quantity} MXN\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `💰 *TOTAL A PAGAR: $${cartTotal} MXN*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `👤 *DATOS DEL ATLETA / CLIENTE:*\n`;
    msg += `• *Nombre:* ${customerInfo.name.trim()}\n`;
    msg += `• *WhatsApp:* ${customerInfo.phone.trim()}\n`;
    msg += `• *Modalidad:* ${deliveryLabels[customerInfo.deliveryMethod]}\n`;

    if (customerInfo.address.trim()) {
      msg += `• *Ubicación / Área:* ${customerInfo.address.trim()}\n`;
    }

    msg += `• *Forma de Pago:* ${paymentLabels[customerInfo.paymentMethod]}\n`;

    if (customerInfo.paymentMethod === 'cash' && customerInfo.cashAmount) {
      msg += `• *Paga con:* $${customerInfo.cashAmount} MXN\n`;
      if (changeAmount !== null && changeAmount > 0) {
        msg += `• *Cambio requerido:* $${changeAmount} MXN\n`;
      }
    } else if (customerInfo.paymentMethod === 'transfer') {
      msg += `• *Nota:* En breve adjunto el comprobante de transferencia BBVA.\n`;
    }

    if (customerInfo.notes.trim()) {
      msg += `\n📝 *Instrucciones especiales:* ${customerInfo.notes.trim()}\n`;
    }

    msg += `\n⚡ _Pedido generado desde el Catálogo Digital Oficial de Strong Gym_`;

    const encoded = encodeURIComponent(msg);
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;

    // Redirección segura tras 500ms con window.location.href (NUNCA window.open)
    setTimeout(() => {
      window.location.href = whatsappUrl;
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Lateral */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#111111] border-l border-white/10 text-white h-full flex flex-col z-10 shadow-2xl overflow-hidden"
          >
            {/* Header del Carrito */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#181818] to-[#111111] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-white">
                    {step === 1 && `Tu Carrito (${totalItems})`}
                    {step === 2 && 'Datos de Entrega y Pago'}
                    {step === 3 && '¡Pedido Listo!'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {step === 1 && 'Revisa tus suplementos y membresías'}
                    {step === 2 && 'Paso 2 de 2 · Rápido y seguro'}
                    {step === 3 && 'Conectando con WhatsApp...'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── PASO 1: RESUMEN DE PRODUCTOS ── */}
            {step === 1 && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16 text-gray-400">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-500">
                        <Dumbbell size={32} />
                      </div>
                      <p className="text-base font-bold text-white">Tu carrito está vacío</p>
                      <p className="text-xs text-gray-400 max-w-xs mt-1 leading-relaxed">
                        Explora las proteínas, creatinas, shakes al momento y membresías en el catálogo.
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-6 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-950/40"
                      >
                        Ver Catálogo
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-xs text-gray-400 pb-1">
                        <span>Productos agregados</span>
                        <button
                          onClick={onClearCart}
                          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 size={12} /> Vaciar carrito
                        </button>
                      </div>

                      {cart.map((item) => (
                        <div
                          key={item.lineId}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col gap-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-white leading-snug truncate">
                                {item.name}
                              </h4>
                              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed line-clamp-2">
                                {item.detail}
                              </p>
                            </div>
                            <span className="text-sm font-black text-red-400 shrink-0">
                              ${item.unitPrice * item.quantity} MXN
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => onUpdateQty(item.lineId, -1)}
                                className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-xs font-black text-white w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(item.lineId, 1)}
                                className="w-7 h-7 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <button
                              onClick={() => onRemove(item.lineId)}
                              className="text-[11px] text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Quitar
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E0E] space-y-3">
                    <div className="space-y-1.5 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Subtotal ({totalItems} productos)</span>
                        <span className="font-bold text-white">${cartTotal} MXN</span>
                      </div>
                      <div className="flex justify-between text-emerald-400">
                        <span>Preparación & Apartado</span>
                        <span className="font-bold">GRATIS</span>
                      </div>
                      <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-white">
                        <span className="text-sm font-black uppercase">Total a Pagar</span>
                        <span className="text-xl font-black text-red-500">
                          ${cartTotal} <span className="text-xs font-bold">MXN</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Continuar a Entrega & Pago</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── PASO 2: DATOS DE ENTREGA Y PAGO ── */}
            {step === 2 && (
              <>
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Botón Volver */}
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={14} /> Volver a editar carrito
                  </button>

                  {/* Nombre */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-1.5">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carlos Mendoza"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-1.5">
                      Teléfono WhatsApp *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 55 1234 5678"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Modalidad de Entrega */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-2">
                      ¿Dónde te entregamos? *
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        {
                          id: 'recepcion',
                          icon: Dumbbell,
                          title: 'Entrenando en el Gym / Recepción',
                          desc: 'Te lo preparamos o entregamos en barra al terminar tu serie',
                        },
                        {
                          id: 'pickup',
                          icon: Store,
                          title: 'Apartar para Recoger en Mostrador',
                          desc: 'Pasa hoy a recoger tus suplementos o membresía',
                        },
                        {
                          id: 'delivery',
                          icon: Bike,
                          title: 'Envío a Domicilio (Neza / CDMX)',
                          desc: 'Entrega por mensajería en tu casa o trabajo',
                        },
                      ].map((m) => {
                        const isSelected = customerInfo.deliveryMethod === m.id;
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() =>
                              setCustomerInfo({
                                ...customerInfo,
                                deliveryMethod: m.id as any,
                              })
                            }
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                              isSelected
                                ? 'bg-red-600/15 border-red-500 text-white shadow-md shadow-red-950/20'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-300'
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400'
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-black tracking-wide">{m.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">{m.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dirección o Ubicación dentro del Gym */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-1.5">
                      {customerInfo.deliveryMethod === 'delivery'
                        ? 'Dirección Completa de Envío *'
                        : 'Área del Gym o Referencia (Opcional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        customerInfo.deliveryMethod === 'delivery'
                          ? 'Calle, número exterior, colonia y código postal'
                          : 'Ej. Piso 2 pesas libres, clase de spinning, o paso en 15 min'
                      }
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className={`w-full px-3.5 py-3 rounded-xl bg-white/[0.04] border text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                        errors.address ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Método de Pago */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-2">
                      Forma de Pago *
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'cash', icon: Banknote, label: 'Efectivo' },
                        { id: 'transfer', icon: Landmark, label: 'BBVA SPEI' },
                        { id: 'terminal', icon: CreditCard, label: 'Tarjeta' },
                      ].map((p) => {
                        const isSelected = customerInfo.paymentMethod === p.id;
                        const Icon = p.icon;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() =>
                              setCustomerInfo({
                                ...customerInfo,
                                paymentMethod: p.id as any,
                              })
                            }
                            className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                              isSelected
                                ? 'bg-red-600/15 border-red-500 text-white shadow-md shadow-red-950/20'
                                : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-400'
                            }`}
                          >
                            <Icon size={18} className={isSelected ? 'text-red-500' : 'text-gray-400'} />
                            <span className="text-[11px] font-black uppercase tracking-wider">
                              {p.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sub-formulario Efectivo: cambio */}
                  {customerInfo.paymentMethod === 'cash' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2"
                    >
                      <label className="text-xs font-bold text-gray-300 block">
                        ¿Con cuánto billete pagarás? (Opcional, para llevarte cambio)
                      </label>
                      <input
                        type="number"
                        placeholder={`Mínimo $${cartTotal} MXN`}
                        value={customerInfo.cashAmount}
                        onChange={(e) =>
                          setCustomerInfo({ ...customerInfo, cashAmount: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                      />
                      {changeAmount !== null && changeAmount > 0 && (
                        <p className="text-xs text-emerald-400 font-bold">
                          Tu cambio será: ${changeAmount} MXN
                        </p>
                      )}
                      {errors.cashAmount && (
                        <p className="text-[11px] text-red-400">{errors.cashAmount}</p>
                      )}
                    </motion.div>
                  )}

                  {/* Sub-formulario Transferencia BBVA */}
                  {customerInfo.paymentMethod === 'transfer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2.5 text-xs"
                    >
                      <div className="flex items-center gap-2 text-red-400 font-black uppercase tracking-wider">
                        <Landmark size={14} /> Datos para Transferir SPEI
                      </div>
                      <div className="space-y-1.5 text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Banco:</span>
                          <span className="font-bold text-white">{bankInfo.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beneficiario:</span>
                          <span className="font-bold text-white">{bankInfo.accountHolder}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/10">
                          <div>
                            <span className="text-[10px] text-gray-400 block">CLABE Interbancaria:</span>
                            <span className="font-mono font-black text-white text-xs">{bankInfo.clabe}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(bankInfo.clabe, 'clabe')}
                            className="px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white font-bold text-[10px] flex items-center gap-1 transition-colors"
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
                      <p className="text-[11px] text-gray-400 italic">
                        {bankInfo.instructions}
                      </p>
                    </motion.div>
                  )}

                  {/* Notas adicionales */}
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-300 tracking-wider block mb-1.5">
                      Notas o Instrucciones (Opcional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ej. 'Por favor el shake con poco hielo', 'Me urge para antes de las 4pm'..."
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Footer del Paso 2 */}
                <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E0E] space-y-2">
                  <button
                    onClick={handleSendToWhatsApp}
                    className="w-full py-4 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2.5 transition-all"
                  >
                    <MessageCircle size={18} />
                    <span>Enviar Pedido a WhatsApp</span>
                  </button>
                  <p className="text-[10px] text-center text-gray-500 flex items-center justify-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" /> Confirmación directa sin intermediarios
                  </p>
                </div>
              </>
            )}

            {/* ── PASO 3: ÉXITO Y REDIRECCIÓN A WHATSAPP ── */}
            {step === 3 && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-950/40"
                >
                  <Check size={40} strokeWidth={3} />
                </motion.div>

                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-wide">
                    ¡Pedido Generado con Éxito!
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 max-w-xs leading-relaxed">
                    Te estamos redirigiendo a la conversación de WhatsApp con recepción de Strong Gym para procesar tu orden.
                  </p>
                </div>

                <div className="w-full max-w-xs p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Atleta:</span>
                    <span className="font-bold text-white">{customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-black text-red-400">${cartTotal} MXN</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">WhatsApp Gym:</span>
                    <span className="font-mono text-emerald-400">{clientConfig.phoneNumberFormatted}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />

                <button
                  onClick={() => {
                    handleSendToWhatsApp();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-bold"
                >
                  ¿No abrió automáticamente? Da clic aquí para abrir WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
