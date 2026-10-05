// ── CustomizeModal — Modal Bottom-Sheet de Personalización para Brothers Pizza ─────
// Selección fluida de Tamaño (Mediana / Grande / Pizzota), Orilla Rellena de Queso,
// Dips, Ingredientes a remover o añadir, y notas para cocina.

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Minus, Flame, Sparkles, Check, AlertCircle, ShoppingBag,
  Slice, Pizza, CheckCircle2
} from 'lucide-react';
import { Product, SizeOption } from '../types';
import { PIZZA_EXTRAS, AVAILABLE_INGREDIENTS } from '../config';

interface Props {
  product: Product;
  onClose: () => void;
  onAdd: (
    lineId: string,
    productId: string,
    name: string,
    detail: string,
    unitPrice: number,
    quantity: number,
    image?: string
  ) => void;
}

export default function CustomizeModal({ product, onClose, onAdd }: Props) {
  const sizes: SizeOption[] = product.sizes && product.sizes.length > 0
    ? product.sizes
    : [{ id: 'estandar', label: 'Estándar', price: product.price }];

  const [selectedSizeId, setSelectedSizeId] = useState<string>(sizes[0].id);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [chosenIngredients, setChosenIngredients] = useState<string[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const activeSize = sizes.find((s) => s.id === selectedSizeId) || sizes[0];
  const basePrice = activeSize.price;

  // Cálculo de extras
  const extrasTotal = PIZZA_EXTRAS
    .filter((ext) => selectedExtras.includes(ext.id))
    .reduce((sum, ext) => sum + ext.price, 0);

  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * qty;

  const toggleRemovedIngredient = (ing: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const toggleChosenIngredient = (ingName: string) => {
    setError('');
    const max = product.maxIngredients || 99;
    setChosenIngredients((prev) => {
      if (prev.includes(ingName)) {
        return prev.filter((i) => i !== ingName);
      }
      if (prev.length >= max) {
        setError(`Esta opción permite un máximo de ${max} ingrediente(s).`);
        return prev;
      }
      return [...prev, ingName];
    });
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const buildDetail = (): string => {
    const parts: string[] = [];

    // Tamaño y rebanadas
    if (sizes.length > 1) {
      parts.push(`${activeSize.label}${activeSize.slices ? ` (${activeSize.slices})` : ''}`);
    }

    // Ingredientes seleccionados (para Arma Tu Pizza o 1 Ingrediente)
    if (chosenIngredients.length > 0) {
      parts.push(`Ingredientes: ${chosenIngredients.join(', ')}`);
    }

    // Ingredientes retirados
    if (removedIngredients.length > 0) {
      parts.push(`Sin: ${removedIngredients.join(', ')}`);
    }

    // Extras seleccionados
    if (selectedExtras.length > 0) {
      const extraLabels = PIZZA_EXTRAS
        .filter((e) => selectedExtras.includes(e.id))
        .map((e) => e.label.replace(/^[^\w\s]+/, '').trim());
      parts.push(`+ ${extraLabels.join(', ')}`);
    }

    // Notas de cocina
    if (notes.trim()) {
      parts.push(`Nota: "${notes.trim()}"`);
    }

    return parts.join(' · ');
  };

  const handleConfirm = () => {
    // Validación para pizzas que requieren seleccionar ingredientes
    if (product.maxIngredients && product.maxIngredients > 0 && chosenIngredients.length === 0) {
      setError(`Por favor selecciona al menos 1 ingrediente.`);
      return;
    }

    const detail = buildDetail();
    const lineId = `${product.id}-${selectedSizeId}-${Date.now()}`;
    onAdd(lineId, product.id, product.name, detail, unitPrice, qty, product.image);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop con blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-[#141210] border-t sm:border border-[#F59E0B]/30 sm:rounded-3xl rounded-t-3xl shadow-2xl shadow-black overflow-hidden z-10"
        >
          {/* Header con gradiente */}
          <div className="relative p-5 pb-4 border-b border-white/10 bg-gradient-to-b from-[#1F1C18] to-[#141210]">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30 rounded-full flex items-center gap-1">
                <Pizza size={12} /> Personaliza tu Pizza
              </span>
              {product.badge && (
                <span className="px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider bg-[#E11D48]/20 text-[#FB7185] border border-[#E11D48]/30 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white tracking-wide">{product.name}</h3>
            <p className="text-xs text-white/60 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Cuerpo con Scroll */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-white text-sm custom-scrollbar">
            {/* Mensaje de error si aplica */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/60 border border-red-500/50 rounded-2xl flex items-center gap-2.5 text-xs text-red-200"
              >
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* SECCIÓN 1: Selección de Tamaño */}
            {sizes.length > 1 && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#F59E0B] mb-3 flex items-center gap-1.5">
                  <Slice size={14} /> Elige el Tamaño *
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {sizes.map((s) => {
                    const isSelected = selectedSizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSizeId(s.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#E11D48]/25 to-[#F59E0B]/15 border-[#F59E0B] shadow-md shadow-[#F59E0B]/10'
                            : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-[#F59E0B] bg-[#F59E0B] text-black'
                                : 'border-white/30 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check size={12} strokeWidth={3} />}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{s.label}</span>
                              {s.slices && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                                  {s.slices}
                                </span>
                              )}
                            </div>
                            {s.sublabel && (
                              <p className="text-xs text-white/50">{s.sublabel}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-[#F59E0B]">${s.price}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECCIÓN 2: Ingredientes para Arma Tu Pizza o 1 Ingrediente */}
            {product.maxIngredients && product.maxIngredients > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5">
                    <Sparkles size={14} /> Elige {product.maxIngredients === 1 ? '1 Ingrediente' : `hasta ${product.maxIngredients} Ingredientes`} *
                  </label>
                  <span className="text-xs text-white/50">
                    {chosenIngredients.length}/{product.maxIngredients}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_INGREDIENTS.map((ing) => {
                    const isChosen = chosenIngredients.includes(ing.name);
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => toggleChosenIngredient(ing.name)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          isChosen
                            ? 'bg-[#E11D48]/30 border-[#E11D48] text-white shadow-sm shadow-[#E11D48]/30'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/[0.08]'
                        }`}
                      >
                        <span className="truncate">{ing.name}</span>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                            isChosen ? 'border-[#E11D48] bg-[#E11D48] text-white' : 'border-white/20'
                          }`}
                        >
                          {isChosen && <Check size={10} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECCIÓN 3: Quitar ingredientes si ya vienen predefinidos */}
            {product.ingredientsList && product.ingredientsList.length > 0 && (
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-2 flex items-center gap-1.5">
                  <Slice size={13} /> ¿Deseas retirar algún ingrediente?
                </label>
                <p className="text-[11px] text-white/50 mb-2">
                  Toca para tachar lo que NO desees que lleve tu pizza:
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredientsList.map((ing) => {
                    const isRemoved = removedIngredients.includes(ing);
                    return (
                      <button
                        key={ing}
                        type="button"
                        onClick={() => toggleRemovedIngredient(ing)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          isRemoved
                            ? 'bg-red-500/20 text-red-300 border-red-500/50 line-through'
                            : 'bg-white/5 text-white/80 border-white/15 hover:bg-white/10'
                        }`}
                      >
                        <span>{ing}</span>
                        {isRemoved ? <X size={12} /> : <CheckCircle2 size={12} className="text-green-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SECCIÓN 4: Extras Premium (Orilla de Queso, Doble Mozzarella, Dips) */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#F59E0B] mb-2.5 flex items-center gap-1.5">
                <Flame size={14} /> ¡Sube de Nivel tu Pizza! (Opcional)
              </label>
              <div className="space-y-2">
                {PIZZA_EXTRAS.map((extra) => {
                  const isChecked = selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra.id)}
                      className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#F59E0B]/20 border-[#F59E0B] shadow-sm shadow-[#F59E0B]/20'
                          : 'bg-white/5 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                            isChecked ? 'border-[#F59E0B] bg-[#F59E0B] text-black' : 'border-white/20'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="font-semibold text-white text-xs">{extra.label}</span>
                      </div>
                      <span className="text-xs font-bold text-[#F59E0B]">+${extra.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 5: Notas para Cocina */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/70 mb-1.5">
                Instrucciones especiales para cocina
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Bien doradita, cortar en cuadros, masa delgada..."
                rows={2}
                maxLength={120}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F59E0B] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Footer Sticky de Acción */}
          <div className="p-4 border-t border-white/10 bg-[#161412] flex items-center gap-3">
            {/* Selector de Cantidad */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors disabled:opacity-30"
                disabled={qty <= 1}
                aria-label="Disminuir"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-black text-sm text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="p-2 hover:bg-white/10 rounded-xl text-white transition-colors"
                aria-label="Aumentar"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Botón de Agregar */}
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#E11D48] to-[#F59E0B] hover:from-[#BE123C] hover:to-[#D97706] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#E11D48]/30 flex items-center justify-between transition-all transform active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={16} /> Agregar al Pedido
              </span>
              <span className="text-sm font-black">${totalPrice}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
