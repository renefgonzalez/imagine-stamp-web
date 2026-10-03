// ── CustomizeModal — Bottom-sheet de personalización interactiva ─────────────
// Soporta: selector de tamaño, selección de salsa obligatoria con nivel de picante,
// dip artesanal, extras opcionales, choice de proteína e ingredientes para pizzetas.

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Plus, Minus, Flame, Sparkles, Check, AlertCircle, ShoppingBag
} from 'lucide-react';
import { Product } from '../types';
import { SALSAS, DIPS, TACO_EXTRAS, PIZZETA_INGREDIENTS } from '../config';

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
    image: string
  ) => void;
}

export default function CustomizeModal({ product, onClose, onAdd }: Props) {
  const [size, setSize] = useState(product.sizes?.[0]?.id ?? '');
  const [sauce, setSauce] = useState('');
  const [dip, setDip] = useState(product.needsSauce ? DIPS[0].name : '');
  const [extras, setExtras] = useState<string[]>([]);
  const [choice, setChoice] = useState(product.choices?.[0]?.id ?? '');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const sizes = product.sizes ?? [];
  const hasExtras = (product.extras ?? []).length > 0;
  const hasChoices = (product.choices ?? []).length > 0;
  const maxIngredients = product.ingredientPick ?? 0;
  const hasIngredients = maxIngredients > 0;

  const sizeObj = sizes.find((s) => s.id === size);
  const basePrice = sizeObj ? sizeObj.price : product.price;

  const extraTotal = hasExtras
    ? (product.extras ?? []).filter((e) => extras.includes(e.id)).reduce((acc, e) => acc + e.price, 0)
    : 0;

  const unitPrice = basePrice + extraTotal;
  const totalPrice = unitPrice * qty;

  const handleToggleExtra = (id: string) => {
    setExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const handleToggleIngredient = (name: string) => {
    setIngredients((prev) => {
      if (prev.includes(name)) return prev.filter((i) => i !== name);
      if (prev.length >= maxIngredients) return prev;
      return [...prev, name];
    });
  };

  const buildDetail = (): string => {
    const parts: string[] = [];
    if (sizes.length > 1 && sizeObj) parts.push(sizeObj.label);
    if (product.needsSauce && sauce) {
      const sauceObj = SALSAS.find((s) => s.id === sauce);
      if (sauceObj) parts.push(`Salsa: ${sauceObj.name}`);
    }
    if (product.needsSauce && dip) parts.push(`Dip: ${dip}`);
    if (hasChoices && choice) {
      const choiceObj = product.choices?.find((c) => c.id === choice);
      if (choiceObj) parts.push(choiceObj.label);
    }
    if (hasExtras && extras.length > 0) {
      extras.forEach((eid) => {
        const ext = (product.extras ?? (TACO_EXTRAS as any)).find((e: any) => e.id === eid);
        if (ext) parts.push(`+${ext.label}`);
      });
    }
    if (hasIngredients && ingredients.length > 0) {
      parts.push(`Ings: ${ingredients.join(', ')}`);
    }
    return parts.join(' · ');
  };

  const handleSubmit = () => {
    if (product.needsSauce && !sauce) {
      setError('Por favor elige una salsa para tus alitas/boneless');
      return;
    }
    if (product.needsSauce && !dip) {
      setError('Por favor elige un dip');
      return;
    }
    if (hasChoices && !choice) {
      setError('Elige una opción');
      return;
    }
    if (hasIngredients && ingredients.length === 0) {
      setError(`Elige hasta ${maxIngredients} ingredientes para tu pizzeta`);
      return;
    }
    setError('');

    const detail = buildDetail();
    const baseId = size ? `${product.id}|${size}` : product.id;
    const optsKey = [sauce, dip, ...extras.slice().sort(), choice, ...ingredients.slice().sort()]
      .filter(Boolean)
      .join('|');
    const lineId = `${baseId}||${optsKey}`;

    onAdd(lineId, product.id, product.name, detail, unitPrice, qty, product.image);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal / Sheet Container */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-lg bg-[#141312] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10"
      >
        {/* Header con imagen miniatura y título */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#191817] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-14 h-14 rounded-2xl object-cover border border-white/10"
            />
            <div>
              <span className="text-[10px] font-black tracking-wider uppercase text-[#FF4816] flex items-center gap-1">
                <Sparkles size={11} /> Personaliza tu orden
              </span>
              <h3 className="text-white font-black text-base sm:text-lg leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-zinc-400 font-bold mt-0.5">
                Desde <span className="text-[#FFB800]">${basePrice}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
          {/* Mensaje de error visual si falta algo */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-2"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* 1. Selector de Tamaño (si aplica) */}
          {sizes.length > 1 && (
            <div className="space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                1. Elige el tamaño <span className="text-[#FF4816]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSize(s.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      size === s.id
                        ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-lg shadow-[#FF4816]/10'
                        : 'bg-[#1A1918] border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{s.label}</span>
                      {size === s.id && <Check size={16} className="text-[#FF4816]" />}
                    </div>
                    {s.sublabel && (
                      <span className="text-[11px] text-zinc-400 mt-0.5">{s.sublabel}</span>
                    )}
                    <span className="font-black text-[#FFB800] text-sm mt-1.5">${s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Selector de Salsa para Alitas / Boneless */}
          {product.needsSauce && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Flame size={14} className="text-[#FF4816]" />
                  2. Elige tu Salsa <span className="text-[#FF4816]">*</span>
                </label>
                <span className="text-[10px] text-[#FF4816] font-bold">1 obligatoria</span>
              </div>
              <div className="space-y-2">
                {SALSAS.map((s) => {
                  const isSelected = sauce === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSauce(s.id);
                        setError('');
                      }}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#FF4816]/15 border-[#FF4816] shadow-md shadow-[#FF4816]/10'
                          : 'bg-[#1A1918] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              isSelected ? 'text-white' : 'text-zinc-200'
                            }`}
                          >
                            {s.name}
                          </span>
                          {/* Nivel de picante visual */}
                          {s.heat > 0 && (
                            <span className="text-[11px] font-bold text-red-400 flex items-center">
                              {'🌶️'.repeat(s.heat)}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{s.desc}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-[#FF4816] bg-[#FF4816] text-white'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Selector de Dip para Alitas / Boneless */}
          {product.needsSauce && (
            <div className="space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                3. Acompañamiento (Apio incluido + Dip) <span className="text-[#FF4816]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {DIPS.map((d) => {
                  const isSelected = dip === d.name;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDip(d.name)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#FF4816]/15 border-[#FF4816] text-white shadow-md shadow-[#FF4816]/10'
                          : 'bg-[#1A1918] border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{d.name}</span>
                        {isSelected && <Check size={14} className="text-[#FF4816]" />}
                      </div>
                      <span className="text-[10px] text-zinc-400 mt-1">{d.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Selector de Choices (ej. Camarón vs Arrachera en Quezadas) */}
          {hasChoices && (
            <div className="space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                Elige tu proteína <span className="text-[#FF4816]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {product.choices?.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setChoice(c.id)}
                    className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all ${
                      choice === c.id
                        ? 'bg-[#FF4816] text-white border-[#FF4816] shadow-lg shadow-[#FF4816]/20'
                        : 'bg-[#1A1918] border-white/5 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. Selector de Ingredientes (Pizzeta Al Gusto) */}
          {hasIngredients && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400">
                  Elige hasta {maxIngredients} ingredientes
                </label>
                <span className="text-xs text-[#FFB800] font-bold">
                  {ingredients.length}/{maxIngredients}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PIZZETA_INGREDIENTS.map((ing) => {
                  const isChecked = ingredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => handleToggleIngredient(ing)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-[#FF4816]/20 border-[#FF4816] text-white'
                          : 'bg-[#1A1918] border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-1">{ing}</span>
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          isChecked ? 'border-[#FF4816] bg-[#FF4816] text-white' : 'border-white/20'
                        }`}
                      >
                        {isChecked && <Check size={10} className="stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. Extras Opcionales (Tacos y Costras) */}
          {hasExtras && (
            <div className="space-y-2.5">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-400">
                ¿Deseas agregar algún extra?
              </label>
              <div className="space-y-2">
                {(product.extras ?? TACO_EXTRAS).map((extra) => {
                  const isChecked = extras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => handleToggleExtra(extra.id)}
                      className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-[#FF4816]/15 border-[#FF4816]'
                          : 'bg-[#1A1918] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isChecked ? 'border-[#FF4816] bg-[#FF4816] text-white' : 'border-white/20'
                          }`}
                        >
                          {isChecked && <Check size={11} className="stroke-[3]" />}
                        </div>
                        <span className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-zinc-300'}`}>
                          {extra.label}
                        </span>
                      </div>
                      <span className="text-xs font-black text-[#FFB800]">+${extra.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Cantidad */}
          <div className="p-3.5 rounded-2xl bg-[#1A1918] border border-white/5 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-300">
              Cantidad de órdenes
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 flex items-center justify-center font-bold transition-colors"
              >
                <Minus size={15} />
              </button>
              <span className="w-8 text-center text-sm font-black text-white">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-[#FF4816] hover:bg-[#FF5E31] text-white flex items-center justify-center font-bold transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Sticky con botón de agregar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#161514] flex items-center gap-3">
          <div className="pr-2">
            <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider block">
              Subtotal
            </span>
            <span className="text-xl font-black text-white">${totalPrice}</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FF4816] via-[#FF5E31] to-[#FF8C00] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-[#FF4816]/30 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Agregar al Carrito
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
