// ── Modal de Personalización Interactiva: Strong Gym Iron City ────────────────
// Bottom-sheet en móvil / modal centrado en desktop para elegir sabores, tamaños y extras

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Plus, Minus, Sparkles, Flame, Dumbbell } from 'lucide-react';
import { Product, CartItem, SizeOption, VariantOption, ExtraOption } from '../types';

interface Props {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: Omit<CartItem, 'lineId'>) => void;
}

export default function CustomizeModal({ product, isOpen, onClose, onAddToCart }: Props) {
  const [selectedSize, setSelectedSize] = useState<SizeOption | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<VariantOption | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Inicializar estado cuando se abre un producto
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : null);
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null);
      setSelectedExtras([]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  // Cálculo de precio unitario en vivo
  const basePrice = selectedSize ? selectedSize.price : product.price;
  const variantAdditional = selectedVariant?.price || 0;
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = basePrice + variantAdditional + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) return prev.filter((e) => e.id !== extra.id);
      return [...prev, extra];
    });
  };

  const handleConfirm = () => {
    // Generar detalle legible para ticket y WhatsApp
    const detailsParts: string[] = [];

    if (selectedSize) {
      detailsParts.push(`Presentación: ${selectedSize.label}`);
    }
    if (selectedVariant) {
      const title = product.variantTitle || 'Opción';
      detailsParts.push(`${title}: ${selectedVariant.name}`);
    }
    if (selectedExtras.length > 0) {
      detailsParts.push(`Extras: ${selectedExtras.map((e) => `+${e.label} ($${e.price})`).join(', ')}`);
    }

    const detail = detailsParts.length > 0 ? detailsParts.join(' | ') : 'Presentación estándar';

    onAddToCart({
      productId: product.id,
      name: product.name,
      category: product.category,
      detail,
      unitPrice,
      quantity,
      image: product.image,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop con blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal / Bottom Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:max-w-lg bg-[#141414] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden text-white"
          >
            {/* Header del Modal */}
            <div className="p-5 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#181818] to-[#121212]">
              <div className="pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-600/20 text-red-500 border border-red-600/30">
                    <Flame size={12} className="text-red-500" /> Personalizar
                  </span>
                  {product.servingInfo && (
                    <span className="text-[11px] text-gray-400 font-medium">
                      {product.servingInfo}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black tracking-wide text-white uppercase">{product.name}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{product.description}</p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-colors shrink-0"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1 divide-y divide-white/5">
              {/* 1. Selector de Tamaños / Presentaciones */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="pt-2 first:pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                      <Dumbbell size={14} /> Selecciona la Presentación *
                    </label>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      Obligatorio
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {product.sizes.map((size) => {
                      const isSelected = selectedSize?.id === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-red-600/15 border-red-500 text-white shadow-lg shadow-red-950/30'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected ? 'border-red-500 bg-red-600 text-white' : 'border-gray-500'
                              }`}
                            >
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                            <div>
                              <span className="text-sm font-bold tracking-wide">{size.label}</span>
                              {size.sublabel && (
                                <p className="text-[11px] text-gray-400 mt-0.5">{size.sublabel}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-black text-red-400">${size.price} MXN</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Selector de Sabores / Variantes */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                      <Sparkles size={14} /> {product.variantTitle || 'Elige tu Opción'} *
                    </label>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      Obligatorio
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-red-600/15 border-red-500 text-white shadow-md shadow-red-950/20'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                isSelected ? 'border-red-500 bg-red-600 text-white' : 'border-gray-500'
                              }`}
                            >
                              {isSelected && <Check size={10} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-semibold leading-snug">{v.name}</span>
                          </div>
                          {v.price && v.price > 0 && (
                            <span className="text-xs font-black text-red-400 shrink-0 ml-1">
                              +${v.price}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 3. Selector de Extras (Shakes, Nutrición) */}
              {product.extras && product.extras.length > 0 && (
                <div className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-1.5">
                      🔥 Potenciadores & Extras (Opcional)
                    </label>
                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      Elige los que quieras
                    </span>
                  </div>
                  <div className="space-y-2">
                    {product.extras.map((extra) => {
                      const isChecked = selectedExtras.some((e) => e.id === extra.id);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          onClick={() => toggleExtra(extra)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                            isChecked
                              ? 'bg-red-600/15 border-red-500 text-white shadow-md shadow-red-950/20'
                              : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isChecked ? 'bg-red-600 border-red-500 text-white' : 'border-gray-500'
                              }`}
                            >
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </div>
                            <span className="text-xs font-bold text-gray-200">{extra.label}</span>
                          </div>
                          <span className="text-xs font-black text-red-400">
                            {extra.price > 0 ? `+$${extra.price} MXN` : 'GRATIS'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Selector de Cantidad */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-300 block">
                    Cantidad
                  </span>
                  <span className="text-[11px] text-gray-500">¿Cuántos deseas agregar?</span>
                </div>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-1.5">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center text-sm font-black text-white">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Sticky con Precio Total y Botón */}
            <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E0E] flex items-center gap-4">
              <div className="shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  Total
                </span>
                <span className="text-xl font-black text-white tracking-tight">
                  ${totalPrice} <span className="text-xs font-bold text-red-500">MXN</span>
                </span>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 transition-all"
              >
                <span>Agregar al Carrito</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
