// ── CustomizeModal — Modal Bottom-Sheet de Personalización ─────────────────────
// La Cueva del Lobo · Alimentos, Cerveza & Aventura (Xochimilco)
// Selección de Tamaños (1L / ½L), Variantes de Carnes / Sabores, Salsas, Escarchados y Extras.

import { useState } from 'react';
import { motion } from 'motion/react';
import {
  X, Plus, Minus, Flame, Sparkles, Check, ShoppingBag, Beer, UtensilsCrossed
} from 'lucide-react';
import { Product, SizeOption } from '../types';
import { clientConfig } from '../config';

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
  const sizes: SizeOption[] =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : [{ id: 'estandar', label: 'Orden Estándar', price: product.price }];

  const [selectedSizeId, setSelectedSizeId] = useState<string>(sizes[0].id);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [selectedSalsaId, setSelectedSalsaId] = useState<string>(
    product.allowsSalsas ? clientConfig.salsas[0].id : ''
  );
  const [selectedEscarchadoId, setSelectedEscarchadoId] = useState<string>(
    product.allowsEscarchado ? clientConfig.escarchados[0].id : ''
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);

  const activeSize = sizes.find((s) => s.id === selectedSizeId) || sizes[0];
  let basePrice = activeSize.price;

  // Si hay variante con precio extra o específico
  const activeVariant = product.variants?.find((v) => v.id === selectedVariantId);
  if (activeVariant && activeVariant.price) {
    basePrice += activeVariant.price;
  }

  // Extras seleccionados
  const extrasTotal = (product.extras || [])
    .filter((ext) => selectedExtras.includes(ext.id))
    .reduce((sum, ext) => sum + ext.price, 0);

  const unitPrice = basePrice + extrasTotal;
  const totalPrice = unitPrice * qty;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const buildDetail = (): string => {
    const parts: string[] = [];

    // Tamaño si aplica más de uno
    if (sizes.length > 1) {
      parts.push(activeSize.label);
    }

    // Variante (proteína, carne o sabor)
    if (activeVariant) {
      parts.push(activeVariant.name);
    }

    // Escarchado
    if (product.allowsEscarchado && selectedEscarchadoId) {
      const esc = clientConfig.escarchados.find((e) => e.id === selectedEscarchadoId);
      if (esc) parts.push(`Escarchado: ${esc.label}`);
    }

    // Salsas
    if (product.allowsSalsas && selectedSalsaId) {
      const salsa = clientConfig.salsas.find((s) => s.id === selectedSalsaId);
      if (salsa) parts.push(`Salsa: ${salsa.label}`);
    }

    // Extras
    if (selectedExtras.length > 0) {
      const extraLabels = (product.extras || [])
        .filter((e) => selectedExtras.includes(e.id))
        .map((e) => e.label);
      parts.push(`Extras: ${extraLabels.join(', ')}`);
    }

    // Notas de preparación
    if (notes.trim()) {
      parts.push(`Nota: ${notes.trim()}`);
    }

    return parts.join(' · ') || 'Preparación Tradicional';
  };

  const handleConfirm = () => {
    const detail = buildDetail();
    const lineId = `${product.id}-${selectedSizeId}-${selectedVariantId || ''}-${selectedSalsaId}-${selectedEscarchadoId}-${selectedExtras.sort().join('_')}-${Date.now()}`;
    onAdd(lineId, product.id, product.name, detail, unitPrice, qty, product.image);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Sheet Content */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative z-10 w-full max-w-lg max-h-[92vh] flex flex-col bg-[#141210] border border-[#E08722]/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-white/10 bg-gradient-to-b from-[#1C1815] to-[#141210]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#E08722]/20 text-[#E08722] border border-[#E08722]/40">
              <Sparkles className="w-3 h-3" />
              Personaliza tu orden
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Tamaños si aplica (ej. 1 Litro vs ½ Litro) */}
          {sizes.length > 1 && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                <Beer className="w-4 h-4 text-[#E08722]" />
                Selecciona el Tamaño
              </label>
              <div className="grid grid-cols-2 gap-3">
                {sizes.map((sz) => {
                  const isSelected = sz.id === selectedSizeId;
                  return (
                    <button
                      key={sz.id}
                      type="button"
                      onClick={() => setSelectedSizeId(sz.id)}
                      className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'bg-[#E08722]/15 border-[#E08722] shadow-[0_0_15px_rgba(224,135,34,0.25)] text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#E08722] flex items-center justify-center text-black">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                      <span className="font-bold text-base">{sz.label}</span>
                      <span className="text-xs text-amber-400 font-extrabold mt-0.5">
                        ${sz.price} MXN
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variantes (Proteína / Guisado / Sabor de fruta) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                <UtensilsCrossed className="w-4 h-4 text-[#E08722]" />
                {product.variantTitle || 'Elige tu Opción / Sabor'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-[#E08722]/20 border-[#E08722] text-white shadow-[0_0_10px_rgba(224,135,34,0.2)]'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{v.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#E08722]" />}
                      </div>
                      {v.price && v.price > 0 ? (
                        <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                          +${v.price} MXN
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Escarchado para bebidas */}
          {product.allowsEscarchado && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#EA580C]" />
                Escarchado para tu Vaso
              </label>
              <div className="space-y-2">
                {clientConfig.escarchados.map((esc) => {
                  const isSelected = esc.id === selectedEscarchadoId;
                  return (
                    <button
                      key={esc.id}
                      type="button"
                      onClick={() => setSelectedEscarchadoId(esc.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'bg-[#E08722]/15 border-[#E08722] text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <span>{esc.label}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#E08722]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Salsas de la casa para antojitos */}
          {product.allowsSalsas && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#10B981]" />
                Salsa Artesanal de la Casa
              </label>
              <div className="space-y-2">
                {clientConfig.salsas.map((salsa) => {
                  const isSelected = salsa.id === selectedSalsaId;
                  return (
                    <button
                      key={salsa.id}
                      type="button"
                      onClick={() => setSelectedSalsaId(salsa.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'bg-[#10B981]/15 border-[#10B981] text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <span>{salsa.label}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#10B981]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Extras Opcionales */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-amber-300 uppercase tracking-wider">
                <Plus className="w-4 h-4 text-[#E08722]" />
                Complementos & Extras
              </label>
              <div className="space-y-2">
                {product.extras.map((ext) => {
                  const isChecked = selectedExtras.includes(ext.id);
                  return (
                    <button
                      key={ext.id}
                      type="button"
                      onClick={() => toggleExtra(ext.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${
                        isChecked
                          ? 'bg-[#E08722]/15 border-[#E08722] text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-300'
                      }`}
                    >
                      <span>{ext.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">+${ext.price}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-[#E08722] border-[#E08722] text-black'
                              : 'border-white/30'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notas para Barra / Cocina */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
              Instrucciones especiales para cocina / barra
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: bien dorado, sin cebolla, hielo ligero, limones aparte..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#E08722] focus:outline-none text-white text-sm placeholder-gray-500 transition-colors"
            />
          </div>
        </div>

        {/* Footer Fijo con Selector de Cantidad y Botón de Agregar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#171412] flex items-center gap-4">
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-white text-base">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3.5 px-5 rounded-xl font-black text-sm sm:text-base tracking-wide uppercase bg-gradient-to-r from-[#E08722] via-[#F59E0B] to-[#E08722] hover:brightness-110 active:scale-[0.98] text-black shadow-[0_0_20px_rgba(224,135,34,0.35)] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            <span>Agregar • ${totalPrice} MXN</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
