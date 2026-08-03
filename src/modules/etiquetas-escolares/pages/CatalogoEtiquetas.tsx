import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Search, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BackgroundDecorations from '../components/BackgroundDecorations';
import { mockData, BASE_URL } from '../data/designs';
import type { LabelDesign } from '../data/designs';
import imgDtfUv from '../assets/paquetes/dtf-uv.png';
import imgTextiles from '../assets/paquetes/textiles.png';
import imgEsencial from '../assets/paquetes/esencial.png';
import imgClasico from '../assets/paquetes/clasico.png';
import imgPremium from '../assets/paquetes/premium.png';
import imgContorno from '../assets/paquetes/contorno.png';

const WHATSAPP_NUMBER = '525650469993';

interface PackageOption {
  id: string;
  material: 'DTF UV' | 'Textiles' | 'Etiquetas Adhesivas';
  tier?: string;
  label: string;
  price: number;
  includes: string[];
  laminadoPrice?: number;
  previewImage: string;
  popular?: boolean;
  popularLabel?: string;
}

const PACKAGES: PackageOption[] = [
  { id: 'dtf-uv', material: 'DTF UV', label: 'DTF UV', price: 150, includes: ['Etiquetas 100% lavables', 'Organiza tu plantilla a tu gusto', 'Tamaño carta', 'Un nombre y diseño por hoja', 'Con o sin fondo blanco'], previewImage: imgDtfUv },
  { id: 'textiles', material: 'Textiles', label: 'Textiles', price: 100, includes: ['Etiquetas 100% lavables', 'Organiza tu plantilla a tu gusto', 'Tamaño carta', 'Un nombre y diseño por hoja'], previewImage: imgTextiles },
  { id: 'adhesivas-esencial', material: 'Etiquetas Adhesivas', tier: 'Esencial', label: 'Esencial', price: 150, includes: ['20 pz libretas 9x5 cm', '30 pz lápices 6x2.5 cm'], laminadoPrice: 30, previewImage: imgEsencial },
  { id: 'adhesivas-clasico', material: 'Etiquetas Adhesivas', tier: 'Clásico', label: 'Clásico', price: 250, includes: ['20 pz libretas 9x5 cm', '30 pz lápices 6x2.5 cm', '14 circulares 5 cm (vinil)', '1 tag grande'], laminadoPrice: 40, previewImage: imgClasico, popular: true, popularLabel: 'Más vendido' },
  { id: 'adhesivas-premium', material: 'Etiquetas Adhesivas', tier: 'Premium', label: 'Premium', price: 360, includes: ['24 pz libretas 9x5 cm', '48 pz lápices 6x2.5 cm', '9 circulares 5 cm (vinil)', '8 circulares 4 cm (vinil)', '1 tag grande con llavero', '1 tag chico'], laminadoPrice: 50, previewImage: imgPremium, popular: true, popularLabel: 'Más completo' },
  { id: 'adhesivas-contorno', material: 'Etiquetas Adhesivas', tier: 'Contorno', label: 'Contorno', price: 180, includes: ['24 pz, largo 8 cm', '25 pz, largo 5 cm', '1 tag grande'], laminadoPrice: 30, previewImage: imgContorno, popular: true, popularLabel: 'Económico' },
];

interface ExtraOption {
  id: string;
  label: string;
  unitPrice: number;
  fixedPrice?: boolean;
  suffix?: string;
}

const EXTRAS: ExtraOption[] = [
  { id: 'extra-libretas', label: 'Etiquetas Libretas 9x5cm', unitPrice: 6, suffix: 'pz' },
  { id: 'extra-lapices', label: 'Etiquetas Lápices 6x2.5cm', unitPrice: 2, suffix: 'pz' },
  { id: 'extra-contorno', label: 'Etiquetas Contorno, largo 8cm', unitPrice: 5, suffix: 'pz' },
  { id: 'extra-circ-5', label: 'Etiqueta Circular 5cm', unitPrice: 0.53, suffix: 'pz' },
  { id: 'extra-circ-4', label: 'Etiqueta Circular 4cm', unitPrice: 0.30, suffix: 'pz' },
  { id: 'extra-tag-grande', label: 'Tag Grande', unitPrice: 50, suffix: 'pz' },
  { id: 'extra-tag-chico', label: 'Tag Chico', unitPrice: 35, suffix: 'pz' },
  { id: 'extra-materias', label: 'Materias en etiqueta libreta', unitPrice: 30, fixedPrice: true },
];

