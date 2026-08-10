// ── CustomizeModal — Bottom-sheet para personalización ──────────────────────
// Soporta: selector de tamaño (alitas/boneless), salsa (6 opciones con picante),
// dip (Ranch/Blue Cheese), extras (queso/aguacate +$15), choice (Camarón/Arrachera),
// y picker de ingredientes (Al Gusto, máx 2).

import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Minus, Flame, SlidersHorizontal } from 'lucide-react';
import { Product } from '../types';
import { SALSAS, DIPS, TACO_EXTRAS, PIZZETA_INGREDIENTS, clientConfig } from '../config';

interface Props {
  product: Product;
  onClose: () => void;
  onAdd: (lineId: string, productId: string, name: string, detail: string, unitPrice: number, quantity: number, image: string) => void;
}

const C = clientConfig.colors;

export default function CustomizeModal({ product, onClose, onAdd }: Props) {
  const [size, setSize] = useState(product.sizes?.[0].id ?? '');
  const [sauce, setSauce] = useState('');
  const [dip, setDip] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [choice, setChoice] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');

  const sizes = product.sizes ?? [];
  const hasExtras = (product.extras ?? []).length > 0;
  const hasChoices = (product.choices ?? []).length > 0;
  const hasIngredients = product.ingredientPick && product.ingredientPick > 0;
  const maxIngredients = product.ingredientPick ?? 0;

  const sizeObj = sizes.find(s => s.id === size);
  const basePrice = sizeObj ? sizeObj.price : product.price;

  const extraTotal = hasExtras
    ? (product.extras ?? []).filter(e => extras.includes(e.id)).reduce((s, e) => s + e.price, 0)
    : 0;
  const unitPrice = basePrice + extraTotal;
  const totalPrice = unitPrice * qty;

  const handleToggleExtra = (id: string) => {
    setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const handleToggleIngredient = (name: string) => {
    setIngredients(prev => {
      if (prev.includes(name)) return prev.filter(i => i !== name);
      if (prev.length >= maxIngredients) return prev;
      return [...prev, name];
    });
  };

  const buildDetail = (): string => {
    const parts: string[] = [];
    if (sizes.length > 1) parts.push(sizeObj?.label ?? '');
    if (product.needsSauce && sauce) parts.push(SALSAS.find(s => s.id === sauce)?.name ?? '');
    if (product.needsSauce && dip) parts.push(dip);
    if (hasChoices && choice) {
      const c = product.choices?.find(ch => ch.id === choice);
      if (c) parts.push(c.label);
    }
    if (hasExtras && extras.length > 0) {
      extras.forEach(eid => {
        const x = (product.extras ?? TACO_EXTRAS as any).find((e: any) => e.id === eid);
        if (x) parts.push(`+${x.label}`);
      });
    }
    if (hasIngredients && ingredients.length > 0) {
      parts.push(`Ing: ${ingredients.join(', ')}`);
    }
    return parts.join(' · ');
  };

  const handleSubmit = () => {
    if (product.needsSauce && !sauce) { setError('Elige una salsa'); return; }
    if (product.needsSauce && !dip) { setError('Elige un dip'); return; }
    if (hasChoices && !choice) { setError('Elige una opción'); return; }
    if (hasIngredients && ingredients.length === 0) { setError(`Elige hasta ${maxIngredients} ingredientes`); return; }
    setError('');

    const detail = buildDetail();
    const baseId = size ? `${product.id}|${size}` : product.id;
    const optsKey = [sauce, dip, ...extras.sort(), choice, ...ingredients.sort()].filter(Boolean).join('|');
    const lineId = `${baseId}||${optsKey}`;

    onAdd(lineId, product.id, product.name, detail, unitPrice, qty, product.image);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end md:items-center justify-center"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        className="relative w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-3xl max-h-[88dvh] overflow-y-auto shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 1rem)' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-zinc-100 px-5 py-4 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
              <img src={product.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-[#111113]">{product.name}</p>
              <p className="text-[11px] text-zinc-500 line-clamp-1">{product.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
            <X size={16} className="text-zinc-600" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* ── Tamaño ── */}
          {sizes.length > 1 && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Tamaño</label>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all active:scale-95"
                    style={{
                      borderColor: size === s.id ? C.secondary : '#e4e4e7',
                      backgroundColor: size === s.id ? `${C.secondary}10` : 'white',
                      color: size === s.id ? C.secondary : C.textSecondary,
                    }}
                  >
                    {s.label}
                    <span className={size === s.id ? `text-[${C.secondary}]` : 'text-zinc-400'}> — ${s.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Choice (Camarón/Arrachera) ── */}
          {hasChoices && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Opción</label>
              <div className="grid grid-cols-2 gap-3">
                {(product.choices ?? []).map(c => (
                  <button
                    key={c.id}
                    onClick={() => setChoice(c.id)}
                    className="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all active:scale-95"
                    style={{
                      borderColor: choice === c.id ? C.secondary : '#e4e4e7',
                      backgroundColor: choice === c.id ? `${C.secondary}10` : 'white',
                      color: choice === c.id ? C.secondary : C.textSecondary,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Salsa ── */}
          {product.needsSauce && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Salsa</label>
              <div className="grid grid-cols-3 gap-2">
                {SALSAS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSauce(s.id); setError(''); }}
                    className="py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all active:scale-95 flex flex-col items-center gap-1"
                    style={{
                      borderColor: sauce === s.id ? C.secondary : '#e4e4e7',
                      backgroundColor: sauce === s.id ? `${C.secondary}10` : 'white',
                      color: sauce === s.id ? C.secondary : C.textPrimary,
                    }}
                  >
                    {s.name}
                    <span className="flex gap-0.5">
                      {Array.from({ length: s.heat }).map((_, i) => (
                        <Flame key={i} size={9} className={s.heat >= 4 ? 'text-red-500' : s.heat >= 2 ? 'text-amber-500' : 'text-yellow-400'} />
                      ))}
                      {s.heat === 0 && <span className="text-[9px] text-zinc-300">sin picante</span>}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Dip ── */}
          {product.needsSauce && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Dip (va con apio)</label>
              <div className="grid grid-cols-2 gap-3">
                {DIPS.map(d => (
                  <button
                    key={d}
                    onClick={() => { setDip(d); setError(''); }}
                    className="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all active:scale-95"
                    style={{
                      borderColor: dip === d ? C.secondary : '#e4e4e7',
                      backgroundColor: dip === d ? `${C.secondary}10` : 'white',
                      color: dip === d ? C.secondary : C.textSecondary,
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Extras (Queso/Aguacate +$15) ── */}
          {hasExtras && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Extras</label>
              <div className="grid grid-cols-2 gap-3">
                {(product.extras ?? []).map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleToggleExtra(e.id)}
                    className="py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all active:scale-95 flex items-center justify-between"
                    style={{
                      borderColor: extras.includes(e.id) ? C.secondary : '#e4e4e7',
                      backgroundColor: extras.includes(e.id) ? `${C.secondary}10` : 'white',
                      color: extras.includes(e.id) ? C.secondary : C.textSecondary,
                    }}
                  >
                    <span>{e.label}</span>
                    <span className="text-xs opacity-70">+${e.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Ingredientes (Al Gusto, máx 2) ── */}
          {hasIngredients && (
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">
                Elige {maxIngredients} ingredientes ({ingredients.length}/{maxIngredients})
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PIZZETA_INGREDIENTS.map(ing => (
                  <button
                    key={ing}
                    onClick={() => handleToggleIngredient(ing)}
                    disabled={!ingredients.includes(ing) && ingredients.length >= maxIngredients}
                    className="py-2.5 px-2 rounded-xl border-2 text-[11px] font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: ingredients.includes(ing) ? C.secondary : '#e4e4e7',
                      backgroundColor: ingredients.includes(ing) ? `${C.secondary}10` : 'white',
                      color: ingredients.includes(ing) ? C.secondary : C.textSecondary,
                    }}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Cantidad ── */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 block">Cantidad</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl border-2 border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors active:scale-90"
              >
                <Minus size={16} className="text-zinc-700" />
              </button>
              <span className="text-lg font-black text-[#111113] w-8 text-center">{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-10 h-10 rounded-xl border-2 border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-colors active:scale-90"
              >
                <Plus size={16} className="text-zinc-700" />
              </button>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <p className="text-[#DC2626] text-xs font-bold bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}

          {/* ── CTA ── */}
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-2xl text-white font-black uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${C.secondary}, #b91c1c)`,
              boxShadow: `0 10px 30px -8px ${C.secondary}60`,
            }}
          >
            <SlidersHorizontal size={16} />
            Agregar — ${totalPrice}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