// ID especial: pedido de piezas sueltas SIN paquete (el cliente arma su propio pedido)
const CUSTOM_ORDER_ID = 'piezas-sueltas';

const TAB_STYLE = {
  personajes: {
    imageBg: 'bg-purple-50',
    topBar: 'bg-gradient-to-r from-purple-400 to-pink-400',
    hoverBorder: 'hover:border-purple-200',
    hoverShadow: 'hover:shadow-purple-100',
  },
  siluetas_nina: {
    imageBg: 'bg-pink-50',
    topBar: 'bg-gradient-to-r from-pink-400 to-rose-400',
    hoverBorder: 'hover:border-pink-200',
    hoverShadow: 'hover:shadow-pink-100',
  },
  siluetas_nino: {
    imageBg: 'bg-sky-50',
    topBar: 'bg-gradient-to-r from-sky-400 to-blue-400',
    hoverBorder: 'hover:border-sky-200',
    hoverShadow: 'hover:shadow-sky-100',
  },
} as const;

// ═══════════════════ ORDER MODAL — 3 PASOS ═══════════════════
interface OrderModalProps {
  design: string;
  preSelectedPackageId?: string | null;
  onClose: () => void;
  onComplete: () => void;
}

function OrderModal({ design, preSelectedPackageId, onClose, onComplete }: OrderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(preSelectedPackageId ? 2 : 1);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(preSelectedPackageId || null);
  const [wantsLaminado, setWantsLaminado] = useState(false);
  const [extrasQuantities, setExtrasQuantities] = useState<Record<string, number>>({});
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [group, setGroup] = useState('');
  const [notes, setNotes] = useState('');

  const selectedPackage = useMemo(() => PACKAGES.find(p => p.id === selectedPackageId) || null, [selectedPackageId]);
  const isCustomOrder = selectedPackageId === CUSTOM_ORDER_ID;
  const laminadoCost = wantsLaminado && selectedPackage?.laminadoPrice ? selectedPackage.laminadoPrice : 0;

  const extrasCost = useMemo(() => Object.entries(extrasQuantities).reduce((sum, [id, qty]) => {
    const extra = EXTRAS.find(e => e.id === id);
    return sum + (extra ? extra.unitPrice * qty : 0);
  }, 0), [extrasQuantities]);

  const basePrice = selectedPackage?.price || 0;
  const orderTotal = basePrice + laminadoCost + extrasCost;

  const handleQuantityChange = (id: string, qty: number) => {
    setExtrasQuantities(prev => {
      const next = { ...prev };
      if (qty <= 0) { delete next[id]; } else { next[id] = qty; }
      return next;
    });
  };

  const handleSelectPackage = (id: string) => {
    setSelectedPackageId(id);
    setWantsLaminado(false);
    setExtrasQuantities({});
  };

  const handleSendWhatsApp = () => {
    let text = `¡Hola Imagine & Stamp! Quiero hacer mi pedido de etiquetas escolares con el diseño de ${design}.\n\n`;
    if (isCustomOrder) {
      text += `*Modalidad:* Piezas sueltas (sin paquete)\n`;
    } else {
      text += `*Paquete:* ${selectedPackage?.label} - $${basePrice}\n`;
    }
    if (laminadoCost > 0) text += `*Laminado:* +$${laminadoCost}\n`;

    const extraEntries = Object.entries(extrasQuantities);
    if (extraEntries.length > 0) {
      text += isCustomOrder ? `*Piezas:*\n` : `*Extras:*\n`;
      extraEntries.forEach(([id, qty]) => {
        const extra = EXTRAS.find(e => e.id === id);
        if (extra) text += `- ${extra.label} (${qty} ${extra.suffix || ''}) (+$${(extra.unitPrice * qty).toFixed(2)})\n`;
      });
    }
    text += `\n💰 *Total:* $${orderTotal.toFixed(2)} MXN\n`;
    text += `\n*Datos del niño(a)*\n`;
    text += `Nombre: ${childName}\n`;
    text += `Grado: ${grade} · Grupo: ${group}\n`;
    if (notes) text += `Notas: ${notes}\n`;
    text += `\n📦 Aparto con el 50% y pago el resto al recibir.`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    onComplete();
  };

  const canContinueStep1 = !!selectedPackageId;
  const canSend = !!childName.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto flex flex-col"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 px-6 pt-6 pb-2">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step === s ? 'bg-purple-500 text-white shadow-md scale-110' :
                step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <Check size={16} /> : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 rounded ${step > s ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-6">
          {step === 1 ? 'Elige tu paquete' : step === 2 ? (isCustomOrder ? 'Elige tus piezas' : 'Agrega extras') : 'Tus datos'}
        </p>

        <div className="px-6 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-sm text-gray-500 mb-4 text-center">Selecciona el tipo de etiqueta ideal para {design}</p>

                <div className="mb-5">
                  <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-3">Etiquetas Adhesivas</p>
                  <div className="grid grid-cols-4 gap-2">
                    {PACKAGES.filter(p => p.material === 'Etiquetas Adhesivas').map(pkg => (
                      <button
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`relative flex flex-col items-center rounded-xl p-2 border-2 transition-all ${
                          selectedPackageId === pkg.id
                            ? 'border-pink-500 bg-pink-50 shadow-md scale-105'
                            : 'border-gray-200 hover:border-pink-300 bg-white'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                            {pkg.popularLabel}
                          </span>
                        )}
                        <img src={pkg.previewImage} alt={pkg.label} className="w-16 h-20 object-contain mb-1" />
                        <span className="text-xs font-bold text-gray-800">{pkg.label}</span>
                        <span className="text-xs font-extrabold text-pink-500">${pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-3">Especiales</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PACKAGES.filter(p => p.material === 'DTF UV' || p.material === 'Textiles').map(pkg => (
                      <button
                        key={pkg.id}
                        onClick={() => handleSelectPackage(pkg.id)}
                        className={`relative flex flex-col items-center rounded-xl p-2 border-2 transition-all ${
                          selectedPackageId === pkg.id
                            ? 'border-cyan-500 bg-cyan-50 shadow-md scale-105'
                            : 'border-gray-200 hover:border-cyan-300 bg-white'
                        }`}
                      >
                        <img src={pkg.previewImage} alt={pkg.label} className="w-16 h-20 object-contain mb-1" />
                        <span className="text-xs font-bold text-gray-800">{pkg.label}</span>
                        <span className="text-xs font-extrabold text-pink-500">${pkg.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative flex items-center my-5">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-3 text-xs text-gray-400 font-bold">¿No quieres paquete?</span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
                <button
                  onClick={() => { handleSelectPackage(CUSTOM_ORDER_ID); setStep(2); }}
                  className={`w-full rounded-xl p-3 border-2 border-dashed transition-all flex items-center gap-2 ${
                    isCustomOrder ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                  }`}
                >
                  <span className="text-xl">🧩</span>
                  <div className="text-left flex-1">
                    <p className="text-sm font-bold text-gray-800">Armar mi pedido pieza por pieza</p>
                    <p className="text-xs text-gray-400">Sin paquete — elige solo las etiquetas que necesitas</p>
                  </div>
                </button>

                {selectedPackage && (
                  <div className="bg-purple-50 rounded-xl p-3 text-xs text-purple-800 mb-4">
                    <p className="font-bold mb-1">Incluye:</p>
                    <ul className="list-disc list-inside space-y-0.5">{selectedPackage.includes.map(item => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
              </motion.div>
            )}

            {step === 2 && (selectedPackage || isCustomOrder) && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                {isCustomOrder ? (
                  <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3 mb-5">
                    <div className="w-14 h-14 flex items-center justify-center text-3xl">🧩</div>
                    <div>
                      <p className="font-bold text-sm text-purple-700">Piezas sueltas (sin paquete)</p>
                      <p className="text-xs text-gray-500">{design}</p>
                      <p className="text-xs font-bold text-purple-400">Arma tu pedido como quieras</p>
                    </div>
                    <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-purple-400 hover:text-purple-600">Cambiar</button>
                  </div>
                ) : selectedPackage && (
                <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3 mb-5">
                  <img src={selectedPackage.previewImage} alt={selectedPackage.label} className="w-14 h-18 object-contain rounded-lg" />
                  <div>
                    <p className="font-bold text-sm text-purple-700">{selectedPackage.tier ? `Etiquetas Adhesivas · ${selectedPackage.tier}` : selectedPackage.label}</p>
                    <p className="text-xs text-gray-500">{design}</p>
                    <p className="font-extrabold text-pink-500 text-lg">${basePrice}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-xs font-bold text-purple-400 hover:text-purple-600">Cambiar</button>
                </div>
                )}

                {selectedPackage?.laminadoPrice && (
                  <label className="flex items-center justify-between p-3 bg-pink-50 border border-pink-200 rounded-xl cursor-pointer mb-4 hover:bg-pink-100 transition-colors">
                    <div>
                      <span className="font-bold text-sm text-gray-800">Agregar laminado</span>
                      <p className="text-xs text-gray-500">Mayor durabilidad, resistente al agua</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-pink-500">+${selectedPackage.laminadoPrice}</span>
                      <input
                        type="checkbox"
                        checked={wantsLaminado}
                        onChange={(e) => setWantsLaminado(e.target.checked)}
                        className="w-5 h-5 rounded text-pink-500 focus:ring-pink-400"
                      />
                    </div>
                  </label>
                )}

                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{isCustomOrder ? 'Elige las piezas que necesitas' : 'Extras adicionales'}</p>
                <div className="space-y-2 mb-2">
                  {EXTRAS.map(extra => {
                    const qty = extrasQuantities[extra.id] || 0;
                    return (
                      <div key={extra.id} className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-700 text-xs">{extra.label}</span>
                          <span className="text-[10px] text-gray-400 ml-1">${extra.unitPrice.toFixed(2)} c/u</span>
                        </div>
                        {extra.fixedPrice ? (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={qty > 0}
                              onChange={(e) => handleQuantityChange(extra.id, e.target.checked ? 1 : 0)}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-bold text-gray-800 w-14 text-right text-xs">+${(extra.unitPrice * qty).toFixed(2)}</span>
                          </label>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden h-8">
                              <button onClick={() => handleQuantityChange(extra.id, Math.max(0, qty - 1))} className="px-2 hover:bg-gray-100 text-gray-500 font-bold text-xs">-</button>
                              <input
                                type="number"
                                min="0"
                                value={qty === 0 ? '' : qty}
                                onChange={(e) => { const val = parseInt(e.target.value); handleQuantityChange(extra.id, isNaN(val) ? 0 : val); }}
                                placeholder="0"
                                className="w-10 text-center bg-transparent border-x border-gray-300 outline-none text-gray-800 font-medium text-xs no-spinners"
                              />
                              <button onClick={() => handleQuantityChange(extra.id, qty + 1)} className="px-2 hover:bg-gray-100 text-gray-500 font-bold text-xs">+</button>
                            </div>
                            <span className="font-bold text-gray-800 w-14 text-right text-xs">+${(extra.unitPrice * qty).toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mt-4">
                  <span className="text-sm font-bold text-blue-900">Total hasta ahora</span>
                  <span className="text-xl font-black text-blue-700">${orderTotal.toFixed(2)}</span>
                </div>
                {isCustomOrder && extrasCost <= 0 && (
                  <p className="text-center text-xs text-amber-600 font-bold mt-3">Agrega al menos una pieza para continuar</p>
                )}
              </motion.div>
            )}

            {step === 3 && (selectedPackage || isCustomOrder) && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del niño(a) *</label>
                    <input
                      type="text"
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-shadow font-medium"
                      placeholder="Ej. Sofía García"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Grado</label>
                      <input
                        type="text"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-shadow"
                        placeholder="Ej. 2do Primaria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Grupo</label>
                      <input
                        type="text"
                        value={group}
                        onChange={(e) => setGroup(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-shadow"
                        placeholder="Ej. A"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Notas adicionales</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none transition-shadow resize-none"
                      rows={2}
                      placeholder="Materias, escuela, observaciones..."
                    />
                  </div>

                  {/* Resumen del pedido */}
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h3 className="font-extrabold text-sm text-purple-700 mb-3">📋 Resumen de tu pedido</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between"><span className="text-gray-500">Diseño</span><span className="font-bold text-gray-800">{design}</span></div>
                      {isCustomOrder ? (
                        <div className="flex justify-between"><span className="text-gray-500">Modalidad</span><span className="font-bold text-gray-800">Piezas sueltas (sin paquete)</span></div>
                      ) : selectedPackage && (
                        <div className="flex justify-between"><span className="text-gray-500">Paquete</span><span className="font-bold text-gray-800">{selectedPackage.tier ? `Etiquetas · ${selectedPackage.tier}` : selectedPackage.label} · ${basePrice}</span></div>
                      )}
                      {laminadoCost > 0 && <div className="flex justify-between"><span className="text-gray-500">Laminado</span><span className="font-bold text-gray-800">+${laminadoCost}</span></div>}
                      {Object.entries(extrasQuantities).map(([id, qty]) => {
                        const extra = EXTRAS.find(e => e.id === id);
                        if (!extra) return null;
                        return <div key={id} className="flex justify-between"><span className="text-gray-500">{qty}x {extra.label}</span><span className="font-bold text-gray-800">+${(extra.unitPrice * qty).toFixed(2)}</span></div>;
                      })}
                      <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between">
                        <span className="font-bold text-purple-700">Total</span>
                        <span className="font-extrabold text-lg text-pink-600">${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-purple-500 mt-3 border-t border-purple-100 pt-2">
                      📦 Apartas con el 50% (${(orderTotal / 2).toFixed(0)} aprox.) y pagas el resto al recibir.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white rounded-b-2xl flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep((step - 1) as 1 | 2 | 3)} className="px-4 py-3 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1">
              <ChevronLeft size={16} /> Atrás
            </button>
          )}
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              disabled={!canContinueStep1}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-1"
            >
              Continuar <ChevronRight size={16} />
            </button>
          )}
          {step === 2 && (
            <button onClick={() => setStep(3)} disabled={isCustomOrder && extrasCost <= 0} className="flex-1 py-3 rounded-xl font-bold text-sm bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-1">
              Continuar <ChevronRight size={16} />
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSendWhatsApp}
              disabled={!canSend}
              className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#128C7E] disabled:bg-gray-300 disabled:cursor-not-allowed text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Enviar por WhatsApp
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ═══════════════════ DESIGN GRID ═══════════════════
interface DesignGridProps {
  designs: LabelDesign[];
  activeTab: 'personajes' | 'siluetas_nina' | 'siluetas_nino';
  onSelectDesign: (name: string) => void;
  whatsappNumber: string;
}

const DesignGrid = React.memo(function DesignGrid({ designs, activeTab, onSelectDesign, whatsappNumber }: DesignGridProps) {
  const tabStyle = TAB_STYLE[activeTab];
  const noResultsMsg = encodeURIComponent('¡Hola! Busco un personaje que no vi en el catálogo, ¿me lo pueden diseñar?');

  return (
    <AnimatePresence mode="wait">
      {designs.length === 0 ? (
        <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-20">
          <div className="max-w-md mx-auto">
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-gray-700 font-bold text-lg mb-2">No encontramos ese diseño</p>
            <p className="text-gray-500 text-base mb-6">¡Pero podemos crearlo para ti sin costo extra! Dinos qué personaje buscas y lo diseñamos especialmente.</p>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${noResultsMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >💬 Pedirlo por WhatsApp</a>
          </div>
        </motion.div>
      ) : (
        <motion.div key="grid" layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          <AnimatePresence>
            {designs.map((design) => {
              const imageUrl = encodeURI(`${BASE_URL}${design.folder}/${design.imageFile}`);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  key={design.id}
                  className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 ${tabStyle.hoverBorder} ${tabStyle.hoverShadow} flex flex-col`}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 320px' }}
                >
                  <div className={`h-1.5 ${tabStyle.topBar}`} />
                  <div className={`aspect-square ${tabStyle.imageBg} relative overflow-hidden`}>
                    <img
                      src={imageUrl}
                      alt={`Diseño ${design.name}`}
                      className="w-full h-full object-contain p-1 sm:p-2"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 text-center mb-2 sm:mb-4 flex-1">{design.name}</h3>
                    <button
                      onClick={() => onSelectDesign(design.name)}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-2 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-1 sm:gap-2 transition-colors shadow-sm text-xs sm:text-base"
                    >
                      Elegir este diseño
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

// ═══════════════════ MAIN COMPONENT ═══════════════════
export default function CatalogoEtiquetas() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'personajes' | 'siluetas_nina' | 'siluetas_nino'>('personajes');
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [preSelectedPackageId, setPreSelectedPackageId] = useState<string | null>(null);

  const catalogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 200);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const filteredDesigns = useMemo(() => {
    return mockData.filter(design => {
      const designCategory = design.category || 'personajes';
      const matchesCategory = designCategory === activeTab;
      const matchesSearch = design.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [debouncedQuery, activeTab]);

  const handleOpenModal = useCallback((designName: string) => {
    setSelectedDesign(designName);
  }, []);

  const handleCloseModal = () => {
    setSelectedDesign(null);
    setPreSelectedPackageId(null);
  };

  const handleCompleteOrder = () => {
    setSelectedDesign(null);
    setPreSelectedPackageId(null);
    setSearchQuery('');
    setActiveTab('personajes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOfferClick = () => {
    setPreSelectedPackageId('adhesivas-premium');
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div
      className="min-h-screen flex flex-col font-['Fredoka',_sans-serif] relative overflow-hidden"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'linear-gradient(#bae6fd 1px, transparent 1px), linear-gradient(90deg, #bae6fd 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        backgroundPosition: 'center top'
      }}
    >
      <BackgroundDecorations />

      {/* ═══ URGENCY BAR ═══ */}
      <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border-b border-amber-200 text-center py-2 px-4 z-20">
        <p className="text-[11px] sm:text-sm font-bold text-amber-800 flex items-center justify-center gap-2 flex-wrap">
          <span>🎒</span>
          <span className="hidden sm:inline">Temporada Regreso a Clases ·</span>
          <span>Apartas con 50%</span>
          <span className="text-amber-400">·</span>
          <span>5-7 días hábiles</span>
          <span className="text-amber-400">·</span>
          <span>Envíos a todo México</span>
        </p>
      </div>

      {/* ═══ HERO ═══ */}
      <header className="relative bg-white/70 backdrop-blur-md shadow-sm border-b-4 border-yellow-400 z-10">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 sm:px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-3 leading-tight"
          >
            🎒 Etiquetas Escolares 2026
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-500 mb-8 max-w-lg mx-auto"
          >
            Elige el personaje favorito de tu peque, ponemos su nombre y listo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <button
              onClick={scrollToCatalog}
              className="w-full sm:w-auto px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-105 text-base"
            >
              Ver diseños
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Quiero etiquetas escolares personalizadas 🎒')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-105 text-base flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Pedir por WhatsApp
            </a>
          </motion.div>
        </div>
      </header>

      {/* ═══ OFERTA DE TEMPORADA ═══ */}
      <div className="max-w-4xl mx-auto px-4 -mt-2 z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleOfferClick}
          className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 border-2 border-pink-200 rounded-2xl p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:border-pink-300 transition-all text-center group"
        >
          <p className="text-sm sm:text-base font-extrabold text-gray-800 mb-1">
            🔥 Oferta Regreso a Clases · 2 paquetes Premium = <span className="text-pink-500">$650</span>
            <span className="text-xs text-gray-400 line-through ml-1">$720</span>
            <span className="text-xs font-bold text-green-600 ml-1">(ahorras $70)</span>
          </p>
          <p className="text-xs text-gray-500">Ideal para hermanos, primos o regalar — toca aquí y elige Premium al buscar tu diseño</p>
        </motion.div>
      </div>

      {/* ═══ CATALOG SECTION ═══ */}
      <section ref={catalogSectionRef} className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full scroll-mt-24 z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">🎨 Elige tu diseño favorito</h2>
          <p className="text-sm sm:text-base text-gray-500">282 diseños disponibles · Busca entre personajes, siluetas y estilos</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder='¿Buscas a Bluey, Stitch, Mario Bros...?'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl text-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all shadow-sm outline-none bg-white placeholder:text-gray-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-start sm:justify-center gap-2 sm:gap-4 flex-nowrap overflow-x-auto pb-4 snap-x no-scrollbar">
          <button
            onClick={() => setActiveTab('personajes')}
            className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
              activeTab === 'personajes'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white text-gray-500 border-2 border-purple-100 hover:border-purple-300'
            }`}
          >
            Personajes
          </button>
          <button
            onClick={() => setActiveTab('siluetas_nina')}
            className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
              activeTab === 'siluetas_nina'
                ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-white text-gray-500 border-2 border-pink-100 hover:border-pink-300'
            }`}
          >
            Siluetas Niñas
          </button>
          <button
            onClick={() => setActiveTab('siluetas_nino')}
            className={`flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full font-bold text-sm sm:text-base transition-all transform hover:scale-105 snap-center ${
              activeTab === 'siluetas_nino'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-gray-500 border-2 border-blue-100 hover:border-blue-300'
            }`}
          >
            Siluetas Niños
          </button>
        </div>

        <DesignGrid
          designs={filteredDesigns}
          activeTab={activeTab}
          onSelectDesign={handleOpenModal}
          whatsappNumber={WHATSAPP_NUMBER}
        />

        {/* ¿No viste tu personaje? */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4 text-sm text-purple-800">
            <span className="text-xl">✨</span>
            <span>¿Buscas un personaje que no viste? Te lo diseñamos sin costo extra.</span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Busco un personaje que no vi en el catálogo, ¿me lo pueden diseñar?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-sm text-xs"
            >💬 Escríbenos</a>
          </div>
        </div>
      </section>

      {/* ═══ MUESTRA DIGITAL GRATUITA ═══ */}
      <div className="max-w-3xl mx-auto px-4 my-12 z-10">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 text-center">
          <p className="text-3xl mb-3">🎨</p>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">¿Quieres ver cómo quedaría?</h3>
          <p className="text-sm sm:text-base text-gray-500 mb-5 max-w-md mx-auto">
            Te enviamos una muestra digital de tu diseño antes de imprimir. Sin costo, sin compromiso.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Me gustaría ver una muestra digital de un diseño de etiqueta escolar 🎨')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-sm"
          >
            Pedir muestra por WhatsApp
          </a>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-white border-t-4 border-yellow-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent mb-3">
              🎒 Etiquetas Escolares 2026
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Etiquetas 100% personalizadas y lavables para que los útiles de tus peques
              siempre regresen a casa. Diseños únicos, material de calidad y envíos a todo México.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-xs">Pagos y envíos</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="text-green-500 shrink-0">✓</span> Apartas con el 50% de anticipo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 shrink-0">✓</span> Pagas el resto al recibir
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 shrink-0">✓</span> Transferencia, depósito o efectivo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 shrink-0">✓</span> Envíos a toda la República
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500 shrink-0">✓</span> Producción personalizada: 5-7 días
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-4 uppercase tracking-wider text-xs">Contacto</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm shrink-0">💬</span>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors">
                  WhatsApp: {WHATSAPP_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-sm shrink-0">🎨</span>
                Diseños personalizados sin costo extra
              </li>
              <li className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-sm shrink-0">✨</span>
                Muestra digital gratis antes de imprimir
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 py-4 text-center">
          <p className="text-xs text-gray-400">
            Hecho con ❤️ para los peques del hogar · © {new Date().getFullYear()} · Diseñado por <span className="font-bold text-purple-500">IMAGINE &amp; STAMP</span>
          </p>
        </div>
      </footer>

      {/* ═══ ORDER MODAL ═══ */}
      <AnimatePresence>
        {selectedDesign && (
          <OrderModal
            design={selectedDesign}
            preSelectedPackageId={preSelectedPackageId}
            onClose={handleCloseModal}
            onComplete={handleCompleteOrder}
          />
        )}
      </AnimatePresence>

      {/* ═══ WHATSAPP FLOTANTE ═══ */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('¡Hola! Tengo una duda sobre las etiquetas escolares 🙋')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg shadow-green-500/30 hover:shadow-green-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        aria-label="Chatea por WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-8 sm:h-8 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          ¿Dudas? Te ayudamos
        </span>
      </a>
    </div>
  );
}
